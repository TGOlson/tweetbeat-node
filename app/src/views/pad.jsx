/** @jsx React.DOM */

var Pad = React.createClass({
  handlePadHit() {
    this.toggleHitStateAndRender();

    setTimeout(() => {
      this.toggleHitStateAndRender();
    }, 150);
  },

  toggleHitStateAndRender() {
    this.props.isHit = !this.props.isHit;
    this.setState(this.props);
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
