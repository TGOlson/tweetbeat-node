/** @jsx React.DOM */

var Synth = React.createClass({

  componentDidMount() {
    // manually set a timeout to allow store to load
    // TODO: use require or browserify
    setTimeout(() => {
      SynthPadStore.addChangeListener(this._onChange);
    }, 500);
  },

  _onChange() {
    var pads = SynthPadStore.getAll();
    this.setState({pads});
  },

  render() {
    var pads =  this.props.pads.map(function(pad, index) {
      return (
          <Pad key={index}
            index={index}
            shortcut={pad.shortcut}
            isHit={pad.isHit}
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
