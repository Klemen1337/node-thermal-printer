var printer = require("./printer");
printer.init({
  type: 'star', // 'star' or 'epson'
  interface: '/dev/usb/lp0',
  // ip: "localhost",
  // port: 9000
});

printer.isPrinterConnected(function(response){
  console.log(response);
});

printer.print("Hello world, this is a test page");
printer.drawLine();

printer.setTypeFontB();
printer.println("Type font B");
printer.setTypeFontA();
printer.println("Type font A");
printer.drawLine();

printer.alignCenter();
printer.println("This text is in the middle");
printer.alignRight();
printer.println("This text is on the right");
printer.alignLeft();
printer.println("This text is on the left");
printer.drawLine();

printer.setTextDoubleHeight();
printer.println("This text is double height");
printer.setTextDoubleWidth();
printer.println("Double width wooo!");
printer.setTextQuadArea();
printer.println("What is a quad area text?");
printer.setTextNormal();
printer.println("Back to normal");
printer.drawLine();

printer.cut();
printer.execute();
