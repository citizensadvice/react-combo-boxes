module.exports = {
  clearMocks: true,
  collectCoverageFrom: ['src/**/*.js?(x)'],
  setupFilesAfterEnv: ['./src/__jest_setup.js'],
  testEnvironment: 'jest-environment-jsdom-sixteen',
  testPathIgnorePatterns: [
    '/node_modules/',
    '/es/',
    '/cjs/',
  ],
};
