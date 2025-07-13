const winston = require("winston");
const path = require("path");
const fs = require("fs");

// Ensure log directory exists
const LOG_DIR = path.join(process.cwd(), "logs"); // Always relative to the main project root
if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR);

// Define paths
const ERROR_LOG = path.join(LOG_DIR, "error.log");
const COMBINED_LOG = path.join(LOG_DIR, "combined.log");
const QUERY_LOG = path.join(LOG_DIR, "query.log");

// Pretty console logs
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.printf(({ level, message, timestamp }) => {
    const parsed = typeof message === "object" ? message : JSON.parse(message);
    return `[${timestamp}] ${level}: ${parsed.message} ${JSON.stringify(parsed, null, 2)}`;
  })
);

// Raw JSON logs for file transports
const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json() // auto-stringify
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  transports: [
    new winston.transports.Console({ format: consoleFormat }),
    new winston.transports.File({ filename: ERROR_LOG, level: "error", format: fileFormat }),
    new winston.transports.File({ filename: COMBINED_LOG, format: fileFormat }),
    new winston.transports.File({ filename: QUERY_LOG, level: "debug", format: fileFormat }),
  ],
});

module.exports = logger;
