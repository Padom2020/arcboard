/**
 * E2E Endpoint Testing Script
 * Tests all major endpoints with detailed error logging
 */

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testEndpoint(name, url, options = {}) {
  const startTime = Date.now();
  try {
    log(`\n[TEST] ${name}`, 'cyan');
    log(`URL: ${url}`, 'blue');
    
    const response = await fetch(url, options);
    const duration = Date.now() - startTime;
    
    log(`Status: ${response.status} ${response.statusText}`, 
      response.ok ? 'green' : 'red');
    log(`Duration: ${duration}ms`, 'yellow');
    
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
      log('Response:', 'blue');
      console.log(JSON.stringify(data, null, 2));
    } else {
      const text = await response.text();
      log('Response (text):', 'blue');
      console.log(text.substring(0, 500)); // First 500 chars
    }
    
    return { success: response.ok, status: response.status, data, duration };
  } catch (error) {
    const duration = Date.now() - startTime;
    log(`ERROR: ${error.message}`, 'red');
    log(`Duration: ${duration}ms`, 'yellow');
    console.error(error);
    return { success: false, error: error.message, duration };
  }
}

async function runTests() {
  log('='.repeat(60), 'cyan');
  log('ARC Platform E2E Endpoint Tests', 'cyan');
  log('='.repeat(60), 'cyan');
  
  const results = [];
  
  // Test 1: DApps API - Basic fetch
  results.push(await testEndpoint(
    'DApps API - Get all DApps',
    `${BASE_URL}/api/dapps?limit=10`
  ));
  
  // Test 2: DApps API - With search
  results.push(await testEndpoint(
    'DApps API - Search',
    `${BASE_URL}/api/dapps?search=defi&limit=5`
  ));
  
  // Test 3: DApps API - With category
  results.push(await testEndpoint(
    'DApps API - Filter by category',
    `${BASE_URL}/api/dapps?category=DeFi&limit=10`
  ));
  
  // Test 4: DApps API - Pagination
  results.push(await testEndpoint(
    'DApps API - Pagination',
    `${BASE_URL}/api/dapps?limit=5&offset=5`
  ));
  
  // Test 5: DApps Categories API
  results.push(await testEndpoint(
    'DApps Categories API',
    `${BASE_URL}/api/dapps/categories`
  ));
  
  // Test 6: Search API
  results.push(await testEndpoint(
    'Search API',
    `${BASE_URL}/api/search?q=blockchain`
  ));
  
  // Test 7: Contract Templates API
  results.push(await testEndpoint(
    'Contract Templates API',
    `${BASE_URL}/api/contracts/templates`
  ));
  
  // Test 8: Progress API - GET
  results.push(await testEndpoint(
    'Progress API - GET',
    `${BASE_URL}/api/progress?userId=test-user-123`
  ));
  
  // Test 9: AI Chat API
  results.push(await testEndpoint(
    'AI Chat API',
    `${BASE_URL}/api/chat`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'What is a smart contract?' }]
      })
    }
  ));
  
  // Test 10: Debug API
  results.push(await testEndpoint(
    'Debug API',
    `${BASE_URL}/api/debug`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        errorMessage: 'TypeError: Cannot read property',
        codeSnippet: 'const x = obj.prop;'
      })
    }
  ));
  
  // Test 11: Contract Generation API
  results.push(await testEndpoint(
    'Contract Generation API',
    `${BASE_URL}/api/contracts/generate`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        template: 'erc20',
        config: {
          tokenName: 'Test Token',
          tokenSymbol: 'TEST',
          initialSupply: '1000000'
        }
      })
    }
  ));
  
  // Summary
  log('\n' + '='.repeat(60), 'cyan');
  log('Test Summary', 'cyan');
  log('='.repeat(60), 'cyan');
  
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const avgDuration = results.reduce((sum, r) => sum + r.duration, 0) / results.length;
  
  log(`Total Tests: ${results.length}`, 'blue');
  log(`Passed: ${passed}`, 'green');
  log(`Failed: ${failed}`, failed > 0 ? 'red' : 'green');
  log(`Average Duration: ${avgDuration.toFixed(2)}ms`, 'yellow');
  
  if (failed > 0) {
    log('\nFailed Tests:', 'red');
    results.forEach((result, index) => {
      if (!result.success) {
        log(`  - Test ${index + 1}: ${result.error || `Status ${result.status}`}`, 'red');
      }
    });
  }
  
  log('\n' + '='.repeat(60), 'cyan');
  
  process.exit(failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch(error => {
  log(`\nFatal Error: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
