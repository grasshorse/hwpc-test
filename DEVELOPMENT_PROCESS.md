# Development Process Guidelines

## Pre-Development Checklist

Before starting any development work, run these checks to ensure a clean starting point:

### 1. TypeScript Import Validation
```bash
npm run check-imports
```
This checks for common import issues, particularly with CommonJS modules like Winston.

### 2. TypeScript Compilation Check
```bash
npm run type-check
```
This ensures all TypeScript files compile without errors.

## Common Issues and Solutions

### Winston Import Issue (RESOLVED)

**Issue**: `Module can only be default-imported using the 'esModuleInterop' flag`

**Root Cause**: Winston uses CommonJS exports (`export =`) which conflicts with ES6 default import syntax.

**Solution Applied**: Changed from default import to namespace import in `src/support/logger/Log.ts`:
```typescript
// Before (problematic)
import winston from 'winston';

// After (fixed)
import * as winston from 'winston';
```

**Prevention**: 
- Always use namespace imports for CommonJS modules
- Run `npm run check-imports` before development
- Refer to `.kiro/steering/typescript-import-guidelines.md` for detailed guidelines

### Other Common TypeScript Issues

1. **Method Name Mismatches**: Check UIActions interface for correct method names (e.g., `dropdown` vs `dropDown`)
2. **Parameter Count Mismatches**: Verify method signatures match their implementations
3. **Missing Type Definitions**: Ensure all imports have proper type definitions

## Development Workflow

1. **Before Starting**: Run `npm run check-imports` and `npm run type-check`
2. **During Development**: Fix TypeScript errors as they appear
3. **Before Committing**: Run both scripts again to ensure clean state
4. **If Issues Persist**: Check this document and steering guidelines

## Scripts Available

- `npm run check-imports` - Check for common import issues
- `npm run type-check` - Full TypeScript compilation check
- `npm run test` - Run full test suite
- `npm run dry:test` - Dry run tests without execution

## Files to Reference

- `.kiro/steering/typescript-import-guidelines.md` - Detailed import guidelines
- `scripts/check-imports.js` - Import validation script
- `tsconfig.json` - TypeScript configuration

## Maintenance

- Update `scripts/check-imports.js` when new problematic modules are discovered
- Add new common issues to this document as they're encountered
- Keep steering guidelines updated with solutions