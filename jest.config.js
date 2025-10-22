// jest.config.js - BACKEND ONLY CONFIG
module.exports = {
  testEnvironment: 'node',
  verbose: true,
  testTimeout: 15000,
  testMatch: [
    '**/tests/**/*.test.js'  // Only .js test files
  ],
  // IGNORE frontend test files
  testPathIgnorePatterns: [
    '/apps/storefront/',
    '/node_modules/'
  ]
};