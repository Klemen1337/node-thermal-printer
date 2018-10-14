const fs = require('fs');
const PNG = require('pngjs').PNG;
const star = require('./star');
const epson = require('./epson');
const getInterface = require("../interfaces");
// We only need iconv when we encounter non-ascii characters.
const iconv = require('iconv-lite');

const printerTypes = {
  EPSON: 'epson',
  STAR: 'star'
};

var iface = null;
var config = undefined;
var buffer = null;
/**
 * @var {IPrinterConfig} printerConfig Object contains settings like width, characterSet, etc.
 */
var printerConfig;
// Active code page.
var codePage;

module.exports = {
  printerTypes: printerTypes,

  /**
   * Initialize printer.
   *
   * @param {IPrinterConfig} initConfig Configuration object
   */
  init: function (initConfig) {
    if (initConfig.type === printerTypes.STAR) {
      config = require('../configs/starConfig');
    } else {
      config = require('../configs/epsonConfig');
    }

    iface = getInterface(initConfig.interface);

    if (!initConfig.width) initConfig.width = 48;
    if (initConfig.removeSpecialCharacters === undefined) initConfig.removeSpecialCharacters = false;

    printerConfig = initConfig;

    // Set initial code page.
    this.setCodePage('PC437_USA');
  },


  execute: function (cb) {
    iface.execute(buffer, function (err) {
      if (!err) {
        buffer = null;
        if (typeof cb === "function") {
          cb(null);
        }
      } else {
        if (typeof cb === "function") {
          cb(err);
        }
      }
    });
  },


  cut: function () {
    append(config.CTL_VT);
    append(config.CTL_VT);
    append(config.PAPER_FULL_CUT);
    append(config.HW_INIT);
  },


  partialCut: function () {
    append(config.CTL_VT);
    append(config.CTL_VT);
    append(config.PAPER_PART_CUT);
    append(config.HW_INIT);
  },


  beep: function () {
    if (printerConfig.type === printerTypes.STAR) {
      console.error("Beep not supported on STAR yet!");
    } else {
      append(config.BEEP);
    }
  },

  getWidth: function () {
    return parseInt(printerConfig.width);
  },


  getText: function () {
    return buffer.toString();
  },


  getBuffer: function () {
    return buffer;
  },

  setBuffer: function (newBuffer) {
    buffer = Buffer.from(newBuffer);
  },

  clear: function () {
    buffer = null;
  },


  add: function (buffer) {
    append(buffer);
  },


  print: function (text) {
    append(text.toString());
  },


  println: function (text) {
    append(text.toString());
    append("\n");
  },


  printVerticalTab: function () {
    append(config.CTL_VT);
  },


  bold: function (enabled) {
    if (enabled) append(config.TXT_BOLD_ON);
    else append(config.TXT_BOLD_OFF);
  },


  underline: function (enabled) {
    if (enabled) append(config.TXT_UNDERL_ON);
    else append(config.TXT_UNDERL_OFF);
  },


  underlineThick: function (enabled) {
    if (enabled) append(config.TXT_UNDERL2_ON);
    else append(config.TXT_UNDERL_OFF);
  },


  upsideDown: function (enabled) {
    if (enabled) append(config.UPSIDE_DOWN_ON);
    else append(config.UPSIDE_DOWN_OFF);
  },


  invert: function (enabled) {
    if (enabled) append(config.TXT_INVERT_ON);
    else append(config.TXT_INVERT_OFF);
  },


  openCashDrawer: function () {
    if (printerConfig.type === printerTypes.STAR) {
      append(config.CD_KICK);
    } else {
      append(config.CD_KICK_2);
      append(config.CD_KICK_5);
    }
  },


  alignCenter: function () {
    append(config.TXT_ALIGN_CT);
  },


  alignLeft: function () {
    append(config.TXT_ALIGN_LT);
  },


  alignRight: function () {
    append(config.TXT_ALIGN_RT);
  },


  setTypeFontA: function () {
    append(config.TXT_FONT_A);
  },


  setTypeFontB: function () {
    append(config.TXT_FONT_B);
  },


  setTextNormal: function () {
    append(config.TXT_NORMAL);
  },


  setTextDoubleHeight: function () {
    append(config.TXT_2HEIGHT);
  },


  setTextDoubleWidth: function () {
    append(config.TXT_2WIDTH);
  },

  setTextQuadArea: function () {
    append(config.TXT_4SQUARE);
  },


  newLine: function () {
    append(config.CTL_LF);
  },


  drawLine: function () {
    // module.exports.newLine();
    for (var i = 0; i < printerConfig.width; i++) {
      if (printerConfig.lineChar) append(new Buffer(printerConfig.lineChar));
      else append(new Buffer([196]));
    }
    module.exports.newLine();
  },


  leftRight: function (left, right) {
    append(left.toString());
    var width = printerConfig.width - left.toString().length - right.toString().length;
    for (var i = 0; i < width; i++) {
      append(new Buffer(" "));
    }
    append(right.toString());
    module.exports.newLine();
  },


  table: function (data) {
    var cellWidth = printerConfig.width / data.length;
    for (var i = 0; i < data.length; i++) {
      append(data[i].toString());
      var spaces = cellWidth - data[i].toString().length;
      for (var j = 0; j < spaces; j++) {
        append(new Buffer(" "));
      }
    }
    module.exports.newLine();
  },


  // Options: text, align, width, bold
  tableCustom: function (data) {
    var cellWidth = printerConfig.width / data.length;
    var secondLine = [];
    var secondLineEnabled = false;

    for (var i = 0; i < data.length; i++) {
      var tooLong = false;
      var obj = data[i];
      obj.text = obj.text.toString();

      if (obj.width) cellWidth = printerConfig.width * obj.width;
      if (obj.bold) module.exports.bold(true);

      // If text is too wide go to next line
      if (cellWidth < obj.text.length) {
        tooLong = true;
        obj.originalText = obj.text;
        obj.text = obj.text.substring(0, cellWidth);
      }

      if (obj.align == "CENTER") {
        var spaces = (cellWidth - obj.text.toString().length) / 2;
        for (var j = 0; j < spaces; j++) {
          append(new Buffer(" "));
        }
        if (obj.text != '') append(obj.text);
        for (var j = 0; j < spaces - 1; j++) {
          append(new Buffer(" "));
        }

      } else if (obj.align == "RIGHT") {
        var spaces = cellWidth - obj.text.toString().length;
        for (var j = 0; j < spaces; j++) {
          append(new Buffer(" "));
        }
        if (obj.text != '') append(obj.text);

      } else {
        if (obj.text != '') append(obj.text);
        var spaces = cellWidth - obj.text.toString().length;
        for (var j = 0; j < spaces; j++) {
          append(new Buffer(" "));
        }

      }

      if (obj.bold) module.exports.bold(false);


      if (tooLong) {
        secondLineEnabled = true;
        obj.text = obj.originalText.substring(cellWidth - 1);
        secondLine.push(obj);
      } else {
        obj.text = "";
        secondLine.push(obj);
      }
    }

    module.exports.newLine();

    // Print the second line
    if (secondLineEnabled) {
      module.exports.tableCustom(secondLine);
    }
  },


  isPrinterConnected: function (exists) {
    iface.isPrinterConnected(exists);
  },


  printQR: function (str, settings) {
    if (printerConfig.type === printerTypes.STAR) {
      append(star.printQR(str, settings));
    } else if (printerConfig.type === printerTypes.EPSON) {
      append(epson.printQR(str, settings));
    } else {
      console.error("QR not supported on '" + printerConfig.type + "' yet!");
    }
  },


  printBarcode: function (data, type, settings) {
    if (printerConfig.type === printerTypes.EPSON) {
      append(epson.printBarcode(data, type, settings));
    } else {
      console.error("Barcode not supported on '" + printerConfig.type + "' yet!");
    }
  },


  maxiCode: function (data, settings) {
    if (printerConfig.type === printerTypes.EPSON) {
      append(epson.maxiCode(data, settings));
    } else {
      console.error("MaxiCode not supported on '" + printerConfig.type + "' yet!");
    }
  },


  code128: function (data, settings) {
    if (printerConfig.type === printerTypes.STAR) {
      append(star.code128(data, settings));
    } else {
      console.error("Code128 not supported on '" + printerConfig.type + "' yet!");
    }
  },


  pdf417: function (data, settings) {
    if (printerConfig.type === printerTypes.STAR) {
      append(star.pdf417(data, settings));
    } else if (printerConfig.type === printerTypes.EPSON) {
      append(epson.pdf417(data, settings));
    } else {
      console.error("PDF417 not supported on '" + printerConfig.type + "' yet!");
    }
  },


  printImage: function (image, callback) {
    try {
      // Check if file exists
      fs.accessSync(image);

      // Check for file type
      if (image.slice(-4) === ".png") {
        if (printerConfig.type === printerTypes.STAR) {
          star.printImageStar(image, function (response) {
            if (response) append(response);
            callback(response);
          });
        } else if (printerConfig.type === printerTypes.EPSON) {
          epson.printImageEpson(image, function (response) {
            if (response) append(response);
            callback(response);
          });
        } else {
          console.error("Image print not supported on '" + printerConfig.type + "' yet!");
        }
      } else {
        console.error("Image printing supports only PNG files!");
        callback(false);
      }
    } catch (e) {
      callback(false);
    }
  },


  printImageBuffer: function (buffer, callback) {
    var png = new PNG({
      filterType: 4
    }).parse(buffer);

    png.on('parsed', function () {
      if (printerConfig.type === printerTypes.STAR) {
        star._printImageBufferStar(this.width, this.height, this.data, function (response) {
          if (response) append(response);
          callback(response);
        });
      } else {
        epson._printImageBufferEpson(this.width, this.height, this.data, function (response) {
          if (response) append(response);
          callback(response);
        });
      }
    });
  },


  raw: function (text, cb) {
    iface.execute(text, function (err) {
      if (!err) {
        if (typeof cb === "function") {
          cb(null);
        }
      } else {
        if (typeof cb === "function") {
          cb(err);
        }
      }
    });
  },


  /**
   * Name of the code page to make active.
   * eg PC437_USA or ISO8859_15_LATIN9
   *
   * @param {string} codePageName Name of the code page in upper case
   * @throws Error in case the code page is not recognized
   */
  setCodePage: function (codePageName) {
    const codePageBuffer = config[`CODE_PAGE_${codePageName}`];
    if (codePageBuffer) {
      append(codePageBuffer);
      codePage = codePageName;
    } else {
      throw new Error(`Code page not recognized: '${codePageName}'`);
    }
  }

};


/**
 * Append text to buffer.
 *
 * @param {string|Buffer} text Text or control codes
 * @returns void
 */
function append(text) {

  if (typeof text === "string") {

    // Remove special characters.
    if (printerConfig.removeSpecialCharacters) {
      const unorm = require('unorm');
      const combining = /[\u0300-\u036F]/g;
      text = unorm.nfkd(text).replace(combining, '');
    }

    let endBuff = null;
    for (const char of text) {

      /**
       * We only have to convert characters that are outside the ASCII range.
       * @var {string|Buffer} code
       */
      let code = char;
      if (!/^[\x00-\x7F]$/.test(char)) {

        // Test if the active code page can print the current character.
        try {
          code = iconv.encode(char, config.CODE_PAGES[codePage]);
        } catch (e) {
          // Probably encoding not recognized.
          console.error(e);
          code = '?';
        }

        if (code.toString() === '?') {

          // Character not available in active code page, now try all other code pages.
          for (const tmpCodePageKey of Object.keys(config.CODE_PAGES)) {
            const tmpCodePage = config.CODE_PAGES[tmpCodePageKey];

            try {
              code = iconv.encode(char, tmpCodePage);
            } catch (e) {
              // Probably encoding not recognized.
              console.error(e);
            }

            if (code.toString() !== '?') {

              // We found a match, change active code page.
              codePage = tmpCodePageKey;
              code = Buffer.concat([config[`CODE_PAGE_${tmpCodePageKey}`], code]);
              break;
            }
          }
        }
      }
      endBuff = endBuff ? Buffer.concat([endBuff, Buffer.from(code)]) : Buffer.from(code);
    }
    text = endBuff;
  }

  // Append new buffer
  if (buffer) {
    buffer = Buffer.concat([buffer, text]);
  } else {
    buffer = text;
  }
}
