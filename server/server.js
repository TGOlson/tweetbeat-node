/*
 * Third-party dependencies
 */

var http = require('http'),
    dotenv = require('dotenv').load();


/*
 * Internal dependencies
 */

var Twitter = require('./services/twitter'),
    Router = require('./services/router'),
    Socket = require('./services/socket'),
    EventHub = require('./services/event-hub'),
    TOPICS = require('./constants/topics');


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

server.listen(config.port);
console.log('Server listening on port ' + config.port);

Socket.init(server);

// only start twitter stream if app is started with STREAM=true
// too many stops and starts may cause temporary service stoppage
var stream = process.env.STREAM;

if(stream) Twitter
  .init('statuses/filter', {track: TOPICS})
  .onData(EventHub.emit.bind(EventHub));


/*
 * Route definitions and actions
 */

// defines directory to serve static assets from
Router.static('./public');

Router.on('GET', '/', '/index.html');

Router.on('GET', '/topics', function(req, res) {
  send(res, TOPICS);
});

Router.onUnknown(function(req, res) {
  res.writeHead(404);
  res.end('404 Page Not Found');
});

function send(res, data) {
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(data) + '\n');
}
