const ThermalPrinter = require('../node-thermal-printer').printer;
const Types = require('../node-thermal-printer').types;

const printer = new ThermalPrinter({
  type: Types.EPSON,
  interface: process.argv[2],
});

// Print all avaliable charcodes
for (let i = 33; i < 255; i++) {
  printer.print(`${i}: `);
  printer.add(Buffer.from([i]));
  printer.print(', ');
}

printer.cut();
printer.execute();
