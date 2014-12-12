var _und = require('underscore');

var blankRam = _und.map(_und.range(4096), function () {
  return 0;
});

var blankDisplay = _und.map(_und.range(32, function () {
  _und.map(_und.range(64), function () {
    return 0;
  });
}));

var ChipJS = function() {
  // properties
  this.ram: _und.clone(blankRam),
  this.i: 0x000,
  this.registers: [
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
  this.v: this.registers,
  this.programCounter: 0x200,
  this.stack: [],
  this.display: blankDisplay,
  this.soundTimer: 0x00,
  this.delayTimer: 0x00,
  // utility methods
  execute: function() {
    // get operation matching opcode
    this.operation = this.getOperation();
    // execute this operation
    this.operation();
  },
  getOperation: function() {
    this.opcode = this.getOpcode();
    var operation = this.translateOpcode(this.opcode);
    return operation;
  },
  getOpcode: function () {
    // opcode is defined as 0xNNNN, where
    // the first half is the current location of
    // the program counter, the second is
    // the location in ram at program counter + 1
    var byte1 = this.ram[this.programCounter];
    var byte2 = this.ram[this.programCounter+1];
    var full = this.mergeBytes(byte1, byte2);
    var address = this.getAddress(full);
    var digits = this.splitIntoDigits(full);

    var opcode = {
      head: byte1,
      tail: byte2,
      whole: full,
      address: address,
      digits: digits
    };

    return opcode;
  },
  mergeBytes: function(head, tail) {
    return ((head << 8) | tail);
  },
  translateOpcode: function(opcode) {
    var digits = this.opcode.digits;
    var operation = this.matchDigits(digits);
    return operation;
  },
  splitIntoDigits: function(full) {
    var full = full;
    var digits = _und.map([12, 8, 4, 0], function (bits) {
      // shift 0xABCD right by 0 digits
      // and & with 0xF to get 0xD
      // shift 0xABCD right by 4 digits
      // and & with 0xF to get 0xC, etc.
      return (full >> bits) & 0xF
    });
    return digits;
  },
  matchDigits: function(digits) {
    var self = this;
    // create a switch case
    // and return a particular function
    // based on the first digit
    // operate recursively for sub-opcodes...

    // fuck switch cases!
    // these are integers, aren't they?
    // make an array of arrays!

    // the opcodes:

    var opcodes = [
      // this is a disgusting mess
      // and i feel the need
      // to apologize for it
      [
        {
          0xE0: self.clearScreen,  // 00E0
          0xEE: self.returnFromSubroutine
        }
      ],  // 0---
      [self.jumpToAddress],  // 1---
      [self.executeSubroutine],  // 2---
      [self.skipIfVXEqual],  // 3---
      [self.skipIfVXNotEqual],  // 4---
      [self.skipIfVXVYEqual],  // 5---
      [self.storeToVX],  // 6---
      [self.addToVX],  // 7---
      [],  // 8--- (how am i gonna store this w/o strings?)
      [self.skipIfVXVYNotEqual],  // 9---
      [self.storeAddressToI],  // A---
      [self.jumpToAddressV0],  // B---
      [self.setVXToRandom],  // C---
      [self.drawSprite],  // D---
      [  // E---
        {
          0x9E: self.skipIfKeyPressed,
          0xA1: self.skipIfKeyNotPressed
        }
      ],
      [
        {
          0x07: self.storeDelayTimerToVX,
          0x0A: self.storeKeypressToVX,
          0x15: self.setDelayTimerToVX,
          0x18: self.setSoundTimerToVX,
          0x1E: self.addVXToI,
          0x29: self.setIToFontDigit,
          0x33: self.storeBCDOfVx,
          0x55: self.storeRegistersToMemory,
          0x65: self.loadRegistersFromMemory
        }
      ]   // F---
    ];

    switch digits[0] {
      case 0x0:
        break;
      case 0x8:
        break;
      case 0xE:
        break;
      case 0xF:
        break;
      default:
        break;
    }

  }
};


module.exports = ChipJS;