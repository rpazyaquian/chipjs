var should = require("should");
var _und = require('underscore');
var ChipJS = require('../src/index.js');

require('./assertions/beBlank');

describe('ChipJS', function () {

  describe('#execute', function() {

    beforeEach('instantiate ChipJS', function () {
      chipJS = new ChipJS;
    });

    describe('00E0', function () {
      beforeEach('execute opcode', function () {
        chipJS.execute(0x00E0);
      });
      it('clears the screen', function () {
        chipJS.display.should.beBlank;
      });
    });

    describe('00EE', function () {
      beforeEach('execute opcode', function () {
        chipJS.programCounter = 0x400;
        chipJS.subroutineStack = [0x200];
        chipJS.execute(0x00EE);
      });
      it('returns from a subroutine', function () {
        chipJS.programCounter.should.equal(0x200);
        chipJS.subroutineStack.length.should.equal(0);
      });
    });

    describe('1NNN', function () {
      beforeEach('execute opcode', function () {
        chipJS.execute(0x1200);
      });
      it('sets program counter to 0xNNN', function () {
        chipJS.programCounter.should.equal(0x200);
      });
    });

    describe('2NNN', function () {
      beforeEach('execute opcode', function () {
        // when this is executed,
        // chipJS jumps to that address
        // and begins operating from there.
        // when a subroutine is returned from,
        // chipJS jumps to the address it was at
        // prior to this subroutine.
        // therefore, before chipJS jumps to
        // this address, it needs to record the
        // address it is currently at.
        // so it pushes the current address
        // onto the subroutine stack
        // and sets the program counter
        // to the specified address NNN.
        chipJS.programCounter = 0x200;
        chipJS.execute(0x2400);
      });
      it('executes subroutine at 0xNNN', function () {
        chipJS.programCounter.should.equal(0x400);
        chipJS.subroutineStack.length.should.equal(1);
      });
    });

    describe('3XNN', function () {
      beforeEach('execute opcode', function () {
        var initialProgramCounter = chipJS.programCounter;
        chipJS.registers[0] = 0x00;
        chipJS.execute(0x3000);
        var finalProgramCounter = chipJS.programCounter;
      });
      it('skips next instruction if VX equals 0xNN', function () {
        var difference = finalProgramCounter - initialProgramCounter;
        difference.should.equal(4);
      });
    });

    describe('4XNN', function () {
      beforeEach('execute opcode', function () {
        var initialProgramCounter = chipJS.programCounter;
        chipJS.registers[0] = 0xFF;
        chipJS.execute(0x4000);
        var finalProgramCounter = chipJS.programCounter;
      });
      it('skips next instruction if VX does not equal 0xNN', function () {
        var difference = finalProgramCounter - initialProgramCounter;
        difference.should.equal(4);
      });
    });

    describe('5XY0', function () {
      beforeEach('execute opcode', function () {
        var initialProgramCounter = chipJS.programCounter;
        chipJS.registers[0] = 0x00;
        chipJS.registers[1] = 0x00;
        chipJS.execute(0x5010);
        var finalProgramCounter = chipJS.programCounter;
      });
      it('skips next instruction if VX equals VY', function () {
        var difference = finalProgramCounter - initialProgramCounter;
        difference.should.equal(4);
      });
    });

    describe('6XNN', function () {
      beforeEach('execute opcode', function () {
        chipJS.registers[0] = 0xFF;
        chipJS.execute(0x6000);
      });
      it('sets VX to 0xNN', function () {
        chipJS.registers[0].should.equal(0x00);
      });
    });

    describe('7XNN', function () {
      beforeEach('execute opcode', function () {
        chipJS.registers[0] = 0x00;
        chipJS.execute(0x7001);
      });
      it('adds 0xNN to VX', function () {
        chipJS.registers[0].should.equal(0x01);
      });
    });

    describe('8XY0', function () {
      beforeEach('execute opcode', function () {
        chipJS.registers[0] = 0x00;
        chipJS.registers[1] = 0xFF;
        chipJS.execute(0x8010);
      });
      it('stores VY in VX', function () {
        chipJS.registers[0].should.equal(0xFF);
      });
    });
    describe('8XY1', function () {
      beforeEach('execute opcode', function () {
        chipJS.registers[0] = 0x20;
        chipJS.registers[1] = 0x40;
        chipJS.execute(0x8011);
      });
      it('sets VX to bitwise (VX | VY)', function () {
        chipJS.registers[0].should.equal(0x60);
      });
    });
    describe('8XY2', function () {
      beforeEach('execute opcode', function () {
        chipJS.registers[0] = 0x99;
        chipJS.registers[1] = 0x32;
        chipJS.execute(0x8012);
      });
      it('sets VX to bitwise (VX & VY)', function () {
        chipJS.registers[0].should.equal(0x10);
      });
    });
    describe('8XY3', function () {
      beforeEach('execute opcode', function () {
        chipJS.registers[0] = 0x64;
        chipJS.registers[1] = 0x12;
        chipJS.execute(0x8013);
      });
      it('sets VX to bitwise (VX ^ VY)', function () {
        chipJS.registers[0].should.equal(0x76);
      });
    });
    describe('8XY4', function () {
      beforeEach('execute opcode', function () {
        chipJS.registers[0] = 0xFF;
        chipJS.registers[1] = 0x01;
        chipJS.execute(0x8014);
      });
      it('adds VY to VX, sets VF to 01 if carry occured, 00 if not', function () {
        chipJS.registers[0].should.equal(0x00);
        chipJS.registers[15].should.equal(0x1);
      });
    });
    describe('8XY5', function () {
      beforeEach('execute opcode', function () {
        chipJS.registers[0] = 0x00;
        chipJS.registers[1] = 0x01;
        chipJS.execute(0x8015);
      });
      it('subtracts VY from VX, sets VF to 00 if borrow occured, 01 if not', function () {
        // i.e. VX = (VX - VY)
        chipJS.registers[0].should.equal(0xFF);
        chipJS.registers[15].should.equal(0x0);
      });
    });
    describe('8XY6', function () {
      beforeEach('execute opcode', function () {
        chipJS.registers[0] = 0x0;
        chipJS.registers[1] = 0x1;
        chipJS.execute(0x8016);
      });
      it('sets VX to (VY >> 1), VF to least significant bit of original VY', function () {
        chipJS.registers[0].should.equal(0x0);
        chipJS.registers[15].should.equal(0x1);
      });
    });
    describe('8XY7', function () {
      beforeEach('execute opcode', function () {
        chipJS.registers[0] = 0x0;
        chipJS.registers[1] = 0x1;
        chipJS.execute(0x8017);
      });
      it('sets VX to (VY - VX), sets VF to 00 if borrow occured, 01 if not', function () {
        chipJS.registers[0].should.equal(0x1);
        chipJS.registers[15].should.equal(0x1);
      });
    });
    describe('8XYE', function () {
      beforeEach('execute opcode', function () {
        chipJS.registers[0] = 0x0;
        chipJS.registers[1] = 0x1;
        chipJS.execute(0x801E);
      });
      it('sets VX to (VY << 1), VF to most significant bit of original VY', function () {
        chipJS.registers[0].should.equal(0x2);
        chipJS.registers[15].should.equal(0x0);
      });
    });

    describe('9XY0', function () {
      beforeEach('execute opcode', function () {
        var initialProgramCounter = chipJS.programCounter;
        chipJS.registers[0] = 0x0;
        chipJS.registers[1] = 0x1;
        chipJS.execute(0x9010);
        var finalProgramCounter = chipJS.programCounter;
      });
      it('skips next instruction if VX does not equal VY', function () {
        var difference = finalProgramCounter - initialProgramCounter;
        difference.should.equal(4);
      });
    });

    describe('ANNN', function () {
      beforeEach('execute opcode', function () {
        chipJS.i = 0x000;
        chipJS.execute(0xA200);
      });
      it('sets address register I to 0xNNN', function () {
        chipJS.i.should.equal(0x200);
      });
    });

    describe('BNNN', function () {
      beforeEach('execute opcode', function () {
        chipJS.programCounter = 0x000;
        chipJS.registers[0] = 0x002;
        chipJS.execute(0xB200);
      });
      it('jumps to address (0xNNN + V0)', function () {
        chipJS.programCounter.should.equal(0x202);
      });
    });

    describe('CXNN', function () {
      beforeEach('execute opcode', function () {
        // 0x80 = 0b1000 0000 = 128
        chipJS.registers[0] = 0x00;
        chipJS.execute(0xC080);
      });
      it('sets VX to a random number with mask of 0xNN', function () {
        chipJS.registers[0].should.be.within(0x00, 0x80);
      });
    });

    describe('DXYN', function () {

      // this test sucks and i need to refactor it
      // like woah

      beforeEach('execute opcode', function () {
        // Draw a sprite at position VX, VY
        // with N bytes of sprite data
        // starting at the address stored in I
        chipJS.registers[0] = 0;
        chipJS.registers[1] = 0;
        chipJS.i = 0x400;
        chipJS.ram[0x400] = 0xFF;
        chipJS.execute(0xD011);
      });
      it ('draws a sprite to coords (VX, VY) 8 wide, N tall, at I', function () {
        var row0 = chipJS.display[0];  // (_, VY), VY = row
        var column0 = row0[0];  // (VX, VY), VX = column
        // therefore begin drawing at row 0, column 0
        var expectedSprite = [1, 1, 1, 1, 1, 1, 1, 1];  // 0xFF in binary
        var actualSprite = row0.slice(0, 8);

        actualSprite.should.equal(expectedSprite);
      });
    });

    describe('EX9E', function () {
      beforeEach('execute opcode', function () {
        var initialProgramCounter = chipJS.programCounter;
        chipJS.pressKey(0);
        chipJS.execute(0x509E);
        var finalProgramCounter = chipJS.programCounter;
      });
      it('skips next instruction if key of value VX is pressed', function () {
        var difference = finalProgramCounter - initialProgramCounter;
        difference.should.equal(4);
      });
    });
    describe('EXA1', function () {
      beforeEach('execute opcode', function () {
        var initialProgramCounter = chipJS.programCounter;
        chipJS.releaseKey(0);
        chipJS.execute(0x50A1);
        var finalProgramCounter = chipJS.programCounter;
      });
      it('skips next instruction if key of value VX is not pressed', function () {
        var difference = finalProgramCounter - initialProgramCounter;
        difference.should.equal(4);
      });
    });


    describe('FX07', function () {
      beforeEach('execute opcode', function () {
        chipJS.registers[0] = 0x00;
        chipJS.delayTimer = 0x80;
        chipJS.execute(0xF007);
      });
      it('stores current value of delay timer in VX', function () {
        chipJS.registers[0].should.equal(0x80);
      });
    });
    describe('FX0A', function () {
      beforeEach('execute opcode', function () {
        chipJS.execute(0xF00A);
        chipJS.pressKey(0xF);
      });
      it('waits for keypress and stores result in VX', function () {
        chipJS.registers[0].should.equal(0xF);
      });
    });
    describe('FX15', function () {
      beforeEach('execute opcode', function () {
        chipJS.registers[0] = 0x00;
        chipJS.delayTimer = 0x80;
        chipJS.execute(0xF015);
      });
      it('sets delay timer to value of VX', function () {
        chipJS.delayTimer.should.equal(0x00);
      });
    });
    describe('FX18', function () {
      beforeEach('execute opcode', function () {
        chipJS.registers[0] = 0x00;
        chipJS.soundTimer = 0x80;
        chipJS.execute(0xF018);
      });
      it('sets sound timer to value of VX', function () {
        chipJS.soundTimer.should.equal(0x00);
      });
    });
    describe('FX1E', function () {
      beforeEach('execute opcode', function () {
        chipJS.registers[0] = 0x20;
        chipJS.i = 0x200;
        chipJS.execute(0xF01E);
      });
      it('adds value of VX to address register I', function () {
        chipJS.i.should.equal(0x220);
      });
    });
    describe('FX29', function () {
      beforeEach('execute opcode', function () {
        // starting address of hexadecimal digit
        // is equal to hexadecimal digit * 5
        // e.g. 0 => 0x000, 1 => 0x005,
        // F => 0x050;
        chipJS.registers[0] = 0xF;
        chipJS.execute(0xF029);
      });
      it('sets I to starting address of font data for digit # equal to value of VX', function () {
        chipJS.i.should.equal(0x050);
      });
    });
    describe('FX33', function () {
      beforeEach('execute opcode', function () {
        // so let's assume V0 = 255.
        // therefore, we would store 2 at I,
        // 5 at I + 1, and 5 at I + 2.
        chipJS.registers[0] = 0xFF;
        chipJS.i = 0x200;
        chipJS.execute(0xF033);
      });
      it('stores binary-coded decimal equivalent of value of VX at addresses I, I+1, and I+2', function () {
        chipJS.ram[0x200].should.equal(2);
        chipJS.ram[0x201].should.equal(5);
        chipJS.ram[0x202].should.equal(5);
      });
    });
    describe('FX55', function () {
      beforeEach('execute opcode', function () {
        chipJS.registers[0] = 0xFF;
        chipJS.i = 0x200;
        chipJS.execute(0xF055);
      });
      it('stores values of V0 thru VX (inclusive) in memory starting at address I, sets I to I + X + 1 afterwards', function() {
        chipJS.ram[0x200].should.equal(0xFF);
        chipJS.i.should.equal(0x201);
      });
    });
    describe('FX65', function () {
      beforeEach('execute opcode', function () {
        chipJS.ram[0x200] = 0xFF;
        chipJS.i = 0x200;
        chipJS.execute(0xF065);
      });
      it('fills V0 thru VX (inclusive) with values in memory starting at address I, sets I to I + X + 1 afterwards', function () {
        chipJS.registers[0].should.equal(0xFF);
        chipJS.i.should.equal(0x201);
      });
    });

  });
});