const PrinterType = require('./printer-type');

class Star extends PrinterType {
  constructor () {
    super();
    this.config = require('./star-config');
  }

  // ------------------------------ Append ------------------------------
  append (appendBuffer) {
    if (this.buffer) {
      this.buffer = Buffer.concat([this.buffer, appendBuffer]);
    } else {
      this.buffer = appendBuffer;
    }
  }

  // ------------------------------ QR ------------------------------
  printQR (str, settings) {
    this.buffer = null;
    if (!settings) {
      settings = {};
    }

    const config = {
      model: this.config.QRCODE_MODEL1,
      correctionLevel: this.config.QRCODE_CORRECTION_M,
      cellSize: this.config.QRCODE_CELLSIZE_4,
    };

    const models = {
      1: this.config.QRCODE_MODEL1,
      2: this.config.QRCODE_MODEL2,
    };

    const correctionLevels = {
      L: this.config.QRCODE_CORRECTION_L, // Correction level: L - 7%
      M: this.config.QRCODE_CORRECTION_M, // Correction level: M - 15%
      Q: this.config.QRCODE_CORRECTION_Q, // Correction level: Q - 25%
      H: this.config.QRCODE_CORRECTION_H, // Correction level: H - 30%
    };

    const cellSizes = {
      1: this.config.QRCODE_CELLSIZE_1, // Cell size 1
      2: this.config.QRCODE_CELLSIZE_2, // Cell size 2
      3: this.config.QRCODE_CELLSIZE_3, // Cell size 3
      4: this.config.QRCODE_CELLSIZE_4, // Cell size 4
      5: this.config.QRCODE_CELLSIZE_5, // Cell size 5
      6: this.config.QRCODE_CELLSIZE_6, // Cell size 6
      7: this.config.QRCODE_CELLSIZE_7, // Cell size 7
      8: this.config.QRCODE_CELLSIZE_8, // Cell size 8
    };

    if (models[settings.model]) config.model = models[settings.model];
    if (correctionLevels[settings.correctionLevel]) config.correctionLevel = correctionLevels[settings.correctionLevel];
    if (cellSizes[settings.cellSize]) config.cellSize = cellSizes[settings.cellSize];

    // [Name] Set QR code model
    // [Code] Hex. 1B 1D 79 53 30 n
    // [Defined Area] 1 ≤ n ≤ 2
    // [Initial Value] n = 2
    // [Function] Sets the model.
    //  • Parameter details
    // n | Set Model
    // ---+---------------
    // 1 | Model 1
    // 2 | Model 2
    this.append(config.model);

    // [Name] Set QR code mistake correction level
    // [Code] Hex. 1B 1D 79 53 31 n
    // [Defined Area] 0 ≤ n ≤ 3
    // [Initial Value] n = 0
    // [Function] Sets the mistake correction level.
    //  • Parameter details
    // n | Correction Level | Mistake Correction Rate (%)
    // --+------------------+----------------------------
    // 0 | L | 7
    // 1 | M | 15
    // 2 | Q | 25
    // 3 | H | 30
    this.append(config.correctionLevel);

    // [Name] Set QR code cell size
    // [Code] Hex. 1B 1D 79 53 32 n
    // [Defined Area] 1 ≤ n ≤ 8
    // [Initial Value] n = 3
    // [Function] Sets the cell size.
    //  • Parameter details
    //  • n: Cell size (Units: Dots)
    //  • It is recommended that the specification using this command be 3 ≤ n.
    //    If n = 1 or 2, check by actually using.
    this.append(config.cellSize);

    // [Name] Set QR code cell size (Auto Setting)
    // [Code] Hex. 1B 1D 79 44 31 m nL nH d1 d2 … dk
    // [Defined Area]
    // m = 0
    // 0 ≤ nL ≤ 255,
    // 0 ≤ nH ≤ 255
    // 1 ≤ nL + nH x 256 ≤ 7089 (k = nL + nH x 256)
    // 0 ≤ d ≤ 255
    // [Function]
    // Automatically expands the data type of the bar code and sets the data.
    //  • Parameter details
    //  • nL + nH x 256: Byte count of bar code data
    //  • dk: Bar code data (Max. 7089 bytes)
    //  • When using this command, the printer receives data for the number of bytes (k) specified by nL and nH.
    //    The data automatically expands to be set as the qr code data.
    //  • Indicates the number bytes of data specified by the nL and nH. Bar code data is cleared at this time.
    //  • The data storage region of this command is shared with the manual setting command so data is updated
    //    each time either command is executed.
    const s = str.length;
    const lsb = parseInt(s % 256);
    const msb = parseInt(s / 256);

    this.append(Buffer.from([lsb, msb])); // nL, nH
    this.append(Buffer.from(str.toString())); // Data
    this.append(Buffer.from([0x0a])); // NL (new line)

    // [Name] Print QR code
    // [Code] 1B 1D 79 50
    // [Function] Prints bar code data.
    // When receiving this command, if there is unprinted data in the image buffer,
    // the printer will print the bar code after printing the unprinted print data.
    // A margin of more than 4 cells is required around the QR code. The user should ensure that space.
    // Always check printed bar codes in actual use.
    this.append(this.config.QRCODE_PRINT);

    return this.buffer;
  }

  // ------------------------------ PDF417 ------------------------------
  pdf417 (data, settings) {
    this.buffer = null;
    if (settings) {
      throw new Error('PDF417 settings not yet available for star printers!');
    }

    // (1) Bar code type setting (<ESC> <GS> “x” “S”)
    // (2) Bar code data setting (<ESC> <GS> “x” “D”)
    // (3) Bar code printing (<ESC> <GS> “x” “P”)
    // (4) Bar code expansion information acquisition (<ESC> <GS> “x” “I”)

    // Set PDF417 bar code size
    // 1B 1D 78 53 30 n p1 p2
    this.append(Buffer.from([0x1b, 0x1d, 0x78, 0x53, 0x30, 0x00, 0x01, 0x02]));

    // Set PDF417 ECC (security level)
    // 1B 1D 78 53 31 n
    this.append(Buffer.from([0x1b, 0x1d, 0x78, 0x53, 0x31, 0x02]));

    // Set PDF417 module X direction size
    // 1B 1D 78 53 32 n
    this.append(Buffer.from([0x1b, 0x1d, 0x78, 0x53, 0x32, 0x02]));

    // Set PDF417 module aspect ratio
    // 1B 1D 78 53 33 n
    this.append(Buffer.from([0x1b, 0x1d, 0x78, 0x53, 0x33, 0x03]));

    // Set PDF417 bar code data
    // 1B 1D 78 44 nL nH d1 d2 … dk
    const s = data.length;
    const lsb = parseInt(s % 256);
    const msb = parseInt(s / 256);

    this.append(Buffer.from([0x1b, 0x1d, 0x78, 0x44]));
    this.append(Buffer.from([lsb, msb])); // nL, nH
    this.append(Buffer.from(data.toString())); // Data
    this.append(Buffer.from([0x0a])); // NL (new line)

    // Print PDF417 bar code
    // 1B 1D 78 50
    this.append(Buffer.from([0x1b, 0x1d, 0x78, 0x50]));

    return this.buffer;
  }

  // ------------------------------ CODE128 ------------------------------
  code128 (data, settings) {
    this.buffer = null;
    this.append(this.config.BARCODE_CODE128);

    // Barcode option
    // 1 - No text
    // 2 - Text on bottom
    // 3 - No text inline
    // 4 - Text on bottom inline
    if (settings) {
      if (settings.text == 1) this.append(this.config.BARCODE_CODE128_TEXT_1);
      else if (settings.text == 2) this.append(this.config.BARCODE_CODE128_TEXT_2);
      else if (settings.text == 3) this.append(this.config.BARCODE_CODE128_TEXT_3);
      else if (settings.text == 4) this.append(this.config.BARCODE_CODE128_TEXT_4);
    } else {
      this.append(this.config.BARCODE_CODE128_TEXT_2);
    }

    // Barcode width
    // 31 - Small
    // 32 - Medium
    // 33 - Large
    if (settings) {
      if (settings.width == 'SMALL') this.append(this.config.BARCODE_CODE128_WIDTH_SMALL);
      else if (settings.width == 'MEDIUM') this.append(this.config.BARCODE_CODE128_WIDTH_MEDIUM);
      else if (settings.width == 'LARGE') this.append(this.config.BARCODE_CODE128_WIDTH_LARGE);
    } else {
      this.append(this.config.BARCODE_CODE128_WIDTH_LARGE);
    }

    // Barcode height
    if (settings && settings.height) this.append(Buffer.from([settings.height]));
    else this.append(Buffer.from([0x50]));

    // Barcode data
    this.append(Buffer.from(data.toString()));

    // Append RS(record separator)
    this.append(Buffer.from([0x1e]));

    return this.buffer;
  }

  // ----------------------------------------------------- PRINT IMAGE -----------------------------------------------------
  async printImage (image) {
    const fs = require('fs');
    const { PNG } = require('pngjs');
    try {
      const data = fs.readFileSync(image);
      const png = PNG.sync.read(data);
      const buff = this.printImageBuffer(png.width, png.height, png.data);
      return buff;
    } catch (error) {
      throw error;
    }
  }

  printImageBuffer (width, height, data) {
    this.buffer = null;
    // Get pixel rgba in 2D array
    const pixels = [];
    for (let i = 0; i < height; i++) {
      const line = [];
      for (let j = 0; j < width; j++) {
        const idx = (width * i + j) << 2;
        line.push({
          r: data[idx],
          g: data[idx + 1],
          b: data[idx + 2],
          a: data[idx + 3],
        });
      }
      pixels.push(line);
    }

    this.append(Buffer.from([0x1b, 0x30]));

    // v3
    for (let i = 0; i < Math.ceil(height / 24); i++) {
      let imageBuffer = Buffer.from([]);
      for (let y = 0; y < 24; y++) {
        for (let j = 0; j < Math.ceil(width / 8); j++) {
          let byte = 0x0;
          for (let x = 0; x < 8; x++) {
            if ((i * 24 + y < pixels.length) && (j * 8 + x < pixels[i * 24 + y].length)) {
              const pixel = pixels[i * 24 + y][j * 8 + x];
              if (pixel.a > 126) { // checking transparency
                const grayscale = parseInt(0.2126 * pixel.r + 0.7152 * pixel.g + 0.0722 * pixel.b);

                if (grayscale < 128) { // checking color
                  const mask = 1 << 7 - x; // setting bitwise mask
                  byte |= mask; // setting the correct bit to 1
                }
              }
            }
          }
          imageBuffer = Buffer.concat([imageBuffer, Buffer.from([byte])]);
        }
      }
      this.append(Buffer.from([0x1b, 0x6b, parseInt(imageBuffer.length / 24), 0x00]));
      this.append(imageBuffer);
      this.append(Buffer.from('\n'));
    }

    this.append(Buffer.from([0x1b, 0x7a, 0x01]));

    return this.buffer;
  }

  // ------------------------------ BARCODE ------------------------------
  printBarcode (data, type, settings) {
    this.buffer = null;
    if (!settings) {
      settings = {};
    }

    // [Name] ESC b n1 n2 n3 n4 d1...dk RS
    // [Code] Hex. 1B 62 n1 n2 n3 n4 d1 ... dk 1E
    // [Defined Area]
    //   n1 (Barcode type): 0≤n1≤8, 48≤n1≤56 (0≤n1≤8)
    //   n2 (Barcode under-bar): 1≤n2≤4, 49≤n2≤52 (1≤n2≤4)
    //   n3 (Barcode mode),
    //   n4 (Barcode height) 1≤n4≤255
    //   d  (Barcode data),
    //   k  (Barcode data count) definitions differ according to the type of barcode.
    //   RS
    // [Function]
    //   Barcode printing is executed according to the following parameters.
    //   If n1, n2, n3 and n4 are acquired and detected to be out of the defined area, data up to RS is discarded.
    this.append(Buffer.from([0x1b, 0x62]));

    // n1 - Barcode type selection
    // +-----------------------+
    // | n1    | Barcode type  |
    // |-----------------------|
    // | 0, 48 | UPC-E         |
    // | 1, 49 | UPC-A         |
    // | 2, 50 | JAN/EAN8      |
    // | 3, 51 | JAN/EAN13     |
    // | 4, 52 | Code39        |
    // | 5, 53 | ITF           |
    // | 6, 54 | Code128       |
    // | 7, 55 | Code93        |
    // | 8, 56 | NW-7          |
    // +-----------------------+
    this.append(Buffer.from([type || 7]));

    // n2 - Under-bar character selection and added line feed selection
    // +--------------------------------------------------------------------------------------------+
    // | n2    | Selection                                                                          |
    // |--------------------------------------------------------------------------------------------|
    // | 1, 49 | No added under-bar charactersExecutes line feed after printing a bar code          |
    // | 2, 50 | Adds under-bar characters Executes line feed after printing a bar code             |
    // | 3, 51 | No added under-bar charactersDoes not execute line feed after printing a bar code  |
    // | 4, 52 | Adds under-bar characters Does not execute line feed after printing a bar code     |
    // +--------------------------------------------------------------------------------------------+
    this.append(Buffer.from([settings.characters || 1]));

    // n3 - Barcode mode selection
    // +-------------------------------------------------------------------------------------------+
    // | n3    |                                   Bar code type                                   |
    // |       +-----------------------------------------------------------------------------------+
    // |       | UPC-E, UPC-A, JAN/EAN8     | Code39, NW-7             | ITF                       |
    // |       | JAN/EAN13, Code128, Code93 |                          |                           |
    // +-------------------------------------------------------------------------------------------+
    // | 1, 49 | Minimum module 2 dots      | Narrow: Wide = 2:6 dots  | Narrow: Wide = 2:5 dots   |
    // | 2, 50 | Minimum module 3 dots      | Narrow: Wide = 3:9 dots  | Narrow: Wide = 4:10 dots  |
    // | 3, 51 | Minimum module 4 dots      | Narrow: Wide = 4:12 dots | Narrow: Wide = 6:15 dots  |
    // | 4, 52 | - - -                      | Narrow: Wide = 2:5 dots  | Narrow: Wide = 2:4 dots   |
    // | 5, 53 | - - -                      | Narrow: Wide = 3:8 dots  | Narrow: Wide = 4:8 dots   |
    // | 6, 54 | - - -                      | Narrow: Wide = 4:10 dots | Narrow: Wide = 6:12 dots  |
    // | 7, 55 | - - -                      | Narrow: Wide = 2:4 dots  | Narrow: Wide = 2:6 dots   |
    // | 8, 56 | - - -                      | Narrow: Wide = 3:6 dots  | Narrow: Wide = 3:9 dots   |
    // | 9, 57 | - - -                      | Narrow: Wide = 4:8 dots  | Narrow: Wide = 4:12 dots  |
    // +-------------------------------------------------------------------------------------------+
    this.append(Buffer.from([settings.mode || 2]));

    // n4 - Barcode height (dot count)
    // +-------------------------------------------------------------------------------------------------------+
    // | Specification A                                | Specification B                                      |
    // +-------------------------------------------------------------------------------------------------------+
    // | When the height of the bar code is more than   | Form feed at (Bar code height + underbar characters) |
    // | the form feed amount, the form feed amount is  |                                                      |
    // | automatically doubled.                         |                                                      |
    // +-------------------------------------------------------------------------------------------------------+
    this.append(Buffer.from([settings.height || 150]));

    // d - Barcode data
    // +----------------------------------------------------------------------------------------------------------------+
    // | Bar code type | Defined area of k             | Defined area of d                                              |
    // +----------------------------------------------------------------------------------------------------------------+
    // | UPC-E         | 11≤k≤12                       | 48≤d≤57 (”0”≤d≤”9”)                                            |
    // | UPC-A         | 11≤k≤12                       | 48≤d≤57 (”0”≤d≤”9”)                                            |
    // | JAN/EAN8      | 7≤k≤8                         | 48≤d≤57 (”0”≤d≤”9”)                                            |
    // | JAN/EAN13     | 12≤k≤13                       | 48≤d≤57 (”0”≤d≤”9”)                                            |
    // | Code39        | 1≤k                           | 48≤d≤57 (”0”≤d≤”9”)                                            |
    // |               |                               | 65≤d≤90 (”A”≤d≤”Z”)                                            |
    // |               |                               | 32, 36, 37, 43, 45, 46, 47 (SP, ”$”, ”%”, ”+”, ”-“, ”.”, ”/”)  |
    // | ITF           | 1≤k                           | 48≤d≤57 (“0”≤d≤”9”)                                           |
    // |               | When an odd number: 0 is      |                                                                |
    // |               | automatically applied to the  |                                                                |
    // |               | top.                          |                                                                |
    // | Code128       | 1≤k                           | 0≤d≤127                                                        |
    // | Code93        | 1≤k                           | 0≤d≤127                                                        |
    // | NW-7          | 1≤k                           | 48≤d≤57 (”0”≤d≤”9”)                                            |
    // |               |                               | 65≤d≤68 (”A”≤d≤”D”)                                            |
    // |               |                               | 36, 43, 45, 46, 47, 58 (”$”, ”+”, ”-“, ”.”, ”/”, ”:”)          |
    // |               |                               | 97, 98, 99, 100 (”a”, ”b”, ”c”, ”d”)                           |
    // +----------------------------------------------------------------------------------------------------------------+
    this.append(Buffer.from(data));

    // k - Barcode data count
    // • UPC – E: k = 11 (or 12)
    //   The 12th check digit is automatically applied, so it is specified and ignored.
    //   The command is ignored for data that cannot be shortened.
    //   Automatically converts data to shortened form.
    //
    // • UPC – A: k = 11 (or 12)
    //   The 12th check digit is automatically applied, so it is specified and ignored.
    //
    // • JAN/EAN – 8: k = 7 (or 8)
    //   The 8th check digit is automatically applied, so it is specified and ignored.
    //
    // • JAN/EAN -13: k = 12 (or 13)
    //   The 13th check digit cannot be automatically applied, so it is specified and ignored.
    //
    // • CODE 39: k is freely set, and maximum value differs according to the mode.
    //   Start/stop code (“*”) is automatically applied.
    //
    // • ITF: k is freely set, and maximum value differs according to the mode.
    //   If data is oddly numbered, a 0 is applied to the top.
    //
    // • CODE 128: k is freely set, and maximum value differs according to the mode and the print character type.
    //   The check character is automatically applied.
    //
    // • CODE 93: k is freely set, and maximum value differs according to the mode and the print character type.
    //   The check character (“□”) is automatically applied.
    //
    // • NW7: k is freely set, and maximum value differs according to the mode and the print character type.

    // NOTE: Not needed.
    // this.append(Buffer.from([data.length]));

    // Start/stop codes included in the data (not automatically applied).
    this.append(Buffer.from([0x1e]));

    return this.buffer;
  }
}

module.exports = Star;
