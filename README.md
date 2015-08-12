# node-thermal-printer
Commands are sent to ```/dev/usb/lp0```

### Installation
Dependency requires build-essentials
```bash
sudo apt-get install build-essential
```

```bash
$ npm install node-thermal-printer
```

### Features
```js
printer.init('epson');              // 'star' or 'epson'
printer.execute();                  // Executes all the commands
printer.print("Hello World");       // Append text
printer.println("Hello World");     // Append text with new line
printer.cut();                      // Cuts the paper

printer.bold(true);                 // Set text bold
printer.drawLine();                 // Draws a line

printer.alignCenter();              // Align text to center
printer.alignLeft();                // Align text to left
printer.alignRight();               // Align text to right

printer.setTypeFontA();             // Set font type to A (default)
printer.setTypeFontB();             // Set font type to B

printer.setTextNormal();            // Set text to normal
printer.setTextDoubleHeight();      // Set text to double height
printer.setTextDoubleWidth();       // Set text to double width
printer.setTextQuadArea();          // Set text to quad area
```

### Examples
```js
var printer = require("node-thermal-printer");
printer.init('epson');
printer.alignCenter();
printer.println("Hello world");
printer.cut();
printer.execute();
```