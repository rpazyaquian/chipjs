/** @jsx React.DOM */

var React = require('react');

var Registers = require('./subcomponents/registers.jsx');

var MainRegisters = React.createClass({
  render: function() {

    return (
      <div className='main-registers'>
        <Registers
          registers={this.props.registers}
        />
      </div>
    );

  }
});

module.exports = MainRegisters;