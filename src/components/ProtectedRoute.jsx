import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAdminAuthenticated');
    const loginTime = localStorage.getItem('adminLoginTime');
    
    // Verificar si está autenticado y si la sesión no ha expirado (24 horas)
    const isSessionValid = isAuthenticated && loginTime && 
      (Date.now() - parseInt(loginTime)) < 24 * 60 * 60 * 1000;

    if (!isSessionValid) {
      // Limpiar datos de autenticación expirados
      localStorage.removeItem('isAdminAuthenticated');
      localStorage.removeItem('adminLoginTime');
      
      // Redirigir al login
      navigate('/login');
    }
  }, [navigate]);

  // Verificar autenticación actual
  const isAuthenticated = localStorage.getItem('isAdminAuthenticated');
  const loginTime = localStorage.getItem('adminLoginTime');
  const isSessionValid = isAuthenticated && loginTime && 
    (Date.now() - parseInt(loginTime)) < 24 * 60 * 60 * 1000;

  if (!isSessionValid) {
    return null; // No renderizar nada mientras redirige
  }

  return children;
};

export default ProtectedRoute;
