import time
import re
import os
import subprocess
import sys
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

class AutomatizadorWSP:
    def __init__(self):
        """Inicializar el automatizador con configuración de Selenium"""
        self.driver = None
        self.proveedores = {
            "Rodrigo Provee": {
                "archivo_salida": "output/lista_rodrigo.txt",
                "filtro_inicio": ["lista", "precios", "iphone", "samsung"],  # Palabras que indican inicio de lista
                "nombre_corto": "rodrigo",
                "busqueda_alternativa": ["rodrigo", "provee"]  # Términos alternativos para buscar
            },
            "Kadabra Provee": {  # Simplificado
                "archivo_salida": "output/lista_kadabra.txt", 
                "filtro_inicio": ["lista", "precios", "iphone", "samsung"],
                "nombre_corto": "kadabra",
                "busqueda_alternativa": ["kadabra", "provee"]
            },
            "GcGroup": {
                "archivo_salida": "output/lista_gcgroup.txt",
                "filtro_inicio": ["lista de hoy"],  # Específico para GcGroup
                "nombre_corto": "gcgroup",
                "busqueda_alternativa": ["gc", "group", "gcgroup"]
            }
        }
        
    def configurar_navegador(self):
        """Configurar y abrir navegador con sesión persistente"""
        print("🔧 Configurando navegador...")
        
        options = webdriver.ChromeOptions()
        options.add_argument("--user-data-dir=C:/selenium_wsp")
        options.add_argument("--profile-directory=Default")
        options.add_argument("--start-maximized")
        options.add_experimental_option('excludeSwitches', ['enable-logging'])
        options.add_experimental_option('useAutomationExtension', False)
        
        try:
            self.driver = webdriver.Chrome(
                service=Service(ChromeDriverManager().install()), 
                options=options
            )
            
            print("✅ Abriendo WhatsApp Web...")
            self.driver.get("https://web.whatsapp.com")
            print("⏳ Esperando 8 segundos para cargar WhatsApp...")
            time.sleep(15)
            return True
            
        except Exception as e:
            print(f"❌ Error configurando navegador: {e}")
            return False
    
    def ir_al_final_del_chat(self):
        """Ir directamente al final del chat para obtener SOLO los mensajes más recientes (hoy)"""
        try:
            print("📍 Yendo al final del chat para buscar SOLO mensajes de hoy...")
            
            # Encontrar el contenedor del chat
            chat_container = None
            selectores = [
                '//div[@data-testid="chat-history"]',
                '//div[@data-testid="conversation-panel-messages"]', 
                '//div[contains(@class, "copyable-area")]'
            ]
            
            for selector in selectores:
                try:
                    chat_container = WebDriverWait(self.driver, 5).until(
                        EC.presence_of_element_located((By.XPATH, selector))
                    )
                    print(f"   ✅ Contenedor encontrado con: {selector}")
                    break
                except:
                    continue
            
            if not chat_container:
                print("   ⚠️ No se pudo encontrar el contenedor del chat")
                return False
            
            # Ir al final del chat (mensajes más recientes)
            self.driver.execute_script("arguments[0].scrollTop = arguments[0].scrollHeight;", chat_container)
            time.sleep(2)
            print("   ✅ Posicionado al final del chat (mensajes más recientes)")
            
            # NO hacer scroll hacia arriba - mantener solo en la zona más reciente
            # Solo un pequeño ajuste para asegurar que los mensajes estén completamente visibles
            self.driver.execute_script("arguments[0].scrollTop = arguments[0].scrollTop - 100;", chat_container)
            time.sleep(1)
            
            print("   🎯 Enfocado en mensajes más recientes (zona de hoy)")
            return True
            
        except Exception as e:
            print(f"⚠️ Error al ir al final del chat: {e}")
            return False
    
    def expandir_mensajes_largos(self):
        """Expandir mensajes que tengan 'Lee más...' con múltiples pasadas"""
        try:
            print("📖 Expandiendo mensajes largos...")
            total_expandidos = 0
            max_intentos = 5  # Máximo 5 pasadas para evitar bucle infinito
            
            for intento in range(max_intentos):
                # Buscar botones "Lee más..." con múltiples selectores
                botones_leer_mas = []
                
                # Selector 1: Elementos span con texto
                botones_span = self.driver.find_elements(By.XPATH, 
                    '//span[contains(text(), "Lee más") or contains(text(), "Read more") or '
                    'contains(text(), "Show more") or contains(text(), "Ver más") or '
                    'contains(text(), "más...") or contains(text(), "...")]'
                )
                botones_leer_mas.extend(botones_span)
                
                # Selector 2: Div con clase read-more-button (específico para GcGroup)
                botones_div_class = self.driver.find_elements(By.XPATH, 
                    '//div[contains(@class, "read-more-button")]'
                )
                botones_leer_mas.extend(botones_div_class)
                
                # Selector 3: Cualquier elemento con texto "Leer más"
                botones_general = self.driver.find_elements(By.XPATH, 
                    '//*[contains(text(), "Leer más") or contains(text(), "Read more")]'
                )
                botones_leer_mas.extend(botones_general)
                
                # Selector 4: Elementos clickeables con role="button" que contengan "más"
                botones_role = self.driver.find_elements(By.XPATH, 
                    '//div[@role="button" and contains(text(), "más")]'
                )
                botones_leer_mas.extend(botones_role)
                
                # Eliminar duplicados
                botones_unicos = []
                for boton in botones_leer_mas:
                    if boton not in botones_unicos:
                        botones_unicos.append(boton)
                botones_leer_mas = botones_unicos
                
                if not botones_leer_mas:
                    if intento == 0:
                        print("   ℹ️ No se encontraron mensajes para expandir")
                        # Debug: buscar elementos similares
                        debug_elements = self.driver.find_elements(By.XPATH, '//*[contains(text(), "más")]')
                        if debug_elements:
                            print(f"   🔍 Debug: Encontrados {len(debug_elements)} elementos con 'más':")
                            for elem in debug_elements[:3]:  # Mostrar solo los primeros 3
                                print(f"     - <{elem.tag_name}> '{elem.text[:50]}...'")
                    break
                
                print(f"   🔄 Pasada {intento + 1}: {len(botones_leer_mas)} botones encontrados")
                
                # Debug: mostrar tipos de botones encontrados
                if botones_leer_mas:
                    tipos_botones = {}
                    for boton in botones_leer_mas:
                        tipo = f"{boton.tag_name}"
                        if 'class' in boton.get_attribute('outerHTML'):
                            clases = boton.get_attribute('class')
                            if 'read-more' in clases:
                                tipo += " (read-more)"
                        tipos_botones[tipo] = tipos_botones.get(tipo, 0) + 1
                    
                    print(f"   📊 Tipos de botones: {tipos_botones}")
                
                expandidos_en_pasada = 0
                for i, boton in enumerate(botones_leer_mas):
                    try:
                        # Verificar si el botón aún es visible y clickeable
                        if boton.is_displayed() and boton.is_enabled():
                            # Debug: mostrar información del botón
                            texto_boton = boton.text[:30] if boton.text else "Sin texto"
                            tag_name = boton.tag_name
                            print(f"     🎯 Clickeando botón {i+1}: <{tag_name}> '{texto_boton}'...")
                            
                            # Hacer scroll hacia el botón para asegurar que esté visible
                            self.driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", boton)
                            time.sleep(0.5)
                            
                            # Intentar múltiples métodos de clic
                            click_exitoso = False
                            
                            # Método 1: JavaScript click
                            try:
                                self.driver.execute_script("arguments[0].click();", boton)
                                click_exitoso = True
                                print(f"       ✅ Click exitoso con JavaScript")
                            except:
                                pass
                            
                            # Método 2: Click directo si el primero falló
                            if not click_exitoso:
                                try:
                                    boton.click()
                                    click_exitoso = True
                                    print(f"       ✅ Click exitoso directo")
                                except:
                                    pass
                            
                            # Método 3: Simular Enter si los anteriores fallaron
                            if not click_exitoso:
                                try:
                                    boton.send_keys('\ue007')  # Enter
                                    click_exitoso = True
                                    print(f"       ✅ Click exitoso con Enter")
                                except:
                                    print(f"       ❌ No se pudo hacer click")
                                    continue
                            
                            if click_exitoso:
                                expandidos_en_pasada += 1
                                time.sleep(1)  # Pausa para que se cargue el contenido expandido
                                
                                # Cada 3 clics, hacer una pausa más larga para que WhatsApp procese
                                if (i + 1) % 3 == 0:
                                    print(f"       ⏳ Pausa de procesamiento...")
                                    time.sleep(2)
                                
                    except Exception as e:
                        print(f"       ⚠️ Error con botón {i+1}: {e}")
                        continue
                
                total_expandidos += expandidos_en_pasada
                print(f"   ✅ Expandidos en esta pasada: {expandidos_en_pasada}")
                
                # Si no se expandió ninguno en esta pasada, salir del bucle
                if expandidos_en_pasada == 0:
                    break
                
                # Pausa entre pasadas para que WhatsApp procese los cambios
                time.sleep(2)
            
            print(f"✅ Total de mensajes expandidos: {total_expandidos}")
            
            # Hacer scroll final para asegurar que todos los mensajes estén cargados
            if total_expandidos > 0:
                print("   📜 Haciendo scroll final para cargar contenido expandido...")
                chat_container = self.driver.find_element(By.XPATH, '//div[@data-testid="chat-history"]')
                self.driver.execute_script("arguments[0].scrollTop = 0;", chat_container)
                time.sleep(1)
                
        except Exception as e:
            print(f"⚠️ Error al expandir mensajes: {e}")
            print("   ℹ️ Continuando con la extracción...")
    
    def filtrar_mensajes_del_dia(self, textos, filtro_inicio):
        """Filtrar SOLO mensajes recibidos el día de hoy (estricto)"""
        fecha_hoy = datetime.now().strftime("%d/%m/%Y")  # Formato dd/mm/yyyy
        fecha_hoy_alt = datetime.now().strftime("%d/%m/%y")  # Formato dd/mm/yy
        palabras_hoy = ["hoy", "today"]
        mensajes_filtrados = []
        for texto in textos:
            texto_lower = texto.lower()
            # Solo aceptar si contiene la fecha de hoy, la fecha alternativa, o la palabra 'hoy' explícita
            if fecha_hoy in texto or fecha_hoy_alt in texto:
                mensajes_filtrados.append(texto)
            elif any(palabra in texto_lower for palabra in palabras_hoy):
                mensajes_filtrados.append(texto)
        return mensajes_filtrados
    
    def verificar_chat_tiene_mensajes_hoy(self):
        """Verificar rápidamente si el chat tiene mensajes de hoy sin procesarlo completamente"""
        try:
            print("🔍 Verificando si hay mensajes de hoy...")
            
            # Primero, buscar texto que contenga la fecha de hoy en el contenido de los mensajes
            fecha_hoy_texto = datetime.now().strftime("VIERNES %d DE SEPTIEMBRE").upper()  # Ejemplo: "VIERNES 26 DE SEPTIEMBRE"
            fecha_hoy_corta = datetime.now().strftime("%d DE SEPTIEMBRE").upper()  # Ejemplo: "26 DE SEPTIEMBRE"
            fecha_hoy_numero = datetime.now().strftime("%d/%m/%Y")  # Ejemplo: "26/09/2025"
            
            print(f"   🔍 Buscando: '{fecha_hoy_texto}' o '{fecha_hoy_corta}' o '{fecha_hoy_numero}'")
            
            # Buscar en el contenido de los mensajes visibles
            try:
                # Buscar todos los elementos de mensaje que podrían contener la fecha de hoy
                elementos_mensaje = self.driver.find_elements(By.XPATH, 
                    '//div[contains(@class, "message") or contains(@class, "copyable-text")]//span[contains(text(), "LISTA") or contains(text(), "HOY") or contains(text(), "SEPTIEMBRE")]')
                
                for elemento in elementos_mensaje:
                    texto_elemento = elemento.text.upper()
                    if (fecha_hoy_texto in texto_elemento or 
                        fecha_hoy_corta in texto_elemento or
                        fecha_hoy_numero in texto_elemento or
                        ("LISTA DE HOY" in texto_elemento and "SEPTIEMBRE" in texto_elemento)):
                        print(f"   ✅ Encontrado mensaje con fecha de hoy: '{texto_elemento[:100]}...'")
                        return True
            except Exception as e:
                print(f"   ⚠️ Error buscando en contenido de mensajes: {e}")
            
            # Método alternativo: buscar la etiqueta "Hoy" del DOM
            selectores_hoy = [
                '//span[contains(@class, "x140p0ai") and contains(@class, "x1gufx9m") and text()="Hoy"]',
                '//span[contains(@class, "x140p0ai") and text()="Hoy"]',
                '//span[text()="Hoy"]'
            ]
            
            for selector in selectores_hoy:
                try:
                    elementos_hoy = self.driver.find_elements(By.XPATH, selector)
                    if elementos_hoy:
                        print(f"   ✅ Encontrada etiqueta DOM 'Hoy'")
                        return True
                except:
                    continue
            
            print(f"   ⚠️ No se encontró fecha de hoy ni etiqueta 'Hoy' - Chat sin mensajes de hoy")
            return False
            
        except Exception as e:
            print(f"   ❌ Error verificando mensajes de hoy: {e}")
            return False

    def buscar_y_abrir_chat(self, nombre_proveedor, config):
        """Buscar y abrir el chat del proveedor con búsqueda flexible"""
        try:
            print(f"🔍 Buscando chat: {nombre_proveedor}")
            
            # Buscar el campo de búsqueda y hacer clic para asegurar que esté activo
            search_box = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.XPATH, '//div[@contenteditable="true"][@data-tab="3"]'))
            )
            
            # Hacer clic explícito en el campo de búsqueda para activarlo
            print("   🎯 Activando campo de búsqueda...")
            self.driver.execute_script("arguments[0].click();", search_box)
            time.sleep(1)
            
            # Intentar con el nombre completo primero
            nombres_a_probar = [nombre_proveedor] + config.get("busqueda_alternativa", [])
            
            for nombre_busqueda in nombres_a_probar:
                print(f"   🔎 Probando con: '{nombre_busqueda}'")
                
                # Hacer clic nuevamente y limpiar completamente
                self.driver.execute_script("arguments[0].click();", search_box)
                time.sleep(0.5)
                
                # Limpiar usando Ctrl+A y Delete
                search_box.send_keys('\ue009' + 'a')  # Ctrl+A (seleccionar todo)
                time.sleep(0.3)
                search_box.send_keys('\ue017')  # Delete
                time.sleep(0.5)
                
                # Escribir el nombre del proveedor
                search_box.send_keys(nombre_busqueda)
                time.sleep(3)
                
                # Buscar en la lista de chats
                chat_list = self.driver.find_elements(By.XPATH, '//span[@title]')
                chat_match = None
                
                for chat in chat_list:
                    titulo = chat.get_attribute("title").lower()
                    # Búsqueda más flexible
                    if (nombre_busqueda.lower() in titulo or 
                        any(alt.lower() in titulo for alt in config.get("busqueda_alternativa", []))):
                        chat_match = chat
                        print(f"   ✅ Encontrado: '{chat.get_attribute('title')}'")
                        break
                
                if chat_match:
                    # Hacer clic en el chat
                    chat_match.click()
                    time.sleep(4)
                    print(f"✅ Chat abierto: {chat.get_attribute('title')}")
                    return True
            
            print(f"❌ No se encontró ningún chat para: {nombre_proveedor}")
            return False
            
        except Exception as e:
            print(f"❌ Error abriendo chat {nombre_proveedor}: {e}")
            return False
    
    def extraer_mensajes_por_contenido(self):
        """Extraer mensajes basándose en el contenido de texto de hoy"""
        try:
            print("📝 Extrayendo mensajes por análisis de contenido...")
            
            # Fecha de hoy en diferentes formatos
            fecha_hoy_texto = datetime.now().strftime("VIERNES %d DE SEPTIEMBRE").upper()
            fecha_hoy_corta = datetime.now().strftime("%d DE SEPTIEMBRE").upper()
            
            textos_encontrados = []
            
            # Buscar todos los elementos de mensaje en el área visible
            selectores_mensaje = [
                '//div[contains(@class, "message-in")]//span[contains(@class, "selectable-text")]',
                '//div[contains(@class, "copyable-text")]//span',
                '//span[@class="selectable-text copyable-text"]',
                '//div[@data-testid="msg-container"]//span'
            ]
            
            for selector in selectores_mensaje:
                try:
                    elementos = self.driver.find_elements(By.XPATH, selector)
                    for elemento in elementos:
                        texto = elemento.text.strip()
                        if texto and len(texto) > 20:  # Solo textos significativos
                            texto_upper = texto.upper()
                            
                            # Si encontramos el mensaje con la fecha de hoy, empezar a capturar
                            if (fecha_hoy_texto in texto_upper or 
                                fecha_hoy_corta in texto_upper or
                                ("LISTA DE HOY" in texto_upper and "SEPTIEMBRE" in texto_upper)):
                                
                                print(f"   🎯 Mensaje de hoy encontrado: '{texto[:100]}...'")
                                textos_encontrados.append(texto)
                                
                                # Buscar más mensajes cercanos que podrían ser parte de la lista
                                parent = elemento
                                try:
                                    # Subir en el DOM para encontrar el contenedor del mensaje
                                    for _ in range(5):
                                        parent = parent.find_element(By.XPATH, '..')
                                        
                                    # Buscar elementos hermanos que podrían contener más parte del mensaje
                                    hermanos = parent.find_elements(By.XPATH, './/span[contains(@class, "selectable-text")]')
                                    for hermano in hermanos:
                                        texto_hermano = hermano.text.strip()
                                        if texto_hermano and len(texto_hermano) > 10 and texto_hermano != texto:
                                            textos_encontrados.append(texto_hermano)
                                            
                                except:
                                    pass
                                
                                break
                                
                    if textos_encontrados:
                        break
                        
                except Exception as e:
                    print(f"   ⚠️ Error con selector {selector}: {e}")
                    continue
            
            if textos_encontrados:
                print(f"   ✅ Encontrados {len(textos_encontrados)} segmentos de mensaje")
                # Unir todos los textos encontrados
                texto_completo = '\n'.join(textos_encontrados)
                return [texto_completo] if texto_completo else []
            else:
                print("   ⚠️ No se encontraron mensajes de hoy por contenido")
                return []
                
        except Exception as e:
            print(f"   ❌ Error extrayendo mensajes por contenido: {e}")
            return []

    def extraer_mensajes_desde_ultima_etiqueta(self):
        """Extraer mensajes desde la última etiqueta de fecha encontrada - CON MÉTODO MEJORADO"""
        try:
            print("📝 Buscando mensajes de hoy con método inteligente...")
            
            # MÉTODO 1: Buscar por contenido de texto (más confiable)
            mensajes_contenido = self.extraer_mensajes_por_contenido()
            if mensajes_contenido:
                print("   ✅ Mensajes encontrados por análisis de contenido")
                return mensajes_contenido
            
            print("   ⚠️ Método de contenido no encontró mensajes, intentando método de etiquetas DOM...")
            
            # MÉTODO 2: Buscar por etiquetas DOM (fallback)
            return self.extraer_mensajes_por_etiquetas_dom()
            
        except Exception as e:
            print(f"❌ Error en extracción de mensajes: {e}")
            return []
    
    def extraer_mensajes_por_etiquetas_dom(self):
        """Método original de extracción por etiquetas DOM"""
        try:
            print("� Buscando última etiqueta de fecha...")
            
            # Buscar todas las etiquetas de fecha (Hoy, Ayer, fechas específicas)
            # Incluir el selector específico proporcionado para el elemento "Hoy"
            selectores_fecha = [
                # Selector específico para el elemento "Hoy" con las clases exactas
                '//span[contains(@class, "x140p0ai") and contains(@class, "x1gufx9m") and contains(@class, "x1s928wv") and text()="Hoy"]',
                # Selector más general pero específico para "Hoy"
                '//span[contains(@class, "x140p0ai") and text()="Hoy"]',
                # Selectores originales como fallback
                '//span[contains(@class, "x140p0ai") and (text()="Hoy" or text()="Ayer" or text()="Today" or text()="Yesterday")]',
                '//span[text()="Hoy" or text()="Ayer" or text()="Today" or text()="Yesterday"]',
                '//div[contains(@class, "x1n2onr6")]//span[contains(@class, "x140p0ai")]'
            ]
            
            ultima_etiqueta = None
            etiqueta_hoy_encontrada = False
            
            for selector in selectores_fecha:
                try:
                    etiquetas = self.driver.find_elements(By.XPATH, selector)
                    if etiquetas:
                        # Priorizar específicamente la etiqueta "Hoy"
                        for etiqueta in reversed(etiquetas):  # Empezar por las más recientes
                            texto_etiqueta = etiqueta.text.strip()
                            if texto_etiqueta in ["Hoy", "Today"]:
                                ultima_etiqueta = etiqueta
                                etiqueta_hoy_encontrada = True
                                print(f"   🎯 Etiqueta 'Hoy' encontrada: '{texto_etiqueta}'")
                                break
                        
                        # Si encontramos "Hoy", salir del bucle principal
                        if etiqueta_hoy_encontrada:
                            break
                            
                        # Si no encontramos "Hoy", usar la última etiqueta como fallback
                        if not ultima_etiqueta:
                            ultima_etiqueta = etiquetas[-1]
                            texto_etiqueta = ultima_etiqueta.text
                            print(f"   ✅ Última etiqueta encontrada (fallback): '{texto_etiqueta}'")
                except:
                    continue
            
            if not ultima_etiqueta:
                print("   ⚠️ No se encontró ninguna etiqueta de fecha")
                return []
            
            # Verificar si realmente encontramos la etiqueta "Hoy"
            texto_final = ultima_etiqueta.text.strip()
            if not etiqueta_hoy_encontrada:
                print(f"   ⚠️ ADVERTENCIA: No se encontró etiqueta 'Hoy', usando '{texto_final}' como fallback")
                print("   💡 Esto podría significar que no hay mensajes de hoy o que la estructura del DOM cambió")
            else:
                print(f"   ✅ Confirmado: Procesando mensajes desde etiqueta 'Hoy'")
            
            # Buscar todos los mensajes que están después de esta etiqueta
            textos = []
            
            try:
                # Encontrar el contenedor padre de la etiqueta
                contenedor_etiqueta = ultima_etiqueta
                for _ in range(10):  # Subir hasta 10 niveles para encontrar el contenedor principal
                    contenedor_etiqueta = contenedor_etiqueta.find_element(By.XPATH, '..')
                    
                    # Buscar todos los mensajes siguientes en el chat
                    selectores_mensajes = [
                        './/following::div[contains(@class, "copyable-text")]',
                        './/following::span[contains(@class, "selectable-text")]',
                        './/following::div[@data-testid="msg-container"]//span',
                        './/following::div[contains(@class, "message")]//span[contains(@class, "selectable-text")]'
                    ]
                    
                    for selector_msg in selectores_mensajes:
                        try:
                            mensajes = contenedor_etiqueta.find_elements(By.XPATH, selector_msg)
                            if mensajes:
                                print(f"   📋 Encontrados {len(mensajes)} mensajes después de la etiqueta")
                                for msg in mensajes:
                                    texto = msg.text.strip()
                                    if texto and len(texto) > 2:
                                        textos.append(texto)
                                if textos:
                                    break
                        except:
                            continue
                    
                    if textos:
                        break
                        
            except Exception as e:
                print(f"   ⚠️ Error buscando mensajes después de etiqueta: {e}")
            
            # Si no encontró mensajes con el método anterior, usar método directo
            if not textos:
                print("   🔄 Intentando método directo...")
                try:
                    # Buscar mensajes directamente después de cualquier etiqueta de fecha
                    mensajes_directos = self.driver.find_elements(By.XPATH, 
                        '//span[text()="Hoy" or text()="Ayer"]/ancestor::div[1]/following-sibling::div//span[contains(@class, "selectable-text")]'
                    )
                    
                    if not mensajes_directos:
                        # Método alternativo más amplio
                        mensajes_directos = self.driver.find_elements(By.XPATH, 
                            '//div[contains(@class, "copyable-text")]'
                        )
                        # Tomar solo los últimos 20 mensajes
                        mensajes_directos = mensajes_directos[-20:] if len(mensajes_directos) > 20 else mensajes_directos
                    
                    for msg in mensajes_directos:
                        texto = msg.text.strip()
                        if texto and len(texto) > 2:
                            textos.append(texto)
                            
                except Exception as e:
                    print(f"   ⚠️ Error en método directo: {e}")
            
            # Eliminar duplicados manteniendo orden
            textos_unicos = []
            for texto in textos:
                if texto not in textos_unicos:
                    textos_unicos.append(texto)
            
            print(f"📊 Total mensajes extraídos desde última etiqueta: {len(textos_unicos)}")
            return textos_unicos
            
        except Exception as e:
            print(f"❌ Error extrayendo mensajes desde última etiqueta: {e}")
            return []
    
    def extraer_mensajes_fallback(self):
        """Método de fallback para extraer mensajes si no se encuentra la etiqueta 'Hoy'"""
        try:
            print("🔄 Ejecutando extracción de fallback...")
            
            # Intentar múltiples selectores para los mensajes
            selectores_mensajes = [
                '//div[@class="copyable-text"]',
                '//div[contains(@class, "copyable-text")]',
                '//span[@class="_ao3e selectable-text copyable-text"]',
                '//div[@data-testid="conversation-panel-messages"]//span',
                '//div[contains(@class, "message")]//span[contains(@class, "selectable-text")]'
            ]
            
            textos = []
            mensajes_encontrados = False
            
            for selector in selectores_mensajes:
                try:
                    mensajes_divs = self.driver.find_elements(By.XPATH, selector)
                    if mensajes_divs:
                        print(f"   ✅ Mensajes encontrados con selector fallback: {selector}")
                        for msg in mensajes_divs:
                            texto = msg.text.strip()
                            if texto and len(texto) > 2:
                                textos.append(texto)
                        mensajes_encontrados = True
                        break
                except Exception as e:
                    continue
            
            if not mensajes_encontrados:
                print("   ⚠️ Método de fallback también falló")
                return []
            
            # Eliminar duplicados manteniendo orden
            textos_unicos = []
            for texto in textos:
                if texto not in textos_unicos:
                    textos_unicos.append(texto)
            
            print(f"📊 Total mensajes fallback extraídos: {len(textos_unicos)}")
            return textos_unicos
            
        except Exception as e:
            print(f"❌ Error en método de fallback: {e}")
            return []
    
    def guardar_archivo_txt(self, textos, archivo_salida, nombre_proveedor):
        """Guardar mensajes en archivo .txt"""
        try:
            # Crear directorio si no existe
            os.makedirs("output", exist_ok=True)
            
            # Escribir archivo
            with open(archivo_salida, 'w', encoding='utf-8') as file:
                # Escribir encabezado
                file.write(f"# Lista de precios - {nombre_proveedor}\n")
                file.write(f"# Extraído automáticamente el {datetime.now().strftime('%d/%m/%Y %H:%M')}\n")
                file.write("# " + "="*60 + "\n\n")
                
                # Escribir mensajes
                for texto in textos:
                    file.write(texto + "\n")
            
            print(f"✅ Archivo guardado: {archivo_salida}")
            print(f"📄 Líneas escritas: {len(textos)}")
            return True
            
        except Exception as e:
            print(f"❌ Error guardando archivo {archivo_salida}: {e}")
            return False
    
    def limpiar_busqueda(self):
        """Limpiar el campo de búsqueda para el siguiente proveedor"""
        try:
            print("🧹 Limpiando campo de búsqueda...")
            search_box = WebDriverWait(self.driver, 5).until(
                EC.presence_of_element_located((By.XPATH, '//div[@contenteditable="true"][@data-tab="3"]'))
            )
            
            # Hacer clic y limpiar
            self.driver.execute_script("arguments[0].click();", search_box)
            time.sleep(0.5)
            search_box.send_keys('\ue009' + 'a')  # Ctrl+A
            time.sleep(0.3)
            search_box.send_keys('\ue017')  # Delete
            time.sleep(0.5)
            
        except Exception as e:
            print(f"⚠️ Error limpiando búsqueda: {e}")

    def procesar_proveedor(self, nombre_proveedor, config):
        """Procesar un proveedor específico"""
        print(f"\n{'='*60}")
        print(f"🏪 PROCESANDO: {nombre_proveedor}")
        print(f"{'='*60}")
        
        # Abrir chat
        if not self.buscar_y_abrir_chat(nombre_proveedor, config):
            return False
        
        # NUEVA VERIFICACIÓN: Comprobar si hay mensajes de hoy antes de procesar
        if not self.verificar_chat_tiene_mensajes_hoy():
            print(f"⏭️  SALTANDO {nombre_proveedor}: No tiene mensajes de hoy")
            return False
        
        print(f"✅ Confirmado: {nombre_proveedor} tiene mensajes de hoy - Continuando procesamiento...")
        
        # Ir al final del chat y expandir mensajes
        if not self.ir_al_final_del_chat():
            return False
        
        # Expandir mensajes largos solo en la zona reciente
        self.expandir_mensajes_largos()
        
        # Extraer mensajes
        mensajes = self.extraer_mensajes_desde_ultima_etiqueta()
        if not mensajes:
            print(f"⚠️ No se encontraron mensajes para {nombre_proveedor}")
            return False
        
        # Filtrar mensajes del día
        mensajes_filtrados = self.filtrar_mensajes_del_dia(mensajes, config["filtro_inicio"])
        print(f"🎯 Mensajes filtrados del día: {len(mensajes_filtrados)}")
        
        if not mensajes_filtrados:
            print(f"⚠️ No se encontraron mensajes del día para {nombre_proveedor}")
            print(f"⛔ No se guardarán mensajes viejos ni fallback.")
        
        # Guardar archivo
        exito = self.guardar_archivo_txt(
            mensajes_filtrados, 
            config["archivo_salida"], 
            nombre_proveedor
        )
        
        # Limpiar búsqueda para el próximo proveedor
        self.limpiar_busqueda()
        
        return exito
    
    def procesar_todos_proveedores(self):
        """Procesar solo el proveedor GcGroup automáticamente"""
        print("🚀 INICIANDO AUTOMATIZACIÓN DE WHATSAPP SOLO PARA GcGroup")
        print("="*70)
        
        # Estadísticas de eficiencia
        chats_procesados = 0
        chats_saltados = 0
        
        # Configurar navegador
        if not self.configurar_navegador():
            return False
        
        resultados = {}
        try:
            nombre_proveedor = "GcGroup"
            config = self.proveedores[nombre_proveedor]
            
            # Intentar procesar proveedor
            exito = self.procesar_proveedor(nombre_proveedor, config)
            
            if exito:
                chats_procesados += 1
            else:
                chats_saltados += 1
                
            resultados[nombre_proveedor] = exito
            
            # Mostrar estadísticas de eficiencia
            print(f"\n{'='*70}")
            print("📊 ESTADÍSTICAS DE EFICIENCIA")
            print(f"{'='*70}")
            print(f"✅ Chats procesados (con mensajes de hoy): {chats_procesados}")
            print(f"⏭️  Chats saltados (sin mensajes de hoy): {chats_saltados}")
            print(f"⚡ Eficiencia: Se evitó procesar {chats_saltados} chat(s) innecesario(s)")
            
            # Mostrar resumen final
            self.mostrar_resumen(resultados)
            # Si fue exitoso, ejecutar procesamiento automático
            if exito:
                print("\n⏳ Ejecutando procesamiento automático en 3 segundos...")
                time.sleep(3)
                self.ejecutar_procesamiento_automatico()
            else:
                print("\n⚠️ No se ejecutará el procesamiento automático porque no hubo extracción exitosa")
            return True
        except Exception as e:
            print(f"❌ Error general: {e}")
            return False
        finally:
            if self.driver:
                self.driver.quit()
                print("🔒 Navegador cerrado")
    
    def ejecutar_procesamiento_automatico(self):
        """Ejecutar scripts de procesamiento automáticamente"""
        print(f"\n{'='*70}")
        print("🔄 INICIANDO PROCESAMIENTO AUTOMÁTICO")
        print(f"{'='*70}")
        
        scripts_a_ejecutar = [
            {
                "nombre": "procesar_gcgroup.py",
                "descripcion": "Procesamiento de GcGroup con colores"
            },
            {
                "nombre": "excel_to_json.py", 
                "descripcion": "Conversión a JSON y generación de difusión"
            }
        ]
        
        for script in scripts_a_ejecutar:
            print(f"\n🚀 Ejecutando: {script['nombre']}")
            print(f"📝 {script['descripcion']}")
            print("-" * 50)
            
            try:
                # Verificar que el archivo del script existe
                if not os.path.exists(script['nombre']):
                    print(f"❌ Archivo no encontrado: {script['nombre']}")
                    continue
                
                # Ejecutar el script y capturar la salida
                resultado = subprocess.run(
                    [sys.executable, script['nombre']], 
                    capture_output=True, 
                    text=True,
                    encoding='utf-8',
                    cwd=os.getcwd()
                )
                
                # Mostrar la salida del script
                if resultado.stdout:
                    # Filtrar líneas vacías y limpiar salida
                    lineas = [linea for linea in resultado.stdout.split('\n') if linea.strip()]
                    for linea in lineas:
                        # Remover caracteres que pueden causar problemas en terminal Windows
                        linea_limpia = ''.join(char for char in linea if ord(char) < 127 or char in 'áéíóúüñÁÉÍÓÚÜÑ')
                        print(f"   {linea_limpia}")
                
                if resultado.stderr:
                    print(f"⚠️ Advertencias/Errores:")
                    lineas_error = [linea for linea in resultado.stderr.split('\n') if linea.strip()]
                    for linea in lineas_error:
                        linea_limpia = ''.join(char for char in linea if ord(char) < 127 or char in 'áéíóúüñÁÉÍÓÚÜÑ')
                        print(f"   {linea_limpia}")
                
                if resultado.returncode == 0:
                    print(f"✅ {script['nombre']} ejecutado exitosamente")
                else:
                    print(f"❌ Error ejecutando {script['nombre']} (código: {resultado.returncode})")
                    
            except Exception as e:
                print(f"❌ Error ejecutando {script['nombre']}: {e}")
        
        print(f"\n{'='*70}")
        print("🎉 PROCESAMIENTO AUTOMÁTICO COMPLETADO")
        print(f"{'='*70}")
        print("📁 Revisa la carpeta 'output/' para ver todos los archivos generados:")
        print("   • Lista extraída de WhatsApp (TXT)")
        print("   • Lista procesada con colores (Excel)")
        print("   • Productos categorizados (JSON)")
        print("   • Archivo de difusión para WhatsApp (TXT)")

    def mostrar_resumen(self, resultados):
        """Mostrar resumen de la ejecución"""
        print(f"\n{'='*70}")
        print("📋 RESUMEN DE EXTRACCIÓN")
        print(f"{'='*70}")
        
        exitosos = 0
        fallidos = 0
        
        for proveedor, exito in resultados.items():
            estado = "✅ EXITOSO" if exito else "❌ FALLIDO"
            print(f"   {proveedor}: {estado}")
            if exito:
                exitosos += 1
            else:
                fallidos += 1
        
        print(f"\n📊 ESTADÍSTICAS:")
        print(f"   ✅ Exitosos: {exitosos}")
        print(f"   ❌ Fallidos: {fallidos}")
        print(f"   📁 Archivos generados en carpeta 'output/'")
        
        if exitosos > 0:
            print(f"\n🎉 ¡Extracción de WhatsApp completada!")
            print(f"� Continuando con procesamiento automático...")
        else:
            print(f"\n⚠️ No se pudo extraer información de ningún proveedor")
        
        print(f"{'='*70}")

def main():
    """Función principal"""
    automatizador = AutomatizadorWSP()
    automatizador.procesar_todos_proveedores()

if __name__ == "__main__":
    main()
