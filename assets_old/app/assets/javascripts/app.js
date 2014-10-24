var App = {};

App.init = function() {
  Layout.init();
  initializeAudio();
  Scrolling.init();
  Topics.init();
  Stream.init();
};

$(App.init);
