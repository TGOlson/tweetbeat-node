// this file is temporarily holding actions, dispatcher and store code
// TODO: separate out code using require.js or browserify

// actions

var AppActions = {
  padDown(pad) {
    AppDispatcher.handleViewAction({
      actionType: 'PAD_DOWN',
      pad: pad
    });
  },
  padUp(pad) {
    AppDispatcher.handleViewAction({
      actionType: 'PAD_UP',
      pad: pad
    });
  }
};

// dispatcher
var AppDispatcher = new Flux.Dispatcher();

/**
 * A bridge function between the views and the dispatcher, marking the action
 * as a view action.  Another variant here could be handleServerAction.
 * @param  {object} action The data coming from the view.
 */

AppDispatcher.handleViewAction = function(action) {
  this.dispatch({
    source: 'VIEW_ACTION',
    action: action
  });
};

// store

var SynthPadStore = {};
var CHANGE_EVENT = 'change';

var _pads = PAD_SETTINGS;
var _changeListeners = [];

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
  for(var i = 0; i < _pads.length; i++) {
    var _pad = _pads[i];

    if(pad.name === _pad.name) {
      _pad.isHit = isHit;
    }
  }
};

// TODO: bring in node eventemmiter for these event handlers
SynthPadStore.emitChange = function() {
  for(var i = 0; i < _changeListeners.length; i++) {
    var callback = _changeListeners[i];
    callback(event);
  }
};

SynthPadStore.addChangeListener = function(callback) {
  _changeListeners.push(callback);
};

// add remove listener later

AppDispatcher.register(function(payload) {
  var action = payload.action;

  if(action.actionType === 'PAD_DOWN') {
    SynthPadStore.padDown(action.pad);
  }

  if(action.actionType === 'PAD_UP') {
    SynthPadStore.padUp(action.pad);
  }

  SynthPadStore.emitChange();
});
