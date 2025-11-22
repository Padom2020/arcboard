/**
 * Fix Branding Script
 * Corrects the branding to:
 * - Platform name: Arcboard
 * - Blockchain name: ARC (not Arcboard)
 */

const fs = require('fs');
const path = require('path');

const filesToFix = [
  {
    file: 'lib/tutorials/content.ts',
    replacements: [
      { from: /Arcboard Blockchain/g, to: 'ARC Blockchain' },
      { from: /Arcboard blockchain/g, to: 'ARC blockchain' },
      { from: /Arcboard ecosystem/g, to: 'ARC ecosystem' },
      { from: /Arcboard network/g, to: 'ARC network' },
      { from: /Arcboard Mainnet/g, to: 'ARC Mainnet' },
      { from: /Arcboard Wallet/g, to: 'ARC Wallet' },
      { from: /on Arcboard/g, to: 'on ARC' },
      { from: /with Arcboard/g, to: 'with ARC' },
      { from: /the Arcboard/g, to: 'the ARC' },
      { from: /to Arcboard/g, to: 'to ARC' },
    ],
  },
];

console.log('🔧 Fixing branding...\n');
console.log('Platform name: Arcboard');
console.log('Blockchain name: ARC\n');

let totalFixes = 0;

filesToFix.forEach(({ file, replacements }) => {
  const filePath = path.join(__dirname, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${file}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let fileFixes = 0;
  
  replacements.forEach(({ from, to }) => {
    const matches = content.match(from);
    if (matches) {
      fileFixes += matches.length;
      content = content.replace(from, to);
    }
  });
  
  if (fileFixes > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${file}: ${fileFixes} fixes`);
    totalFixes += fileFixes;
  } else {
    console.log(`ℹ️  ${file}: No changes needed`);
  }
});

console.log(`\n✨ Branding fixed! Total fixes: ${totalFixes}`);
console.log('\n📝 Correct branding:');
console.log('   - Platform: Arcboard (the onboarding platform)');
console.log('   - Blockchain: ARC (the blockchain we\'re building for)');
