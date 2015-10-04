exports.config = {
  framework: 'mocha',
  mochaOpts:{
    reporter:'spec',
    slow:3000,
    enableTimeouts: false
  },
  onPrepare: function() {
    browser.manage().window().setSize(1000, 700);
  },
  multiCapabilities: [{
    'browserName': 'chrome'
  }, {
    'browserName': 'firefox'
  }],
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['e2e_test.js']
};