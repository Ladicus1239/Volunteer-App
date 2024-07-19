module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
    collectCoverage: true, // Enable code coverage collection
    collectCoverageFrom: [
      'src/**/*.{js,jsx,ts,tsx}', // Specify which files to collect coverage from
      '!src/**/*.test.{js,jsx,ts,tsx}', // Exclude test files
    ],
    coverageReporters: ['json', 'html', 'text'], // Specify coverage reporters
    coverageDirectory: 'coverage', // Directory to output coverage reports
  };
  