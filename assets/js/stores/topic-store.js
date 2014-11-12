/*
 * Third-party dependencies
 */

var _ = require('lodash');


/*
 * Internal dependencies
 */

var AppDispatcher = require('../dispatcher'),
    ActionTypes = require('../constants/action-types');


/*
 * Module definition
 */

var TopicStore = {},
    CHANGE_EVENT = 'change',
    _topics = [];

TopicStore._changeListeners = [];

TopicStore.init = function() {
  $.get('/topics', (topics) => {
    _topics = mapTopics(topics);
    this.emitChange();
  });
};

TopicStore.init();

function mapTopics(topics) {
  return _.map(topics, function(topic, i) {
    return {
      text: topic,
      isActive: false,
      count: 0
    };
  });
}

TopicStore.getAll = function() {
  return _topics;
};

TopicStore.select = function(_topic) {
  var topic = this.find(_topic);
  topic.isActive = true;
};

TopicStore.deselect = function(_topic) {
  var topic = this.find(_topic);
  topic.isActive = false;
};

TopicStore.incrementCount = function(_topic) {
  var topic = this.find(_topic);
  topic.count++;
};

TopicStore.find = function(topic) {
  return _.find(_topics, function(_topic) {
    return topic.text === _topic.text;
  });
};

TopicStore.emitChange = function() {
  _.each(this._changeListeners, (callback) => callback());
};

TopicStore.addChangeListener = function(callback) {
  this._changeListeners.push(callback);
};

TopicStore.removeChangeListener = function(callback) {
  _.remove(this._changeListeners, function(_callback) {
    return _callback === callback;
  });
};

// clean this up with switch statement or something else
AppDispatcher.register(function(payload) {
  var action = payload.action,
      type = action.type,
      hasChange;

  if(type === ActionTypes.TOPIC_SELECTED) {
    TopicStore.select(action.topic);
    hasChange = true;
  }

  if(type === ActionTypes.TOPIC_DESELECTED) {
    TopicStore.deselect(action.topic);
    hasChange = true;
  }

  if(type === ActionTypes.TWEET_RECEIVED) {

    // convert tweet to topic format
    // TODO: make a util for this
    TopicStore.incrementCount({text: action.tweet.topic});
    hasChange = true;
  }

  if(hasChange) {
    TopicStore.emitChange();
  }
});

module.exports = TopicStore;
