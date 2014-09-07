$(function() {

  var host = location.origin.replace('http', 'ws');

  var socket = new WebSocket(host);

  socket.onmessage = function(event) {
    var data = JSON.parse(event.data);
    console.log(data.topic);
  };

});
