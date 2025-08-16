"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logWithMeta = logWithMeta;
const path_1 = __importDefault(require("path"));
const winstonLogger_1 = __importDefault(require("./winstonLogger"));
const LEVELS = ["info", "warn", "error", "debug"];
/**
 * Retrieves the file name and function name of the calling code.
 *
 * This function analyzes the stack trace to extract information about the
 * location in the code where the logWithMeta function was called. It skips
 * frames related to internal Node.js modules and logger utility files.
 *
 * @returns An object containing:
 * - fileName: The name of the file from which the function was called.
 * - functionName: The name of the function that made the call.
 *   If unable to determine, defaults to 'unknown'.
 */
function getCallerInfo() {
    const stack = new Error().stack?.split("\n").slice(2); // Skip current + logWithMeta frame
    for (const line of stack || []) {
        if (!line || line.includes("node_modules") || line.includes("internal") || line.includes("logger.js"))
            continue;
        const match = line.match(/at\s+(.*?)\s+\((.*):(\d+):(\d+)\)/) || line.match(/at\s+(.*):(\d+):(\d+)/);
        if (match) {
            const filePath = match[2] || match[1];
            const funcName = match[1]?.split(" ")[0] || "anonymous";
            return {
                fileName: path_1.default.basename(filePath),
                functionName: funcName,
            };
        }
    }
    return { fileName: "unknown", functionName: "unknown" };
}
/**
 * Structured logger with metadata.
 */
function logWithMeta(message, meta = {}) {
    const timestamp = new Date().toISOString();
    const { fileName, functionName } = getCallerInfo();
    const level = LEVELS.includes(meta.level) ? meta.level : "info";
    const file = meta.file || fileName;
    const func = meta.func || functionName;
    const logEntry = {
        timestamp,
        level,
        file,
        function: func,
        message,
        ...(meta.requestId && { requestId: meta.requestId }),
        ...(meta.extra || {}),
    };
    winstonLogger_1.default.log({
        level,
        message: JSON.stringify(logEntry), // Serialize log entry for Winston
    });
}
