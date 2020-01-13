const fs = require('fs');
const PNG = require('pngjs').PNG;
const iconv = require('iconv-lite');

const PrinterTypes = {
  EPSON: 'epson',
  STAR: 'star'
};

class ThermalPrinter {
  constructor(initConfig) {
    const getInterface = require("./interfaces");
    this.Interface = getInterface(initConfig.interface, initConfig.options, initConfig.driver);
    this.buffer = null;
    this.config = null;
    this.printer = null;
    this.types = PrinterTypes;

    if (initConfig.type === this.types.STAR) {
      const Star = require('./types/star');
      this.printer = new Star();
    } else {
      const Epson = require('./types/epson');
      this.printer = new Epson();
    }

    this.config = {
      width: parseInt(initConfig.width) || 48,
      characterSet: initConfig.characterSet || "SLOVENIA",
      removeSpecialCharacters: initConfig.removeSpecialCharacters || false,
      lineCharacter: initConfig.lineCharacter || "-",
      options: initConfig.options
    };

    // Set initial code page.
    this.setCharacterSet(this.config.characterSet);
  }


  setPrinterDriver (driver) {
    this.Interface.driver = driver
  }


  async execute() {
    try {
      return await this.Interface.execute(this.buffer);
    } catch (error) {
      throw error;
    }
  }


  cut() {
    this.append(this.printer.config.CTL_VT);
    this.append(this.printer.config.CTL_VT);
    this.append(this.printer.config.PAPER_FULL_CUT);
    this.append(this.printer.config.HW_INIT);
  }


  partialCut() {
    this.append(this.printer.config.CTL_VT);
    this.append(this.printer.config.CTL_VT);
    this.append(this.printer.config.PAPER_PART_CUT);
    this.append(this.printer.config.HW_INIT);
  }


  getWidth() {
    return parseInt(this.config.width);
  }


  getText() {
    return this.buffer.toString();
  }


  getBuffer() {
    return this.buffer;
  }


  setBuffer(newBuffer) {
    this.buffer = Buffer.from(newBuffer);
  }


  clear() {
    this.buffer = null;
  }


  add(buffer) {
    this.append(buffer);
  }


  print(text) {
    text = text || "";
    this.append(text.toString());
  }


  println(text) {
    this.print(text);
    this.append("\n");
  }


  printVerticalTab() {
    this.append(this.printer.config.CTL_VT);
  }


  bold(enabled) {
    if (enabled) this.append(this.printer.config.TXT_BOLD_ON);
    else this.append(this.printer.config.TXT_BOLD_OFF);
  }


  underline(enabled) {
    if (enabled) this.append(this.printer.config.TXT_UNDERL_ON);
    else this.append(this.printer.config.TXT_UNDERL_OFF);
  }


  underlineThick(enabled) {
    if (enabled) this.append(this.printer.config.TXT_UNDERL2_ON);
    else this.append(this.printer.config.TXT_UNDERL_OFF);
  }


  upsideDown(enabled) {
    if (enabled) this.append(this.printer.config.UPSIDE_DOWN_ON);
    else this.append(this.printer.config.UPSIDE_DOWN_OFF);
  }


  invert(enabled) {
    if (enabled) this.append(this.printer.config.TXT_INVERT_ON);
    else this.append(this.printer.config.TXT_INVERT_OFF);
  }


  openCashDrawer() {
    if (this.config.type === this.types.STAR) {
      this.append(this.printer.config.CD_KICK);
    } else {
      this.append(this.printer.config.CD_KICK_2);
      this.append(this.printer.config.CD_KICK_5);
    }
  }


  alignCenter() {
    this.append(this.printer.config.TXT_ALIGN_CT);
  }


  alignLeft() {
    this.append(this.printer.config.TXT_ALIGN_LT);
  }


  alignRight() {
    this.append(this.printer.config.TXT_ALIGN_RT);
  }


  setTypeFontA() {
    this.append(this.printer.config.TXT_FONT_A);
  }


  setTypeFontB() {
    this.append(this.printer.config.TXT_FONT_B);
  }


  setTextNormal() {
    this.append(this.printer.config.TXT_NORMAL);
  }


  setTextDoubleHeight() {
    this.append(this.printer.config.TXT_2HEIGHT);
  }


  setTextDoubleWidth() {
    this.append(this.printer.config.TXT_2WIDTH);
  }


  setTextQuadArea() {
    this.append(this.printer.config.TXT_4SQUARE);
  }


  setTextSize(height, width) {
    this.append(this.printer.setTextSize(height, width));
  }


  // ----------------------------------------------------- NEW LINE -----------------------------------------------------
  newLine() {
    this.append(this.printer.config.CTL_LF);
  }


  // ----------------------------------------------------- DRAW LINE -----------------------------------------------------
  drawLine() {
    // this.newLine();
    for (var i = 0; i < this.config.width; i++) {
      this.append(Buffer.from(this.config.lineCharacter));
    }
    this.newLine();
  }


  // ----------------------------------------------------- LEFT RIGHT -----------------------------------------------------
  leftRight(left, right) {
    this.append(left.toString());
    var width = this.config.width - left.toString().length - right.toString().length;
    for (var i = 0; i < width; i++) {
      this.append(Buffer.from(" "));
    }
    this.append(right.toString());
    this.newLine();
  }


  // ----------------------------------------------------- TABLE -----------------------------------------------------
  table(data) {
    var cellWidth = this.config.width / data.length;
    for (var i = 0; i < data.length; i++) {
      this.append(data[i].toString());
      var spaces = cellWidth - data[i].toString().length;
      for (var j = 0; j < spaces; j++) {
        this.append(Buffer.from(" "));
      }
    }
    this.newLine();
  }


  // ----------------------------------------------------- TABLE CUSTOM -----------------------------------------------------
  // Options: text, align, width, bold
  tableCustom(data) {
    var cellWidth = this.config.width / data.length;
    var secondLine = [];
    var secondLineEnabled = false;

    for (var i = 0; i < data.length; i++) {
      var tooLong = false;
      var obj = data[i];
      obj.text = obj.text.toString();

      if (obj.width) {
        cellWidth = this.config.width * obj.width;
      } else if (obj.cols) {
        cellWidth = obj.cols
      }

      if (obj.bold) {
        this.bold(true);
      }

      // If text is too wide go to next line
      if (cellWidth < obj.text.length) {
        tooLong = true;
        obj.originalText = obj.text;
        obj.text = obj.text.substring(0, cellWidth - 1);
      }

      if (obj.align == "CENTER") {
        var spaces = (cellWidth - obj.text.toString().length) / 2;
        for (var j = 0; j < spaces; j++) {
          this.append(Buffer.from(" "));
        }
        if (obj.text != '') this.append(obj.text);
        for (var j = 0; j < spaces - 1; j++) {
          this.append(Buffer.from(" "));
        }

      } else if (obj.align == "RIGHT") {
        var spaces = cellWidth - obj.text.toString().length;
        for (var j = 0; j < spaces; j++) {
          this.append(Buffer.from(" "));
        }
        if (obj.text != '') this.append(obj.text);

      } else {
        if (obj.text != '') this.append(obj.text);
        var spaces = cellWidth - obj.text.toString().length;
        for (var j = 0; j < spaces; j++) {
          this.append(Buffer.from(" "));
        }

      }

      if (obj.bold) {
        this.bold(false);
      }

      if (tooLong) {
        secondLineEnabled = true;
        obj.text = obj.originalText.substring(cellWidth - 1);
        secondLine.push(obj);
      } else {
        obj.text = "";
        secondLine.push(obj);
      }
    }

    this.newLine();

    // Print the second line
    if (secondLineEnabled) {
      this.tableCustom(secondLine);
    }
  }


  // ----------------------------------------------------- IS PRINTER CONNECTED -----------------------------------------------------
  async isPrinterConnected(exists) {
    return await this.Interface.isPrinterConnected(exists);
  }


  // ----------------------------------------------------- BEEP -----------------------------------------------------
  beep() {
    this.append(this.printer.beep());
  }

  // ----------------------------------------------------- PRINT QR -----------------------------------------------------
  printQR(data, settings) {
    this.append(this.printer.printQR(data, settings));
  }


  // ----------------------------------------------------- PRINT BARCODE -----------------------------------------------------
  printBarcode(data, type, settings) {
    this.append(this.printer.printBarcode(data, type, settings));
  }


  // ----------------------------------------------------- PRINT MAXICODE -----------------------------------------------------
  maxiCode(data, settings) {
    this.append(this.printer.maxiCode(data, settings));
  }


  // ----------------------------------------------------- PRINT CODE128 -----------------------------------------------------
  code128(data, settings) {
    this.append(this.printer.code128(data, settings));
  }


  // ----------------------------------------------------- PRINT PDF417 -----------------------------------------------------
  pdf417(data, settings) {
    this.append(this.printer.pdf417(data, settings));
  }


  // ----------------------------------------------------- PRINT IMAGE -----------------------------------------------------
  async printImage(image) {
    try {
      // Check if file exists
      fs.accessSync(image);

      // Check for file type
      if (image.slice(-4) === ".png") {
        try {
          let response = await this.printer.printImage(image);
          this.append(response);
          return response;
        } catch (error) {
          throw error;
        }
      } else {
        throw new Error("Image printing supports only PNG files.");
      }
    } catch (error) {
      throw error;
    }
  }


  // ----------------------------------------------------- PRINT IMAGE BUFFER -----------------------------------------------------
  async printImageBuffer(buffer) {
    try {
      var png = PNG.sync.read(buffer);
      let buff = this.printer.printImageBuffer(png.width, png.height, png.data);
      this.append(buff);
      return buff;
    } catch(error) {
      throw error;
    }
  }


  // ------------------------------ RAW ------------------------------
  async raw(text) {
    try {
      return await this.Interface.execute(text);
    } catch (error) {
      throw error;
    }
  }


  // ------------------------------ Merge objects ------------------------------
  mergeObjects(obj1, obj2) {
    var obj3 = {};
    for (var attrname in obj1) {
      obj3[attrname] = obj1[attrname];
    }
    for (var attrname in obj2) {
      obj3[attrname] = obj2[attrname];
    }
    return obj3;
  };


  // ------------------------------ Set character set ------------------------------
  setCharacterSet (characterSet) {
    const buffer = this.printer.config[`CODE_PAGE_${characterSet}`];
    if (buffer) {
      this.append(buffer);
      this.config.codePage = characterSet;
    } else {
      throw new Error(`Code page not recognized: '${characterSet}'`);
    }
  };


  // ------------------------------ Append ------------------------------
  append(text) {
    if (typeof text === "string") {

      // Remove special characters.
      if (this.config.removeSpecialCharacters) {
        const unorm = require('unorm');
        const combining = /[\u0300-\u036F]/g;
        text = unorm.nfkd(text).replace(combining, '');
      }

      let endBuff = null;
      for (const char of text) {

        let code = char;
        if (!/^[\x00-\x7F]$/.test(char)) {

          // Test if the active code page can print the current character.
          try {
            code = iconv.encode(char, this.printer.config.CODE_PAGES[this.config.codePage]);
          } catch (e) {
            // Probably encoding not recognized.
            console.error(e);
            code = '?';
          }

          if (code.toString() === '?') {
            // Character not available in active code page, now try all other code pages.
            for (const tmpCodePageKey of Object.keys(this.printer.config.CODE_PAGES)) {
              const tmpCodePage = this.printer.config.CODE_PAGES[tmpCodePageKey];

              try {
                code = iconv.encode(char, tmpCodePage);
              } catch (e) {
                // Probably encoding not recognized.
                console.error(e);
              }

              if (code.toString() !== '?') {
                // We found a match, change active code page.
                this.config.codePage = tmpCodePageKey;
                code = Buffer.concat([this.printer.config[`CODE_PAGE_${tmpCodePageKey}`], code]);
                break;
              }
            }
          }
        }

        endBuff = endBuff ? Buffer.concat([endBuff, Buffer.from(code)]) : Buffer.from(code);
      }
      text = endBuff;
    }

    // Append buffer
    if (text) {
      if (this.buffer) {
        this.buffer = Buffer.concat([this.buffer, text]);
      } else {
        this.buffer = text;
      }
    }
  };
};


module.exports = {
  printer: ThermalPrinter,
  types: PrinterTypes
};