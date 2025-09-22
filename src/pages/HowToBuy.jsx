import React from 'react';
import { COLORS } from '../utils/colors';

const HowToBuy = () => {
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
            Cómo Comprar
          </h1>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '400',
            color: 'black',
            fontFamily: 'Arial, sans-serif'
          }}>
            Métodos de Pago y Condiciones
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
            
            {/* Modalidades de Compra */}
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
                marginBottom: '25px',
                gap: '15px'
              }}>
                <div style={{
                  fontSize: '32px',
                  color: '#00F100'
                }}>
                  💰
                </div>
                <h3 style={{
                  fontSize: '24px',
                  color: '#1a1a1a',
                  margin: '0',
                  fontWeight: '600'
                }}>
                  Modalidades de Compra
                </h3>
              </div>
              
              <div style={{
                display: 'grid',
                gap: '20px'
              }}>
                <div style={{
                  background: 'rgba(0, 241, 0, 0.1)',
                  padding: '20px',
                  borderRadius: '10px',
                  border: '1px solid rgba(0, 241, 0, 0.3)'
                }}>
                  <h4 style={{
                    fontSize: '18px',
                    color: '#1a1a1a',
                    marginBottom: '10px',
                    fontWeight: '600'
                  }}>
                    🇦🇷 Pago en Pesos Argentinos
                  </h4>
                  <ul style={{
                    margin: '0',
                    paddingLeft: '20px',
                    color: '#333333'
                  }}>
                    <li><strong>70% de seña:</strong> El precio queda abierto en caso de variación del dólar</li>
                    <li><strong>100% adelantado:</strong> El precio se congela completamente</li>
                  </ul>
                </div>

                <div style={{
                  background: 'rgba(34, 139, 34, 0.1)',
                  padding: '20px',
                  borderRadius: '10px',
                  border: '1px solid rgba(34, 139, 34, 0.3)'
                }}>
                  <h4 style={{
                    fontSize: '18px',
                    color: '#1a1a1a',
                    marginBottom: '10px',
                    fontWeight: '600'
                  }}>
                    💵 Pago en Dólares Estadounidenses
                  </h4>
                  <ul style={{
                    margin: '0',
                    paddingLeft: '20px',
                    color: '#333333'
                  }}>
                    <li><strong>Mínimo 70% de seña:</strong> En billetes físicos</li>
                    <li><strong>Precio fijo:</strong> No varía por estar en moneda estadounidense</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Formas de Pago */}
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
                marginBottom: '25px',
                gap: '15px'
              }}>
                <div style={{
                  fontSize: '32px',
                  color: '#00F100'
                }}>
                  💳
                </div>
                <h3 style={{
                  fontSize: '24px',
                  color: '#1a1a1a',
                  margin: '0',
                  fontWeight: '600'
                }}>
                  Formas de Pago
                </h3>
              </div>
              
              <div style={{
                marginBottom: '20px'
              }}>
                <h4 style={{
                  fontSize: '18px',
                  color: '#1a1a1a',
                  marginBottom: '15px',
                  fontWeight: '600'
                }}>
                  🛒 Mercado Pago
                </h4>
                <p style={{
                  margin: '0 0 15px 0',
                  color: '#333333'
                }}>
                  Aceptamos pagos a través de la plataforma de Mercado Pago con las siguientes condiciones:
                </p>
              </div>

              <div style={{
                display: 'grid',
                gap: '15px'
              }}>
                <div style={{
                  background: 'rgba(0, 123, 255, 0.1)',
                  padding: '15px',
                  borderRadius: '8px',
                  border: '1px solid rgba(0, 123, 255, 0.3)'
                }}>
                  <h5 style={{
                    fontSize: '16px',
                    color: '#1a1a1a',
                    margin: '0 0 8px 0',
                    fontWeight: '600'
                  }}>
                    💸 1 Cuota
                  </h5>
                  <p style={{
                    margin: '0',
                    color: '#333333',
                    fontSize: '14px'
                  }}>
                    <strong>Costo adicional:</strong> 6.29% + IVA (21%) por transacción
                  </p>
                </div>

                <div style={{
                  background: 'rgba(255, 165, 0, 0.1)',
                  padding: '15px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 165, 0, 0.3)'
                }}>
                  <h5 style={{
                    fontSize: '16px',
                    color: '#1a1a1a',
                    margin: '0 0 8px 0',
                    fontWeight: '600'
                  }}>
                    💳 3 Cuotas
                  </h5>
                  <p style={{
                    margin: '0',
                    color: '#333333',
                    fontSize: '14px'
                  }}>
                    <strong>Costo adicional:</strong> 12.85% + IVA (21%) por transacción
                  </p>
                </div>

                <div style={{
                  background: 'rgba(220, 20, 60, 0.1)',
                  padding: '15px',
                  borderRadius: '8px',
                  border: '1px solid rgba(220, 20, 60, 0.3)'
                }}>
                  <h5 style={{
                    fontSize: '16px',
                    color: '#1a1a1a',
                    margin: '0 0 8px 0',
                    fontWeight: '600'
                  }}>
                    🏦 6 Cuotas
                  </h5>
                  <p style={{
                    margin: '0',
                    color: '#333333',
                    fontSize: '14px'
                  }}>
                    <strong>Costo adicional:</strong> 21.06% + IVA (21%) por transacción
                  </p>
                </div>
              </div>

              <div style={{
                marginTop: '20px',
                padding: '15px',
                background: 'rgba(255, 193, 7, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 193, 7, 0.4)'
              }}>
                <p style={{
                  margin: '0',
                  color: '#333333',
                  fontSize: '14px',
                  fontStyle: 'italic'
                }}>
                  <strong>Nota:</strong> Los porcentajes corresponden a los costos de Mercado Pago Argentina vigentes en Julio 2025. Los costos se suman al precio final del producto.
                </p>
              </div>
            </div>

            {/* Proceso de Compra */}
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
                marginBottom: '25px',
                gap: '15px'
              }}>
                <div style={{
                  fontSize: '32px',
                  color: '#00F100'
                }}>
                  📋
                </div>
                <h3 style={{
                  fontSize: '24px',
                  color: '#1a1a1a',
                  margin: '0',
                  fontWeight: '600'
                }}>
                  Proceso de Compra
                </h3>
              </div>
              
              <ol style={{
                margin: '0',
                paddingLeft: '20px',
                color: '#333333'
              }}>
                <li style={{ marginBottom: '10px' }}>
                  <strong>Consulta:</strong> Contactanos por WhatsApp para consultar disponibilidad y precio
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <strong>Confirmación:</strong> Te confirmamos stock, precio final y modalidad de pago elegida
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <strong>Pago:</strong> Realizás el pago según la modalidad acordada
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <strong>Preparación:</strong> Preparamos tu pedido una vez confirmado el pago
                </li>
                <li>
                  <strong>Entrega:</strong> Te avisamos cuando esté listo para coordinar la entrega
                </li>
              </ol>
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
            ¿Tenés alguna consulta sobre nuestros métodos de pago?
          </p>
          <a
            href="https://wa.me/+5492954227622?text=Hola,%20tengo%20consultas%20sobre%20métodos%20de%20pago%20y%20cómo%20comprar"
            target="_blank"
            rel="noopener noreferrer"
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
            📱 Consultar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default HowToBuy;
