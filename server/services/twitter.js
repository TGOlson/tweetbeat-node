/*
 * Third-party dependencies
 */

var TwitterClient = require('twitter'),
    _ = require('lodash');


/*
 * Module definition
 */

var Twitter = {
  _trackingData: null,
  _client: null,
  _stream: null
};

Twitter.init = function(type, options) {
  if(this._client) throw new Error('Twitter client already initialized.');

  this._trackingData = options.track;

  this._client = new TwitterClient({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  });

  return this.stream(type, options);
};

Twitter.stream = function(type, options) {
  if(this._stream) throw new Error('Twitter stream already initialized.');

  var _this = this;

  this._client.stream(type, options, function(stream) {
    _this._stream = stream;
  });

  return this;
};


Twitter.onData = function(callback) {
  if(!this._stream) throw new Error('Twitter stream not initialized.');

  var _this = this;

  this._stream.on('data', function(data) {
    var tweetData = _this.formatData(data);

    // only invoke callback if a topic can be parsed from the tweet
    if(tweetData.topic) callback(tweetData.topic, tweetData);
  });
};

Twitter.destroyStream = function() {
  if(!this._stream) throw new Error('Twitter stream not initialized.');

  this._stream.destroy();
  this._stream = null;
};

// takes in a tweet objects and a list of possible topics it could match
// returns a formatted response => {topic: ..., text: ...}
Twitter.formatData = function(data) {
  var topics = this._trackingData,
    text = data.text;

  var response = {
    topic: null,
    text: text
  };

  _.each(topics, function(topic) {
    if (_.contains(text.toLowerCase(), topic.toLowerCase())) {
      response.topic = topic;
    }
  });

  return response;
};

module.exports = Twitter;
