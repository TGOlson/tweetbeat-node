// Third party libraries
var _ = require('lodash'),
  WebSocketServer = require('ws').Server;


var Socket = {
  _socketServer: null,

  // mainly used for logging
  _socketCount: 0
};

Socket.init = function(server) {
  this._socketServer = new WebSocketServer({server: server});
  this._setListeners(this._socketServer);
};

Socket._setListeners = function(socketServer) {
  var _this = this;

  this._socketServer.on("connection", function(socket) {
    _this._addSocket();

    socket.on("close", function() {
      _this._removeSocket();
    });
  });
};

// add and remove does not do anything functional - they just log data
Socket._addSocket = function() {
  this._socketCount++;
  console.log("Websocket connection opened");
  console.log('Current sockets: ' + this._socketCount);
};

Socket._removeSocket = function() {
  this._socketCount--;
  console.log("Websocket connection closed");
  console.log('Current sockets: ' + this._socketCount);
};

Socket.broadcast = function(data) {
  var clients = this._socketServer.clients;

  _.each(clients, function(socket) {
    socket.send(data);
  });
};

module.exports = Socket;
