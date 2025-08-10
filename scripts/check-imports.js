#!/usr/bin/env node

/**
 * Script to check for common TypeScript import issues
 * Run with: node scripts/check-imports.js
 */

const fs = require('fs');
const path = require('path');

// Known problematic modules that require namespace imports
const NAMESPACE_IMPORT_MODULES = [
    'winston',
    // Add other modules here as discovered
];

function findTSFiles(dir, files = []) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
            findTSFiles(fullPath, files);
        } else if (item.endsWith('.ts') && !item.endsWith('.d.ts')) {
            files.push(fullPath);
        }
    }
    
    return files;
}

function checkImports() {
    console.log('🔍 Checking TypeScript imports for common issues...\n');
    
    const tsFiles = findTSFiles('src');
    let issuesFound = 0;
    
    for (const file of tsFiles) {
        const content = fs.readFileSync(file, 'utf8');
        const lines = content.split('\n');
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Check for problematic default imports
            for (const module of NAMESPACE_IMPORT_MODULES) {
                const problematicPattern = new RegExp(`import\\s+\\w+\\s+from\\s+['"]${module}['"]`);
                if (problematicPattern.test(line)) {
                    console.log(`❌ ${file}:${i + 1}`);
                    console.log(`   Issue: Default import of '${module}' should use namespace import`);
                    console.log(`   Current: ${line}`);
                    console.log(`   Fix: import * as ${module} from '${module}';`);
                    console.log('');
                    issuesFound++;
                }
            }
        }
    }
    
    if (issuesFound === 0) {
        console.log('✅ No import issues found!');
    } else {
        console.log(`Found ${issuesFound} import issue(s) that need to be fixed.`);
        console.log('\nRefer to .kiro/steering/typescript-import-guidelines.md for more details.');
    }
    
    return issuesFound;
}

// Run the check
const issues = checkImports();
process.exit(issues > 0 ? 1 : 0);