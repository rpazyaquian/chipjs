var should = require("should");
var _und = require('underscore');
var ChipJS = require('../src/index.js');

describe('ChipJS', function () {

  beforeEach('instantiate ChipJS', function () {
    chipJS = new ChipJS;
  });

  describe('running a program', function () {

    beforeEach('run program', function () {
      // set V0 to 0x20
      // set V1 to 0x40
      // set V2 to V0
      // add V1 to V2
      // set I to 0x400
      // store V0 through V2 in memory
      var program = [
        0x6020,
        0x6140,
        0x8200,
        0x8214,
        0xA400,
        0xF255
      ];

      _und.each(program, function (command) {
        chipJS.execute(command);

      });

    });

    it('should execute correctly', function () {
      // expect V0 to equal 0x20
      chipJS.registers[0].should.equal(0x20);
      // expect V1 to equal 0x40
      chipJS.registers[1].should.equal(0x40);
      // expect V2 to equal 0x60
      chipJS.registers[2].should.equal(0x60);
      // expect I to equal 0x403
      chipJS.i.should.equal(0x403);
      // expect ram[0x400] to equal 0x20
      chipJS.ram[0x400].should.equal(0x20);
      // expect ram[0x401] to equal 0x40
      chipJS.ram[0x401].should.equal(0x40);
      // expect ram[0x402] to equal 0x60
      chipJS.ram[0x402].should.equal(0x60);
    });

  });
});