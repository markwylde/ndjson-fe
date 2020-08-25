# ndjson-fe
[![Build Status](https://travis-ci.org/markwylde/ndjson-fe.svg?branch=master)](https://travis-ci.org/markwylde/ndjson-fe)

This library takes a ndjson (Newline Delimited JSON) stream and outputs events containing each item when it receives a full JSON object.

## Why?
For example, if you have the following data coming from a stream:

```
{"a": 1}
{"b": 2}
{"c": 3}
```

The above data will emit three events when you listen to "next":
```javascript
feed.on('next', console.log)
 // {a: 1}
 // {b: 2}
 // {c: 3}
```

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
