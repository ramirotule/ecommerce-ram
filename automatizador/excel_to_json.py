import pandas as pd
import json
import re
import os
from datetime import datetime

# Configuración
excel_input_path = "output/lista_gcgroup_procesada.xlsx"
json_output_path = "../public/productos_ram.json"

# Verificar que existe el archivo Excel
if not os.path.exists(excel_input_path):
    raise FileNotFoundError(f"No se encontró el archivo Excel: {excel_input_path}")

print("Convirtiendo Excel a JSON...")
print("="*50)

# Leer el Excel
df = pd.read_excel(excel_input_path)

def determinar_categoria(descripcion):
    """Determinar la categoría basada en la descripción"""
    descripcion_upper = descripcion.upper()
    
    # Remover emoji inicial para analizar mejor
    descripcion_limpia = re.sub(r'^[^\w\s]+\s*', '', descripcion_upper)
    
    # Categorías específicas - SMART TV y TV tienen prioridad sobre marcas
    if "SMART TV" in descripcion_limpia or "TV" in descripcion_limpia:
        return "TELEVISORES"
    elif "IPAD" in descripcion_limpia:
        return "IPAD"
    elif any(marca in descripcion_limpia for marca in ["IPHONE", "SAMSUNG", "MOTOROLA", "XIAOMI", "OPPO", "INFINIX"]):
        return "CELULARES"
    elif "CARGADOR" in descripcion_limpia:
        return "CARGADORES"
    elif any(palabra in descripcion_limpia for palabra in ["RELOJ", "WATCH", "BAND"]):
        return "SMARTWATCH"
    elif "MACBOOK" in descripcion_limpia:
        return "MACBOOKS"
    elif any(palabra in descripcion_limpia for palabra in ["JOYSTICK", "PS5", "NINTENDO", "XBOX", "SONY"]):
        return "VIDEO JUEGOS"
    else:
        return "OTROS"

def generar_nombre_imagen(descripcion):
    """Generar nombre de imagen a partir de la descripción"""
    # Remover emoji inicial
    descripcion_limpia = re.sub(r'^[^\w\s]+\s*', '', descripcion)
    
    # Convertir a lowercase
    nombre = descripcion_limpia.lower()
    
    # Remover caracteres especiales y reemplazar espacios
    nombre = re.sub(r'[^\w\s]', '', nombre)  # Solo letras, números y espacios
    nombre = re.sub(r'\s+', '_', nombre)     # Espacios por guiones bajos
    nombre = re.sub(r'_+', '_', nombre)      # Múltiples guiones por uno solo
    nombre = nombre.strip('_')               # Quitar guiones del inicio/final
    
    return f"{nombre}.png"

def calcular_precio_final(precio_base):
    """Calcular precio final aplicando 18% de ganancia + 20 dólares, redondeado a múltiplo de 5"""
    # Aplicar 18% de ganancia
    precio_con_ganancia = precio_base * 1.18
    
    # Sumar 20 dólares adicionales
    precio_final = precio_con_ganancia + 20
    
    # Redondear a entero y luego al múltiplo de 5 más cercano
    precio_redondeado = int(round(precio_final))
    
    # Calcular el múltiplo de 5 más cercano
    resto = precio_redondeado % 5
    if resto == 0:
        return precio_redondeado  # Ya es múltiplo de 5
    elif resto < 2.5:
        return precio_redondeado - resto  # Redondear hacia abajo
    else:
        return precio_redondeado + (5 - resto)  # Redondear hacia arriba

# Convertir a JSON
productos_json = []

for index, row in df.iterrows():
    descripcion = row['Descripción']
    precio_base = int(row['Precio Venta'])  # Precio del proveedor
    
    # Calcular precio final con ganancia
    precio_final = calcular_precio_final(precio_base)
    
    # Determinar categoría
    categoria = determinar_categoria(descripcion)
    
    # Generar nombre de imagen
    imagen = generar_nombre_imagen(descripcion)
    
    producto = {
        "producto": descripcion,
        "precio_usd": precio_final,  # Precio con ganancia aplicada
        "precio_base": precio_base,  # Precio original del proveedor (para referencia)
        "categoria": categoria,
        "imagen": imagen
    }
    
    productos_json.append(producto)
    
    # Remover emojis de descripción para mostrar en terminal
    descripcion_texto = re.sub(r'[^\w\s$.-]', '', descripcion)

# Crear directorio output si no existe
os.makedirs("output", exist_ok=True)

# Guardar JSON
with open(json_output_path, 'w', encoding='utf-8') as f:
    json.dump(productos_json, f, ensure_ascii=False, indent=2)

print(f"\nArchivo JSON generado: {json_output_path}")
print(f"Total productos: {len(productos_json)}")

# Estadísticas por categoría
categorias_stats = {}
for producto in productos_json:
    categoria = producto['categoria']
    categorias_stats[categoria] = categorias_stats.get(categoria, 0) + 1

print(f"\nEstadísticas por categoría:")
for categoria, cantidad in sorted(categorias_stats.items()):
    print(f"   {categoria}: {cantidad} productos")

print("="*50)
print("Conversión completada exitosamente!")

# Mostrar algunos ejemplos
print(f"\nEjemplos generados:")
for i, producto in enumerate(productos_json[:3]):
    # Remover emojis para mostrar en terminal
    producto_texto = re.sub(r'[^\w\s$.-]', '', producto['producto'])
    print(f"{i+1}. {producto['categoria']}: {producto_texto}")
    print(f"   Precio: ${producto['precio_usd']} USD")
    print(f"   Imagen: {producto['imagen']}")
    print()

# Generar archivo de difusión para WhatsApp
print("="*50)
print("Generando archivo de difusión para WhatsApp...")

# Obtener fecha actual en formato DD/MM/YYYY
from datetime import datetime
fecha_actual = datetime.now().strftime("%d/%m/%Y")
fecha_archivo = datetime.now().strftime("%d-%m-%Y")

# Configuración del archivo de difusión
txt_output_path = f"output/difusion_ram_{fecha_archivo}.txt"

# Crear el encabezado
contenido = [
    "🏪 LISTA DE PRECIOS RAM INFORMATICA",
    "",
    "⛔ NO ⛔ SE ACEPTAN DÓLARES CARA CHICA, MANCHADOS, ROTOS, ESCRITOS. NO SE ACEPTA CAMBIO EN CANTIDAD - MAYOR A 50. SIN EXCEPCIÓN",
    "",
    "🛒 PRODUCTOS DISPONIBLES",
    "="*50,
    ""
]

# Agrupar productos por categoría
productos_por_categoria = {}
for producto in productos_json:
    categoria = producto['categoria']
    if categoria not in productos_por_categoria:
        productos_por_categoria[categoria] = []
    productos_por_categoria[categoria].append(producto)

# Ordenar categorías
orden_categorias = ["CELULARES", "MACBOOKS", "TELEVISORES", "VIDEO JUEGOS", "CARGADORES", "OTROS"]

# Agregar productos por categoría
for categoria in orden_categorias:
    if categoria in productos_por_categoria:
        items = productos_por_categoria[categoria]
        
        # Agregar productos de la categoría
        for item in items:
            producto_texto = item['producto']
            precio = item['precio_usd']
            
            contenido.append(f"{producto_texto}")
            contenido.append(f"U$S {precio}")
            contenido.append("")

# Agregar categorías restantes que no estén en el orden predefinido
for categoria, items in productos_por_categoria.items():
    if categoria not in orden_categorias:
        for item in items:
            producto_texto = item['producto']
            precio = item['precio_usd']
            
            contenido.append(f"{producto_texto}")
            contenido.append(f"U$S {precio}")
            contenido.append("")

# Agregar pie de página
contenido.extend([
    "="*50,
    f"📅 Lista actualizada: {fecha_actual}",
    "",
    "💬 Para consultas y pedidos, responder a este mensaje",
    "🚚 Entregas coordinadas por domicilio propio"
])

# Guardar archivo TXT de difusión
with open(txt_output_path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(contenido))

print(f"Archivo de difusión generado: {txt_output_path}")
print(f"Fecha: {fecha_actual}")
print("Archivo listo para difusión en WhatsApp!")

# El archivo JSON ya se genera directamente en public/
print("="*50)
print("✓ Archivo JSON generado directamente en public/productos_ram.json")
print("✓ El ecommerce ahora tiene los productos actualizados!")