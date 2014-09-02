var http = require('http'),
  net = require('net'),
  twitter = require('twitter');

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
    consumer_key: 'P1YfOZUJ7CN1KvTsbeB1MWUyp',
    consumer_secret: 'oCJnEW1QeOE4U7z9xWlSN7cW7D6szus6BaLyHpTdzr1jXKeDRJ',
    access_token_key: '316057830-XPhMevXI8mpZAhrXdLbpKaoEZINUY7iBHwRk3c7J',
    access_token_secret: '10pNil56iFX21zFhcg5KnE99i2qXCq1Qpksy4lqYPtkFB'
  });

var server = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});

  setInterval(function() {
    res.write('Hello World\n');
  }, 50);
});

// var server = net.createServer(function (socket) {
//   socket.write('Echo server\r\n');
//   socket.pipe(socket);
// });

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
