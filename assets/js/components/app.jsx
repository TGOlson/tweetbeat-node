/*
 * Third-party dependencies
 */

var React = require('react');


/*
 * Internal dependencies
 */

var Synth = require('./synth/synth.jsx'),
    TopicList = require('./topic-list.jsx'),
    SynthPadStore = require('../stores/synth-pad-store'),
    TopicStore = require('../stores/topic-store');

require('../stores/audio-store').init();
require('../stores/tweet-store').init();

/*
 * Module definition
 */

var App = React.createClass({
  render() {
    var synthPads = SynthPadStore.getAll();

    return (
        <div>
          <TopicList />
          <Synth pads={synthPads} />
        </div>
      );
  }
});

App.start = function() {
  var target = document.getElementById('content');
  React.render(<App />, target);
};

$(window).on('keyup keydown', (e) => SynthPadStore.handleKeyEvent(e));

module.exports = App;
