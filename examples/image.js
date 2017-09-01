var printer = require("../node-thermal-printer");
printer.init({
  type: printer.printerTypes.EPSON,
  interface: '/dev/usb/lp0'
});


printer.printImage('./assets/olaii-logo-black-small.png', function(done){
  printer.cut();
  printer.execute();
});