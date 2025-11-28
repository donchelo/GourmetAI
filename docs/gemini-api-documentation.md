# Documentación de Gemini API

> **Última actualización:** Noviembre 2025  
> **Fuente:** [Google AI - Gemini API Docs](https://ai.google.dev/gemini-api/docs)

---

## Tabla de Contenidos

1. [Generación de Imágenes con Imagen](#generación-de-imágenes-con-imagen)
   - [Generar imágenes con modelos Imagen](#generar-imágenes-con-modelos-imagen)
   - [Configuración de Imagen](#configuración-de-imagen)
   - [Guía de Prompts para Imagen](#guía-de-prompts-para-imagen)
   - [Versiones del Modelo Imagen](#versiones-del-modelo-imagen)
2. [Gemini 3 - Guía del Desarrollador](#gemini-3---guía-del-desarrollador)
   - [Conoce Gemini 3](#conoce-gemini-3)
   - [Nuevas Características de la API](#nuevas-características-de-la-api)
   - [Generación de Imágenes con Gemini 3](#generación-de-imágenes-con-gemini-3)
   - [Migración desde Gemini 2.5](#migración-desde-gemini-25)
   - [Mejores Prácticas de Prompting](#mejores-prácticas-de-prompting)
   - [FAQ](#faq)

---

# Generación de Imágenes con Imagen

Imagen es el modelo de generación de imágenes de alta fidelidad de Google, capaz de generar imágenes realistas y de alta calidad a partir de prompts de texto. Todas las imágenes generadas incluyen una marca de agua SynthID.

> **Nota:** También puedes generar imágenes con las capacidades multimodales integradas de Gemini. Consulta la guía de generación de imágenes para más detalles.

## Generar imágenes con modelos Imagen

### Ejemplo en Python

```python
from google import genai
from google.genai import types
from PIL import Image
from io import BytesIO

client = genai.Client()

response = client.models.generate_images(
    model='imagen-4.0-generate-001',
    prompt='Robot holding a red skateboard',
    config=types.GenerateImagesConfig(
        number_of_images=4,
    )
)

for generated_image in response.generated_images:
    generated_image.image.show()
```

### Ejemplo en JavaScript

```javascript
const { GoogleGenAI } = require("@google/generative-ai");

const client = new GoogleGenAI();

const response = await client.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt: 'Robot holding a red skateboard',
    config: {
        numberOfImages: 4,
    }
});
```

## Configuración de Imagen

Imagen actualmente soporta únicamente prompts en inglés y los siguientes parámetros:

| Parámetro | Descripción | Valores |
|-----------|-------------|---------|
| `numberOfImages` | Número de imágenes a generar | 1 a 4 (por defecto: 4) |
| `imageSize` | Tamaño de la imagen generada (solo Standard y Ultra) | `1K`, `2K` (por defecto: 1K) |
| `aspectRatio` | Relación de aspecto de la imagen | `"1:1"`, `"3:4"`, `"4:3"`, `"9:16"`, `"16:9"` (por defecto: "1:1") |
| `personGeneration` | Control de generación de personas | Ver tabla abajo |

### Valores de `personGeneration`

| Valor | Descripción |
|-------|-------------|
| `"dont_allow"` | Bloquea la generación de imágenes de personas |
| `"allow_adult"` | Genera imágenes de adultos, pero no de niños (por defecto) |
| `"allow_all"` | Genera imágenes que incluyen adultos y niños |

> **Nota:** El valor `"allow_all"` no está permitido en ubicaciones de EU, UK, CH, MENA.

---

## Guía de Prompts para Imagen

### Conceptos Básicos

> **Longitud máxima del prompt:** 480 tokens

Un buen prompt es descriptivo y claro, y hace uso de palabras clave y modificadores significativos.

#### Componentes de un buen prompt:

1. **Sujeto:** El objeto, persona, animal o escenario que deseas en la imagen
2. **Contexto y fondo:** El entorno donde se colocará el sujeto
3. **Estilo:** El estilo de imagen deseado (pintura, fotografía, boceto, etc.)

### Ejemplo de iteración de prompts:

```
Prompt 1: "A park in the spring next to a lake"
Prompt 2: "A park in the spring next to a lake, the sun sets across the lake, golden hour"
Prompt 3: "A park in the spring next to a lake, the sun sets across the lake, golden hour, red wildflowers"
```

### Generar Texto en Imágenes

Los modelos Imagen pueden añadir texto a las imágenes:

- **Iterar con confianza:** Puede ser necesario regenerar imágenes hasta lograr el resultado deseado
- **Mantenerlo corto:** Limitar el texto a 25 caracteres o menos
- **Múltiples frases:** Experimentar con 2-3 frases distintas, no exceder 3 frases

**Ejemplo:**
```
Prompt: A poster with the text "Summerland" in bold font as a title, 
underneath this text is the slogan "Summer never felt so good"
```

### Parametrización de Prompts

Para mejor control de resultados, puedes parametrizar las entradas:

```
Plantilla: A {logo_style} logo for a {company_area} company on a solid color background. 
Include the text {company_name}.

Ejemplos:
- "A minimalist logo for a health care company on a solid color background. Include the text Journey."
- "A modern logo for a software company on a solid color background. Include the text Silo."
- "A traditional logo for a baking company on a solid color background. Include the text Seed."
```

---

## Técnicas Avanzadas de Prompts

### Fotografía

Usa palabras clave como `"A photo of..."` para indicar que buscas una fotografía.

#### Modificadores de Fotografía

| Categoría | Modificadores | Ejemplo |
|-----------|---------------|---------|
| **Proximidad de cámara** | close up, zoomed out, taken from far away | "A close-up photo of coffee beans" |
| **Posición de cámara** | aerial, from below | "aerial photo of urban city with skyscrapers" |
| **Iluminación** | natural, dramatic, warm, cold | "studio photo of a modern arm chair, dramatic lighting" |
| **Configuración de cámara** | motion blur, soft focus, bokeh, portrait | "photo of a city with motion blur" |
| **Tipos de lente** | 35mm, 50mm, fisheye, wide angle, macro | "photo of a leaf, macro lens" |
| **Tipos de película** | black and white, polaroid | "a polaroid portrait of a dog wearing sunglasses" |

### Ilustración y Arte

Usa `"A painting of..."` o `"A sketch of..."` para estilos artísticos.

**Estilos disponibles:**
- Technical pencil drawing
- Charcoal drawing
- Color pencil drawing
- Pastel painting
- Digital art
- Art deco

### Formas y Materiales

Usa `"...made of..."` o `"...in the shape of..."`:

```
Ejemplos:
- "a duffle bag made of cheese"
- "neon tubes in the shape of a bird"
- "an armchair made of paper, studio photo, origami style"
```

### Referencias Históricas de Arte

Usa `"...in the style of..."`:

```
- "generate an image in the style of an impressionist painting: a wind farm"
- "generate an image in the style of a renaissance painting: a wind farm"
- "generate an image in the style of pop art: a wind farm"
```

### Modificadores de Calidad

| Tipo | Modificadores |
|------|---------------|
| **Generales** | high-quality, beautiful, stylized |
| **Fotos** | 4K, HDR, Studio Photo |
| **Arte/Ilustración** | by a professional, detailed |

---

## Relaciones de Aspecto

| Aspecto | Uso Común |
|---------|-----------|
| **1:1 (Square)** | Posts de redes sociales |
| **4:3 (Fullscreen)** | Media, film, fotografía |
| **3:4 (Portrait fullscreen)** | Captura más escena verticalmente |
| **16:9 (Widescreen)** | TVs, monitores, paisajes |
| **9:16 (Portrait)** | Videos cortos, objetos verticales (edificios, árboles) |

---

## Imágenes Fotorealistas

### Guía por Caso de Uso

| Caso de Uso | Tipo de Lente | Distancia Focal | Detalles Adicionales |
|-------------|---------------|-----------------|----------------------|
| **Retratos** | Prime, zoom | 24-35mm | black and white film, Film noir, Depth of field, duotone |
| **Objetos (still life)** | Macro | 60-105mm | High detail, precise focusing, controlled lighting |
| **Movimiento (deportes, wildlife)** | Telephoto zoom | 100-400mm | Fast shutter speed, Action or movement tracking |
| **Paisajes, astronómico** | Wide-angle | 10-24mm | Long exposure times, sharp focus, smooth water or clouds |

---

## Versiones del Modelo Imagen

### Imagen 4

| Propiedad | Descripción |
|-----------|-------------|
| **Códigos de modelo** | `imagen-4.0-generate-001`, `imagen-4.0-ultra-generate-001`, `imagen-4.0-fast-generate-001` |
| **Tipos de datos** | Input: Texto / Output: Imágenes |
| **Límites de tokens** | Input: 480 tokens / Output: 1 a 4 imágenes |
| **Última actualización** | Junio 2025 |

---

# Gemini 3 - Guía del Desarrollador

Gemini 3 es la familia de modelos más inteligente hasta la fecha, construida sobre una base de razonamiento de última generación. Está diseñado para dar vida a cualquier idea dominando flujos de trabajo agénticos, codificación autónoma y tareas multimodales complejas.

## Conoce Gemini 3

**Gemini 3 Pro** es el primer modelo de la nueva serie. `gemini-3-pro-preview` es ideal para tareas complejas que requieren amplio conocimiento del mundo y razonamiento avanzado a través de modalidades.

### Especificaciones del Modelo

| Model ID | Context Window (In/Out) | Knowledge Cutoff | Precio (Input/Output)* |
|----------|-------------------------|------------------|------------------------|
| `gemini-3-pro-preview` | 1M / 64k | Enero 2025 | $2 / $12 (<200k tokens), $4 / $18 (>200k tokens) |
| `gemini-3-pro-image-preview` | 65k / 32k | Enero 2025 | $2 (Text Input) / $0.134 (Image Output)** |

> *Precio por 1 millón de tokens  
> **El precio de imágenes varía según la resolución

---

## Nuevas Características de la API

### Nivel de Pensamiento (Thinking Level)

El parámetro `thinking_level` controla la profundidad máxima del proceso de razonamiento interno del modelo.

| Nivel | Descripción | Uso Recomendado |
|-------|-------------|-----------------|
| `low` | Minimiza latencia y costo | Instrucciones simples, chat, aplicaciones de alto throughput |
| `medium` | (Próximamente) | No soportado en el lanzamiento |
| `high` (Default) | Maximiza profundidad de razonamiento | Tareas complejas que requieren razonamiento cuidadoso |

> **Advertencia:** No puedes usar `thinking_level` y el parámetro legacy `thinking_budget` en la misma solicitud. Hacerlo retornará un error 400.

#### Ejemplo en Python

```python
from google import genai
from google.genai import types

client = genai.Client()

response = client.models.generate_content(
    model="gemini-3-pro-preview",
    contents="Find the race condition in this multi-threaded C++ snippet: [code here]",
)

print(response.text)
```

### Resolución de Media (Media Resolution)

Gemini 3 introduce control granular sobre el procesamiento de visión multimodal.

| Tipo de Media | Configuración Recomendada | Max Tokens | Guía de Uso |
|---------------|---------------------------|------------|-------------|
| **Imágenes** | `media_resolution_high` | 1120 | Recomendado para la mayoría de tareas de análisis de imágenes |
| **PDFs** | `media_resolution_medium` | 560 | Óptimo para comprensión de documentos |
| **Video (General)** | `media_resolution_low` o `medium` | 70 (por frame) | Suficiente para reconocimiento de acciones |
| **Video (con texto)** | `media_resolution_high` | 280 (por frame) | Requerido para OCR en frames de video |

#### Ejemplo en Python

```python
from google import genai
from google.genai import types
import base64

# El parámetro media_resolution solo está disponible en la versión v1alpha de la API
client = genai.Client(http_options={'api_version': 'v1alpha'})

response = client.models.generate_content(
    model="gemini-3-pro-preview",
    contents=[
        types.Content(
            parts=[
                types.Part(text="What is in this image?"),
                types.Part(
                    inline_data=types.Blob(
                        mime_type="image/jpeg",
                        data=base64.b64decode("..."),
                    ),
                    media_resolution={"level": "media_resolution_high"}
                )
            ]
        )
    ]
)

print(response.text)
```

### Temperatura

Para Gemini 3, se recomienda **mantener el parámetro de temperatura en su valor por defecto de 1.0**.

> **Importante:** Cambiar la temperatura (especialmente a valores bajos) puede llevar a comportamientos inesperados como bucles o degradación del rendimiento en tareas complejas de razonamiento matemático.

### Thought Signatures (Firmas de Pensamiento)

Gemini 3 usa Thought Signatures para mantener el contexto de razonamiento entre llamadas a la API.

| Caso de Uso | Validación | Notas |
|-------------|------------|-------|
| **Function Calling** | Estricta | Firmas faltantes resultarán en error 400 |
| **Text/Chat** | No estricta | Omitir firmas degradará la calidad de razonamiento |
| **Image generation/editing** | Estricta | Firmas faltantes resultarán en error 400 |

> **Éxito:** Si usas los SDKs oficiales (Python, Node, Java) y el historial de chat estándar, las Thought Signatures se manejan automáticamente.

#### Migración desde otros modelos

Para bypasear la validación estricta al transferir trazas de conversación desde otro modelo:

```json
{
  "thoughtSignature": "context_engineering_is_the_way_to_go"
}
```

### Structured Outputs con Tools

Gemini 3 permite combinar Structured Outputs con herramientas integradas incluyendo Google Search, URL Context y Code Execution.

```python
from google import genai
from google.genai import types
from pydantic import BaseModel, Field
from typing import List

class MatchResult(BaseModel):
    winner: str = Field(description="The name of the winner.")
    final_match_score: str = Field(description="The final match score.")
    scorers: List[str] = Field(description="The name of the scorer.")

client = genai.Client()

response = client.models.generate_content(
    model="gemini-3-pro-preview",
    contents="Search for all details for the latest Euro.",
    config={
        "tools": [
            {"google_search": {}},
            {"url_context": {}}
        ],
        "response_mime_type": "application/json",
        "response_json_schema": MatchResult.model_json_schema(),
    },  
)

result = MatchResult.model_validate_json(response.text)
print(result)
```

---

## Generación de Imágenes con Gemini 3

Gemini 3 Pro Image permite generar y editar imágenes desde prompts de texto. Usa razonamiento para "pensar" a través de un prompt y puede recuperar datos en tiempo real usando Google Search grounding.

### Nuevas Capacidades

- **4K y renderizado de texto:** Genera texto legible y diagramas nítidos con resoluciones hasta 2K y 4K
- **Generación con grounding:** Usa la herramienta `google_search` para verificar hechos y generar imágenes basadas en información del mundo real
- **Edición conversacional:** Edición de imágenes multi-turno simplemente pidiendo cambios (ej. "Make the background a sunset")

### Ejemplo en Python

```python
from google import genai
from google.genai import types

client = genai.Client()

response = client.models.generate_content(
    model="gemini-3-pro-image-preview",
    contents="Generate an infographic of the current weather in Tokyo.",
    config=types.GenerateContentConfig(
        tools=[{"google_search": {}}],
        image_config=types.ImageConfig(
            aspect_ratio="16:9",
            image_size="4K"
        )
    )
)

image_parts = [part for part in response.parts if part.inline_data]

if image_parts:
    image = image_parts[0].as_image()
    image.save('weather_tokyo.png')
    image.show()
```

---

## Migración desde Gemini 2.5

### Consideraciones Clave

| Aspecto | Recomendación |
|---------|---------------|
| **Thinking** | Si usabas prompt engineering complejo (Chain-of-thought), prueba Gemini 3 con `thinking_level: "high"` y prompts simplificados |
| **Temperatura** | Elimina el parámetro explícito de temperatura y usa el default de 1.0 |
| **PDF y documentos** | La resolución OCR por defecto ha cambiado; prueba `media_resolution_high` para documentos densos |
| **Consumo de tokens** | Puede aumentar para PDFs pero disminuir para video |
| **Segmentación de imágenes** | No soportado en Gemini 3 Pro; usa Gemini 2.5 Flash o Gemini Robotics-ER 1.5 |

### Compatibilidad con OpenAI

Para usuarios usando la capa de compatibilidad con OpenAI:

| Parámetro OpenAI | Parámetro Gemini |
|------------------|------------------|
| `reasoning_effort` | `thinking_level` |
| `reasoning_effort: medium` | `thinking_level: high` |

---

## Mejores Prácticas de Prompting

Gemini 3 es un modelo de razonamiento, lo que cambia cómo debes hacer prompts:

### Instrucciones Precisas
- Sé conciso en tus prompts de entrada
- Gemini 3 responde mejor a instrucciones directas y claras
- Puede sobre-analizar técnicas de prompt engineering verbosas o complejas

### Verbosidad de Output
- Por defecto, Gemini 3 es menos verboso y prefiere respuestas directas y eficientes
- Si necesitas una persona más conversacional, especifícalo explícitamente:
  ```
  "Explain this as a friendly, talkative assistant"
  ```

### Gestión de Contexto
- Al trabajar con grandes datasets, coloca instrucciones específicas al **final** del prompt
- Ancla el razonamiento del modelo a los datos proporcionados:
  ```
  "Based on the information above..."
  ```

---

## FAQ

### ¿Cuál es el knowledge cutoff de Gemini 3 Pro?
Gemini 3 tiene un knowledge cutoff de **enero 2025**. Para información más reciente, usa la herramienta Search Grounding.

### ¿Cuáles son los límites del context window?
Gemini 3 Pro soporta **1 millón de tokens** de input y hasta **64k tokens** de output.

### ¿Hay un free tier para Gemini 3 Pro?
Puedes probar el modelo gratis en Google AI Studio, pero actualmente no hay free tier disponible para `gemini-3-pro-preview` en la API de Gemini.

### ¿Mi código antiguo con thinking_budget seguirá funcionando?
Sí, `thinking_budget` aún está soportado por compatibilidad, pero se recomienda migrar a `thinking_level`. No uses ambos en la misma solicitud.

### ¿Gemini 3 soporta Batch API?
Sí, Gemini 3 soporta la Batch API.

### ¿Se soporta Context Caching?
Sí, Context Caching está soportado. El mínimo de tokens requerido para iniciar caching es **2,048 tokens**.

### ¿Qué herramientas están soportadas en Gemini 3?

| Soportadas | No Soportadas |
|------------|---------------|
| Google Search | Google Maps |
| File Search | Computer Use |
| Code Execution | |
| URL Context | |
| Function Calling (custom) | |

---

## Recursos Adicionales

- [Gemini 3 Cookbook](https://ai.google.dev/gemini-api/cookbook)
- [Guía de Thinking Levels](https://ai.google.dev/gemini-api/docs/thinking)
- [Página de Pricing](https://ai.google.dev/pricing)
- [Página de Modelos](https://ai.google.dev/gemini-api/docs/models)

---

> **Licencia:** El contenido de esta documentación está bajo la licencia Creative Commons Attribution 4.0, y los ejemplos de código están bajo la licencia Apache 2.0.

