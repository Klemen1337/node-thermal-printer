# node-thermal-printer

[![Join the chat at https://gitter.im/Klemen1337/node-thermal-printer](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/Klemen1337/node-thermal-printer?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

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
printer.init({
  type: 'epson',                    // Printer type: 'star' or 'epson'
  interface: '/dev/usb/lp0'
});
printer.isPrinterConnected()        // Check if printer is connected
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

print.clear();                      // Clears printText value
print.getText();                    // Returns printText value
```

### Examples
```js
var printer = require("node-thermal-printer");
printer.init({
  type: 'epson',
  interface: '/dev/usb/lp0'
});
printer.alignCenter();
printer.println("Hello world");
printer.cut();
printer.execute();
```
