/** @jsx React.DOM */

var React = require('react');

var SoundTimer = require('./subcomponents/soundTimer.jsx');
var DelayTimer = require('./subcomponents/delayTimer.jsx');

var Timers = React.createClass({
  render: function() {
    return (
      <div className='timers'>
        <DelayTimer
          delayTimer={this.props.delayTimer}
        />
        <SoundTimer
          soundTimer={this.props.soundTimer}
        />
      </div>
    );
  }
});

module.exports = Timers;