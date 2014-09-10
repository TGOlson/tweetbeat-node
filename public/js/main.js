$(function() {

  console.log('Hi there');
  initWebsocket();
  initTopics();

  $('#tweet-topics').click(function(e) {
    var $topic = $(e.target),
      text = $topic.find('.topic-text').text();

    $topic.toggleClass('subscribed').toggleClass('unsubscribed');

    if($topic.hasClass('subscribed')) {
      subscribe(text);
    } else {
      unsubscribe(text);
    }
  });

});

/*
 * Proof of concept views
 */

var socket;

// should fire callback when connected
function initWebsocket() {

  var host = location.origin.replace('http', 'ws');

  socket = new WebSocket(host);

  socket.onmessage = function(event) {
    var data = JSON.parse(event.data);
    console.log(data);
    incrementCount(data.topic);
  };
}

function initTopics() {
  $.get('/topics', function(response) {
    $.each(response, function(i, topic) {
      addTopic(topic);
    });
  });
}

function addTopic(topic) {
  var $li = $('<li>')
      .addClass('topic unsubscribed')
      .attr({id: topic.toLowerCase().replace(' ', '-')}),

    $topic = $('<span>')
      .addClass('topic-text')
      .text(topic),

    $count = $('<span>')
      .addClass('count')
      .text('0');

  $li.append($topic, $count);

  $('#tweet-topics').append($li);
}

function subscribe(event) {
  var message = formatMessage('subscribe', event);
  socket.send(message);
}

function unsubscribe(event) {
  var message = formatMessage('unsubscribe', event);
  socket.send(message);
}

function formatMessage(action, event) {
  var message = {
    action: action,
    event: event
  };

  return JSON.stringify(message);
}

function incrementCount(topic) {
  topic = topic.toLowerCase().replace(' ', '-');
  var $count = $('#' + topic).find('.count'),
    prevCount = $count.text(),
    currentCount = parseInt(prevCount) + 1;

  $count.text(currentCount);
}
