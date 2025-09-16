import React, { useState, useEffect } from 'react';
import { COLORS } from '../utils/colors';

const ProductSlider = ({ productos }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Seleccionar productos destacados (productos más caros o con ofertas)
  const productosDestacados = productos
    .filter(p => p.precio_usd > 500 || p.producto.includes('🔥'))
    .slice(0, 6);

  useEffect(() => {
    if (isAutoPlay && productosDestacados.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => 
          prev === productosDestacados.length - 1 ? 0 : prev + 1
        );
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlay, productosDestacados.length]);

  if (productosDestacados.length === 0) return null;

  return (
    <div style={{
      position: 'relative',
      margin: '30px 0',
      borderRadius: '20px',
      overflow: 'hidden',
      background: `linear-gradient(135deg, ${COLORS.neutral[50]} 0%, ${COLORS.neutral[100]} 100%)`,
      boxShadow: COLORS.shadow.lg
    }}>
      <div style={{
        padding: '20px',
        textAlign: 'center'
      }}>
        <h2 style={{
          margin: '0 0 20px 0',
          color: COLORS.text.primary,
          fontSize: '28px',
          fontWeight: '700',
          textShadow: COLORS.shadow.sm
        }}>
          ✨ Productos Destacados
        </h2>
      </div>

      <div style={{
        position: 'relative',
        height: '400px',
        overflow: 'hidden'
      }}>
        {productosDestacados.map((producto, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: index === currentSlide ? 1 : 0,
              transform: `translateX(${(index - currentSlide) * 100}%)`,
              transition: 'all 0.5s ease-in-out',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '40px',
              maxWidth: '800px',
              background: COLORS.background.card,
              borderRadius: '20px',
              padding: '30px',
              boxShadow: '0 15px 35px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                flex: 1,
                textAlign: 'center'
              }}>
                <img
                  src={`/img/${producto.imagen}`}
                  alt={producto.producto}
                  style={{
                    width: '250px',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '15px',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                  }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/250x200?text=Sin+Imagen';
                  }}
                />
              </div>
              <div style={{
                flex: 1,
                textAlign: 'left'
              }}>
                <h3 style={{
                  fontSize: '22px',
                  fontWeight: '700',
                  color: '#333',
                  marginBottom: '15px',
                  lineHeight: '1.3'
                }}>
                  {producto.producto}
                </h3>
                <div style={{
                  fontSize: '32px',
                  fontWeight: '800',
                  color: '#e74c3c',
                  marginBottom: '15px'
                }}>
                  U$S {producto.precio_usd}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#666',
                  backgroundColor: '#f8f9fa',
                  padding: '8px 15px',
                  borderRadius: '20px',
                  display: 'inline-block',
                  marginBottom: '20px'
                }}>
                  {producto.categoria}
                </div>
                <div>
                  <a
                    href={`https://wa.me/5492954227622?text=${encodeURIComponent(`Hola! Me interesa este producto destacado: ${producto.producto} - U$S ${producto.precio_usd}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none' }}
                  >
                    <button style={{
                      background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '15px 30px',
                      borderRadius: '25px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 25px rgba(37, 211, 102, 0.4)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(37, 211, 102, 0.3)';
                    }}
                    >
                      💬 Consultar Ahora
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Indicadores */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        padding: '20px'
      }}>
        {productosDestacados.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              border: 'none',
              background: index === currentSlide ? '#00F100' : '#000000',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          />
        ))}
      </div>

      {/* Controles */}
      <button
        onClick={() => setCurrentSlide(currentSlide === 0 ? productosDestacados.length - 1 : currentSlide - 1)}
        style={{
          position: 'absolute',
          left: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(255,255,255,0.9)',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          fontSize: '20px',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease'
        }}
        onMouseOver={(e) => {
          e.target.style.background = 'white';
          e.target.style.transform = 'translateY(-50%) scale(1.1)';
        }}
        onMouseOut={(e) => {
          e.target.style.background = 'rgba(255,255,255,0.9)';
          e.target.style.transform = 'translateY(-50%) scale(1)';
        }}
      >
        ‹
      </button>
      <button
        onClick={() => setCurrentSlide(currentSlide === productosDestacados.length - 1 ? 0 : currentSlide + 1)}
        style={{
          position: 'absolute',
          right: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(255,255,255,0.9)',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          fontSize: '20px',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease'
        }}
        onMouseOver={(e) => {
          e.target.style.background = 'white';
          e.target.style.transform = 'translateY(-50%) scale(1.1)';
        }}
        onMouseOut={(e) => {
          e.target.style.background = 'rgba(255,255,255,0.9)';
          e.target.style.transform = 'translateY(-50%) scale(1)';
        }}
      >
        ›
      </button>
    </div>
  );
};

export default ProductSlider;
