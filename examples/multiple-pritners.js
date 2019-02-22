const ThermalPrinter = require("../node-thermal-printer").printer;
const Types = require("../node-thermal-printer").types;
const arguments = process.argv;

// Setup printers
let printer = new ThermalPrinter({
  type: Types.EPSON,
  interface: process.argv[2]
});

let printer2 = new ThermalPrinter({
  type: Types.EPSON,
  interface: process.argv[3]
});


// Add some text
printer.println("This is a test");


// Execute
let buff = printer.getBuffer();
printer.execute();
printer2.raw(buff);