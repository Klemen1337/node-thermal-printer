const PrinterType = require('./printer-type');

class Epson extends PrinterType {
  constructor () {
    super();
    this.config = require('./epson-config');
  }

  // ------------------------------ Get paper status ------------------------------
  getStatus () {
    // https://www.epson-biz.com/modules/ref_escpos/index.php?content_id=124#gs_lr
    return this.config.TRANSMIT_PAPER_STATUS;
  }

  // ------------------------------ Append ------------------------------
  append (appendBuffer) {
    if (this.buffer) {
      this.buffer = Buffer.concat([this.buffer, appendBuffer]);
    } else {
      this.buffer = appendBuffer;
    }
  }

  // ------------------------------ Beep ------------------------------
  // "numberOfBeeps" is the number of beeps from 1 to 9
  // "lengthOfTheSound" is the length of the sound from 1 to 9 (it's not in seconds, it's just the preset value)
  beep (numberOfBeeps = 1, lengthOfTheSound = 1) {
    if (numberOfBeeps < 1 || numberOfBeeps > 9) throw new Error('numberOfBeeps: Value must be between 1 and 9');
    if (lengthOfTheSound < 1 || lengthOfTheSound > 9) throw new Error('lengthOfTheSound: Value must be between 1 and 9');
    this.buffer = null;
    this.append(this.config.BEEP);
    this.append(Buffer.from([numberOfBeeps, lengthOfTheSound]));
    return this.buffer;
  }

  // ------------------------------ Set text size ------------------------------
  setTextSize (height, width) {
    this.buffer = null;
    if (height > 7 || height < 0) throw new Error('setTextSize: Height must be between 0 and 7');
    if (width > 7 || width < 0) throw new Error('setTextSize: Width must be between 0 and 7');
    const x = Buffer.from(`${height}${width}`, 'hex');
    this.append(Buffer.from([0x1D, 0x21]));
    this.append(x);
    return this.buffer;
  }

  // ------------------------------ CODE 128 ------------------------------
  code128 (data, settings) {
    this.buffer = null;
    settings = {
      hriPos: 0,
      hriFont: 0,
      width: 3,
      height: 162,
      ...settings
    };

    // Set HRI characters Position, 0-3 (none, top, bottom, top/bottom), default 0 none
    this.append(Buffer.from([0x1d, 0x48])); // GS H
    this.append(Buffer.from([settings.hriPos]));

    // Set HRI character font. 0-4, 48-52, 97, 98 (depending on printer, 0 and 1 available on all), default 0
    this.append(Buffer.from([0x1d, 0x66])); // GS f
    this.append(Buffer.from([settings.hriFont]));

    // Set width 2-6, default 3
    this.append(Buffer.from([0x1d, 0x77])); // GS W
    this.append(Buffer.from([settings.width]));

    // Set height 1 - 255 default 162
    this.append(Buffer.from([0x1d, 0x68])); // GS h
    this.append(Buffer.from([settings.height]));

    // Print Barcode
    this.append(this.config.BARCODE_CODE128);
    this.append(Buffer.from([data.length + 2]));
    this.append(Buffer.from([0x7b, 0x42]));

    // Data
    this.append(Buffer.from(data));
    return this.buffer;
  }

  // ------------------------------ QR ------------------------------
  printQR (str, settings) {
    this.buffer = null;
    settings = {
      model: 2,
      cellSize: 3,
      correction: 'M',
      ...settings
    };

    // [Name] Select the QR code model
    // [Code] 1D 28 6B 04 00 31 41 n1 n2
    // n1
    // [49 x31, model 1]
    // [50 x32, model 2]
    // [51 x33, micro qr code]
    // n2 = 0
    // https://reference.epson-biz.com/modules/ref_escpos/index.php?content_id=140
    if (settings.model === 1) this.append(this.config.QRCODE_MODEL1);
    else if (settings.model === 3) this.append(this.config.QRCODE_MODEL3);
    else this.append(this.config.QRCODE_MODEL2);

    // [Name]: Set the size of module
    // 1D 28 6B 03 00 31 43 n
    // n depends on the printer
    // https://reference.epson-biz.com/modules/ref_escpos/index.php?content_id=141
    const size = 'QRCODE_CELLSIZE_'.concat(settings.cellSize.toString());
    this.append(this.config[size]);

    // [Name] Select the error correction level
    // 1D 28 6B 03 00 31 45 n
    // n
    // [48 x30 -> 7%]
    // [49 x31-> 15%]
    // [50 x32 -> 25%]
    // [51 x33 -> 30%]
    // https://reference.epson-biz.com/modules/ref_escpos/index.php?content_id=142
    const correction = 'QRCODE_CORRECTION_'.concat(settings.correction.toUpperCase());
    this.append(this.config[correction]);

    // [Name] Store the data in the symbol storage area
    // 1D 28  6B pL pH 31 50 30 d1...dk
    // https://reference.epson-biz.com/modules/ref_escpos/index.php?content_id=143
    const s = str.length + 3;
    const lsb = parseInt(s % 256);
    const msb = parseInt(s / 256);
    this.append(Buffer.from([0x1d, 0x28, 0x6b, lsb, msb, 0x31, 0x50, 0x30]));
    this.append(Buffer.from(str));

    // [Name] Print the symbol data in the symbol storage area
    // 1D 28 6B 03 00 31 51 m
    // https://reference.epson-biz.com/modules/ref_escpos/index.php?content_id=144
    this.append(this.config.QRCODE_PRINT);

    return this.buffer;
  }

  // ------------------------------ PDF417 ------------------------------
  pdf417 (data, settings) {
    this.buffer = null;
    settings = {
      correction: 1,
      rowHeight: 3,
      width: 3,
      columns: 0,
      truncated: false,
      ...settings
    };

    // Set error correction ratio 1 - 40, default 1
    this.append(this.config.PDF417_CORRECTION);
    this.append(Buffer.from([settings.correction]));

    // Set row height 2 - 8, default 3
    this.append(this.config.PDF417_ROW_HEIGHT);
    this.append(Buffer.from([settings.rowHeight]));

    // Set width of module 2 - 8, default 3
    this.append(this.config.PDF417_WIDTH);
    this.append(Buffer.from([settings.width]));

    // Manually set columns 1 - 30, default auto
    this.append(this.config.PDF417_COLUMNS);
    this.append(Buffer.from([settings.columns]));

    // Standard or truncated option
    if (settings.truncated) this.append(this.config.PDF417_OPTION_TRUNCATED);
    else this.append(this.config.PDF417_OPTION_STANDARD);

    // Set PDF417 bar code data
    const s = data.length + 3;
    const lsb = parseInt(s % 256);
    const msb = parseInt(s / 256);

    this.append(Buffer.from([0x1d, 0x28, 0x6b, lsb, msb, 0x30, 0x50, 0x30]));
    this.append(Buffer.from(data.toString()));

    // Print barcode
    this.append(Buffer.from(this.config.PDF417_PRINT));

    return this.buffer;
  }

  // ------------------------------ MAXI CODE ------------------------------
  maxiCode (data, settings) {
    this.buffer = null;
    settings = {
      mode: 4,
      ...settings
    };

    // Maxi Mode
    // 2 - Formatted data/structured Carrier Message with a numeric postal code. (US)
    // 3 - Formatted data/structured Carrier Message with a numeric postal code. (International)
    // 4 - Unformatted data/Standard Error Correction.
    // 5 - Unformatted data/Enhanced Error Correction.
    // 6 - Used for programming hardware devices.
    if (settings.mode == 2) this.append(this.config.MAXI_MODE2);
    else if (settings.mode == 3) this.append(this.config.MAXI_MODE3);
    else if (settings.mode == 5) this.append(this.config.MAXI_MODE5);
    else if (settings.mode == 6) this.append(this.config.MAXI_MODE6);
    else this.append(this.config.MAXI_MODE4);

    // Setup size of MaxiCode data
    const s = data.length + 3;
    const lsb = parseInt(s % 256);
    const msb = parseInt(s / 256);

    // Send Data
    this.append(Buffer.from([0x1d, 0x28, 0x6b, lsb, msb, 0x32, 0x50, 0x30]));
    this.append(Buffer.from(data.toString()));

    // Print barcode
    this.append(this.config.MAXI_PRINT);

    return this.buffer;
  }

  // ------------------------------ BARCODE ------------------------------
  printBarcode (data, type, settings) {
    this.buffer = null;
    settings = {
      hriPos: 0,
      hriFont: 0,
      width: 3,
      height: 162,
      ...settings
    };

    // Set HRI characters Position, 0-3 (none, top, bottom, top/bottom)
    this.append(Buffer.from([0x1d, 0x48])); // GS H
    this.append(Buffer.from([settings.hriPos]));

    // Set HRI character font. 0-4, 48-52, 97, 98 (depending on printer, 0 and 1 available on all), default 0
    this.append(Buffer.from([0x1d, 0x66])); // GS f
    this.append(Buffer.from([settings.hriFont]));

    // Set width 2-6, default 3
    this.append(Buffer.from([0x1d, 0x77])); // GS W
    this.append(Buffer.from([settings.width]));

    // Set height 1 - 255 default 162
    this.append(Buffer.from([0x1d, 0x68])); // GS h
    this.append(Buffer.from([settings.height]));

    // Print Barcode
    this.append(Buffer.from([0x1d, 0x6b])); // GS k

    // Select type and bit length of data
    if (type == 73) {
      this.append(Buffer.from([type, data.length + 2]));
      this.append(Buffer.from([0x7b, 0x42]));
    } else {
      this.append(Buffer.from([type, data.length]));
    }

    // Data
    this.append(Buffer.from(data));

    return this.buffer;
  }

  // ----------------------------------------------------- PRINT IMAGE -----------------------------------------------------
  // https://reference.epson-biz.com/modules/ref_escpos/index.php?content_id=88
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

    const imageBufferArray = [];
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < Math.ceil(width / 8); j++) {
        let byte = 0x0;
        for (let k = 0; k < 8; k++) {
          let pixel = pixels[i][j * 8 + k];

          // Image overflow
          if (pixel === undefined) {
            pixel = {
              a: 0,
              r: 0,
              g: 0,
              b: 0,
            };
          }

          if (pixel.a > 126) { // checking transparency
            const grayscale = parseInt(0.2126 * pixel.r + 0.7152 * pixel.g + 0.0722 * pixel.b);

            if (grayscale < 128) { // checking color
              const mask = 1 << 7 - k; // setting bitwise mask
              byte |= mask; // setting the correct bit to 1
            }
          }
        }

        imageBufferArray.push(byte);
        // imageBuffer = Buffer.concat([imageBuffer, Buffer.from([byte])]);
      }
    }

    const imageBuffer = Buffer.from(imageBufferArray);

    // Print raster bit image
    // GS v 0
    // 1D 76 30 m xL xH yL yH d1...dk
    // xL = (this.width >> 3) & 0xff;
    // xH = 0x00;
    // yL = this.height & 0xff;
    // yH = (this.height >> 8) & 0xff;
    // https://reference.epson-biz.com/modules/ref_escpos/index.php?content_id=94

    // Check if width/8 is decimal
    if (width % 8 != 0) {
      width += 8;
    }

    this.append(Buffer.from([0x1d, 0x76, 0x30, 48]));
    this.append(Buffer.from([(width >> 3) & 0xff]));
    this.append(Buffer.from([0x00]));
    this.append(Buffer.from([height & 0xff]));
    this.append(Buffer.from([(height >> 8) & 0xff]));

    // append data
    this.append(imageBuffer);

    return this.buffer;
  }
}

module.exports = Epson;
