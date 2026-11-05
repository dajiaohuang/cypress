const { expect } = require('chai')
const systemTests = require('../lib/system-tests').default

describe('config subscription reconnect in run mode', () => {
  systemTests.setup()

  // https://github.com/cypress-io/cypress/issues/35236
  systemTests.it('does not restart the spec', {
    project: 'config-reconnect',
    browser: 'chrome',
    snapshot: false,
    expectedExitCode: 0,
    onStdout: (stdout) => {
      expect(stdout).to.include('2 passing')
    },
  })
})
