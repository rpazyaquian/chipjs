/** @jsx React.DOM */

var React = require('react');
var ChipJS = require('chipjs');

var ChipDisplay = require('./chipDisplay.jsx');

var chipJS = new ChipJS();

React.render(
  <ChipDisplay />,
  document.getElementById('react-app')
);

var drawScreen = function() {
  var ctx = document.getElementById('chipjs-canvas').getContext('2d');

  ctx.fillStyle = "rgb(0,0,0)";

  var screenArray = chipJS.displayScreen();

  for (var i = 0, rows = screenArray.length; i < rows; i++) {
    var row = screenArray[i];

    for (var j = 0, columns = row.length; j < columns; j++) {
      var xCoord = j*10;
      var yCoord = i*10;

      // draw at (j*10), (y*10)
      // console.log('drawing at '+xCoord+', '+yCoord);

      if (row[j] > 0) {
        ctx.fillRect(xCoord, yCoord, 10, 10);
      }

    }

  }

}


// test program
var maze = [
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
0x80, 0x10];

chipJS.loadProgram(maze);

var runChipJS = setInterval(function() {
  chipJS.tick();
  drawScreen();
}, 1);

