# GourmetAI

**Product Requirements Document (PRD)**  
Versión 1.0 - MVP

---

## 1. Resumen Ejecutivo

GourmetAI es una aplicación web que transforma fotografías de platos de comida en versiones visualmente mejoradas con presentación gourmet. La aplicación mantiene la fidelidad al plato original (mismos ingredientes) mientras eleva su presentación visual para uso en cartas de restaurantes, menús digitales o marketing gastronómico.

El MVP consiste en una interfaz de pantalla única donde el usuario sube una foto, ajusta parámetros de estilo, y recibe 4 variantes gourmet generadas por IA.

---

## 2. Objetivo del Producto

Permitir a restaurantes, chefs y negocios gastronómicos convertir fotos casuales de sus platos en imágenes profesionales con aspecto gourmet, listas para usar en cartas y materiales promocionales, sin necesidad de fotógrafo profesional o sesión de estudio.

---

## 3. Alcance del MVP

### 3.1 Incluido en MVP

- Carga de imagen desde galería o cámara
- Procesamiento directo sin recorte previo
- Identificación automática de ingredientes vía LLM
- Panel de parámetros ajustables para personalización
- Generación de 4 variantes gourmet por solicitud
- Historial de generaciones en Airtable
- Descarga individual de imágenes seleccionadas
- Metadata en imágenes (parámetros, semilla)

### 3.2 Excluido del MVP

- Sistema de registro/autenticación de usuarios
- Límites de uso o monetización
- Marca de agua
- App móvil nativa
- Edición manual de ingredientes detectados

---

## 4. Especificaciones Funcionales

### 4.1 Entrada de Imagen

| Característica | Especificación |
|----------------|----------------|
| Fuente | Galería del dispositivo o cámara |
| Formatos | JPG, PNG, WEBP |
| Límite de tamaño | Sin restricción |
| Pre-procesamiento | Ninguno - imagen va directo al proceso |

### 4.2 Panel de Parámetros

El usuario puede ajustar los siguientes parámetros antes de generar. Cada parámetro modifica el prompt enviado a Gemini:

- **Intensidad Gourmet:** Slider de sutil a extremo
- **Estilo de Plato:** Selector: Rústico, Minimalista, Clásico Elegante, Moderno
- **Iluminación:** Selector: Natural, Cálida, Estudio
- **Fondo:** Selector: Madera, Mármol, Negro, Blanco, Mantener Original
- **Decoración Extra:** Multi-select: Microgreens, Salsas Decorativas, Flores Comestibles
- **Ángulo de Cámara:** Selector: Cenital (90°), 45°, Lateral

### 4.3 Procesamiento

El sistema utiliza **Gemini 3.0 API** para generación de imágenes. El flujo interno es:

1. Recibir imagen del usuario
2. Analizar imagen con LLM para identificar el plato e ingredientes
3. Construir prompt dinámico basado en parámetros seleccionados
4. Enviar a Gemini 3.0 para generación (4 variantes)
5. Retornar imágenes al frontend
6. Guardar en historial (Airtable)

### 4.4 Output

| Característica | Especificación |
|----------------|----------------|
| Cantidad | 4 variantes por generación |
| Formato | Cuadrado, 1024x1024 px |
| Metadata incluida | Parámetros usados, semilla de generación, timestamp |
| Descarga | Individual por selección del usuario |

---

## 5. Especificaciones Técnicas

### 5.1 Stack Tecnológico

| Componente | Tecnología |
|------------|------------|
| Frontend | React |
| Generación IA | Gemini 3.0 API |
| Base de Datos | Airtable (historial de generaciones) |
| Plataforma | Web App |
| Idioma UI | Español |

### 5.2 Estructura Airtable

**Tabla: Generaciones**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | Auto Number | Identificador único |
| imagen_original | Attachment | Foto subida por usuario |
| imagenes_generadas | Attachment | 4 variantes gourmet |
| parametros | Long Text | JSON con todos los parámetros usados |
| semilla | Number | Seed de generación para reproducibilidad |
| ingredientes_detectados | Long Text | Lista de ingredientes identificados |
| timestamp | DateTime | Fecha/hora de generación |

### 5.3 Integración Gemini API

1. Modelo: **Gemini 3.0**
2. Capacidad: Imagen a imagen (image-to-image generation)
3. Output: 4 imágenes por request
4. Resolución: 1024x1024 (cuadrado)
5. Modo: Síncrono (usuario espera resultado)

---

## 6. Diseño UI/UX

### 6.1 Estructura de Pantalla Única

La aplicación consiste en una sola pantalla dividida en las siguientes secciones:

#### Zona Superior: Header
Logo de GourmetAI centrado o a la izquierda.

#### Zona Izquierda: Input y Parámetros
Área de carga de imagen con drag & drop o botón de selección. Debajo, panel con todos los controles de parámetros (sliders, selectores, multi-select). Botón principal "Generar Gourmet" al final del panel.

#### Zona Derecha: Output
Grid 2x2 mostrando las 4 variantes generadas. Cada imagen clickeable para ver en tamaño completo. Botón de descarga individual en cada imagen.

#### Zona Inferior: Historial
Carrusel horizontal o grid con generaciones anteriores. Click para cargar en zona de output.

### 6.2 Estados de UI

- **Vacío:** Placeholder invitando a subir imagen
- **Imagen cargada:** Preview de imagen original + parámetros habilitados
- **Procesando:** Spinner/loader con mensaje "Creando tu versión gourmet..."
- **Resultado:** Grid con 4 imágenes generadas
- **Error:** Mensaje de error con opción de reintentar

---

## 7. Consideraciones Adicionales

### 7.1 Principio de Fidelidad

El sistema debe mantener el plato original lo más fiel posible. No se agregan ni quitan ingredientes. La transformación es puramente visual: organización, presentación, iluminación y estilismo del emplatado.

### 7.2 Manejo de Errores

Si la API de Gemini falla o la imagen no es procesable, mostrar mensaje amigable y permitir reintentar. Logging de errores para debugging.

### 7.3 Performance

El usuario espera en pantalla durante la generación. Implementar feedback visual de progreso. Timeout máximo sugerido: 60 segundos por generación.

---

## 8. Entregables Esperados

- Aplicación web funcional en React
- Integración completa con Gemini 3.0 API
- Base de datos Airtable configurada
- Código fuente documentado
- Instrucciones de despliegue

---

*— Fin del Documento —*
