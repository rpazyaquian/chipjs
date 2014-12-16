/** @jsx React.DOM */

var React = require('react');

var DelayTimer = React.createClass({
  render: function() {
    return (
      <div className="delay-timer">
        <p>Delay Timer: {this.props.delayTimer}</p>
      </div>
    );
  }
});

module.exports = DelayTimer;