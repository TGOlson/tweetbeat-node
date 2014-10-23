/** @jsx React.DOM */

/*
 * This file bootstraps the entire component tree
 * As such, it needs to be loaded last
 */

var PAD_SETTINGS = [
  {
    shortcut: 'q',
    instrument: 'SYNTH1'
  },
  {
    shortcut: 'w',
    instrument: 'SYNTH2'
  },
  {
    shortcut: 'e',
    instrument: 'SYNTH3'
  },
  {
    shortcut: 'a',
    instrument: 'BASS1'
  },
  {
    shortcut: 's',
    instrument: 'BASS2'
  },
  {
    shortcut: 'd',
    instrument: 'BASS3'
  },
  {
    shortcut: 'z',
    instrument: 'KICK1'
  },
  {
    shortcut: 'x',
    instrument: 'KICK2'
  },
  {
    shortcut: 'c',
    instrument: 'PERC3'
  }
];

React.renderComponent(
  <Synth pads={PAD_SETTINGS} />,
  document.getElementById('content')
);


// $.getJSON('inbox.json', function(emails) {
//   React.renderComponent(<App emails={emails} />, document.body);
// });
