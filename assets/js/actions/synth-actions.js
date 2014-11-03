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
      actionType: ActionTypes.PAD_DOWN,
      pad: pad
    });
  },

  padUp(pad) {
    AppDispatcher.handleViewAction({
      actionType: ActionTypes.PAD_UP,
      pad: pad
    });
  },

  keyDown(keyCode) {
    AppDispatcher.handleViewAction({
      actionType: ActionTypes.KEY_DOWN,
      keyCode: keyCode
    });
  },

  keyUp(keyCode) {
    AppDispatcher.handleViewAction({
      actionType: ActionTypes.KEY_UP,
      keyCode: keyCode
    });
  }
};

module.exports = SynthActions;
