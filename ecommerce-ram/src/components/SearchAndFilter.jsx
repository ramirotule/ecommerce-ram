import React, { useState, useEffect } from 'react';
import { COLORS } from '../utils/colors';

const SearchAndFilter = ({ busqueda, setBusqueda, categoria, setCategoria, categorias, totalProductos, productos }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  // Generar sugerencias basadas en la búsqueda
  useEffect(() => {
    if (busqueda.length > 1 && productos) {
      const filteredSuggestions = productos
        .filter(producto => 
          producto.producto.toLowerCase().includes(busqueda.toLowerCase())
        )
        .slice(0, 10) // Mostrar máximo 10 sugerencias
        .map(producto => ({
          id: producto.producto,
          texto: producto.producto,
          precio: producto.precio_usd,
          categoria: producto.categoria
        }));
      
      setSuggestions(filteredSuggestions);
      setShowSuggestions(filteredSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [busqueda, productos]);

  const handleSuggestionClick = (suggestion) => {
    setBusqueda(suggestion.texto);
    setShowSuggestions(false);
    
    // Scroll automático al producto
    setTimeout(() => {
      const productCards = document.querySelectorAll('[data-product-name]');
      const targetCard = Array.from(productCards).find(card => 
        card.dataset.productName === suggestion.texto
      );
      
      if (targetCard) {
        targetCard.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        // Agregar efecto de highlight
        targetCard.style.transform = 'scale(1.05)';
        targetCard.style.boxShadow = '0 0 30px rgba(0, 241, 0, 0.3)';
        setTimeout(() => {
          targetCard.style.transform = '';
          targetCard.style.boxShadow = '';
        }, 2000);
      }
    }, 300);
  };

  // Función para truncar texto
  const truncateText = (text, maxLength = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <>
      {/* Estilos CSS para scrollbar personalizado */}
      <style>
        {`
          .suggestions-container::-webkit-scrollbar {
            width: 6px;
          }
          
          .suggestions-container::-webkit-scrollbar-track {
            background: ${COLORS.neutral[100]};
            border-radius: 10px;
          }
          
          .suggestions-container::-webkit-scrollbar-thumb {
            background: ${COLORS.neutral[400]};
            border-radius: 10px;
            transition: background 0.3s ease;
          }
          
          .suggestions-container::-webkit-scrollbar-thumb:hover {
            background: ${COLORS.neutral[500]};
          }
        `}
      </style>

    <div style={{
      background: COLORS.background.card,
      borderRadius: '15px',
      padding: '20px',
      margin: '20px 0',
      boxShadow: COLORS.shadow.md,
      border: `1px solid ${COLORS.neutral[200]}`
    }}>
      {/* Título compacto */}
      <div style={{
        textAlign: 'center',
        marginBottom: '15px'
      }}>
        <h2 style={{
          margin: 0,
          fontSize: '20px',
          fontWeight: '700'
        }}>
          <span>🔭</span> <span style={{
            background: 'linear-gradient(135deg, #00F100 0%, #000000 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>Encuentra tu producto ideal</span>
        </h2>
        <p style={{
          margin: '5px 0 0 0',
          color: COLORS.text.secondary,
          fontSize: '12px'
        }}>
          {totalProductos} productos disponibles
        </p>
      </div>

      {/* Barra de búsqueda con filtro separado */}
      <div style={{
        display: 'flex',
        gap: '40px',
        maxWidth: '800px',
        margin: '0 auto',
        alignItems: 'center'
      }}>
        {/* Input de búsqueda */}
        <div style={{
          position: 'relative',
          flex: 1
        }}>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            style={{ 
              width: '100%',
              padding: '12px 20px 12px 45px',
              border: `2px solid ${COLORS.neutral[200]}`,
              borderRadius: '25px',
              fontSize: '14px',
              outline: 'none',
              transition: 'all 0.3s ease',
              background: COLORS.neutral[50],
              boxShadow: COLORS.shadow.sm
            }}
            onFocus={(e) => {
              e.target.style.borderColor = COLORS.primary.main;
              e.target.style.background = COLORS.background.card;
              e.target.style.boxShadow = COLORS.shadow.primary;
            }}
            onBlur={(e) => {
              // Delay para permitir click en sugerencias
              setTimeout(() => {
                setShowSuggestions(false);
              }, 200);
              e.target.style.borderColor = COLORS.neutral[200];
              e.target.style.background = COLORS.neutral[50];
              e.target.style.boxShadow = COLORS.shadow.sm;
            }}
          />
          <div style={{
            position: 'absolute',
            left: '15px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '16px',
            color: COLORS.text.secondary
          }}>
            🔍
          </div>
          {busqueda && (
            <button
              onClick={() => setBusqueda('')}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                fontSize: '16px',
                color: COLORS.text.secondary,
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '50%',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = COLORS.neutral[100];
                e.target.style.color = '#dc3545';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'none';
                e.target.style.color = COLORS.text.secondary;
              }}
            >
              ✕
            </button>
          )}

          {/* Dropdown de sugerencias */}
          {showSuggestions && suggestions.length > 0 && (
            <div 
              className="suggestions-container"
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: '5px',
                background: 'white',
                borderRadius: '15px',
                boxShadow: COLORS.shadow.xl,
                border: `1px solid ${COLORS.neutral[200]}`,
                zIndex: 2000,
                maxHeight: '280px',
                overflowY: 'auto',
                overflowX: 'hidden',
                scrollbarWidth: 'thin',
                scrollbarColor: `${COLORS.neutral[400]} ${COLORS.neutral[100]}`
              }}>
              {suggestions.map((suggestion, index) => (
                <div
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    borderBottom: index < suggestions.length - 1 ? `1px solid ${COLORS.neutral[100]}` : 'none',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderRadius: index === 0 ? '15px 15px 0 0' : 
                               index === suggestions.length - 1 ? '0 0 15px 15px' : '0'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = COLORS.neutral[50];
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'white';
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: COLORS.text.primary,
                      marginBottom: '2px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {truncateText(suggestion.texto, 45)}
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: COLORS.text.secondary,
                      textTransform: 'uppercase'
                    }}>
                      {suggestion.categoria}
                    </div>
                  </div>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '900',
                    color: 'black',
                    marginLeft: '10px'
                  }}>
                    U$S {suggestion.precio.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botón de filtro dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            style={{
              padding: '12px 20px',
              border: `2px solid ${COLORS.neutral[300]}`,
              borderRadius: '25px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              background: 'white',
              color: 'black',
              boxShadow: COLORS.shadow.sm,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              minWidth: '160px',
              justifyContent: 'center',
              marginLeft: '30px'
            }}
            onMouseOver={(e) => {
              e.target.style.background = COLORS.neutral[50];
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = COLORS.shadow.md;
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'white';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = COLORS.shadow.sm;
            }}
          >
            🔽 {categoria === 'TODOS' ? 'Filtrar' : categoria}
          </button>

          {/* Dropdown */}
          {showDropdown && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '15px',
              background: 'white',
              borderRadius: '15px',
              boxShadow: COLORS.shadow.xl,
              border: `1px solid ${COLORS.neutral[200]}`,
              zIndex: 1000,
              minWidth: '240px',
              maxHeight: '300px',
              overflowY: 'auto'
            }}>
              {categorias.map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    setCategoria(cat);
                    setShowDropdown(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    background: cat === categoria ? COLORS.neutral[100] : 'white',
                    color: 'black',
                    fontSize: '14px',
                    fontWeight: cat === categoria ? '600' : '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left',
                    borderRadius: cat === categorias[0] ? '15px 15px 0 0' : 
                              cat === categorias[categorias.length - 1] ? '0 0 15px 15px' : '0'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = COLORS.neutral[100];
                  }}
                  onMouseOut={(e) => {
                    if (cat !== categoria) {
                      e.target.style.background = 'white';
                    } else {
                      e.target.style.background = COLORS.neutral[100];
                    }
                  }}
                >
                  {cat === "TODOS" ? "📋 Todas las categorías" : `🏷️ ${cat}`}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default SearchAndFilter;
