/** @jsx React.DOM */

var React = require('react');

var ChipDisplay = React.createClass({
  render: function() {
    return (
      <div>
        <h1>What goes in a ChipJS?</h1>
        <ul>
          <li>16 8-bit registers V0-VF</li>
          <li>1 16-bit address register I</li>
          <li>sound timer</li>
          <li>display timer</li>
          <li>4096 array ram</li>
          <li>16-level subroutine stack</li>
          <li>maybe key states?</li>
        </ul>
      </div>
    );
  }
});

module.exports = ChipDisplay;