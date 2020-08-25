# NdJsonFe
[![Build Status](https://travis-ci.org/markwylde/ndjson-fe.svg?branch=master)](https://travis-ci.org/markwylde/ndjson-fe)

This library allows you to parse NdJson from any stream, promise or event

```javascript
const ndJsonFe = require('ndJsonFe');
const feed = ndJsonFe();

stream.on('next', row => {
  console.log('The next row is: ', row);
});

stream.on('error', e => {
  console.log('There was an error: ', e);
});

stream.on('end', () => {
  console.log('The stream has finished');
});

stream.write(`{ "ONE": 1, "TWO": 2 }\n`);
stream.write(`{ "THREE": 1, `);
stream.write(`"FOUR": 4 }\n`);
stream.write(`{ "FIVE": 5, "SIX": 6 }\n{ "SEVEN": 7`);
stream.write(`, "EIGHT": 8 }`);
stream.write(`{ "BROKEN\n`);
stream.write(`{ "NINE": 9 }\n`);
stream.end();
```
