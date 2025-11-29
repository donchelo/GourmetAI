/**
 * Script para probar diferentes variantes del modelo Haiku 4.5
 */

require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');

const apiKey = process.env.REACT_APP_ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY;

if (!apiKey) {
    console.error('❌ API Key no configurada');
    process.exit(1);
}

const anthropic = new Anthropic({ apiKey });

// Variantes del modelo Haiku 4.5 a probar
const haiku45Models = [
    'claude-3-5-haiku-20241022',  // Ya probado y funciona
    'claude-3-5-haiku-latest',     // Versión latest
    'claude-haiku-4-5',            // Formato simplificado
    'claude-3-5-haiku',            // Sin fecha
    'claude-haiku-4.5',            // Con punto
    'claude-3-5-haiku-4-5',        // Con guiones
    'claude-haiku-3-5-4-5',        // Otra variante
];

async function testModel(modelName) {
    try {
        console.log(`\n🧪 Probando: ${modelName}`);
        const startTime = Date.now();
        
        const msg = await anthropic.messages.create({
            model: modelName,
            max_tokens: 50,
            messages: [{ role: "user", content: "Responde solo con 'OK'" }],
        });
        
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        const response = msg.content[0].text.trim();
        
        console.log(`   ✅ FUNCIONA! (${duration}s)`);
        console.log(`   Respuesta: "${response}"`);
        return { model: modelName, works: true, duration, response };
    } catch (error) {
        const errorMsg = error.message || error.toString();
        console.log(`   ❌ Falla: ${errorMsg.substring(0, 80)}`);
        return { model: modelName, works: false, error: errorMsg };
    }
}

async function findHaiku45() {
    console.log('🔍 Buscando modelo Claude Haiku 4.5...\n');
    console.log('📋 Probando diferentes variantes de nombres de modelo...\n');
    
    const results = [];
    
    for (const model of haiku45Models) {
        const result = await testModel(model);
        results.push(result);
    }
    
    console.log('\n' + '='.repeat(80));
    console.log('📊 RESUMEN DE RESULTADOS:\n');
    
    const workingModels = results.filter(r => r.works);
    
    if (workingModels.length > 0) {
        console.log('✅ Modelos que funcionan:');
        workingModels.forEach(r => {
            console.log(`   • ${r.model} (${r.duration}s)`);
        });
        
        const recommended = workingModels[0];
        console.log(`\n💡 Modelo recomendado: ${recommended.model}`);
        console.log(`   Tiempo de respuesta: ${recommended.duration}s`);
    } else {
        console.log('❌ Ningún modelo de Haiku 4.5 funcionó con los nombres probados.');
        console.log('\n💡 Posibles razones:');
        console.log('   • El modelo Haiku 4.5 aún no está disponible en tu cuenta');
        console.log('   • Necesitas usar un nombre de modelo diferente');
        console.log('   • Verifica la documentación oficial de Anthropic');
    }
    
    console.log('\n' + '='.repeat(80));
}

findHaiku45();

