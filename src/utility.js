var _und = require('underscore');

module.exports = function(chipJS) {

  chipJS.prototype.newDisplay = function() {
    // there are 32 rows, and 64 columns
    // so, 32 Uint8Array(64)s?
    // i guess that works...
    var display = [];
    for (var i = 0; i < 32; i++) {
      display[i] = new Uint8Array(64);
    }
    return display;
  };

  chipJS.prototype.execute = function(command) {
    var opcode = this.getOpcode(command);
    var operation = this.getOperation(opcode);
    operation(opcode);
  };

  chipJS.prototype.getOpcode = function(input) {
    var full = input;
    var head = (input & 0xFF00) >> 8;
    var tail = input & 0x00FF;
    var address = this.getAddress(full);
    var digits = this.splitIntoDigits(full);

    var opcode = {
      head: head,
      tail: tail,
      full: full,
      address: address,
      digits: digits
    };

    return opcode;
  };

  chipJS.prototype.getAddress = function(input) {
    return (input & 0x0FFF);
  };

  chipJS.prototype.splitIntoDigits = function(input) {
    var digits = _und.map([12, 8, 4, 0], function (bits) {
      // shift 0xABCD right by 0 digits
      // and & with 0xF to get 0xD
      // shift 0xABCD right by 4 digits
      // and & with 0xF to get 0xC, etc.
      return ((input >> bits) & 0xF);
    });

    return digits;
  };

  chipJS.prototype.getOperation = function(opcode) {
    var operation = this.matchOpcode(opcode);

    return operation;
  };

  chipJS.prototype.matchOpcode = function(opcode) {
    // this is a disgusting mess
    // and i feel the need
    // to apologize for it

    var self = this;
    var digits = opcode.digits;

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
  }

};