var ThermalPrinter = require("../node-thermal-printer").printer;
var types = require("../node-thermal-printer").types;

// Setup printers
let printer = new ThermalPrinter({
  type: types.EPSON,
  interface: 'tcp://192.168.1.1'
});

let printer2 = new ThermalPrinter({
  type: types.EPSON,
  interface: 'tcp://192.168.1.2'
});

let printer3 = new ThermalPrinter({
  type: types.EPSON,
  interface: 'tcp://192.168.1.3'
});

// Add some text
printer.println("This is a test");

// Execute
let buff = printer.getBuffer();
printer.execute();
printer2.raw(buff);
printer3.raw(buff);
