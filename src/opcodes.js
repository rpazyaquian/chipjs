var _und = require('underscore');

module.exports = function(chipJS) {

  // opcode functions
  chipJS.clearScreen = function(opcode) {
    // clear the screen
    // i.e. set all pixels in array to 0
  };
  chipJS.returnFromSubroutine = function(opcode) {
    // iirc, what happens is
    // you pop off the top of the subroutine stack
    // and jump to that address
    if (this.stack.length > 0) {
      var newAddress = this.stack.pop();
      this.programCounter = newAddress;
    }
  };
  chipJS.jumpToAddress = function(opcode) {
    // sets the program counter to the address
    // specified by the opcode
    var address = opcode.address;
    this.programCounter = address;
  };
  chipJS.executeSubroutine = function(opcode) {
    // pushes current location onto subroutine stack
    // and jumps to specified address
    this.stack.push(this.programCounter);
  };
  chipJS.skipIfVXEqual = function(opcode) {
    // skip the next instruction (i.e. incrememnt PC by 2)
    // if VX equals NN
    var x = opcode.digits[1];
    if (this.registers[x] === opcode.tail) {
      this.programCounter += 2;
    }
  };
  chipJS.skipIfVXNotEqual = function(opcode) {
    // same as above, but if VX does not equal NN
    var x = opcode.digits[1];
    if (this.registers[x] !== opcode.tail) {
      this.programCounter += 2;
    }
  };
  chipJS.skipIfVXVYEqual = function(opcode) {
    var x = opcode.digits[1];
    var y = opcode.digits[2];
    if (this.registers[x] === this.registers[y]) {
      this.programCounter += 2;
    }
  };
  chipJS.storeToVX = function(opcode) {
    // write the value NN to VX
    var x = opcode.digits[1];
    this.registers[x] = opcode.tail;
  };
  chipJS.addToVX = function(opcode) {
    // add NN to value of VX
    var x = opcode.digits[1];
    this.registers[x] += opcode.tail;
  };
  chipJS.storeVYToVX = function(opcode) {
    // store value of VY in VX
    var x = opcode.digits[1];
    var y = opcode.digits[2];
    this.registers[x] = this.registers[y];
  };
  chipJS.setVXToVXOrVY = function(opcode) {
    // set VX to (VX | VY)
    var x = opcode.digits[1];
    var y = opcode.digits[2];
    console.log(this);
    console.log(this.registers);
    this.registers[x] = (this.registers[x] | this.registers[y]);
  };
  chipJS.setVXToVXAndVY = function(opcode) {
    // set VX to (VX & VY)
    var x = opcode.digits[1];
    var y = opcode.digits[2];
    // console.log(this.registers[x]);
    this.registers[x] = (this.registers[x] & this.registers[y]);
  };
  chipJS.setVXToVXXorVY = function(opcode) {
    // set VX to (VX ^ VY)
    var x = opcode.digits[1];
    var y = opcode.digits[2];
    this.registers[x] = (this.registers[x] ^ this.registers[y]);
  };
  chipJS.addVYToVX = function(opcode) {
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
  chipJS.subtractVYFromVX = function(opcode) {
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
  chipJS.storeRightShiftVYToVX = function(opcode) {
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
  chipJS.setVXtoVYMinusVX = function(opcode) {
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
  chipJS.storeLeftShiftVYToVX = function(opcode) {
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
  chipJS.skipIfVXVYNotEqual = function(opcode) {
    // skip the next instruction (i.e. incrememnt PC by 2)
    // if values of VX and VY are not equal
    var x = opcode.digits[1];
    var y = opcode.digits[2];
    if (this.registers[x] !== this.registers[y]) {
      this.programCounter += 2;
    }
  };
  chipJS.storeAddressToI = function(opcode) {
    // store NNN to address register I
    this.i = opcode.address;
  };
  chipJS.jumpToAddressV0 = function(opcode) {
    // jump to address (NNN + value of V0)
    this.programCounter = opcode.address + this.registers[0];
  };
  chipJS.setVXToRandom = function(opcode) {
    // set VX to a random number with a mask of NN
    // ("mask") functions as a "maximum" of sorts
    var x = opcode.digits[1];

    var getRandomInt = function(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }

    this.registers[x] = (getRandomInt(0, 256) & opcode.tail);
  };
  chipJS.drawSprite = function(opcode) {
    // Draw a sprite at position VX, VY
    // with N bytes of sprite data
    // starting at the address stored in I
    // Set VF to 01 if any set pixels
    // are changed to unset, and 00 otherwise
    var x = opcode.digits[1];
    var y = opcode.digits[2];
    // TODO
  };
  chipJS.skipIfKeyPressed = function(opcode) {
    // Skip the following instruction
    // if the key corresponding to the hex value
    // currently stored in register VX is pressed
    var x = opcode.digits[1];
    var key = this.registers[x];
    if (this.keyIsPressed(key)) {
      this.programCounter += 2;
    }
  };
  chipJS.skipIfKeyNotPressed = function(opcode) {
    // Skip the following instruction
    // if the key corresponding to the hex value
    // currently stored in register VX is NOT pressed
    var x = opcode.digits[1];
    var key = this.registers[x];
    if (!this.keyIsPressed(key)) {
      this.programCounter += 2;
    }
  };
  chipJS.storeDelayTimerToVX = function(opcode) {
    // Store the current value of the delay timer
    // in register VX
    var x = opcode.digits[1];
    this.registers[x] = this.delayTimer;
  };
  chipJS.storeKeypressToVX = function(opcode) {
    // Wait for a keypress and store the result
    // in register VX
  };
  chipJS.setDelayTimerToVX = function(opcode) {
    // Set the delay timer to the value of register VX
    var x = opcode.digits[1];
    this.delayTimer = this.registers[x];
  };
  chipJS.setSoundTimerToVX = function(opcode) {
    // Set the sound timer to the value of register VX
    var x = opcode.digits[1];
    this.soundTimer = this.registers[x];
  };
  chipJS.addVXToI = function(opcode) {
    // Add the value stored in register VX to register I
    var x = opcode.digits[1];
    this.i += this.registers[x];
  };
  chipJS.setIToFontDigit = function(opcode) {
    // Set I to the memory address of the sprite data
    // corresponding to the hexadecimal digit
    // stored in register VX

    // where are the fonts stored?

  };
  chipJS.storeBCDOfVx = function(opcode) {
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
  chipJS.storeRegistersToMemory = function(opcode) {
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
  chipJS.loadRegistersFromMemory = function(opcode) {
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