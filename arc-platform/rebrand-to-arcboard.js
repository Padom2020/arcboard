/**
 * Rebrand Script: Replace ARC with Arcboard
 * This script updates all references from "ARC" to "Arcboard" throughout the codebase
 */

const fs = require('fs');
const path = require('path');

// Files to update with their specific replacements
const filesToUpdate = [
  {
    file: 'lib/tutorials/content.ts',
    replacements: [
      { from: /ARC Blockchain/g, to: 'Arcboard Blockchain' },
      { from: /ARC blockchain/g, to: 'Arcboard blockchain' },
      { from: /ARC ecosystem/g, to: 'Arcboard ecosystem' },
      { from: /ARC network/g, to: 'Arcboard network' },
      { from: /ARC Mainnet/g, to: 'Arcboard Mainnet' },
      { from: /ARC Wallet/g, to: 'Arcboard Wallet' },
      { from: /ARC\./g, to: 'Arcboard.' },
      { from: /on ARC/g, to: 'on Arcboard' },
      { from: /with ARC/g, to: 'with Arcboard' },
      { from: /the ARC/g, to: 'the Arcboard' },
      { from: /to ARC/g, to: 'to Arcboard' },
    ],
  },
  {
    file: 'app/assistant/page.tsx',
    replacements: [
      { from: /ARC blockchain/g, to: 'Arcboard blockchain' },
      { from: /ARC Blockchain/g, to: 'Arcboard Blockchain' },
    ],
  },
  {
    file: 'app/debug/page.tsx',
    replacements: [
      { from: /ARC blockchain/g, to: 'Arcboard blockchain' },
      { from: /ARC Blockchain/g, to: 'Arcboard Blockchain' },
    ],
  },
  {
    file: 'app/contracts/page.tsx',
    replacements: [
      { from: /ARC blockchain/g, to: 'Arcboard blockchain' },
      { from: /ARC Blockchain/g, to: 'Arcboard Blockchain' },
    ],
  },
  {
    file: 'app/onboarding/page.tsx',
    replacements: [
      { from: /ARC blockchain/g, to: 'Arcboard blockchain' },
      { from: /ARC Blockchain/g, to: 'Arcboard Blockchain' },
      { from: /ARC ecosystem/g, to: 'Arcboard ecosystem' },
    ],
  },
  {
    file: 'components/dapps/dapp-submission-form.tsx',
    replacements: [
      { from: /ARC blockchain/g, to: 'Arcboard blockchain' },
    ],
  },
  {
    file: 'README.md',
    replacements: [
      { from: /ARC Blockchain/g, to: 'Arcboard Blockchain' },
      { from: /ARC blockchain/g, to: 'Arcboard blockchain' },
      { from: /ARC Platform/g, to: 'Arcboard Platform' },
      { from: /ARC ecosystem/g, to: 'Arcboard ecosystem' },
    ],
  },
];

console.log('🔄 Starting rebrand from ARC to Arcboard...\n');

let totalReplacements = 0;

filesToUpdate.forEach(({ file, replacements }) => {
  const filePath = path.join(__dirname, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${file}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let fileReplacements = 0;
  
  replacements.forEach(({ from, to }) => {
    const matches = content.match(from);
    if (matches) {
      fileReplacements += matches.length;
      content = content.replace(from, to);
    }
  });
  
  if (fileReplacements > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${file}: ${fileReplacements} replacements`);
    totalReplacements += fileReplacements;
  } else {
    console.log(`ℹ️  ${file}: No changes needed`);
  }
});

console.log(`\n✨ Rebrand complete! Total replacements: ${totalReplacements}`);
console.log('\n📝 Summary:');
console.log('   - Platform name: ARC → Arcboard');
console.log('   - Updated: UI components, documentation, tutorials, AI prompts');
console.log('\n🔍 Please review the changes and test the application.');
