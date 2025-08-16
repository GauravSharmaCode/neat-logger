import path from "path";
import logger from "./logger";

export type LogLevel = "info" | "warn" | "error" | "debug";
export interface LogMeta {
  level?: LogLevel;
  file?: string;
  func?: string;
  requestId?: string;
  extra?: Record<string, any>;
}

const LEVELS: LogLevel[] = ["info", "warn", "error", "debug"];

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
function getCallerInfo(): { fileName: string; functionName: string } {
  const stack = new Error().stack?.split("\n").slice(2); // Skip current + logWithMeta frame

  for (const line of stack || []) {
    if (!line || line.includes("node_modules") || line.includes("internal") || line.includes("logger.js")) continue;

    const match = line.match(/at\s+(.*?)\s+\((.*):(\d+):(\d+)\)/) || line.match(/at\s+(.*):(\d+):(\d+)/);
    if (match) {
      const filePath = match[2] || match[1];
      const funcName = match[1]?.split(" ")[0] || "anonymous";
      return {
        fileName: path.basename(filePath),
        functionName: funcName,
      };
    }
  }

  return { fileName: "unknown", functionName: "unknown" };
}

/**
 * Structured logger with metadata.
 */
export function logWithMeta(message: string, meta: LogMeta = {}): void {
  const timestamp = new Date().toISOString();
  const { fileName, functionName } = getCallerInfo();

  const level: LogLevel = LEVELS.includes(meta.level as LogLevel) ? (meta.level as LogLevel) : "info";
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

  logger.log({
    level,
    message: JSON.stringify(logEntry), // Serialize log entry for Winston
  });
}
