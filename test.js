/* global describe, it, beforeEach */

const fs = require('fs');

const ndJsonFe = require('./index');
const assert = require('assert');

describe('Feeding Stream - with another stream', function () {
  it('works', function (done) {
    const stream = ndJsonFe();
    const events = [];

    stream.on('next', result => { events.push(['next', result]); });
    stream.on('error', result => { events.push(['error', result]); });

    stream.on('end', () => {
      assert.deepStrictEqual(events, [
        ['next', { ONE: 1, TWO: 2 }],
        ['next', { THREE: 1, FOUR: 4 }],
        ['next', { FIVE: 5, SIX: 6 }],
        ['next', { EIGHT: 8, SEVEN: 7 }],
        ['next', { NINE: 9 }]
      ]);
      done();
    });

    const readable = fs.createReadStream('./test.json', { highWaterMark: 5 });
    readable.pipe(stream);
  });

  it('breaks', function (done) {
    const stream = ndJsonFe();
    const events = [];

    stream.on('next', result => { events.push(['next', result]); });
    stream.on('error', result => { events.push(['error', result]); });

    stream.on('error', () => {
      assert.deepStrictEqual(events, [
        ['next', { ONE: 1, TWO: 2 }],
        ['next', { THREE: 1, FOUR: 4 }],
        ['next', { FIVE: 5, SIX: 6 }],
        ['error', 'Invalid JSON received:\n{ "SEVEN": 7, "EIGHT": 8 }{ "BROKEN\n']
      ]);
      done();
    });

    const readable = fs.createReadStream('./test-broke.json', { highWaterMark: 5 });
    readable.pipe(stream);
  });
});

describe('Feeding Stream - emit write', function () {
  beforeEach(function () {
    this.stream = ndJsonFe();
    this.events = [];

    this.stream.on('next', result => { this.events.push(['next', result]); });
    this.stream.on('error', result => { this.events.push(['error', result]); });
  });

  describe('Writing 1 full JSON object', function () {
    it('should emit a "next" event with the parsed object', function (done) {
      this.stream.on('end', () => {
        assert.deepStrictEqual(this.events[0], ['next', { ONE: 1, TWO: 2 }]);
        done();
      });

      this.stream.emit('write', '{ "ONE": 1, "TWO": 2 }\n');
      this.stream.emit('end');
    });

    it('should raise only 1 event', function (done) {
      this.stream.on('end', () => {
        assert.strictEqual(this.events.length, 1);
        done();
      });

      this.stream.emit('write', '{ "ONE": 1, "TWO": 2 }\n');
      this.stream.emit('end');
    });

    it('should not emit an "error" event', function (done) {
      this.stream.on('end', () => {
        assert.strictEqual(this.events[0][0], 'next');
        done();
      });

      this.stream.emit('write', '{ "ONE": 1, "TWO": 2 }\n');
      this.stream.emit('end');
    });
  });

  describe('Writing 1 broken JSON object', function () {
    it('should emit an "error" event', function (done) {
      this.stream.on('end', () => {
        assert.deepStrictEqual(this.events[0][0], 'error');
        done();
      });

      this.stream.emit('write', '{ BROKEN\n');
      this.stream.emit('end');
    });

    it('should raise only 1 event', function (done) {
      this.stream.on('end', () => {
        assert.strictEqual(this.events.length, 1);
        done();
      });

      this.stream.emit('write', '{ BROKEN\n');
      this.stream.emit('end');
    });
  });

  describe('Writing 2 JSON objects', function () {
    it('should emit two "next" events with a parsed objects in the correct order', function (done) {
      this.stream.on('end', () => {
        assert.deepStrictEqual(this.events, [['next', { ONE: 1, TWO: 2 }], ['next', { THREE: 3, FOUR: 4 }]]);
        done();
      });

      this.stream.emit('write', '{ "ONE": 1, "TWO": 2}\n{ "THREE": 3, "FOUR": 4 }\n');
      this.stream.emit('end');
    });

    it('should raise only 2 events', function (done) {
      this.stream.on('end', () => {
        assert.strictEqual(this.events.length, 2);
        done();
      });

      this.stream.emit('write', '{ "ONE": 1, "TWO": 2}\n{ "THREE": 3, "FOUR": 4 }\n');
      this.stream.emit('end');
    });
  });

  describe('Writing 2 full JSON objects and 1 broken one', function () {
    it('should emit two "next" events with a parsed objects in the correct order', function (done) {
      this.stream.on('end', () => {
        assert.deepStrictEqual(this.events[0], ['next', { ONE: 1, TWO: 2 }]);
        assert.deepStrictEqual(this.events[1], ['next', { THREE: 3, FOUR: 4 }]);
        done();
      });

      this.stream.emit('write', '{ "ONE": 1, "TWO": 2}\n{ "THREE": 3, "FOUR": 4 }\n{ BROKEN\n');
      this.stream.emit('end');
    });

    it('should emit an "error" event', function (done) {
      this.stream.on('end', () => {
        assert.deepStrictEqual(this.events[2][0], 'error');
        done();
      });

      this.stream.emit('write', '{ "ONE": 1, "TWO": 2}\n{ "THREE": 3, "FOUR": 4 }\n{ BROKEN\n');
      this.stream.emit('end');
    });

    it('should raise only 3 events', function (done) {
      this.stream.on('end', () => {
        assert.strictEqual(this.events.length, 3);
        done();
      });

      this.stream.emit('write', '{ "ONE": 1, "TWO": 2}\n{ "THREE": 3, "FOUR": 4 }\n{ BROKEN\n');
      this.stream.emit('end');
    });
  });

  describe('Writing 1 Broken line and 2 full JSON objects', function () {
    it('should emit one "error" event and two "next" events with a parsed objects in the correct order', function (done) {
      this.stream.on('end', () => {
        assert.deepStrictEqual(this.events[1], ['next', { ONE: 1, TWO: 2 }]);
        assert.deepStrictEqual(this.events[2], ['next', { THREE: 3, FOUR: 4 }]);
        done();
      });

      this.stream.emit('write', '{ BROKEN\n{ "ONE": 1, "TWO": 2}\n{ "THREE": 3, "FOUR": 4 }\n');
      this.stream.emit('end');
    });

    it('should emit an "error" event', function (done) {
      this.stream.on('end', () => {
        assert.deepStrictEqual(this.events[0][0], 'error');
        done();
      });

      this.stream.emit('write', '{ BROKEN\n{ "ONE": 1, "TWO": 2}\n{ "THREE": 3, "FOUR": 4 }\n');
      this.stream.emit('end');
    });

    it('should raise only 3 events', function (done) {
      this.stream.on('end', () => {
        assert.strictEqual(this.events.length, 3);
        done();
      });

      this.stream.emit('write', '{ BROKEN\n{ "ONE": 1, "TWO": 2}\n{ "THREE": 3, "FOUR": 4 }\n');
      this.stream.emit('end');
    });
  });
});

describe('Feeding Stream - write', function () {
  beforeEach(function () {
    this.stream = ndJsonFe();
    this.events = [];

    this.stream.on('next', result => { this.events.push(['next', result]); });
    this.stream.on('error', result => { this.events.push(['error', result]); });
  });

  describe('Writing 1 full JSON object', function () {
    it('should emit a "next" event with the parsed object', function (done) {
      this.stream.on('end', () => {
        assert.deepStrictEqual(this.events[0], ['next', { ONE: 1, TWO: 2 }]);
        done();
      });

      this.stream.write('{ "ONE": 1, "TWO": 2 }\n');
      this.stream.end();
    });

    it('should raise only 1 event', function (done) {
      this.stream.on('end', () => {
        assert.strictEqual(this.events.length, 1);
        done();
      });

      this.stream.write('{ "ONE": 1, "TWO": 2 }\n');
      this.stream.end();
    });

    it('should not emit an "error" event', function (done) {
      this.stream.on('end', () => {
        assert.strictEqual(this.events[0][0], 'next');
        done();
      });

      this.stream.write('{ "ONE": 1, "TWO": 2 }\n');
      this.stream.end();
    });
  });

  describe('Writing 1 broken JSON object', function () {
    it('should emit an "error" event', function (done) {
      this.stream.on('end', () => {
        assert.deepStrictEqual(this.events[0][0], 'error');
        done();
      });

      this.stream.write('{ BROKEN\n');
      this.stream.end();
    });

    it('should raise only 1 event', function (done) {
      this.stream.on('end', () => {
        assert.strictEqual(this.events.length, 1);
        done();
      });

      this.stream.write('{ BROKEN\n');
      this.stream.end();
    });
  });

  describe('Writing 2 JSON objects', function () {
    it('should emit two "next" events with a parsed objects in the correct order', function (done) {
      this.stream.on('end', () => {
        assert.deepStrictEqual(this.events, [['next', { ONE: 1, TWO: 2 }], ['next', { THREE: 3, FOUR: 4 }]]);
        done();
      });

      this.stream.write('{ "ONE": 1, "TWO": 2}\n{ "THREE": 3, "FOUR": 4 }\n');
      this.stream.end();
    });

    it('should raise only 2 events', function (done) {
      this.stream.on('end', () => {
        assert.strictEqual(this.events.length, 2);
        done();
      });

      this.stream.write('{ "ONE": 1, "TWO": 2}\n{ "THREE": 3, "FOUR": 4 }\n');
      this.stream.end();
    });
  });

  describe('Writing 2 full JSON objects and 1 broken one', function () {
    it('should emit two "next" events with a parsed objects in the correct order', function (done) {
      this.stream.on('end', () => {
        assert.deepStrictEqual(this.events[0], ['next', { ONE: 1, TWO: 2 }]);
        assert.deepStrictEqual(this.events[1], ['next', { THREE: 3, FOUR: 4 }]);
        done();
      });

      this.stream.write('{ "ONE": 1, "TWO": 2}\n{ "THREE": 3, "FOUR": 4 }\n{ BROKEN\n');
      this.stream.end();
    });

    it('should emit an "error" event', function (done) {
      this.stream.on('end', () => {
        assert.deepStrictEqual(this.events[2][0], 'error');
        done();
      });

      this.stream.write('{ "ONE": 1, "TWO": 2}\n{ "THREE": 3, "FOUR": 4 }\n{ BROKEN\n');
      this.stream.end();
    });

    it('should raise only 3 events', function (done) {
      this.stream.on('end', () => {
        assert.strictEqual(this.events.length, 3);
        done();
      });

      this.stream.write('{ "ONE": 1, "TWO": 2}\n{ "THREE": 3, "FOUR": 4 }\n{ BROKEN\n');
      this.stream.end();
    });
  });

  describe('Writing 1 Broken line and 2 full JSON objects', function () {
    it('should emit one "error" event and two "next" events with a parsed objects in the correct order', function (done) {
      this.stream.on('end', () => {
        assert.deepStrictEqual(this.events[1], ['next', { ONE: 1, TWO: 2 }]);
        assert.deepStrictEqual(this.events[2], ['next', { THREE: 3, FOUR: 4 }]);
        done();
      });

      this.stream.write('{ BROKEN\n{ "ONE": 1, "TWO": 2}\n{ "THREE": 3, "FOUR": 4 }\n');
      this.stream.end();
    });

    it('should emit an "error" event', function (done) {
      this.stream.on('end', () => {
        assert.deepStrictEqual(this.events[0][0], 'error');
        done();
      });

      this.stream.write('{ BROKEN\n{ "ONE": 1, "TWO": 2}\n{ "THREE": 3, "FOUR": 4 }\n');
      this.stream.end();
    });

    it('should raise only 3 events', function (done) {
      this.stream.on('end', () => {
        assert.strictEqual(this.events.length, 3);
        done();
      });

      this.stream.write('{ BROKEN\n{ "ONE": 1, "TWO": 2}\n{ "THREE": 3, "FOUR": 4 }\n');
      this.stream.end();
    });
  });
});
