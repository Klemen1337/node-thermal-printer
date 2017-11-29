# node-thermal-printer
Node.js module for EPSON and STAR thermal printers command line printing.

[![Join the chat at https://gitter.im/Klemen1337/node-thermal-printer](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/Klemen1337/node-thermal-printer?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)


### Installation
```bash
$ npm install node-thermal-printer
```


#### Linux specific
Linux requires build-essentials
```bash
sudo apt-get install build-essential
```



### Features
```js
printer.init({
  type: 'star',                                     // Printer type: 'star' or 'epson'
  interface: '/dev/usb/lp0',                        // Printer interface
  characterSet: 'SLOVENIA',                         // Printer character set
  removeSpecialCharacters: false,                   // Removes special characters - default: false
  replaceSpecialCharacters: true,                   // Replaces special characters listed in config files - default: true
  extraSpecialCharacters:{'£':163}                  // Adds additional special characters to those listed in the config files
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
printer.printQR("https://github.com/Klemen1337/node-thermal-printer"); // Print QR code
printer.printImage('./assets/olaii-logo-black.png', function(done){ }); // Print PNG image (uses callback)

print.clear();                                      // Clears printText value
print.getText();                                    // Returns printer buffer string value
print.getBuffer();                                  // Returns printer buffer
print.getWidth();                                   // Get number of characters in one line
```

### Interace options
- `tcp://192.168.0.99:9100` - network printer with port
- `printer:auto` - auto select raw system printer via [Printer](https://www.npmjs.com/package/printer) or [Electron printer](https://www.npmjs.com/package/electron-printer) module
- `printer:My Printer Name` - select system printer by name via [Printer](https://www.npmjs.com/package/printer) or [Electron printer](https://www.npmjs.com/package/electron-printer) module module
- `\\.\COM1` - print via local port or file


### Examples
```js
var printer = require("node-thermal-printer");
printer.init({
  type: 'epson',
  interface: '/dev/usb/lp0'
});
printer.alignCenter();
printer.println("Hello world");
printer.printImageBuffer(/* PNG image buffer */, function(done){})
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

### 2D Barcode Examples
Example settings are the default when not specified.

```js
printer.code128("Code128", {
    width: "LARGE",          // "SMALL", "MEDIUM", "LARGE",
    height: 80,              // 50 < x < 80
    text: 2,                 // 1 - No text
                             // 2 - Text on bottom
                             // 3 - No text inline
                             // 4 - Text on bottom inline
});

printer.printQR("QR Code", {
    cellSize: 3,             // 1 - 8
    correction: 'M',         // L(7%), M(15%), Q(25%), H(30%)
    model: 2,                // 1 - Model 1
                             // 2 - Model 2 (standard)
                             // 3 - Micro QR
});

printer.pdf417("PDF417", {
    rowHeight: 3,            // 2 - 8
    width: 3,                // 2 - 8
    correction: 1,           // Ratio: 1 - 40
    truncated: false,        // boolean
    columns: 0               // 1 - 30, 0 auto
});

printer.maxiCode("MaxiCode", {
    mode: 4,                 // 2 - Formatted/structured Carrier Message (US)
                             // 3 - Formatted/structured Carrier Message (International)
                             // 4 - Unformatted data with Standard Error Correction.
                             // 5 - Unformatted data with Enhanced Error Correction.
                             // 6 - For programming hardware devices.
});
```

### 1D Barcode Example
```js
var data = "GS1-128"     // Barcode data (string or buffer)
var type = 74            // Barcode type (See Reference)
var settings = {         // Optional Settings
  hriPos: 0,             // Human readable character 0 - 3 (none, top, bottom, both)
  hriFont: 0,            // Human readable character font
  width: 3,              // Barcode width
  height: 168            // Barcode height
}

printer.printBarcode(data, type, settings);
```

### Epson Barcode Reference

|  # | Type                         | Possible Characters                                                                      | Length of Data         |
|:--:|------------------------------|------------------------------------------------------------------------------------------|------------------------|
| 65 | UPC-A                        | 0 - 9                                                                                    | 11, 12                 |
| 66 | UPC-E                        | 0 - 9                                                                                    | 6 – 8, 11, 12          |
| 67 | JAN13                        | 0 - 9                                                                                    | 12, 13                 |
| 68 | JAN8                         | 0 - 9                                                                                    | 7, 8                   |
| 69 | Code39                       | 0 – 9, A – Z, SP, $, %, *, +, -, ., /                                                    | 1 – 255                |
| 70 | ITF (Interleaved 2 of 5)     | 0 – 9                                                                                    | 2 – 254  (even number) |
| 71 | CODABAR  (NW-7)              | 0 – 9, A – D, a – d, $, +, −, ., /, :                                                    | 2 – 255                |
| 72 | CODE93                       | 00h – 7Fh                                                                                | 1 – 255                |
| 73 | CODE128                      | 00h – 7Fh                                                                                | 2 - 255                |
| 74 | GS1-128                      | NUL – SP(7Fh)                                                                            | 2 – 255                |
| 75 | GS1 DataBar  Omnidirectional | 0 – 9                                                                                    | 13                     |
| 76 | GS1 DataBar  Truncated       | 0 – 9                                                                                    | 13                     |
| 77 | GS1 DataBar  Limited         | 0 – 9                                                                                    | 13                     |
| 78 | GS1 DataBar  Expanded        | 0 – 9, A – D, a – d, SP, !,  ", %, $, ', (, ), *, +, ,, -, .,  /, :, ;, <, =, >, ?, _, { | 2 - 255                |


### Usage Tips
`characterSet` may be configured with `"raw"`, so no replacement is done at all.


### Docs
- STAR: http://www.starmicronics.com/support/mannualfolder/starline_cm_rev1.15_en.pdf
- EPSON: https://reference.epson-biz.com/modules/ref_escpos/index.php


### Tested printers:
- Star TSP700
- Rongta RP80US
- EPSON TM-T88V
- Posman BTP-R880NP (Type "epson")
