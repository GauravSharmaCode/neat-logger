export type LogLevel = "info" | "warn" | "error" | "debug" | "http" | "silly" | "emerg" | "alert" | "crit" | "notice";

export { baseLogger as logger, Logger } from "./logger";