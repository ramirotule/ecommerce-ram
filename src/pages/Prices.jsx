import React, { useState, useEffect } from "react";
import { COLORS } from '../utils/colors';
import { AiOutlineDownload } from "react-icons/ai";
import Select from 'react-select';

// Ruta del PDF para descarga
const pdfFile = "/precios_ram.pdf";

const Prices = () => {
  // Tabla interactiva
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("TODOS");
  const [orden, setOrden] = useState("categoria_az"); // nuevo valor por defecto
  const [sortBy, setSortBy] = useState('categoria'); // por defecto categoría
  const [sortDir, setSortDir] = useState('asc'); // por defecto ascendente
  const [dolarBlue, setDolarBlue] = useState(null);
  const [ultimaActualizacion, setUltimaActualizacion] = useState(null);

  useEffect(() => {
    fetch("/productos_ram.json")
      .then(res => {
        // Obtener la fecha de última modificación del header
        const lastModified = res.headers.get('Last-Modified');
        if (lastModified) {
          setUltimaActualizacion(new Date(lastModified));
        }
        return res.json();
      })
      .then(data => setProductos(data));
  }, []);

  useEffect(() => {
    fetch('https://dolarapi.com/v1/dolares/blue')
      .then(res => res.json())
      .then(data => setDolarBlue(data.venta))
      .catch(() => setDolarBlue(null));
  }, []);

  const categorias = ["TODOS", ...Array.from(new Set(productos.map(p => p.categoria)))];

  // Función para borrar filtros
  const resetFiltros = () => {
    setBusqueda("");
    setCategoria("TODOS");
    setOrden("categoria_az");
    setSortBy('categoria');
    setSortDir('asc');
  };

  let filtrados = productos.filter(p => {
    const categoriaMatch = categoria === "TODOS" || p.categoria === categoria;
    const busquedaMatch = p.producto.toLowerCase().includes(busqueda.toLowerCase());
    return categoriaMatch && busquedaMatch;
  });

  // Ordenamiento interactivo
  if (sortBy) {
    filtrados.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      if (sortBy === 'producto' || sortBy === 'categoria') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
        if (valA < valB) return sortDir === 'asc' ? -1 : 1;
        if (valA > valB) return sortDir === 'asc' ? 1 : -1;
        return 0;
      } else {
        // precio_usd
        return sortDir === 'asc' ? valA - valB : valB - valA;
      }
    });
  } else {
    // Si no hay sortBy, usar el orden por el select
    if (orden === "categoria_az") {
      filtrados.sort((a, b) => {
        // Primero por categoría A-Z, luego por producto A-Z
        if (a.categoria.toLowerCase() < b.categoria.toLowerCase()) return -1;
        if (a.categoria.toLowerCase() > b.categoria.toLowerCase()) return 1;
        // Si la categoría es igual, ordenar por producto A-Z
        if (a.producto.toLowerCase() < b.producto.toLowerCase()) return -1;
        if (a.producto.toLowerCase() > b.producto.toLowerCase()) return 1;
        return 0;
      });
    }
    if (orden === "precio_asc") filtrados.sort((a, b) => a.precio_usd - b.precio_usd);
    if (orden === "precio_desc") filtrados.sort((a, b) => b.precio_usd - a.precio_usd);
  }

  const handleDownload = () => {
    // Crear un enlace temporal para descargar el PDF
    const link = document.createElement('a');
    link.href = pdfFile;
    link.download = 'RAM_Informatica_Lista_Precios.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Opciones para react-select
  const categoriaOptions = [{ value: 'TODOS', label: 'TODOS' }, ...categorias.slice(1).map(cat => ({ value: cat, label: cat }))];
  const ordenOptions = [
    { value: 'categoria_az', label: 'Categoría: A-Z' },
    { value: 'precio_asc', label: 'Precio: Menor a Mayor' },
    { value: 'precio_desc', label: 'Precio: Mayor a Menor' }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'white',
      padding: '40px 0',
      color: COLORS.text.white
    }}>
      <div style={{
        width: '100%',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        {/* Header Section */}
        <div style={{
          textAlign: 'left',
          marginBottom: '40px',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <h1 style={{
            fontSize: '55px',
            fontWeight: '700',
            color: 'black',
            textShadow: '0 2px 4px rgba(0,241,0,0.3)',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            letterSpacing: '2px',
            margin: '0 0 20px 0',
            textAlign: 'left' 
          }}>
            📋 Lista de Precios
          </h1>
          
             {/* Información de última actualización */}
          {ultimaActualizacion && (
            <div style={{
              padding: '12px 20px',
              background: 'linear-gradient(135deg, rgba(0, 241, 0, 0.1) 0%, rgba(0, 204, 0, 0.05) 100%)',
              border: '1px solid rgba(0, 241, 0, 0.3)',
              borderRadius: '12px',
              marginBottom: '20px',
              width: 'fit-content',
            }}>
              <p style={{
                margin: 0,
                fontSize: '14px',
                color: 'rgba(0, 0, 0, 0.8)',
                fontWeight: '500'
              }}>
                <span style={{ color: '#00aa00', fontWeight: '600' }}>✅ Última actualización:</span>{' '}
                {ultimaActualizacion.toLocaleDateString('es-AR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}{' '}
                a las {ultimaActualizacion.toLocaleTimeString('es-AR', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          )}

       

          {/* Botón de descarga principal */}
          <button
            onClick={handleDownload}
            style={{
              padding: '15px 30px',
              borderRadius: '25px',
              border: 'none',
              background: 'linear-gradient(135deg, #00F100 0%, #00cc00 100%)',
              color: '#000',
              fontSize: '18px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 5px 15px rgba(0, 241, 0, 0.3)',
                            width: 'fit-content',

              
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 8px 25px rgba(0, 241, 0, 0.5)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 5px 15px rgba(0, 241, 0, 0.3)';
            }}
          >
            <AiOutlineDownload size={20} />
            Descargar Lista de Precios PDF
          </button>
        </div>


        {/* Información adicional */}
        <div style={{
          textAlign: 'center',
          marginTop: '30px',
          padding: '20px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '10px'
        }}>
          <p style={{
            color: 'rgba(0, 0, 0, 0.7)',
            fontSize: '21px',
            margin: 0
          }}>
            💡 Los precios están <strong>sujetos a cambios</strong> sin previo aviso. 
            Para consultas específicas, contactanos por WhatsApp.
          </p>
        </div>

        {/* Tabla interactiva de productos */}
        <div style={{
          background: 'rgba(255,255,255,0.8)',
          borderRadius: '20px',
          boxShadow: COLORS.shadow.lg,
          padding: '30px',
          color: '#222',
          
        }}>
          <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '20px', color: '#000000', textAlign: 'left' }}>
            Buscar y Filtrar Productos
          </h2>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <input
              type="text"
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre..."
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc', minWidth: '220px', fontSize: '16px' }}
            />
            <div style={{ minWidth: '220px', flex: 1 }}>
              <Select
                options={categoriaOptions}
                value={categoriaOptions.find(opt => opt.value === categoria)}
                onChange={opt => setCategoria(opt.value)}
                placeholder="Filtrar por categoría..."
                styles={{
                  control: (base) => ({ ...base, borderRadius: 8, borderColor: '#ccc', fontSize: 16, minHeight: 44 }),
                  menu: (base) => ({ ...base, borderRadius: 8 }),
                  singleValue: (base) => ({ ...base, color: '#111' }), // color negro al seleccionar
                  option: (base, state) => ({
                    ...base,
                    color: '#111',
                    backgroundColor: state.isSelected ? '#e0e0e0' : state.isFocused ? '#f4f6f8' : '#fff',
                  }),
                }}
                theme={theme => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    primary: '#e0e0e0', // gris claro al seleccionar
                    primary25: '#f4f6f8', // gris muy claro al hover
                    neutral0: '#fff', // fondo blanco
                    neutral20: '#ccc', // borde
                    neutral30: '#aaa', // borde hover
                  },
                })}
              />
            </div>
            <div style={{ minWidth: '220px', flex: 1 }}>
              <Select
                options={ordenOptions}
                value={ordenOptions.find(opt => opt.value === orden)}
                onChange={opt => {
                  setOrden(opt.value);
                  setSortBy(''); // resetear sortBy para que funcione el select
                  setSortDir('asc'); // por defecto ascendente
                }}
                placeholder="Ordenar por..."
                styles={{
                  control: (base) => ({ ...base, borderRadius: 8, borderColor: '#ccc', fontSize: 16, minHeight: 44 }),
                  menu: (base) => ({ ...base, borderRadius: 8 }),
                  singleValue: (base) => ({ ...base, color: '#111' }), // color negro al seleccionar
                  option: (base, state) => ({
                    ...base,
                    color: '#111',
                    backgroundColor: state.isSelected ? '#e0e0e0' : state.isFocused ? '#f4f6f8' : '#fff',
                  }),
                }}
                theme={theme => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    primary: '#e0e0e0',
                    primary25: '#f4f6f8',
                    neutral0: '#fff',
                    neutral20: '#ccc',
                    neutral30: '#aaa',
                  },
                })}
              />
            </div>
            <button
              onClick={resetFiltros}
              style={{
                padding: '12px 28px',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #e0e0e0 0%, #00F100 100%)',
                color: '#222',
                fontWeight: '700',
                fontSize: '16px',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,241,0,0.08)',
                marginLeft: '10px',
                transition: 'all 0.2s',
              }}
            >
              Borrar filtros
            </button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '15px', tableLayout: 'fixed' }}>
              <colgroup>
                <col style={{ width: '40%' }} />
                <col style={{ width: '25%' }} />
                <col style={{ width: '17.5%' }} />
                <col style={{ width: '17.5%' }} />
              </colgroup>
              <thead>
                <tr style={{ background: '#f4f6f8', color: '#222', borderBottom: '2px solid #e0e0e0' }}>
                  <th
                    style={{ padding: '10px', borderRadius: '8px 0 0 8px', fontWeight: '700', letterSpacing: '0.5px', textAlign: 'left', cursor: 'pointer', userSelect: 'none' }}
                    onClick={() => {
                      if (sortBy === 'producto') setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
                      setSortBy('producto');
                    }}
                  >
                    Producto {sortBy === 'producto' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                  </th>
                  <th
                    style={{ padding: '10px', fontWeight: '700', letterSpacing: '0.5px', textAlign: 'left', cursor: 'pointer', userSelect: 'none' }}
                    onClick={() => {
                      if (sortBy === 'categoria') setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
                      setSortBy('categoria');
                    }}
                  >
                    Categoría {sortBy === 'categoria' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                  </th>
                  <th
                    style={{ padding: '10px', fontWeight: '700', letterSpacing: '0.5px', textAlign: 'center', cursor: 'pointer', userSelect: 'none' }}
                    onClick={() => {
                      if (sortBy === 'precio_usd') setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
                      setSortBy('precio_usd');
                    }}
                  >
                    Precio USD {sortBy === 'precio_usd' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                  </th>
                  <th
                    style={{ padding: '10px', fontWeight: '700', letterSpacing: '0.5px', textAlign: 'center', background: '#e0ffe0', color: '#009e00', borderRadius: '0 8px 8px 0' }}
                  >
                    Precio $AR
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtrados.length > 0 ? filtrados.map((prod, idx) => (
                  <tr key={prod.producto + idx} style={{ background: idx % 2 === 0 ? '#f8f9fa' : '#fff' }}>
                    <td style={{ 
                      padding: '10px', 
                      fontWeight: '600', 
                      wordWrap: 'break-word',
                      hyphens: 'auto',
                      lineHeight: '1.3'
                    }}>{prod.producto}</td>
                    <td style={{ padding: '10px' }}>{prod.categoria}</td>
                    <td style={{ padding: '10px', color: '#000000', fontWeight: '700', textAlign: 'center' }}>{`U$S ${prod.precio_usd}`}</td>
                    <td style={{ padding: '10px', color: '#009e00', fontWeight: '700', textAlign: 'center', background: '#f4fff4' }}>
                      {dolarBlue ? `$${(prod.precio_usd * dolarBlue).toLocaleString('es-AR', { maximumFractionDigits: 0 })}` : '...'}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '30px', color: '#888' }}>
                      No se encontraron productos
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prices;

