/*
 * Third-party dependencies
 */

var React = require('react'),
    _ = require('lodash');


/*
 * Internal dependencies
 */

var Topic = require('./topic.jsx');


/*
 * Module definition
 */

var TopicList = React.createClass({

  render() {
    var topics = _.map(this.props.topics, function(topic, index) {
      return <Topic key={index} topic={topic}/>;
    });

    return (
      <div className="topics-container">
        <h1>Subscribe to events.</h1>
        <p>(check console to view tweets)</p>
        <ul className="tweet-topics">
          {topics}
        </ul>
      </div>
    );
  },
});

module.exports = TopicList;
