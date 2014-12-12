// oh my god this is so crappy
var _und = require('underscore');
var Opcode = require("./opcode.js");

var blankRam = _und.map(_und.range(4096), function () {
  return 0;
});

var blankDisplay = _und.map(_und.range(32, function () {
  _und.map(_und.range(64), function () {
    return 0;
  });
}));

var ChipJS = {
  ram: _und.clone(blankRam)
  i: 0x000,
  registers: [
    0x0,
    0x0,
    0x0,
    0x0,
    0x0,
    0x0,
    0x0,
    0x0,
    0x0,
    0x0,
    0x0,
    0x0,
    0x0,
    0x0,
    0x0,
    0x0
  ],
  execute: function(opcode) {
    var opcode = new Opcode(opcode);

    this.operation = opcode.operation();

    this.operation();
  },
  programCounter = 0x200,
  stack: [],
  display: blankDisplay,
  soundTimer: 0x0,
  delayTimer: 0x0
};

module.exports = ChipJS;