var _und = require('underscore');

var ChipJS = function() {
  this.ram = new Uint8Array(4096);
  this.registers = new Uint8Array(16);
  this.stack = [];  // addresses are 16-bit

  this.i = 0x000;
  this.programCounter = 0x200;
  this.soundTimer = 0x00;
  this.delayTimer = 0x00;

  this.infiniteLoopState = false;
  this.awaitingKeyPress = false;

  // at the end of the tick, the current state is
  // set to the previous state.
  // we can use the "previous" state
  // to calculate what keys have changed
  this.keyStates = {
    0x0: false,
    0x1: false,
    0x2: false,
    0x3: false,
    0x4: false,
    0x5: false,
    0x6: false,
    0x7: false,
    0x8: false,
    0x9: false,
    0xA: false,
    0xB: false,
    0xC: false,
    0xD: false,
    0xE: false,
    0xF: false,
    previous: {
      0x0: false,
      0x1: false,
      0x2: false,
      0x3: false,
      0x4: false,
      0x5: false,
      0x6: false,
      0x7: false,
      0x8: false,
      0x9: false,
      0xA: false,
      0xB: false,
      0xC: false,
      0xD: false,
      0xE: false,
      0xF: false,
    }
  };

  this.keyWasPressed = function() {
    // find the difference between this.keyStates
    // and this.keyStates.previous

    var self = this;

    var status = false;
    var pressedKey = 0;

    var keys = _und.range(0, 16);

    _und.each(keys, function(key) {
      // if previous is false, and current is true
      if (self.keyStates[key] & !(self.keyStates.previous[key])) {
        status = true;
        pressedKey = key;
      };
    });

    return {
      status: status,
      key: pressedKey
    };

  }

  this.pressKey = function(key) {
    if (!this.keyStates[key]) {
      this.keyStates[key] = true;
    };
  };

  this.releaseKey = function(key) {
    if (this.keyStates[key]) {
      this.keyStates[key] = false;
    };
  };

  this.newDisplay = function() {
    var display = [];
    for (var i = 0; i < 32; i++) {
      display[i] = new Uint8Array(8);
    }
    return display;
  };

  this.display = this.newDisplay();

  this.displayScreen = function() {
    // create a 2d array from an array of uint8arrays
    // first, figure out how to change a byte
    // to an 8-long array of 0s and 1s

    var display = this.display;
    var displayScreen = [];

    // okay, so the issue isn't with the actual display.

    for (var i = 0, displayLength = display.length; i < displayLength; i++) {


      var row = display[i];
      var displayRow = [];

      for (var j = 0, rowLength = row.length; j < rowLength; j++) {

        //   '0': 0,
        //   '1': 0,
        //   '2': 0,
        //   '3': 0,
        //   '4': 0,
        //   '5': 0,
        //   '6': 0,
        //   '7': 0,

        var displayByte = row[j];
        var bytePixels = this.byteToPixels(displayByte);
        displayRow.push(bytePixels);
      }

      var fullRow = _und.flatten(displayRow)

      displayScreen.push(fullRow);
    }

    return displayScreen;
  };

  this.byteToPixels = function(displayByte) {
    var masks = [
      0x80,
      0x40,
      0x20,
      0x10,
      0x08,
      0x04,
      0x02,
      0x01
    ];

    var byteInPixels = _und.map(masks, function(mask) {
      if (displayByte & mask) {
        return 1;
      } else {
        return 0;
      }
    });

    return byteInPixels;
  }

  this.fonts = function() {
    var ram = this.ram;
    var fonts = [
      0xF0, 0x90, 0x90, 0x90, 0xF0,
      0x20, 0x60, 0x20, 0x20, 0x70,
      0xF0, 0x10, 0xF0, 0x80, 0xF0,
      0xF0, 0x10, 0xF0, 0x10, 0xF0,
      0x90, 0x90, 0xF0, 0x10, 0x10,
      0xF0, 0x80, 0xF0, 0x10, 0xF0,
      0xF0, 0x80, 0xF0, 0x90, 0xF0,
      0xF0, 0x10, 0x20, 0x40, 0x40,
      0xF0, 0x90, 0xF0, 0x90, 0xF0,
      0xF0, 0x90, 0xF0, 0x10, 0xF0,
      0xF0, 0x90, 0xF0, 0x90, 0x90,
      0xE0, 0x90, 0xE0, 0x90, 0xE0,
      0xF0, 0x80, 0x80, 0x80, 0xF0,
      0xE0, 0x90, 0x90, 0x90, 0xE0,
      0xF0, 0x80, 0xF0, 0x80, 0xF0,
      0xF0, 0x80, 0xF0, 0x80, 0x80
    ]

    for (var i = 0, length = fonts.length; i < length; i++) {
      ram[i] = fonts[i];
    }
  };

  this.fonts();



  // utility functions

  this.tick = function() {
    var byte1 = this.ram[this.programCounter];
    var byte2 = this.ram[this.programCounter+1];
    var command = this.mergeBytes(byte1, byte2);

    this.execute(command);

    if (!this.awaitingKeyPress) {
      this.programCounter += 2;
    }
  }

  this.execute = function(command) {
    var opcode = this.getOpcode(command);
    this.matchOpcode(opcode);
  };

  this.mergeBytes = function(byte1, byte2) {
    var full = (byte1 << 8) | byte2;
    return full;
  }

  this.loadProgram = function(program) {
    for (var i = 0, length = program.length; i < length; i++) {
      this.ram[0x200 + i] = program[i];
    };
  };

  this.fontLocation = function(digit) {
    return digit * 5;
  };

  this.getOpcode = function(input) {
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

  this.getAddress = function(input) {
    return (input & 0x0FFF);
  };

  this.splitIntoDigits = function(input) {
    var digits = _und.map([12, 8, 4, 0], function (bits) {
      // shift 0xABCD right by 0 digits
      // and & with 0xF to get 0xD
      // shift 0xABCD right by 4 digits
      // and & with 0xF to get 0xC, etc.
      return ((input >> bits) & 0xF);
    });

    return digits;
  };

  this.matchOpcode = function(opcode) {
    // this is a disgusting mess
    // and i feel the need
    // to apologize for it

    var self = this;

    var digits = opcode.digits;

    var opcodes = [
      {
        0xE0: self.clearScreen.bind(self, opcode),  // 00E0
        0xEE: self.returnFromSubroutine.bind(self, opcode)  // 00EE
      }, // 0---
      self.jumpToAddress.bind(self, opcode),  // 1---
      self.executeSubroutine.bind(self, opcode),  // 2---
      self.skipIfVXEqual.bind(self, opcode),  // 3---
      self.skipIfVXNotEqual.bind(self, opcode),  // 4---
      self.skipIfVXVYEqual.bind(self, opcode),  // 5---
      self.storeToVX.bind(self, opcode),  // 6---
      self.addToVX.bind(self, opcode),  // 7---
      {
        0x00: self.storeVYToVX.bind(self, opcode),
        0x01: self.setVXToVXOrVY.bind(self, opcode),
        0x02: self.setVXToVXAndVY.bind(self, opcode),
        0x03: self.setVXToVXXorVY.bind(self, opcode),
        0x04: self.addVYToVX.bind(self, opcode),
        0x05: self.subtractVYFromVX.bind(self, opcode),
        0x06: self.storeRightShiftVYToVX.bind(self, opcode),
        0x07: self.setVXtoVYMinusVX.bind(self, opcode),
        0x0E: self.storeLeftShiftVYToVX.bind(self, opcode)
      },  // 8---
      self.skipIfVXVYNotEqual.bind(self, opcode),  // 9---
      self.storeAddressToI.bind(self, opcode),  // A---
      self.jumpToAddressV0.bind(self, opcode),  // B---
      self.setVXToRandom.bind(self, opcode),  // C---
      self.drawSprite.bind(self, opcode),  // D---
      {
        0x9E: self.skipIfKeyPressed.bind(self, opcode),
        0xA1: self.skipIfKeyNotPressed.bind(self, opcode)
      },  // E---
      {
        0x07: self.storeDelayTimerToVX.bind(self, opcode),
        0x0A: self.storeKeypressToVX.bind(self, opcode),
        0x15: self.setDelayTimerToVX.bind(self, opcode),
        0x18: self.setSoundTimerToVX.bind(self, opcode),
        0x1E: self.addVXToI.bind(self, opcode),
        0x29: self.setIToFontDigit.bind(self, opcode),
        0x33: self.storeBCDOfVx.bind(self, opcode),
        0x55: self.storeRegistersToMemory.bind(self, opcode),
        0x65: self.loadRegistersFromMemory.bind(self, opcode)
      }  // F---
    ];

    switch (digits[0]) {
      case 0x0:
        opcodes[digits[0]][opcode.tail]();
        break;
      case 0x8:
        opcodes[digits[0]][digits[3]]();
        break;
      case 0xE:
        opcodes[digits[0]][opcode.tail]();
        break;
      case 0xF:
        opcodes[digits[0]][opcode.tail]();
        break;
      default:
        opcodes[digits[0]]();
        break;
    }
  };

  this.writeToDisplay = function(row, column, offset, spriteData) {

    var self = this;

    var leftDidUnset;
    var rightDidUnset;

    if (offset > 0) {

      var leftSpriteData = spriteData >> offset;
      var leftDisplayData = self.display[row][column];
      self.display[row][column] = self.display[row][column] ^ leftSpriteData;
      var newLeftDisplayData = self.display[row][column];
      leftDidUnset = leftDisplayData & newLeftDisplayData;

      if (column != 7) {
        var offsetColumn = column + 1;

        var rightSpriteData = ((spriteData << (8 - offset)) & 0xFF);
        var rightDisplayData = self.display[row][offsetColumn];
        self.display[row][offsetColumn] = self.display[row][offsetColumn] ^ rightSpriteData;
        var newRightDisplayData = self.display[row][offsetColumn];
        rightDidUnset = rightDisplayData & newRightDisplayData;
      }
    } else {

      // just do the left sprite data

      var leftSpriteData = spriteData >> offset;
      var leftDisplayData = self.display[row][column];
      self.display[row][column] = self.display[row][column] ^ leftSpriteData;
      var newLeftDisplayData = self.display[row][column];
      leftDidUnset = leftDisplayData & newLeftDisplayData;
    }

    return (leftDidUnset | rightDidUnset);
  };

  // opcode functions
  this.clearScreen = function(opcode) {
    // clear the screen
    // i.e. set all pixels in array to 0
    this.display = this.newDisplay();
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
    // this is working when called directly,
    // but not through that big ol switch statement
    // up there...

    // sets the program counter to the address
    // specified by the opcode

    // but wait!
    // if this address is the same as

    var address = opcode.address - 2;

    if (address == this.programCounter - 2) {
      // then we've hit an infinite loop
      this.infiniteLoopState = true;
    }

    this.programCounter = address;
  };
  this.executeSubroutine = function(opcode) {
    // pushes current location onto subroutine stack
    // and jumps to specified address
    this.stack.push(this.programCounter);
    this.programCounter = opcode.address - 2;
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
    this.registers[x] = (this.registers[x] | this.registers[y]);
  };
  this.setVXToVXAndVY = function(opcode) {
    // set VX to (VX & VY)
    var x = opcode.digits[1];
    var y = opcode.digits[2];
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
    this.registers[x] = total;
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
    this.registers[x] = difference;
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
    this.programCounter = opcode.address + this.registers[0] - 2;
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
    var self = this;
    self.registers[15] = 0x00;
    // Draw a sprite at position VX, VY
    // with N bytes of sprite data
    // starting at the address stored in I
    // Set VF to 01 if any set pixels
    // are changed to unset, and 00 otherwise
    var x = self.registers[opcode.digits[1]];
    var y = self.registers[opcode.digits[2]];
    var n = opcode.digits[3];

    var column = Math.floor(x/8);
    var offset = x % 8;

    for (var i = 0; i < n; i++) {
      var row = y+i;
      var spriteData = self.ram[self.i];
      var pixelsDidUnset = self.writeToDisplay(row, column, offset, spriteData);
      if ((self.registers[15] == 0x00) & pixelsDidUnset) {
        self.registers[15] == 0x01;
      }
      self.i++;
    }

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
    // TODO

    var x = opcode.digits[1];

    // check awaitingKeyPress state
    // if not awaitingKeyPress,
    //   set awaitingKeyPress to true
    // if awaitingKeyPress,
    //   check to see if a key has recently been
    //   pressed
    //   (must know state of last )

    if (this.awaitingKeyPress) {
      var pressedKeyState = this.keyWasPressed();
      if (pressedKeyState.status) {
        this.awaitingKeyPress = false;
        this.registers[x] = pressedKeyState.key;
      }
    } else {
      this.awaitingKeyPress = true;
      // awaitingKeyPress is used to check if the
      // PC should increment by two
      // during a tick
    }

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

    var x = opcode.digits[1];
    var digit = this.registers[x];
    this.i = this.fontLocation(digit);
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
    var tens = Math.floor(value / 10) % 10;
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
      self.ram[self.i+index] = self.registers[index];
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
      self.registers[index] = self.ram[self.i+index];
    });

    this.i = originalI + x + 1;
  }

};

module.exports = ChipJS;