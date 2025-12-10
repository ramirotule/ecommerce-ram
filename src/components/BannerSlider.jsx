import React, { useState, useEffect } from 'react';
import { COLORS } from '../utils/colors';

const BannerSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  const banners = [
    { 
      id: 0, 
      image: '/banners/celulares.png',
      mobileImage: '/banners/celulares-mobile.png' // No tiene versión móvil específica
    },

    { 
      id: 5, 
      image: '/banners/ipads.png',
      mobileImage: '/banners/ipads-mobile.png' // No tiene versión móvil específica
    },
    { 
      id: 1, 
      image: '/banners/consolas.png',
      mobileImage: '/banners/consolas-mobile.png'
    },
    { 
      id: 2, 
      image: '/banners/notebooks.png',
      mobileImage: '/banners/notebooks-mobile.png' // No tiene versión móvil específica
    },
    { 
      id: 3, 
      image: '/banners/smartwatch.png',
      mobileImage: '/banners/smartwatch-mobile.png'
    },
    { 
      id: 4, 
      image: '/banners/televisores.png',
      mobileImage: '/banners/televisores-mobile.png' // No tiene versión móvil específica
    },
  ];

  // Función para obtener la imagen correcta según el dispositivo
  const getImageSrc = (banner) => {
    return isMobile ? banner.mobileImage : banner.image;
  };

  useEffect(() => {
    // Detectar si es móvil
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', checkIsMobile);
    };
  }, [banners.length]);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: isMobile ? '400px' : '650px', // Altura más grande en móvil
      borderRadius: isMobile ? '15px' : '20px',
      overflow: 'hidden',
      margin: isMobile ? '15px 0' : '20px 0', // Menos margen en móvil para acercarlo al header
      boxShadow: COLORS.shadow.xl,
    }}>
      {banners.map((banner, index) => (
        <img
          key={banner.id}
          src={getImageSrc(banner)}
          alt={`Banner ${banner.id}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: isMobile ? 'cover' : 'contain', // Cover en móvil para llenar mejor el espacio
            opacity: currentSlide === index ? 1 : 0,
            transition: 'opacity 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)',
            zIndex: currentSlide === index ? 2 : 1
          }}
        />
      ))}
    </div>
  );
};

export default BannerSlider;
