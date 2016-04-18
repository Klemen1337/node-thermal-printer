var printer = require("./node-thermal-printer");
printer.init({
  type: 'star', // 'star' or 'epson'
  interface: '/dev/usb/lp0',
  width: 48 // Number of characters in one line (default 48)
  // ip: "localhost",
  // port: 9000
});

printer.isPrinterConnected(function(response){
  console.log(response);
});

printer.print("Hello world, this is a test page");
printer.drawLine();

printer.setTypeFontB();
printer.println("Type font B");
printer.setTypeFontA();
printer.print("Type font A");
printer.drawLine();

printer.alignCenter();
printer.println("This text is in the middle");
printer.alignRight();
printer.println("This text is on the right");
printer.alignLeft();
printer.print("This text is on the left");
printer.drawLine();

printer.setTextDoubleHeight();
printer.println("This text is double height");
printer.setTextDoubleWidth();
printer.println("Double width wooo!");
printer.setTextQuadArea();
printer.println("Quad text!");
printer.setTextNormal();
printer.print("Back to normal");
printer.drawLine();

printer.code128("barcode");
//printer.printQR("Test");
printer.leftRight("Left", "Right");
printer.table(["One", "Two", "Three", "Four"]);

printer.tableCustom([
  { text:"Left", align:"LEFT", width:0.5 },
  { text:"Center", align:"CENTER", width:0.25, bold:true },
  { text:"Right", align:"RIGHT", width:0.25 }
]);


printer.cut();
printer.execute();