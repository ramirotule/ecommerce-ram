# 📊 Guía de Analytics - eCommerce RAM

## 🎯 Eventos Implementados

### 1. **📱 Clicks en WhatsApp** 
- `whatsapp_click` - FloatingWhatsApp (botón flotante)
- `whatsapp_click` - OtherProducts_WhatsApp 
- `whatsapp_click` - HowToBuy_WhatsApp
- `whatsapp_click` - About_WhatsApp  
- `whatsapp_click` - Featured_Product (desde slider de productos)

### 2. **📋 Lista de Precios - Interacciones**
- `pdf_download` - Descarga del PDF de precios
- `reset_filters` - Borrar filtros
- `filter_category` - Cambio de categoría
- `sort_column` - Ordenamiento por columnas

### 3. **🔍 Análisis de Búsquedas (LO MÁS VALIOSO)**

#### Búsquedas Generales:
- `search_query` - Texto completo buscado + número de resultados
- `search_keyword` - Palabras individuales (para trending topics)
- `search_no_results` - Búsquedas sin resultados (productos faltantes)
- `search_enter` - Búsquedas confirmadas con Enter

#### Intención de Búsqueda:
- `search_category_intent` - Categorías detectadas automáticamente:
  - CELULARES (iphone, samsung, xiaomi, etc.)
  - NOTEBOOKS (macbook, lenovo, laptop, etc.)  
  - TELEVISORES (tv, smart, lg, etc.)
  - VIDEO_JUEGOS (gaming, ps5, xbox, etc.)
  - CARGADORES (cargador, cable, usb, etc.)

#### Comportamiento de Búsqueda:
- `search_intent` - Intención de precio:
  - "precio_bajo" (barato, económico, etc.)
  - "precio_alto" (premium, pro, max, etc.)
  - "marca_especifica" (apple, samsung, etc.)
  
- `search_type` - Tipo de búsqueda:
  - "producto_especifico" (iPhone 15 Pro, etc.)
  - "categoria_generica" (celular, notebook, etc.)
  
- `search_behavior`:
  - "busqueda_detallada" (búsquedas largas y específicas)

### 4. **👆 Conversión de Búsqueda a Click**
- `search_to_product_click` - Click en producto después de buscar (desktop)
- `search_to_product_click_mobile` - Click en producto después de buscar (móvil)
- `product_click` - Click en producto sin búsqueda previa
- `product_click_mobile` - Click en producto sin búsqueda previa (móvil)

### 5. **📈 Resultados y Filtros**
- `filter_results` - Cantidad de productos mostrados después de filtrar

---

## 🔬 Insights que Puedes Obtener

### 📊 **Productos Más Demandados**
```javascript
// En Google Analytics, filtra por:
Event: "search_keyword"
// Te mostrará las palabras más buscadas
```

### 🚫 **Productos Faltantes** 
```javascript
// Filtra por:
Event: "search_no_results" 
// Te mostrará qué buscan pero no encuentran
```

### 💰 **Intención de Compra por Precio**
```javascript
// Filtra por:
Event: "search_intent"
Event Label: "precio_bajo" vs "precio_alto"
```

### 📱 **Categorías Más Populares**
```javascript
// Filtra por:
Event: "search_category_intent"
// Te dirá qué categorías buscan más
```

### 🎯 **Tasa de Conversión de Búsqueda**
```javascript
// Compara:
Event: "search_query" (búsquedas)
vs 
Event: "search_to_product_click" (clicks después de buscar)
```

### 📋 **Engagement con PDF**
```javascript
// Mide:
Event: "pdf_download"
// Cuántas personas descargan la lista completa
```

---

## 🛠️ **Configuración en Google Analytics**

### 1. **Dashboard Personalizado**
Crea un dashboard con:
- Top 10 palabras buscadas (search_keyword)
- Búsquedas sin resultados (search_no_results)  
- Clicks en WhatsApp por página
- Tasa de descarga de PDF
- Productos más clickeados

### 2. **Alertas Importantes**
- Picos en "search_no_results" → Productos que deberías agregar
- Caídas en "pdf_download" → Problemas con el PDF
- Aumentos en categorías específicas → Tendencias de mercado

### 3. **Reportes Automáticos**
- Reporte semanal de palabras más buscadas
- Reporte mensual de conversión búsqueda→click
- Análisis de intención de compra por precio

---

## 🎯 **Acciones Recomendadas**

### Basado en `search_no_results`:
- Agrega productos que buscan pero no tienes
- Mejora el sistema de búsqueda para términos similares

### Basado en `search_keyword`:
- Prioriza stock de productos más buscados  
- Crea categorías para términos populares
- Optimiza SEO con palabras trending

### Basado en `whatsapp_click`:
- Identifica qué páginas convierten más a WhatsApp
- Optimiza botones en páginas con baja conversión

### Basado en conversión búsqueda→click:
- Si es baja: mejora presentación de productos
- Si es alta: replica formato en otras secciones

---

## 💡 **Ejemplos de Consultas SQL para Analytics**

```sql
-- Top 10 búsquedas más comunes
SELECT 
  event_label,
  COUNT(*) as busquedas,
  AVG(event_value) as promedio_resultados
FROM events 
WHERE event_name = 'search_query'
GROUP BY event_label
ORDER BY busquedas DESC
LIMIT 10;

-- Productos más buscados pero sin resultados
SELECT 
  event_label,
  COUNT(*) as veces_buscado
FROM events 
WHERE event_name = 'search_no_results'
GROUP BY event_label
ORDER BY veces_buscado DESC;

-- Tasa de conversión búsqueda a click
SELECT 
  DATE(created_at) as fecha,
  COUNT(CASE WHEN event_name = 'search_query' THEN 1 END) as busquedas,
  COUNT(CASE WHEN event_name = 'search_to_product_click' THEN 1 END) as clicks,
  ROUND(
    COUNT(CASE WHEN event_name = 'search_to_product_click' THEN 1 END) * 100.0 / 
    COUNT(CASE WHEN event_name = 'search_query' THEN 1 END), 2
  ) as tasa_conversion
FROM events 
WHERE event_category = 'Lista_Precios'
GROUP BY DATE(created_at)
ORDER BY fecha DESC;
```

---

¡Ahora tienes un sistema completo de analytics que te permitirá entender exactamente qué buscan tus clientes y cómo se comportan en tu tienda! 🚀