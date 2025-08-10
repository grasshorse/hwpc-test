#!/usr/bin/env node

/**
 * Pre-commit check script to validate TypeScript imports and compilation
 * Run with: node scripts/pre-commit-check.js
 */

const { execSync } = require('child_process');

console.log('🔍 Running pre-commit checks...\n');

let hasErrors = false;

// Check 1: Import validation
console.log('1. Checking TypeScript imports...');
try {
    execSync('node scripts/check-imports.js', { stdio: 'inherit' });
    console.log('✅ Import check passed\n');
} catch (error) {
    console.log('❌ Import check failed\n');
    hasErrors = true;
}

// Check 2: TypeScript compilation
console.log('2. Checking TypeScript compilation...');
try {
    execSync('npx tsc --noEmit', { stdio: 'pipe' });
    console.log('✅ TypeScript compilation passed\n');
} catch (error) {
    console.log('❌ TypeScript compilation failed');
    console.log('Run "npm run type-check" for detailed error information\n');
    hasErrors = true;
}

if (hasErrors) {
    console.log('❌ Pre-commit checks failed. Please fix the issues above before committing.');
    console.log('Refer to DEVELOPMENT_PROCESS.md for guidance.');
    process.exit(1);
} else {
    console.log('✅ All pre-commit checks passed!');
    process.exit(0);
}