const printer = require("../node-thermal-printer");

printer.init({
    type: printer.printerTypes.EPSON,
    width: 42,
    // interface: '/dev/usb/lp0',
    interface: 'tcp://10.0.1.23:9100'
});

// Print the Euro currency sign and other non ASCII characters from an UTF-8 string.
printer.println('Print special chars:\n€±‹›ČčŠšŽžĐđĆćßẞöÖÄäüÜé©®ΩضהψЖƒ');

printer.newLine();
printer.newLine();
printer.cut();
printer.execute();
