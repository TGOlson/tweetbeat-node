// Third party libraries
var _ = require('lodash');

var Observer = {
  events: {}
};

Observer.register = function(event, callback) {
  if(!this.eventExists(event)) {
    this._registerEvent(event);
  }

  this.events[event].push(callback);
};

Observer.eventExists = function(event) {

  // empty strings or any falsey values are not allowed as event names
  return !!this.events[event];
};

Observer._registerEvent =  function(event) {
  if(!event) throw new Error('Illegal event name.');

  if(this.eventExists(event)) throw new Error('Event already registered.');

  this.events[event] = [];
};

Observer.notify = function(event, data) {
  var eventCallbacks = this.events[event];

  // helpful for development
  if(process.env.DEBUG) this._logEvent(event);

  _.each(eventCallbacks, function(callback) {
    callback(data);
  });
};

Observer._logEvent = function(event) {
  var eventCallbacks = this.events[event],
    subscriberCount = eventCallbacks ? eventCallbacks.length : 0;

  console.log('Event: ' + event + ' - Subscribers: ' + subscriberCount);
};

module.exports = Observer;
