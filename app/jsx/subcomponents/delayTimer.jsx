/** @jsx React.DOM */

var React = require('react');

var DelayTimer = React.createClass({
  render: function() {

    var value = this.props.delayTimer.toString(16).toUpperCase();

    if (this.props.delayTimer < 0x10) {
      value = "0"+value;
    }

    return (
      <div className="delay-timer">
        <p>Delay Timer: 0x{value}</p>
      </div>
    );
  }
});

module.exports = DelayTimer;