/** @jsx React.DOM */

var React = require('react');

var AddressRegister = React.createClass({
  render: function() {
    return (
      <div className="address-register">
        <p>Address Register: {this.props.addressRegister}</p>
      </div>
    );
  }
});

module.exports = AddressRegister;