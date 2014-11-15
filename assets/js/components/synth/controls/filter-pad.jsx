/*
 * Third-party dependencies
 */

var React = require('react'),
    classSet = require('react/addons').addons.classSet;


/*
 * Internal dependencies
 */

var Audio = require('../../../services/audio');


/*
 * Module definition
 */

var FilterPad = React.createClass({
  handleClick() {
    this.props.filterOn = !this.props.filterOn;
    Audio.toggleFilter();
    this.setState(this.props);
  },

  render() {
    var classes = classSet({
      'filter-toggle': true,
      'filter-on': this.props.filterOn
    });

    return (
      <div>
        <div className="filter-pad"></div>
        <button className={classes} onClick={this.handleClick}>On | Off</button>
      </div>
    );
  },
});

module.exports = FilterPad;
