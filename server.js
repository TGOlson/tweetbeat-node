var http = require('http'),
  Twitter = require('./services/twitter');

require('dotenv').load();

var TOPICS = [
  'nodejs',
  'javascript',
  'ruby',
  'rails',
  'usa',
  'canada'
];

var config = {
  port: process.env.port || 8080
};


// var server = http.createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/plain'});

//   setInterval(function() {
//     res.write('Hello World\n');
//   }, 50);
// });

// server.listen(config.port);

Twitter.init().track(TOPICS, function(data) {
  // {topic: 'topic-name', text: 'tweet-text'}
  console.log(data);
});

// kill stream after 2 seconds
setTimeout(Twitter.destroyStream.bind(Twitter), 2000);


console.log('Server running on port ' + config.port + '.');
