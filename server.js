// Third party libraries
var http = require('http'),
  dotenv = require('dotenv').load();

// Internal modules
var Twitter = require('./services/twitter').init(),
  Router = require('./services/router'),
  Topic = require('./models/topic');


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

// create server with middle-ware
var server = http.createServer(function(req, res) {

  res.send = function(data, err) {
    var response = formatResponse(data, err);

    // assume all responses are JSON
    res.writeHead(200, {'Content-Type': 'application/json'});

    res.write(response);
    res.end();
  };

  // forward requests to router
  Router.route(req, res);
});

// listen to current port
server.listen(config.port);

console.log('Server listening on port ' + config.port + '.');

// only start stream if app is started with STREAM=true
// too many stops and starts may cause temporary service stoppage
// this could also be handled when requests to /stream are made (in Twitter.track)
if(process.env.STREAM) {
  Twitter.startStream('statuses/filter', {track: Topic.all});
}


/*
 * Route definitions and actions
 */

Router.on('GET', '/', function(req, res) {
  res.send('You are in the index, that is cool.');
});

Router.on('GET', '/stream', function(req, res) {
  var topics = req.query.topics;

  if(topics) {
    topics = topics.split(',');
  } else {
    topics = Topic.all;
  }

  res.writeHead(200, {'Content-Type': 'application/json'});

  Twitter.track(topics, function(data) {
    // {topic: 'topic-name', text: 'tweet-text'}
    // console.log(data);
    res.write(JSON.stringify(data));
    res.write('\n');
  });

  // kill stream after 2 seconds
  // setTimeout(Twitter.destroyStream.bind(Twitter), 2000);
  // setInterval(function() {
  //   res.end();
  // }, 5000);
  // res.end();
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
