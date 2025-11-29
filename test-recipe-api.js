/**
 * Script de prueba para el endpoint de generación de recetas con Claude
 * Ejecutar: node test-recipe-api.js
 */

require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');

async function testRecipeAPI() {
    console.log('🧪 Iniciando test del servicio de generación de recetas...\n');

    // 1. Verificar que la API key esté configurada
    const apiKey = process.env.REACT_APP_ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY;
    
    console.log('📋 Verificando configuración...');
    if (!apiKey) {
        console.error('❌ ERROR: API Key de Anthropic no configurada');
        console.error('   Variables de entorno disponibles:', Object.keys(process.env).filter(k => k.includes('ANTHROPIC')));
        console.error('   Asegúrate de tener REACT_APP_ANTHROPIC_API_KEY o ANTHROPIC_API_KEY en tu archivo .env');
        process.exit(1);
    }

    if (!apiKey.startsWith('sk-ant-')) {
        console.error('❌ ERROR: Formato de API Key inválido');
        console.error('   La API key debe empezar con "sk-ant-"');
        process.exit(1);
    }

    console.log('✅ API Key encontrada (formato válido)');
    console.log('   Longitud:', apiKey.length, 'caracteres');
    console.log('   Prefijo:', apiKey.substring(0, 10) + '...\n');

    // 2. Inicializar cliente de Anthropic
    console.log('🔧 Inicializando cliente de Anthropic...');
    const anthropic = new Anthropic({
        apiKey: apiKey,
        timeout: 60000,
    });
    console.log('✅ Cliente inicializado\n');

    // 3. Crear un prompt de prueba
    const testPrompt = `Eres un chef profesional experto. Tu tarea es crear una receta detallada pero fácil de seguir.

**INFORMACIÓN DEL PLATO GENERADO:**

**Descripción / Idea Principal:**
"Pasta italiana con tomates frescos y albahaca"

**CONTEXTO CULINARIO (Estos parámetros definen el plato):**
- Tipo de Cocina: Italiana
- Categoría del Plato: Pasta
- Técnica de Cocción Principal: Hervido
- Ingredientes Clave: pasta, tomates, albahaca, ajo, aceite de oliva

**CONTEXTO VISUAL Y PRESENTACIÓN (Estos parámetros afectan cómo se ve el plato):**
- Estilo de Presentación: clásico y elegante
- Nivel de Presentación: presentación gourmet moderada

**INSTRUCCIONES CRÍTICAS:**

1. La receta DEBE coincidir exactamente con lo que se ve en la fotografía generada
2. Usa los ingredientes especificados y las técnicas de cocción mencionadas
3. El estilo de presentación debe reflejar el contexto visual (clásico y elegante)
4. La receta debe ser práctica, clara y deliciosa

**FORMATO REQUERIDO (Markdown):**

### [Nombre Creativo y Apetitoso del Plato que Refleje los Parámetros]

**Descripción:**
Una breve descripción (2-3 frases) que evoque el estilo culinario, los ingredientes principales y el contexto del plato. Debe sonar apetitoso y profesional.

**Ingredientes:**
- [Lista completa de ingredientes con cantidades específicas]
- [Incluir todos los ingredientes mencionados y los necesarios para la técnica de cocción]
- [Cantidades deben ser precisas y prácticas]

**Instrucciones Paso a Paso:**
1. [Paso detallado que refleje la técnica de cocción especificada]
2. [Continuar con pasos claros y secuenciales]
3. [Incluir detalles sobre presentación si es relevante]
...

**Consejo del Chef:**
Un tip práctico y breve relacionado con la técnica de cocción, los ingredientes o la presentación del plato.

**Notas:**
- Asegúrate de que la receta sea coherente con el tipo de cocina y categoría especificados
- La presentación debe reflejar el estilo visual elegido
- Los ingredientes deben coincidir con los especificados

Mantén un tono profesional, inspirador pero accesible. La receta debe ser clara y fácil de seguir para cualquier cocinero casero.`;

    // 4. Probar la llamada a la API
    // Usar Claude Haiku 4.5 - el modelo más rápido y eficiente
    const modelName = process.env.CLAUDE_MODEL || "claude-haiku-4-5";
    console.log('📤 Enviando solicitud a Claude...');
    console.log('   Modelo:', modelName);
    console.log('   Max tokens: 8192');
    console.log('   Prompt length:', testPrompt.length, 'caracteres\n');

    const startTime = Date.now();
    
    try {
        const msg = await anthropic.messages.create({
            model: modelName,
            max_tokens: 8192,
            messages: [{ role: "user", content: testPrompt }],
        });

        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);

        console.log(`✅ Respuesta recibida en ${duration} segundos\n`);

        // 5. Validar la respuesta
        console.log('🔍 Validando respuesta...');
        
        if (!msg || !msg.content || !Array.isArray(msg.content) || msg.content.length === 0) {
            console.error('❌ ERROR: Respuesta sin contenido válido');
            console.error('   Respuesta completa:', JSON.stringify(msg, null, 2));
            process.exit(1);
        }

        const text = msg.content[0].text;
        if (!text || typeof text !== 'string') {
            console.error('❌ ERROR: El texto de la receta no es válido');
            console.error('   Tipo:', typeof text);
            console.error('   Valor:', text);
            process.exit(1);
        }

        console.log('✅ Respuesta válida');
        console.log('   Longitud del texto:', text.length, 'caracteres');
        console.log('   Tokens usados:', msg.usage?.output_tokens || 'N/A', 'de 8192');
        console.log('   Tokens de entrada:', msg.usage?.input_tokens || 'N/A');
        console.log('   Tokens totales:', msg.usage?.input_tokens + msg.usage?.output_tokens || 'N/A');
        console.log('   Stop reason:', msg.stop_reason || msg.content[0]?.stop_reason || 'N/A');
        
        // Verificar si se cortó por límite de tokens
        const stopReason = msg.stop_reason || msg.content[0]?.stop_reason;
        if (stopReason === 'max_tokens') {
            console.log('   ⚠️  ADVERTENCIA: La respuesta se cortó por alcanzar el límite de tokens\n');
        } else {
            console.log('   ✅ Respuesta completa (no truncada)\n');
        }

        // 6. Mostrar una muestra de la receta
        console.log('📝 Muestra de la receta generada:');
        console.log('─'.repeat(80));
        const preview = text.substring(0, 500);
        console.log(preview);
        if (text.length > 500) {
            console.log('...\n[Receta truncada para mostrar solo los primeros 500 caracteres]');
        }
        console.log('─'.repeat(80));

        // 7. Verificar que contiene elementos esperados
        console.log('\n🔍 Verificando contenido de la receta...');
        const hasTitle = text.includes('###') || text.includes('#');
        const hasIngredients = text.toLowerCase().includes('ingrediente');
        const hasInstructions = text.toLowerCase().includes('instruccion') || text.toLowerCase().includes('paso');
        
        console.log('   ✓ Tiene título:', hasTitle ? '✅' : '❌');
        console.log('   ✓ Tiene ingredientes:', hasIngredients ? '✅' : '❌');
        console.log('   ✓ Tiene instrucciones:', hasInstructions ? '✅' : '❌');

        if (hasTitle && hasIngredients && hasInstructions) {
            console.log('\n🎉 ¡TEST EXITOSO! El servicio de generación de recetas funciona correctamente.');
            console.log('\n📊 Resumen:');
            console.log('   ✓ API Key válida y configurada');
            console.log('   ✓ Cliente de Anthropic inicializado');
            console.log(`   ✓ Modelo ${modelName} responde correctamente`);
            console.log('   ✓ Respuesta válida y bien formateada');
            console.log('   ✓ Tiempo de respuesta:', duration, 'segundos');
            process.exit(0);
        } else {
            console.log('\n⚠️  ADVERTENCIA: La receta generada no tiene todos los elementos esperados.');
            console.log('   El servicio funciona, pero la estructura de la receta podría mejorarse.');
            process.exit(0);
        }

    } catch (error) {
        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);
        
        console.error(`\n❌ ERROR después de ${duration} segundos:`);
        console.error('   Mensaje:', error.message);
        console.error('   Status:', error.status || error.statusCode || 'N/A');
        console.error('   Code:', error.code || 'N/A');
        
        if (error.response) {
            console.error('   Response data:', JSON.stringify(error.response.data, null, 2));
        }

        if (error.status === 401 || error.statusCode === 401) {
            console.error('\n💡 SUGERENCIA: Verifica que tu API Key sea válida y tenga los permisos necesarios.');
        } else if (error.status === 404 || error.statusCode === 404) {
            console.error(`\n💡 SUGERENCIA: El modelo ${modelName} podría no estar disponible.`);
            console.error('   Modelos disponibles típicamente: claude-3-5-haiku-20241022, claude-3-haiku-20240307');
            console.error('   Si usas AWS Bedrock, el formato sería diferente (anthropic.claude-haiku-4-5-20251001-v1:0)');
        } else if (error.message?.includes('timeout')) {
            console.error('\n💡 SUGERENCIA: La solicitud tardó demasiado. Verifica tu conexión a internet.');
        }

        process.exit(1);
    }
}

// Ejecutar el test
testRecipeAPI();

