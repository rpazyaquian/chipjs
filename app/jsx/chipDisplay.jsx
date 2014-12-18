/** @jsx React.DOM */

var React = require('react');

var MainRegisters = require('./mainRegisters.jsx');
var SubroutineStack = require('./subcomponents/subroutineStack.jsx');
var SubRegisters = require('./subRegisters.jsx');

var ChipDisplay = React.createClass({
  render: function() {
    return (
      <div>
        <h1>What goes in a ChipJS?</h1>
        <div className='chip-canvas'>
          <canvas id='chipjs-canvas'></canvas>
          <button id="run-button">Run/Stop</button>
        </div>
        <div className="chip-display">
          <MainRegisters
            registers={this.props.chipJS.registers}
          />
          <SubroutineStack
            stack={this.props.chipJS.stack}
          />
          <SubRegisters
            addressRegister={this.props.chipJS.i}
            soundTimer={this.props.chipJS.soundTimer}
            delayTimer={this.props.chipJS.delayTimer}
          />
        </div>
      </div>
    );
  }
});

module.exports = ChipDisplay;