// A comprehensive example showing base logging, child contexts, and meta overrides
// Import from built output so this example can be run with Node after `npm run build`.
import { logger, Logger } from "./dist/index";

// Base logs at various levels
logger.info("Server starting");
logger.warn("Cache is warming up");
logger.error("Minor recoverable error occurred", { code: "E_MINOR" });
logger.debug("Boot sequence details", { step: 1 });
logger.critical("Database unavailable", { db: "primary" });

// Create a child logger bound to a request context
const reqLogger: Logger = logger.child({ requestId: "req-123" });
reqLogger.info("Handling incoming request", { path: "/api/users" });
reqLogger.debug("Parsed headers", { headers: { accept: "application/json" } });

// Create a nested child with user context bound
const userLogger: Logger = reqLogger.child({ userId: 42 });
userLogger.info("Fetching user profile");
userLogger.warn("User profile missing optional field", { missing: ["bio"] });

// Per-log meta can override or extend bound context
userLogger.error("Failed to update settings", { userId: 99, reason: "validation" });

// You can still log arbitrary structured metadata
userLogger.debug("Computed preferences", { prefs: { theme: "dark", lang: "en" } });
