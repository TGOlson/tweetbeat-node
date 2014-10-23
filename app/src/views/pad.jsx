/** @jsx React.DOM */

var Pad = React.createClass({
  render: function() {
    return (
      <div className="pad">
        <p>SynthPad #{this.props.index}</p>
        <p>Shortcut: {this.props.shortcut} </p>
        <p>Instrument: {this.props.instrument}</p>
      </div>
    );
  }
});
