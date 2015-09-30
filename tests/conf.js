exports.config = {
  framework: 'mocha',
  mochaOpts:{
    reporter:'spec',
    slow:3000,
    enableTimeouts: false
  },
  // capabilities: {
  //   browserName: 'chrome',
  //   count: 15
  // },
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['e2e_test.js']
};