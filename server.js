// Third party libraries
var http = require('http'),
  dotenv = require('dotenv').load(),
  _ = require('lodash');

// Internal modules
var Twitter = require('./services/twitter'),
  Router = require('./services/router'),
  Topic = require('./models/topic'),
  Observer = require('./services/observer');


/*
 * Configuration settings
 */

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = {
  port: process.env.port || 8080
};


/*
 * Bootstrap server
 */

http.createServer(function(req, res) {

  res.writeHead(200, {'Content-Type': 'application/json'});

  res.send = function(data, err, keepAlive) {
    var response = formatResponse(data, err);

    res.write(response);

    if(!keepAlive) res.end();
  };

  // forward requests to router
  Router.route(req, res);

}).listen(config.port);

console.log('Server listening on port ' + config.port + '.');


// only start twitter stream if app is started with STREAM=true
// too many stops and starts may cause temporary service stoppage
// this could also be handled when requests to /stream are made
if(process.env.STREAM) {
  var topics = Topic.all;

  Twitter.init()
    .stream('statuses/filter', {track: topics})
    .onData(function(data) {
      var response = parseTweetTopic(data.text, topics);

      // notify observers - later this should use sockets
      // consider notifying on a topic-by-topic basis
      if(response.topic) {
        Observer.notify('tweet', response);
      }
    });
}


/*
 * Route definitions and actions
 */

Router.on('GET', '/', function(req, res) {
  res.send('You are in the index, that is cool.');
});

Router.on('GET', '/stream', function(req, res) {

  // TODO: parse req.query and subscribe client to topics

  Observer.register('tweet', function(data) {
    // data => {topic: 'topic-name', text: 'tweet-text'}

    // console.log(data);

    res.send(data, null, true);
  });

});

Router.on('GET', '/topics', function(req, res) {
  res.send(Topic.all);
});

Router.onUnknown(function unknown(req, res) {
  res.send(null, 'Unknown Request');
});


/*
 * Helpers
 */

function parseTweetTopic(text, topics) {
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

function formatResponse(data, err) {
  var response = {};

  if(data) {
    response.data = data;
  }

  if(err) {
    response.error = err;
  }

  return JSON.stringify(response) + '\n';
}
