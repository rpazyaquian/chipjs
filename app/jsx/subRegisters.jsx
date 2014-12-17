/** @jsx React.DOM */

var React = require('react');

var AddressRegister = require('./subcomponents/addressRegister.jsx');
var SoundTimer = require('./subcomponents/soundTimer.jsx');
var DelayTimer = require('./subcomponents/delayTimer.jsx');

// var Timers = require('./timers.jsx');

var SubRegisters = React.createClass({
  render: function() {
    return (
      <div className='sub-registers'>
        <AddressRegister
          addressRegister={this.props.addressRegister}
        />
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

module.exports = SubRegisters;

       // <Timers
       //    delayTimer={this.props.delayTimer}
       //    soundTimer={this.props.soundTimer}
       //  />