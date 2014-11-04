/*
 * Third-party dependencies
 */

var React = require('react');


/*
 * Internal dependencies
 */

var Synth = require('./synth.jsx'),
    TopicList = require('./topic-list.jsx'),
    SynthPadStore = require('../stores/synth-pad-store');
    TopicStore = require('../stores/topic-store');


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

// bootstrap entire component tree
App.start = function() {
  var target = document.getElementById('content');
  React.render(<App />, target);
};

module.exports = App;
