var printer = require("../node-thermal-printer");
var qr = require('qr-image');

async function printImage () {
  printer.init({
    type: printer.printerTypes.EPSON,
    interface: 'tcp://172.16.10.15',
    options: {
      timeout: 1000
    }
  });

  var qr_buffer = qr.imageSync(
    "This is a test", 
    {
      type: 'png',
      margin: 0,
      size: 10,
      ec_level: "M"
    }
  );

  printer.alignCenter();
  printer.newLine();
  await printer.printImageBuffer(qr_buffer);
  printer.newLine();

  printer.cut();
  printer.execute();
}

printImage();