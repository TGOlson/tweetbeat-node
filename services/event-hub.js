var EventEmitter = require('events').EventEmitter,
  util = require('util');

var EventHub = function() {};

util.inherits(EventHub, EventEmitter);

EventHub.prototype.broadcast = function(event, data) {
  this.emit(event, data);
};

// exports singleton instance of EventHub
module.exports = new EventHub();
