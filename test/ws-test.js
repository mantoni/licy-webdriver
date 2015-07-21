/*global describe, it, beforeEach, afterEach*/
'use strict';

var assert = require('assert');
var sinon = require('sinon');
var licy = require('licy');
var websocket = require('websocket');
var WebSocket = require('../lib/ws').WebSocket;


describe('create', function () {
  var url = 'ws://localhost:1337';
  var socket;

  beforeEach(function () {
    socket = {
      send: sinon.spy(),
      close: sinon.spy()
    };
    sinon.stub(websocket, 'w3cwebsocket').returns(socket);
  });

  afterEach(function () {
    websocket.w3cwebsocket.restore();
  });

  it('creates a websocket with the given url and protocol', function () {
    var ws = new WebSocket(url, 'fancy');

    assert(typeof ws, 'object');
    sinon.assert.calledOnce(websocket.w3cwebsocket);
    sinon.assert.calledWith(websocket.w3cwebsocket, url, 'fancy');
  });

  it('invokes callback on open', function () {
    var cb = sinon.spy();
    var ws = new WebSocket(url, null, cb);

    socket.onopen();

    sinon.assert.calledOnce(cb);
    assert(ws);
  });

  it('invokes callback on open if given as second arg', function () {
    var cb = sinon.spy();
    var ws = new WebSocket(url, cb);

    socket.onopen();

    sinon.assert.calledOnce(cb);
    assert(ws);
  });

  it('invokes callback with error on error', function () {
    var cb = sinon.spy();
    var ws = new WebSocket(url, null, cb);
    var spy = sinon.spy();
    ws.on('error', spy);

    socket.onerror();

    sinon.assert.calledOnce(cb);
    sinon.assert.calledWith(cb, sinon.match.instanceOf(Error));
    sinon.assert.notCalled(spy);
  });

  function openWebSocket() {
    var ws = new WebSocket(url);
    socket.onopen();
    return ws;
  }

  it('forwards websocket close event', function () {
    var ws = openWebSocket();
    var spy = sinon.spy();

    ws.on('close', spy);
    socket.onclose({ code : 1000 });

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, { code : 1000 });
    sinon.assert.notCalled(socket.close);
  });

  it('forwards websocket error event', function () {
    var ws = openWebSocket();
    var spy = sinon.spy();

    ws.on('error', spy);
    socket.onerror();

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, sinon.match.instanceOf(Error));
  });

  it('forwards websocket message event', function () {
    var ws = openWebSocket();
    var spy = sinon.spy();

    ws.on('message', spy);
    socket.onmessage({ data : 'Oh, hi!' });

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, { data : 'Oh, hi!' });
  });

  it('sends message', function () {
    var ws = openWebSocket();

    ws.send('Oh, hi!');

    sinon.assert.calledOnce(socket.send);
    sinon.assert.calledWith(socket.send, 'Oh, hi!');
  });

  it('closes websocket', function () {
    var ws = openWebSocket();

    ws.close(1000, 'okay');

    sinon.assert.calledOnce(socket.close);
    sinon.assert.calledWith(socket.close, 1000, 'okay');
  });

  it('defaults close message to null', function () {
    var ws = openWebSocket();

    ws.close(1000);

    sinon.assert.calledOnce(socket.close);
    sinon.assert.calledWith(socket.close, 1000, null);
  });

  it('defaults close code to 1000', function () {
    var ws = openWebSocket();

    ws.close();

    sinon.assert.calledOnce(socket.close);
    sinon.assert.calledWith(socket.close, 1000, null);
  });

  it('removes onclose handler when closing', function () {
    var ws = openWebSocket();
    var spy = sinon.spy();
    ws.on('close', spy);

    ws.close(1000, 'okay');

    assert.strictEqual(socket.onclose, undefined);
  });

  it('closes websocket on destroy', function () {
    var ws = openWebSocket();

    ws.destroy();

    sinon.assert.calledOnce(socket.close);
    sinon.assert.calledWith(socket.close, 1000, null);
  });

});
