/*
 * Third-party dependencies
 */

var React = require('react');


/*
 * Internal dependencies
 */

var Audio = require('../../../services/audio');


/*
 * Module definition
 */

var LibraryToggle = React.createClass({
  prevLib() {
    Audio.prevLib();
    this.forceUpdate();
  },

  nextLib() {
    Audio.nextLib();
    this.forceUpdate();
  },

  render() {
    var library = Audio.getCurrentLibraryType();

    return (
      <div className="library-toggle-container">
        <div className="library-toggle">
          <h1>{{library}}</h1>
        </div>
        <div className="arrow left" onClick={this.prevLib}></div>
        <div className="arrow right" onClick={this.nextLib}></div>
      </div>
    );
  },
});

module.exports = LibraryToggle;
