const {defaults} = require('jest-config');

module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/utilities/constants.js'
  ],
  verbose: true
};