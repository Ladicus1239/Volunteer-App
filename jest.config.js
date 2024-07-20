// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx}', // Include all source files
    '!src/index.js', // Exclude specific files
    '!src/firebase.js',
    '!src/reportWebVitals.js',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'src/firebase.js',
    'src/reportWebVitals.js',
  ],
  moduleNameMapper: {
    '\\.(css|less)$': '<rootDir>/src/__mocks__/styleMock.js',
  },
  setupFilesAfterEnv: ['./src/setupTests.js'],
  testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'], // Match test files
};
