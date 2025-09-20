import React, { useState } from "react";
import { crearEnlaceWhatsAppSeguro } from "../utils/whatsappHelper";
import { COLORS } from '../utils/colors';

const ProductCard = ({ producto, index }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Usar la función segura que maneja mejor los emojis
  const link = crearEnlaceWhatsAppSeguro(producto);
  
  // Usar la propiedad 'imagen' del producto
  const imagen = `/assets/productos/${producto.imagen}`;

  return (
    <div 
      style={{
        background: COLORS.background.card,
        borderRadius: '20px',
        padding: '0',
        width: '280px',
        backgroundColor: COLORS.background.card,
        boxShadow: COLORS.shadow.lg,
        transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
        border: `1px solid ${COLORS.neutral[200]}`,
        animationDelay: `${index * 0.1}s`,
        animation: 'fadeInUp 0.6s ease-out forwards',
        opacity: 0,
        transform: 'translateY(30px)'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-10px) rotateY(5deg)';
        e.currentTarget.style.boxShadow = COLORS.shadow.xl;
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0) rotateY(0deg)';
        e.currentTarget.style.boxShadow = COLORS.shadow.lg;
      }}
    >
      {/* Imagen del producto */}
      <div style={{
        position: 'relative',
        height: '200px',
        overflow: 'hidden',
        borderRadius: '20px 20px 0 0',
        background: `linear-gradient(135deg, ${COLORS.neutral[50]} 0%, ${COLORS.neutral[100]} 100%)`
      }}>
        {!imageError ? (
          <img 
            src={imagen} 
            alt={producto.producto} 
            style={{ 
              width: "80%", 
              height: "80%", 
              objectFit: "contain",
              transition: 'all 0.4s ease',
              opacity: imageLoaded ? 1 : 0,
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }} 
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              console.log(`Imagen no encontrada: ${imagen}`);
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translate(-50%, -50%) scale(1.1)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translate(-50%, -50%) scale(1)';
            }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '48px',
            color: COLORS.neutral[300]
          }}>
            📦
          </div>
        )}
        
        {/* Overlay con gradiente */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: 'linear-gradient(transparent, rgba(0,0,0,0.3))',
          pointerEvents: 'none'
        }} />
        
        {/* Badge de categoría */}
        <div style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          padding: '6px 12px',
          borderRadius: '15px',
          fontSize: '10px',
          fontWeight: '700',
          color: '#000000',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          boxShadow: COLORS.shadow.md
        }}>
          {producto.categoria}
        </div>
      </div>

      {/* Contenido */}
      <div style={{ padding: '25px' }}>
        {/* Título del producto */}
        <h4 
          title={producto.producto}
          style={{ 
            margin: "0 0 15px 0", 
            fontSize: "16px", 
            lineHeight: "1.4",
            height: "45px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            fontWeight: '600',
            color: COLORS.text.primary,
            textAlign: 'center',
            cursor: 'help'
          }}
        >
          {producto.producto}
        </h4>
        
        {/* Precio */}
        <div style={{
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          <span style={{ 
            fontSize: "28px", 
            fontWeight: "800", 
            background: 'linear-gradient(135deg, #00F100 0%, #000000 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            display: 'inline-block',
            margin: "0"
          }}>
            U$S {producto.precio_usd.toLocaleString()}
          </span>
        </div>
        
        {/* Botón de WhatsApp */}
        <a href={link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
          <button style={{ 
            width: '100%',
            padding: "15px 20px", 
            background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
            color: "#fff", 
            border: "none", 
            borderRadius: '15px',
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "700",
            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
            boxShadow: '0 8px 25px rgba(37, 211, 102, 0.3)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-3px)';
            e.target.style.boxShadow = '0 12px 35px rgba(37, 211, 102, 0.4)';
            e.target.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a085 100%)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 8px 25px rgba(37, 211, 102, 0.3)';
            e.target.style.background = 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)';
          }}
          >
            💬 Consultar por WhatsApp
          </button>
        </a>
      </div>
    </div>
  );
};

export default ProductCard;