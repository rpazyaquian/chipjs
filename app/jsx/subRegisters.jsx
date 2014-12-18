/** @jsx React.DOM */

var React = require('react');

var SubroutineStack = require('./subcomponents/subroutineStack.jsx');
var AddressRegister = require('./subcomponents/addressRegister.jsx');
var SoundTimer = require('./subcomponents/soundTimer.jsx');
var DelayTimer = require('./subcomponents/delayTimer.jsx');

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