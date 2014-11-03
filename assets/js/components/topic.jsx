/*
 * Third-party dependencies
 */

var React = require('react'),
    classSet = require('react/addons').addons.classSet,
    _ = require('lodash');


/*
 * Module definition
 */

var Topic = React.createClass({

  // TODO: stop handling topic click/drag internally
  // use actions and dispatcher
  handleClick() {
    this.props.isActive = !this.props.isActive;
    this.setState(this.props);
  },

  render() {
    var classes = classSet({
      topic: true,
      active: this.props.isActive
    });

    return (
      <li className={classes} onClick={this.handleClick}>
        <span className="topic-text">{this.props.topic}</span>
        <span className="count">0</span>
      </li>
    );
  },
});

module.exports = Topic;
