var should = require("should");
require('./assertions/beBlank');

describe('ChipJS', function () {

  describe('#execute', function() {

    beforeEach('instantiate ChipJS', function () {
      chipJS = new ChipJS;
    });

    describe('0---', function () {
      describe('0E0', function () {
        beforeEach('execute opcode', function () {
          chipJS.execute(0x00E0);
        });
        it('clears the screen', function () {
          chipJS.display.should.beBlank;
        });
      });
      describe('0EE', function () {
        beforeEach('execute opcode', function () {
          chipJS.execute(0x00EE);
        });
        // TODO
        it('returns from a subroutine');
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
        chipJS.execute(0x2400);
      });
      // TODO
      it('executes subroutine at 0xNNN');
    });
    describe('3XNN', function () {
      beforeEach('execute opcode', function () {
        var initialProgramCounter = chipJS.programCounter;
        chipJS.registers[0] = 0x00;
        chipJS.execute(0x3000);
        var finalProgramCounter = chipJS.programCounter;
      });
      // TODO
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
      // TODO
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
      // TODO
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
      // TODO
      it('sets VX to 0xNN', function () {
        chipJS.registers[0].should.equal(0x00);
      });
    });
    describe('7XNN', function () {
      beforeEach('execute opcode', function () {
        chipJS.registers[0] = 0x00;
        chipJS.execute(0x7001);
      });
      // TODO
      it('adds 0xNN to VX', function () {
        chipJS.registers[0].should.equal(0x01);
      });
    });
    describe('8XY-', function () {
      // TODO
      describe('0', function () {
        beforeEach('execute opcode', function () {
          chipJS.registers[1] = 0xFF;
          chipJS.registers[0] = 0x00;
          chipJS.execute(0x8010);
        });
        // TODO
        it('stores VY in VX', function () {
          chipJS.registers[0].should.equal(0xFF);
        });
      });
      describe('1', function () {
        beforeEach('execute opcode', function () {
          chipJS.registers[0] = 0x20;
          chipJS.registers[1] = 0x40;
          chipJS.execute(0x8011);
        });
        // TODO
        it('sets VX to bitwise (VX | VY)', function () {
          chipJS.registers[1].should.equal(0x60);
        });
      });
      describe('2', function () {
        beforeEach('execute opcode', function () {
          chipJS.execute(0x8012);
        });
        // TODO
        it('sets VX to bitwise (VX & VY)');
      });
      describe('3', function () {
        beforeEach('execute opcode', function () {
          chipJS.execute(0x8013);
        });
        // TODO
        it('sets VX to bitwise (VX ^ VY)');
      });
      describe('4', function () {
        beforeEach('execute opcode', function () {
          chipJS.execute(0x8014);
        });
        // TODO
        it('adds VY to VX, sets VF to 01 if carry occured, 00 if not');
      });
      describe('5', function () {
        beforeEach('execute opcode', function () {
          chipJS.execute(0x8015);
        });
        // TODO
        it('subtracts VY from VX, sets VF to 00 if borrow occured, 01 if not');
      });
      describe('6', function () {
        beforeEach('execute opcode', function () {
          chipJS.execute(0x8016);
        });
        // TODO
        it('sets VX to (VY >> 1), VF to least significant bit of original VY');
      });
      describe('7', function () {
        beforeEach('execute opcode', function () {
          chipJS.execute(0x8017);
        });
        // TODO
        it('sets VX to (VY - VX), sets VF to 00 if borrow occured, 01 if not');
      });
      describe('E', function () {
        beforeEach('execute opcode', function () {
          chipJS.execute(0x801E);
        });
        // TODO
        it('sets VX to (VY << 1), VF to most significant bit of original VY');
      });
    });
    describe('9XY0', function () {
      beforeEach('execute opcode', function () {
        chipJS.execute(0x9010);
      });
      // TODO
      it('skips next instruction if VX does not equal VY');
    });
    describe('ANNN', function () {
      beforeEach('execute opcode', function () {
        chipJS.execute(0xA200);
      });
      // TODO
      it('sets address register I to 0xNNN');
    });
    describe('BNNN', function () {
      beforeEach('execute opcode', function () {
        chipJS.execute(0xB200);
      });
      // TODO
      it('jumps to address (0xNNN + V0)');
    });
    describe('CXNN', function () {
      beforeEach('execute opcode', function () {
        chipJS.execute(0xC0FF);
      });
      // TODO
      it('sets VX to a random number with mask of 0xNN');
    });
    describe('DXYN', function () {
      // TODO: drawing
    });
    describe('EX--', function () {
      describe('9E', function () {
        beforeEach('execute opcode', function () {
          chipJS.execute(0x509E);
        });
        // TODO
        it('skips next instruction if key of value VX is pressed');
      });
      describe('A1', function () {
        beforeEach('execute opcode', function () {
          chipJS.execute(0x50A1);
        });
        // TODO
        it('skips next instruction if key of value VX is not pressed');
      });
    });
    describe('FX--', function () {
      describe('07', function () {
        beforeEach('execute opcode', function () {
          chipJS.execute(0xF007);
        });
        // TODO
        it('stores current value of delay timer in VX');
      });
      describe('0A', function () {
        beforeEach('execute opcode', function () {
          chipJS.execute(0xF00A);
        });
        // TODO
        it('waits for keypress and stores result in VX');
      });
      describe('15', function () {
        beforeEach('execute opcode', function () {
          chipJS.execute(0xF015);
        });
        // TODO
        it('sets delay timer to value of VX');
      });
      describe('18', function () {
        beforeEach('execute opcode', function () {
          chipJS.execute(0xF018);
        });
        // TODO
        it('sets sound timer to value of VX');
      });
      describe('1E', function () {
        beforeEach('execute opcode', function () {
          chipJS.execute(0xF01E);
        });
        // TODO
        it('adds value of VX to address register I');
      });
      describe('29', function () {
        beforeEach('execute opcode', function () {
          chipJS.execute(0xF029);
        });
        // TODO
        it('sets I to starting address of font data for digit # equal to value of VX');
      });
      describe('33', function () {
        beforeEach('execute opcode', function () {
          chipJS.execute(0xF033);
        });
        // TODO
        it('stores binary-coded decimal equivalent of value of VX at addresses I, I+1, and I+2');
      });
      describe('55', function () {
        beforeEach('execute opcode', function () {
          chipJS.execute(0xF055);
        });
        // TODO
        it('stores values of V0 thru VX (inclusive) in memory starting at address I, sets I to I + X + 1 afterwards');
      });
      describe('65', function () {
        beforeEach('execute opcode', function () {
          chipJS.execute(0xF065);
        });
        // TODO
        it('fills V0 thru VX (inclusive) with values in memory starting at address I, sets I to I + X + 1 afterwards');
      });
    });
  });
});