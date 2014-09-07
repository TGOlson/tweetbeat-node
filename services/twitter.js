// Third party libraries
var TwitterClient = require('twitter'),
  _ = require('lodash');

var Twitter = {
  _client: null,
  _stream: null
};

Twitter.init = function() {
  if(this._client) throw new Error('Twitter client already initialized.');

  this._client = new TwitterClient({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  });

  return this;
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

  this._stream.on('data', function(data) {
    callback(data);
  });

  return this;
};

Twitter.destroyStream = function() {
  if(!this._stream) throw new Error('Twitter stream not initialized.');

  this._stream.destroy();
  this._stream = null;
};

// takes in a tweet objects and a list of possible topics it could match
// returns a json formatted response => {topic: ..., text: ...}
Twitter.formatData = function(data, topics) {
  var text = data.text;

  var response = {
    topic: null,
    text: text
  };

  _.each(topics, function(topic) {
    if (_.contains(text.toLowerCase(), topic)) {
      response.topic = topic;
    }
  });

  return JSON.stringify(response) + '\n';
};

module.exports = Twitter;
