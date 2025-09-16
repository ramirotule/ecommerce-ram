import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { COLORS } from '../utils/colors';

const Header = () => {
  const [dolarBlue, setDolarBlue] = useState(null);
  const [dolarBlueTime, setDolarBlueTime] = useState(null);

  useEffect(() => {
    fetch('https://dolarapi.com/v1/dolares/blue')
      .then(res => res.json())
      .then(data => {
        setDolarBlue(data.venta);
        setDolarBlueTime(data.fechaActualizacion);
      })
      .catch(() => setDolarBlue(null));
  }, []);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // Cargar la fuente Circuit Board
  useEffect(() => {
    // Agregar CSS para la fuente con codificación URL y estilos hover
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'CircuitBoard';
        src: url('/assets/101!%20Circuit%20Board%20Regular.ttf') format('truetype');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }

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
      setIsMobile(window.innerWidth <= 768);
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

  return (
    <>
      {/* Contador de Visitas que se oculta con scroll */}
      {/* <ScrollingVisitCounterBar /> */}

  <header style={{
        background: "black",
        boxShadow: COLORS.shadow.lg,
        position: 'sticky',
        top: '0px', // Vuelve a 0 ya que el contador se oculta completamente
        zIndex: 1000,
        backdropFilter: 'blur(10px)',
        width: '100%',
        margin: 0,
        padding: 0
      }}>
  <div style={{
        width: '100%',
        padding: '0'
      }}>
  <nav style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '80px',
          paddingLeft: '20px',
          paddingRight: '20px'
        }}>
          {/* Logo */}
          <Link
            to="/"
            onClick={() => {
              // Scroll hacia arriba suavemente
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
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
                fontSize: '30px',
                textShadow: '0 2px 4px rgba(0,241,0,0.3)',
                fontFamily: 'CircuitBoard, monospace',
                letterSpacing: '2px',
                lineHeight: '1'
              }}>
                RAM
              </span>
              <span style={{    
                margin: 0,
                color: COLORS.text.white,
                fontSize: '24px',
                fontWeight: '600',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                fontFamily: 'Arial, sans-serif',
                lineHeight: '1',
                marginTop: '10px',
              }}>
                Informática
              </span>
            </div>
            <span style={{
              marginLeft: '18px',
              color: '#00F100',
              fontSize: '18px',
              fontWeight: '700',
              background: 'rgba(0,241,0,0.08)',
              borderRadius: '8px',
              padding: '4px 12px',
              boxShadow: '0 2px 8px rgba(0,241,0,0.08)',
              letterSpacing: '1px',
              display: 'inline-block',
              verticalAlign: 'middle'
            }}>
              {dolarBlue ? `Dólar Blue: $${dolarBlue}` : 'Cargando dólar blue...'}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div style={{
            display: isMobile ? 'none' : 'flex',
            gap: '20px',
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
                padding: '12px 30px',
                borderRadius: '25px',
                fontWeight: '600',
                fontSize: '16px',
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
              to="/other-products"
              onClick={scrollToTop}
              className={`nav-link-hover ${isActive('/other-products') ? 'nav-link-active' : ''}`}
              style={{
                textDecoration: 'none',
                color: COLORS.text.white,
                padding: '12px 30px',
                borderRadius: '25px',
                fontWeight: '600',
                fontSize: '16px',
                transition: 'all 0.3s ease',
                background: isActive('/other-products') ? 'rgba(255,255,255,0.2)' : 'transparent',
                backdropFilter: isActive('/other-products') ? 'blur(10px)' : 'none',
                border: isActive('/other-products') ? '1px solid rgba(255,255,255,0.3)' : '1px solid transparent',
                whiteSpace: 'nowrap'
              }}
            >
              🛍️ Otros Productos
            </Link>
            
            <Link
              to="/about"
              onClick={scrollToTop}
              className={`nav-link-hover ${isActive('/about') ? 'nav-link-active' : ''}`}
              style={{
                textDecoration: 'none',
                color: COLORS.text.white,
                padding: '12px 30px',
                borderRadius: '25px',
                fontWeight: '600',
                fontSize: '16px',
                transition: 'all 0.3s ease',
                background: isActive('/about') ? 'rgba(255,255,255,0.2)' : 'transparent',
                backdropFilter: isActive('/about') ? 'blur(10px)' : 'none',
                border: isActive('/about') ? '1px solid rgba(255,255,255,0.3)' : '1px solid transparent',
                whiteSpace: 'nowrap'
              }}
            >
              ℹ️ Quiénes Somos
            </Link>

            <Link
              to="/how-to-buy"
              onClick={scrollToTop}
              className={`nav-link-hover ${isActive('/how-to-buy') ? 'nav-link-active' : ''}`}
              style={{
                textDecoration: 'none',
                color: COLORS.text.white,
                padding: '12px 30px',
                borderRadius: '25px',
                fontWeight: '600',
                fontSize: '16px',
                transition: 'all 0.3s ease',
                background: isActive('/how-to-buy') ? 'rgba(255,255,255,0.2)' : 'transparent',
                backdropFilter: isActive('/how-to-buy') ? 'blur(10px)' : 'none',
                border: isActive('/how-to-buy') ? '1px solid rgba(255,255,255,0.3)' : '1px solid transparent',
                whiteSpace: 'nowrap'
              }}
            >
              🛒 Cómo Comprar
            </Link>

            <Link
              to="/prices"
              onClick={scrollToTop}
              className={`nav-link-hover ${isActive('/prices') ? 'nav-link-active' : ''}`}
              style={{
                textDecoration: 'none',
                color: COLORS.text.white,
                padding: '12px 30px',
                borderRadius: '25px',
                fontWeight: '600',
                fontSize: '16px',
                transition: 'all 0.3s ease',
                background: isActive('/prices') ? 'rgba(255,255,255,0.2)' : 'transparent',
                backdropFilter: isActive('/prices') ? 'blur(10px)' : 'none',
                border: isActive('/prices') ? '1px solid rgba(255,255,255,0.3)' : '1px solid transparent',
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
                fontWeight: '600'
              }}
            >
              🏠 Inicio
            </Link>
            <Link
              to="/about"
              onClick={() => {
                setIsMenuOpen(false);
                scrollToTop();
              }}
              style={{
                display: 'block',
                textDecoration: 'none',
                color: COLORS.text.white,
                padding: '12px 0',
                fontWeight: '600'
              }}
            >
              ℹ️ Quiénes Somos
            </Link>
            <Link
              to="/how-to-buy"
              onClick={() => {
                setIsMenuOpen(false);
                scrollToTop();
              }}
              style={{
                display: 'block',
                textDecoration: 'none',
                color: COLORS.text.white,
                padding: '12px 0',
                fontWeight: '600'
              }}
            >
              🛒 Cómo Comprar
            </Link>
            <Link
              to="/prices"
              onClick={() => {
                setIsMenuOpen(false);
                scrollToTop();
              }}
              style={{
                display: 'block',
                textDecoration: 'none',
                color: COLORS.text.white,
                padding: '12px 0',
                fontWeight: '600'
              }}
            >
              📋 Lista de Precios PDF
            </Link>
            <Link
              to="/other-products"
              onClick={() => {
                setIsMenuOpen(false);
                scrollToTop();
              }}
              style={{
                display: 'block',
                textDecoration: 'none',
                color: COLORS.text.white,
                padding: '12px 0',
                fontWeight: '600'
              }}
            >
              🛍️ Otros Productos
            </Link>
          </div>
        )}
      </div>
    </header>
    </>
  );
};

export default Header;
