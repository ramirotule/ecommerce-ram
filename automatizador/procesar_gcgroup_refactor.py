#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Procesador de precios específico para GCGroup
Formula: (precio_costo + 18%) + $20 USD, redondeado a múltiplo de 5
"""

import re
import os
import json
import math
from datetime import datetime

class ProcesadorGCGroup:
    def __init__(self):
        self.productos_extraidos = []
        # Regex actualizado para el formato real: "PRODUCTO - $ PRECIO"
        self.precio_regex = r'^([^-]+)\s*-\s*\$\s*(\d+(?:\.\d+)?)$'
        
    def calcular_precio_venta(self, precio_costo):
        """
        Calcular precio de venta usando la fórmula:
        (precio_costo + 18%) + $20 USD, redondeado a múltiplo de 5
        """
        try:
            # Convertir a float si es string
            if isinstance(precio_costo, str):
                precio_costo = float(precio_costo.replace(',', '.'))
            
            # Aplicar 18% de ganancia
            precio_con_ganancia = precio_costo * 1.18
            
            # Sumar $20 USD extras
            precio_con_extras = precio_con_ganancia + 20
            
            # Redondear a múltiplo de 5
            precio_final = math.ceil(precio_con_extras / 5) * 5
            
            return int(precio_final)
            
        except Exception as e:
            print(f"⚠️ Error calculando precio para {precio_costo}: {e}")
            return None

    def extraer_productos_del_texto(self, texto_completo):
        """Extraer productos y precios del texto de GCGroup"""
        try:
            print(f"🔍 Procesando texto de {len(texto_completo)} caracteres...")
            
            # Dividir en líneas para procesar
            lineas = texto_completo.split('\n')
            categoria_actual = "PRODUCTOS"
            
            for linea in lineas:
                linea = linea.strip()
                
                # Detectar categorías
                if linea.startswith('►'):
                    categoria_actual = linea.replace('►', '').strip()
                    print(f"   📂 Categoría encontrada: {categoria_actual}")
                    continue
                
                # Buscar productos con precios
                match = re.search(self.precio_regex, linea, re.MULTILINE)
                if match:
                    producto_raw = match.group(1).strip()
                    precio_costo = float(match.group(2))
                    
                    # Limpiar nombre del producto (eliminar caracteres extra)
                    producto = producto_raw.strip()
                    
                    # Calcular precio de venta
                    precio_venta = self.calcular_precio_venta(precio_costo)
                    
                    if precio_venta:
                        producto_info = {
                            'producto': producto,  # Cambiado de 'nombre' a 'producto' para consistencia
                            'precio_costo': precio_costo,
                            'precio_venta': precio_venta,
                            'categoria': categoria_actual,
                            'ganancia_porcentaje': 18,
                            'extra_usd': 20
                        }
                        
                        self.productos_extraidos.append(producto_info)
                        print(f"   ✅ {producto}: ${precio_costo} → ${precio_venta}")
            
            print(f"   📊 Total productos extraídos: {len(self.productos_extraidos)}")
            return self.productos_extraidos
            
        except Exception as e:
            print(f"❌ Error extrayendo productos: {e}")
            return []

    def generar_json_productos(self, archivo_salida="../public/productos_ram.json"):
        """Generar JSON con estructura compatible con el frontend"""
        try:
            # Estructura compatible con el frontend existente
            estructura_json = {
                "metadatos": {
                    "fecha_extraccion": datetime.now().strftime("%d/%m/%Y %H:%M"),
                    "proveedor": "GcGroup",
                    "total_productos": len(self.productos_extraidos),
                    "formula_precio": "(costo + 18%) + $20, redondeado a múltiplo de 5"
                },
                "productos": {}
            }
            
            # Agrupar por categorías
            for producto in self.productos_extraidos:
                categoria = producto['categoria']
                if categoria not in estructura_json["productos"]:
                    estructura_json["productos"][categoria] = []
                
                # Formato compatible con el frontend
                producto_frontend = {
                    "nombre": producto['producto'],  # Corregido: usar 'producto' en lugar de 'nombre'
                    "precio": producto['precio_venta'],
                    "precio_costo": producto['precio_costo'],
                    "categoria": categoria
                }
                
                estructura_json["productos"][categoria].append(producto_frontend)
            
            # Guardar JSON
            os.makedirs(os.path.dirname(archivo_salida), exist_ok=True)
            with open(archivo_salida, 'w', encoding='utf-8') as f:
                json.dump(estructura_json, f, indent=2, ensure_ascii=False)
            
            print(f"✅ JSON generado: {archivo_salida}")
            print(f"📊 {len(self.productos_extraidos)} productos en {len(estructura_json['productos'])} categorías")
            return True
            
        except Exception as e:
            print(f"❌ Error generando JSON: {e}")
            return False

    def generar_archivo_difusion(self, archivo_salida="output/difusion_ram_gcgroup.txt"):
        """Generar archivo de difusión para WhatsApp"""
        try:
            fecha_hoy = datetime.now().strftime("%d-%m-%Y")
            archivo_con_fecha = f"output/difusion_ram_{fecha_hoy}.txt"
            
            # Crear directorio si no existe
            os.makedirs("output", exist_ok=True)
            
            with open(archivo_con_fecha, 'w', encoding='utf-8') as f:
                # Encabezado
                f.write(f"🔥 LISTA DE PRECIOS RAM - {datetime.now().strftime('%d/%m/%Y')} 🔥\n")
                f.write("=" * 50 + "\n\n")
                
                # Agrupar por categorías
                categorias = {}
                for producto in self.productos_extraidos:
                    categoria = producto['categoria']
                    if categoria not in categorias:
                        categorias[categoria] = []
                    categorias[categoria].append(producto)
                
                # Escribir por categorías
                for categoria, productos in categorias.items():
                    f.write(f"📱 {categoria}\n")
                    f.write("-" * 30 + "\n")
                    
                    for producto in productos:
                        f.write(f"• {producto['producto']} - ${producto['precio_venta']}\n")  # Corregido: usar 'producto'
                    
                    f.write("\n")
                
                # Pie de página
                f.write("=" * 50 + "\n")
                f.write("💬 Consultas y pedidos por WhatsApp\n")
                f.write(f"📅 Actualizado: {datetime.now().strftime('%d/%m/%Y %H:%M')}\n")
            
            print(f"✅ Archivo de difusión generado: {archivo_con_fecha}")
            return True
            
        except Exception as e:
            print(f"❌ Error generando archivo de difusión: {e}")
            return False

def main():
    """Función principal para procesar archivo de GCGroup"""
    print("🚀 PROCESANDO LISTA DE PRECIOS GCGROUP".encode('cp1252', errors='replace').decode('cp1252'))
    print("=" * 50)
    
    procesador = ProcesadorGCGroup()
    
    # Buscar archivo de entrada
    archivo_entrada = "output/lista_gcgroup.txt"
    
    if not os.path.exists(archivo_entrada):
        print(f"❌ No se encontró el archivo: {archivo_entrada}")
        return False
    
    # Leer archivo
    try:
        with open(archivo_entrada, 'r', encoding='utf-8') as f:
            contenido = f.read()
        
        if len(contenido.strip()) == 0:
            print(f"❌ El archivo {archivo_entrada} está vacío")
            return False
        
        print(f"✅ Archivo leído: {len(contenido)} caracteres")
        
    except Exception as e:
        print(f"❌ Error leyendo archivo: {e}")
        return False
    
    # Procesar productos
    productos = procesador.extraer_productos_del_texto(contenido)
    
    if not productos:
        print("❌ No se encontraron productos en el archivo")
        return False
    
    # Generar archivos de salida
    print("\n📝 Generando archivos de salida...")
    
    # Generar JSON
    json_ok = procesador.generar_json_productos()
    
    # Generar archivo de difusión
    difusion_ok = procesador.generar_archivo_difusion()
    
    if json_ok and difusion_ok:
        print("\n🎉 ¡Procesamiento completado exitosamente!")
        print(f"   📊 {len(productos)} productos procesados")
        print("   📁 Archivos generados:")
        print("     • productos_ram.json (para frontend)")
        print("     • difusion_ram_[fecha].txt (para WhatsApp)")
        return True
    else:
        print("\n⚠️ Procesamiento completado con errores")
        return False

if __name__ == "__main__":
    main()