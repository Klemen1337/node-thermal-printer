var printer = require("./printer");

printer.println("Hello world, this is a test page");
printer.bold(true);
printer.println("Hello world, this is a test page");
printer.bold(false);
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

printer.barcode("1234502", "CODE128", 2, 64, "LL", "B");
printer.QRcode("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor enim libero, est euismod nunc.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor enim libero, est euismod nunc.");

printer.cut();
printer.execute("pos.printer.u9");
