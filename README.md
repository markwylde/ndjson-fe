# ndjson-fe
![Node.js Test Runner](https://github.com/markwylde/ndjson-fe/workflows/Node.js%20Test%20Runner/badge.svg)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/markwylde/ndjson-fe)
[![GitHub package.json version](https://img.shields.io/github/package-json/v/markwylde/ndjson-fe)](https://github.com/markwylde/ndjson-fe/releases)
[![GitHub](https://img.shields.io/github/license/markwylde/ndjson-fe)](https://github.com/markwylde/ndjson-fe/blob/master/LICENSE)

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
const ndJsonFe = require('ndjson-fe');
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
const ndJsonFe = require('ndjson-fe');
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
