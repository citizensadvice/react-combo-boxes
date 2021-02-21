module.exports = {
  clearMocks: true,
  collectCoverageFrom: ['src/**/*.js?(x)'],
  setupFilesAfterEnv: ['./src/__jest_setup.js'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/es/',
    '/cjs/',
  ],
};
