/*
 * Internal dependencies
 */

var AppDispatcher = require('../dispatcher'),
    ActionTypes = require('../constants/action-types'),
    Audio = require('../services/audio');


/*
 * Module definition
 */

var AudioStore = {};

AudioStore.init = function() {
  Audio.init();
};

AudioStore.playSound = function(pad) {
  Audio.playSample(pad.index);
};

// clean this up with switch statement or something else
AppDispatcher.register(function(payload) {
  var action = payload.action,
      type = action.type;

  if(type === ActionTypes.PAD_DOWN) {
    AudioStore.playSound(action.pad);
  }

  // if(type === ActionTypes.PAD_UP) {
  //   SynthPadStore.padUp(action.pad);
  // }

  // if(type === ActionTypes.TWEET_RECEIVED) {
  //   console.log(action.tweet);
  // }

  // AudioStore does not have any view components
  // therefore it does not emit change events
  // AudioStore.emitChange();
});

module.exports = AudioStore;
