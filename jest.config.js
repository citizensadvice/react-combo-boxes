module.exports = {
  clearMocks: true,
  collectCoverageFrom: ['src/**/*.js?(x)'],
  testEnvironmentOptions: {
    globalsCleanup: 'on',
  },
  setupFilesAfterEnv: ['./src/__jest_setup__.js'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
};
