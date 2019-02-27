const fs = require('fs');
const PNG = require('pngjs').PNG;

printerTypes = {
  EPSON: 'epson',
  STAR: 'star'
};

class ThermalPrinter {
  constructor(initConfig) {
    const getInterface = require("./interfaces");
    this.Interface = getInterface(initConfig.interface, initConfig.options);
    this.buffer = null;
    this.config = null;
    this.printer = null;
    this.types = printerTypes;

    if (initConfig.type === this.types.STAR) {
      const Star = require('./types/star');
      this.printer = new Star();
    } else {
      const Epson = require('./types/epson');
      this.printer = new Epson();
    }

    this.config = {
      width: initConfig.width || 48,
      characterSet: initConfig.characterSet || "SLOVENIA",
      removeSpecialCharacters: initConfig.removeSpecialCharacters || false,
      replaceSpecialCharacters: initConfig.replaceSpecialCharacters || true,
      extraSpecialCharacters: this.mergeObjects(this.printer.config.specialCharacters, initConfig.extraSpecialCharacters) || this.printer.config.specialCharacters,
      options: initConfig.options
    };
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


  newLine() {
    this.append(this.printer.config.CTL_LF);
  }


  drawLine() {
    // this.newLine();
    for (var i = 0; i < this.config.width; i++) {
      if (this.config.lineChar) this.append(Buffer.from(this.config.lineChar));
      else this.append(Buffer.from([196]));
    }
    this.newLine();
  }


  leftRight(left, right) {
    this.append(left.toString());
    var width = this.config.width - left.toString().length - right.toString().length;
    for (var i = 0; i < width; i++) {
      this.append(Buffer.from(" "));
    }
    this.append(right.toString());
    this.newLine();
  }


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


  // ------------------------------ Set international character set ------------------------------
  setInternationalCharacterSet(charSet) {
    if (this.config.type == 'star') {
      // ------------------------------ Star Character set ------------------------------
      if (charSet == "USA") return this.printer.config.CHARCODE_PC437;
      if (charSet == "JAPANESE") return this.printer.config.CHARCODE_JIS;
      if (charSet == "MULTI") return this.printer.config.CHARCODE_PC858;
      if (charSet == "PORTUGUESE") return this.printer.config.CHARCODE_PC860;
      if (charSet == "CANADIAN") return this.printer.config.CHARCODE_PC863;
      if (charSet == "NORDIC") return this.printer.config.CHARCODE_PC865;
      if (charSet == "GREEK") return this.printer.config.CHARCODE_GREEK;
      if (charSet == "HEBREW") return this.printer.config.CHARCODE_HEBREW;
      if (charSet == "WESTEUROPE") return this.printer.config.CHARCODE_PC1252;
      if (charSet == "CIRLILLIC") return this.printer.config.CHARCODE_PC866;
      if (charSet == "LATIN2") return this.printer.config.CHARCODE_PC852;
      if (charSet == "SLOVENIA") return this.printer.config.CHARCODE_PC852;
      if (charSet == "THAI42") return this.printer.config.CHARCODE_THAI42;
      if (charSet == "THAI11") return this.printer.config.CHARCODE_THAI11;
      if (charSet == "THAI13") return this.printer.config.CHARCODE_THAI13;
      if (charSet == "THAI14") return this.printer.config.CHARCODE_THAI14;
      if (charSet == "THAI16") return this.printer.config.CHARCODE_THAI16;
      if (charSet == "THAI17") return this.printer.config.CHARCODE_THAI17;
      if (charSet == "THAI18") return this.printer.config.CHARCODE_THAI18;
      return null;
    } else {
      // ------------------------------ Epson Character set ------------------------------
      if (charSet == "USA") return this.printer.config.CHARCODE_USA;
      if (charSet == "FRANCE") return this.printer.config.CHARCODE_FRANCE;
      if (charSet == "GERMANY") return this.printer.config.CHARCODE_GERMANY;
      if (charSet == "UK") return this.printer.config.CHARCODE_UK;
      if (charSet == "DENMARK1") return this.printer.config.CHARCODE_DENMARK1;
      if (charSet == "SWEDEN") return this.printer.config.CHARCODE_SWEDEN;
      if (charSet == "ITALY") return this.printer.config.CHARCODE_ITALY;
      if (charSet == "SPAIN1") return this.printer.config.CHARCODE_SPAIN1;
      if (charSet == "JAPAN") return this.printer.config.CHARCODE_JAPAN;
      if (charSet == "NORWAY") return this.printer.config.CHARCODE_NORWAY;
      if (charSet == "DENMARK2") return this.printer.config.CHARCODE_DENMARK2;
      if (charSet == "SPAIN2") return this.printer.config.CHARCODE_SPAIN2;
      if (charSet == "LATINA") return this.printer.config.CHARCODE_LATINA;
      if (charSet == "KOREA") return this.printer.config.CHARCODE_KOREA;
      if (charSet == "SLOVENIA") return this.printer.config.CHARCODE_SLOVENIA;
      if (charSet == "CHINA") return this.printer.config.CHARCODE_CHINA;
      if (charSet == "VIETNAM") return this.printer.config.CHARCODE_VIETNAM;
      if (charSet == "ARABIA") return this.printer.config.CHARCODE_ARABIA;
      return null;
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


  // ------------------------------ Append ------------------------------
  append(buff) {
    if (typeof buff === "string") {

      // Remove special characters
      if (this.config.removeSpecialCharacters) {
        var unorm = require('unorm');
        var combining = /[\u0300-\u036F]/g;
        buff = unorm.nfkd(buff).replace(combining, '');
      }

      var endBuff = null;
      for (var i = 0; i < buff.length; i++) {
        var value = buff[i];
        var tempBuff = Buffer.from(value);

        // Replace special characters
        if (this.config.replaceSpecialCharacters) {
          for (var key in this.printer.config.specialCharacters) {
            if (value === key) {
              tempBuff = Buffer.from([this.printer.config.specialCharacters[key]]);
              break;
            }
          }
        }

        if (endBuff) endBuff = Buffer.concat([endBuff, tempBuff]);
        else endBuff = tempBuff;
      }

      buff = endBuff || Buffer.from("");
    }

    // Append character set
    if (!this.buffer && this.config.characterSet) {
      this.buffer = this.setInternationalCharacterSet(this.config.characterSet);
    }

    // Append buffer
    if (buff) {
      if (this.buffer) {
        this.buffer = Buffer.concat([this.buffer, buff]);
      } else {
        this.buffer = buff;
      }
    }
  };
};


module.exports = { printer: ThermalPrinter, types: printerTypes } ;