var printer = require("../node-thermal-printer");
printer.init({
  type: printer.printerTypes.EPSON,
  interface: '/dev/usb/lp0'
});

printer.println("MAXI CODE");
printer.maxiCode("4126565");

printer.newLine();
printer.newLine();
printer.println("BARCODE");
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