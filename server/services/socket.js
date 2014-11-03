/*
 * Third-party dependencies
 */

var _ = require('lodash'),
    WebSocketServer = require('ws').Server;


/*
 * Internal dependencies
 */

var EventHub = require('./event-hub');


/*
 * Module definition
 */

var Socket = function(socket) {
  var _this = this;

  this._socket = socket;
  this._events = [];

  this.name = Socket.uniqueId('client_');

  this.send = function(data) {
    data = JSON.stringify(data);
    _this._socket.send(data);
  };

  this._socket.on('message', function(data) {
    _this._modifySubscriptions(data);
  });

  this._socket.on('close', function() {
    _this.destroy();
  });
};


/*
 * Instance methods
 */

Socket.prototype._modifySubscriptions = function(data) {
  data = JSON.parse(data);

  var handler = this.send,
    event = data.event;

  if(isSubscribing(data)) {
    this.on(event, handler);
  } else if(isUnsubscribing(data)) {
    this.removeListener(event, handler);
  } else {
    this.unknownEvent(handler);
  }

};

Socket.prototype.on = function(event, handler) {
  this._events.push(event);
  EventHub.on(event, handler);
};

Socket.prototype.removeListener = function(event, handler) {
  var i = this._events.indexOf(event);
  this._events.splice(i, 1);

  EventHub.removeListener(event, handler);
};

Socket.prototype.unknownEvent = function(handler) {
  handler({error: 'Incorrectly formatted message.'});
};

Socket.prototype.destroy = function() {
  this._removeListeners();
  Socket._removeSocket(this);
};

Socket.prototype._removeListeners = function() {
  var _this = this;

  _.each(this._events, function(event) {
    EventHub.removeListener(event, _this.send);
  });
};


/*
 * Class methods and properties
 */

Socket._socketServer = null;

// start ids at 1
Socket._nextId = 1;

Socket._sockets = {
  length: 0
};

Socket.init = function(server) {
  var _this = this;

  this._socketServer = new WebSocketServer({server: server});

  this._socketServer.on('connection', function(_socket) {
    var socket = new Socket(_socket);
    _this._addSocket(socket);
  });
};

Socket.uniqueId = function(prefix) {
  var name = prefix + this._nextId;
  this._nextId++;
  return name;
};

Socket._addSocket = function(socket) {
  Socket._sockets[socket.name] = socket;

  this._sockets.length++;
  this._logEvent('OPENED', socket.name);
};

Socket._removeSocket = function(socket) {
  delete Socket._sockets[socket.name];

  this._sockets.length--;
  this._logEvent('CLOSED', socket.name);
};

Socket._logEvent = function(event, client) {
  console.log(event + ' websocket connection: ' + client);
  console.log('Current sockets: ' + this._sockets.length);
};

Socket.broadcast = function(data) {
  var clients = this._socketServer.clients;

  _.each(clients, function(socket) {
    socket.send(data);
  });
};


/*
 * Helpers
 */

function isSubscribing(data) {
  return data.action === 'subscribe';
}

function isUnsubscribing(data) {
  return data.action === 'unsubscribe';
}

module.exports = Socket;
