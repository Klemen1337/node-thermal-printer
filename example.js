var printer = require("./node-thermal-printer");
printer.init({
  type: 'epson',            // 'star' or 'epson'
  interface: '/dev/usb/lp0',
  width: 48,                // Number of characters in one line (default 48)
  characterSet: 'SLOVENIA'  // Character set default SLOVENIA
  // ip: "localhost",
  // port: 9000
});

printer.isPrinterConnected(function(response){
  console.log(response);
});


printer.println("Hello World!");
printer.drawLine();

printer.setTypeFontB();
printer.println("Type font B");
printer.setTypeFontA();
printer.println("Type font A");
printer.drawLine();

printer.alignCenter();
printer.println("This text is in the middle");
printer.alignRight();
printer.println("This text is on the right");
printer.alignLeft();
printer.println("This text is on the left");
printer.drawLine();

printer.setTextDoubleHeight();
printer.println("This text is double height");
printer.setTextDoubleWidth();
printer.println("Double width wooo!");
printer.setTextQuadArea();
printer.println("Quad text!");
printer.setTextNormal();
printer.println("Back to normal");
printer.drawLine();

printer.printBarcode("4126570807191");
printer.code128("4126570807191", {
  height: 50,
  text: 1
});

// printer.pdf417("4126565129008670807191");
printer.printQR("4170807191412657080719141265708");

printer.newLine();

printer.leftRight("Left", "Right");

printer.table(["One", "Two", "Three", "Four"]);

printer.tableCustom([
  { text:"Left", align:"LEFT", width:0.5 },
  { text:"Center", align:"CENTER", width:0.25, bold:true },
  { text:"Right", align:"RIGHT", width:0.25 }
]);

printer.printImage('./assets/olaii-logo-black.png', function(done){
  printer.cut();
  printer.openCashDrawer();
  printer.execute();
});
