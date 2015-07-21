'use strict';

var licy = require('licy');
var websocket = require('websocket');


exports.WebSocket = licy.define(function (url, protocols, callback) {
  var ws = websocket.w3cwebsocket(url, protocols);
  var self = this;
  ws.onopen = function () {
    callback();
    callback = null;
  };
  ws.onclose = function (event) {
    self.emit('close', event);
  };
  ws.onmessage = function (event) {
    self.emit('message', event);
  };
  ws.onerror = function () {
    if (callback) {
      callback(new Error('Failed to open websocket for ' + url));
      callback = null;
    } else {
      self.emit('error', new Error());
    }
  };
  return {
    send: function (data) {
      ws.send(data);
    },
    close: function (code, reason) {
      delete ws.onclose;
      ws.close(code || 1000, reason || null);
    },
    destroy: function () {
      this.close();
    }
  };
});
