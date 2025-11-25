# DApps Export Directory

This directory contains exported data from the Arcboard platform database.

## Files

### 1. `dapps.json`
Complete DApp data in JSON format. Includes all fields:
- id, name, description, category
- websiteUrl, logoUrl, contactEmail
- features (array), status
- createdAt, updatedAt

**Use for**: API integration, data backup, programmatic access

### 2. `dapps.md`
Formatted Markdown documentation with all DApps organized by category.

**Use for**: Documentation, GitHub README, human-readable reference

### 3. `dapps.csv`
Spreadsheet-compatible CSV format.

**Use for**: Excel, Google Sheets, data analysis

### 4. `dapps-summary.md`
Summary statistics and quick overview by category.

**Use for**: Quick reference, statistics, overview

### 5. `dapps.js`
JavaScript/Node.js module export.

**Use for**: Import into Node.js applications

```javascript
const dapps = require('./exports/dapps.js');
console.log(dapps.length); // Number of DApps
```

## Generating Exports

To regenerate these files with latest database data:

```bash
node export-dapps.js
```

This will:
1. Connect to the database
2. Fetch all DApps
3. Export to multiple formats
4. Show statistics

## Statistics (Last Export)

- **Total DApps**: 11
- **Approved**: 9
- **Pending**: 2

### By Category:
- DeFi: 3
- Infrastructure: 3
- NFT: 3
- Social: 1
- Other: 1

## Data Structure

Each DApp includes:

```json
{
  "id": "unique-id",
  "name": "DApp Name",
  "description": "What the DApp does",
  "category": "DeFi|NFT|Gaming|Infrastructure|Social|Other",
  "websiteUrl": "https://...",
  "logoUrl": "https://...",
  "status": "approved|pending|rejected",
  "contactEmail": "contact@...",
  "features": ["Feature 1", "Feature 2"],
  "createdAt": "2024-11-21T...",
  "updatedAt": "2024-11-21T..."
}
```

## Automation

You can automate exports using cron or scheduled tasks:

```bash
# Daily export at midnight
0 0 * * * cd /path/to/arc-platform && node export-dapps.js
```

## Integration Examples

### Node.js
```javascript
const dapps = require('./exports/dapps.js');
const approvedDapps = dapps.filter(d => d.status === 'approved');
```

### Python
```python
import json
with open('exports/dapps.json') as f:
    dapps = json.load(f)
```

### Shell Script
```bash
# Count approved DApps
jq '[.[] | select(.status=="approved")] | length' exports/dapps.json
```

---

**Last Updated**: Auto-generated on export  
**Source**: Arcboard Platform Database  
**Script**: `export-dapps.js`
