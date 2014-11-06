/*
 * Internal dependencies
 */

var AppDispatcher = require('../dispatcher'),
    ActionTypes = require('../constants/action-types'),
    TweetActions = require('../actions/tweet-actions'),
    Socket = require('../services/socket');


/*
 * Module definition
 */

var TweetStore = {};

TweetStore.init = function() {
  this._socket = new Socket();
  this._handler = TweetActions.newTweet;
};

TweetStore.subscribe = function(topic) {
  this._socket.on(topic.text, this._handler);
};

TweetStore.unsubscribe = function(topic) {
  this._socket.removeListener(topic.text);
};

// clean this up with switch statement or something else
AppDispatcher.register(function(payload) {
  var action = payload.action,
      type = action.type;

  if(type === ActionTypes.TOPIC_SELECTED) {
    TweetStore.subscribe(action.topic);
    hasChange = true;
  }

  if(type === ActionTypes.TOPIC_DESELECTED) {
    TweetStore.unsubscribe(action.topic);
    hasChange = true;
  }

  if(type === ActionTypes.TWEET_RECEIVED) {
    console.log(action.tweet);
  }

  // TweetStore does not have any view components
  // therefore it does not emit change events
  // TweetStore.emitChange();
});

module.exports = TweetStore;
