const ThermalPrinter = require("../node-thermal-printer").printer;
const Types = require("../node-thermal-printer").types;


async function example () {
  let printer = new ThermalPrinter({
    type: Types.EPSON,  // 'star' or 'epson'
    interface: process.argv[2],
    options: {
      timeout: 1000
    },
    width: 48,                         // Number of characters in one line - default: 48
    characterSet: 'SLOVENIA',          // Character set - default: SLOVENIA
    removeSpecialCharacters: false,    // Removes special characters - default: false
    lineCharacter: "-",                // Use custom character for drawing lines - default: -
  });

  let isConnected = await printer.isPrinterConnected();
  console.log("Printer connected:", isConnected);

  printer.alignCenter();
  await printer.printImage('./assets/olaii-logo-black-small.png');

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
  printer.setTextSize(7,7);
  printer.println("Wow");
  printer.setTextSize(0,0);
  printer.setTextNormal();
  printer.println("This is normal");
  printer.drawLine();

  try {
    printer.printBarcode("4126570807191");
    printer.code128("4126570807191", {
      height: 50,
      text: 1
    });
    printer.beep();
  } catch (error) {
    console.error(error);
  }

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

  printer.tableCustom([
    { text:"Left", align:"LEFT", cols:8 },
    { text:"Center", align:"CENTER", cols:10, bold:true },
    { text:"Right", align:"RIGHT", cols:10 }
  ]);

  printer.cut();
  printer.openCashDrawer();

  try {
    await printer.execute();
    console.log("Print success.");
  } catch (error) {
    console.error("Print error:", error);
  }
}


example();
