# Estructura de Imágenes de Productos

## 📁 Organización de carpetas:

```
public/productos/
├── CELULARESSAMSUNG/
│   ├── samsungs25ultra.png
│   ├── samsungs25plus.png
│   └── samsungs25.png
├── CELULARESIPHONE/
│   ├── iphone15.png
│   ├── iphone14.png
│   └── iphone13.png
├── CELULARESMOTOROLA/
│   ├── motorolaedge40neo.png
│   ├── motorolaedge50.png
│   └── motoroladefy.png
└── VIDEOJUEGOS/
    ├── ps5.png
    └── xboxseriesx.png
```

## 🔧 Reglas de nombres:

### Transformación automática:
- **"MOTOROLA EDGE 40 NEO"** → **motorolaedge40neo.png**
- **"SAMSUNG S25 ULTRA"** → **samsungs25ultra.png**
- **"IPHONE 15"** → **iphone15.png**

### Proceso:
1. Convertir a minúsculas
2. Remover espacios
3. Remover caracteres especiales
4. Agregar .png

## 💡 Fallback automático:
- ✅ Si existe imagen → muestra la imagen
- ❌ Si no existe → muestra icono de categoría (📱 🎮 📺 etc.)