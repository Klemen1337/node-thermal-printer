var printer = require("./node-thermal-printer");
printer.init({
  type: 'star',            // 'star' or 'epson'
  interface: '/dev/usb/lp0',
  width: 48,                // Number of characters in one line (default 48)
  characterSet: 'SLOVENIA'  // Character set default SLOVENIA
  // ip: "localhost",
  // port: 9000
});


for(var i=33; i<255; i++){
  printer.print(i + ": ");
  printer.add(new Buffer([i]));
  printer.print(", ");
}

printer.cut();
printer.execute();
