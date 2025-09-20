import pandas as pd
import re
import os
from datetime import datetime

def procesar_lista_gcgroup():
    """Procesa el archivo TXT de GCGroup y lo convierte a Excel"""
    
    # Configuración de archivos
    txt_input_path = "output/lista_gcgroup.txt"
    excel_output_path = "output/lista_gcgroup_procesada.xlsx"
    
    # Verificar que existe el archivo TXT
    if not os.path.exists(txt_input_path):
        raise FileNotFoundError(f"No se encontró el archivo TXT: {txt_input_path}")
    
    print(f"🔄 Procesando lista de GCGroup...")
    print("="*50)
    
    # Leer el archivo TXT
    with open(txt_input_path, 'r', encoding='utf-8') as f:
        contenido = f.read()
    
    # Dividir en líneas y limpiar
    lineas = [linea.strip() for linea in contenido.split('\n') if linea.strip()]
    
    productos = []
    
    for linea in lineas:
        # Buscar si la línea contiene un producto con precio en formato "PRODUCTO - $ PRECIO"
        match_precio = re.search(r'^(.+?)\s*-\s*\$\s*(\d+).*$', linea)
        if match_precio:
            descripcion = match_precio.group(1).strip()
            precio = int(match_precio.group(2))
            
            # Filtrar líneas que no son productos (encabezados, separadores, etc.)
            if (not descripcion.startswith('►') and 
                not descripcion.startswith('#') and
                not descripcion.startswith('=') and 
                not descripcion.startswith('-') and 
                not descripcion.startswith('BUEN DIA') and
                not descripcion.startswith('LOS PEDIDOS') and
                not descripcion.startswith('NO ') and
                len(descripcion) > 5):  # Filtrar líneas muy cortas
                
                productos.append({
                    'Descripción': descripcion,
                    'Precio Venta': precio,
                    'Proveedor': 'GCGroup'
                })
        else:
            # Si no es formato "PRODUCTO - $ PRECIO", ignorar
            continue
    
    # Crear DataFrame
    df = pd.DataFrame(productos)
    
    if df.empty:
        print("⚠️ No se encontraron productos válidos en el archivo")
        return
    
    # Guardar como Excel
    os.makedirs("output", exist_ok=True)
    df.to_excel(excel_output_path, index=False)
    
    print(f"✅ Archivo procesado exitosamente: {excel_output_path}")
    print(f"📊 Productos procesados: {len(df)} productos")
    
    # Mostrar muestra de los primeros productos
    if len(df) > 0:
        print("\n📋 Muestra de productos procesados:")
        print("-" * 50)
        for i, row in df.head(5).iterrows():
            print(f"   {row['Descripción'][:60]}...")
            print(f"   Precio: U$S {row['Precio Venta']}")
            print()

if __name__ == "__main__":
    try:
        procesar_lista_gcgroup()
    except Exception as e:
        print(f"❌ Error: {e}")