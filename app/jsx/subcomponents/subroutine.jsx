/** @jsx React.DOM */

var React = require('react');
var _und = require('underscore');


var Subroutine = React.createClass({
  render: function() {
    return (
      <div className="subroutine">
        Subroutine {this.props.subroutineIndex}: {this.props.subroutine}
      </div>
    );
  }
});

module.exports = Subroutine;