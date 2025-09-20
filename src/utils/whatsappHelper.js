// src/utils/whatsappHelper.js

/**
 * Función para crear enlaces de WhatsApp manejando correctamente los emojis
 * @param {Object} producto - El objeto producto
 * @param {string} numero - Número de WhatsApp (opcional)
 * @returns {string} - URL de WhatsApp
 */
export function crearEnlaceWhatsAppSeguro(producto, numero = "5492954227622") {
  // Reemplazar emojis comunes con texto descriptivo para evitar problemas de codificación
  let nombreLimpio = producto.producto;
  
  // Mapeo de emojis a texto
  const reemplazos = {
    '📱': '[CELULAR]',
    '💻': '[LAPTOP]', 
    '📲': '[TABLET]',
    '⌚': '[SMARTWATCH]',
    '🎧': '[AUDIO]',
    '📺': '[TV]',
    '🕹️': '[CONSOLA]',
    '🔌': '[CARGADOR]',
    '✏️': '[STYLUS]',
    '🔥': '[OFERTA]'
  };
  
  // Aplicar reemplazos
  Object.keys(reemplazos).forEach(emoji => {
    nombreLimpio = nombreLimpio.replace(new RegExp(emoji, 'g'), reemplazos[emoji]);
  });
  
  // Eliminar las categorías entre corchetes (ej: [SMARTWATCH], [CELULAR], etc.)
  nombreLimpio = nombreLimpio.replace(/\[[^\]]*\]/g, '');
  
  // Limpiar caracteres especiales restantes y espacios extra
  nombreLimpio = nombreLimpio
    .replace(/[^\w\s\-\.]/g, '')
    .replace(/\s+/g, ' ') // Reemplazar múltiples espacios por uno solo
    .trim();
  
  // Crear mensaje para WhatsApp
  const mensaje = `Hola! Me interesa este producto:

${nombreLimpio}

Precio: U$S ${producto.precio_usd}
Categoria: ${producto.categoria}

Esta disponible?`;

  // Codificar para URL
  const mensajeCodificado = encodeURIComponent(mensaje);
  
  return `https://wa.me/${numero}?text=${mensajeCodificado}`;
}
