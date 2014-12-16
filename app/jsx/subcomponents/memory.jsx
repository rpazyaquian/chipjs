/** @jsx React.DOM */

var React = require('react');

var _und = require('underscore');

var Memory = React.createClass({
  render: function() {

    console.log(this.props.ram.values());

    var bytes = _und.map(this.props.ram, function(ramByte) {
      return <li>{ramByte}</li>;
    });

    return (
      <div>
        <ul>
          {bytes}
        </ul>
      </div>
    );
  }
});

module.exports = Memory;