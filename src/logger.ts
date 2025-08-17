// logger.ts
import winston from "winston";
import path from "path";
import fs from "fs";

const LOG_DIR = path.join(process.cwd(), "logs");
if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });

// Define explicit levels including 'critical'
const customLevels = {
  levels: {
    critical: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
  },
  colors: {
    critical: "red bold",
    error: "red",
    warn: "yellow",
    info: "green",
    debug: "blue",
  },
};

winston.addColors(customLevels.colors);

type LogMethod = (message: string, meta?: Record<string, unknown>) => void;

class Logger {
  private winstonLogger: winston.Logger;

  // Declare common methods for type safety. They are assigned at runtime.
  public critical!: LogMethod;
  public error!: LogMethod;
  public warn!: LogMethod;
  public info!: LogMethod;
  public debug!: LogMethod;

  constructor(winstonInstance?: winston.Logger) {
    this.winstonLogger =
      winstonInstance ||
      winston.createLogger({
        levels: customLevels.levels,
        level: process.env.LOG_LEVEL || "debug",
        format: winston.format.json(),
        transports: [
          new winston.transports.File({
            filename: path.join(LOG_DIR, "error.log"),
            level: "error",
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.json()
            ),
          }),
          new winston.transports.File({
            filename: path.join(LOG_DIR, "combined.log"),
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.json()
            ),
          }),
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.colorize({ all: true }),
              winston.format.simple()
            ),
          }),
        ],
      });

    // Dynamically bind all levels as methods
    const allLevels = Object.keys(this.winstonLogger.levels);
    for (const level of allLevels) {
      (this as any)[level] = (message: string, meta?: Record<string, unknown>): void => {
        const caller = this.getCallerInfo();
        this.winstonLogger.log(level, message, { ...meta, ...caller });
      };
    }
  }

  private getCallerInfo() {
    const stack = new Error().stack;
    if (!stack) return { file: "unknown", function: "unknown" };

    const lines = stack.split("\n");
    const callerLine = lines[4] || "";

    const match =
      callerLine.match(/at\s+(.*)\s+\((.*):(\d+):(\d+)\)/) ||
      callerLine.match(/at\s+(.*):(\d+):(\d+)/);

    if (match) {
      const func = match[1] || "anonymous";
      const file = match[2] ? path.basename(match[2]) : "unknown";
      return { file, function: func };
    }

    return { file: "unknown", function: "unknown" };
  }

  public child(defaultMeta: Record<string, unknown>): Logger {
    const childWinstonLogger = this.winstonLogger.child(defaultMeta);
    return new Logger(childWinstonLogger);
  }
}

// Base instance
export const baseLogger = new Logger();
export { Logger };

// Public LogLevel type to match our custom levels
export type LogLevel = keyof typeof customLevels.levels;
