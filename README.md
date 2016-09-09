# node-thermal-printer
Node.js module for EPSON and STAR thermal printers command line printing.

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
  type: 'star',                                     // Printer type: 'star' or 'epson'
  interface: '/dev/usb/lp0',                        // Printer interface
  characterSet: 'SLOVENIA'                          // Printer character set
});

printer.isPrinterConnected( function(isConnected){ } )     // Check if printer is connected, callback passes bool of status
printer.execute( function(err){ } );                       // Executes all the commands. Optional callback returns null if no error, else error message
printer.raw(new Buffer("Hello world"), function(err){ } ); // Print instantly. Optional callback returns null if no error, else error message
printer.print("Hello World");                              // Append text
printer.println("Hello World");                            // Append text with new line
printer.openCashDrawer();                                  // Kick the cash drawer
printer.cut();                                             // Cuts the paper (if printer only supports one mode use this)
printer.partialCut();                                      // Cuts the paper leaving a small bridge in middle (if printer supports multiple cut modes)
printer.beep();                                            // Sound internal beeper/buzzer (if available)
printer.upsideDown(true);                                  // Content is printed upside down (rotated 180 degrees)

printer.bold(true);                                 // Set text bold
printer.invert(true);                               // Background/text color inversion
printer.underline(true);                            // Underline text (1 dot thickness)
printer.underlineThick(true);                       // Underline text with thick line (2 dot thickness)
printer.drawLine();                                 // Draws a line
printer.newLine();                                  // Insers break line

printer.alignCenter();                              // Align text to center
printer.alignLeft();                                // Align text to left
printer.alignRight();                               // Align text to right

printer.setTypeFontA();                             // Set font type to A (default)
printer.setTypeFontB();                             // Set font type to B

printer.setTextNormal();                            // Set text to normal
printer.setTextDoubleHeight();                      // Set text to double height
printer.setTextDoubleWidth();                       // Set text to double width
printer.setTextQuadArea();                          // Set text to quad area

printer.leftRight("Left", "Right");                 // Prints text left and right
printer.table(["One", "Two", "Three"]);             // Prints table equaly
printer.tableCustom([                               // Prints table with custom settings (text, align, width, bold)
  { text:"Left", align:"LEFT", width:0.5 },
  { text:"Center", align:"CENTER", width:0.25, bold:true },
  { text:"Right", align:"RIGHT", width:0.25 }
]);

printer.code128("Code128");                         // Print code128 bar code

printer.printImage('./assets/olaii-logo-black.png', function(done){ }); // Print PNG image

print.clear();                                      // Clears printText value
print.getText();                                    // Returns printer buffer string value
print.getBuffer();                                  // Returns printer buffer
```

### Code 128 settings
```js
printer.code128("Code128", {
    width: "LARGE",          // "SMALL", "MEDIUM", "LARGE",
    height: 80,              // 50 < x < 80
    text: 2,                 // 1 - No text
                             // 2 - Text on bottom
                             // 3 - No text inline
                             // 4 - Text on bottom inline
});
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
printer.printImage('./assets/olaii-logo-black.png', function(done){
  printer.cut();
  printer.execute(function(err){
    if (err) {
      console.error("Print failed", err);
    } else {
     console.log("Print done");
    }
  });

});

```


### Docs
- STAR: http://www.starmicronics.com/support/mannualfolder/starline_cm_rev1.15_en.pdf
- EPSON: https://reference.epson-biz.com/modules/ref_escpos/index.php


### Tested printers:
- Star TSP700
- Rongta RP80US
