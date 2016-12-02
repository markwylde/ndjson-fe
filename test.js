const NdJsonFe = require('./ndjson-fe')
const assert = require('assert')

const ndFactory = function() {

}

describe('Feeding Stream', function() {

  beforeEach(function() {
    this.stream = new NdJsonFe()
    this.events = []

    this.stream.on('next', result => { this.events.push(['next', result]) })
    this.stream.on('error', result => { this.events.push(['error', result]) })
  })

  describe('Writing 1 full JSON object', function() {

    it('should emit a "next" event with the parsed object', function(done) {

      this.stream.on('end', () => {
        assert.deepEqual(this.events[0], ['next', { ONE: 1, TWO: 2}])
        done()
      })

      this.stream.emit('write', `{ "ONE": 1, "TWO": 2 }\n`)
      this.stream.emit('end')
    })

    it('should raise only 1 event', function(done) {
      this.stream.on('end', () => {
        assert.equal(this.events.length, 1)
        done()
      })

      this.stream.emit('write', `{ "ONE": 1, "TWO": 2 }\n`)
      this.stream.emit('end')
    })

    it('should not emit an "error" event', function(done) {
      this.stream.on('end', () => {
        assert.equal(this.events[0][0], 'next')
        done()
      })

      this.stream.emit('write', `{ "ONE": 1, "TWO": 2 }\n`)
      this.stream.emit('end')
    })

  })

  describe('Writing 1 broken JSON object', function() {

    it('should emit an "error" event', function(done) {

      this.stream.on('end', () => {
        assert.deepEqual(this.events[0][0], 'error')
        done()
      })

      this.stream.emit('write', `{ BROKEN\n`)
      this.stream.emit('end')
    })

    it('should raise only 1 event', function(done) {
      this.stream.on('end', () => {
        assert.equal(this.events.length, 1)
        done()
      })

      this.stream.emit('write', `{ BROKEN\n`)
      this.stream.emit('end')
    })

  })

  describe('Writing 2 JSON objects', function() {

    it('should emit two "next" events with a parsed objects in the correct order', function(done) {

      this.stream.on('end', () => {
        assert.deepEqual(this.events, [["next", { ONE: 1, TWO: 2}], ["next", {THREE: 3, FOUR: 4}]])
        done()
      })

      this.stream.emit('write', `{ "ONE": 1, "TWO": 2}\n{ "THREE": 3, "FOUR": 4 }\n`)
      this.stream.emit('end')
    })

    it('should raise only 2 events', function(done) {
      this.stream.on('end', () => {
        assert.equal(this.events.length, 2)
        done()
      })

      this.stream.emit('write', `{ "ONE": 1, "TWO": 2}\n{ "THREE": 3, "FOUR": 4 }\n`)
      this.stream.emit('end')
    })

  })

  describe('Writing 2 full JSON objects and 1 broken one', function() {

    it('should emit two "next" events with a parsed objects in the correct order', function(done) {

      this.stream.on('end', () => {
        assert.deepEqual(this.events[0], ["next", { ONE: 1, TWO: 2}])
        assert.deepEqual(this.events[1], ["next", { THREE: 3, FOUR: 4}])
        done()
      })

      this.stream.emit('write', `{ "ONE": 1, "TWO": 2}\n{ "THREE": 3, "FOUR": 4 }\n{ BROKEN\n`)
      this.stream.emit('end')
    })

    it('should emit an "error" event', function(done) {

      this.stream.on('end', () => {
        assert.deepEqual(this.events[2][0], 'error')
        done()
      })

      this.stream.emit('write', `{ "ONE": 1, "TWO": 2}\n{ "THREE": 3, "FOUR": 4 }\n{ BROKEN\n`)
      this.stream.emit('end')
    })


    it('should raise only 3 events', function(done) {
      this.stream.on('end', () => {
        assert.equal(this.events.length, 3)
        done()
      })

      this.stream.emit('write', `{ "ONE": 1, "TWO": 2}\n{ "THREE": 3, "FOUR": 4 }\n{ BROKEN\n`)
      this.stream.emit('end')
    })

  })

  describe('Writing 1 Broken line and 2 full JSON objects', function() {

    it('should emit one "error" event and two "next" events with a parsed objects in the correct order', function(done) {

      this.stream.on('end', () => {
        assert.deepEqual(this.events[1], ["next", { ONE: 1, TWO: 2}])
        assert.deepEqual(this.events[2], ["next", { THREE: 3, FOUR: 4}])
        done()
      })

      this.stream.emit('write', `{ BROKEN\n{ "ONE": 1, "TWO": 2}\n{ "THREE": 3, "FOUR": 4 }\n`)
      this.stream.emit('end')
    })

    it('should emit an "error" event', function(done) {

      this.stream.on('end', () => {
        assert.deepEqual(this.events[0][0], 'error')
        done()
      })

      this.stream.emit('write', `{ BROKEN\n{ "ONE": 1, "TWO": 2}\n{ "THREE": 3, "FOUR": 4 }\n`)
      this.stream.emit('end')
    })


    it('should raise only 3 events', function(done) {
      this.stream.on('end', () => {
        assert.equal(this.events.length, 3)
        done()
      })

      this.stream.emit('write', `{ BROKEN\n{ "ONE": 1, "TWO": 2}\n{ "THREE": 3, "FOUR": 4 }\n`)
      this.stream.emit('end')
    })

  })

})






