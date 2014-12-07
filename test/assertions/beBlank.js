// var should = require("should");
var _ = require("underscore");

module.exports = function (global) {
  global.should.Assertion.add(
    'beBlank',

    function () {
      this.params = { operator: 'to be blank' };

      var display = this.obj;

      // i'm assuming this whole function
      // expects a return value of true or false
      return _.every(display, function (row) {
        return _.every(row, function (pixel) {
          return pixel === 0;
        });
      });
    },

    // this is a getter,
    // i.e. it doesn't end with ()
    true
  );
};