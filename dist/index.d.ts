export type LogLevel = "info" | "warn" | "error" | "debug";
export interface LogMeta {
    level?: LogLevel;
    file?: string;
    func?: string;
    requestId?: string;
    extra?: Record<string, any>;
}
/**
 * Structured logger with metadata.
 */
export declare function logWithMeta(message: string, meta?: LogMeta): void;
