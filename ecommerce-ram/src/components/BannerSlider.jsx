import React, { useState, useEffect } from 'react';
import { COLORS } from '../utils/colors';

const BannerSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const banners = [
    { id: 5, image: 'src/assets/banners/ipads.png' },
    { id: 1, image: 'src/assets/banners/consolas.png' },
    { id: 2, image: 'src/assets/banners/notebooks.png' },
    { id: 3, image: 'src/assets/banners/smartwatch.png' },
    { id: 4, image: 'src/assets/banners/televisores.png' },

  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '650px',
      borderRadius: '20px',
      overflow: 'hidden',
      margin: '20px 0',
      boxShadow: COLORS.shadow.xl
    }}>
      {banners.map((banner, index) => (
        <img
          key={banner.id}
          src={banner.image}
          alt={`Banner ${banner.id}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
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
