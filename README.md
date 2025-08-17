# neat-logger

A production-grade, structured logger for Node.js apps, built on Winston and designed for reusability across services. Version 2.0.0 introduces a class-based API, child loggers with bound context, and a new critical level — while keeping JSON output ready for log aggregation.

---

## Purpose

- Provide a simple, consistent logging API for services and libraries
- Emit JSON logs suitable for ingestion (ELK, Datadog, etc.)
- Support request/user context via child loggers
- Keep console output human-readable during development

---

## Features

- JSON-structured logs with timestamp, level, message, and metadata
- Levels: info, warn, error, debug, critical
- Child loggers: bind context (e.g., requestId, userId) with `.child()`
- Console + file transports (colorized console, JSON files)
- Files written to `logs/` in the project root: `error.log` (errors only) and `combined.log` (all logs)
- TypeScript-first with strong types for level methods

---

## Installation

Install from npm (package name placeholder):

```bash
npm install @gauravsharmacode/neat-logger
```

Local development usage:

```bash
# In this repo
npm install
npm run build

# Optionally link for local testing in another project
npm link
# Then in your project
npm link @gauravsharmacode/neat-logger
```

---

## Quick start

```ts
import { logger } from '@gauravsharmacode/neat-logger';

logger.info('Service started');
logger.error('Operation failed', { code: 'E_FAIL' });
```

### Context with child loggers

```ts
import { logger } from '@gauravsharmacode/neat-logger';

const reqLogger = logger.child({ requestId: 'req-123' });
reqLogger.info('Handling request', { path: '/api/users' });

const userLogger = reqLogger.child({ userId: 42 });
userLogger.warn('Profile incomplete');
userLogger.error('Save failed', { reason: 'validation' });
```

### Critical level

```ts
logger.critical('Database unavailable', { db: 'primary' });
```

---

## Repository usage (this repo)

- Build the TypeScript sources:

```bash
npm run build
```

- Run the example:

```bash
node example.js
```

- Run tests:

```bash
npm test
```

---

## Project structure

```
.
├─ src/
│  ├─ index.ts        # Public exports (Logger class, base instance)
│  └─ logger.ts       # Logger implementation (Winston setup, child, levels)
├─ dist/              # Build output (generated)
├─ tests/
│  └─ main.test.ts    # End-to-end logging test against combined.log
├─ example.js         # Runnable example (uses dist build)
├─ example.ts         # TypeScript example (imports from dist)
├─ jest.config.js     # Jest + ts-jest configuration
├─ tsconfig.json      # Library TS config
├─ tsconfig.test.json # Test TS config
└─ changes.md         # Changelog
```

---

## How it works

- Built on Winston with a custom level set that includes `critical`
- Console transport is colorized and intended for local dev; file transports write JSON to `logs/error.log` and `logs/combined.log`
- The base `logger` is an instance of `Logger`. Use `child(defaultMeta)` to create scoped loggers that automatically include your context
- The implementation enriches logs with caller file/function using the JS stack; note that this may be tuned in future versions

---

## Contributing

Contributions are welcome!

- Issues: Open one with a clear description, steps to reproduce, and expected behavior
- PRs: Keep changes focused. Include tests when applicable
- Development workflow:

```bash
# Install deps
npm install

# Type-check and build
npm run build

# Run tests
npm test

# Run lints/format (if configured)
# npm run lint
# npm run format
```

Before submitting, please run the test suite and ensure example.js runs as expected.

---

## License

MIT © Gaurav Sharma
