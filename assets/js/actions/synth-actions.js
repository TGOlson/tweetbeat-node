/*
 * Internal dependencies
 */

var AppDispatcher = require('../dispatcher'),
    ActionTypes = require('../constants/action-types');


/*
 * Module definition
 */

var SynthActions = {
  padDown(pad) {
    AppDispatcher.handleViewAction({
      type: ActionTypes.PAD_DOWN,
      pad: pad
    });
  },

  padUp(pad) {
    AppDispatcher.handleViewAction({
      type: ActionTypes.PAD_UP,
      pad: pad
    });
  },

  keyDown(keyCode) {
    AppDispatcher.handleViewAction({
      type: ActionTypes.KEY_DOWN,
      keyCode: keyCode
    });
  },

  keyUp(keyCode) {
    AppDispatcher.handleViewAction({
      type: ActionTypes.KEY_UP,
      keyCode: keyCode
    });
  }
};

module.exports = SynthActions;
