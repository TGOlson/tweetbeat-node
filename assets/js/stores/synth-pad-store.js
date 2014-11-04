/*
 * Third-party dependencies
 */

var _ = require('lodash');


/*
 * Internal dependencies
 */

var AppDispatcher = require('../dispatcher'),
    ActionTypes = require('../constants/action-types'),
    _pads = require('../constants/synth-pad-settings');


/*
 * Module definition
 */

var SynthPadStore = {},
    CHANGE_EVENT = 'change';

SynthPadStore._changeListeners = [];

SynthPadStore.getAll = function() {
  return _pads;
};

SynthPadStore.padDown = function(pad, hasPad) {
  this.setPadHitState(pad, true, hasPad);
};

SynthPadStore.padUp = function(pad, hasPad) {
  this.setPadHitState(pad, false, hasPad);
};

SynthPadStore.setPadHitState = function(pad, isHit, hasPad) {
  var _pad;

  // if hasPad is true we skip searching the pads
  // some actions already have the correct pad object at this point
  if(hasPad) {
    _pad = pad;
  } else {
    _pad = _.find(_pads, function(_pad) {
      return _pad.name === pad.name;
    });
  }

  _pad.isHit = isHit;
};

SynthPadStore.keyDown = function(keyCode) {
  this.handleKeyPress(keyCode, true);
};

SynthPadStore.keyUp = function(keyCode) {
  this.handleKeyPress(keyCode, false);
};

SynthPadStore.handleKeyPress = function(keyCode, isDown) {
  var character = String.fromCharCode(keyCode);

  var _pad = _.find(_pads, function(_pad) {
    return _pad.shortcut === character.toLowerCase();
  });

  if(_pad) this.setPadHitState(_pad, isDown, true);
};

SynthPadStore.emitChange = function() {
  _.each(this._changeListeners, (callback) => callback(event));
};

SynthPadStore.addChangeListener = function(callback) {
  this._changeListeners.push(callback);
};

SynthPadStore.removeChangeListener = function(callback) {
  _.remove(this._changeListeners, function(_callback) {
    return _callback === callback;
  });
};

// clean this up with switch statement or something else
AppDispatcher.register(function(payload) {
  var action = payload.action,
      type = action.type;

  if(type === ActionTypes.PAD_DOWN) {
    SynthPadStore.padDown(action.pad);
  }

  if(type === ActionTypes.PAD_UP) {
    SynthPadStore.padUp(action.pad);
  }

  if(type === ActionTypes.KEY_DOWN) {
    SynthPadStore.keyDown(action.keyCode);
  }

  if(type === ActionTypes.KEY_UP) {
    SynthPadStore.keyUp(action.keyCode);
  }

  SynthPadStore.emitChange();
});

module.exports = SynthPadStore;
