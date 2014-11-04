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
  return _.map(topics, function(topic) {
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

TopicStore.selectTopic = function(topic) {
  this.setTopicActiveState(topic, true);
};

TopicStore.deselectTopic = function(topic) {
  this.setTopicActiveState(topic, false);
};

TopicStore.setTopicActiveState = function(topic, isActive) {
  var _topic = _.find(_topics, function(_topic) {
    return topic.text === _topic.text;
  });

  // temp for debugging
  _topic.count++;

  _topic.isActive = isActive;
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
      topic = action.topic,
      hasChange;

  if(type === ActionTypes.TOPIC_SELECTED) {
    TopicStore.selectTopic(topic);
    hasChange = true;
  }

  if(type === ActionTypes.TOPIC_DESELECTED) {
    TopicStore.deselectTopic(topic);
    hasChange = true;
  }

  if(hasChange) {
    TopicStore.emitChange();
  }
});

module.exports = TopicStore;
