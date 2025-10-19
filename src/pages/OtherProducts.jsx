import React, { useState, useEffect } from 'react';
import { COLORS } from '../utils/colors';

// Función para enviar eventos a Google Analytics
const trackEvent = (eventName, eventCategory, eventLabel = '', eventValue = '') => {
  // Verificar si gtag está disponible (Google Analytics 4)
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      event_category: eventCategory,
      event_label: eventLabel,
      value: eventValue
    });
  }
  
  // Backup para Google Analytics Universal (ga)
  if (typeof window !== 'undefined' && window.ga) {
    window.ga('send', 'event', eventCategory, eventName, eventLabel, eventValue);
  }
  
  // Log para desarrollo
  console.log('📊 Analytics Event:', { eventName, eventCategory, eventLabel, eventValue });
};

const OtherProducts = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);
  const productCategories = [
    {
      icon: '🚁',
      title: 'Drones',
      description: 'Drones profesionales y recreativos para fotografía aérea y diversión',
      items: ['DJI Mini', 'DJI Air', 'Drones FPV', 'Accesorios para drones']
    },
    {
      icon: '🔊',
      title: 'Parlantes JBL',
      description: 'Audio de alta calidad para todas tus necesidades',
      items: ['JBL Flip', 'JBL Charge', 'JBL Xtreme', 'JBL PartyBox']
    },
    {
      icon: '🎮',
      title: 'Notebooks Gamers',
      description: 'Laptops de alto rendimiento para gaming y diseño',
      items: ['ASUS ROG', 'MSI Gaming', 'Acer Predator', 'HP Omen']
    },
    {
      icon: '💻',
      title: 'Notebooks de Oficina',
      description: 'Equipos confiables para trabajo y productividad',
      items: ['Lenovo ThinkPad', 'Dell Latitude', 'HP EliteBook', 'ASUS ExpertBook']
    },
    {
      icon: '🎥',
      title: 'Filmadoras',
      description: 'Cámaras de video para contenido profesional',
      items: ['Sony Handycam', 'Canon Camcorder', 'GoPro', 'Cámaras 4K']
    },
    {
      icon: '📷',
      title: 'Cámaras Fotográficas',
      description: 'Equipos fotográficos profesionales y semiprofesionales',
      items: ['Canon EOS', 'Nikon D-Series', 'Sony Alpha', 'Fujifilm X-Series']
    },
    {
      icon: '🔍',
      title: 'Lentes y Objetivos',
      description: 'Lentes para todas las necesidades fotográficas',
      items: ['Lentes gran angular', 'Teleobjetivos', 'Lentes macro', 'Filtros UV']
    },
    {
      icon: '⚡',
      title: 'Y Mucho Más',
      description: 'Consultanos por cualquier producto tecnológico',
      items: ['Tablets', 'Smartwatches', 'Auriculares', 'Accesorios tech']
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: COLORS.background.dark,
      padding: '40px 0',
      color: COLORS.text.white
    }}>
      <div style={{
        width: '100%',
        margin: '0 auto',
        padding: isMobile ? '0 10px' : '0 20px'
      }}>
        {/* Header Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '60px'
        }}>
          <h1 style={{
            fontSize: '55px',
            fontWeight: '700',
            color: '#020202',
            textShadow: '0 2px 4px rgba(0,241,0,0.3)',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            letterSpacing: '2px',
            margin: '0 0 20px 0'
          }}>
            🛍️ Otros Productos
          </h1>
          <p style={{
            fontSize: '20px',
            fontWeight: '400',
            color: 'black',
            fontFamily: 'Arial, sans-serif',
            margin: '0 0 10px 0',
            lineHeight: '1.5'
          }}>
            ¿No encontraste lo que buscabas en nuestra lista principal?
          </p>
          <p style={{
            fontSize: '18px',
            fontWeight: '400',
            color: 'black',
            fontFamily: 'Arial, sans-serif',
            margin: '0'
          }}>
            ¡También manejamos estos productos especiales!
          </p>
        </div>

        {/* Content Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(10px)',
          borderRadius: '15px',
          padding: isMobile ? '30px 15px' : '50px 40px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
        }}>

        {/* Categories Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile 
            ? '1fr' 
            : 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '25px',
          marginBottom: '50px',
          justifyItems: isMobile ? 'center' : 'stretch'
        }}>
          {productCategories.map((category, index) => (
            <div
              key={index}
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '15px',
                padding: '25px',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(0, 241, 0, 0.2)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                width: isMobile ? '100%' : 'auto',
                maxWidth: isMobile ? '350px' : 'none'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 241, 0, 0.2)';
                e.currentTarget.style.border = '1px solid rgba(0, 241, 0, 0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.border = '1px solid rgba(0, 241, 0, 0.2)';
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '15px',
                gap: '15px'
              }}>
                <div style={{
                  fontSize: '40px',
                  color: '#00F100'
                }}>
                  {category.icon}
                </div>
                <h3 style={{
                  fontSize: '22px',
                  color: '#1a1a1a',
                  margin: '0',
                  fontWeight: '600'
                }}>
                  {category.title}
                </h3>
              </div>
              
              <p style={{
                color: '#333333',
                fontSize: '16px',
                marginBottom: '20px',
                lineHeight: '1.5'
              }}>
                {category.description}
              </p>

              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                {category.items.map((item, itemIndex) => (
                  <span
                    key={itemIndex}
                    style={{
                      background: 'rgba(0, 241, 0, 0.1)',
                      color: '#1a1a1a',
                      padding: '6px 12px',
                      borderRadius: '15px',
                      fontSize: '13px',
                      fontWeight: '500',
                      border: '1px solid rgba(0, 241, 0, 0.3)'
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '15px',
          padding: '40px',
          textAlign: 'center',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(0, 241, 0, 0.2)',
          marginTop: '30px'
        }}>
          <h2 style={{
            fontSize: '32px',
            color: '#1a1a1a',
            marginBottom: '20px',
            fontWeight: '600'
          }}>
            💬 ¿Buscás algo específico?
          </h2>
          
          <p style={{
            fontSize: '18px',
            color: '#333333',
            marginBottom: '30px',
            lineHeight: '1.6',
            maxWidth: '800px',
            margin: '0 auto 30px auto'
          }}>
            En <strong>RAM Informática</strong> trabajamos con una amplia red de proveedores. 
            Si no encontraste el producto que necesitás en nuestra lista principal, 
            consultanos igual. Podemos conseguir prácticamente cualquier producto tecnológico 
            que esté disponible en el mercado argentino.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile 
              ? '1fr' 
              : 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '30px',
            maxWidth: '600px',
            margin: '0 auto 30px auto'
          }}>
            <div style={{
              background: 'rgba(0, 241, 0, 0.1)',
              padding: '20px',
              borderRadius: '10px',
              border: '1px solid rgba(0, 241, 0, 0.3)'
            }}>
              <h4 style={{
                color: '#1a1a1a',
                fontSize: '18px',
                marginBottom: '10px'
              }}>
                ⚡ Respuesta Rápida
              </h4>
              <p style={{
                color: '#333333',
                fontSize: '14px',
                margin: 0
              }}>
                Te respondemos en minutos sobre disponibilidad y precio
              </p>
            </div>

            <div style={{
              background: 'rgba(0, 241, 0, 0.1)',
              padding: '20px',
              borderRadius: '10px',
              border: '1px solid rgba(0, 241, 0, 0.3)'
            }}>
              <h4 style={{
                color: '#1a1a1a',
                fontSize: '18px',
                marginBottom: '10px'
              }}>
                🤝 Mejor Precio
              </h4>
              <p style={{
                color: '#333333',
                fontSize: '14px',
                margin: 0
              }}>
                Trabajamos para conseguirte el mejor precio del mercado
              </p>
            </div>
          </div>

          <a
            href="https://wa.me/+5492954227622?text=Hola,%20quiero%20consultar%20por%20un%20producto%20que%20no%20está%20en%20la%20lista"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('whatsapp_click', 'Contact', 'OtherProducts_WhatsApp', 1)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              background: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)',
              color: 'white',
              padding: '18px 35px',
              borderRadius: '30px',
              textDecoration: 'none',
              fontSize: '18px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              border: 'none',
              boxShadow: '0 8px 25px rgba(37, 211, 102, 0.4)'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 12px 35px rgba(37, 211, 102, 0.6)';
              e.target.style.filter = 'brightness(1.1)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 25px rgba(37, 211, 102, 0.4)';
              e.target.style.filter = 'brightness(1)';
            }}
          >
            <span style={{ fontSize: '24px' }}>📱</span>
            Consultar por WhatsApp
          </a>
        </div>

        {/* Additional Info */}
        <div style={{
          textAlign: 'center',
          marginTop: '40px',
          padding: '25px',
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '15px',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(0, 241, 0, 0.2)'
        }}>
          <p style={{
            color: '#333333',
            fontSize: '16px',
            margin: 0,
            lineHeight: '1.6'
          }}>
            💡 <strong>Tip:</strong> Envianos el modelo exacto, marca o una foto del producto. 
            Así podemos darte un presupuesto más preciso y rápido.
          </p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default OtherProducts;
