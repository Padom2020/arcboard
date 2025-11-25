/**
 * Fetch and display DApps data from the API
 */

const http = require('http');

console.log('📡 Fetching DApps data from API...\n');

http.get('http://localhost:3000/api/dapps?limit=20', (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      
      console.log('✅ API Response:\n');
      console.log(JSON.stringify(json, null, 2));
      
      console.log('\n📊 Summary:');
      console.log(`Total DApps: ${json.pagination.total}`);
      console.log(`Returned: ${json.data.length}`);
      console.log(`Has More: ${json.pagination.hasMore}`);
      
      console.log('\n📋 DApps List:');
      json.data.forEach((dapp, index) => {
        console.log(`\n${index + 1}. ${dapp.name}`);
        console.log(`   Category: ${dapp.category}`);
        console.log(`   Status: ${dapp.status}`);
        console.log(`   Description: ${dapp.description.substring(0, 80)}...`);
        console.log(`   Features: ${dapp.features.join(', ')}`);
      });
      
    } catch (error) {
      console.error('❌ Error parsing JSON:', error.message);
      console.log('Raw response:', data);
    }
  });
}).on('error', (err) => {
  console.error('❌ Error fetching data:', err.message);
  console.log('\nMake sure the dev server is running on http://localhost:3000');
});
