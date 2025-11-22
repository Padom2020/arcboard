/**
 * List available Gemini models
 */

require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.log('❌ GEMINI_API_KEY not set');
    process.exit(1);
  }
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    console.log('\n📋 Listing available Gemini models...\n');
    
    // Try to list models
    const models = await genAI.listModels();
    
    console.log('Available models:');
    for await (const model of models) {
      console.log(`- ${model.name}`);
      console.log(`  Display Name: ${model.displayName}`);
      console.log(`  Supported Methods: ${model.supportedGenerationMethods?.join(', ')}`);
      console.log('');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    
    // Try common model names
    console.log('\nTrying common model names...\n');
    
    const modelsToTry = [
      'gemini-pro',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'gemini-1.0-pro',
      'models/gemini-pro',
      'models/gemini-1.5-pro',
      'models/gemini-1.5-flash',
    ];
    
    for (const modelName of modelsToTry) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Hi');
        console.log(`✅ ${modelName} - WORKS`);
        break;
      } catch (err) {
        console.log(`❌ ${modelName} - ${err.message.split('\n')[0]}`);
      }
    }
  }
}

listModels();
