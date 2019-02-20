var printer = require("../node-thermal-printer");

async function testConnection () {
  // Test network printer connection
  printer.init({
    type: printer.printerTypes.EPSON,
    interface: 'tcp://172.16.10.15',
    options: {
      timeout: 1000
    }
  });

  let isConnected = await printer.isPrinterConnected();
  console.log("Printer connected:", isConnected);
}

testConnection();