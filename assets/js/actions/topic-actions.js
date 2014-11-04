/*
 * Internal dependencies
 */

var AppDispatcher = require('../dispatcher'),
    ActionTypes = require('../constants/action-types');


/*
 * Module definition
 */

var TopicActions = {
  selectTopic(topic) {
    AppDispatcher.handleViewAction({
      type: ActionTypes.TOPIC_SELECTED,
      topic: topic
    });
  },

  deselectTopic(topic) {
    AppDispatcher.handleViewAction({
      type: ActionTypes.TOPIC_DESELECTED,
      topic: topic
    });
  },
};

module.exports = TopicActions;
