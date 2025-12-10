import React from 'react';
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

const About = () => {
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
        padding: '0 20px'
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
            margin: '0'
          }}>
            Quienes somos
          </h1>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '400',
            color: 'black',
            fontFamily: 'Arial, sans-serif'
          }}>
            Nuestra Historia
          </h2>
        </div>

        {/* Content Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(10px)',
          borderRadius: '15px',
          padding: '50px 40px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
        }}>

          <div style={{
            display: 'grid',
            gap: '30px',
            fontSize: '16px',
            lineHeight: '1.7'
          }}>
            
            <div style={{
              padding: '30px',
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '15px',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(0, 241, 0, 0.2)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '20px',
                gap: '15px'
              }}>
                <div style={{
                  fontSize: '32px',
                  color: '#00F100'
                }}>
                  🏪
                </div>
                <h3 style={{
                  fontSize: '24px',
                  color: '#1a1a1a',
                  margin: '0',
                  fontWeight: '600'
                }}>
                  Los Comienzos
                </h3>
              </div>
              
            
              
              <p style={{
                margin: '0',
                color: '#333333',
                fontSize: '16px'
              }}>
                RAM Informática nació con un local físico ubicado en la <strong>Calle Ayala 604</strong> de <strong>Santa Rosa, La Pampa</strong>, en Agosto del 2008.  Durante 13 años, fuimos un punto de referencia en la ciudad para todo lo relacionado con tecnología e informática, brindando asesoramiento especializado y productos de calidad a la comunidad.
              </p>
                {/* Imagen del Local dentro de la card */}
              <div style={{
                textAlign: 'center',
                marginBottom: '25px'
              }}>
                <img 
                  src="/local.jpg" 
                  alt="RAM Informática - Local en Calle Ayala 604, Santa Rosa, La Pampa"
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                    maxHeight: '300px',
                    borderRadius: '10px',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    marginTop: '15px'
                  }}
                />
                <p style={{
                  fontSize: '13px',
                  color: '#666666',
                  marginTop: '8px',
                  fontStyle: 'italic'
                }}>
                  Nuestro local en Calle Ayala 604, Santa Rosa, La Pampa allá por el año 2021
                </p>
              </div>
            </div>
            

            <div style={{
              padding: '30px',
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '15px',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '20px',
                gap: '15px'
              }}>
                <div style={{
                  fontSize: '32px',
                  color: '#666666'
                }}>
                  📅
                </div>
                <h3 style={{
                  fontSize: '24px',
                  color: '#1a1a1a',
                  margin: '0',
                  fontWeight: '600'
                }}>
                  Una Era que Termina
                </h3>
              </div>
              <p style={{
                margin: '0',
                color: '#333333',
                fontSize: '16px'
              }}>
                Nuestro local estuvo abierto al público hasta <strong>Octubre del 2021</strong>, brindando atención personalizada y productos de calidad a toda la comunidad pampeana. Fue una etapa llena de aprendizajes, crecimiento y vínculos especiales con nuestros clientes, quienes confiaron en nosotros para sus necesidades tecnológicas.
              </p>
            </div>

            <div style={{
              padding: '30px',
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '15px',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(0, 241, 0, 0.2)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '20px',
                gap: '15px'
              }}>
                <div style={{
                  fontSize: '32px',
                  color: '#00F100'
                }}>
                  🚀
                </div>
                <h3 style={{
                  fontSize: '24px',
                  color: '#1a1a1a',
                  margin: '0',
                  fontWeight: '600'
                }}>
                  Reinventándose en el Futuro
                </h3>
              </div>
              <p style={{
                margin: '0',
                color: '#333333',
                fontSize: '16px'
              }}>
                Hoy nos reinventamos en modo <strong>ecommerce</strong>, adaptándonos a los nuevos tiempos sin perder nuestra esencia. Mantenemos los mismos valores que nos caracterizaron desde el primer día: <strong>honestidad</strong>, <strong>precios competitivos</strong> y un compromiso genuino con la satisfacción de nuestros clientes.
              </p>
            </div>

            <div style={{
              padding: '30px',
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '15px',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(0, 241, 0, 0.2)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '20px',
                gap: '15px'
              }}>
                <div style={{
                  fontSize: '32px',
                  color: '#00F100'
                }}>
                  💡
                </div>
                <h3 style={{
                  fontSize: '24px',
                  color: '#1a1a1a',
                  margin: '0',
                  fontWeight: '600'
                }}>
                  Nuestro Compromiso
                </h3>
              </div>
              <p style={{
                fontSize: '16px',
                fontWeight: '400',
                color: '#333333',
                margin: '0'
              }}>
                La misma calidad y confianza de siempre, ahora al alcance de un click. Continuamos ofreciendo productos de tecnología con el mismo nivel de excelencia y atención personalizada que nos caracterizó durante todos estos años.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div style={{
          marginTop: '50px',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: '16px',
            color: COLORS.text.light,
            marginBottom: '25px'
          }}>
            ¿Tenés alguna consulta? No dudes en contactarnos
          </p>
          <a
            href="https://wa.me/+5492954227622?text=Hola,%20estoy%20interesado%20en%20conocer%20más%20sobre%20RAM%20Informática"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('whatsapp_click', 'Contact', 'About_WhatsApp', 1)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: '#25d366',
              color: 'white',
              padding: '12px 25px',
              borderRadius: '25px',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              border: 'none',
              boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(37, 211, 102, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(37, 211, 102, 0.3)';
            }}
          >
            📱 Contáctanos por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
