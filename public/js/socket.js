/*
 * Socket Constructor
 */

var Socket = function() {
  var host = location.origin.replace('http', 'ws');
    _this = this;

  // should fire callback when connected
  this._socket = new WebSocket(host);

  this._setMessageHandler(function(data) {
    _this.emit(data.topic, data);
  });
};

Socket.prototype._events = {};

Socket.prototype._setMessageHandler = function(handler) {
  this._socket.onmessage = function(event) {
    var data = JSON.parse(event.data);
    handler(data);
  };
};

Socket.prototype.subscribe = function(event, callback) {
  this.on(event, callback);
  this._modifySubscriptions('subscribe', event);
};

Socket.prototype.unsubscribe = function(event, callback) {
  this.removeListener(event);
  this._modifySubscriptions('unsubscribe', event);
};

Socket.prototype._modifySubscriptions = function(action, event) {
  var message = formatMessage(action, event);
  this.send(message);
};

Socket.prototype.send = function(data) {
  data = JSON.stringify(data);
  this._socket.send(data);
};

Socket.prototype.emit = function(event, data) {
  var handler = this._events[event];  
  if(handler) handler(data);
};

// naive implementation of events
// each event can only have one listener
Socket.prototype.on = function(event, handler) {
  this._events[event] = handler;
};

// each event can only have one listener, so no need to remove based on handlers
Socket.prototype.removeListener = function(event) {
  this._events[event] = null;
};

function formatMessage(action, event) {
  return {
    action: action,
    event: event
  };
}
