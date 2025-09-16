// src/utils/colors.js

/**
 * Paleta de colores basada en el branding de RAM Informática
 * Inspirada en tecnología, confianza y modernidad
 */

export const COLORS = {
  // Colores principales - Azul tecnológico
  primary: {
    main: '#2563eb',        // Azul principal
    light: '#3b82f6',       // Azul más claro
    dark: '#1d4ed8',        // Azul más oscuro
    gradient: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
  },
  
  // Colores secundarios - Naranja energético
  secondary: {
    main: '#f59e0b',        // Naranja principal
    light: '#fbbf24',       // Naranja claro
    dark: '#d97706',        // Naranja oscuro
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
  },
  
  // Colores de acento - Verde éxito
  accent: {
    success: '#10b981',     // Verde éxito
    warning: '#f59e0b',     // Amarillo advertencia
    error: '#ef4444',       // Rojo error
    info: '#3b82f6'         // Azul información
  },
  
  // WhatsApp mantiene su color característico
  whatsapp: {
    main: '#25d366',
    dark: '#128c7e',
    gradient: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)'
  },
  
  // Grises neutros
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a'
  },
  
  // Colores de fondo
  background: {
    main: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    card: '#ffffff',
    muted: '#f1f5f9'
  },
  
  // Colores de texto
  text: {
    primary: '#1e293b',
    secondary: '#64748b',
    muted: '#94a3b8',
    white: '#ffffff'
  },
  
  // Sombras
  shadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    primary: '0 10px 25px -5px rgba(37, 99, 235, 0.25)',
    secondary: '0 10px 25px -5px rgba(245, 158, 11, 0.25)'
  }
};

// Funciones helper para trabajar con colores
export const getGradient = (color1, color2, direction = '135deg') => {
  return `linear-gradient(${direction}, ${color1} 0%, ${color2} 100%)`;
};

export const withOpacity = (color, opacity) => {
  return `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
};
