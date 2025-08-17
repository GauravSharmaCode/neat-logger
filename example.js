// Runnable CommonJS example using the built output
// Build first: npm run build

const { logger, Logger } = require('./dist/index.js');

// Base logs at various levels
logger.info('Server starting');
logger.warn('Cache is warming up');
logger.error('Minor recoverable error occurred', { code: 'E_MINOR' });
logger.debug('Boot sequence details', { step: 1 });
logger.critical('Database unavailable', { db: 'primary' });

// Create a child logger bound to a request context
/** @type {Logger} */
const reqLogger = logger.child({ requestId: 'req-123' });
reqLogger.info('Handling incoming request', { path: '/api/users' });
reqLogger.debug('Parsed headers', { headers: { accept: 'application/json' } });

// Create a nested child with user context bound
/** @type {Logger} */
const userLogger = reqLogger.child({ userId: 42 });
userLogger.info('Fetching user profile');
userLogger.warn('User profile missing optional field', { missing: ['bio'] });

// Per-log meta can override or extend bound context
userLogger.error('Failed to update settings', { userId: 99, reason: 'validation' });

// You can still log arbitrary structured metadata
userLogger.debug('Computed preferences', { prefs: { theme: 'dark', lang: 'en' } });
