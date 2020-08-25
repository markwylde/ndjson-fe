# NdJsonFe
[![Build Status](https://travis-ci.org/markwylde/ndjson-fe.svg?branch=master)](https://travis-ci.org/markwylde/ndjson-fe)

This library allows you to parse NdJson from any stream, promise or event

## Piping
```javascript
const fs = require('fs');
const ndJsonFe = require('ndJsonFe');
const feed = ndJsonFe();

feed.on('next', row => {
  console.log('The next row is: ', row);
});

feed.on('error', e => {
  console.log('There was an error: ', e);
});

feed.on('end', () => {
  console.log('The stream has finished');
});

const reader = fs.createReadStream('./test.json');
reader.pipe(feed)
```

## Manual
```javascript
const ndJsonFe = require('ndJsonFe');
const feed = ndJsonFe();

feed.on('next', row => {
  console.log('The next row is: ', row);
});

feed.on('error', e => {
  console.log('There was an error: ', e);
});

feed.on('end', () => {
  console.log('The stream has finished');
});

feed.write(`{ "ONE": 1, "TWO": 2 }\n`);
feed.write(`{ "THREE": 1, `);
feed.write(`"FOUR": 4 }\n`);
feed.write(`{ "FIVE": 5, "SIX": 6 }\n{ "SEVEN": 7`);
feed.write(`, "EIGHT": 8 }`);
feed.write(`{ "BROKEN\n`);
feed.write(`{ "NINE": 9 }\n`);
feed.end();
```
