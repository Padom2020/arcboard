/**
 * Verify Rebrand Script
 * Checks if the rebrand from ARC to Arcboard was successful
 */

const http = require('http');

console.log('🔍 Verifying Arcboard rebrand...\n');

// Test homepage
http.get('http://localhost:3000', (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    const checks = [
      { name: 'Page Title', search: 'Arcboard', found: data.includes('Arcboard') },
      { name: 'Welcome Message', search: 'Welcome to Arcboard', found: data.includes('Welcome to Arcboard') },
      { name: 'Build on Arcboard', search: 'Build on Arcboard', found: data.includes('Build on Arcboard') },
      { name: 'Arcboard ecosystem', search: 'Arcboard ecosystem', found: data.includes('Arcboard ecosystem') },
      { name: 'No ARC references', search: 'ARC Blockchain', found: !data.includes('ARC Blockchain') },
    ];
    
    console.log('Homepage Verification:\n');
    checks.forEach(check => {
      const status = check.found ? '✅' : '❌';
      console.log(`${status} ${check.name}`);
    });
    
    const allPassed = checks.every(c => c.found);
    
    if (allPassed) {
      console.log('\n✨ All checks passed! Rebrand successful!');
    } else {
      console.log('\n⚠️  Some checks failed. Please review the changes.');
    }
  });
}).on('error', (err) => {
  console.error('❌ Error connecting to server:', err.message);
  console.log('\nMake sure the dev server is running: npm run dev');
});
