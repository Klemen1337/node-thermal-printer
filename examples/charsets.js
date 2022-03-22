const ThermalPrinter = require('../node-thermal-printer').printer;
const Types = require('../node-thermal-printer').types;

async function example() {
  const printer = new ThermalPrinter({
    type: Types.EPSON, // 'star' or 'epson'
    interface: process.argv[2],
    options: {
      timeout: 1000,
    },
    width: 48, // Number of characters in one line (default 48)
    characterSet: 'SLOVENIA', // Character set default SLOVENIA
    removeSpecialCharacters: false, // Removes special characters - default: false
    lineCharacter: '-', // Use custom character for drawing lines
  });

  printer.alignLeft();
  printer.newLine();
  printer.println('ČčŠšĆćĐđŽž');
  printer.drawLine();
  printer.setCharacterSet('PC855_CYRILLIC');
  printer.println('Все люди рождаются свободными и равными в своем достоинстве и правах.');
  printer.drawLine();
  printer.setCharacterSet('JAPAN');
  printer.println('すべての人々は自由に生まれ、尊厳と権利において平等です');
  printer.drawLine();
  printer.setCharacterSet('CHINA');
  printer.println('所有人生而自由，在尊嚴和權利上一律平等');
  printer.drawLine();
  printer.setCharacterSet('PC862_HEBREW');
  printer.println('כל בני האדם נולדים חופשיים ושווים בכבוד ובזכויות.');

  printer.cut();

  try {
    await printer.execute();
    console.log('Print success.');
  } catch (error) {
    console.error('Print error:', error);
  }
}

example();
