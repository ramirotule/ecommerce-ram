// src/pages/Admin.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { normalizeName } from "../utils/normalizeName";
import { COLORS } from "../utils/colors";
import UploadPriceList from "../components/UploadPriceList";
import PriceSearch from "../components/PriceSearch";
import ProvidersManager from "../components/ProvidersManager";
import CategoriesManager from "../components/CategoriesManager";

const Admin = () => {
  const [archivo, setArchivo] = useState(null);
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [activeSection, setActiveSection] = useState('proveedores');
  const navigate = useNavigate();

  // Cargar productos automáticamente desde el JSON existente
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const response = await fetch("/productos_ram.json");
        if (response.ok) {
          const data = await response.json();
          // Soportar dos formatos: array directo o { productos: [...] }
          const rawList = Array.isArray(data) ? data : (data.productos || []);
          // Normalizar a formato interno esperado: { producto, precio_usd, categoria, imagen }
          const list = rawList.map(item => {
            if (item.producto) return item;
            return {
              producto: item.nombre || item.producto || item.name || '',
              precio_usd: item.precio || item.precio_usd || item.price || 0,
              categoria: item.categoria || item.categoria || 'OTROS',
              imagen: item.imagen || ''
            };
          });
          setProductos(list);
          console.log(`✅ Productos cargados automáticamente: ${list.length} productos`);
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

  /*
  const actualizarJSONAutomatico = async () => {
    // Funcionalidad temporalmente deshabilitada para evitar commits automáticos
    // Ver historial de cambios si necesitas restaurar esta función.
  };
  */

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
  /*
  const commitAutomaticoMain = async () => {
    // Commit automático a main deshabilitado temporalmente.
  };
  */
 
  return (
    <div style={{ 
      padding: '30px',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
      color: "black"
    }}>
      {/* Header con botón de logout y estadísticas */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        padding: '20px',
        background: 'rgba(255, 202, 9, 0.1)',
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
          {/* <button
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
          </button> */}

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
        background: 'rgb(255, 255, 255)',
        borderRadius: '15px',
        padding: '20px',
        backdropFilter: 'blur(10px)'
      }}>
      {/* Menu debajo del H2 (dentro del contenido principal) */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'black' }}>
<button onClick={() => setActiveSection('buscar')} style={{ textAlign: 'left', padding: 8, borderRadius: 8, background: activeSection === 'buscar' ? 'rgba(0,241,0,0.08)' : 'transparent' }}>Buscador</button>
          <button onClick={() => setActiveSection('proveedores')} style={{ textAlign: 'left', padding: 8, borderRadius: 8, background: activeSection === 'proveedores' ? 'rgba(0,241,0,0.08)' : 'transparent' }}>Proveedores</button>
          <button onClick={() => setActiveSection('categorias')} style={{ textAlign: 'left', padding: 8, borderRadius: 8, background: activeSection === 'categorias' ? 'rgba(0,241,0,0.08)' : 'transparent' }}>Categorías</button>
          <button onClick={() => setActiveSection('carga')} style={{ textAlign: 'left', padding: 8, borderRadius: 8, background: activeSection === 'carga' ? 'rgba(0,241,0,0.08)' : 'transparent' }}>Carga de precios</button>
          
        </div>
      </div>


      {/* Main area (secciones) */}
      <div>
        {activeSection === 'proveedores' && (
          <ProvidersManager onSelectProvider={(p) => alert(`Proveedor: ${p.name}`)} />
        )}

        {activeSection === 'categorias' && (
          <CategoriesManager />
        )}

        {activeSection === 'carga' && (
          <UploadPriceList onProvidersUpdate={(list) => setProveedores(list)} />
        )}

        {activeSection === 'buscar' && (
          <PriceSearch productos={productos} />
        )}
      </div>
     
          <div style={{ marginTop: '30px' }}>
          

            {/** Botón de actualización a GitHub deshabilitado temporalmente */}

            {/** Botón de commit a main deshabilitado temporalmente */}

            {/* <div style={{ 
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
            </h3> */}
            
            {/* <ul style={{
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
            </ul> */}
          </div>
      </div>
    </div>
  );
};

export default Admin;