// Third party libraries
var http = require('http'),
  dotenv = require('dotenv').load();

// Internal modules
var Twitter = require('./services/twitter'),
  Router = require('./services/router'),
  Socket = require('./services/socket');

// topic list for tracking tweets
// use shorter list for development
// this needs to match list in tweets_controller
var TOPICS = [
  // "Coffee",
  // "Tea",
  // "DBCsleeps",
  "Canada",
  "USA",
  // "California",
  "Tesla",
  // "Spring",
  // "Summer",
  // "Autumn",
  // "Winter",
  // "Santa",
  // "Snowman",
  "Moltar",
  // "Hurricane",
  // "Tornado",
  // "Earthquake",
  // "Tsunami",
  // "Blizzard",
  // "Godzilla",
  "King Kong",
  // "John Lennon",
  // "Voltar",
  // "Tapioca",
  // "Star Wars",
  // "Xolov"
];


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

var server = http.createServer(Router.route.bind(Router));

Socket.init(server);

server.listen(config.port);
console.log('Server listening on port ' + config.port);

// only start twitter stream if app is started with STREAM=true
// too many stops and starts may cause temporary service stoppage
// this could also be handled when socket connections are made
if(process.env.STREAM) {
  Twitter.init()
    .stream('statuses/filter', {track: TOPICS})
    .onData(function(data) {
      var tweetData = Twitter.formatData(data, TOPICS);


      // should check to see if topic is defined before broadcasting
      // this could also be handled be only broadcasting to subscribed parties
      Socket.broadcast(tweetData);
    });
}


/*
 * Route definitions and actions
 */

// defines directory to serve static assets from
// does not yet recursively dig through directory
Router.static('./public');

Router.on('GET', '/', '/index.html');

Router.on('GET', '/topics', function(req, res) {
  send(TOPICS, res);
});

Router.onUnknown(function(req, res) {
  res.writeHead(404);
  res.end('404 Page Not Found');
});

function send(data, res) {
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(data) + '\n');
}
