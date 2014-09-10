var EventEmitter = require('events').EventEmitter,
  util = require('util');

var EventHub = function() {};

util.inherits(EventHub, EventEmitter);

// export singleton instance of EventHub
module.exports = new EventHub();
