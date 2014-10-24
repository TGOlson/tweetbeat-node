/** @jsx React.DOM */

var Synth = React.createClass({
  render() {
    var pads =  this.props.pads.map(function(pad, index) {
      return (
          <Pad key={index}
            index={index}
            shortcut={pad.shortcut}
            name={pad.name} />
        );
    });

    return (
      <div className="synth" onClick={this.handleClick}>
        <p className="muted">SynthPad made by React, neato</p>
        <p className="muted">These do not do anything right now, though</p>
        {pads}
      </div>
    );
  }
});
