const { ThermalPrinter, PrinterTypes, CharacterSet, BreakLine } = require('../node-thermal-printer');

async function example () {
  const printer = new ThermalPrinter({
    type: PrinterTypes.EPSON, // 'star' or 'epson'
    interface: process.argv[2],
    options: {
      timeout: 1000,
    },
    width: 48, // Number of characters in one line - default: 48
    characterSet: CharacterSet.SLOVENIA, // Character set - default: SLOVENIA
    breakLine: BreakLine.WORD, // Break line after WORD or CHARACTERS. Disabled with NONE - default: WORD
    removeSpecialCharacters: false, // Removes special characters - default: false
    lineCharacter: '-', // Use custom character for drawing lines - default: -
  });

  printer.print('This is a long line that will be\ncollapsed into two lines');
  printer.newLine();
  printer.println('This is a long line that will be\ncollapsed into two lines');
  printer.println('This is a long line that will be collapsed into two lines');
  printer.println('This is a long line');

  console.log(printer.getText());

  try {
    await printer.execute();
    console.log('Print success.');
  } catch (error) {
    console.error('Print error:', error);
  }
}

example();
