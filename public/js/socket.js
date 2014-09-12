/*
 * Socket Constructor
 */

var Socket = function() {
  var host = location.origin.replace('http', 'ws');
    _this = this;

  // should fire callback when connected
  this._socket = new WebSocket(host);

  this._setOpenHandler(function(event) {
    console.log('Opened', event);
  });

  this._setMessageHandler(function(data) {
    _this.emit(data.topic, data);
  });

  this._setErrorHandler(function(event) {
    console.log('Error', event);
  });

  this._setCloseHandler(function(event) {
    console.log('Close', event);
  });
};


/*
 * Instance properties
 */

Socket.prototype._events = {};


/*
 * Instance methods
 */

Socket.prototype.on = function(event, callback) {
  this._setHandler(event, callback);
  this._modifySubscriptions('subscribe', event);
};

Socket.prototype.removeListener = function(event, callback) {
  this._unsetHandler(event);
  this._modifySubscriptions('unsubscribe', event);
};

Socket.prototype.send = function(data) {
  data = JSON.stringify(data);

  if(this._isOpen()) {
    this._socket.send(data);
  } else {
    console.log('Socket connection is closed. Try refreshing client or reconnecting.');
  }
};

Socket.prototype.emit = function(event, data) {
  var handler = this._events[event];
  if(handler) handler(data);
};


/*
 * Private instance methods
 */

Socket.prototype._setOpenHandler = function(handler) {
  this._socket.onopen = handler;
};

Socket.prototype._setMessageHandler = function(handler) {
  this._socket.onmessage = function(event) {
    var data = JSON.parse(event.data);
    handler(data);
  };
};

Socket.prototype._setErrorHandler = function(handler) {
  this._socket.onerror = handler;
};

Socket.prototype._setCloseHandler = function(handler) {
  this._socket.onclose = handler;
};

// naive implementation of events
// each event can only have one listener
Socket.prototype._setHandler = function(event, handler) {
  this._events[event] = handler;
};

// naive implementation of events
// each event can only have one listener
Socket.prototype._unsetHandler = function(event) {
  this._events[event] = null;
};

Socket.prototype._modifySubscriptions = function(action, event) {
  var message = {
    action: action,
    event: event
  };

  this.send(message);
};

// CONNECTING  0 The connection is not yet open.
// OPEN  1 The connection is open and ready to communicate.
// CLOSING 2 The connection is in the process of closing.
// CLOSED  3 The connection is closed or couldn't be opened.
Socket.prototype._isOpen = function() {
  return this._socket.readyState === 1;
};
