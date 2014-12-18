/** @jsx React.DOM */

var React = require('react');

var RAM = React.createClass({
    render: function() {
      return (
        <div className="ram">
          <canvas id='ram-canvas'></canvas>
        </div>
      );
    }
});

module.exports = RAM;