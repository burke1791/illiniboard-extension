const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    index: './src/index.js',
    background: './src/background.js',
    content: './src/illiniboardContent.js'
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js'
  }
}