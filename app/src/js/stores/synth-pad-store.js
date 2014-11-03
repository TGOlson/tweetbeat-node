var SYNTH_PAD_SETTINGS = require('../constants/synth-pad-settings'),
    AppDispatcher = require('../dispatcher'),
    ActionTypes = require('../constants/action-types');

var SynthPadStore = {},
    CHANGE_EVENT = 'change',

    // private synth-pad data
    _pads = SYNTH_PAD_SETTINGS;

SynthPadStore._changeListeners = [];

SynthPadStore.getAll = function() {
  return _pads;
};

SynthPadStore.padDown = function(pad) {
  this.setPadHitState(pad, true);
};

SynthPadStore.padUp = function(pad) {
  this.setPadHitState(pad, false);
};

SynthPadStore.setPadHitState = function(pad, isHit) {
  var index = pad.index,
      _pad = _pads[index];

  _pad.isHit = isHit;
};

// TODO: bring in node eventemmiter for these event handlers
SynthPadStore.emitChange = function() {
  _.each(this._changeListeners, function(callback) {
    callback(event);
  });
};

SynthPadStore.addChangeListener = function(callback) {
  this._changeListeners.push(callback);
};

SynthPadStore.removeChangeListener = function(callback) {
  // TODO
};

AppDispatcher.register(function(payload) {
  var action = payload.action,
      actionType = action.actionType;

  if(actionType === ActionTypes.PAD_DOWN) {
    SynthPadStore.padDown(action.pad);
  }

  if(actionType === ActionTypes.PAD_UP) {
    SynthPadStore.padUp(action.pad);
  }

  SynthPadStore.emitChange();
});

module.exports = SynthPadStore;
