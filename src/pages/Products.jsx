import React, { useState, useEffect, useCallback } from 'react';
import { COLORS } from '../utils/colors';
import { normalizeName } from '../utils/normalizeName';
import '../animations.css';

// Modal para mostrar detalles del producto
const ProductModal = ({ producto, isOpen, onClose, generateImageFileName, getCategoryIcon }) => {
  if (!isOpen || !producto) return null;

  const categoryFolder = producto.categoria === 'CELULARES SAMSUNG' ? 'CELULARES SAMSUNG' :
                         producto.categoria === 'CELULARES IPHONE NEW' ? 'CELULARES IPHONE NEW' :
                         producto.categoria === 'CELULARES MOTOROLA' ? 'CELULARES MOTOROLA' :
                         producto.categoria === 'CELULARES INFINIX' ? 'CELULARES INFINIX' :
                         producto.categoria.includes('VIDEO JUEGOS') ? 'VIDEOJUEGOS' :
                         producto.categoria.includes('MACBOOK') ? 'macbook' :
                         producto.categoria.includes('WATCH') ? 'smartwatch' :
                         producto.categoria.includes('CELULAR') ? 'celulares' : producto.categoria;

  const imagePath = `/productos/${categoryFolder}/${generateImageFileName(producto.nombre || producto.producto)}`;
  const categoryIcon = getCategoryIcon(producto.categoria);

  const handleWhatsAppContact = () => {
    const capacidades = producto.variants && producto.variants.length > 1 
      ? ` (Capacidades disponibles: ${producto.capacities})`
      : '';
    const mensaje = `Hola! Me interesa el producto: ${producto.nombre || producto.producto}${capacidades} de la categoría ${producto.categoria}. ¿Podrías darme más información?`;
    window.open(`https://wa.me/5491131234567?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
        animation: 'modalFadeIn 0.3s ease-out'
      }}
      onClick={handleOverlayClick}
    >
      <div 
        style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          transform: 'scale(1)',
          animation: 'modalSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón de cierre */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'rgba(0, 0, 0, 0.1)',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            fontSize: '20px',
            cursor: 'pointer',
            zIndex: 1001,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.2)'}
          onMouseOut={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.1)'}
        >
          ✕
        </button>

        {/* Contenido del modal */}
        <div style={{ padding: '30px', paddingTop: '60px' }}>
          {/* Imagen grande */}
          <div style={{
            width: '100%',
            height: '400px',
            backgroundColor: '#ffffff',
            border: '1px solid #f0f0f0',
            borderRadius: '15px',
            marginBottom: '25px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <img
              src={imagePath}
              alt={producto.nombre || producto.producto}
              style={{
                width: '90%',
                height: '90%',
                objectFit: 'contain',
                padding: '15px'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
            <div style={{
              display: 'none',
              fontSize: '120px',
              color: '#999',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '15px',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}>
              <span>{categoryIcon}</span>
              <span style={{ fontSize: '14px', color: '#ccc' }}>
                Imagen no disponible
              </span>
            </div>
          </div>

          {/* Información del producto */}
          <div style={{ textAlign: 'center', marginBottom: '25px' }}>
            {/* Categoría */}
            <div style={{
              fontSize: '14px',
              color: COLORS.accent.primary,
              fontWeight: '600',
              marginBottom: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {producto.categoria}
            </div>

            {/* Nombre del producto */}
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: COLORS.text.primary,
              marginBottom: '15px',
              lineHeight: '1.3'
            }}>
              {producto.nombre || producto.producto}
            </h2>

            {/* Descripción */}
            <div style={{
              fontSize: '16px',
              color: COLORS.text.secondary,
              lineHeight: '1.5',
              marginBottom: '20px'
            }}>
              {producto.descripcion || 'Producto disponible en nuestro catálogo'}
            </div>

            {/* Variantes disponibles */}
            {producto.variants && producto.variants.length > 1 && (
              <div style={{
                background: 'rgba(37, 211, 102, 0.1)',
                border: '1px solid rgba(37, 211, 102, 0.3)',
                borderRadius: '10px',
                padding: '15px',
                marginBottom: '20px'
              }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: COLORS.accent.primary,
                  marginBottom: '8px'
                }}>
                  📋 Variantes disponibles:
                </div>
                <div style={{
                  fontSize: '14px',
                  color: COLORS.text.secondary
                }}>
                  {producto.capacities}
                </div>
              </div>
            )}
          </div>

          {/* Botones de acción */}
          <div style={{ 
            display: 'flex', 
            gap: '15px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {/* Botón WhatsApp principal */}
            <button
              onClick={handleWhatsAppContact}
              style={{
                background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                color: 'white',
                border: 'none',
                padding: '15px 30px',
                borderRadius: '12px',
                fontWeight: '700',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                minWidth: '200px'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(37, 211, 102, 0.5)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0px)';
                e.target.style.boxShadow = '0 4px 15px rgba(37, 211, 102, 0.3)';
              }}
            >
              <span style={{ fontSize: '18px' }}>💬</span>
              Consultar por WhatsApp
            </button>

            {/* Botón secundario */}
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                color: COLORS.text.secondary,
                border: '2px solid #e0e0e0',
                padding: '15px 30px',
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.borderColor = COLORS.accent.primary;
                e.target.style.color = COLORS.accent.primary;
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.borderColor = '#e0e0e0';
                e.target.style.color = COLORS.text.secondary;
                e.target.style.transform = 'translateY(0px)';
              }}
            >
              Ver más productos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente para manejar la imagen del producto con fallback
const ProductImage = ({ producto, generateImageFileName, getCategoryIcon }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Función para mapear categorías a carpetas reales
  const getCategoryFolder = (categoria) => {
    // Mapeo específico por categoría exacta
    if (categoria === 'CELULARES SAMSUNG') {
      return 'CELULARES SAMSUNG';
    }
    if (categoria === 'CELULARES IPHONE NEW') {
      return 'CELULARES IPHONE NEW';
    }
    if (categoria === 'CELULARES MOTOROLA') {
      return 'CELULARES MOTOROLA';
    }
    if (categoria === 'CELULARES INFINIX') {
      return 'CELULARES INFINIX';
    }
    if (categoria.includes('VIDEO JUEGOS')) {
      return 'VIDEOJUEGOS';
    }
    if (categoria.includes('MACBOOK') || categoria.includes('MAC')) {
      return 'macbook';
    }
    if (categoria.includes('WATCH') || categoria.includes('SMART')) {
      return 'smartwatch';
    }
    
    // Fallback: mapeo genérico
    if (categoria.includes('CELULAR')) {
      return 'celulares';
    }
    
    // Default: usar la categoría original
    return categoria;
  };

  // Generar la ruta de la imagen
  const categoryFolder = getCategoryFolder(producto.categoria);
  const imagePath = `/productos/${categoryFolder}/${generateImageFileName(producto.nombre || producto.producto)}`;
  const categoryIcon = getCategoryIcon(producto.categoria);

  // Reset estados cuando cambia el producto
  useEffect(() => {
    setImageError(false);
    setImageLoaded(false);
  }, [imagePath]);

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  return (
    <div style={{
      width: '100%',
      height: '200px',
      background: '#ffffff',
      border: '1px solid #f0f0f0',
      borderRadius: '15px',
      marginBottom: '15px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Imagen real del producto */}
      {!imageError && (
        <img
          src={imagePath}
          alt={producto.nombre || producto.producto}
          onError={handleImageError}
          onLoad={handleImageLoad}
          style={{
            width: '90%',
            height: '90%',
            objectFit: 'contain',
            display: imageLoaded && !imageError ? 'block' : 'none',
            padding: '10px'
          }}
        />
      )}
      
      {/* Fallback: Icono de categoría */}
      {(imageError || !imageLoaded) && (
        <div style={{
          fontSize: '48px',
          color: '#999',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <span>{categoryIcon}</span>
          {imageError && (
            <span style={{
              fontSize: '10px',
              color: '#ccc',
              textAlign: 'center',
              maxWidth: '150px'
            }}>
              Imagen no disponible
            </span>
          )}
        </div>
      )}
      
      {/* Loading state */}
      {!imageLoaded && !imageError && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '20px',
          color: '#ccc'
        }}>
          ⏳
        </div>
      )}
    </div>
  );
};

const Products = () => {
  const [productos, setProductos] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategorias] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Función para generar el nombre de archivo de imagen
  const generateImageFileName = useCallback((nombre) => {
    console.log('generateImageFileName recibió nombre:', nombre);
    if (!nombre) {
      console.error('generateImageFileName: nombre es undefined o null');
      return 'placeholder.jpg';
    }
    let fileName = nombre.toLowerCase();
    
    // Casos especiales específicos primero
    // Infinix GT 30 PRO → FT 30 PRO en los archivos
    if (fileName.includes('infinix gt 30 pro')) {
      fileName = fileName.replace('gt 30 pro', 'ft 30 pro');
    }
    
    // Remover capacidades y conectividad específicamente
    fileName = fileName
      // Remover capacidades RAM/Storage
      .replace(/\s*\d+\/\d+\s*[gt]b/gi, '')
      .replace(/\s*\d+\s*[gt]b/gi, '')
      // Remover conectividad
      .replace(/\s*5g/gi, '')
      .replace(/\s*4g/gi, '')
      .replace(/\s*lte/gi, '')
      // Remover tipo de SIM
      .replace(/\s*sim\/esim/gi, '')
      .replace(/\s*sim/gi, '')
      .replace(/\s*esim/gi, '')
      .replace(/\s*dual/gi, '')
      .replace(/\s*single/gi, '')
      // NO remover NFC para Infinix (se mantiene en los nombres de archivo)
      // .replace(/\s*nfc/gi, '') // Comentado para mantener NFC
      // Remover colores y variantes comunes
      .replace(/\s*blue\/orang\/silver/gi, '')
      .replace(/\s*silver\/orange/gi, '')
      .replace(/\s*blue\/silver/gi, '')
      .replace(/\s*blue/gi, '')
      .replace(/\s*silver/gi, '')
      .replace(/\s*orange/gi, '')
      .replace(/\s*black/gi, '')
      .replace(/\s*white/gi, '')
      .replace(/\s*green/gi, '')
      .replace(/\s*red/gi, '')
      .replace(/\s*purple/gi, '')
      .replace(/\s*gold/gi, '')
      // Remover porcentajes de batería (para productos tester)
      .replace(/\s*bat\s*\d+%/gi, '')
      // Remover espacios primero
      .replace(/\s+/g, '')
      // Remover caracteres especiales EXCEPTO + para Infinix Pro+
      .replace(/[^a-z0-9+]/g, '');
    
    return fileName + '.png';
  }, []);

  // Función para obtener el icono por categoría
  const getCategoryIcon = useCallback((categoria) => {
    if (categoria.includes('CELULAR') || categoria.includes('IPHONE')) return '📱';
    if (categoria.includes('VIDEO JUEGOS')) return '🎮';
    if (categoria.includes('TELEVISOR')) return '📺';
    if (categoria.includes('TABLET')) return '⌨️';
    if (categoria.includes('NOTEBOOK') || categoria.includes('LAPTOP')) return '💻';
    if (categoria.includes('AUDIO') || categoria.includes('AURICULAR')) return '🎧';
    if (categoria.includes('WATCH') || categoria.includes('RELOJ')) return '⌚';
    if (categoria.includes('AIRPODS') || categoria.includes('AURICULARES')) return '🎧';
    if (categoria.includes('IPAD')) return '📱';
    if (categoria.includes('MACBOOK') || categoria.includes('MAC')) return '💻';
    return '📦';
  }, []);

  // Función para extraer el modelo base del nombre del producto
  const extractBaseModel = useCallback((nombre) => {
    // Crear una copia para trabajar
    let resultado = nombre;
    
    // Remover patrones específicos paso a paso
    // 1. Remover RAM/Storage completos primero (más específicos primero)
    resultado = resultado.replace(/\s*\d+\/\d+\s*TB\s*/gi, ' '); // "12/1 TB"
    resultado = resultado.replace(/\s*\d+\/\d+\s*GB\s*/gi, ' '); // "12/256 GB"
    
    // 2. Remover capacidades simples
    resultado = resultado.replace(/\s*\d+\s*TB\s*/gi, ' '); // "1 TB"
    resultado = resultado.replace(/\s*\d+\s*GB\s*/gi, ' '); // "128 GB"
    
    // 3. Limpiar patrones residuales de números/barras que puedan quedar
    resultado = resultado.replace(/\s*\d+\/\s*/gi, ' '); // Limpiar "12/" residual
    resultado = resultado.replace(/\s*\/\d+\s*/gi, ' '); // Limpiar "/256" residual
    
    // 4. Remover conectividad
    resultado = resultado.replace(/\s*5G\s*/gi, ' ');
    resultado = resultado.replace(/\s*4G\s*/gi, ' ');
    resultado = resultado.replace(/\s*LTE\s*/gi, ' ');
    
    // 5. Remover tipos de SIM (mejorado para evitar residuos)
    resultado = resultado.replace(/\s*SIM\/ESIM\s*/gi, ' ');
    resultado = resultado.replace(/\s*ESIM\s*/gi, ' ');
    resultado = resultado.replace(/\s*SIM\s*/gi, ' ');
    resultado = resultado.replace(/\s*DUAL\s*/gi, ' ');
    resultado = resultado.replace(/\s*SINGLE\s*/gi, ' ');
    
    // 6. Remover colores y variantes (agregado)
    resultado = resultado.replace(/\s*BLUE\/ORANG\/SILVER\s*/gi, ' ');
    resultado = resultado.replace(/\s*SILVER\/ORANGE\s*/gi, ' ');
    resultado = resultado.replace(/\s*BLUE\/SILVER\s*/gi, ' ');
    resultado = resultado.replace(/\s*BLUE\s*/gi, ' ');
    resultado = resultado.replace(/\s*SILVER\s*/gi, ' ');
    resultado = resultado.replace(/\s*ORANGE\s*/gi, ' ');
    resultado = resultado.replace(/\s*BLACK\s*/gi, ' ');
    resultado = resultado.replace(/\s*WHITE\s*/gi, ' ');
    resultado = resultado.replace(/\s*GREEN\s*/gi, ' ');
    resultado = resultado.replace(/\s*RED\s*/gi, ' ');
    resultado = resultado.replace(/\s*PURPLE\s*/gi, ' ');
    resultado = resultado.replace(/\s*GOLD\s*/gi, ' ');
    
    // 7. Remover porcentajes de batería para productos tester
    resultado = resultado.replace(/\s*BAT\s*\d+%\s*/gi, ' ');
    
    // 8. Limpiar espacios múltiples y trim (mejorado)
    resultado = resultado.replace(/\s+/g, ' ').trim();
    
    return resultado;
  }, []);

  // Funciones para manejar el modal
  const openModal = (producto) => {
    setSelectedProduct(producto);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setModalOpen(false);
  };

  // Función para agrupar productos por modelo base
  const groupProductsByModel = useCallback((productosArray) => {
    const grouped = {};
    
    productosArray.forEach(producto => {
      const baseModel = extractBaseModel(producto.nombre || producto.producto);
      const key = `${producto.categoria}-${baseModel}`;   
      
      if (!grouped[key]) {
        grouped[key] = {
          baseModel: baseModel,
          categoria: producto.categoria,
          variants: [],
          originalProduct: producto // Guardar el primer producto para usar sus datos base
        };
      }
      
      // Extraer la capacidad o variante específica (RAM/Storage o solo Storage)
      const ramStorageGBMatch = (producto.nombre || producto.producto).match(/\d+\/\d+\s+GB/i);
      const ramStorageTBMatch = (producto.nombre || producto.producto).match(/\d+\/\d+\s+TB/i);
      const simpleGBMatch = (producto.nombre || producto.producto).match(/\d+\s+GB/i);
      const simpleTBMatch = (producto.nombre || producto.producto).match(/\d+\s+TB/i);
      
      let capacity = '';
      if (ramStorageGBMatch) {
        capacity = ramStorageGBMatch[0]; // "12/256 GB"
      } else if (ramStorageTBMatch) {
        capacity = ramStorageTBMatch[0]; // "12/1 TB"
      } else if (simpleGBMatch) {
        capacity = simpleGBMatch[0]; // "128 GB"
      } else if (simpleTBMatch) {
        capacity = simpleTBMatch[0]; // "1 TB"
      }
      
      grouped[key].variants.push({
        fullName: producto.nombre || producto.producto,
        capacity: capacity,
        ...producto
      });
    });
    
    // Convertir el objeto agrupado en array
    return Object.values(grouped).map(group => ({
      // Usar datos del primer producto para propiedades base PRIMERO
      ...group.originalProduct,
      // LUEGO sobrescribir con los valores agrupados (esto es importante para el orden)
      nombre: group.baseModel,
      categoria: group.categoria,
      variants: group.variants,
      capacities: group.variants.map(v => v.capacity).filter(c => c).join(', '),
      descripcion: 'Producto disponible en nuestro catálogo'
    }));
  }, [extractBaseModel]);

  useEffect(() => {
    fetch('/productos_ram.json')
      .then(response => response.json())
      .then(data => {
        if (data.metadatos && data.productos) {
          // La nueva estructura tiene productos como array directo
          if (Array.isArray(data.productos)) {
            // Agrupar productos por categoría
            const productosAgrupados = {};
            const categoriasEncontradas = new Set();
            
            data.productos.forEach(producto => {
              const categoria = producto.categoria || 'OTROS';
              if (!productosAgrupados[categoria]) {
                productosAgrupados[categoria] = [];
              }
              // Normalizar el nombre del producto para compatibilidad
              const productoNormalizado = {
                ...producto,
                nombre: producto.nombre || producto.producto // Compatibilidad con ambos formatos
              };
              productosAgrupados[categoria].push(productoNormalizado);
              categoriasEncontradas.add(categoria);
            });
            
            setProductos(productosAgrupados);
            setCategorias(Array.from(categoriasEncontradas));
            setFilteredProducts(data.productos.map(p => ({
              ...p,
              nombre: p.nombre || p.producto // Compatibilidad con ambos formatos
            })));
          } else {
            // Estructura anterior (por compatibilidad)
            let productosArray = [];
            
            Object.keys(data.productos).forEach(categoria => {
              if (Array.isArray(data.productos[categoria])) {
                data.productos[categoria].forEach(producto => {
                  productosArray.push({
                    ...producto,
                    categoria: categoria,
                    nombre: producto.nombre || producto.producto // Compatibilidad
                  });
                });
              }
            });
            
            setProductos(data.productos);
            setCategorias(Object.keys(data.productos));
            setFilteredProducts(productosArray);
          }
        }
      })
      .catch(error => {
        console.error('Error cargando productos:', error);
      });
  }, []);

  useEffect(() => {
    let productosArray = [];
    
    Object.keys(productos).forEach(categoria => {
      if (Array.isArray(productos[categoria])) {
        productos[categoria].forEach(producto => {
          productosArray.push({
            ...producto,
            categoria: categoria
          });
        });
      }
    });

    // Agrupar productos por modelo base
    productosArray = groupProductsByModel(productosArray);

    // Filtrar por término de búsqueda
    if (searchTerm) {
      productosArray = productosArray.filter(producto =>
        normalizeName(producto.nombre || producto.producto).includes(normalizeName(searchTerm)) ||
        normalizeName(producto.categoria).includes(normalizeName(searchTerm)) ||
        (producto.variants && producto.variants.some(v => 
          normalizeName(v.fullName).includes(normalizeName(searchTerm))
        ))
      );
    }

    // Filtrar por categoría
    if (selectedCategory) {
      productosArray = productosArray.filter(producto => 
        producto.categoria === selectedCategory
      );
    }

    setFilteredProducts(productosArray);
  }, [productos, searchTerm, selectedCategory, groupProductsByModel, extractBaseModel]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${COLORS.background.primary} 0%, ${COLORS.background.secondary} 100%)`,
      paddingBottom: '50px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        
        {/* Título y última actualización */}
        <div style={{
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            background: `linear-gradient(135deg, ${COLORS.text.primary} 0%, ${COLORS.accent.primary} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '10px'
          }}>
            📦 Catálogo de Productos
          </h1>
          
          
        </div>

        {/* Barra de búsqueda y filtros */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '25px',
          marginBottom: '30px',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)'
        }}>
          
          {/* Buscador */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="🔍 Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  flex: 1,
                  padding: '15px 20px',
                  fontSize: '16px',
                  border: '2px solid rgba(37, 211, 102, 0.3)',
                  borderRadius: '15px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  background: 'rgba(255, 255, 255, 0.9)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = COLORS.accent.primary;
                  e.target.style.boxShadow = `0 0 15px ${COLORS.accent.primary}40`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(37, 211, 102, 0.3)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              
              {/* Botón Resetear Filtros */}
              <button
                onClick={clearFilters}
                style={{
                  background: 'linear-gradient(135deg, #6c757d 0%, #495057 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '15px 20px',
                  borderRadius: '15px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #5a6268 0%, #343a40 100%)';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 20px rgba(108, 117, 125, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #6c757d 0%, #495057 100%)';
                  e.target.style.transform = 'translateY(0px)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                🔄 Resetear
              </button>
            </div>
          </div>

          {/* Selector de categorías */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            alignItems: 'center'
          }}>
            <span style={{ fontWeight: '600', marginRight: '10px' }}>Categorías:</span>
            
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSearchTerm(''); // Resetear búsqueda al cambiar categoría
              }}
              style={{
                padding: '8px 15px',
                borderRadius: '10px',
                border: '2px solid rgba(37, 211, 102, 0.3)',
                background: 'white',
                fontSize: '14px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="">Todas las categorías</option>
              {categories.map(categoria => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Contador de resultados */}
        <div style={{
          textAlign: 'center',
          marginBottom: '20px',
          fontSize: '16px',
          color: COLORS.text.secondary
        }}>
          📦 Mostrando {filteredProducts.length} productos
          {selectedCategory && ` en "${selectedCategory}"`}
          {searchTerm && ` que coinciden con "${searchTerm}"`}
        </div>

        {/* Grid de productos */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '25px',
          marginTop: '20px'
        }}>
          {filteredProducts.map((producto, index) => (
            <div
              key={`${producto.categoria}-${index}`}
              onClick={() => openModal(producto)}
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.2)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
              }}
            >
              {/* Imagen del producto */}
              <ProductImage 
                producto={producto} 
                generateImageFileName={generateImageFileName}
                getCategoryIcon={getCategoryIcon}
              />

              {/* Información del producto */}
              <div>
                {/* Categoría */}
                <div style={{
                  fontSize: '12px',
                  color: COLORS.accent.primary,
                  fontWeight: '600',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {producto.categoria}
                </div>

                {/* Nombre del producto */}
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: COLORS.text.primary,
                  marginBottom: '10px',
                  lineHeight: '1.3'
                }}>
                  {producto.nombre || producto.producto || 'Producto sin nombre'}
                </h3>

                {/* Descripción o características */}
                <div style={{
                  fontSize: '14px',
                  color: COLORS.text.secondary,
                  lineHeight: '1.4',
                  marginBottom: '15px'
                }}>
                  {producto.descripcion || 'Producto disponible en nuestro catálogo'}
                </div>

                {/* Indicador de clic para abrir modal */}
                <div style={{
                  width: '100%',
                  background: `linear-gradient(135deg, ${COLORS.accent.primary}20 0%, ${COLORS.accent.primary}10 100%)`,
                  color: COLORS.accent.primary,
                  border: `1px solid ${COLORS.accent.primary}30`,
                  padding: '12px',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '14px',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}>
                  <span style={{ fontSize: '16px', marginRight: '8px' }}>�</span>
                  Haz clic para más detalles
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mensaje cuando no hay resultados */}
        {filteredProducts.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔍</div>
            <h3 style={{
              fontSize: '24px',
              color: COLORS.text.primary,
              marginBottom: '10px'
            }}>
              No se encontraron productos
            </h3>
            <p style={{
              fontSize: '16px',
              color: COLORS.text.secondary,
              marginBottom: '20px'
            }}>
              Intenta con otros términos de búsqueda o revisa todas las categorías
            </p>
            {(searchTerm || selectedCategory) && (
              <button
                onClick={clearFilters}
                style={{
                  background: COLORS.accent.primary,
                  color: 'white',
                  border: 'none',
                  padding: '12px 25px',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                🔄 Ver todos los productos
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal de producto */}
      <ProductModal 
        producto={selectedProduct}
        isOpen={modalOpen}
        onClose={closeModal}
        generateImageFileName={generateImageFileName}
        getCategoryIcon={getCategoryIcon}
      />
    </div>
  );
};

export default Products;