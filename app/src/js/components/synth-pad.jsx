var AppActions = require('../actions/synth-actions');

var SynthPad = React.createClass({
  handlePadHit() {
    AppActions.padDown(this.props);

    setTimeout(() => {
      AppActions.padUp(this.props);
    }, 150);
  },

  render() {
    var className = 'pad';

    if(this.props.isHit) {
      className += ' pad-hit';
    }

    return (
      <div className={className} onClick={this.handlePadHit}>
        <span className="shortcut">{this.props.shortcut}</span>
        <div className="topic-drop-area">
          <span>Pad #{this.props.index}</span>
        </div>
        <span className="pad-name">{this.props.name}</span>
      </div>
    );
  }
});

module.exports = SynthPad;
