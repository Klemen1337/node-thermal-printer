const ThermalPrinter = require("../node-thermal-printer").printer;
const Types = require("../node-thermal-printer").types;

async function example() {
  let printer = new ThermalPrinter({
    type: Types.BROTHER, // 'star' or 'epson'
    interface: process.argv[2],
    options: {
      timeout: 1000,
    },
    width: 48, // Number of characters in one line (default 48)
    characterSet: "SLOVENIA", // Character set default SLOVENIA
    removeSpecialCharacters: false, // Removes special characters - default: false
    lineCharacter: "-", // Use custom character for drawing lines
  });

  let isConnected = await printer.isPrinterConnected();
  console.log("Printer connected:", isConnected);

  printer.init();

  printer.alignCenter();
  printer.printQR("code", { cellSize: 10 });
  printer.newLine()
  
  printer.setTypeFontA();
  printer.setTextSize(30, 7);

  printer.drawLine(); // Draws a line

  printer.println("2313001");
  printer.start();

  try {
    await printer.execute();
    console.log("Print success.");
  } catch (error) {
    console.error("Print error:", error);
  }
}

example();
