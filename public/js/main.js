$(function() {

  console.log('Hi there');

  var host = location.origin.replace('http', 'ws'),
    socket = new WebSocket(host);

  socket.onmessage = function(event) {
    var data = JSON.parse(event.data);
    console.log('Tweet event received: ', data.topic);
  };

});
