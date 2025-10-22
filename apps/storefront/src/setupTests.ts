// src/setupTests.ts
import '@testing-library/jest-dom';

// Add global Jest types
import { jest } from '@jest/globals';

// Optional: Add global test utilities
(global as any).jest = jest;