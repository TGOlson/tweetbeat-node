var TwitterClient = require('twitter'),
  _ = require('lodash');

var Twitter = {
  client: null,
  stream: null
};

Twitter.init = function() {
  this.client = new TwitterClient({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  });

  return this;
};

Twitter.startStream = function(type, options, callback) {
  var _this = this;

  this.client.stream(type, options, function(stream) {
    _this.stream = stream;
    callback(stream);
  });

  return this;
};

Twitter.track = function(topics, callback) {
  this.startStream('statuses/filter', {track: topics}, function(stream) {

    stream.on('data', function(data) {
      var response = formatResponse(topics, data.text);
      callback(response);
    });
  });

  return this;
};

Twitter.destroyStream = function() {
  if(!this.stream) throw new Error('Stream not initialized.');
  this.stream.destroy();
};

function formatResponse(topics, text) {
  var response = {
    topic: null,
    text: text
  };

  _.each(topics, function(topic) {
    if (_.contains(text.toLowerCase(), topic)) {
      response.topic = topic;
    }
  });

  return response;
}

module.exports = Twitter;
