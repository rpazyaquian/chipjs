/** @jsx React.DOM */

var React = require('react');
var _und = require('underscore');


var Register = React.createClass({
  render: function() {

    var index = this.props.registerIndex.toString(16).toUpperCase();

    var value = this.props.register.toString(16).toUpperCase();

    if (this.props.register < 0x10) {
      value = "0"+value;
    }

    return (
      <div className="register">
        <div className='register-label'>
          V{index}
        </div>
        <div className='register-value'>
          0x{value}
        </div>
      </div>
    );
  }
});

module.exports = Register;