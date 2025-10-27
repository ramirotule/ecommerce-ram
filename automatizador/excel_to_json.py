import pandas as pd
import json
import re
import os
import glob
from datetime import datetime

def procesar_txt_a_json(txt_file):
    """Función de fallback para procesar archivo TXT directamente"""
    productos = []
    
    try:
        with open(txt_file, 'r', encoding='utf-8') as f:
            contenido = f.read()
        
        # Procesar líneas del archivo de difusión
        lineas = contenido.split('\n')
        producto_actual = None
        
        for i, linea in enumerate(lineas):
            linea = linea.strip()
            
            # Si la línea contiene "U$S" es un precio
            if re.search(r'U\$S?\s*(\d+)', linea):
                precio_match = re.search(r'U\$S?\s*(\d+)', linea)
                if precio_match and producto_actual:
                    precio = int(precio_match.group(1))
                    
                    # Categorizar productos
                    categoria = categorizar_producto(producto_actual)
                    
                    productos.append({
                        'producto': producto_actual.strip(),
                        'precio_usd': precio,
                        'categoria': categoria
                    })
                    producto_actual = None
                    
            # Si la línea no es vacía, emojis o separadores, puede ser un producto
            elif linea and not re.match(r'^[🏪⚠️💰⛔🛒=]+', linea) and len(linea) > 5:
                if not any(word in linea.upper() for word in ['LISTA', 'CONSULTAS', 'PEDIDOS', 'ACLARACION', 'PAGO', 'PRODUCTOS', 'DISPONIBLES']):
                    producto_actual = linea
        
        print(f"Productos extraídos del TXT: {len(productos)}")
        return productos
        
    except Exception as e:
        print(f"Error procesando TXT: {e}")
        return []

def categorizar_producto(producto):
    """Categorizar productos basándose en palabras clave"""
    producto_upper = producto.upper()
    
    if any(word in producto_upper for word in ['IPHONE', 'SAMSUNG', 'XIAOMI', 'MOTOROLA', 'HUAWEI', 'CELULAR', 'PHONE']):
        return 'CELULARES'
    elif any(word in producto_upper for word in ['MACBOOK', 'NOTEBOOK', 'LAPTOP', 'LENOVO', 'DELL', 'HP', 'ASUS']):
        return 'MACBOOKS'
    elif any(word in producto_upper for word in ['TV', 'TELEVISOR', 'SMART', 'LG', 'TCL']):
        return 'TELEVISORES'
    elif any(word in producto_upper for word in ['PS5', 'PS4', 'XBOX', 'NINTENDO', 'PLAY', 'GAMING', 'GAMER']):
        return 'VIDEO JUEGOS'
    elif any(word in producto_upper for word in ['CARGADOR', 'CABLE', 'USB', 'TYPE']):
        return 'CARGADORES'
    else:
        return 'OTROS'

# Configuración - buscar archivos Excel procesados
output_dir = "output"
json_output_path = "../public/productos_ram.json"
excel_pattern = os.path.join(output_dir, "*procesada*.xlsx")
excel_files = glob.glob(excel_pattern)

if not excel_files:
    # Si no hay archivos procesados, buscar cualquier Excel
    excel_pattern = os.path.join(output_dir, "*.xlsx")
    excel_files = glob.glob(excel_pattern)

if not excel_files:
    print(f"INFO: No se encontraron archivos Excel en {output_dir}/")
    # Buscar archivos TXT como fallback
    txt_pattern = os.path.join(output_dir, "*.txt")
    txt_files = glob.glob(txt_pattern)
    
    if txt_files:
        print("Intentando procesar archivo TXT disponible...")
        txt_file = max(txt_files, key=os.path.getctime)
        print(f"Usando archivo TXT: {txt_file}")
        
        # Procesar archivo TXT (función simplificada)
        productos_desde_txt = procesar_txt_a_json(txt_file)
        
        # Guardar JSON
        json_data = {
            "metadatos": {
                "fecha_actualizacion": datetime.now().isoformat(),
                "total_productos": len(productos_desde_txt),
                "fuente": "TXT_fallback"
            },
            "productos": productos_desde_txt
        }
        
        with open(json_output_path, 'w', encoding='utf-8') as f:
            json.dump(json_data, f, ensure_ascii=False, indent=2)
        
        print(f"JSON generado desde TXT: {json_output_path}")
        print(f"Total productos: {len(productos_desde_txt)}")
        exit(0)
    else:
        print(f"ERROR: No se encontraron archivos Excel ni TXT en {output_dir}/")
        print("Archivos disponibles:")
        for file in os.listdir(output_dir):
            print(f"  - {file}")
        exit(1)

# Usar el archivo Excel más reciente
excel_input_path = max(excel_files, key=os.path.getctime)
print(f"Usando archivo Excel: {excel_input_path}")

# Borrar JSON anterior si existe
if os.path.exists(json_output_path):
    try:
        os.remove(json_output_path)
        print(f"Archivo anterior eliminado: {json_output_path}")
    except Exception as e:
        print(f"No se pudo eliminar el archivo anterior: {e}")

print("Convirtiendo Excel a JSON...")
print("="*50)

# Leer el Excel
df = pd.read_excel(excel_input_path)

# Debug: Mostrar las primeras filas y columnas del Excel
print(f"Columnas del Excel: {df.columns.tolist()}")
print(f"Primeras 3 filas del Excel:")
print(df.head(3))
print("="*50)

def determinar_categoria(descripcion):
    """Determinar la categoría basándose en la descripción del producto"""
    descripcion = descripcion.upper()
    
    if any(palabra in descripcion for palabra in ['IPHONE', 'SAMSUNG', 'XIAOMI', 'MOTOROLA', 'HUAWEI', 'CELULAR']):
        return "CELULARES"
    elif any(palabra in descripcion for palabra in ['MACBOOK', 'LAPTOP', 'NOTEBOOK']):
        return "MACBOOKS"
    elif any(palabra in descripcion for palabra in ['TV', 'TELEVISOR', 'SMART TV']):
        return "TELEVISORES"
    elif any(palabra in descripcion for palabra in ['PS4', 'PS5', 'XBOX', 'NINTENDO', 'JOYSTICK']):
        return "VIDEO JUEGOS"
    elif any(palabra in descripcion for palabra in ['CARGADOR', 'CABLE', 'AURICULAR', 'FUNDA', 'PROTECTOR']):
        return "CARGADORES"
    else:
        return "OTROS"

def generar_nombre_imagen(descripcion):
    """Generar nombre de archivo de imagen basado en la descripción"""
    # Limpiar y normalizar la descripción
    nombre = descripcion.lower()
    
    # Remover caracteres especiales y reemplazar espacios
    nombre = re.sub(r'[^\w\s]', '', nombre)  # Solo letras, números y espacios
    nombre = re.sub(r'\s+', '_', nombre)     # Espacios por guiones bajos
    nombre = re.sub(r'_+', '_', nombre)      # Múltiples guiones por uno solo
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
        return precio_redondeado
    elif resto <= 2:
        return precio_redondeado - resto
    else:
        return precio_redondeado + (5 - resto)

# Procesar los datos
productos_json = []
fecha_actualizacion = datetime.now().isoformat()

print(f"Procesando {len(df)} productos del Excel...")

for index, row in df.iterrows():
    try:
        # Obtener datos usando los nombres de columnas (más robusto)
        producto = str(row['Descripción']).strip()
        precio_str = str(row['Precio Venta']).strip()
        
        # Limpiar el precio y convertir a float
        if precio_str and precio_str != 'nan' and precio_str != '':
            # Remover caracteres no numéricos excepto puntos y comas
            precio_limpio = re.sub(r'[^\d.,]', '', precio_str)
            
            # Manejar diferentes formatos de decimal
            if ',' in precio_limpio and '.' in precio_limpio:
                # Si tiene ambos, asumir que la coma es miles y punto es decimal
                precio_limpio = precio_limpio.replace(',', '')
            elif ',' in precio_limpio:
                # Si solo tiene coma, podría ser decimal o miles
                partes = precio_limpio.split(',')
                if len(partes) == 2 and len(partes[1]) <= 2:
                    # Probablemente decimal
                    precio_limpio = precio_limpio.replace(',', '.')
                else:
                    # Probablemente miles
                    precio_limpio = precio_limpio.replace(',', '')
            
            try:
                precio_base = float(precio_limpio)
                precio_usd = calcular_precio_final(precio_base)
                
                # Crear objeto del producto
                producto_obj = {
                    "producto": producto,
                    "precio_usd": precio_usd,
                    "categoria": determinar_categoria(producto),
                    "imagen": generar_nombre_imagen(producto)
                }
                
                productos_json.append(producto_obj)
                
            except ValueError:
                print(f"Precio inválido en fila {index + 2}: {precio_str}")
                continue
        else:
            print(f"Sin precio en fila {index + 2}")
            continue
            
    except Exception as e:
        print(f"Error procesando fila {index + 2}: {e}")
        continue

print(f"Procesados {len(productos_json)} productos válidos")

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

print("="*50)
print("Conversión a JSON completada exitosamente!")
print("Archivo listo para el ecommerce")