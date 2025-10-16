import pandas as pd
import json
import re
import os
from datetime import datetime

# Configuración
excel_input_path = "output/lista_gcgroup_procesada.xlsx"
json_output_path = "../public/productos_ram.json"

# Verificar que existe el archivo Excel

# Borrar JSON anterior si existe
if os.path.exists(json_output_path):
    try:
        os.remove(json_output_path)
        print(f"🧹 Archivo anterior eliminado: {json_output_path}")
    except Exception as e:
        print(f"⚠️ No se pudo eliminar el archivo anterior: {e}")

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
    return f"{nombre}.png"
        nombre = re.sub(r'_+', '_', nombre)      # Múltiples guiones por uno solo
        descripcion_texto = re.sub(r'[^\w\s$.-]', '', descripcion)  # Remover emojis para mostrar en terminal

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

# Obtener fecha actual para incluir en el JSON
fecha_actualizacion = datetime.now().isoformat()

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

# Crear estructura JSON con metadatos
json_data = {
    "metadatos": {
        "fecha_actualizacion": fecha_actualizacion,
        "total_productos": len(productos_json),
        "version": "1.0"
    },
    "productos": productos_json
}

# Guardar JSON
with open(json_output_path, 'w', encoding='utf-8') as f:
    json.dump(json_data, f, ensure_ascii=False, indent=2)

print(f"\nArchivo JSON generado: {json_output_path}")
print(f"Total productos: {len(productos_json)}")
print(f"Fecha de actualización: {fecha_actualizacion}")

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

# Obtener fecha actual en diferentes formatos
from datetime import datetime
import locale

# Configurar locale para español (si está disponible)
try:
    locale.setlocale(locale.LC_TIME, 'es_ES.UTF-8')
except:
    try:
        locale.setlocale(locale.LC_TIME, 'es_ES')
    except:
        # Si no hay locale español disponible, usar diccionario manual
        pass

fecha_actual = datetime.now().strftime("%d/%m/%Y")
fecha_archivo = datetime.now().strftime("%d-%m-%Y")

# Crear fecha para encabezado en español
meses_espanol = {
    'January': 'ENERO', 'February': 'FEBRERO', 'March': 'MARZO', 'April': 'ABRIL',
    'May': 'MAYO', 'June': 'JUNIO', 'July': 'JULIO', 'August': 'AGOSTO',
    'September': 'SEPTIEMBRE', 'October': 'OCTUBRE', 'November': 'NOVIEMBRE', 'December': 'DICIEMBRE'
}

fecha_temp = datetime.now().strftime("%d DE %B")
for ingles, espanol in meses_espanol.items():
    fecha_temp = fecha_temp.replace(ingles.upper(), espanol)

fecha_encabezado = fecha_temp.upper()  # Ejemplo: "26 DE SEPTIEMBRE"

# Configuración del archivo de difusión
txt_output_path = f"output/difusion_ram_{fecha_archivo}.txt"

# Crear el encabezado
contenido = [
    f"🙋🏻 BUEN DIA LES DEJO LA LISTA DE PRECIOS DEL DIA {fecha_encabezado}",
    "",
    "🏪 LISTA DE PRECIOS RAM INFORMATICA",
    "",
    "🌐 www.raminformatica.com.ar",
    "",
    "🛒 PRODUCTOS DISPONIBLES",
    "="*50,
    ""
]
    print("Archivo JSON generado directamente en public/productos_ram.json")
    print("El ecommerce ahora tiene los productos actualizados!")
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
    "💬 Para consultas y pedidos mandanos un Whatsapp",
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