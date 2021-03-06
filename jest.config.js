const {defaults} = require('jest-config');

module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/utilities/constants.js',
    '!src/index.js'
  ],
  verbose: true,
  restoreMocks: true,
  resetMocks: true,
  clearMocks: true
};