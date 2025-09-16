// src/pages/Admin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { normalizeName } from "../utils/normalizeName";
import { COLORS } from "../utils/colors";

const Admin = () => {
  const [archivo, setArchivo] = useState(null);
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

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
          � Cerrar Sesión
        </button>
      </div>

      {/* Contenido principal */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '15px',
        padding: '20px',
        backdropFilter: 'blur(10px)'
      }}>
        <h3 style={{ color: COLORS.text.white, marginBottom: '20px' }}>
          📁 Cargar archivo de productos
        </h3>
        
        <input 
          type="file" 
          accept=".txt" 
          onChange={handleArchivo}
          style={{
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            background: 'rgba(255, 255, 255, 0.1)',
            color: COLORS.text.white,
            cursor: 'pointer'
          }}
        />
        
        {productos.length > 0 && (
          <div style={{ marginTop: '30px' }}>
            <button 
              onClick={descargarJSON}
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #00F100 0%, #00cc00 100%)',
                color: '#000',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                marginBottom: '20px',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 5px 15px rgba(0, 241, 0, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              📥 Descargar JSON
            </button>
            
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
        )}
      </div>
    </div>
  );
};

export default Admin;
