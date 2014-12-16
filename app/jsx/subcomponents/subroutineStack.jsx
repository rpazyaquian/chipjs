/** @jsx React.DOM */

var React = require('react');
var _und = require('underscore');

var Subroutine = require('./subroutine.jsx');



var SubroutineStack = React.createClass({
  render: function() {

    var subroutineIndex = -1;

    var subroutines = _und.map(this.props.subroutineStack, function(subroutine) {

      subroutineIndex += 1;

      return (
        <li className="subroutine-item" key={subroutine.id}>
          <Subroutine subroutine={subroutine} subroutineIndex={subroutineIndex} />
        </li>
      );
    });


    return (
      <div className="subroutine-stack">
        <h3>Subroutines</h3>
        <ul className="subroutine-list">
          {subroutines}
        </ul>
      </div>
    );
  }
});

module.exports = SubroutineStack;