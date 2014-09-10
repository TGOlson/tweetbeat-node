// Third party libraries
var _ = require('lodash'),
  WebSocketServer = require('ws').Server;

// Internal modules
var EventHub = require('./event-hub');


/*
 * Socket Constructor
 */

var Socket = function(socket) {
  var _this = this;

  this._events = [];
  this._socket = socket;

  this.name = Socket.makeName();

  this.send = function(data) {
    data = JSON.stringify(data);
    _this._socket.send(data);
  };

  socket.on('message', function(data) {
    _this.modifySubscriptions(data);
  });

  socket.on('close', function() {
    _this.destroy();
  });
};


/*
 * Instance methods
 */

Socket.prototype.modifySubscriptions = function(data) {
  data = JSON.parse(data);

  var event = data.event;

  if(isSubscribing(data)) {
    this.subscribe(event);
  } else if(isUnsubscribing(data)) {
    this.unsubscribe(event);
  } else {
    callback({error: 'Incorrectly formatted message.'});
  }

};

Socket.prototype.subscribe = function(event) {
  this._events.push(event);
  EventHub.on(event, this.send);
};

Socket.prototype.unsubscribe = function(event) {
  var i = this._events.indexOf(event);
  this._events.splice(i, 1);

  EventHub.removeListener(event, this.send);
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
Socket._nextId = 0;

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

Socket.makeName = function() {
  var name = 'client-' + this._nextId;
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
