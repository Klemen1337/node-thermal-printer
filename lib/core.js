const { PNG } = require('pngjs');
const iconv = require('iconv-lite');

const PrinterTypes = {
  EPSON: 'epson',
  TANCA: 'tanca',
  STAR: 'star',
  DARUMA: 'daruma',
  BROTHER: 'brother',
  CUSTOM: 'custom',
};

const BreakLine = {
  NONE: 'NONE',
  CHARACTER: 'CHARACTER',
  WORD: 'WORD',
};

const CharacterSet = {
  PC437_USA: 'PC437_USA',
  PC850_MULTILINGUAL: 'PC850_MULTILINGUAL',
  PC860_PORTUGUESE: 'PC860_PORTUGUESE',
  PC863_CANADIAN_FRENCH: 'PC863_CANADIAN_FRENCH',
  PC865_NORDIC: 'PC865_NORDIC',
  PC851_GREEK: 'PC851_GREEK',
  PC857_TURKISH: 'PC857_TURKISH',
  PC737_GREEK: 'PC737_GREEK',
  ISO8859_7_GREEK: 'ISO8859_7_GREEK',
  WPC1252: 'WPC1252',
  PC866_CYRILLIC2: 'PC866_CYRILLIC2',
  PC852_LATIN2: 'PC852_LATIN2',
  SLOVENIA: 'SLOVENIA',
  PC858_EURO: 'PC858_EURO',
  WPC775_BALTIC_RIM: 'WPC775_BALTIC_RIM',
  PC855_CYRILLIC: 'PC855_CYRILLIC',
  PC861_ICELANDIC: 'PC861_ICELANDIC',
  PC862_HEBREW: 'PC862_HEBREW',
  PC864_ARABIC: 'PC864_ARABIC',
  PC869_GREEK: 'PC869_GREEK',
  ISO8859_2_LATIN2: 'ISO8859_2_LATIN2',
  ISO8859_15_LATIN9: 'ISO8859_15_LATIN9',
  PC1125_UKRANIAN: 'PC1125_UKRANIAN',
  WPC1250_LATIN2: 'WPC1250_LATIN2',
  WPC1251_CYRILLIC: 'WPC1251_CYRILLIC',
  WPC1253_GREEK: 'WPC1253_GREEK',
  WPC1254_TURKISH: 'WPC1254_TURKISH',
  WPC1255_HEBREW: 'WPC1255_HEBREW',
  WPC1256_ARABIC: 'WPC1256_ARABIC',
  WPC1257_BALTIC_RIM: 'WPC1257_BALTIC_RIM',
  WPC1258_VIETNAMESE: 'WPC1258_VIETNAMESE',
  KZ1048_KAZAKHSTAN: 'KZ1048_KAZAKHSTAN',
  JAPAN: 'JAPAN',
  KOREA: 'KOREA',
  CHINA: 'CHINA',
  HK_TW: 'HK_TW',
  TCVN_VIETNAMESE: 'TCVN_VIETNAMESE',
};

class ThermalPrinter {
  constructor (initConfig) {
    if (initConfig.interface) {
      const getInterface = require('./interfaces');
      this.Interface = getInterface(
        initConfig.interface,
        initConfig.options,
        initConfig.driver
      );
    }
    if (!this.Interface) throw new Error("No interface! Please set 'interface' in the config.");
    this.buffer = null;
    this.config = null;
    this.printer = null;
    this.types = PrinterTypes;

    switch (initConfig.type) {
      case this.types.EPSON:
        const Epson = require('./types/epson');
        this.printer = new Epson();
        break;
      case this.types.STAR:
        const Star = require('./types/star');
        this.printer = new Star();
        break;
      case this.types.TANCA:
        const Tanca = require('./types/tanca');
        this.printer = new Tanca();
        break;
      case this.types.DARUMA:
        const Daruma = require('./types/daruma');
        this.printer = new Daruma();
        break;
      case this.types.BROTHER:
        const Brother = require('./types/brother');
        this.printer = new Brother();
        break;
      case this.types.CUSTOM:
        const Custom = require('./types/custom');
        this.printer = new Custom();
        break;
    }
    
    if (!this.printer) {
      throw new Error(`Printer type '${initConfig.type}' not recognized!`);
    }

    this.config = {
      type: initConfig.type,
      width: parseInt(initConfig.width) || 48,
      characterSet: initConfig.characterSet,
      removeSpecialCharacters: initConfig.removeSpecialCharacters || false,
      lineCharacter: initConfig.lineCharacter || '-',
      breakLine: initConfig.breakLine || BreakLine.WORD,
      options: initConfig.options,
    };

    // Set initial code page.
    if (this.config.characterSet) this.setCharacterSet(this.config.characterSet);
  }

  setPrinterDriver (driver) {
    if (!this.Interface) throw new Error("No interface!");
    this.Interface.driver = driver;
  }

  async execute (options = {}) {
    if (!this.Interface) throw new Error("No interface!");
    try {
      return await this.Interface.execute(this.buffer, options);
    } catch (error) {
      throw error;
    }
  }

  cut ({ verticalTabAmount = 2 } = {}) {
    for (let i = 0; i < verticalTabAmount; i++) {
      this.append(this.printer.config.CTL_VT);
    }

    this.append(this.printer.config.PAPER_FULL_CUT);
    this.initHardware();
  }

  partialCut ({ verticalTabAmount = 2 } = {}) {
    for (let i = 0; i < verticalTabAmount; i++) {
      this.append(this.printer.config.CTL_VT);
    }

    this.append(this.printer.config.PAPER_PART_CUT);
    this.initHardware();
  }

  initHardware () {
    this.append(this.printer.config.HW_INIT);
  }

  getWidth () {
    return parseInt(this.config.width);
  }

  getText () {
    return this.buffer.toString();
  }

  getBuffer () {
    return this.buffer;
  }

  setBuffer (newBuffer) {
    this.buffer = Buffer.from(newBuffer);
  }

  clear () {
    this.buffer = null;
    if (this.config.characterSet) this.setCharacterSet(this.config.characterSet);
  }

  add (buffer) {
    this.append(buffer);
  }

  print (text) {
    text = text || '';
    if (this.config.breakLine != BreakLine.NONE) { // Break lines
      text = this._fold(text, this.config.width, this.config.breakLine == BreakLine.CHARACTER).join("\n");
    }
    this.append(text.toString());
  }

  println (text) {
    this.print(text);
    this.append('\n');
  }

  printVerticalTab () {
    this.append(this.printer.config.CTL_VT);
  }

  bold (enabled) {
    if (enabled) this.append(this.printer.config.TXT_BOLD_ON);
    else this.append(this.printer.config.TXT_BOLD_OFF);
  }

  underline (enabled) {
    if (enabled) this.append(this.printer.config.TXT_UNDERL_ON);
    else this.append(this.printer.config.TXT_UNDERL_OFF);
  }

  underlineThick (enabled) {
    if (enabled) this.append(this.printer.config.TXT_UNDERL2_ON);
    else this.append(this.printer.config.TXT_UNDERL_OFF);
  }

  upsideDown (enabled) {
    if (enabled) this.append(this.printer.config.UPSIDE_DOWN_ON);
    else this.append(this.printer.config.UPSIDE_DOWN_OFF);
  }

  invert (enabled) {
    if (enabled) this.append(this.printer.config.TXT_INVERT_ON);
    else this.append(this.printer.config.TXT_INVERT_OFF);
  }

  openCashDrawer () {
    if (this.config.type === this.types.STAR) {
      this.append(this.printer.config.CD_KICK);
    } else {
      this.append(this.printer.config.CD_KICK_2);
      this.append(this.printer.config.CD_KICK_5);
    }
  }

  alignCenter () {
    this.append(this.printer.config.TXT_ALIGN_CT);
  }

  alignLeft () {
    this.append(this.printer.config.TXT_ALIGN_LT);
  }

  alignRight () {
    this.append(this.printer.config.TXT_ALIGN_RT);
  }

  setTypeFontA () {
    this.append(this.printer.config.TXT_FONT_A);
  }

  setTypeFontB () {
    this.append(this.printer.config.TXT_FONT_B);
  }

  setTextNormal () {
    this.append(this.printer.config.TXT_NORMAL);
  }

  setTextDoubleHeight () {
    this.append(this.printer.config.TXT_2HEIGHT);
  }

  setTextDoubleWidth () {
    this.append(this.printer.config.TXT_2WIDTH);
  }

  setTextQuadArea () {
    this.append(this.printer.config.TXT_4SQUARE);
  }

  setTextSize (height, width) {
    this.append(this.printer.setTextSize(height, width));
  }

  // ----------------------------------------------------- NEW LINE -----------------------------------------------------
  newLine () {
    this.append(this.printer.config.CTL_LF);
  }

  // ----------------------------------------------------- DRAW LINE -----------------------------------------------------
  drawLine (character = this.config.lineCharacter) {
    for (let i = 0; i < this.config.width; i++) {
      this.append(Buffer.from(character));
    }
    this.newLine();
  }

  // ----------------------------------------------------- LEFT RIGHT -----------------------------------------------------
  leftRight (left, right) {
    this.append(left.toString());
    const width = this.config.width - left.toString().length - right.toString().length;
    for (let i = 0; i < width; i++) {
      this.append(Buffer.from(' '));
    }
    this.append(right.toString());
    this.newLine();
  }

  // ----------------------------------------------------- TABLE -----------------------------------------------------
  table (data) {
    const cellWidth = this.config.width / data.length;
    for (let i = 0; i < data.length; i++) {
      this.append(data[i].toString());
      const spaces = cellWidth - data[i].toString().length;
      for (let j = 0; j < spaces; j++) {
        this.append(Buffer.from(' '));
      }
    }
    this.newLine();
  }

  // ----------------------------------------------------- TABLE CUSTOM -----------------------------------------------------
  // Options: text, align, width, bold
  tableCustom (data) {
    let cellWidth = this.config.width / data.length;
    const secondLine = [];
    let secondLineEnabled = false;

    for (let i = 0; i < data.length; i++) {
      let tooLong = false;
      const obj = data[i];
      obj.text = obj.text.toString();

      if (obj.width) {
        cellWidth = this.config.width * obj.width;
      } else if (obj.cols) {
        cellWidth = obj.cols;
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

      if (obj.align == 'CENTER') {
        const spaces = (cellWidth - obj.text.toString().length) / 2;
        for (let j = 0; j < spaces; j++) {
          this.append(Buffer.from(' '));
        }
        if (obj.text != '') this.append(obj.text);
        for (let j = 0; j < spaces - 1; j++) {
          this.append(Buffer.from(' '));
        }
      } else if (obj.align == 'RIGHT') {
        const spaces = cellWidth - obj.text.toString().length;
        for (let j = 0; j < spaces; j++) {
          this.append(Buffer.from(' '));
        }
        if (obj.text != '') this.append(obj.text);
      } else {
        if (obj.text != '') this.append(obj.text);
        const spaces = cellWidth - obj.text.toString().length;
        for (let j = 0; j < spaces; j++) {
          this.append(Buffer.from(' '));
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
        obj.text = '';
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
  async isPrinterConnected (exists) {
    return this.Interface.isPrinterConnected(exists);
  }

  // ----------------------------------------------------- GET PRINTER STATUS -----------------------------------------------------
  async getStatus () {
    this.append(this.printer.getStatus());
  }

  // ----------------------------------------------------- BEEP -----------------------------------------------------
  beep (numberOfBeeps, lengthOfTheSound) {
    this.append(this.printer.beep(numberOfBeeps, lengthOfTheSound));
  }

  // ----------------------------------------------------- PRINT QR -----------------------------------------------------
  printQR (data, settings) {
    this.append(this.printer.printQR(data, settings));
  }

  // ----------------------------------------------------- PRINT BARCODE -----------------------------------------------------
  printBarcode (data, type, settings) {
    this.append(this.printer.printBarcode(data, type, settings));
  }

  // ----------------------------------------------------- PRINT MAXICODE -----------------------------------------------------
  maxiCode (data, settings) {
    this.append(this.printer.maxiCode(data, settings));
  }

  // ----------------------------------------------------- PRINT CODE128 -----------------------------------------------------
  code128 (data, settings) {
    this.append(this.printer.code128(data, settings));
  }

  // ----------------------------------------------------- PRINT PDF417 -----------------------------------------------------
  pdf417 (data, settings) {
    this.append(this.printer.pdf417(data, settings));
  }

  // ----------------------------------------------------- PRINT IMAGE -----------------------------------------------------
  async printImage (image) {
    try {
      const fs = require('fs');
      // Check if file exists
      fs.accessSync(image);

      // Check for file type
      if (image.slice(-4) === '.png') {
        try {
          const response = await this.printer.printImage(image);
          this.append(response);
          return response;
        } catch (error) {
          throw error;
        }
      } else {
        throw new Error('Image printing supports only PNG files.');
      }
    } catch (error) {
      throw error;
    }
  }

  // ----------------------------------------------------- PRINT IMAGE BUFFER -----------------------------------------------------
  async printImageBuffer (buffer) {
    try {
      const png = PNG.sync.read(buffer);
      const buff = this.printer.printImageBuffer(png.width, png.height, png.data);
      this.append(buff);
      return buff;
    } catch (error) {
      throw error;
    }
  }

  // ------------------------------ RAW ------------------------------
  async raw (text) {
    try {
      return await this.Interface.execute(text);
    } catch (error) {
      throw error;
    }
  }

  // ------------------------------ Merge objects ------------------------------
  mergeObjects (obj1, obj2) {
    const obj3 = {};
    for (const attrname in obj1) {
      obj3[attrname] = obj1[attrname];
    }
    for (const attrname in obj2) {
      obj3[attrname] = obj2[attrname];
    }
    return obj3;
  }

  // ------------------------------ Set character set ------------------------------
  setCharacterSet (characterSet) {
    const buffer = this.printer.config[`CODE_PAGE_${characterSet}`];
    if (buffer) {
      this.append(buffer);
      this.config.codePage = characterSet;
    } else {
      throw new Error(`Code page not recognized: '${characterSet}'`);
    }
  }

  // ------------------------------ Append ------------------------------
  append (text) {
    if (typeof text === 'string') {
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
  }

  // ------------------------------ Fold ------------------------------
  /**
   * This function splits text input into multiple lines. Returns array of lines
   * @param {string} text - text to split into lines
   * @param {number} lineSize - maximum allowed character count in one line
   * @param {boolean} breakWord - Break word or character
   * @param {array} lineArray - Array of lines passed for recursion
   * @returns {array} Array of lines
  */
  _fold (text, lineSize, breakWord, lineArray = []) {
    text = String(text);

    // Split the text by newlines first
    const lines = text.split('\n');

    for (let i = 0; i < lines.length; i++) {
      let currentLine = lines[i];

      while (currentLine.length > lineSize) {
        let line = currentLine.substring(0, lineSize);
        if (!breakWord) {
          // Insert newlines anywhere
          lineArray.push(line);
          currentLine = currentLine.substring(lineSize);
        } else {
          // Attempt to insert newlines after whitespace
          const lastSpaceRgx = /\s(?!.*\s)/;
          const idx = line.search(lastSpaceRgx);
          let nextIdx = lineSize;
          if (idx > 0) {
            line = line.substring(0, idx);
            nextIdx = idx;
          }
          lineArray.push(line);
          currentLine = currentLine.substring(nextIdx);
        }
      }

      // Push the remaining part of the line
      if (currentLine.length > 0) {
        lineArray.push(currentLine);
      }
    }

    return lineArray;
  }
}

module.exports = {
  printer: ThermalPrinter,
  types: PrinterTypes,
  printerTypes: PrinterTypes,
  breakLine: BreakLine,
  characterSet: CharacterSet,
  ThermalPrinter,
  PrinterTypes,
  BreakLine,
  CharacterSet
};
