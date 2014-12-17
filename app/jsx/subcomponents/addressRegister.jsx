/** @jsx React.DOM */

var React = require('react');

var AddressRegister = React.createClass({
  render: function() {

    var address = this.props.addressRegister.toString(16).toUpperCase();

    if (this.props.addressRegister < 0x100) {
      address = "0"+address;

      if (this.props.addressRegister < 0x10) {
        address = "0"+address;
      }

    }

    return (
      <div className="address-register">
        <p>Address Register: 0x{address}</p>
      </div>
    );
  }
});

module.exports = AddressRegister;