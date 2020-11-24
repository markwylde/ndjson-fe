const EventEmitter = require('events');

function ndJsonFe () {
  const myEmitter = new EventEmitter();
  let buffer = '';

  myEmitter.on('write', str => {
    const lines = (buffer + str).split('\n');

    lines.forEach((row, index) => {
      if (row === '') return;

      let parsed;
      try {
        parsed = JSON.parse(row);
      } catch (error) {
        if (index === lines.length - 1) {
          buffer = row;
        } else {
          myEmitter.emit('error', `Invalid JSON received:\n${row}\n`);
        }
        return;
      }

      myEmitter.emit('next', parsed);
      buffer = '';
    });
  });

  return Object.assign(
    myEmitter,
    {
      write: data => myEmitter.emit('write', data),
      end: data => myEmitter.emit('end')
    }
  );
}

module.exports = ndJsonFe;
