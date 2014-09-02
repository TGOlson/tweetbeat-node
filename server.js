var http = require('http'),
  dotenv = require('dotenv');
  twitter = require('twitter');

dotenv.load();

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

var twit = new twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

var server = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});

  setInterval(function() {
    res.write('Hello World\n');
  }, 50);
});

twit.stream('statuses/filter', {track: TOPICS}, function(stream) {

  stream.on('data', function(data) {
    var text = data.text;

    for (var i = 0; i < TOPICS.length; i++) {
      var topic = TOPICS[i];

      if(text.toLowerCase().match(topic)) {
        console.log(topic.toUpperCase() + ': ' + text);
      }
    }

  });

  // Disconnect stream after five seconds
  setTimeout(stream.destroy, 5000);
});

server.listen(config.port);

console.log('Server running on port ' + config.port + '.');
