/**
 * Database Connection Test
 * Tests if the database is reachable and Prisma can connect
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

async function testConnection() {
  console.log('\n='.repeat(60));
  console.log('Database Connection Test');
  console.log('='.repeat(60));
  
  // Check environment variable
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('❌ DATABASE_URL is not set in environment variables');
    process.exit(1);
  }
  
  // Mask sensitive parts of the connection string
  const maskedUrl = dbUrl.replace(/:([^:@]+)@/, ':****@');
  console.log('\n✓ DATABASE_URL is set:');
  console.log(`  ${maskedUrl}\n`);
  
  try {
    console.log('Testing database connection...');
    
    // Test connection by running a simple query
    await prisma.$connect();
    console.log('✓ Successfully connected to database\n');
    
    // Test if tables exist
    console.log('Checking database tables...');
    
    try {
      const dappCount = await prisma.dApp.count();
      console.log(`✓ DApp table exists (${dappCount} records)`);
    } catch (error) {
      console.log('⚠ DApp table might not exist or is empty');
      console.log(`  Error: ${error.message}`);
    }
    
    try {
      const progressCount = await prisma.userProgress.count();
      console.log(`✓ UserProgress table exists (${progressCount} records)`);
    } catch (error) {
      console.log('⚠ UserProgress table might not exist or is empty');
      console.log(`  Error: ${error.message}`);
    }
    
    try {
      const chatCount = await prisma.chatSession.count();
      console.log(`✓ ChatSession table exists (${chatCount} records)`);
    } catch (error) {
      console.log('⚠ ChatSession table might not exist or is empty');
      console.log(`  Error: ${error.message}`);
    }
    
    try {
      const debugCount = await prisma.debugSession.count();
      console.log(`✓ DebugSession table exists (${debugCount} records)`);
    } catch (error) {
      console.log('⚠ DebugSession table might not exist or is empty');
      console.log(`  Error: ${error.message}`);
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ Database connection test completed successfully');
    console.log('='.repeat(60) + '\n');
    
  } catch (error) {
    console.error('\n❌ Database connection failed:');
    console.error(`  ${error.message}\n`);
    
    if (error.message.includes('Can\'t reach database server')) {
      console.log('Troubleshooting tips:');
      console.log('  1. Check if the database server is running');
      console.log('  2. Verify the connection string is correct');
      console.log('  3. Check firewall/network settings');
      console.log('  4. Ensure SSL certificates are valid (if using SSL)');
    } else if (error.message.includes('authentication failed')) {
      console.log('Troubleshooting tips:');
      console.log('  1. Verify username and password are correct');
      console.log('  2. Check if the database user has proper permissions');
    } else if (error.message.includes('does not exist')) {
      console.log('Troubleshooting tips:');
      console.log('  1. Run: npm run db:generate');
      console.log('  2. Run: npm run db:migrate');
      console.log('  3. Or run: npm run db:push');
    }
    
    console.log('\n' + '='.repeat(60) + '\n');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
