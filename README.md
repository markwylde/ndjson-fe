# NdJsonFe
This library allows you to parse NdJson from any stream, promise or event

```javascript
stream.on('next', row => {
	console.log('The next row is: ', row)
})

stream.on('error', e => {
	console.log('There was an error: ', e)
})

stream.on('end', () => {
	console.log('The stream has finished')
})


stream.emit('write', `{ "ONE": 1, "TWO": 2 }\n`)
stream.emit('write', `{ "THREE": 1, `)
stream.emit('write', `"FOUR": 4 }\n`)
stream.emit('write', `{ "FIVE": 5, "SIX": 6 }\n{ "SEVEN": 7`)
stream.emit('write', `, "EIGHT": 8 }`)
stream.emit('write', `{ "BROKEN\n`)
stream.emit('write', `{ "NINE": 9 }\n`)
stream.emit('end')
```