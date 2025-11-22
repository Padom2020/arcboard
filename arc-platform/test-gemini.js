/**
 * Test Gemini API Integration
 */

require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
  console.log('\n🧪 Testing Gemini API Integration\n');
  
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey || apiKey === 'your-gemini-api-key-here') {
    console.log('❌ GEMINI_API_KEY not set');
    console.log('\nTo get a FREE Gemini API key:');
    console.log('1. Visit: https://makersuite.google.com/app/apikey');
    console.log('2. Sign in with your Google account');
    console.log('3. Click "Create API Key"');
    console.log('4. Copy the key and add it to your .env file:');
    console.log('   GEMINI_API_KEY=your-actual-key-here\n');
    process.exit(1);
  }
  
  console.log('✓ GEMINI_API_KEY is set\n');
  
  try {
    console.log('Testing Gemini API connection...');
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    const prompt = 'What is a blockchain? Answer in one sentence.';
    console.log(`Prompt: "${prompt}"\n`);
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    console.log('✅ Gemini API is working!\n');
    console.log('Response:');
    console.log(text);
    console.log('\n' + '='.repeat(60));
    console.log('✅ Gemini integration test passed!');
    console.log('='.repeat(60) + '\n');
    
  } catch (error) {
    console.error('\n❌ Gemini API test failed:');
    console.error(error.message);
    
    if (error.message.includes('API key')) {
      console.log('\nThe API key appears to be invalid.');
      console.log('Please check that you copied it correctly from:');
      console.log('https://makersuite.google.com/app/apikey\n');
    }
    
    process.exit(1);
  }
}

testGemini();
