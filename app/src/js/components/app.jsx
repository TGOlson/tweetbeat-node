/** @jsx React.DOM */

/*
 * This file bootstraps the entire component tree
 * App.start should be called only after all views are loaded
 */

var PAD_SETTINGS = [
  {
    shortcut: 'q',
    name: 'SYNTH1'
  },
  {
    shortcut: 'w',
    name: 'SYNTH2'
  },
  {
    shortcut: 'e',
    name: 'SYNTH3'
  },
  {
    shortcut: 'a',
    name: 'BASS1'
  },
  {
    shortcut: 's',
    name: 'BASS2'
  },
  {
    shortcut: 'd',
    name: 'BASS3'
  },
  {
    shortcut: 'z',
    name: 'KICK1'
  },
  {
    shortcut: 'x',
    name: 'KICK2'
  },
  {
    shortcut: 'c',
    name: 'PERC3'
  }
];

function App() {}

App.start = function() {
  var target = document.getElementById('content');
  React.renderComponent(<Synth pads={PAD_SETTINGS} />, target);
};

// $.getJSON('inbox.json', function(emails) {
//   React.renderComponent(<App emails={emails} />, document.body);
// });
