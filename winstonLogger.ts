import winston from "winston";
import path from "path";
import fs from "fs";

const LOG_DIR = path.join(path.resolve(__dirname, '..'), "logs");
if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR);

const ERROR_LOG = path.join(LOG_DIR, "error.log");
const COMBINED_LOG = path.join(LOG_DIR, "combined.log");
const QUERY_LOG = path.join(LOG_DIR, "query.log");

// Force single-line console logs
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.printf(({ level, message, timestamp }) => {
    let parsed: any;
    try {
      parsed = JSON.parse(message as string);
    } catch {
      parsed = { message };
    }
    return `[${timestamp}] ${level}: ${parsed.message} ${JSON.stringify(parsed)}`;
  })
);

const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json() // ✅ Already single-line
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "debug",
  transports: [
  new winston.transports.Console({ format: consoleFormat }),
  new winston.transports.File({ filename: ERROR_LOG, level: "error", format: fileFormat }),
  new winston.transports.File({ filename: COMBINED_LOG, level: "debug", format: fileFormat }),
  new winston.transports.File({ filename: QUERY_LOG, level: "debug", format: fileFormat }),
  ],
});

export default logger;
