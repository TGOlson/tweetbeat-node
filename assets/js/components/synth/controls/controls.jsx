/*
 * Third-party dependencies
 */

var React = require('react');


/*
 * Internal dependencies
 */

var FilterPad = require('./filter-pad.jsx'),
    LibraryToggle = require('./library-toggle.jsx'),
    VolumeSlider = require('./volume-slider.jsx');


/*
 * Module definition
 */

var SynthControls = React.createClass({
  render() {
    return (
      <div className='synth-controls'>
        <LibraryToggle />
        <VolumeSlider />
        <FilterPad />
      </div>
    );
  },
});

module.exports = SynthControls;
