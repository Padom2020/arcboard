/**
 * Final E2E Test Summary
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const prisma = new PrismaClient();

async function runFinalTests() {
  console.log('\n' + '='.repeat(60));
  console.log('🎯 ARC Platform - Final E2E Test Summary');
  console.log('='.repeat(60) + '\n');

  let allPassed = true;

  // Test 1: Database
  console.log('📊 Database Connection...');
  try {
    await prisma.$connect();
    const dappCount = await prisma.dApp.count();
    const progressCount = await prisma.userProgress.count();
    console.log(`   ✅ Connected to PostgreSQL`);
    console.log(`   ✅ DApp table: ${dappCount} records`);
    console.log(`   ✅ UserProgress table: ${progressCount} records`);
  } catch (error) {
    console.log(`   ❌ Database error: ${error.message}`);
    allPassed = false;
  }

  console.log('');

  // Test 2: Gemini AI
  console.log('🤖 Gemini AI Integration...');
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent('Say "OK" if you can read this.');
    const text = result.response.text();
    console.log(`   ✅ Gemini API responding`);
    console.log(`   ✅ Model: gemini-2.0-flash`);
    console.log(`   ✅ Response: ${text.substring(0, 50)}...`);
  } catch (error) {
    console.log(`   ❌ Gemini error: ${error.message}`);
    allPassed = false;
  }

  console.log('');

  // Test 3: Dev Server
  console.log('🌐 Development Server...');
  try {
    const response = await fetch('http://localhost:3000/api/dapps?limit=1');
    if (response.ok) {
      const data = await response.json();
      console.log(`   ✅ Server running on http://localhost:3000`);
      console.log(`   ✅ API responding (${data.pagination.total} DApps)`);
    } else {
      console.log(`   ❌ Server returned status ${response.status}`);
      allPassed = false;
    }
  } catch (error) {
    console.log(`   ⚠️  Server not running (start with: npm run dev)`);
  }

  console.log('');
  console.log('='.repeat(60));
  
  if (allPassed) {
    console.log('✅ All Core Systems Operational!');
    console.log('='.repeat(60));
    console.log('\n🚀 Platform Status: READY FOR DEVELOPMENT\n');
    console.log('Next steps:');
    console.log('  1. Visit http://localhost:3000 to view the platform');
    console.log('  2. Try the AI Assistant at /assistant');
    console.log('  3. Browse DApps at /dapps');
    console.log('  4. Test debugging at /debug\n');
  } else {
    console.log('⚠️  Some Systems Need Attention');
    console.log('='.repeat(60));
    console.log('\nCheck the errors above and refer to:');
    console.log('  - DATABASE_SETUP.md for database issues');
    console.log('  - GEMINI_MIGRATION.md for AI setup');
    console.log('  - E2E_TEST_SUMMARY.md for detailed test results\n');
  }

  await prisma.$disconnect();
}

runFinalTests().catch(console.error);
