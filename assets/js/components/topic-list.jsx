/*
 * Third-party dependencies
 */

var React = require('react'),
    _ = require('lodash');


/*
 * Internal dependencies
 */

var Topic = require('./topic.jsx'),
    TopicStore = require('../stores/topic-store');


/*
 * Module definition
 */

var TopicList = React.createClass({
  getInitialState: function() {
    return {topics: []};
  },

  componentDidMount() {
    TopicStore.addChangeListener(this._onChange);
  },

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

  _onChange() {
    var topics = TopicStore.getAll();
    this.props.topics = topics;
    this.setState({topics});
  },
});

module.exports = TopicList;
