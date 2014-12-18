/** @jsx React.DOM */

var React = require('react');

var SubroutineStack = require('./subcomponents/subroutineStack.jsx');
var AllRegisters = require('./allRegisters.jsx');


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
          <AllRegisters
            registers={this.props.chipJS.registers}
            addressRegister={this.props.chipJS.i}
            soundTimer={this.props.chipJS.soundTimer}
            delayTimer={this.props.chipJS.delayTimer}
            />
          <SubroutineStack
            stack={this.props.chipJS.stack}
          />
        </div>
      </div>
    );
  }
});

module.exports = ChipDisplay;

// currently off: RAM display. it's a LOT to render!
// <Memory ram={this.props.chipJS.ram} />