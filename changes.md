## Changelog

### Migration and Improvements

- Migrated codebase to TypeScript for improved type safety and maintainability.
- Moved source files to `src/` and tests to `tests/` for better project structure.
- Renamed files:
	- `index.ts` → `src/index.ts`
	- `winstonLogger.ts` → `src/logger.ts`
	- `test.ts` → `tests/main.test.ts`
- Updated logger configuration:
	- All log levels (including debug) are now written to `combined.log`.
	- Log file paths are now always relative to the project root.
- Improved test logic to correctly parse and validate log entries.
- Updated `tsconfig.json` for correct TypeScript project setup and file inclusion.
- Updated `package.json` and `package-lock.json` for new build and type definitions.
- Added TypeScript type definitions for logger and main entry point.
- Added this `changes.md` file to document changes.
