/*
 * Socket Constructor
 */

var Socket = function() {
  var host = location.origin.replace('http', 'ws'),
    _this = this;

  // should fire callback when connected
  // or resolve a promise?
  this._socket = new WebSocket(host);

  // onmessage data handler
  this._setMessageHandler(function(data) {
    _this.emit(data.topic, data);
  });

  // other handlers
  this._setOpenHandler(function(event) {
    console.log('Opened', event);
  });

  this._setErrorHandler(function(event) {
    console.log('Error', event);
  });

  this._setCloseHandler(function(event) {
    console.log('Close', event);
  });

  // temporary for development
  window.socket = this;
};


/*
 * Instance properties
 */

Socket.prototype._events = {};


/*
 * Instance methods
 */

// socket.on sets an event handler for the specified event
// and also alerts the server to start sending those events
Socket.prototype.on = function(event, callback) {
  this._setHandler(event, callback);
  this._modifySubscriptions('subscribe', event);
};

// socket.removeListener removes an event handler for the specified event
// and also alerts the server to stop sending those events
Socket.prototype.removeListener = function(event, callback) {
  this._removeHandler(event);
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

Socket.prototype._setMessageHandler = function(handler) {
  this._socket.onmessage = function(event) {
    var data = JSON.parse(event.data);
    handler(data);
  };
};

// refactor these if they don't do anything extra besides setting callbacks
Socket.prototype._setOpenHandler = function(handler) {
  this._socket.onopen = handler;
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

  // for dev purposes only
  if(this._events[event]) console.log('Handler already set for', event);

  this._events[event] = handler;
};

// naive implementation of events
// each event can only have one listener
Socket.prototype._removeHandler = function(event) {

  // for dev purposes only
  if(!this._events[event]) console.log('No handler set for', event);

  delete this._events[event];
};

Socket.prototype._modifySubscriptions = function(action, event) {
  var message = {
    action: action,
    event: event
  };

  this.send(message);
};

// development only
// events should be an object of keywords with associated callbacks
// in the case of tweetbeat, the callbacks are calls to audio plays
Socket.prototype._viewEvents = function() {
  var events = this._events;

  // later this might want to map functions to their respective audio
  // so output looks like
  // {'USA': 'audio-file-name', etc.}

  console.log(events);
};

// CONNECTING  0 The connection is not yet open.
// OPEN  1 The connection is open and ready to communicate.
// CLOSING 2 The connection is in the process of closing.
// CLOSED  3 The connection is closed or couldn't be opened.
Socket.prototype._isOpen = function() {
  return this._socket.readyState === 1;
};
