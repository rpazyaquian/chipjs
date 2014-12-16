/** @jsx React.DOM */

var React = require('react');
var _und = require('underscore');


var Register = React.createClass({
  render: function() {
    return (
      <div className="register">
        V{this.props.registerIndex}: {this.props.register}
      </div>
    );
  }
});

module.exports = Register;