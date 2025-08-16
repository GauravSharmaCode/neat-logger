"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const LOG_DIR = path_1.default.join(path_1.default.resolve(__dirname, '..'), "logs");
if (!fs_1.default.existsSync(LOG_DIR))
    fs_1.default.mkdirSync(LOG_DIR);
const ERROR_LOG = path_1.default.join(LOG_DIR, "error.log");
const COMBINED_LOG = path_1.default.join(LOG_DIR, "combined.log");
const QUERY_LOG = path_1.default.join(LOG_DIR, "query.log");
// Force single-line console logs
const consoleFormat = winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.timestamp(), winston_1.default.format.printf(({ level, message, timestamp }) => {
    let parsed;
    try {
        parsed = JSON.parse(message);
    }
    catch (_a) {
        parsed = { message };
    }
    return `[${timestamp}] ${level}: ${parsed.message} ${JSON.stringify(parsed)}`;
}));
const fileFormat = winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json() // ✅ Already single-line
);
const logger = winston_1.default.createLogger({
    level: process.env.LOG_LEVEL || "debug",
    transports: [
        new winston_1.default.transports.Console({ format: consoleFormat }),
        new winston_1.default.transports.File({ filename: ERROR_LOG, level: "error", format: fileFormat }),
        new winston_1.default.transports.File({ filename: COMBINED_LOG, level: "debug", format: fileFormat }),
        new winston_1.default.transports.File({ filename: QUERY_LOG, level: "debug", format: fileFormat }),
    ],
});
exports.default = logger;
