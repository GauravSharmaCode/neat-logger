import { logger } from '../src/index';
import fs from 'fs';
import path from 'path';

const LOG_FILE = path.join(path.resolve(__dirname, '..'), 'logs', 'combined.log');

beforeAll(() => {
  if (fs.existsSync(LOG_FILE)) fs.unlinkSync(LOG_FILE);
});

function safeRead(filePath: string): string | null {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

function parseJsonLines(contents: string): any[] {
  const lines = contents
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);
  const parsed = lines
    .map(line => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean) as any[];
  return parsed;
}

test('Logger writes all levels and metadata', async () => {
  // Log entries
  logger.info('Info level log');
  logger.warn('Warning level log');
  logger.error('Error level log');
  logger.debug('Debug level log');
  logger.critical('Critical level log');
  logger.info('Log with extra context', {
    requestId: 'abc-123',
    userId: 42,
  });

  // Poll for up to 8 seconds for file writes to flush
  const deadline = Date.now() + 8000;
  let parsed: any[] = [];
  while (Date.now() < deadline) {
    const contents = safeRead(LOG_FILE);
    if (contents) {
      parsed = parseJsonLines(contents);
      const hasFive = parsed.length >= 5;
      const hasFields = parsed.every((entry: any) =>
        entry && entry.timestamp && entry.level && entry.message && entry.file && entry.function
      );
      if (hasFive && hasFields) {
        break;
      }
    }
    await new Promise(res => setTimeout(res, 150));
  }

  const passed = parsed.length >= 5 && parsed.every((entry: any) =>
    entry && entry.timestamp && entry.level && entry.message && entry.file && entry.function
  );

  expect(passed).toBe(true);
}, 10000);
