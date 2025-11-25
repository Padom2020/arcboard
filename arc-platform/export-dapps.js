/**
 * Export DApps Script
 * Fetches all DApps from the database and exports to multiple formats
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function exportDApps() {
  console.log('\n📦 Exporting DApps from database...\n');

  try {
    // Fetch all DApps
    const dapps = await prisma.dApp.findMany({
      orderBy: [
        { status: 'desc' }, // approved first
        { category: 'asc' },
        { name: 'asc' },
      ],
    });

    console.log(`✓ Found ${dapps.length} DApps in database\n`);

    // Create exports directory if it doesn't exist
    const exportsDir = path.join(__dirname, 'exports');
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir);
    }

    // 1. Export as JSON
    const jsonPath = path.join(exportsDir, 'dapps.json');
    fs.writeFileSync(jsonPath, JSON.stringify(dapps, null, 2), 'utf8');
    console.log(`✓ Exported to JSON: ${jsonPath}`);

    // 2. Export as Markdown
    const mdPath = path.join(exportsDir, 'dapps.md');
    const markdown = generateMarkdown(dapps);
    fs.writeFileSync(mdPath, markdown, 'utf8');
    console.log(`✓ Exported to Markdown: ${mdPath}`);

    // 3. Export as CSV
    const csvPath = path.join(exportsDir, 'dapps.csv');
    const csv = generateCSV(dapps);
    fs.writeFileSync(csvPath, csv, 'utf8');
    console.log(`✓ Exported to CSV: ${csvPath}`);

    // 4. Export summary by category
    const summaryPath = path.join(exportsDir, 'dapps-summary.md');
    const summary = generateSummary(dapps);
    fs.writeFileSync(summaryPath, summary, 'utf8');
    console.log(`✓ Exported summary: ${summaryPath}`);

    // 5. Export as JavaScript module
    const jsPath = path.join(exportsDir, 'dapps.js');
    const jsModule = `// Auto-generated DApps export\n// Generated: ${new Date().toISOString()}\n\nmodule.exports = ${JSON.stringify(dapps, null, 2)};\n`;
    fs.writeFileSync(jsPath, jsModule, 'utf8');
    console.log(`✓ Exported as JS module: ${jsPath}`);

    console.log('\n✨ Export complete!\n');
    console.log('Files created in ./exports/ directory:');
    console.log('  - dapps.json (Full data in JSON format)');
    console.log('  - dapps.md (Formatted Markdown documentation)');
    console.log('  - dapps.csv (Spreadsheet-compatible CSV)');
    console.log('  - dapps-summary.md (Summary by category)');
    console.log('  - dapps.js (JavaScript module)\n');

    // Print statistics
    printStatistics(dapps);

  } catch (error) {
    console.error('❌ Error exporting DApps:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

function generateMarkdown(dapps) {
  let md = '# DApps Directory\n\n';
  md += `> Exported: ${new Date().toLocaleString()}\n`;
  md += `> Total DApps: ${dapps.length}\n\n`;
  md += '---\n\n';

  // Group by category
  const categories = {};
  dapps.forEach(dapp => {
    if (!categories[dapp.category]) {
      categories[dapp.category] = [];
    }
    categories[dapp.category].push(dapp);
  });

  // Generate markdown for each category
  Object.keys(categories).sort().forEach(category => {
    md += `## ${category}\n\n`;
    
    categories[category].forEach(dapp => {
      md += `### ${dapp.name}\n\n`;
      md += `**Status**: ${dapp.status === 'approved' ? '✅ Approved' : '⏳ Pending'}\n\n`;
      md += `**Description**: ${dapp.description}\n\n`;
      md += `**Website**: ${dapp.websiteUrl}\n\n`;
      md += `**Contact**: ${dapp.contactEmail}\n\n`;
      
      if (dapp.features && dapp.features.length > 0) {
        md += `**Features**:\n`;
        dapp.features.forEach(feature => {
          md += `- ${feature}\n`;
        });
        md += '\n';
      }
      
      md += `**Added**: ${new Date(dapp.createdAt).toLocaleDateString()}\n\n`;
      md += '---\n\n';
    });
  });

  return md;
}

function generateCSV(dapps) {
  const headers = ['ID', 'Name', 'Description', 'Category', 'Website', 'Status', 'Contact', 'Features', 'Created'];
  let csv = headers.join(',') + '\n';

  dapps.forEach(dapp => {
    const row = [
      dapp.id,
      `"${dapp.name.replace(/"/g, '""')}"`,
      `"${dapp.description.replace(/"/g, '""')}"`,
      dapp.category,
      dapp.websiteUrl,
      dapp.status,
      dapp.contactEmail,
      `"${dapp.features.join('; ')}"`,
      new Date(dapp.createdAt).toISOString(),
    ];
    csv += row.join(',') + '\n';
  });

  return csv;
}

function generateSummary(dapps) {
  let md = '# DApps Summary\n\n';
  md += `> Generated: ${new Date().toLocaleString()}\n\n`;

  // Overall statistics
  md += '## Overall Statistics\n\n';
  md += `- **Total DApps**: ${dapps.length}\n`;
  md += `- **Approved**: ${dapps.filter(d => d.status === 'approved').length}\n`;
  md += `- **Pending**: ${dapps.filter(d => d.status === 'pending').length}\n\n`;

  // By category
  md += '## By Category\n\n';
  const categories = {};
  dapps.forEach(dapp => {
    if (!categories[dapp.category]) {
      categories[dapp.category] = { total: 0, approved: 0, pending: 0 };
    }
    categories[dapp.category].total++;
    if (dapp.status === 'approved') {
      categories[dapp.category].approved++;
    } else {
      categories[dapp.category].pending++;
    }
  });

  Object.keys(categories).sort().forEach(category => {
    const stats = categories[category];
    md += `### ${category}\n`;
    md += `- Total: ${stats.total}\n`;
    md += `- Approved: ${stats.approved}\n`;
    md += `- Pending: ${stats.pending}\n\n`;
  });

  // List by category
  md += '## DApps by Category\n\n';
  Object.keys(categories).sort().forEach(category => {
    md += `### ${category}\n\n`;
    const categoryDapps = dapps.filter(d => d.category === category);
    categoryDapps.forEach(dapp => {
      const statusIcon = dapp.status === 'approved' ? '✅' : '⏳';
      md += `- ${statusIcon} **${dapp.name}** - ${dapp.description}\n`;
    });
    md += '\n';
  });

  return md;
}

function printStatistics(dapps) {
  console.log('📊 Statistics:\n');
  console.log(`Total DApps: ${dapps.length}`);
  console.log(`Approved: ${dapps.filter(d => d.status === 'approved').length}`);
  console.log(`Pending: ${dapps.filter(d => d.status === 'pending').length}\n`);

  console.log('By Category:');
  const categories = {};
  dapps.forEach(dapp => {
    categories[dapp.category] = (categories[dapp.category] || 0) + 1;
  });
  Object.keys(categories).sort().forEach(category => {
    console.log(`  ${category}: ${categories[category]}`);
  });
  console.log('');
}

// Run the export
exportDApps();
