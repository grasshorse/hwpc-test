# TypeScript Import Guidelines

## Common Import Issues and Solutions

### Winston Logger Import Issue

**Problem**: Winston uses CommonJS exports (`export =`) which conflicts with ES6 import syntax, causing this error:
```
Module can only be default-imported using the 'esModuleInterop' flag
```

**Solution**: Use namespace import instead of default import:
```typescript
// ❌ Incorrect - causes compilation error
import winston from 'winston';

// ✅ Correct - use namespace import
import * as winston from 'winston';
```

### Other Common Module Import Patterns

1. **For modules with CommonJS exports (`export =`)**:
   ```typescript
   import * as moduleName from 'module-name';
   ```

2. **For modules with ES6 default exports**:
   ```typescript
   import moduleName from 'module-name';
   ```

3. **For modules with named exports**:
   ```typescript
   import { namedExport } from 'module-name';
   ```

4. **For mixed exports**:
   ```typescript
   import moduleName, { namedExport } from 'module-name';
   ```

## Process for Handling Import Issues

1. **Check the module's export pattern** in `node_modules/[module]/index.d.ts`
2. **Look for `export =` declarations** - these require namespace imports
3. **Use the appropriate import syntax** based on the export pattern
4. **Test compilation** with `npx tsc --noEmit [file]` before proceeding

## Prevention Strategy

- Always use namespace imports (`import * as`) for CommonJS modules
- Check TypeScript compilation before committing changes
- Document any module-specific import requirements in this file

## Known Modules Requiring Namespace Imports

- `winston` - Logging library
- Add other problematic modules here as discovered