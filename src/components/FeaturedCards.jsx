import React from 'react'

const FeaturedCards = () => {

    const featuredCards = [
      {
        title: "CONSOLAS DE VIDEOJUEGOS",
        icon: "🎮",
        color: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)'
      },
      {
        title: "CELULARES Y TABLETS",
        icon: "📱",
        color: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)'
      },
      {
        title: "MACBOOKS Y NOTEBOOKS",
        icon: "💻",
        color: 'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)'
      },
      {
        title: "AURICULARES Y ACCESORIOS",
        icon: "🎧",
        color: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)'
      }
    ];

  return (
       <div style={{
        marginTop: '48px',
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(340px, 1fr))',
        gap: '32px',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        maxWidth: '900px'
      }}> 
       {featuredCards.map((card, idx) => (
          <div key={idx} style={{
            background: card.color,
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            justifyContent: 'center',
            minHeight: '220px',
            minWidth: '340px',
            maxWidth: '420px',
            color: '#000',
            fontWeight: '500',
            fontSize: '42px',
            fontFamily: 'Bebas Neue, sans-serif',
            letterSpacing: '2px',
            textShadow: 'none'
          }}>
            <span style={{ fontSize: '48px', marginBottom: '16px' }}>{card.icon}</span>
            {card.title}
          </div>
        ))}
      </div>

  )
}

export default FeaturedCards
