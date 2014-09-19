var eventPolyfill = {
  events: {

    // Create the event - hardcoded for each topic
    0: document.createEvent('Event'),
    1: document.createEvent('Event'),
    2: document.createEvent('Event'),
    3: document.createEvent('Event'),
    4: document.createEvent('Event')
  }
};



eventPolyfill.on = function(eventName, handler) {
  // Listen for the event.
  console.log('Listening for', eventName);
  document.addEventListener(eventName, handler, false);
};

eventPolyfill.off = function(eventName, handler) {
  console.log('Trying to stop Listening to event', eventName);
  document.removeEventListener(eventName, handler);
};

var Stream = {
  source: eventPolyfill,
  handler: null
};

Stream.init = function() {
  console.log('initing stream');

  $.each(eventPolyfill.events, function(eventName, event) {
    // type, bubbles, cancelable
    event.initEvent(eventName, true, true);
  });

  // var host = location.origin.replace('http', 'ws'),

  var host = 'ws://localhost:8080',
    socket = new WebSocket(host);

  socket.onmessage = function(event) {
    var data = JSON.parse(event.data);
    // console.log('Tweet event received: ', data.topic, data.topicId);

    if(data.topicId) {
      var docEvent = eventPolyfill.events[data.topicId];
      document.dispatchEvent(docEvent);
    }
  };
};

Stream.bindKeywordToSound = function(keywordID, soundID) {
  Layout.landKeywordOnPad(soundID);

  var eventHandler = function(e) {
    playSample(soundID);
    Layout.flashColor(soundID);
  };

  this.source.on(keywordID, eventHandler);
  this.handler = eventHandler;
};

Stream.removeBoundKeywordFromSound = function(eventName) {
  this.source.off(eventName, this.handler);
};

