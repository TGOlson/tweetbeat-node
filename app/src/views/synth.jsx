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
      <div className="synth">
        <p id="moltar-logo">Moltar</p>
        <hr id="synth-top-border" />
        <div className="synth-pads">
          {pads}
        </div>
      </div>
    );
  }
});
