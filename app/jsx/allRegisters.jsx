/** @jsx React.DOM */

var React = require('react');

var Registers = require('./subcomponents/registers.jsx');

var SubRegisters = require('./subRegisters.jsx');

var AllRegisters = React.createClass({
  render: function() {

    return (
      <div className='all-registers'>
        <Registers
          registers={this.props.registers}
        />
        <SubRegisters
          addressRegister={this.props.addressRegister}
          soundTimer={this.props.soundTimer}
          delayTimer={this.props.delayTimer}
        />
      </div>
    );

  }
});

module.exports = AllRegisters;