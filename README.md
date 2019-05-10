# Node Thermal Printer
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
const ThermalPrinter = require("../node-thermal-printer").printer;
const PrinterTypes = require("../node-thermal-printer").types;
const PrinterCharSets = require("../node-thermal-printer").charSets;

let printer = new ThermalPrinter({
  type: PrinterTypes.STAR,                                  // Printer type: 'star' or 'epson'
  interface: 'tcp://xxx.xxx.xxx.xxx',                       // Printer interface
  characterSet: PrinterCharSets.STAR.SLOVENIA,              // Printer character set, may be string or Buffer
  removeSpecialCharacters: false,                           // Removes special characters - default: false
  replaceSpecialCharacters: true,                           // Replaces special characters listed in config files - default: true
  encoding: 'CP1125',                                       // Converts text to encoding selected, see iconv - default: undefined
  extraSpecialCharacters:{ '£':163 },                       // Adds additional special characters to those listed in the config files
  lineCharacter: "-",                                       // Set character for lines - default: "-"
  options:{                                                 // Additional options
    timeout: 5000                                           // Connection timeout (ms) [applicable only for network printers] - default: 3000
  }
});

let isConnected = await printer.isPrinterConnected();       // Check if printer is connected, return bool of status
let execute = await printer.execute();                      // Executes all the commands. Returns success or throws error
let raw = await printer.raw(Buffer.from("Hello world"));    // Print instantly. Returns success or throws error
printer.print("Hello World");                               // Append text
printer.println("Hello World");                             // Append text with new line
printer.openCashDrawer();                                   // Kick the cash drawer
printer.cut();                                              // Cuts the paper (if printer only supports one mode use this)
printer.partialCut();                                       // Cuts the paper leaving a small bridge in middle (if printer supports multiple cut modes)
printer.beep();                                             // Sound internal beeper/buzzer (if available)
printer.upsideDown(true);                                   // Content is printed upside down (rotated 180 degrees)

printer.bold(true);                                         // Set text bold
printer.invert(true);                                       // Background/text color inversion
printer.underline(true);                                    // Underline text (1 dot thickness)
printer.underlineThick(true);                               // Underline text with thick line (2 dot thickness)
printer.drawLine();                                         // Draws a line
printer.newLine();                                          // Insers break line

printer.alignCenter();                                      // Align text to center
printer.alignLeft();                                        // Align text to left
printer.alignRight();                                       // Align text to right

printer.setTypeFontA();                                     // Set font type to A (default)
printer.setTypeFontB();                                     // Set font type to B

printer.setTextNormal();                                    // Set text to normal
printer.setTextDoubleHeight();                              // Set text to double height
printer.setTextDoubleWidth();                               // Set text to double width
printer.setTextQuadArea();                                  // Set text to quad area
printer.setTextSize(7,7);                                   // Set text height (0-7) and width (0-7)

printer.leftRight("Left", "Right");                         // Prints text left and right
printer.table(["One", "Two", "Three"]);                     // Prints table equaly
printer.tableCustom([                                       // Prints table with custom settings (text, align, width, bold)
  { text:"Left", align:"LEFT", width:0.5 },
  { text:"Center", align:"CENTER", width:0.25, bold:true },
  { text:"Right", align:"RIGHT", width:0.25 }
]);

printer.code128("Code128");                                 // Print code128 bar code
printer.printQR("QR CODE");                                 // Print QR code
await printer.printImage('./assets/olaii-logo-black.png');  // Print PNG image

print.clear();                                              // Clears printText value
print.getText();                                            // Returns printer buffer string value
print.getBuffer();                                          // Returns printer buffer
print.setBuffer(newBuffer);                                 // Set the printer buffer to a copy of newBuffer
print.getWidth();                                           // Get number of characters in one line
```


### Interace options
| Value | Descripton |
|-------|------------|
| `tcp://192.168.0.99:9100` | Network printer with port |
| `printer:auto` | Auto select raw system printer via [Printer](https://www.npmjs.com/package/printer) or [Electron printer](https://www.npmjs.com/package/electron-printer) module |
| `printer:My Printer Name` | Select system printer by name via [Printer](https://www.npmjs.com/package/printer) or [Electron printer](https://www.npmjs.com/package/electron-printer) module module |
| `\\.\COM1` | Print via local port or file |


### Example
```js
const ThermalPrinter = require("../node-thermal-printer").printer;
const PrinterTypes = require("../node-thermal-printer").types;

let printer = new ThermalPrinter({
  type: PrinterTypes.EPSON,
  interface: 'tcp://xxx.xxx.xxx.xxx'
});

printer.alignCenter();
printer.println("Hello world");
await printer.printImage('./assets/olaii-logo-black.png')
printer.cut();

try {
  let execute = printer.execute()
  console.error("Print done!");
} catch (error) {
  console.log("Print failed:", error);
}
```


### 2D Barcode Examples
Example settings are the default when not specified.

```js
printer.code128("Code128", {
    width: "LARGE",          // "SMALL", "MEDIUM", "LARGE",
    height: 80,              // 50 < x < 80
    text: 2                  // 1 - No text
                             // 2 - Text on bottom
                             // 3 - No text inline
                             // 4 - Text on bottom inline
});

printer.printQR("QR Code", {
    cellSize: 3,             // 1 - 8
    correction: 'M',         // L(7%), M(15%), Q(25%), H(30%)
    model: 2                 // 1 - Model 1
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

---

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

---

### STAR Barcode Reference
```js
var data = "TEST"        // Barcode data (string or buffer)
var type = 7             // Barcode type (See Reference)
var settings = {         // Optional Settings
  characters: 1,         // Add characters (See Reference)
  mode: 3,               // Barcode mode (See Reference)
  height: 150,           // Barcode height (0≤ height ≤255)
}

printer.printBarcode(data, type, settings);
```

### Type
| # | Type      |
|:-:|-----------|
| 0 | UPC-E     |
| 1 | UPC-A     |
| 2 | JAN/EAN8  |
| 3 | JAN/EAN13 |
| 4 | Code39    |
| 5 | ITF       |
| 6 | CODE128   |
| 7 | CODE93    |
| 8 | NW-7      |

#### Settings characters
| # | Description                                                                         |
|:-:|-------------------------------------------------------------------------------------|
| 1 | No added under-bar characters. Executes line feed after printing a bar code         |
| 2 | Adds under-bar characters. Executes line feed after printing a bar code             |
| 3 | No added under-bar characters. Does not execute line feed after printing a bar code |
| 4 | Adds under-bar characters. Does not execute line feed after printing a bar code     |

#### Settings mode
| # | UPC-E, UPC-A, JAN/EAN8, JAN/EAN13, Code128, Code93  | Code39, NW-7             | ITF                       |
|:-:|-----------------------------------------------------|--------------------------|---------------------------|
| 1 | Minimum module 2 dots                               | Narrow: Wide = 2:6 dots  | Narrow: Wide = 2:5 dots   |
| 2 | Minimum module 3 dots                               | Narrow: Wide = 3:9 dots  | Narrow: Wide = 4:10 dots  |
| 3 | Minimum module 4 dots                               | Narrow: Wide = 4:12 dots | Narrow: Wide = 6:15 dots  |
| 4 |                                                     | Narrow: Wide = 2:5 dots  | Narrow: Wide = 2:4 dots   |
| 5 |                                                     | Narrow: Wide = 3:8 dots  | Narrow: Wide = 4:8 dots   |
| 6 |                                                     | Narrow: Wide = 4:10 dots | Narrow: Wide = 6:12 dots  |
| 7 |                                                     | Narrow: Wide = 2:4 dots  | Narrow: Wide = 2:6 dots   |
| 8 |                                                     | Narrow: Wide = 3:6 dots  | Narrow: Wide = 3:9 dots   |
| 9 |                                                     | Narrow: Wide = 4:8 dots  | Narrow: Wide = 4:12 dots  |

---

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
- Epson TM T20II