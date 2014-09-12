$(init);

function init() {

  var socket = new Socket();

  var callback = function(data) {
    console.log(data);
    incrementCount(data.topic);
  };

  initTopics();

  $('#tweet-topics').click(function(e) {
    var $topic = $(e.target),
      text = $topic.find('.topic-text').text();

    $topic.toggleClass('subscribed').toggleClass('unsubscribed');

    if($topic.hasClass('subscribed')) {
      // TODO: change this to 'on'
      // where subscription takes place under the hood
      socket.subscribe(text, callback);
    } else {
      // TODO: change this to 'removeListener'
      // where unsubscription takes place under the hood
      socket.unsubscribe(text);
    }
  });

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


function incrementCount(topic) {
  topic = topic.toLowerCase().replace(' ', '-');
  var $count = $('#' + topic).find('.count'),
    prevCount = $count.text(),
    currentCount = parseInt(prevCount) + 1;

  $count.text(currentCount);
}
