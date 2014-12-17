/** @jsx React.DOM */

var React = require('react');
var _und = require('underscore');

var Register = require('./register.jsx');



var Registers = React.createClass({
  render: function() {

    var registerIndex = -1;

    var registers = _und.map(this.props.registers, function(register) {

      registerIndex += 1;

      return (
        <li className="register-item" key={register.id}>
          <Register register={register} registerIndex={registerIndex} />
        </li>
      );
    });

    return (
      <div className="registers-array">
        <h3>Registers</h3>
        <ul className="register-list">
          {registers}
        </ul>
      </div>
    );
  }
});

module.exports = Registers;