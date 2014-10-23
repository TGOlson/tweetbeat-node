/** @jsx React.DOM */

var Synth = React.createClass({
  render: function() {

    var pads =  this.props.pads.map(function(pad, index) {
      return (
          <Pad key={index}
            index={index}
            shortcut={pad.shortcut}
            instrument={pad.instrument} />
        );
    });

    return (
      <div className="synth">
        <p className="muted">SynthPad made by React, neato</p>
        <p className="muted">These do not do anything right now, thought</p>
        {pads}
      </div>
    );
  }
});
