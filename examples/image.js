const ThermalPrinter = require("../node-thermal-printer").printer;
const Types = require("../node-thermal-printer").types;

async function printImage () {
  let printer = new ThermalPrinter({
    type: Types.EPSON,
    interface: process.argv[2]
  });

  await printer.printImage('./assets/olaii-logo-black-small.png');
  printer.cut();
  printer.execute();
}

printImage();