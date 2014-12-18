/** @jsx React.DOM */

var TestPrograms = {};

TestPrograms.maze = [
// 512, 514, 516, 518
0xa2, 0x1e, 0xc2, 0x01,
// 516
0x32, 0x01, 0xa2, 0x1a,
// 520
0xd0, 0x14, 0x70, 0x04,
// 524
0x30, 0x40, 0x12, 0x00,
// 528
0x60, 0x00, 0x71, 0x04,
// 532
0x31, 0x20, 0x12, 0x00,
// 536
0x12, 0x18, 0x80, 0x40,
// 540
0x20, 0x10, 0x20, 0x40,
// 544
0x80, 0x10
];

TestPrograms.smile = [
  0x12,
  0x1A,
  0x24,
  0x24,
  0x00,
  0x81,
  0x42,
  0x3C,
  0x62,
  0x00,
  0xC0,
  0x3F,
  0xC1,
  0x1F,
  0xD0,
  0x16,
  0x72,
  0x01,
  0x32,
  0x20,
  0x12,
  0x0A,
  0x00,
  0xE0,
  0x00,
  0xEE,
  0xA2,
  0x02,
  0x22,
  0x08,
  0x12,
  0x1C
];


TestPrograms.stack = [0x12,
0x3D,
0x00,
0x00,
0x00,
0x00,
0x00,
0x00,
0x00,
0x00,
0x00,
0xA2,
0x02,
0x8F,
0x00,
0xF0,
0x65,
0xF0,
0x1E,
0x80,
0xF0,
0xF0,
0x55,
0xA2,
0x02,
0xF0,
0x65,
0x70,
0x01,
0xA2,
0x02,
0xF0,
0x55,
0x00,
0xEE,
0xA2,
0x02,
0xF0,
0x65,
0x70,
0xFF,
0x8F,
0x00,
0xA2,
0x02,
0xF0,
0x55,
0xFF,
0x1E,
0xF0,
0x65,
0x00,
0xEE,
0xF0,
0x29,
0xDA,
0xB5,
0x7A,
0x06,
0x00,
0xEE,
0x6A,
0x03,
0x6B,
0x03,
0x60,
0x05,
0x22,
0x0B,
0x60,
0x03,
0x22,
0x0B,
0x60,
0x01,
0x22,
0x0B,
0x22,
0x23,
0x22,
0x35,
0x60,
0x09,
0x22,
0x0B,
0x22,
0x23,
0x22,
0x35,
0x22,
0x23,
0x22,
0x35,
0x22,
0x23,
0x22,
0x35]

module.exports = TestPrograms;