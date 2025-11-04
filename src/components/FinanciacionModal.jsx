import React, { useState } from 'react';

const FinanciacionModal = ({ isOpen, onClose, isMobile }) => {
  const [importeFinanciar, setImporteFinanciar] = useState('');
  const [cuotasCalculadas, setCuotasCalculadas] = useState(null);

  // Función para formatear el número mientras se escribe
  const formatearNumero = (value) => {
    // Remover todo lo que no sea número
    const numeroLimpio = value.replace(/\D/g, '');
    
    if (!numeroLimpio) return '';
    
    // Convertir a número y formatear con separadores de miles
    const numero = parseInt(numeroLimpio);
    return `$ ${numero.toLocaleString('es-AR')}`;
  };

  // Función para obtener el valor numérico limpio
  const obtenerValorNumerico = (valorFormateado) => {
    return parseInt(valorFormateado.replace(/\D/g, '') || '0');
  };

  // Manejar cambios en el input
  const handleInputChange = (e) => {
    const valorFormateado = formatearNumero(e.target.value);
    setImporteFinanciar(valorFormateado);
  };

  // Función para calcular las cuotas de financiación
  const calcularCuotas = () => {
    const importe = obtenerValorNumerico(importeFinanciar);
    
    if (!importe || importe <= 0) {
      alert('Por favor, ingrese un importe válido');
      return;
    }

    // Coeficientes de financiación
    const coeficientes = {
      cuotas3: 0.7387985215163987,
      cuotas6: 0.6196000001189632,
      cuotas12: 0.4156999996196345
    };

    const resultados = {
      importe: importe,
      cuotas3: {
        total: Math.round((importe / coeficientes.cuotas3) * 100) / 100,
        cuota: Math.round((importe / coeficientes.cuotas3 / 3) * 100) / 100
      },
      cuotas6: {
        total: Math.round((importe / coeficientes.cuotas6) * 100) / 100,
        cuota: Math.round((importe / coeficientes.cuotas6 / 6) * 100) / 100
      },
      cuotas12: {
        total: Math.round((importe / coeficientes.cuotas12) * 100) / 100,
        cuota: Math.round((importe / coeficientes.cuotas12 / 12) * 100) / 100
      }
    };

    setCuotasCalculadas(resultados);
  };

  // Limpiar cálculo
  const limpiarCalculo = () => {
    setCuotasCalculadas(null);
    setImporteFinanciar('');
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: isMobile ? '20px' : '40px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: isMobile ? '20px' : '30px',
        width: '100%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
      }}>
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#666',
            width: '30px',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'rgba(0, 0, 0, 0.1)';
            e.target.style.color = '#000';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'none';
            e.target.style.color = '#666';
          }}
        >
          ×
        </button>

        {/* Título */}
        <h2 style={{
          fontSize: isMobile ? '24px' : '28px',
          fontWeight: '700',
          color: '#00aa00',
          margin: '0 0 25px 0',
          textAlign: 'center',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px'
        }}>
          💳 Simulación de Financiación
        </h2>

        {/* Formulario de cálculo */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(0, 241, 0, 0.1) 0%, rgba(0, 204, 0, 0.05) 100%)',
          border: '2px solid rgba(0, 241, 0, 0.3)',
          borderRadius: '15px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: '15px',
            alignItems: isMobile ? 'stretch' : 'center',
            justifyContent: 'center'
          }}>
            <input 
              style={{
                padding: '15px 20px',
                borderRadius: '12px',
                border: '2px solid rgba(0, 241, 0, 0.4)',
                fontSize: '18px',
                fontWeight: '600',
                outline: 'none',
                transition: 'all 0.3s ease',
                background: 'rgba(255, 255, 255, 0.9)',
                color: '#333',
                minWidth: isMobile ? '100%' : '280px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
                // Ocultar las flechitas del input number
                MozAppearance: 'textfield'
              }}
              type="text"
              inputMode="numeric"
              value={importeFinanciar}
              onChange={handleInputChange}
              placeholder="💰 Ingrese el importe"
              onFocus={(e) => {
                e.target.style.borderColor = '#00F100';
                e.target.style.boxShadow = '0 0 0 3px rgba(0, 241, 0, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(0, 241, 0, 0.4)';
                e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              }}
            />
            <button 
              onClick={calcularCuotas}
              style={{
                padding: '15px 30px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #00F100 0%, #00cc00 100%)',
                color: '#000',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(0, 241, 0, 0.4)',
                minWidth: isMobile ? '100%' : '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                whiteSpace: 'nowrap'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(0, 241, 0, 0.6)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(0, 241, 0, 0.4)';
              }}
            >
              🧮 Calcular Cuotas
            </button>
          </div>
        </div>

        {/* Resultados de cuotas calculadas */}
        {cuotasCalculadas && (
          <div style={{
            marginTop: '25px',
            padding: '20px',
            background: 'linear-gradient(135deg, rgba(0, 241, 0, 0.08) 0%, rgba(0, 204, 0, 0.03) 100%)',
            borderRadius: '15px',
            border: '2px solid rgba(0, 241, 0, 0.2)',
            boxShadow: '0 8px 25px rgba(0, 241, 0, 0.1)'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#00aa00',
              margin: '0 0 20px 0',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}>
              💰 Resultados para ${cuotasCalculadas.importe.toLocaleString('es-AR')}
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
              gap: '15px'
            }}>
              {/* 3 cuotas */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid rgba(0, 241, 0, 0.3)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#00aa00',
                  marginBottom: '10px'
                }}>
                  🏦 3 Cuotas
                </div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#000',
                  marginBottom: '8px'
                }}>
                  ${cuotasCalculadas.cuotas3.cuota.toLocaleString('es-AR')} c/u
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#666',
                  marginBottom: '5px'
                }}>
                  Total: ${cuotasCalculadas.cuotas3.total.toLocaleString('es-AR')}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#00aa00',
                  fontWeight: '600'
                }}>
                  Interés incluido
                </div>
              </div>

              {/* 6 cuotas */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid rgba(0, 241, 0, 0.3)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#00aa00',
                  marginBottom: '10px'
                }}>
                  💳 6 Cuotas
                </div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#000',
                  marginBottom: '8px'
                }}>
                  ${cuotasCalculadas.cuotas6.cuota.toLocaleString('es-AR')} c/u
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#666',
                  marginBottom: '5px'
                }}>
                  Total: ${cuotasCalculadas.cuotas6.total.toLocaleString('es-AR')}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#00aa00',
                  fontWeight: '600'
                }}>
                  Interés incluido
                </div>
              </div>

              {/* 12 cuotas */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid rgba(0, 241, 0, 0.3)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#00aa00',
                  marginBottom: '10px'
                }}>
                  📅 12 Cuotas
                </div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#000',
                  marginBottom: '8px'
                }}>
                  ${cuotasCalculadas.cuotas12.cuota.toLocaleString('es-AR')} c/u
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#666',
                  marginBottom: '5px'
                }}>
                  Total: ${cuotasCalculadas.cuotas12.total.toLocaleString('es-AR')}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#00aa00',
                  fontWeight: '600'
                }}>
                  Interés incluido
                </div>
              </div>
            </div>

            {/* Botón para limpiar resultados */}
            <div style={{
              textAlign: 'center',
              marginTop: '20px'
            }}>
              <button
                onClick={limpiarCalculo}
                style={{
                  padding: '10px 25px',
                  borderRadius: '8px',
                  border: '1px solid rgba(0, 241, 0, 0.4)',
                  background: 'transparent',
                  color: '#00aa00',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'rgba(0, 241, 0, 0.1)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'transparent';
                }}
              >
                🗑️ Limpiar Cálculo
              </button>
            </div>
          </div>
        )}

        {/* Información adicional */}
        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: 'rgba(0, 241, 0, 0.05)',
          borderRadius: '10px',
          border: '1px solid rgba(0, 241, 0, 0.2)'
        }}>
          <p style={{
            margin: '0',
            fontSize: '14px',
            color: '#00aa00',
            fontWeight: '500',
            textAlign: 'center',
            lineHeight: '1.5'
          }}>
            💡 Los cálculos son aproximados. Para información exacta y condiciones específicas, 
            contáctanos por WhatsApp.
          </p>
        </div>
      </div>

      {/* Estilos CSS para ocultar las flechitas en input number */}
      <style>
        {`
          input[type="number"]::-webkit-outer-spin-button,
          input[type="number"]::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          input[type="number"] {
            -moz-appearance: textfield;
          }
        `}
      </style>
    </div>
  );
};

export default FinanciacionModal;