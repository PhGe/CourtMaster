// jest.config.js

module.exports = {
  projects: [
    {
      displayName: 'node-tests',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/tests/jest/node/*.js'],
      testPathIgnorePatterns: ['/node_modules/', '/playwright/'],
      coveragePathIgnorePatterns: ['/node_modules/', '/playwright/'],
      moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node', 'vue'],
      collectCoverage: true,
      collectCoverageFrom: ['src/**/*.js'],
      coverageReporters: ['text', 'lcov'],
      verbose: true,
      setupFiles: ['<rootDir>/jest.setup.js'],
      transform: {
        '^.+\\.js$': 'babel-jest',
      },
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
      },
    },
    {
      displayName: 'jsdom-tests',
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/tests/jest/jsdom/*.js'],
      testPathIgnorePatterns: ['/node_modules/', '/playwright/'],
      coveragePathIgnorePatterns: ['/node_modules/', '/playwright/'],
      moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node', 'vue'],
      collectCoverage: true,
      collectCoverageFrom: ['src/**/*.js'],
      coverageReporters: ['text', 'lcov'],
      verbose: true,
      setupFiles: ['<rootDir>/jest.setup.js'],
      transform: {
        '^.+\\.vue$': '@vue/vue3-jest',
        '^.+\\.js$': 'babel-jest',
      },
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
      },
    },
  ],
};
