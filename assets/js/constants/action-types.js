/*
 * Third-party dependencies
 */

var keyMirror = require('react/lib/keyMirror');

// keyMirror mirrors object keys to string replicas
// => PAD_DOWN: 'PAD_DOWN'
module.exports = keyMirror({

  // synth-pad actions
  PAD_DOWN: null,
  PAD_UP: null,
  KEY_DOWN: null,
  KEY_UP: null,

  // topic actions
  TOPIC_SELECTED: null,
  TOPIC_DESELECTED: null,

  // tweet actions
  TWEET_RECEIVED: null
});
