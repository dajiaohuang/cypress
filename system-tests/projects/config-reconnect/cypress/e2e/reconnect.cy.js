/* global Cypress, cy */

const cdp = (command, params = {}) => Cypress.automation('remote:debugger:protocol', { command, params })

describe('runner config subscription in run mode', () => {
  it('starts the spec only once', () => {
    cy.task('recordStart').should('eq', 1)
  })

  it('does not rerun after a GraphQL socket closes', () => {
    // A run-mode app need not open this socket at all. If it does, close it
    // to exercise the reconnect that used to deliver a second config value.
    cy.window().then((win) => {
      if (win.top.__configReconnectTestClosed) return

      // The runner window survives a spec restart, so only close once.
      win.top.__configReconnectTestClosed = true

      return cdp('Runtime.evaluate', { expression: 'WebSocket.prototype' })
      .then(({ result }) => cdp('Runtime.queryObjects', { prototypeObjectId: result.objectId }))
      .then(({ objects }) => {
        return cdp('Runtime.callFunctionOn', {
          objectId: objects.objectId,
          functionDeclaration: `function () {
            this.filter((socket) => socket.url.endsWith('/__socket-graphql') && socket.readyState === 1)
              .forEach((socket) => socket.close(1000, 'test reconnect'))
          }`,
          returnByValue: true,
        })
      })
    })

    // Allow graphql-ws to reconnect and deliver its initial subscription value.
    cy.wait(5000)
  })
})
