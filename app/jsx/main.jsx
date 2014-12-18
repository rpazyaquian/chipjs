/** @jsx React.DOM */

var React = require('react');
var ChipJS = require('chipjs');
var $ = require('jquery');

var ChipDisplay = require('./chipDisplay.jsx');

var App = {};

App.chipJS = new ChipJS();

App.component = React.render(
  <ChipDisplay chipJS={App.chipJS} />,
  document.getElementById('react-app')
);

App.initScreen = function() {
  var ctx = document.getElementById('chipjs-canvas').getContext('2d');

  ctx.canvas.width = 640;
  ctx.canvas.height = 320;
}

App.clearScreen= function() {
  var ctx = document.getElementById('chipjs-canvas').getContext('2d');
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

App.drawScreen = function() {
  var ctx = document.getElementById('chipjs-canvas').getContext('2d');

  ctx.fillStyle = "rgb(0,0,0)";

  var screenArray = App.chipJS.displayScreen();

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
0x80, 0x10
];

var smile = [
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

App.readProgram = function(event) {
  var f = event.target.files[0];

  console.log(f);

  if (f) {
    var r = new FileReader();

    r.onload = (function(inputFile) {
      return function(e) {

        var program = new Uint8Array(e.target.result);
        App.chipJS.loadProgram(program);
      };
    })(f);

    r.readAsArrayBuffer(f);
  }
};

App.runChipJS = function () {
  var self = this;
  self.chipJS.execute(0x00E0);
  self.chipJS.programCounter = 0x200;
  self.intervalID = setInterval(function() {
    self.chipJS.tick();
    self.drawScreen();
    self.component.forceUpdate();
  }, 1000/60);
  self.running = true;
};

App.stopChipJS = function () {
  var self = this;
  clearInterval(self.intervalID);
  self.intervalID = undefined;
  self.running = false;
  self.clearScreen();
};

App.toggleChipJS = function() {
  var self = this;
  if (!self.running) {
    self.runChipJS();
  } else {
    self.stopChipJS();
  }
}

$('#input-program').on("change", App.readProgram);

$('#run-button').on("click", App.toggleChipJS.bind(App));

App.chipJS.loadProgram(smile);

App.initScreen();