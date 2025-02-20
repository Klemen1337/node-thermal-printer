const ThermalPrinter = require('../node-thermal-printer').printer;
const Types = require('../node-thermal-printer').types;

async function testConnection () {
  const printer = new ThermalPrinter({
    type: Types.EPSON,
    interface: process.argv[2],
  });

  const isConnected = await printer.isPrinterConnected();
  console.log('Printer connected:', isConnected);
}

testConnection();
