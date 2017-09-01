var printer = require("../node-thermal-printer");
printer.init({
  type: printer.printerTypes.EPSON,
  interface: '/dev/usb/lp0'
});


for(var i=33; i<255; i++){
  printer.print(i + ": ");
  printer.add(new Buffer([i]));
  printer.print(", ");
}

printer.cut();
printer.execute();
