import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { COLORS } from '../utils/colors';
import '../fonts.css';

const Header = () => {
  const [dolarBlue, setDolarBlue] = useState(null);
  const [dolarBlueTime, setDolarBlueTime] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Cargar dólar blue
    fetch('https://dolarapi.com/v1/dolares/blue')
      .then(res => res.json())
      .then(data => {
        setDolarBlue(data.venta);
        setDolarBlueTime(data.fechaActualizacion);
      })
      .catch(() => setDolarBlue(null));

    // Cargar productos para búsqueda
    fetch('/productos_ram.json')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
      })
      .catch(error => {
        console.error('Error cargando productos:', error);
      });
  }, []);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const location = useLocation();

  // Cargar estilos hover para navegación
  useEffect(() => {
    // Agregar CSS para estilos hover
    const style = document.createElement('style');
    style.textContent = `
      .nav-link-hover:hover:not(.nav-link-active) {
        background: rgba(37, 211, 102, 0.3) !important;
        transform: translateY(-2px) !important;
        border: 1px solid rgba(37, 211, 102, 0.6) !important;
        backdrop-filter: blur(10px) !important;
        box-shadow: 0 8px 25px rgba(37, 211, 102, 0.4) !important;
      }

      .nav-link-hover {
        transition: all 0.3s ease !important;
      }

      /* Específico para todos los enlaces de navegación */
      nav .nav-link-hover:hover:not(.nav-link-active) {
        background: rgba(37, 211, 102, 0.3) !important;
        transform: translateY(-2px) !important;
        border: 1px solid rgba(37, 211, 102, 0.6) !important;
        backdrop-filter: blur(10px) !important;
        box-shadow: 0 8px 25px rgba(37, 211, 102, 0.4) !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setWindowWidth(width);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isActive = (path) => location.pathname === path;

  // Función para hacer scroll hacia arriba al cambiar de página
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Función para manejar la búsqueda
  const handleSearch = (value) => {
    setSearchTerm(value);
    if (value.length > 2) {
      const filtered = products.filter(product =>
        product.producto.toLowerCase().includes(value.toLowerCase()) ||
        product.categoria.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(filtered); // Mostrar todos los resultados
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  // Función para obtener gap y padding responsivos basado en el ancho actual
  const getResponsiveNavStyles = () => {
    const width = windowWidth;

    if (width >= 1400) {
      return { gap: '20px', padding: '12px 30px', fontSize: '16px' };
    } else if (width >= 1300) {
      return { gap: '16px', padding: '10px 24px', fontSize: '15px' };
    } else if (width >= 1200) {
      return { gap: '12px', padding: '8px 20px', fontSize: '14px' };
    } else if (width >= 1100) {
      return { gap: '8px', padding: '6px 16px', fontSize: '13px' };
    } else if (width >= 1000) {
      return { gap: '6px', padding: '5px 12px', fontSize: '12px' };
    } else if (width >= 900) {
      return { gap: '4px', padding: '4px 10px', fontSize: '11px' };
    } else {
      return { gap: '2px', padding: '3px 8px', fontSize: '10px' };
    }
  };

  // Obtener estilos actuales
  const navStyles = getResponsiveNavStyles();

  return (
    <>
      {/* Contador de Visitas que se oculta con scroll */}
      {/* <ScrollingVisitCounterBar /> */}

      <header style={{
        background: "black",
        boxShadow: COLORS.shadow.lg,
        position: 'sticky',
        top: '0px',
        zIndex: 1000,
        backdropFilter: 'blur(10px)',
        width: '100%',
        margin: 0,
        padding: 0
      }}>
        <div style={{ width: '100%', padding: '0' }}>
          {/* Fila superior - Logo y cotización */}
          <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '70px',
            paddingLeft: '20px',
            paddingRight: '20px'
          }}>
            {/* Logo */}
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              style={{
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginLeft: '0',
                position: 'relative',
                left: '0',
                cursor: 'pointer'
              }}
            >
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '0px'
              }}>
                <span style={{
                  margin: 0,
                  color: '#00F100',
                  fontSize: isMobile ? '25px' : '45px',
                  textShadow: '0 2px 4px rgba(0,241,0,0.3)',
                  fontFamily: 'CircuitBoard, monospace',
                  letterSpacing: isMobile ? '1px' : '2px',
                  lineHeight: '1',
                  marginTop: isMobile ? '5px' : '50px',
                }}>
                  RAM
                </span>
                <span style={{
                  margin: 0,
                  color: COLORS.text.white,
                  fontSize: isMobile ? '25px' : '44px',
                  fontWeight: '600',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  fontFamily: 'Arial, sans-serif',
                  lineHeight: '1',
                  marginTop: isMobile ? '5px' : '10px',
                }}>
                  Informática
                </span>
              </div>
            </Link>

            {/* Cotización del dólar hoy arriba, junto al logo */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: isMobile ? 'flex-end' : 'flex-end',
              justifyContent: 'center',
              marginLeft: isMobile ? '10px' : '30px',
              marginRight: isMobile ? '0px' : '0px',
              minWidth: isMobile ? '120px' : '180px',
            }}>
              <span style={{
                color: '#00F100',
                fontSize: isMobile ? '13px' : '16px',
                fontWeight: '700',
                letterSpacing: '0.5px',
                marginBottom: '2px',
                marginTop: isMobile ? '0px' : '10px',
                textAlign: 'right',
                whiteSpace: 'nowrap',
              }}>
                Dólar Blue hoy
              </span>
              <span style={{
                color: '#00F100',
                fontSize: isMobile ? '15px' : '20px',
                fontWeight: '700',
                background: 'rgba(0,241,0,0.08)',
                borderRadius: '15px',
                padding: isMobile ? '3px 8px' : '6px 15px',
                boxShadow: '0 2px 8px rgba(0,241,0,0.08)',
                letterSpacing: '0.5px',
                whiteSpace: 'nowrap',
                textAlign: 'right',
                marginTop: '2px',
              }}>
                {dolarBlue ? `$ ${dolarBlue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}` : 'Cargando...'}
              </span>
            </div>

            {/* Desktop Navigation */}
            <div style={{
              display: isMobile ? 'none' : 'flex',
              gap: navStyles.gap,
              alignItems: 'center',
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              justifyContent: 'center'
            }}>
              <Link
                to="/"
                onClick={scrollToTop}
                className={`nav-link-hover ${isActive('/') ? 'nav-link-active' : ''}`}
                style={{
                  textDecoration: 'none',
                  color: COLORS.text.white,
                  padding: navStyles.padding,
                  borderRadius: '25px',
                  fontWeight: '600',
                  fontSize: navStyles.fontSize,
                  transition: 'all 0.3s ease',
                  background: isActive('/') ? 'rgba(255,255,255,0.2)' : 'transparent',
                  backdropFilter: isActive('/') ? 'blur(10px)' : 'none',
                  border: isActive('/') ? '1px solid rgba(255,255,255,0.3)' : '1px solid transparent',
                  whiteSpace: 'nowrap'
                }}
              >
                🏠 Inicio
              </Link>

              <Link
                to="/productos"
                onClick={scrollToTop}
                className={`nav-link-hover ${isActive('/productos') ? 'nav-link-active' : ''}`}
                style={{
                  textDecoration: 'none',
                  color: COLORS.text.white,
                  padding: navStyles.padding,
                  borderRadius: '25px',
                  fontWeight: '600',
                  fontSize: navStyles.fontSize,
                  transition: 'all 0.3s ease',
                  background: isActive('/productos') ? 'rgba(255,255,255,0.2)' : 'transparent',
                  backdropFilter: isActive('/productos') ? 'blur(10px)' : 'none',
                  border: isActive('/productos') ? '1px solid rgba(255,255,255,0.3)' : '1px solid transparent',
                  whiteSpace: 'nowrap'
                }}
              >
                📦  Productos
              </Link>

              <Link
                to="/otros-productos"
                onClick={scrollToTop}
                className={`nav-link-hover ${isActive('/otros-productos') ? 'nav-link-active' : ''}`}
                style={{
                  textDecoration: 'none',
                  color: COLORS.text.white,
                  padding: navStyles.padding,
                  borderRadius: '25px',
                  fontWeight: '600',
                  fontSize: navStyles.fontSize,
                  transition: 'all 0.3s ease',
                  background: isActive('/otros-productos') ? 'rgba(255,255,255,0.2)' : 'transparent',
                  backdropFilter: isActive('/otros-productos') ? 'blur(10px)' : 'none',
                  border: isActive('/otros-productos') ? '1px solid rgba(255,255,255,0.3)' : '1px solid transparent',
                  whiteSpace: 'nowrap'
                }}
              >
                🛍️ Otros Productos
              </Link>

              <Link
                to="/nosotros"
                onClick={scrollToTop}
                className={`nav-link-hover ${isActive('/nosotros') ? 'nav-link-active' : ''}`}
                style={{
                  textDecoration: 'none',
                  color: COLORS.text.white,
                  padding: navStyles.padding,
                  borderRadius: '25px',
                  fontWeight: '600',
                  fontSize: navStyles.fontSize,
                  transition: 'all 0.3s ease',
                  background: isActive('/nosotros') ? 'rgba(255,255,255,0.2)' : 'transparent',
                  backdropFilter: isActive('/nosotros') ? 'blur(10px)' : 'none',
                  border: isActive('/nosotros') ? '1px solid rgba(255,255,255,0.3)' : '1px solid transparent',
                  whiteSpace: 'nowrap'
                }}
              >
                ℹ️ Quiénes Somos
              </Link>

              <Link
                to="/como-comprar"
                onClick={scrollToTop}
                className={`nav-link-hover ${isActive('/como-comprar') ? 'nav-link-active' : ''}`}
                style={{
                  textDecoration: 'none',
                  color: COLORS.text.white,
                  padding: navStyles.padding,
                  borderRadius: '25px',
                  fontWeight: '600',
                  fontSize: navStyles.fontSize,
                  transition: 'all 0.3s ease',
                  background: isActive('/como-comprar') ? 'rgba(255,255,255,0.2)' : 'transparent',
                  backdropFilter: isActive('/como-comprar') ? 'blur(10px)' : 'none',
                  border: isActive('/como-comprar') ? '1px solid rgba(255,255,255,0.3)' : '1px solid transparent',
                  whiteSpace: 'nowrap'
                }}
              >
                🛒 Cómo Comprar
              </Link>

              <Link
                to="/precios"
                onClick={scrollToTop}
                className={`nav-link-hover ${isActive('/precios') ? 'nav-link-active' : ''}`}
                style={{
                  textDecoration: 'none',
                  color: COLORS.text.white,
                  padding: navStyles.padding,
                  borderRadius: '25px',
                  fontWeight: '600',
                  fontSize: navStyles.fontSize,
                  transition: 'all 0.3s ease',
                  background: isActive('/precios') ? 'rgba(255,255,255,0.2)' : 'transparent',
                  backdropFilter: isActive('/precios') ? 'blur(10px)' : 'none',
                  border: isActive('/precios') ? '1px solid rgba(255,255,255,0.3)' : '1px solid transparent',
                  whiteSpace: 'nowrap'
                }}
              >
                📋 Lista de Precios PDF
              </Link>


            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{
                display: isMobile ? 'block' : 'none',
                background: 'none',
                border: 'none',
                color: COLORS.text.white,
                fontSize: '24px',
                cursor: 'pointer'
              }}
            >
              {isMenuOpen ? '✕' : '☰'}
            </button>
          </nav>

          {/* Fila inferior - Buscador y cotización (solo desktop) */}
          {!isMobile && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: '50px',
              paddingLeft: '20px',
              paddingRight: '20px'
            }}>
              {/* Espaciador izquierdo */}
              <div style={{ width: '200px' }}></div>

              {/* Buscador centrado */}
              <div style={{
                flex: '1',
                display: 'flex',
                justifyContent: 'center',
                maxWidth: '500px',
                position: 'relative'
              }}>
              

                {/* Resultados de búsqueda */}
                {showResults && searchResults.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '100%',
                    maxWidth: '400px',
                    background: 'rgb(0, 0, 0)',
                    border: '1px solid rgba(0, 241, 0, 0.3)',
                    borderRadius: '10px',
                    marginTop: '5px',
                    zIndex: 1001,
                    maxHeight: '400px', // Aumentamos la altura para mostrar más resultados
                    overflowY: 'auto',
                    boxShadow: '0 8px 25px rgba(0, 241, 0, 0.3)' // Agregamos una sombra verde
                  }}>
                    {/* Header con contador de resultados */}
                    <div style={{
                      padding: '8px 15px',
                      borderBottom: '1px solid rgba(255,255,255,0.2)',
                      background: 'rgba(0, 241, 0, 0.1)',
                      borderRadius: '10px 10px 0 0',
                      fontSize: '12px',
                      color: '#00F100',
                      fontWeight: '600',
                      textAlign: 'center'
                    }}>
                      {searchResults.length} producto{searchResults.length !== 1 ? 's' : ''} encontrado{searchResults.length !== 1 ? 's' : ''}
                    </div>

                    {searchResults.map((product, index) => {
                      // Calcular precio en pesos usando el dólar blue
                      const precioEnPesos = dolarBlue ? (product.precio_usd * dolarBlue).toFixed(0) : 'N/A';
                      // Formatear número con separadores de miles
                      const formatearNumero = (numero) => {
                        return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                      };

                      return (
                        <div
                          key={index}
                          style={{
                            padding: '10px 15px',
                            borderBottom: index < searchResults.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                          }}
                          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0, 241, 0, 0.1)'}
                          onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                          onClick={() => {
                            // Aquí podrías redirigir a la página de precios con el producto
                            setShowResults(false);
                            setSearchTerm('');
                          }}
                        >
                          <div style={{ color: COLORS.text.white, fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                            {product.producto}
                          </div>
                          <div style={{ color: '#00F100', fontSize: '12px', marginBottom: '2px' }}>
                            🏷️ {product.categoria}
                          </div>
                          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <span style={{ color: '#FFD700', fontSize: '12px', fontWeight: '600' }}>
                              💵 US$ {product.precio_usd}
                            </span>
                            {dolarBlue && (
                              <span style={{ color: '#87CEEB', fontSize: '12px', fontWeight: '600' }}>
                                💰 $ {formatearNumero(precioEnPesos)} ARS
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Mensaje cuando no hay resultados */}
                {showResults && searchResults.length === 0 && searchTerm.length > 2 && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '100%',
                    maxWidth: '400px',
                    background: 'rgb(0, 0, 0)',
                    border: '1px solid rgba(255, 100, 100, 0.3)',
                    borderRadius: '10px',
                    marginTop: '5px',
                    zIndex: 1001,
                    boxShadow: '0 8px 25px rgba(255, 100, 100, 0.2)'
                  }}>
                    <div style={{
                      padding: '15px',
                      textAlign: 'center',
                      fontSize: '14px',
                      color: '#FF6464',
                      fontWeight: '500'
                    }}>
                      🔍 No hay resultados de la búsqueda
                    </div>
                  </div>
                )}
              </div>

              {/* Cotización del dólar a la derecha */}
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                width: '200px'
              }}>

              </div>
            </div>
          )}

          {/* Mobile Menu */}
          {isMenuOpen && isMobile && (
            <div style={{
              padding: '20px 0',
              borderTop: '1px solid rgba(255,255,255,0.2)'
            }}>
              <Link
                to="/"
                onClick={() => {
                  setIsMenuOpen(false);
                  scrollToTop();
                }}
                style={{
                  display: 'block',
                  textDecoration: 'none',
                  color: COLORS.text.white,
                  padding: '12px 0',
                  marginLeft: '20px',
                  fontWeight: '600'
                }}
              >
                🏠 Inicio
              </Link>

              <Link
                to="/productos"
                onClick={() => {
                  setIsMenuOpen(false);
                  scrollToTop();
                }}
                style={{
                  display: 'block',
                  textDecoration: 'none',
                  color: COLORS.text.white,
                  padding: '12px 0',
                  marginLeft: '20px',
                  fontWeight: '600'
                }}
              >
                � Productos
              </Link>

              <Link
                to="/otros-productos"
                onClick={() => {
                  setIsMenuOpen(false);
                  scrollToTop();
                }}
                style={{
                  display: 'block',
                  textDecoration: 'none',
                  color: COLORS.text.white,
                  padding: '12px 0',
                  marginLeft: '20px',
                  fontWeight: '600'
                }}
              >
                🛍️ Otros Productos
              </Link>
              <Link
                to="/nosotros"
                onClick={() => {
                  setIsMenuOpen(false);
                  scrollToTop();
                }}
                style={{
                  display: 'block',
                  textDecoration: 'none',
                  color: COLORS.text.white,
                  padding: '12px 0',
                  marginLeft: '20px',
                  fontWeight: '600'
                }}
              >
                ℹ️ Quiénes Somos
              </Link>
              <Link
                to="/como-comprar"
                onClick={() => {
                  setIsMenuOpen(false);
                  scrollToTop();
                }}
                style={{
                  display: 'block',
                  textDecoration: 'none',
                  color: COLORS.text.white,
                  padding: '12px 0',
                  marginLeft: '20px',
                  fontWeight: '600'
                }}
              >
                🛒 Cómo Comprar
              </Link>


              <Link
                to="/precios"
                onClick={() => {
                  setIsMenuOpen(false);
                  scrollToTop();
                }}
                style={{
                  display: 'block',
                  textDecoration: 'none',
                  color: COLORS.text.white,
                  padding: '12px 0',
                  marginLeft: '20px',
                  fontWeight: '600'
                }}
              >
                📋 Lista de Precios PDF
              </Link>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
