import { logWithMeta } from '../src/index';
import fs from 'fs';
import path from 'path';

// Cleanup old logs before test
const LOG_FILE = path.join(path.resolve(__dirname, '..'), 'logs', 'combined.log');
if (fs.existsSync(LOG_FILE)) fs.unlinkSync(LOG_FILE);

console.log('🧪 Running logWithMeta() tests...');

// 1. Basic info log
logWithMeta("Info level log");
logWithMeta("Warning level log", { level: "warn" });
logWithMeta("Error level log", { level: "error" });
logWithMeta("Debug level log", { level: "debug" });


// 2. With custom metadata
logWithMeta("Log with extra context", {
  level: "info",
  file: "testFile.js",
  func: "runTest",
  extra: { requestId: "abc-123", userId: 42 },
});

setTimeout(() => {
  const contents = fs.readFileSync(LOG_FILE, 'utf8');
  const lines = contents.trim().split('\n');

  const parsed = lines.map(line => {
    try {
      return JSON.parse(line);
    } catch (e) {
      return null;
    }
  }).filter(Boolean);

  const passed = parsed.length >= 5 &&
    parsed.every(entry => {
      let inner;
      try {
        inner = JSON.parse(entry.message);
      } catch {
        return false;
      }
      return (
        typeof inner === 'object' &&
        inner.timestamp &&
        inner.level &&
        inner.message &&
        inner.file &&
        inner.function
      );
    });
    console.log('Parsed log entries:', parsed);
    console.log('Parsed log entries:', passed);
  console.log(passed ? '✅ Logger test passed!' : '❌ Logger test failed.');
}, 2000);
