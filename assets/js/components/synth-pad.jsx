/*
 * Third-party dependencies
 */

var React = require('react'),
    classSet = require('react/addons').addons.classSet;


/*
 * Internal dependencies
 */

var SynthActions = require('../actions/synth-actions');


/*
 * Module definition
 */

var SynthPad = React.createClass({
  handlePadDown() {
    SynthActions.padDown(this.props.pad);
  },

  handlePadUp() {
    SynthActions.padUp(this.props.pad);
  },

  render() {
    var pad = this.props.pad;

    var classes = classSet({
      'pad': true,
      'pad-hit': pad.isHit
    });

    return (
      <div className={classes}
           onMouseDown={this.handlePadDown}
           onMouseUp={this.handlePadUp}>
        <span className="shortcut">{pad.shortcut}</span>
        <div className="topic-drop-area">
          <span>{pad.name}</span>
        </div>
        <span className="pad-name">{pad.name}</span>
      </div>
    );
  }
});

module.exports = SynthPad;
