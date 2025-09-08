import { promises as fs } from 'fs';
import path from 'path';

// Global test setup
beforeAll(async () => {
  // Create test data directory if it doesn't exist
  const testDataDir = path.join(process.cwd(), 'tests', 'data');
  try {
    await fs.access(testDataDir);
  } catch {
    await fs.mkdir(testDataDir, { recursive: true });
  }
});

// Clean up after each test
afterEach(async () => {
  // Clean up any test character files
  const testFiles = [
    'character.json',
    'test-character.json',
    'entities.json'
  ];
  
  for (const file of testFiles) {
    try {
      await fs.unlink(file);
    } catch {
      // File doesn't exist, ignore
    }
  }
});

// Mock console.error to avoid noise in tests
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});