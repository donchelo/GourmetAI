/**
 * Script para probar diferentes formatos de modelos de Claude
 */

require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');

const apiKey = process.env.REACT_APP_ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY;

if (!apiKey) {
    console.error('❌ API Key no configurada');
    process.exit(1);
}

const anthropic = new Anthropic({ apiKey });

// Modelos a probar
const modelsToTest = [
    'claude-3-5-haiku-20241022',
    'claude-3-haiku-20240307',
    'claude-haiku-4-5',
    'claude-3-5-haiku-latest',
    'claude-3-haiku-latest',
];

async function testModel(modelName) {
    try {
        console.log(`\n🧪 Probando modelo: ${modelName}`);
        const startTime = Date.now();
        
        const msg = await anthropic.messages.create({
            model: modelName,
            max_tokens: 100,
            messages: [{ role: "user", content: "Di 'Hola' en una palabra" }],
        });
        
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`✅ ${modelName} funciona! (${duration}s)`);
        console.log(`   Respuesta: ${msg.content[0].text.substring(0, 50)}...`);
        return true;
    } catch (error) {
        console.log(`❌ ${modelName} falló: ${error.message.substring(0, 100)}`);
        return false;
    }
}

async function findWorkingModel() {
    console.log('🔍 Buscando modelo de Claude disponible...\n');
    
    for (const model of modelsToTest) {
        const works = await testModel(model);
        if (works) {
            console.log(`\n✅ Modelo recomendado: ${model}`);
            return model;
        }
    }
    
    console.log('\n❌ Ningún modelo estándar funcionó. Verifica tu API key y permisos.');
    return null;
}

findWorkingModel();

