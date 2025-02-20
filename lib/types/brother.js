const PrinterType = require("./printer-type");

class Brother extends PrinterType {
  constructor () {
    super();
    this.config = require("./brother-config");
  }

  // ------------------------------ Append ------------------------------
  append (appendBuffer) {
    if (this.buffer) {
      this.buffer = Buffer.concat([this.buffer, appendBuffer]);
    } else {
      this.buffer = appendBuffer;
    }
  }

  // ------------------------------ Set text size ------------------------------
  setTextSize (height, width) {
    this.buffer = null;
    if (height > 144 || height < 0)
      throw new Error("setTextSize: Height must be between 0 and 7");
    //if (width > 7 || width < 0) throw new Error("setTextSize: Width must be between 0 and 7");
    let x = Buffer.from([height]);
    this.append(Buffer.from([0x1b, 0x58, 0x00]));
    this.append(x);
    this.append(Buffer.from([0x00]));
    return this.buffer;
  }

  // ------------------------------ BARCODE ------------------------------
  printBarcode (data, type, settings) {
    this.buffer = null;
    settings = settings || {};

    // Data
    this.append(Buffer.from([0x1b, 0x69]));

    //type
    this.append(Buffer.from(type));
    //character below barcode
    this.append(Buffer.from(settings.hri));
    //width
    this.append(Buffer.from(settings.width));
    //height
    this.append(Buffer.from("h"));

    if (settings.height < 255) {
      this.append(
        Buffer.from(
          (settings.height.toString(16) + "").length < 2
            ? "0" + settings.height.toString(16)
            : settings.height.toString(16),

          "hex"
        )
      );

      this.append(Buffer.from([0x00]));
    } else {
      const h = settings.height - 256;

      this.append(
        Buffer.from(
          (h.toString(16) + "").length < 2
            ? "0" + h.toString(16)
            : h.toString(16),
          "hex"
        )
      );

      this.append(Buffer.from([0x01]));
    }

    if (type === "tb" || type === "tc") {
      this.append(Buffer.from(settings.o));
      this.append(Buffer.from(settings.c));
    }
    //Parentheses deletion
    this.append(Buffer.from(settings.e));
    //ratio between thick and thin bars
    this.append(Buffer.from(settings.z));
    //equalize bar lengths
    this.append(Buffer.from(settings.f));
    this.append(Buffer.from([0x42]));
    //data
    this.append(Buffer.from(data));
    //end
    this.append(Buffer.from([0x5c]));

    //this.append(Buffer.from([0x51,0x04,0x02,0x00,0x00,0x00,0x00,0x02,0x00]))
    //this.append(Buffer.from("115554"))
    //this.append(Buffer.from([0x5c,0x5c,0x5c]))

    return this.buffer;
  }

  printQR (str, settings) {
    this.buffer = null;
    settings = settings || {};

    this.append(Buffer.from([0x1b, 0x69, 0x51]));
    //Cell size
    this.append(
      Buffer.from(
        (settings.cellSize.toString(16) + "").length < 2
          ? "0" + settings.cellSize.toString(16)
          : settings.cellSize.toString(16),
        "hex"
      )
    );

    //Symbol type
    this.append(Buffer.from([0x02]));
    //Structured Append setting
    this.append(Buffer.from([0x00]));
    // Code number
    this.append(Buffer.from([0x00]));
    //Number of partitions
    this.append(Buffer.from([0x00]));
    //Parity data
    this.append(Buffer.from([0x00]));
    //Error correction level
    this.append(Buffer.from([0x02]));
    //Data input method
    this.append(Buffer.from([0x00]));
    //data
    this.append(Buffer.from(str));
    this.append(Buffer.from([0x5c, 0x5c, 0x5c]));
    return this.buffer;
  }

  // ----------------------------------------------------- PRINT IMAGE -----------------------------------------------------
  // https://reference.epson-biz.com/modules/ref_escpos/index.php?content_id=88
  async printImage (image) {
    let fs = require("fs");
    let PNG = require("pngjs").PNG;
    try {
      let data = fs.readFileSync(image);
      let png = PNG.sync.read(data);
      let buff = this.printImageBuffer(png.width, png.height, png.data);
      return buff;
    } catch (error) {
      throw error;
    }
  }

  printImageBuffer (width, height, data) {
    this.buffer = null;
    this.append(Buffer.from([0x1b, 33, 0x10]));

    // Get pixel rgba in 2D array
    let pixels = [];
    for (let i = 0; i < width; i++) {
      let line = [];
      for (let j = 0; j < height; j++) {
        let idx = (width * j + i) << 2;

        line.push({
          r: data[idx],
          g: data[idx + 1],
          b: data[idx + 2],
          a: data[idx + 3],
        });
      }
      pixels.push(line);
    }

    for (let j = 0; j < Math.ceil(height / 48); j++) {
      let imageBuffer_array = [];
      for (let i = 0; i < width; i++) {
        for (let g = 0; g < 6; g++) {
          let byte = 0x0;
          for (let k = 0; k < 8; k++) {
            let pixel = pixels[i][j * 48 + g * 8 + k];

            // Image overflow
            if (pixel === undefined) {
              pixel = {
                a: 0,
                r: 0,
                g: 0,
                b: 0,
              };
            }

            if (pixel.a > 126) {
              // checking transparency
              const grayscale = parseInt(
                0.2126 * pixel.r + 0.7152 * pixel.g + 0.0722 * pixel.b
              );

              if (grayscale < 128) {
                // checking color
                let mask = 1 << (7 - k); // setting bitwise mask
                byte |= mask; // setting the correct bit to 1
              }
            }
          }
          imageBuffer_array.push(byte);
        }

        // imageBuffer = Buffer.concat([imageBuffer, Buffer.from([byte])]);
      }

      this.append(Buffer.from([0x1b, 0x2a, 72, width, 0x0]));
      let imageBuffer = Buffer.from(imageBuffer_array);
      // append data
      this.append(imageBuffer);

      this.append(Buffer.from([0x0a]));
    }

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

    return this.buffer;
  }
  SetInternationalCharacterSet (n) {
    this.append(Buffer.from([0x1b, 0x52, n]));
    return this.buffer;
  }

  // Methods to be implemented
  /*
  setLandscape() {}
  setPageLength() {}
  setPageFormat() {}
  SetLeftRightMargin() {}
  SetLineFeedAmount() {}
  SetHTabPosition() {}
  SetVtabPosition() {}
  SetVPrintingPosition() {}
  SetHPrintingPosition() {}
  SetFont() {}
  SetCharacterCode() {}
  SetCharacterSpacing() {}
  SetCharacterStyle() {}
  SetBitimage() {}
  SetBarcode() {}
  Set2DBarcode() {}
  */
}

module.exports = Brother;