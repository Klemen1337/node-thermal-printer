const ThermalPrinter = require("../node-thermal-printer").printer;
const Types = require("../node-thermal-printer").types;

let printer = new ThermalPrinter({
  type: Types.EPSON,
  interface: process.argv[2]
});

printer.println("MAXI CODE");
printer.maxiCode("4126565");

printer.newLine();
printer.newLine();
printer.println("CODE93");
printer.printBarcode("4126565");

printer.newLine();
printer.newLine();
printer.println("CODE128");
printer.code128("4126565", {
  height: 50,
  text: 1
});

printer.newLine();
printer.newLine();
printer.println("PDF417");
printer.pdf417("4126565");

printer.newLine();
printer.newLine();
printer.println("QR");
printer.printQR("4126565");

printer.cut();
printer.execute();