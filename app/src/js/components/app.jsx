var Synth = require('./synth.jsx'),
    SYNTH_PAD_SETTINGS = require('../constants/synth-pad-settings');

var App = {};

// bootstraps the entire component tree
App.start = function() {
  var target = document.getElementById('content');
  React.render(<Synth pads={SYNTH_PAD_SETTINGS} />, target);
};

// load component with async call like so:
// $.getJSON('inbox.json', function(emails) {
//   React.renderComponent(<App emails={emails} />, document.body);
// });

module.exports = App;
