/** @jsx React.DOM */

var React = require('react');

var SoundTimer = React.createClass({
  render: function() {
    return (
      <div className="sound-timer">
        <p>Sound Timer: {this.props.soundTimer}</p>
      </div>
    );
  }
});

module.exports = SoundTimer;