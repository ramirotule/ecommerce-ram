import { useEffect, useState } from 'react';

const FloatingWhatsApp = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detectar si es móvil
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    // Manejar el scroll
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    // Agregar CSS para la animación de pulse
    const style = document.createElement('style');
    style.textContent = `
      @keyframes whatsapp-pulse {
        0% {
          box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
          transform: scale(1);
        }
        50% {
          box-shadow: 0 6px 25px rgba(37, 211, 102, 0.8);
          transform: scale(1.02);
        }
        100% {
          box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
          transform: scale(1);
        }
      }
      
      .floating-whatsapp {
        animation: whatsapp-pulse 3s infinite;
      }
      
      .floating-whatsapp:hover {
        animation-play-state: paused;
      }
      
      @media (max-width: 768px) {
        .floating-whatsapp img {
          width: 30px !important;
          height: 30px !important;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
      window.removeEventListener('scroll', handleScroll);
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        ...(isMobile 
          ? {
              bottom: '5px',  // En móvil, posicionado en la parte inferior
              right: '20px'
            }
          : {
              top: `${15 + scrollY * 0.1}px`, // En desktop mantiene la posición original en la parte superior
              right: '20px'
            }
        ),
        zIndex: 9999,
        cursor: 'pointer',
        transition: isMobile ? 'none' : 'top 0.1s ease-out'
      }}
    >
      <a
        href="https://wa.me/+5492954227622?text=Hola,%20estoy%20en%20tu%20tienda%20y%20quisiera%20hacerte%20algunas%20consultas"
        target="_blank"
        rel="noopener noreferrer"
        className="floating-whatsapp"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: isMobile ? '55px' : '60px',
          height: isMobile ? '55px' : '60px',
          backgroundColor: '#25d366',
          borderRadius: '50%',
          boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)',
          transition: 'all 0.3s ease',
          textDecoration: 'none',
          border: 'none'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'scale(1.15)';
          e.currentTarget.style.boxShadow = '0 8px 30px rgba(37, 211, 102, 0.7)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(37, 211, 102, 0.4)';
        }}
        title="¡Contáctanos por WhatsApp!"
      >
        <img 
          src="/whatsapp-logo.png" 
          alt="WhatsApp" 
          style={{
            width: isMobile ? '30px' : '35px',
            height: isMobile ? '30px' : '35px',
            objectFit: 'contain',
            pointerEvents: 'none' // Evitar problemas con el hover
          }}
        />
      </a>
    </div>
  );
};

export default FloatingWhatsApp;
