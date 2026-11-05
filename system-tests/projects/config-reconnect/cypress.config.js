let starts = 0

module.exports = {
  e2e: {
    supportFile: false,
    setupNodeEvents (on) {
      on('task', {
        recordStart () {
          starts += 1

          return starts
        },
      })
    },
  },
}
