$(function() {

  console.log('Hi there');

  var host = location.origin.replace('http', 'ws'),
    socket = new WebSocket(host);


  setTimeout(function() {
    socket.send(JSON.stringify({action: 'subscribe', event: 'USA'}));
  }, 500);

  setTimeout(function() {
    socket.send(JSON.stringify({action: 'unsubscribe', event: 'USA'}));
  }, 5000);

  socket.onmessage = function(event) {
    var data = JSON.parse(event.data);
    console.log('Tweet event received: ', data);
  };

});
