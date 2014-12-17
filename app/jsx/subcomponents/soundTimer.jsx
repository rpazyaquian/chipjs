/** @jsx React.DOM */

var React = require('react');

var SoundTimer = React.createClass({
  render: function() {

    var value = this.props.soundTimer.toString(16).toUpperCase();

    if (this.props.soundTimer < 0x10) {
      value = "0"+value;
    }

    return (
      <div className="sound-timer">
        <p>Sound Timer: 0x{value}</p>
      </div>
    );
  }
});

module.exports = SoundTimer;