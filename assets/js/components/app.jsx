/*
 * Third-party dependencies
 */

var React = require('react');


/*
 * Internal dependencies
 */

var Synth = require('./synth.jsx'),
    SynthPadStore = require('../stores/synth-pad-store');


/*
 * Module definition
 */

var App = {};

// bootstrap entire component tree
App.start = function() {
  var target = document.getElementById('content'),
      padSettings = SynthPadStore.getAll();

  React.render(<Synth pads={padSettings} />, target);
};

// load component with async call like so:
// $.getJSON('inbox.json', function(emails) {
//   React.renderComponent(<App emails={emails} />, document.body);
// });

module.exports = App;
