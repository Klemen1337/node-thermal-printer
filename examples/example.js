var printer = require("../node-thermal-printer");
printer.init({
  type: printer.printerTypes.EPSON,  // 'star' or 'epson'
  interface: '/dev/usb/lp0',         // Linux interface
  width: 48,                         // Number of characters in one line (default 48)
  characterSet: 'SLOVENIA',          // Character set default SLOVENIA
  removeSpecialCharacters: false,    // Removes special characters - default: false
  replaceSpecialCharacters: true,    // Replaces special characters listed in config files - default: true
  // lineChar: "=",                  // Use custom character for drawing lines
  // ip: "localhost",                // Ethernet printing IP
  // port: 9000                      // Ethernet printing PORT
});

printer.isPrinterConnected(function(response){
  console.log("Printer connected:", response);
});


printer.alignCenter();
printer.printImage('./assets/olaii-logo-black-small.png', function(done){
  printer.beep();
  printer.alignLeft();
  printer.newLine();
  printer.println("Hello World!");
  printer.drawLine();

  printer.upsideDown(true);
  printer.println("Hello World upside down!");
  printer.upsideDown(false);
  printer.drawLine();

  printer.invert(true);
  printer.println("Hello World inverted!");
  printer.invert(false);
  printer.drawLine();

  printer.println("Special characters: ČčŠšŽžĐđĆćßẞöÖÄäüÜé");
  printer.drawLine();

  printer.setTypeFontB();
  printer.println("Type font B");
  printer.setTypeFontA();
  printer.println("Type font A");
  printer.drawLine();

  printer.alignLeft();
  printer.println("This text is on the left");
  printer.alignCenter();
  printer.println("This text is in the middle");
  printer.alignRight();
  printer.println("This text is on the right");
  printer.alignLeft();
  printer.drawLine();

  printer.setTextDoubleHeight();
  printer.println("This is double height");
  printer.setTextDoubleWidth();
  printer.println("This is double width");
  printer.setTextQuadArea();
  printer.println("This is quad");
  printer.setTextNormal();
  printer.println("This is normal");
  printer.drawLine();

  printer.printBarcode("4126570807191");
  printer.code128("4126570807191", {
    height: 50,
    text: 1
  });

  printer.pdf417("4126565129008670807191");
  printer.printQR("https://olaii.com");

  printer.newLine();

  printer.leftRight("Left", "Right");

  printer.table(["One", "Two", "Three", "Four"]);

  printer.tableCustom([
    { text:"Left", align:"LEFT", width:0.5 },
    { text:"Center", align:"CENTER", width:0.25, bold:true },
    { text:"Right", align:"RIGHT", width:0.25 }
  ]);


  printer.cut();
  printer.openCashDrawer();
  printer.execute();
});
