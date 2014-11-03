/*
 * Internal dependencies
 */

var App = require('./components/app.jsx'),
    Socket = require('./services/socket'),
    SynthActions = require('./actions/synth-actions');


App.start();

$(window).keydown(function(e) {
  SynthActions.keyDown(e.keyCode);
});

$(window).keyup(function(e) {
  SynthActions.keyUp(e.keyCode);
});

// dirty proof of concept stuff
// TODO: clean this up - migrate to react components
// $(init);

// function init() {

//   var socket = new Socket();

//   // for debugging
//   window.socket = socket;

//   var callback = function(data) {
//     console.log(data);
//     incrementCount(data.topic);
//   };

//   setTopics();

//   $('#tweet-topics').click('li', function(e) {
//     var $topic = $(e.target).closest('.topic'),
//       text = $topic.find('.topic-text').text();

//     $topic.toggleClass('active');

//     if($topic.hasClass('active')) {
//       socket.on(text, callback);
//     } else {
//       socket.removeListener(text);
//     }
//   });

// }


// function setTopics() {
//   $.get('/topics', function(response) {
//     response.forEach(addTopic);
//   });
// }

// function addTopic(topic) {
//   var $li = $('<li>')
//       .addClass('topic')
//       .attr({id: topic.toLowerCase().replace(' ', '-')}),

//     $topic = $('<span>')
//       .addClass('topic-text')
//       .text(topic),

//     $count = $('<span>')
//       .addClass('count')
//       .text('0');

//   $li.append($topic, $count);

//   $('#tweet-topics').append($li);
// }

// function incrementCount(topic) {
//   topic = topic.toLowerCase().replace(' ', '-');
//   var $count = $('#' + topic).find('.count'),
//     prevCount = $count.text(),
//     currentCount = parseInt(prevCount) + 1;

//   $count.text(currentCount);
// }
