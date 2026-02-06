import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../utils/colors';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Credenciales de administrador (en producción esto debería estar en el backend)
  const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'ram25'
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error al escribir
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simular delay de autenticación
    setTimeout(() => {
      if (credentials.username === ADMIN_CREDENTIALS.username && 
          credentials.password === ADMIN_CREDENTIALS.password) {
        
        // Guardar estado de autenticación en localStorage
        localStorage.setItem('isAdminAuthenticated', 'true');
        localStorage.setItem('adminLoginTime', Date.now().toString());
        
        // Redirigir a dashboard
        navigate('/dashboard');
      } else {
        setError('Usuario o contraseña incorrectos');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}>
        {/* Logo y Título */}
        <div style={{
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <h1 style={{
            color: '#00F100',
            fontSize: '32px',
            fontFamily: 'CircuitBoard, monospace',
            letterSpacing: '2px',
            margin: '0 0 10px 0',
            textShadow: '0 2px 4px rgba(0,241,0,0.3)'
          }}>
            RAM
          </h1>
          <h2 style={{
            color: COLORS.text.white,
            fontSize: '18px',
            margin: '0 0 10px 0',
            fontWeight: '600'
          }}>
            Informática
          </h2>
          <p style={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '14px',
            margin: 0
          }}>
            Acceso Administrativo
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          {/* Campo Usuario */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              color: COLORS.text.white,
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              Usuario
            </label>
            <input
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: COLORS.text.white,
                fontSize: '16px',
                outline: 'none',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.border = '1px solid #00F100';
                e.target.style.boxShadow = '0 0 10px rgba(0, 241, 0, 0.3)';
              }}
              onBlur={(e) => {
                e.target.style.border = '1px solid rgba(255, 255, 255, 0.3)';
                e.target.style.boxShadow = 'none';
              }}
              placeholder="Ingresa tu usuario"
            />
          </div>

          {/* Campo Contraseña */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              color: COLORS.text.white,
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: COLORS.text.white,
                fontSize: '16px',
                outline: 'none',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.border = '1px solid #00F100';
                e.target.style.boxShadow = '0 0 10px rgba(0, 241, 0, 0.3)';
              }}
              onBlur={(e) => {
                e.target.style.border = '1px solid rgba(255, 255, 255, 0.3)';
                e.target.style.boxShadow = 'none';
              }}
              placeholder="Ingresa tu contraseña"
            />
          </div>

          {/* Mensaje de Error */}
          {error && (
            <div style={{
              background: 'rgba(220, 53, 69, 0.2)',
              border: '1px solid rgba(220, 53, 69, 0.5)',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '20px',
              color: '#ff6b6b',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Botón de Login */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '10px',
              border: 'none',
              background: isLoading 
                ? 'rgba(0, 241, 0, 0.5)' 
                : 'linear-gradient(135deg, #00F100 0%, #00cc00 100%)',
              color: '#000',
              fontSize: '16px',
              fontWeight: '700',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
            onMouseOver={(e) => {
              if (!isLoading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(0, 241, 0, 0.4)';
              }
            }}
            onMouseOut={(e) => {
              if (!isLoading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }
            }}
          >
            {isLoading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <span style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid #000',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}>
                </span>
                Verificando...
              </span>
            ) : (
              '🔐 Ingresar'
            )}
          </button>
        </form>

        {/* Información adicional */}
        <div style={{
          marginTop: '20px',
          textAlign: 'center',
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: '12px'
        }}>
          <p style={{ margin: 0 }}>
            Solo para personal autorizado
          </p>
        </div>
      </div>

      {/* CSS para animación de loading */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Login;
