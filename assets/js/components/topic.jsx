/*
 * Third-party dependencies
 */

var React = require('react'),
    classSet = require('react/addons').addons.classSet,
    _ = require('lodash');


/*
 * Internal dependencies
 */

var TopicActions = require('../actions/topic-actions');


/*
 * Module definition
 */

var Topic = React.createClass({
  handleClick() {
    var topic = this.props.topic,
        action;

    if(topic.isActive) {
      action = TopicActions.deselectTopic;
    } else {
      action = TopicActions.selectTopic;
    }

    action(topic);
  },

  render() {
    var topic = this.props.topic;

    var classes = classSet({
      topic: true,
      active: topic.isActive
    });

    return (
      <li className={classes} onClick={this.handleClick}>
        <span className="topic-text">{topic.text}</span>
        <span className="count">{topic.count}</span>
      </li>
    );
  },
});

module.exports = Topic;
