var _und = require('underscore');

var blankRam = function() {
  var array = _und.map(_und.range(4096), function () {
    return 0;
  });
  return array;
};

var blankDisplay = function() {
  var display = _und.map(_und.range(32), function () {
    _und.map(_und.range(64), function () {
      return 0;
    });
  });

  return display;
}

var ChipJS = function() {

  // properties
  this.ram = _und.clone(blankRam());
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
  this.programCounter = 0x200;
  this.stack = [];
  this.display = blankDisplay();
  this.soundTimer = 0x00;
  this.delayTimer = 0x00;
  // utility methods
  this.execute = function(input) {
    // get opcode
    this.opcode = this.getOpcode(input);
    // console.log(this.opcode)
    // get operation matching opcode
    var operation = this.getOperation(this.opcode);
    // execute this operation given opcode parameters
    operation(this.opcode);
  };
  this.getOperation = function(opcode) {
    var operation = this.translateOpcode(opcode);
    return operation;
  };
  this.getOpcode = function (input) {
    // opcode is defined as 0xNNNN, where
    // the first half is the current location of
    // the program counter, the second is
    // the location in ram at program counter + 1

    var full = input;
    var byte1 = (input & 0xFF00) >> 8;
    var byte2 = input & 0x00FF;
    var address = this.getAddress(full);
    var digits = this.splitIntoDigits(full);

    var opcode = {
      head: byte1,
      tail: byte2,
      full: full,
      address: address,
      digits: digits
    };

    return opcode;
  };
  this.getAddress = function(full) {
    return (full & 0x0FFF);
  };
  this.mergeBytes = function(head, tail) {
    return ((head << 8) | tail);
  };
  this.translateOpcode = function(opcode) {
    var operation = this.matchDigits(opcode);
    return operation;
  };
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
  };
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

  };
  // opcode functions
  this.clearScreen = function(opcode) {
    // clear the screen
    // i.e. set all pixels in array to 0
    this.display = blankDisplay();
  };
  this.returnFromSubroutine = function(opcode) {
    // iirc, what happens is
    // you pop off the top of the subroutine stack
    // and jump to that address
    if (this.stack.length > 0) {
      var newAddress = this.stack.pop();
      this.programCounter = newAddress;
    }
  };
  this.jumpToAddress = function(opcode) {
    // sets the program counter to the address
    // specified by the opcode
    var address = opcode.address;
    this.programCounter = address;
  };
  this.executeSubroutine = function(opcode) {
    // pushes current location onto subroutine stack
    // and jumps to specified address
    this.stack.push(this.programCounter);
  };
  this.skipIfVXEqual = function(opcode) {
    // skip the next instruction (i.e. incrememnt PC by 2)
    // if VX equals NN
    var x = opcode.digits[1];
    if (this.registers[x] === opcode.tail) {
      this.programCounter += 2;
    }
  };
  this.skipIfVXNotEqual = function(opcode) {
    // same as above, but if VX does not equal NN
    var x = opcode.digits[1];
    if (this.registers[x] !== opcode.tail) {
      this.programCounter += 2;
    }
  };
  this.skipIfVXVYEqual = function(opcode) {
    var x = opcode.digits[1];
    var y = opcode.digits[2];
    if (this.registers[x] === this.registers[y]) {
      this.programCounter += 2;
    }
  };
  this.storeToVX = function(opcode) {
    // write the value NN to VX
    var x = opcode.digits[1];
    this.registers[x] = opcode.tail;
  };
  this.addToVX = function(opcode) {
    // add NN to value of VX
    var x = opcode.digits[1];
    this.registers[x] += opcode.tail;
  };
  this.storeVYToVX = function(opcode) {
    // store value of VY in VX
    var x = opcode.digits[1];
    var y = opcode.digits[2];
    this.registers[x] = this.registers[y];
  };
  this.setVXToVXOrVY = function(opcode) {
    // set VX to (VX | VY)
    var x = opcode.digits[1];
    var y = opcode.digits[2];
    console.log(this);
    console.log(this.registers);
    this.registers[x] = (this.registers[x] | this.registers[y]);
  };
  this.setVXToVXAndVY = function(opcode) {
    // set VX to (VX & VY)
    var x = opcode.digits[1];
    var y = opcode.digits[2];
    // console.log(this.registers[x]);
    this.registers[x] = (this.registers[x] & this.registers[y]);
  };
  this.setVXToVXXorVY = function(opcode) {
    // set VX to (VX ^ VY)
    var x = opcode.digits[1];
    var y = opcode.digits[2];
    this.registers[x] = (this.registers[x] ^ this.registers[y]);
  };
  this.addVYToVX = function(opcode) {
    // add value of VY to VX
    // set VF to 01 if a carry occurs
    // set VF to 00 if a carry does not occur
    var x = opcode.digits[1];
    var y = opcode.digits[2];
    var total = this.registers[x] + this.registers[y];
    if (total > 255) {
      this.registers[15] = 0x01;
      // this.registers[x] = total - 255;
    } else {
      this.registers[15] = 0x00;
      // this.registers[x] = total;
    }
  };
  this.subtractVYFromVX = function(opcode) {
    // subtract value of VY from VX
    // set VF to 00 if a borrow occurs
    // set VF to 01 if a borrow does not occur
    var x = opcode.digits[1];
    var y = opcode.digits[2];
    var difference = this.registers[x] - this.registers[y];
    if (difference < 0) {
      this.registers[15] = 0x00;
      // this.registers[x] = 255 + difference;
    } else {
      this.registers[15] = 0x01;
      // this.registers[x] = difference;
    }
  };
  this.storeRightShiftVYToVX = function(opcode) {
    // shift VY right by 1 and store that to VX
    var x = opcode.digits[1];
    var y = opcode.digits[2];
    var vx = this.registers[x];
    var vy = this.registers[y];

    var lsb = (vy & 0x1);

    this.registers[x] = (vy >> 1);

    // set VF to least significant bit prior to shift
    this.registers[15] = lsb
  };
  this.setVXtoVYMinusVX = function(opcode) {
    // Set register VX to the value of VY minus VX
    var x = opcode.digits[1];
    var y = opcode.digits[2];
    var difference = this.registers[y] - this.registers[x];
    if (difference < 0) {
      // Set VF to 00 if a borrow occurs
      this.registers[15] = 0x00;
      this.registers[x] = 255 + difference;
    } else {
      // Set VF to 01 if a borrow does not occur
      this.registers[15] = 0x01;
      this.registers[x] = difference;
    }
  };
  this.storeLeftShiftVYToVX = function(opcode) {
    // Store the value of register VY shifted left one bit
    // in register VX

    var x = opcode.digits[1];
    var y = opcode.digits[2];
    var vy = this.registers[y];

    // 0b 1111 1111
    // 0b 1010 1010
    // 0b 1111 1111
    // 0b 1111 1111
    // 0b 1111 1111
    // 0b 1000 0000

    var msb = (vy >> 7);

    this.registers[x] = ((vy << 1) & 0xFF);

    // Set register VF to the most significant bit
    // prior to the shift
    this.registers[15] = msb;
  };
  this.skipIfVXVYNotEqual = function(opcode) {
    // skip the next instruction (i.e. incrememnt PC by 2)
    // if values of VX and VY are not equal
    var x = opcode.digits[1];
    var y = opcode.digits[2];
    if (this.registers[x] !== this.registers[y]) {
      this.programCounter += 2;
    }
  };
  this.storeAddressToI = function(opcode) {
    // store NNN to address register I
    this.i = opcode.address;
  };
  this.jumpToAddressV0 = function(opcode) {
    // jump to address (NNN + value of V0)
    this.programCounter = opcode.address + this.registers[0];
  };
  this.setVXToRandom = function(opcode) {
    // set VX to a random number with a mask of NN
    // ("mask") functions as a "maximum" of sorts
    var x = opcode.digits[1];

    var getRandomInt = function(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }

    this.registers[x] = (getRandomInt(0, 256) & opcode.tail);
  };
  this.drawSprite = function(opcode) {
    // Draw a sprite at position VX, VY
    // with N bytes of sprite data
    // starting at the address stored in I
    // Set VF to 01 if any set pixels
    // are changed to unset, and 00 otherwise
    var x = opcode.digits[1];
    var y = opcode.digits[2];
    // TODO
  };
  this.skipIfKeyPressed = function(opcode) {
    // Skip the following instruction
    // if the key corresponding to the hex value
    // currently stored in register VX is pressed
    var x = opcode.digits[1];
    var key = this.registers[x];
    if (this.keyIsPressed(key)) {
      this.programCounter += 2;
    }
  };
  this.skipIfKeyNotPressed = function(opcode) {
    // Skip the following instruction
    // if the key corresponding to the hex value
    // currently stored in register VX is NOT pressed
    var x = opcode.digits[1];
    var key = this.registers[x];
    if (!this.keyIsPressed(key)) {
      this.programCounter += 2;
    }
  };
  this.storeDelayTimerToVX = function(opcode) {
    // Store the current value of the delay timer
    // in register VX
    var x = opcode.digits[1];
    this.registers[x] = this.delayTimer;
  };
  this.storeKeypressToVX = function(opcode) {
    // Wait for a keypress and store the result
    // in register VX
  };
  this.setDelayTimerToVX = function(opcode) {
    // Set the delay timer to the value of register VX
    var x = opcode.digits[1];
    this.delayTimer = this.registers[x];
  };
  this.setSoundTimerToVX = function(opcode) {
    // Set the sound timer to the value of register VX
    var x = opcode.digits[1];
    this.soundTimer = this.registers[x];
  };
  this.addVXToI = function(opcode) {
    // Add the value stored in register VX to register I
    var x = opcode.digits[1];
    this.i += this.registers[x];
  };
  this.setIToFontDigit = function(opcode) {
    // Set I to the memory address of the sprite data
    // corresponding to the hexadecimal digit
    // stored in register VX

    // where are the fonts stored?

  };
  this.storeBCDOfVx = function(opcode) {
    // Store the binary-coded decimal equivalent
    // of the value stored in register VX
    // at addresses I, I+1, and I+2

    var x = opcode.digits[1];
    var value = this.registers[x];

    var hundredsAddress = this.i;
    var tensAddress = this.i + 1;
    var onesAddress = this.i + 2;

    var hundreds = Math.floor(value / 100);
    var tens = Math.floor(value / 100) % 10;
    var ones = (value % 10);

    this.ram[hundredsAddress] = hundreds;
    this.ram[tensAddress] = tens;
    this.ram[onesAddress] = ones;
  };
  this.storeRegistersToMemory = function(opcode) {
    // Store the values of registers
    // V0 to VX (inclusive) in memory
    // starting at address I
    // I is set to I + X + 1 after operation
    var self = this;
    var x = opcode.digits[1];
    var originalI = self.i;
    _und.each(_und.range(x+1), function(index) {
      self.ram[i+index] = self.registers[index];
    });

    this.i = originalI + x + 1;
  };
  this.loadRegistersFromMemory = function(opcode) {
    // Fill registers V0 to VX (inclusive)
    // with the values stored in memory
    // starting at address I
    // I is set to I + X + 1 after operation
    var self = this;
    var x = opcode.digits[1];
    var originalI = self.i;
    _und.each(_und.range(x+1), function(index) {
      self.registers[index] = self.ram[i+index];
    });

    this.i = originalI + x + 1;
  }
};


module.exports = ChipJS;