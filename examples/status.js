const ThermalPrinter = require('../node-thermal-printer').printer;
const Types = require('../node-thermal-printer').types;

async function testConnection () {
  const printer = new ThermalPrinter({
    type: Types.EPSON,
    interface: process.argv[2],
  });

  printer.getStatus();

  try {
    const status = await printer.execute({ waitForResponse: true });
    console.log('Printer status:', status);
  } catch (e) {
    console.error('Print failed:', e);
  }
}

testConnection();
