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


/*
 * Module definition
 */

var App = React.createClass({
  render() {
    var padSettings = SynthPadStore.getAll();

    return (
        <div>
          <TopicList topics={this.props.topics} />
          <Synth pads={padSettings} />
        </div>
      );
  }
});

// bootstrap entire component tree
App.start = function() {
  var target = document.getElementById('content');

  // TODO: find way to have components asynchronously load
  $.get('/topics', function(topics) {
    React.render(<App topics={topics} />, target);
  });

};

module.exports = App;
