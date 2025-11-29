# Documentación Completa de Claude

Una guía exhaustiva de las capacidades, características y herramientas de Claude para desarrolladores y usuarios empresariales.

---

## Introducción a Claude

Claude es una plataforma de IA de alto rendimiento, confiable e inteligente construida por Anthropic. Claude sobresale en tareas que involucran lenguaje, razonamiento, análisis, programación y más.

### Modelos de Última Generación

**Claude Opus 4.5** - El modelo más inteligente y líder de la industria para programación, agentes y uso de computadora.

**Claude Sonnet 4.5** - Rendimiento equilibrado y practicidad para la mayoría de los usos, incluyendo programación y agentes.

**Claude Haiku 4.5** - El modelo más rápido con inteligencia casi de vanguardia.

---

## Capacidades Principales

### 1. Ventana de Contexto Extendida (1M tokens)
Procesa documentos mucho más grandes, mantiene conversaciones más largas y trabaja con bases de código más extensas.

**Disponibilidad**: Claude API (Beta), Bedrock (Beta), Vertex AI (Beta), Azure AI (Beta)

### 2. Extended Thinking
Capacidades de razonamiento mejoradas para tareas complejas, proporcionando transparencia sobre el proceso de pensamiento paso a paso de Claude antes de entregar su respuesta final.

**Disponibilidad**: Claude API, Bedrock, Vertex AI, Azure AI

### 3. Prompt Caching

**Caché de 5 minutos**: Reduce costos y latencia al proporcionar a Claude conocimiento previo y ejemplos de salidas.

**Caché de 1 hora**: Duración extendida para contexto menos frecuente pero importante, complementando el caché estándar de 5 minutos.

**Disponibilidad**: Claude API, Bedrock, Vertex AI, Azure AI

### 4. Procesamiento por Lotes
Procesa grandes volúmenes de solicitudes de forma asíncrona con ahorros de costos. Las llamadas API por lotes cuestan 50% menos que las llamadas API estándar.

**Disponibilidad**: Claude API, Bedrock, Vertex AI

### 5. Citations
Fundamenta las respuestas de Claude en documentos fuente. Claude puede proporcionar referencias detalladas a las oraciones y pasajes exactos que utiliza para generar respuestas.

**Disponibilidad**: Claude API, Bedrock, Vertex AI, Azure AI

---

## Agent Skills

Extiende las capacidades de Claude con Skills. Usa Skills preconstruidos o crea Skills personalizados con instrucciones y scripts.

### Skills Preconstruidos
- **PowerPoint**: Creación y edición de presentaciones
- **Excel**: Manipulación de hojas de cálculo
- **Word**: Procesamiento de documentos
- **PDF**: Análisis y manipulación de PDFs

### Características Clave
- Revelación progresiva para gestionar contexto eficientemente
- Capacidad de crear Skills personalizados

**Disponibilidad**: Claude API (Beta), Azure AI (Beta)

---

## Herramientas y Capacidades de Automatización

### Herramientas de Desarrollo

#### 1. **Code Execution**
Ejecuta código Python en un entorno sandbox para análisis avanzado de datos.

**Disponibilidad**: Claude API (Beta), Azure AI (Beta)

#### 2. **Bash**
Ejecuta comandos y scripts bash para interactuar con el shell del sistema.

**Disponibilidad**: Claude API, Bedrock, Vertex AI, Azure AI

#### 3. **Computer Use**
Controla interfaces de computadora tomando capturas de pantalla y emitiendo comandos de mouse y teclado.

**Disponibilidad**: Claude API (Beta), Bedrock (Beta), Vertex AI (Beta), Azure AI (Beta)

#### 4. **Text Editor**
Crea y edita archivos de texto con una interfaz de editor de texto integrada.

**Disponibilidad**: Claude API, Bedrock, Vertex AI, Azure AI

### Herramientas de Búsqueda y Web

#### 1. **Web Search**
Aumenta el conocimiento de Claude con datos actuales del mundo real de toda la web.

**Disponibilidad**: Claude API, Vertex AI, Azure AI

#### 2. **Web Fetch**
Recupera contenido completo de páginas web específicas y documentos PDF para análisis en profundidad.

**Disponibilidad**: Claude API (Beta), Azure AI (Beta)

#### 3. **Search Results**
Habilita citas naturales para aplicaciones RAG proporcionando resultados de búsqueda con atribución de fuente adecuada.

**Disponibilidad**: Claude API, Vertex AI, Azure AI

### Herramientas de Gestión de Contexto

#### 1. **Memory**
Permite a Claude almacenar y recuperar información a través de conversaciones. Construye bases de conocimiento con el tiempo, mantiene contexto de proyectos y aprende de interacciones pasadas.

**Disponibilidad**: Claude API (Beta), Bedrock (Beta), Vertex AI (Beta), Azure AI (Beta)

#### 2. **Tool Search**
Escala a miles de herramientas descubriendo y cargando herramientas dinámicamente bajo demanda usando búsqueda basada en regex.

**Disponibilidad**: Claude API (Beta), Bedrock (Beta), Vertex AI (Beta), Azure AI (Beta)

#### 3. **Context Editing**
Gestiona automáticamente el contexto de conversación con estrategias configurables.

**Disponibilidad**: Claude API (Beta), Bedrock (Beta), Vertex AI (Beta), Azure AI (Beta)

### Herramientas de Integración

#### 1. **MCP Connector**
Conecta a servidores MCP remotos directamente desde la API de mensajes sin un cliente MCP separado.

**Disponibilidad**: Claude API (Beta), Azure AI (Beta)

#### 2. **Programmatic Tool Calling**
Permite a Claude llamar herramientas programáticamente desde contenedores de ejecución de código, reduciendo latencia y consumo de tokens.

**Disponibilidad**: Claude API (Beta), Azure AI (Beta)

---

## Características Avanzadas

### 1. **Structured Outputs**
Garantiza conformidad de esquema con dos enfoques:
- Salidas JSON para respuestas de datos estructurados
- Uso estricto de herramientas para entradas de herramientas validadas

**Disponibilidad**: Claude API (Beta), Azure AI (Beta)

### 2. **Effort**
Controla cuántos tokens usa Claude al responder, equilibrando entre exhaustividad de respuesta y eficiencia de tokens.

**Disponibilidad**: Claude API (Beta), Bedrock (Beta), Vertex AI (Beta), Azure AI (Beta)

### 3. **Files API**
Sube y gestiona archivos para usar con Claude sin volver a cargar contenido con cada solicitud. Soporta PDFs, imágenes y archivos de texto.

**Disponibilidad**: Claude API (Beta), Azure AI (Beta)

### 4. **PDF Support**
Procesa y analiza contenido de texto y visual de documentos PDF.

**Disponibilidad**: Claude API, Bedrock, Vertex AI, Azure AI

### 5. **Token Counting**
Determina el número de tokens en un mensaje antes de enviarlo a Claude.

**Disponibilidad**: Claude API, Bedrock, Vertex AI, Azure AI

### 6. **Fine-grained Tool Streaming**
Transmite parámetros de uso de herramientas sin buffering/validación JSON, reduciendo latencia.

**Disponibilidad**: Claude API, Bedrock, Vertex AI, Azure AI

---

## Casos de Uso Principales

### 1. Generación de Texto y Código
- Resumir texto
- Responder preguntas
- Extraer datos
- Traducir texto
- Explicar y generar código

### 2. Vision
- Procesar y analizar entrada visual
- Generar texto y código desde imágenes

---

## Recursos para Desarrolladores

### Developer Console
Experimenta con prompting más fácil y poderoso en tu navegador con Workbench y la herramienta de generación de prompts.

### API Reference
Explora, implementa y escala con la API de Claude y SDKs.

### Claude Cookbook
Aprende con notebooks Jupyter interactivos que demuestran carga de PDFs, embeddings y más.

### Prompt Library
Explora prompts de ejemplo para inspiración.

---

## Soporte

### Help Center
Encuentra respuestas a preguntas frecuentes sobre cuentas y facturación.

### Service Status
Verifica el estado de los servicios de Anthropic en status.claude.com.

---

## Disponibilidad por Plataforma

- **Claude API**: Acceso completo a todas las características principales
- **Claude API (Beta)**: Acceso a características experimentales y de vanguardia
- **Bedrock**: Integración con AWS
- **Vertex AI**: Integración con Google Cloud
- **Azure AI**: Integración con Microsoft Azure

---

## Próximos Pasos

1. **Configura tu entorno de desarrollo** para construir con Claude
2. **Aprende sobre la familia de modelos** Claude
3. **Explora la biblioteca de prompts** para inspiración
4. **Consulta la documentación de API** para implementación técnica

---

*Para chatear con Claude, visita [claude.ai](http://www.claude.ai)*