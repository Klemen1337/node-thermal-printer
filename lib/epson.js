let fs = require('fs');
let PNG = require('pngjs').PNG;
let config = require('../configs/epsonConfig');

let buffer = null;

function append(buff) {
  if (buffer) buffer = Buffer.concat([buffer, buff]);
  else buffer = buff;
}


module.exports = {

  // ------------------------------ Epson QR ------------------------------
  printQR: function (str, settings) {
    settings = settings || {};

    // [Name] Select the QR code model
    // [Code] 1D 28 6B 04 00 31 41 n1 n2
    // n1
    // [49 x31, model 1]
    // [50 x32, model 2]
    // [51 x33, micro qr code]
    // n2 = 0
    // https://reference.epson-biz.com/modules/ref_escpos/index.php?content_id=140
    if (settings.model) {
      if (settings.model === 1) append(config.QRCODE_MODEL1);
      else if (settings.model === 3) append(config.QRCODE_MODEL3);
      else append(config.QRCODE_MODEL2);
    } else {
      append(config.QRCODE_MODEL2);
    }

    // [Name]: Set the size of module
    // 1D 28 6B 03 00 31 43 n
    // n depends on the printer
    // https://reference.epson-biz.com/modules/ref_escpos/index.php?content_id=141
    if (settings.cellSize) {
      var i = "QRCODE_CELLSIZE_".concat(settings.cellSize.toString());
      append(config[i]);
    } else {
      append(config.QRCODE_CELLSIZE_3)
    }


    // [Name] Select the error correction level
    // 1D 28 6B 03 00 31 45 n
    // n
    // [48 x30 -> 7%]
    // [49 x31-> 15%]
    // [50 x32 -> 25%]
    // [51 x33 -> 30%]
    // https://reference.epson-biz.com/modules/ref_escpos/index.php?content_id=142
    if (settings.correction) {
      var i = "QRCODE_CORRECTION_".concat(settings.correction.toUpperCase());
      append(config[i]);
    } else {
      append(config.QRCODE_CORRECTION_M)
    }


    // [Name] Store the data in the symbol storage area
    // 1D 28  6B pL pH 31 50 30 d1...dk
    // https://reference.epson-biz.com/modules/ref_escpos/index.php?content_id=143
    var s = str.length + 3;
    var lsb = parseInt(s % 256);
    var msb = parseInt(s / 256);
    append(Buffer.from([0x1d, 0x28, 0x6b, lsb, msb, 0x31, 0x50, 0x30]));
    append(Buffer.from(str));


    // [Name] Print the symbol data in the symbol storage area
    // 1D 28 6B 03 00 31 51 m
    // https://reference.epson-biz.com/modules/ref_escpos/index.php?content_id=144
    append(config.QRCODE_PRINT);

    // Dont forget to clean the buffer
    let buff = buffer;
    buffer = null;
    return buff;
  },


  // ------------------------------ Epson PDF417 ------------------------------
  pdf417: function (data, settings) {
    settings = settings || {};

    // Set error correction ratio 1 - 40
    if (settings.correction) {
      append(config.PDF417_CORRECTION);
      append(Buffer.from([settings.correction]))
    } else {
      append(config.PDF417_CORRECTION);
      append(Buffer.from([0x01]))
    }

    // Set row height 2 - 8
    if (settings.rowHeight) {
      append(config.PDF417_ROW_HEIGHT);
      append(Buffer.from([settings.rowHeight]))
    } else {
      append(config.PDF417_ROW_HEIGHT);
      append(Buffer.from([0x03]))
    }

    // Set width of module 2 - 8
    if (settings.width) {
      append(config.PDF417_WIDTH);
      append(Buffer.from([settings.width]))
    } else {
      append(config.PDF417_WIDTH);
      append(Buffer.from([0x03]))
    }

    // Manually set columns 1 - 30
    if (settings.columns) {
      append(config.PDF417_COLUMNS);
      append(Buffer.from([settings.columns]))
    } else {
      // Default to auto
      append(config.PDF417_COLUMNS);
      append(Buffer.from([0x00]))
    }

    // Standard or truncated option
    if (settings.truncated) append(config.PDF417_OPTION_TRUNCATED);
    else append(config.PDF417_OPTION_STANDARD);

    // Set PDF417 bar code data
    var s = data.length + 3;
    var lsb = parseInt(s % 256);
    var msb = parseInt(s / 256);

    append(Buffer.from([0x1d, 0x28, 0x6b, lsb, msb, 0x30, 0x50, 0x30]));
    append(Buffer.from(data.toString()));

    //Print barcode
    append(Buffer.from(config.PDF417_PRINT));

    // Dont forget to clean the buffer
    let buff = buffer;
    buffer = null;
    return buff;
  },

  // ------------------------------ Epson CODE128 ------------------------------
  maxiCode: function (data, settings) {
    settings = settings || {};

    // Maxi Mode
    // 2 - Formatted data/structured Carrier Message with a numeric postal code. (US)
    // 3 - Formatted data/structured Carrier Message with a numeric postal code. (International)
    // 4 - Unformatted data/Standard Error Correction.
    // 5 - Unformatted data/Enhanced Error Correction.
    // 6 - Used for programming hardware devices.

    if (settings.mode) {
      if (settings.mode == 2) append(config.MAXI_MODE2);
      else if (settings.mode == 3) append(config.MAXI_MODE3);
      else if (settings.mode == 5) append(config.MAXI_MODE5);
      else if (settings.mode == 6) append(config.MAXI_MODE6);
      else append(config.MAXI_MODE4)
    } else {
      append(config.MAXI_MODE4)
    }

    // Setup size of MaxiCode data
    var s = data.length + 3;
    var lsb = parseInt(s % 256);
    var msb = parseInt(s / 256);

    // Send Data
    append(Buffer.from([0x1d, 0x28, 0x6b, lsb, msb, 0x32, 0x50, 0x30]));
    append(Buffer.from(data.toString()));

    // Print barcode
    append(config.MAXI_PRINT);


    // Don't forget to clean the buffer
    let buff = buffer;
    buffer = null;
    return buff;
  },


  // ------------------------------ Epson BARCODE ------------------------------
  printBarcode: function (data, type, settings) {
    settings = settings || {};

    //Set HRI characters Position, 0-3 (none, top, bottom, top/bottom)
    if (settings.hriPos) {
      append(Buffer.from([0x1d, 0x48])); // GS H
      append(Buffer.from([settings.hriPos]))
    } else {
      append(Buffer.from([0x1d, 0x48, 0x00]))
    }

    // Set HRI character font. 0-4, 48-52, 97, 98 (depending on printer, 0 and 1 available on all), default 0
    if (settings.hriFont) {
      append(Buffer.from([0x1d, 0x66])); // GS f
      append(Buffer.from([settings.hriFont]))
    } else {
      append(Buffer.from([0x1d, 0x66, 0x00]))
    }

    // Set width 2-6, default 3
    if (settings.width) {
      append(Buffer.from([0x1d, 0x77])); // GS W
      append(Buffer.from([settings.width]))
    } else {
      append(Buffer.from([0x1d, 0x77, 0x03]))
    }

    // Set height 1 - 255 default 162
    if (settings.height) {
      append(Buffer.from([0x1d, 0x68])); // GS h
      append(Buffer.from([settings.height]))
    } else {
      append(Buffer.from([0x1d, 0x68, 0xA2]))
    }

    // Print Barcode
    append(Buffer.from([0x1d, 0x6b])); // GS k
    // Select type and bit length of data
    append(Buffer.from([type, data.length]));
    // Data
    append(Buffer.from(data));


    // Don't forget to clean the buffer
    let buff = buffer;
    buffer = null;
    return buff;
  },


  // ----------------------------------------------------- PRINT IMAGE EPSON -----------------------------------------------------
  // https://reference.epson-biz.com/modules/ref_escpos/index.php?content_id=88
  printImageEpson: async function (image) {
    return new Promise((resolve, reject) => {
      let png = new PNG({
        filterType: 4
      });
  
      let pipe = fs.createReadStream(image).pipe(png);
      pipe.on('parsed', function () {
        let buff = module.exports._printImageBufferEpson(this.width, this.height, this.data);
        resolve(buff);
      });

      pipe.on('error', function (error) {
        reject(error);
      });
    });
  },


  _printImageBufferEpson: function (width, height, data) {
    // Get pixel rgba in 2D array
    var pixels = [];
    for (var i = 0; i < height; i++) {
      var line = [];
      for (var j = 0; j < width; j++) {
        var idx = (width * i + j) << 2;
        line.push({
          r: data[idx],
          g: data[idx + 1],
          b: data[idx + 2],
          a: data[idx + 3]
        });
      }
      pixels.push(line);
    }


    var imageBuffer_array = [];
    for (var i = 0; i < height; i++) {
      for (var j = 0; j < Math.ceil(width / 8); j++) {
        var byte = 0x0;
        for (var k = 0; k < 8; k++) {
          var pixel = pixels[i][j * 8 + k];

          // Image overflow
          if (pixel === undefined) {
            pixel = {
              a: 0,
              r: 0,
              g: 0,
              b: 0
            };
          }

          if (pixel.a > 126) { // checking transparency
            var grayscale = parseInt(0.2126 * pixel.r + 0.7152 * pixel.g + 0.0722 * pixel.b);

            if (grayscale < 128) { // checking color
              var mask = 1 << 7 - k; // setting bitwise mask
              byte |= mask; // setting the correct bit to 1
            }
          }
        }

        imageBuffer_array.push(byte);
        // imageBuffer = Buffer.concat([imageBuffer, Buffer.from([byte])]);
      }
    }

    let imageBuffer = Buffer.from(imageBuffer_array);

    // Print raster bit image
    // GS v 0
    // 1D 76 30	m	xL xH	yL yH d1...dk
    // xL = (this.width >> 3) & 0xff;
    // xH = 0x00;
    // yL = this.height & 0xff;
    // yH = (this.height >> 8) & 0xff;
    // https://reference.epson-biz.com/modules/ref_escpos/index.php?content_id=94

    // Check if width/8 is decimal
    if (width % 8 != 0) {
      width += 8;
    }

    append(Buffer.from([0x1d, 0x76, 0x30, 48]));
    append(Buffer.from([(width >> 3) & 0xff]));
    append(Buffer.from([0x00]));
    append(Buffer.from([height & 0xff]));
    append(Buffer.from([(height >> 8) & 0xff]));

    // append data
    append(imageBuffer);

    // Don't forget to clean the buffer
    let buff = buffer;
    buffer = null;
    return buff;
  },

};