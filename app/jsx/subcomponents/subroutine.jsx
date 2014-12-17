/** @jsx React.DOM */

var React = require('react');
var _und = require('underscore');


var Subroutine = React.createClass({
  render: function() {

    var address = this.props.subroutine.toString(16).toUpperCase();

    if (this.props.subroutine < 0x100) {
      address = "0"+address;

      if (this.props.subroutine < 0x10) {
        address = "0"+address;
      }

    }

    return (
      <div className="subroutine">
        Subroutine {this.props.subroutineIndex}: 0x{address}
      </div>
    );
  }
});

module.exports = Subroutine;