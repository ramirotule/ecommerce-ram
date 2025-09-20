// src/pages/Admin.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { normalizeName } from "../utils/normalizeName";
import { COLORS } from "../utils/colors";

const Admin = () => {
  const [archivo, setArchivo] = useState(null);
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  // Cargar productos automáticamente desde el JSON existente
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const response = await fetch("/productos_ram.json");
        if (response.ok) {
          const data = await response.json();
          setProductos(data);
          console.log(`✅ Productos cargados automáticamente: ${data.length} productos`);
        }
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };
    
    cargarProductos();
  }, []);

  const handleLogout = () => {
    // Limpiar datos de autenticación
    localStorage.removeItem('isAdminAuthenticated');
    localStorage.removeItem('adminLoginTime');
    
    // Redirigir al login
    navigate('/login');
  };

  const handleArchivo = (e) => {
    const file = e.target.files[0];
    setArchivo(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const contenido = event.target.result;
      const productosProcesados = procesarTexto(contenido);
      setProductos(productosProcesados);
    };
    reader.readAsText(file);
  };

  const procesarTexto = (texto) => {
    const lineas = texto.split(/\r?\n/);
    const productos = [];

    for (let i = 0; i < lineas.length - 1; i++) {
      const linea = lineas[i];
      const siguiente = lineas[i + 1];

      if (linea && siguiente && siguiente.includes("U$S")) {
        const nombre = linea.trim();
        const precio = parseFloat(siguiente.replace(/[^0-9.]/g, ""));
        const imagen = normalizeName(nombre) + ".jpg";
        const categoria = detectarCategoria(nombre);

        productos.push({
          producto: nombre,
          precio_usd: precio,
          categoria,
          imagen,
        });
        i++; // saltar la línea del precio
      }
    }

    return productos;
  };

  const detectarCategoria = (nombre) => {
    const n = nombre.toLowerCase();
    if (n.includes("iphone")) return "IPHONE";
    if (n.includes("macbook")) return "MACBOOK";
    if (n.includes("ipad")) return "IPAD";
    if (n.includes("samsung")) return "SAMSUNG";
    if (n.includes("motorola")) return "MOTOROLA";
    if (n.includes("airpods")) return "AUDIO";
    if (n.includes("ps5") || n.includes("xbox") || n.includes("nintendo") || n.includes("joystick")) return "CONSOLA";
    if (n.includes("watch") || n.includes("series") || n.includes("ultra")) return "SMARTWATCH";
    if (n.includes("pencil") || n.includes("cargador")) return "ACCESORIO";
    if (n.includes("tv")) return "TV";
    return "OTROS";
  };

  const descargarJSON = () => {
    const blob = new Blob([JSON.stringify(productos, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "productos_ram.json";
    a.click();
  };

  const actualizarJSONAutomatico = async () => {
    const confirmacion = window.confirm(
      '¿Estás seguro de actualizar los productos en GitHub?\n\n' +
      'Esto actualizará el archivo y Vercel se redeplegará automáticamente.'
    );
    
    if (!confirmacion) return;

    try {
      // Primero intentar usar variable de entorno (más seguro)
      let githubToken = import.meta.env.VITE_GITHUB_TOKEN;
      
      // Si no hay variable de entorno, usar localStorage o pedir token
      if (!githubToken) {
        githubToken = localStorage.getItem('github_token');
        
        if (!githubToken) {
          githubToken = prompt(
            '🔑 Ingresa tu GitHub Personal Access Token:\n\n' +
            'IMPORTANTE: Nunca compartas este token públicamente\n\n' +
            'Si no tienes uno:\n' +
            '1. Ve a GitHub → Settings → Developer settings → Personal access tokens\n' +
            '2. Generate new token (classic)\n' +
            '3. Marca el scope "repo"\n' +
            '4. Copia y pega el token aquí'
          );
          
          if (!githubToken) {
            alert('❌ Token requerido para actualizar automáticamente');
            return;
          }
          
          // Preguntar si quiere guardar el token
          const guardarToken = window.confirm(
            '¿Quieres guardar el token en este navegador para futuras actualizaciones?\n\n' +
            '(Se guardará localmente y solo en este dispositivo)'
          );
          
          if (guardarToken) {
            localStorage.setItem('github_token', githubToken);
          }
        }
      }

      // Mostrar loading
      const loadingAlert = '⏳ Actualizando productos en GitHub...';
      console.log(loadingAlert);

console.log("El valor de los productos es:", productos);
      const jsonContent = JSON.stringify(productos, null, 2);
      console.log("el valor de jsonContent:",   jsonContent);
      const encodedContent = btoa(unescape(encodeURIComponent(jsonContent)));

      // Detectar la rama actual (dev o main)
      const currentBranch = 'dev'; // Cambia esto según tu rama principal

      // Primero obtener el SHA actual del archivo
      const getFileResponse = await fetch(
        `https://api.github.com/repos/ramirotule/ecommerce-ram/contents/public/productos_ram.json?ref=${currentBranch}`,
        {
          headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );

      let sha = null;
      if (getFileResponse.ok) {
        const fileData = await getFileResponse.json();
        sha = fileData.sha;
      } else if (getFileResponse.status === 404) {
        // El archivo no existe, se creará
        console.log('Archivo no existe, se creará uno nuevo');
      } else {
        throw new Error(`Error al obtener archivo: ${getFileResponse.status}`);
      }

      // Actualizar o crear el archivo
      const updateResponse = await fetch(
        'https://api.github.com/repos/ramirotule/ecommerce-ram/contents/public/productos_ram.json',
        {
          method: 'PUT',
          headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: `📦 Actualizar productos desde Admin (${productos.length} productos) - ${new Date().toLocaleString('es-AR')}`,
            content: encodedContent,
            ...(sha && { sha }), // Solo incluir SHA si existe
            branch: currentBranch
          })
        }
      );

      if (updateResponse.ok) {
        const result = await updateResponse.json();
        alert(
          `✅ ¡Productos actualizados exitosamente!\n\n` +
          `📊 ${productos.length} productos actualizados\n` +
          `🌐 Vercel se redeplegará automáticamente en unos minutos\n` +
          `🔗 Commit: ${result.commit.html_url}`
        );
        
        // Opcional: Abrir el commit en una nueva ventana
        const abrirCommit = window.confirm('¿Quieres ver el commit en GitHub?');
        if (abrirCommit) {
          window.open(result.commit.html_url, '_blank');
        }
      } else {
        const error = await updateResponse.json();
        console.error('Error response:', error);
        
        if (updateResponse.status === 401) {
          // Token inválido
          localStorage.removeItem('github_token');
          alert('❌ Token inválido o expirado. Se ha eliminado el token guardado.\n\nIntenta nuevamente con un nuevo token.');
        } else {
          alert(`❌ Error al actualizar: ${error.message || 'Error desconocido'}\n\nDescargando JSON como respaldo...`);
          descargarJSON(); // Fallback
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert(
        `❌ Error de conexión: ${error.message}\n\n` +
        'Descargando JSON como respaldo...'
      );
      descargarJSON(); // Fallback
    }
  };

  const gestionarToken = () => {
    const tokenGuardado = localStorage.getItem('github_token');
    
    if (tokenGuardado) {
      const eliminar = window.confirm(
        '🔑 Hay un token de GitHub guardado.\n\n' +
        '¿Qué quieres hacer?\n\n' +
        'OK = Eliminar token guardado\n' +
        'Cancelar = Mantener token'
      );
      
      if (eliminar) {
        localStorage.removeItem('github_token');
        alert('✅ Token eliminado. Se te pedirá uno nuevo en la próxima actualización.');
      }
    } else {
      const nuevoToken = prompt(
        '🔑 Ingresa tu GitHub Personal Access Token:\n\n' +
        'IMPORTANTE: Nunca compartas este token públicamente\n\n' +
        'Si no tienes uno:\n' +
        '1. Ve a GitHub → Settings → Developer settings → Personal access tokens\n' +
        '2. Generate new token (classic)\n' +
        '3. Marca el scope "repo"\n' +
        '4. Copia y pega el token aquí'
      );
      
      if (nuevoToken) {
        localStorage.setItem('github_token', nuevoToken);
        alert('✅ Token guardado correctamente.');
      }
    }
  };

  const commitAutomaticoMain = async () => {
    const fechaHoy = new Date().toLocaleDateString('es-AR');
    const confirmacion = window.confirm(
      '¿Estás seguro de hacer commit del archivo productos_ram.json actualizado?\n\n' +
      'Esto hará commit del archivo que tu script de Python actualizó automáticamente.\n' +
      `Mensaje del commit: "Actualización de productos - ${fechaHoy}"\n\n` +
      'Se subirá a la rama main y activará GitHub Actions.'
    );
    
    if (!confirmacion) return;

    try {
      // Obtener el token de GitHub
      let githubToken = import.meta.env.VITE_GITHUB_TOKEN;
      
      if (!githubToken) {
        githubToken = localStorage.getItem('github_token');
        
        if (!githubToken) {
          githubToken = prompt(
            '🔑 Ingresa tu GitHub Personal Access Token:\n\n' +
            'IMPORTANTE: Necesitas permisos de "repo" para hacer commits\n\n' +
            'Si no tienes uno:\n' +
            '1. Ve a GitHub → Settings → Developer settings → Personal access tokens\n' +
            '2. Generate new token (classic)\n' +
            '3. Marca el scope "repo"\n' +
            '4. Copia y pega el token aquí'
          );
          
          if (!githubToken) {
            alert('❌ Token requerido para hacer commit automático');
            return;
          }
          
          const guardarToken = window.confirm('¿Quieres guardar el token para futuras operaciones?');
          if (guardarToken) {
            localStorage.setItem('github_token', githubToken);
          }
        }
      }

      alert('⏳ Haciendo commit del archivo productos_ram.json actualizado...');

      // Leer el archivo productos_ram.json actual
      const response = await fetch("/productos_ram.json");
      if (!response.ok) {
        throw new Error('No se pudo leer el archivo productos_ram.json');
      }
      const productosData = await response.json();
      const jsonContent = JSON.stringify(productosData, null, 2);
      const encodedContent = btoa(unescape(encodeURIComponent(jsonContent)));

      // Obtener el SHA actual del archivo en main
      const getFileResponse = await fetch(
        'https://api.github.com/repos/ramirotule/ecommerce-ram/contents/public/productos_ram.json?ref=main',
        {
          headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );

      let sha = null;
      if (getFileResponse.ok) {
        const fileData = await getFileResponse.json();
        sha = fileData.sha;
      } else if (getFileResponse.status === 404) {
        console.log('Archivo no existe en main, se creará uno nuevo');
      } else {
        throw new Error(`Error al obtener archivo: ${getFileResponse.status}`);
      }

      // Actualizar el archivo en main
      const commitMessage = `Actualización de productos - ${fechaHoy}`;
      const updateResponse = await fetch(
        'https://api.github.com/repos/ramirotule/ecommerce-ram/contents/public/productos_ram.json',
        {
          method: 'PUT',
          headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: commitMessage,
            content: encodedContent,
            ...(sha && { sha }),
            branch: 'main'
          })
        }
      );

      if (updateResponse.ok) {
        const result = await updateResponse.json();
        
        // Actualizar el estado local con los datos más recientes
        setProductos(productosData);
        
        alert(
          `✅ ¡Archivo productos_ram.json actualizado en main!\n\n` +
          `📝 Mensaje: "${commitMessage}"\n` +
          `📊 ${productosData.length} productos\n` +
          `🔗 Commit: ${result.commit.html_url}\n` +
          `🚀 GitHub Actions se ejecutará automáticamente`
        );

        const abrirCommit = window.confirm('¿Quieres ver el commit en GitHub?');
        if (abrirCommit) {
          window.open(result.commit.html_url, '_blank');
        }
      } else {
        const error = await updateResponse.json();
        throw new Error(`Error al actualizar: ${error.message || 'Error desconocido'}`);
      }

    } catch (error) {
      console.error('Error:', error);
      alert(`❌ Error al crear commit: ${error.message}`);
    }
  };
 
  return (
    <div style={{ 
      padding: '30px',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
      color: COLORS.text.white
    }}>
      {/* Header con botón de logout y estadísticas */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        padding: '20px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '15px',
        backdropFilter: 'blur(10px)',
        gap: '20px'
      }}>
        <h2 style={{
          margin: 0,
          color: '#00F100',
          fontSize: '24px',
          fontWeight: '700'
        }}>
          🛠 Panel de Administración
        </h2>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={gestionarToken}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #5b7c99 0%, #4a69bd 100%)',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 5px 15px rgba(74, 105, 189, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            🔑 Gestionar Token
          </button>

          <button
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #ff4757 0%, #ff3742 100%)',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 5px 15px rgba(255, 71, 87, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            🔓 Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '15px',
        padding: '20px',
        backdropFilter: 'blur(10px)'
      }}>
     
          <div style={{ marginTop: '30px' }}>
          

            <button 
              onClick={actualizarJSONAutomatico}
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                color: '#fff',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                marginBottom: '20px',
                marginRight: '15px',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 5px 15px rgba(255, 107, 53, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              🔄 Actualizar GitHub (Automático)
            </button>

            <button 
              onClick={commitAutomaticoMain}
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #8e44ad 0%, #9b59b6 100%)',
                color: '#fff',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                marginBottom: '20px',
                marginRight: '15px',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 5px 15px rgba(142, 68, 173, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              🚀 Commit a Main + GitHub Actions
            </button>

            <div style={{ 
              background: 'rgba(0, 241, 0, 0.1)', 
              border: '1px solid rgba(0, 241, 0, 0.3)',
              borderRadius: '8px', 
              padding: '15px', 
              marginBottom: '20px',
              color: '#00F100'
            }}>
              <strong>🚀 GitHub API - Opciones de Actualización:</strong><br/>
              <br/>
              <strong>🔧 Configuración inicial:</strong><br/>
              1. Click en "🔑 Gestionar Token" (arriba) para guardar tu GitHub token<br/>
              2. Una vez configurado, tienes 3 opciones:<br/>
              <br/>
              <strong>📋 Opciones disponibles:</strong><br/>
              • <strong>📥 Descargar JSON:</strong> Descarga el archivo para revisión manual<br/>
              • <strong>🔄 Actualizar GitHub:</strong> Sube cambios a la rama dev (desarrollo)<br/>
              • <strong>🚀 Commit a Main:</strong> Crea commit en rama main y activa GitHub Actions<br/>
              <br/>
              <strong>💡 Flujo recomendado:</strong><br/>
              1. Usar "🔄 Actualizar GitHub" para pruebas en dev<br/>
              2. Usar "🚀 Commit a Main" para despliegue final<br/>
              <br/>
              <small>💡 El token se guarda localmente y es seguro</small>
            </div>
            
            <h3 style={{ color: '#00F100', marginBottom: '15px' }}>
              🧾 Productos procesados ({productos.length}):
            </h3>
            
            <ul style={{
              listStyle: 'none',
              padding: 0,
              maxHeight: '400px',
              overflowY: 'auto'
            }}>
              {productos.map((p, idx) => (
                <li key={idx} style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  margin: '10px 0',
                  padding: '15px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <strong style={{ color: '#00F100' }}>{p.producto}</strong>
                  <br />
                  <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    💰 U$S {p.precio_usd} | 📂 {p.categoria} | 🖼️ {p.imagen}
                  </span>
                </li>
              ))}
            </ul>
          </div>
      </div>
    </div>
  );
};

export default Admin;