const ThermalPrinter = require('../node-thermal-printer').printer;
const Types = require('../node-thermal-printer').types;

// Setup printers
const printer = new ThermalPrinter({
  type: Types.EPSON,
  interface: process.argv[2],
});

const printer2 = new ThermalPrinter({
  type: Types.EPSON,
  interface: process.argv[3],
});

// Add some text
printer.println('This is a test');

// Execute
const buff = printer.getBuffer();
printer.execute();
printer2.raw(buff);
