var AppDispatcher = require('../dispatcher'),
    ActionTypes = require('../constants/action-types');

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
  }
};

module.exports = SynthActions;
