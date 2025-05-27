# Node Thermal Printer v4.5.0

Node.js module for Epson, Star, Tanca, Daruma, Brother, and Custom thermal printers command line printing.

[![Join the chat at https://gitter.im/Klemen1337/node-thermal-printer](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/Klemen1337/node-thermal-printer?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Installation

```bash
npm install node-thermal-printer
```

### Linux specific

Linux requires build-essentials

```bash
sudo apt-get install build-essential
```

### Browser specifics

When using inside a browser, the network interface will not work as browsers do not allow opening TCP sockets.  
You still need to instruct the compiler to ignore node dependencies. For webpack, it can be done like this:

```bash
new webpack.IgnorePlugin({
  resourceRegExp: /^fs$|^net$/,
}),
```

## Features

```js
const { ThermalPrinter, PrinterTypes, CharacterSet, BreakLine } = require('node-thermal-printer');

let printer = new ThermalPrinter({
  type: PrinterTypes.STAR,                                  // Printer type: 'star' or 'epson'
  interface: 'tcp://xxx.xxx.xxx.xxx',                       // Printer interface
  characterSet: CharacterSet.PC852_LATIN2,                  // Printer character set
  removeSpecialCharacters: false,                           // Removes special characters - default: false
  lineCharacter: "=",                                       // Set character for lines - default: "-"
  breakLine: BreakLine.WORD,                                // Break line after WORD or CHARACTERS. Disabled with NONE - default: WORD
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
printer.setCharacterSet(CharacterSet.PC852_LATIN2);         // Set character set - default set on init
printer.setPrinterDriver(Object)                            // Set printer drive - default set on init

printer.bold(true);                                         // Set text bold
printer.invert(true);                                       // Background/text color inversion
printer.underline(true);                                    // Underline text (1 dot thickness)
printer.underlineThick(true);                               // Underline text with thick line (2 dot thickness)
printer.drawLine();                                         // Draws a line
printer.newLine();                                          // Inserts break line

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
printer.table(["One", "Two", "Three"]);                     // Prints table equally
printer.tableCustom([                                       // Prints table with custom settings (text, align, width, cols, bold)
  { text:"Left", align:"LEFT", width:0.5 },
  { text:"Center", align:"CENTER", width:0.25, bold:true },
  { text:"Right", align:"RIGHT", cols:8 }
]);

printer.code128("Code128");                                 // Print code128 bar code
printer.printQR("QR CODE");                                 // Print QR code
await printer.printImage('./assets/olaii-logo-black.png');  // Print PNG image

printer.clear();                                              // Clears printText value
printer.getText();                                            // Returns printer buffer string value
printer.getBuffer();                                          // Returns printer buffer
printer.setBuffer(newBuffer);                                 // Set the printer buffer to a copy of newBuffer
printer.getWidth();                                           // Get number of characters in one line
```

## How to run examples (Set to EPSON)

Network printer

```bash
node examples/example.js tcp://xxx.xxx.xxx.xxx
```

Printer name via Printer module

```bash
node examples/example.js 'printer:My Printer'
```

Local port or file

```bash
node examples/example.js '\\.\COM1'
```

## Interface options

| Value | Description |
|---------------------------|------------|
| `tcp://192.168.0.99:9100` | Network printer with port |
| `printer:auto`            | Auto select raw system printer via [Printer](https://www.npmjs.com/package/printer) or [Electron printer](https://www.npmjs.com/package/electron-printer) module |
| `printer:My Printer Name` | Select system printer by name via [Printer](https://www.npmjs.com/package/printer) or [Electron printer](https://www.npmjs.com/package/electron-printer) module |
| `\\.\COM1`                | Print via local port or file |

### System Printer Drivers

When using a system printer, you need to provide the driver.
Use electron-printer or printer driver:

```js
const ThermalPrinter = require("node-thermal-printer").printer;
const PrinterTypes = require("node-thermal-printer").types;
const electron = typeof process !== 'undefined' && process.versions && !!process.versions.electron;

let printer = new ThermalPrinter({
  type: PrinterTypes.EPSON,
  interface: 'printer:My Printer',
  driver: require(electron ? 'electron-printer' : 'printer')
});
```

Use a custom printer driver:

```js
const ThermalPrinter = require("node-thermal-printer").printer;
const PrinterTypes = require("node-thermal-printer").types;

let printer = new ThermalPrinter({
  type: PrinterTypes.EPSON,
  interface: 'printer:My Printer',
  driver: MyCustomDriver
});

// you can also set the driver after init:
printer.setPrinterDriver(MyCustomDriver)
```

### Network printing example

```js
const ThermalPrinter = require("node-thermal-printer").printer;
const PrinterTypes = require("node-thermal-printer").types;

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
  console.log("Print done!");
} catch (error) {
  console.error("Print failed:", error);
}
```

## 2D Barcode Examples

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

## 1D Barcode Example

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

## STAR Barcode Reference

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

### Settings characters

| # | Description                                                                         |
|:-:|-------------------------------------------------------------------------------------|
| 1 | No added under-bar characters. Executes line feed after printing a bar code         |
| 2 | Adds under-bar characters. Executes line feed after printing a bar code             |
| 3 | No added under-bar characters. Does not execute line feed after printing a bar code |
| 4 | Adds under-bar characters. Does not execute line feed after printing a bar code     |

### Settings mode

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

## Docs

- STAR: <http://www.starmicronics.com/support/mannualfolder/starline_cm_rev1.15_en.pdf>
- EPSON: <https://reference.epson-biz.com/modules/ref_escpos/index.php>

## Tested printers

- Star TSP700
- Rongta RP80US
- Rongta RP326-USE
- EPSON TM-T88V
- EPSON TM-T20X
- EPSON TM-T82IIIL
- Posman BTP-R880NP (Type "epson")
- Brother TD-4550DNWB
- Daruma DR800
- CUSTOM TG2480-H

## Character sets

- PC437_USA
- PC850_MULTILINGUAL
- PC860_PORTUGUESE
- PC863_CANADIAN_FRENCH
- PC865_NORDIC
- PC851_GREEK
- PC857_TURKISH
- PC737_GREEK
- ISO8859_7_GREEK
- WPC1252
- PC866_CYRILLIC2
- PC852_LATIN2
- SLOVENIA
- PC858_EURO
- WPC775_BALTIC_RIM
- PC855_CYRILLIC
- PC861_ICELANDIC
- PC862_HEBREW
- PC864_ARABIC
- PC869_GREEK
- ISO8859_2_LATIN2
- ISO8859_15_LATIN9
- PC1125_UKRANIAN
- WPC1250_LATIN2
- WPC1251_CYRILLIC
- WPC1253_GREEK
- WPC1254_TURKISH
- WPC1255_HEBREW
- WPC1256_ARABIC
- WPC1257_BALTIC_RIM
- WPC1258_VIETNAMESE
- KZ1048_KAZAKHSTAN

## CHANGELOG

See [CHANGELOG.md](./CHANGELOG.md)
