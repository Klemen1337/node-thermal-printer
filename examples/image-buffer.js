const ThermalPrinter = require("../node-thermal-printer").printer;
const Types = require("../node-thermal-printer").types;
const qr = require('qr-image');


async function printImage () {
  let printer = new ThermalPrinter({
    type: Types.EPSON,
    interface: process.argv[2]
  });

  var qr_buffer = qr.imageSync(
    "This is a test", 
    {
      type: 'png',
      margin: 0,
      size: 10,
      ec_level: "M"
    }
  );

  printer.alignCenter();
  printer.newLine();
  await printer.printImageBuffer(qr_buffer);
  printer.newLine();

  printer.cut();
  printer.execute();
}

printImage();