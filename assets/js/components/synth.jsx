/*
 * Third-party dependencies
 */

var React = require('react'),
    classSet = require('react/addons').addons.classSet,
    _ = require('lodash');


/*
 * Internal dependencies
 */

var SynthPad = require('./synth-pad.jsx'),
    SynthPadStore = require('../stores/synth-pad-store');


/*
 * Module definition
 */

var Synth = React.createClass({

  componentDidMount() {
    SynthPadStore.addChangeListener(this._onChange);
    this._listenForShortcuts();
  },

  render() {
    var pads = _.map(this.props.pads, function(pad, index) {
      return <SynthPad key={index} pad={pad} />;
    });

    var classes = classSet({
      'synth': true,
      'show-shortcuts': this.props.showShortcuts
    });

    return (
      <div className={classes} onKeyDown={this.handleKeyDown}>
        <p id="moltar-logo">Moltar</p>
        <hr id="synth-top-border" />
        <div className="synth-pads">
          {pads}
        </div>
      </div>
    );
  },

  _listenForShortcuts() {
    $(window).on('keydown', (e) => {
      if(e.keyCode === 17) {
        this.props.showShortcuts = true;
        this.setState(this.props);
      }
    });

    $(window).on('keyup', () => {
      this.props.showShortcuts = false;
      this.setState(this.props);
    });
  },

  _onChange() {
    var pads = SynthPadStore.getAll();
    this.setState({pads});
  },
});

module.exports = Synth;
