import React from 'react';
import { COLORS } from '../utils/colors';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '10px',
      margin: '40px 0',
      padding: '20px'
    }}>
      {/* Botón Anterior */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          padding: '12px 16px',
          borderRadius: '10px',
          border: 'none',
          background: currentPage === 1 ? '#e9ecef' : 'linear-gradient(135deg, #00F100 0%, #000000 100%)',
          color: currentPage === 1 ? '#6c757d' : 'white',
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          fontWeight: '600',
          transition: 'all 0.3s ease',
          boxShadow: currentPage === 1 ? 'none' : '0 4px 15px rgba(102, 126, 234, 0.3)'
        }}
        onMouseOver={(e) => {
          if (currentPage !== 1) {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
          }
        }}
        onMouseOut={(e) => {
          if (currentPage !== 1) {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
          }
        }}
      >
        ‹ Anterior
      </button>

      {/* Números de página */}
      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' ? onPageChange(page) : null}
          disabled={page === '...'}
          style={{
            padding: '12px 16px',
            borderRadius: '10px',
            border: 'none',
            background: page === currentPage 
              ? 'linear-gradient(135deg, #00F100 0%, #000000 100%)'
              : page === '...' 
                ? 'transparent'
                : 'white',
            color: page === currentPage 
              ? 'white' 
              : page === '...' 
                ? '#6c757d'
                : '#333',
            cursor: page === '...' ? 'default' : 'pointer',
            fontWeight: page === currentPage ? '700' : '600',
            transition: 'all 0.3s ease',
            boxShadow: page === currentPage 
              ? '0 4px 15px rgba(102, 126, 234, 0.3)'
              : page === '...'
                ? 'none'
                : '0 2px 8px rgba(0,0,0,0.1)',
            minWidth: '45px'
          }}
          onMouseOver={(e) => {
            if (page !== '...' && page !== currentPage) {
              e.target.style.background = 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.15)';
            }
          }}
          onMouseOut={(e) => {
            if (page !== '...' && page !== currentPage) {
              e.target.style.background = 'white';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            }
          }}
        >
          {page}
        </button>
      ))}

      {/* Botón Siguiente */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          padding: '12px 16px',
          borderRadius: '10px',
          border: 'none',
          background: currentPage === totalPages ? '#e9ecef' : 'linear-gradient(135deg, #00F100 0%, #000000 100%)',
          color: currentPage === totalPages ? '#6c757d' : 'white',
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          fontWeight: '600',
          transition: 'all 0.3s ease',
          boxShadow: currentPage === totalPages ? 'none' : '0 4px 15px rgba(102, 126, 234, 0.3)'
        }}
        onMouseOver={(e) => {
          if (currentPage !== totalPages) {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
          }
        }}
        onMouseOut={(e) => {
          if (currentPage !== totalPages) {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
          }
        }}
      >
        Siguiente ›
      </button>

      {/* Info de páginas */}
      <div style={{
        marginLeft: '20px',
        color: '#6c757d',
        fontSize: '14px',
        fontWeight: '500'
      }}>
        Página {currentPage} de {totalPages}
      </div>
    </div>
  );
};

export default Pagination;
