module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/main.js',
    '!src/router.js'
  ],
  transform: {
    '^.+\\.js$': 'babel-jest'
  }
} 