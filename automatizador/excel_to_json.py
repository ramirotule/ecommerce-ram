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
        print(f"Archivo anterior eliminado: {json_output_path}")
    except Exception as e:
        print(f"No se pudo eliminar el archivo anterior: {e}")

if not os.path.exists(excel_input_path):
    raise FileNotFoundError(f"No se encontró el archivo Excel: {excel_input_path}")

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