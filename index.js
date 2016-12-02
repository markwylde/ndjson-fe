const EventEmitter = require('events')

module.exports = function() {
  const myEmitter = new EventEmitter()
  let buffer = ''

  myEmitter.on('write', str => {

    const lines = (buffer + str).split('\n')

    lines.forEach((row, idx) => {
      if (row === '') return;
      
      try {
        const parsed = JSON.parse(row)
        myEmitter.emit('next', parsed)
        buffer = ''
      } catch(e) {
        if (idx  === lines.length - 1) {
          buffer = row
        } else {
          myEmitter.emit('error', `Invalid JSON received:\n${row}\n`)
        }
      }
    })

  })

  return myEmitter
}