var printer = require("../node-thermal-printer");

async function printImage () {
  printer.init({
    type: printer.printerTypes.EPSON,
    interface: 'tcp://172.16.10.15',
    options: {
      timeout: 1000
    }
  });

  await printer.printImage('./assets/olaii-logo-black-small.png');
  printer.cut();
  printer.execute();
}

printImage();