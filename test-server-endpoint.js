/**
 * Script para probar el endpoint completo del servidor
 * Asegúrate de tener el servidor corriendo: npm run server
 */

require('dotenv').config();
const axios = require('axios');

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

async function testServerEndpoint() {
    console.log('🧪 Probando endpoint del servidor...\n');
    console.log('📍 URL:', `${API_URL}/api/generate-recipe-claude`);

    const testPrompt = `Eres un chef profesional experto. Tu tarea es crear una receta detallada pero fácil de seguir.

**INFORMACIÓN DEL PLATO GENERADO:**

**Descripción / Idea Principal:**
"Ensalada mediterránea fresca"

**CONTEXTO CULINARIO:**
- Tipo de Cocina: Mediterránea
- Categoría del Plato: Ensalada
- Ingredientes Clave: lechuga, tomate, pepino, aceitunas, queso feta

**FORMATO REQUERIDO (Markdown):**

### [Nombre del Plato]

**Descripción:**
Una breve descripción del plato.

**Ingredientes:**
- Lista de ingredientes

**Instrucciones Paso a Paso:**
1. Paso 1
2. Paso 2

**Consejo del Chef:**
Un tip práctico.`;

    try {
        console.log('\n📤 Enviando solicitud al servidor...');
        const startTime = Date.now();

        const response = await axios.post(
            `${API_URL}/api/generate-recipe-claude`,
            { prompt: testPrompt },
            {
                timeout: 60000,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        const duration = ((Date.now() - startTime) / 1000).toFixed(2);

        console.log(`✅ Respuesta recibida en ${duration} segundos\n`);

        if (response.data && response.data.success) {
            console.log('✅ Respuesta exitosa del servidor');
            console.log('   Longitud de la receta:', response.data.recipe.length, 'caracteres');
            console.log('\n📝 Muestra de la receta:');
            console.log('─'.repeat(80));
            const preview = response.data.recipe.substring(0, 400);
            console.log(preview);
            if (response.data.recipe.length > 400) {
                console.log('...\n[Receta truncada]');
            }
            console.log('─'.repeat(80));

            console.log('\n🎉 ¡TEST DEL SERVIDOR EXITOSO!');
            console.log('\n📊 Resumen:');
            console.log('   ✓ Servidor respondiendo correctamente');
            console.log('   ✓ Endpoint /api/generate-recipe-claude funciona');
            console.log('   ✓ API Key configurada correctamente');
            console.log('   ✓ Modelo de Claude respondiendo');
            console.log('   ✓ Tiempo de respuesta:', duration, 'segundos');
        } else {
            console.error('❌ Respuesta del servidor sin éxito');
            console.error('   Data:', response.data);
        }

    } catch (error) {
        console.error('\n❌ ERROR al probar el servidor:');
        
        if (error.code === 'ECONNREFUSED') {
            console.error('   El servidor no está corriendo.');
            console.error('   Ejecuta: npm run server');
        } else if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Error:', error.response.data);
        } else if (error.request) {
            console.error('   No se recibió respuesta del servidor');
            console.error('   Verifica que el servidor esté corriendo en', API_URL);
        } else {
            console.error('   Error:', error.message);
        }
        
        process.exit(1);
    }
}

testServerEndpoint();

