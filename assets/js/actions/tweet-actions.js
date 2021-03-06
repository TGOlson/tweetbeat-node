/*
 * Internal dependencies
 */

var AppDispatcher = require('../dispatcher'),
    ActionTypes = require('../constants/action-types');


/*
 * Module definition
 */

var TweetActions = {
  newTweet(tweet) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.TWEET_RECEIVED,
      tweet: tweet
    });
  }
};

module.exports = TweetActions;
