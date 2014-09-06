// Third party libraries
var http = require('http'),
  dotenv = require('dotenv');

dotenv.load();

// Internal modules
var Twitter = require('./services/twitter').init(),
  Router = require('./services/router'),
  Topic = require('./models/topic');


/*
 * Configuration settings
 */

var config = {
  port: process.env.port || 8080
};


/*
 * Bootstrap server
 */

// load environment variables

// set default request behavior
function onRequest(req, res) {
  console.log('Request recieved: ', req.url, req.params);
  console.log('Forwarding request to router.');

  Router.forward(req, res);
}

// create server
var server = http.createServer(onRequest);

// listen to current port
server.listen(config.port);

// notify
console.log('Server listening on port ' + config.port + '.');

// only start stream if app is started with STREAM=true
// too many stops and starts may cause temporary service stoppage
// this could also be handled when requests to /stream are made (in Twitter.track)
if(process.env.STREAM) {
  Twitter.startStream('statuses/filter', {track: Topic.all});
}


/*
 * Route definitions
 */

Router
  .get('/', index)
  .get('/stream', stream)
  .get('/topics', topics)
  .onUnknown(unknown);


/*
 * Actions
 */

 function index(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write('You are in the index, that is cool.');
  res.write('\n');
  res.end();
 }

function stream(req, res) {
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
}

function topics(req, res) {
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.write(JSON.stringify(Topic.all));
  res.write('\n');
  res.end();
}

function unknown(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write('Unknown request path.');
  res.write('\n');
  res.end();
}
