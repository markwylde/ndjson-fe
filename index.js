const EventEmitter = require('events');

function ndJsonFe () {
  const myEmitter = new EventEmitter();
  let buffer = '';

  myEmitter.on('write', str => {
    const lines = (buffer + str).split('\n');

    lines.forEach((row, index) => {
      if (row === '') return;

      try {
        const parsed = JSON.parse(row);
        myEmitter.emit('next', parsed);
        buffer = '';
      } catch (error) {
        if (index === lines.length - 1) {
          buffer = row;
        } else {
          myEmitter.emit('error', `Invalid JSON received:\n${row}\n`);
        }
      }
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
