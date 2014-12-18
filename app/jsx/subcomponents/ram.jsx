/** @jsx React.DOM */

var React = require('react');

var RAM = React.createClass({

  drawRam: function() {
    var ramArray = this.props.ram;

    // console.log(ramArray);

    // for each byte in the ram array

  },

  componentDidUpdate: function() {
    this.drawRam();
  },

  render: function() {
    return (
      <div className="ram">
        <canvas id='ram-canvas'></canvas>
      </div>
    );
  }
});

module.exports = RAM;