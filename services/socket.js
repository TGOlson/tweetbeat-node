// Third party libraries
var _ = require('lodash');

var Socket = {

  // hash of current sockets
  // key = name = socket.remoteAddress:socket.remotePort
  // value = socket
  _sockets: {},

  // mainly used for logging
  _socketCount: 0
};


// consider moving to instance based sockets
// this would decorate the default sockets
// var socket = new Socket(req.socket);


Socket.add = function(socket) {
  socket.name = this._buildName(socket);

  this._sockets[socket.name] = socket;
  this._socketCount++;

  console.log('Connected: ' + socket.name);
  console.log('Current sockets: ' + this._socketCount);
};

Socket._buildName = function(socket) {
  return socket.remoteAddress + ':' + socket.remotePort;
};

Socket.remove = function(socket) {
  delete this._sockets[socket.name];
  this._socketCount--;

  console.log('Closed: ' + socket.name);
  console.log('Current sockets: ' + this._socketCount);
};

Socket.broadcast = function(callback) {
  _.each(this._sockets, function(socket, name) {
    callback(socket);
  });
};

module.exports = Socket;
