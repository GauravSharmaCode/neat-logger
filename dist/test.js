"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Cleanup old logs before test
const LOG_FILE = path_1.default.join(path_1.default.resolve(__dirname, '..'), 'logs', 'combined.log');
if (fs_1.default.existsSync(LOG_FILE))
    fs_1.default.unlinkSync(LOG_FILE);
console.log('🧪 Running logWithMeta() tests...');
// 1. Basic info log
(0, index_1.logWithMeta)("Info level log");
(0, index_1.logWithMeta)("Warning level log", { level: "warn" });
(0, index_1.logWithMeta)("Error level log", { level: "error" });
(0, index_1.logWithMeta)("Debug level log", { level: "debug" });
// 2. With custom metadata
(0, index_1.logWithMeta)("Log with extra context", {
    level: "info",
    file: "testFile.js",
    func: "runTest",
    extra: { requestId: "abc-123", userId: 42 },
});
setTimeout(() => {
    const contents = fs_1.default.readFileSync(LOG_FILE, 'utf8');
    const lines = contents.trim().split('\n');
    const parsed = lines.map(line => {
        try {
            return JSON.parse(line);
        }
        catch (e) {
            return null;
        }
    }).filter(Boolean);
    const passed = parsed.length >= 5 &&
        parsed.every(entry => {
            let inner;
            try {
                inner = JSON.parse(entry.message);
            }
            catch {
                return false;
            }
            return (typeof inner === 'object' &&
                inner.timestamp &&
                inner.level &&
                inner.message &&
                inner.file &&
                inner.function);
        });
    console.log('Parsed log entries:', parsed);
    console.log('Parsed log entries:', passed);
    console.log(passed ? '✅ Logger test passed!' : '❌ Logger test failed.');
}, 2000);
