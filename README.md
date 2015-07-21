# licy-websocket.js

[![Build Status]](https://travis-ci.org/mantoni/licy-websocket.js)
[![SemVer]](http://semver.org)
[![License]](https://github.com/mantoni/licy-websocket.js/blob/master/LICENSE)

[Licy][] wrapper for a WebSocket based on the [websocket module][].

## Features

- Async creation: Function calls are automatically deferred until constructor
  invokes callback
- All function calls are observable and can be intercepted
- Create hierarchies of instances that get destroyed together

## Usage

```js
var WebSocket = require('licy-websocket').WebSocket;

var ws = new WebSocket('ws://localhost:1337', function () {
  console.log('ws connection established');
});
ws.on('message', function (event) {
  console.log('ws message: ' + event.data);
});
ws.on('close', function () {
  console.log('ws closed');
});
```

## Install with npm

    npm install licy-websocket --save

## Browser support

Use [Browserify][] to create a standalone file. The test suite passes on IE 10,
11, Chrome \*, Filefox \* and PhantomJS.

## API

- `var ws = new WebSocket(url[, protocols][, callback])`: Creates a new W3C
  websocket and connect to the given URL. If `protocols` are specified, they
  are passed to the underlying implementation. If a callback is given, it is
  invoked with `null` once the connection was established successfully. If the
  connection cannot be established, the callback is invoked with an `Error` as
  the first argument.
- `ws.send(data)`: Send data on the websocket.
- `ws.close([code][, reason])`: Close the websocket with an optional code and
  reason. The `code` defaults to 1000 and `reason` defaults to null.
- `ws.destroy()`: Calls `close()`.

## Events

- `message`: When a message was received. The only argument is the websocket
  `event` which has a `data` property.
- `close`: When the websocket was closed. The only argument is the websocket
  `event` which has a `code` and a `reason` property.
- `error`: When an error was received.

## Development

- `npm install` to install the dev dependencies
- `npm test` to lint, run tests on Node and PhantomJS and check code coverage

## License

MIT

[Build Status]: http://img.shields.io/travis/mantoni/licy-websocket.js.svg
[SemVer]: http://img.shields.io/:semver-%E2%9C%93-brightgreen.svg
[License]: http://img.shields.io/npm/l/licy-websocket.svg
[Browserify]: http://browserify.org
[Licy]: http://github.com/mantoni/licy.js
[websocket module]: https://www.npmjs.com/package/websocket
