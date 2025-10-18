import json
import os
from datetime import datetime

def generar_difusion_txt():
    """Generar archivo TXT de difusión para WhatsApp"""
    
    # Obtener fecha actual en formato DD/MM/YYYY
    fecha_actual = datetime.now().strftime("%d/%m/%Y")
    fecha_archivo = datetime.now().strftime("%d-%m-%Y")
    
    # Configuración de archivos
    json_input_path = "../public/productos_ram.json"
    txt_output_path = f"output/difusion_ram_{fecha_archivo}.txt"
    
    # Verificar que existe el archivo JSON
    if not os.path.exists(json_input_path):
        raise FileNotFoundError(f"No se encontró el archivo JSON: {json_input_path}")
    
    print(f"Generando archivo de difusión para WhatsApp...")
    print("="*50)
    
    # Leer el JSON
    with open(json_input_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Extraer la lista de productos de la estructura correcta
    if isinstance(data, dict) and 'productos' in data:
        productos = data['productos']
        print(f"Procesando {len(productos)} productos desde estructura con metadatos")
    else:
        # Fallback para estructura antigua
        productos = data if isinstance(data, list) else []
        print(f"Procesando {len(productos)} productos desde estructura simple")
    
    # Crear el encabezado
    contenido = [
        "🏪 LISTA DE PRECIOS RAM INFORMATICA",
        "",
        "⚠️ CONSULTAS Y PEDIDOS SE TOMAN DESDE EL MOMENTO QUE ENVIAMOS LA LISTA HASTA LAS 13 HS.",
        "UNA VEZ CONFIRMADO EL PEDIDO SE RETIRA POR MI DOMICILIO.",
        "",
        "💰 ACLARACION IMPORTANTE",
        "PARA CONFIRMAR LA COMPRA SE REQUIERE EL PAGO DEL 50% DEL PRODUCTO (CON PRECIO ABIERTO SI PAGA EN PESOS POR VARIACION DEL DOLAR) O PAGO TOTAL PARA CONGELAR EL PRECIO.",
        "",
        "⛔ NO ⛔ SE ACEPTAN DÓLARES CARA CHICA, MANCHADOS, ROTOS, ESCRITOS. NO SE ACEPTA CAMBIO EN CANTIDAD - MAYOR A 50. SIN EXCEPCIÓN",
        "",
        "🛒 PRODUCTOS DISPONIBLES",
        "="*50,
        ""
    ]
    
    # Agrupar productos por categoría
    productos_por_categoria = {}
    for producto in productos:
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
    ])
    
    # Crear directorio output si no existe
    os.makedirs("output", exist_ok=True)
    
    # Guardar archivo TXT
    with open(txt_output_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(contenido))
    
    print(f"Archivo de difusión generado: {txt_output_path}")
    print(f"Total productos: {len(productos)}")
    print(f"Fecha: {fecha_actual}")
    print("="*50)
    print("Archivo listo para difusión en WhatsApp!")
    
    return txt_output_path

if __name__ == "__main__":
    generar_difusion_txt()
