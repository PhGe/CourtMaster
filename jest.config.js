module.exports = {
  testEnvironment: 'node', // This sets up the testing environment to run in a Node.js environment
  testPathIgnorePatterns: ['/node_modules/', '/playwright/'], // Ignore specified directories during test runs
  coveragePathIgnorePatterns: ['/node_modules/', '/playwright/'], // Ignore specified directories during coverage calculation
  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node'], // File extensions to look for when running tests
  collectCoverage: true, // Enable test coverage collection
  collectCoverageFrom: ['src/**/*.js'], // Directory or files to include in coverage collection
  coverageReporters: ['text', 'lcov'], // Output coverage reports in text and lcov formats
  verbose: true, // Display individual test results with the test suite hierarchy
  setupFiles: ['<rootDir>/jest.setup.js'], // Specify the path to your Jest setup file
};
