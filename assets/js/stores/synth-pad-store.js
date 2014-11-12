/*
 * Third-party dependencies
 */

var _ = require('lodash');


/*
 * Internal dependencies
 */

var AppDispatcher = require('../dispatcher'),
    ActionTypes = require('../constants/action-types'),
    SynthActions = require('../actions/synth-actions'),
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

SynthPadStore.padDown = function(_pad) {
  var pad = this.find(_pad);
  pad.isHit = true;
};

SynthPadStore.padUp = function(_pad) {
  var pad = this.find(_pad);
  pad.isHit = false;
};

SynthPadStore.find = function(pad) {
  return _.find(_pads, function(_pad) {
    return _pad.name === pad.name;
  });
};

SynthPadStore.keyDown = function(keyCode) {
  var pad = this.findByKeyCode(keyCode);
  if(pad) this.padDown(pad);
};

SynthPadStore.keyUp = function(keyCode) {
  var pad = this.findByKeyCode(keyCode);
  if(pad) this.padUp(pad);
};

SynthPadStore.findByKeyCode = function(keyCode) {
  var character = String.fromCharCode(keyCode);

  return _.find(_pads, function(_pad) {
    return _pad.shortcut === character.toLowerCase();
  });
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
