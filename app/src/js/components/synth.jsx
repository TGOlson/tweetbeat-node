var SynthPad = require('./synth-pad.jsx'),
    SynthPadStore = require('../stores/synth-pad-store');

var Synth = React.createClass({

  componentDidMount() {
    SynthPadStore.addChangeListener(this._onChange);
  },

  _onChange() {
    var pads = SynthPadStore.getAll();
    this.setState({pads});
  },

  render() {
    var pads =  this.props.pads.map(function(pad, index) {
      return (
          <SynthPad key={index}
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

module.exports = Synth;
