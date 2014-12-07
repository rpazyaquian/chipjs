var should = require("should");

describe('Chip8', function () {
  describe('0---', function () {
    describe('NNN');
    describe('0E0');
    describe('0EE');
  });
  describe('1NNN');
  describe('2NNN');
  describe('3XNN');
  describe('4XNN');
  describe('5XY0');
  describe('6XNN');
  describe('7XNN');
  describe('8XY-', function () {
    describe('0');
    describe('1');
    describe('2');
    describe('3');
    describe('4');
    describe('5');
    describe('6');
    describe('7');
    describe('E');
  });
  describe('9XY0');
  describe('ANNN');
  describe('BNNN');
  describe('CXNN');
  describe('DXYN');
  describe('EX--', function () {
    describe('9E');
    describe('A1');
  });
  describe('FX--', function () {
    describe('07');
    describe('0A');
    describe('15');
    describe('18');
    describe('1E');
    describe('29');
    describe('33');
    describe('55');
    describe('65');
  });
});