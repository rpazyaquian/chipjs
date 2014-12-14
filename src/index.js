var _und = require('underscore');

var blankRam = _und.map(_und.range(4096), function () {
  return 0;
});

var blankDisplay = _und.map(_und.range(32), function () {
  _und.map(_und.range(64), function () {
    return 0;
  });
});

var ChipJS = function() {

  // properties
  this.ram = _und.clone(blankRam);
  this.i = 0x000;
  this.registers = [
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
  ];
  this.v = this.registers;
  this.programCounter = 0x200;
  this.stack = [];
  this.display = blankDisplay;
  this.soundTimer = 0x00;
  this.delayTimer = 0x00;
  // utility methods
  this.execute = function() {
    // get opcode
    this.opcode = this.getOpcode();
    // get operation matching opcode
    var operation = this.getOperation(this.opcode);
    // execute this operation given opcode parameters
    operation(this.opcode);
  },
  this.getOperation = function(opcode) {
    var operation = this.translateOpcode(opcode);
    return operation;
  },
  this.getOpcode = function () {
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
  this.getAddress = function(full) {
    return (full & 0x0FFF);
  },
  this.mergeBytes = function(head, tail) {
    return ((head << 8) | tail);
  },
  this.translateOpcode = function(opcode) {
    var operation = this.matchDigits(opcode);
    return operation;
  },
  this.splitIntoDigits = function(full) {
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
  this.matchDigits = function() {
    // this is a disgusting mess
    // and i feel the need
    // to apologize for it
    var self = this;
    var digits = this.opcode.digits;

    var opcodes = [
      {
        0xE0: self.clearScreen,  // 00E0
        0xEE: self.returnFromSubroutine  // 00EE
      }, // 0---
      self.jumpToAddress,  // 1---
      self.executeSubroutine,  // 2---
      self.skipIfVXEqual,  // 3---
      self.skipIfVXNotEqual,  // 4---
      self.skipIfVXVYEqual,  // 5---
      self.storeToVX,  // 6---
      self.addToVX,  // 7---
      {
        0x00: self.storeVYToVX,
        0x01: self.setVXToVXOrVY,
        0x02: self.setVXToVXAndVY,
        0x03: self.setVXToVXXorVY,
        0x04: self.addVYToVX,
        0x05: self.subtractVYFromVX,
        0x06: self.storeRightShiftVYToVX,
        0x07: self.setVXtoVYMinusVX,
        0x0E: self.storeLeftShiftVYToVX
      },  // 8---
      self.skipIfVXVYNotEqual,  // 9---
      self.storeAddressToI,  // A---
      self.jumpToAddressV0,  // B---
      self.setVXToRandom,  // C---
      self.drawSprite,  // D---
      {
        0x9E: self.skipIfKeyPressed,
        0xA1: self.skipIfKeyNotPressed
      },  // E---
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
      }  // F---
    ];

    var operation;

    switch (digits[0]) {
      case 0x0:
        operation = opcodes[digits[0]][this.opcode.tail];
        break;
      case 0x8:
        operation = opcodes[digits[0]][digits[3]];
        break;
      case 0xE:
        operation = opcodes[digits[0]][this.opcode.tail];
        break;
      case 0xF:
        operation = opcodes[digits[0]][this.opcode.tail];
        break;
      default:
        operation = opcodes[digits[0]];
        break;
    }

    return operation;

  },
  // opcode functions
  this.clearScreen = function() {},
  this.returnFromSubroutine = function() {},
  this.jumpToAddress = function() {},
  this.executeSubroutine = function() {},
  this.skipIfVXEqual = function() {},
  this.skipIfVXNotEqual = function() {},
  this.skipIfVXVYEqual = function() {},
  this.storeToVX = function() {},
  this.addToVX = function() {},
  this.storeVYToVX = function() {},
  this.setVXToVXOrVY = function() {},
  this.setVXToVXAndVY = function() {},
  this.setVXToVXXorVY = function() {},
  this.addVYToVX = function() {},
  this.subtractVYFromVX = function() {},
  this.storeRightShiftVYToVX = function() {},
  this.setVXtoVYMinusVX = function() {},
  this.storeLeftShiftVYToVX = function() {},
  this.skipIfVXVYNotEqual = function() {},
  this.storeAddressToI = function() {},
  this.jumpToAddressV0 = function() {},
  this.setVXToRandom = function() {},
  this.drawSprite = function() {},
  this.skipIfKeyPressed = function() {},
  this.skipIfKeyNotPressed = function() {},
  this.storeDelayTimerToVX = function() {},
  this.storeKeypressToVX = function() {},
  this.setDelayTimerToVX = function() {},
  this.setSoundTimerToVX = function() {},
  this.addVXToI = function() {},
  this.setIToFontDigit = function() {},
  this.storeBCDOfVx = function() {},
  this.storeRegistersToMemory = function() {},
  this.loadRegistersFromMemory = function() {}
};


module.exports = ChipJS;