module.exports = {
  clearMocks: true,
  collectCoverageFrom: ['src/**/*.js?(x)'],
  setupFilesAfterEnv: ['./src/__jest_setup.js'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
};
