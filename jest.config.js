module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/?(*.)+(test).js?(x)'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/firebase.js',
    '!src/reportWebVitals.js',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'src/firebase.js',
    'src/reportWebVitals.js'
  ],
  moduleNameMapper: {
    '\\.(css|less)$': '<rootDir>/src/__mocks__/styleMock.js',
  },
};
