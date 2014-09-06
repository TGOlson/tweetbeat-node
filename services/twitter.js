// Third party libraries
var TwitterClient = require('twitter'),
  _ = require('lodash');

var Twitter = {
  client: null,
  stream: null,
  callbacks: []
};

Twitter.init = function() {
  if(this.client) throw new Error('Twitter client already initialized.');

  this.client = new TwitterClient({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  });

  return this;
};

Twitter.startStream = function(type, options, callback) {
  if(this.stream) throw new Error('Twitter stream already initialized.');

  var _this = this;

  this.client.stream(type, options, function(stream) {
    _this.stream = stream;
    if(callback) callback(stream);
  });

  return this;
};

Twitter.track = function(topics, callback) {
  if(!this.stream) throw new Error('Twitter stream not initialized.');

  this.stream.on('data', function(data) {
    console.log('tracking', topics);

    var response = formatResponse(topics, data.text);

    // invoke callback if tweet contains topic client is looking for
    if(response.topic) callback(response);
  });

  return this;
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

Twitter.destroyStream = function() {
  if(!this.stream) throw new Error('Stream not initialized.');
  this.stream.destroy();
};


module.exports = Twitter;
