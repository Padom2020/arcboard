# DApps Export Script Guide

## Overview

The `export-dapps.js` script fetches all DApps from the database and exports them to multiple formats for easy access, backup, and integration.

## Quick Start

```bash
# Run the export script
node export-dapps.js
```

## What It Does

1. **Connects to Database** - Uses Prisma to connect to PostgreSQL
2. **Fetches All DApps** - Retrieves all DApp records (approved and pending)
3. **Exports to Multiple Formats** - Creates 5 different file formats
4. **Shows Statistics** - Displays summary of exported data

## Output Files

All files are created in the `./exports/` directory:

### 1. JSON Format (`dapps.json`)
```json
[
  {
    "id": "...",
    "name": "ARC DEX",
    "description": "Decentralized exchange...",
    "category": "DeFi",
    "websiteUrl": "https://...",
    "status": "approved",
    "features": ["Token Swapping", "Liquidity Pools"],
    "createdAt": "2024-11-21T...",
    "updatedAt": "2024-11-21T..."
  }
]
```

**Best for**: API integration, data backup, programmatic access

### 2. Markdown Format (`dapps.md`)
```markdown
# DApps Directory

## DeFi

### ARC DEX

**Status**: ✅ Approved
**Description**: Decentralized exchange...
**Features**:
- Token Swapping
- Liquidity Pools
```

**Best for**: Documentation, GitHub, human-readable reference

### 3. CSV Format (`dapps.csv`)
```csv
ID,Name,Description,Category,Website,Status,Contact,Features,Created
...,"ARC DEX","Decentralized exchange...",DeFi,...,approved,...
```

**Best for**: Excel, Google Sheets, data analysis

### 4. Summary (`dapps-summary.md`)
```markdown
# DApps Summary

## Overall Statistics
- Total DApps: 11
- Approved: 9
- Pending: 2

## By Category
### DeFi
- Total: 3
- Approved: 3
```

**Best for**: Quick overview, statistics, reporting

### 5. JavaScript Module (`dapps.js`)
```javascript
module.exports = [
  { id: "...", name: "ARC DEX", ... }
];
```

**Best for**: Node.js applications, require() imports

## Usage Examples

### View JSON Data
```bash
# Pretty print JSON
cat exports/dapps.json | jq '.'

# Count approved DApps
cat exports/dapps.json | jq '[.[] | select(.status=="approved")] | length'

# Get DeFi DApps
cat exports/dapps.json | jq '[.[] | select(.category=="DeFi")]'
```

### Import in Node.js
```javascript
// Method 1: Require the module
const dapps = require('./exports/dapps.js');

// Method 2: Read JSON file
const fs = require('fs');
const dapps = JSON.parse(fs.readFileSync('./exports/dapps.json', 'utf8'));

// Filter approved DApps
const approved = dapps.filter(d => d.status === 'approved');

// Group by category
const byCategory = dapps.reduce((acc, dapp) => {
  if (!acc[dapp.category]) acc[dapp.category] = [];
  acc[dapp.category].push(dapp);
  return acc;
}, {});
```

### Import in Python
```python
import json
import pandas as pd

# Read JSON
with open('exports/dapps.json') as f:
    dapps = json.load(f)

# Read CSV with pandas
df = pd.read_csv('exports/dapps.csv')

# Filter approved DApps
approved = [d for d in dapps if d['status'] == 'approved']

# Count by category
from collections import Counter
categories = Counter(d['category'] for d in dapps)
```

### Open in Excel
1. Open Excel
2. File → Open → `exports/dapps.csv`
3. Data is automatically formatted in columns

## Automation

### Daily Export (Linux/Mac)
```bash
# Add to crontab
crontab -e

# Run daily at midnight
0 0 * * * cd /path/to/arc-platform && node export-dapps.js
```

### Daily Export (Windows Task Scheduler)
1. Open Task Scheduler
2. Create Basic Task
3. Trigger: Daily
4. Action: Start a program
5. Program: `node`
6. Arguments: `export-dapps.js`
7. Start in: `C:\path\to\arc-platform`

### Git Backup
```bash
# Export and commit to git
node export-dapps.js
git add exports/
git commit -m "Update DApps export $(date +%Y-%m-%d)"
git push
```

## Script Features

### Sorting
DApps are sorted by:
1. Status (approved first)
2. Category (alphabetically)
3. Name (alphabetically)

### Error Handling
- Checks database connection
- Creates exports directory if missing
- Shows clear error messages
- Disconnects from database properly

### Statistics
Shows:
- Total DApps count
- Approved vs Pending
- Breakdown by category

## Customization

### Export Only Approved DApps
Edit `export-dapps.js`:
```javascript
const dapps = await prisma.dApp.findMany({
  where: { status: 'approved' }, // Add this line
  orderBy: [{ category: 'asc' }, { name: 'asc' }],
});
```

### Export Specific Categories
```javascript
const dapps = await prisma.dApp.findMany({
  where: { category: { in: ['DeFi', 'NFT'] } },
  orderBy: [{ name: 'asc' }],
});
```

### Add More Formats
Add to the script:
```javascript
// Export as YAML
const yaml = require('js-yaml');
const yamlPath = path.join(exportsDir, 'dapps.yaml');
fs.writeFileSync(yamlPath, yaml.dump(dapps), 'utf8');

// Export as XML
const xml = require('xml');
const xmlPath = path.join(exportsDir, 'dapps.xml');
fs.writeFileSync(xmlPath, xml({ dapps: dapps }), 'utf8');
```

## Troubleshooting

### Database Connection Error
```
Error: Can't reach database server
```
**Solution**: Check DATABASE_URL in .env file

### Permission Error
```
Error: EACCES: permission denied
```
**Solution**: Check write permissions for exports directory

### Missing Dependencies
```
Error: Cannot find module '@prisma/client'
```
**Solution**: Run `npm install`

## Integration with CI/CD

### GitHub Actions
```yaml
name: Export DApps
on:
  schedule:
    - cron: '0 0 * * *' # Daily at midnight
  workflow_dispatch: # Manual trigger

jobs:
  export:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: node export-dapps.js
      - uses: actions/upload-artifact@v2
        with:
          name: dapps-export
          path: exports/
```

## Best Practices

1. **Regular Exports**: Run daily or after significant changes
2. **Version Control**: Commit exports to track changes over time
3. **Backup**: Keep exports as database backups
4. **Documentation**: Use Markdown exports for documentation
5. **Analytics**: Use CSV exports for data analysis

## Related Files

- `seed-database.js` - Seeds database with initial data
- `test-db-connection.js` - Tests database connectivity
- `exports/README.md` - Documentation for exported files

---

**Script**: `export-dapps.js`  
**Output Directory**: `./exports/`  
**Database**: PostgreSQL via Prisma  
**Status**: ✅ Ready to use
