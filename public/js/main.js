$(init);

function init() {

  var socket = new Socket();

  var callback = function(data) {
    console.log(data);
    incrementCount(data.topic);
  };

  setTopics();

  $('#tweet-topics').click(function(e) {
    var $topic = $(e.target),
      text = $topic.find('.topic-text').text();

    $topic.toggleClass('subscribed').toggleClass('unsubscribed');

    if($topic.hasClass('subscribed')) {
      socket.on(text, callback);
    } else {
      socket.removeListener(text);
    }
  });

}


function setTopics() {
  $.get('/topics', function(response) {
    response.forEach(addTopic);
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

function incrementCount(topic) {
  topic = topic.toLowerCase().replace(' ', '-');
  var $count = $('#' + topic).find('.count'),
    prevCount = $count.text(),
    currentCount = parseInt(prevCount) + 1;

  $count.text(currentCount);
}
