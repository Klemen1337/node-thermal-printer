const qr = require('qr-image');
const ThermalPrinter = require('../node-thermal-printer').printer;
const Types = require('../node-thermal-printer').types;

async function printImage() {
  const printer = new ThermalPrinter({
    type: Types.EPSON,
    interface: process.argv[2],
  });

  const qrBuffer = qr.imageSync(
    'This is a test',
    {
      type: 'png',
      margin: 0,
      size: 10,
      ec_level: 'M',
    },
  );

  printer.alignCenter();
  printer.newLine();
  await printer.printImageBuffer(qrBuffer);
  printer.newLine();

  printer.cut();
  printer.execute();
}

printImage();
