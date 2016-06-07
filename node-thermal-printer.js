var unorm = require('unorm');
var combining = /[\u0300-\u036F]/g;

var writeFile = require('write-file-queue')({
    retries : 1000, 						    // number of write attempts before failing
    waitTime : 200 					        // number of milliseconds to wait between write attempts
    //, debug : console.error 			// optionally pass a function to do dump debug information to
});

var net = require("net");
var config = undefined;
var printerConfig;
var buffer = null;

module.exports = {
  init: function(initConfig){
    if(initConfig.type === 'star'){
      config = require('./configs/starConfig');
    } else {
      config = require('./configs/epsonConfig');
    }

    if(!initConfig.width) initConfig.width = 48;
    if(!initConfig.characterSet) initConfig.characterSet = "SLOVENIA";

    printerConfig = initConfig;
  },

  execute: function(){
    if(printerConfig.ip){
      var printer = net.connect({
        host : printerConfig.ip,
        port : printerConfig.port
      });
      printer.write(buffer);
      printer.end();

    } else {
      writeFile(printerConfig.interface , buffer, function (err) {
        if (err) {
          console.error('Print failed', err);
        } else {
          console.log('Print done');
          buffer = null;
        }
      });
    }
  },

  cut: function(){
    append(config.CTL_VT);
    append(config.CTL_VT);
    append(config.PAPER_FULL_CUT);
    append(config.HW_INIT);
  },

  getWidth: function(){
    return printerConfig.getWidth;
  },

  getText: function(){
    return buffer.toString();
  },

  getBuffer: function(){
    return buffer;
  },

  clear: function(){
    buffer = null;
  },

  add: function(buffer){
    append(buffer);
  },

  print: function(text){
    append(text.toString());
  },

  println: function(text){
    append(text.toString());
    append("\n");
  },

  printVerticalTab: function(){
    append(config.CTL_VT);
  },

  bold: function(enabled){
    if(enabled) append(config.TXT_BOLD_ON);
    else append(config.TXT_BOLD_OFF);
  },

  alignCenter: function (){
    append(config.TXT_ALIGN_CT);
  },

  alignLeft: function (){
    append(config.TXT_ALIGN_LT);
  },

  alignRight: function(){
    append(config.TXT_ALIGN_RT);
  },

  setTypeFontA: function(){
    append(config.TXT_FONT_A);
  },

  setTypeFontB: function(){
    append(config.TXT_FONT_B);
  },

  setTextNormal: function(){
    append(config.TXT_NORMAL);
  },

  setTextDoubleHeight: function(){
    append(config.TXT_2HEIGHT);
  },

  setTextDoubleWidth: function(){
    append(config.TXT_2WIDTH);
  },

  setTextQuadArea: function(){
    append(config.TXT_4SQUARE);
  },

  newLine: function(){
    append(config.CTL_LF);
  },

  drawLine: function(){
    module.exports.newLine();
    for(var i=0; i<printerConfig.width; i++){
      append(new Buffer("-"));
    }
    module.exports.newLine();
  },

  leftRight: function(left, right){
    append(left.toString());
    var width = printerConfig.width - left.toString().length - right.toString().length;
    for(var i=0; i<width; i++){
      append(new Buffer(" "));
    }
    append(right.toString());
  },

  table: function(data){
    var cellWidth = printerConfig.width/data.length;
    for(var i=0; i<data.length; i++){
      append(data[i].toString());
      var spaces = cellWidth - data[i].toString().length;
      for(var j=0; j<spaces; j++){
        append(new Buffer(" "));
      }
    }
  },


  // Options: text, align, width, bold
  tableCustom: function(data){
    var cellWidth = printerConfig.width/data.length;
    var secondLine = [];
    var secondLineEnabled = false;

    for(var i=0; i<data.length; i++){
      var tooLong = false;
      var obj = data[i];
      obj.text = obj.text.toString();

      if(obj.width) cellWidth = printerConfig.width * obj.width;
      if(obj.bold) module.exports.bold(true);

      // If text is too wide go to next line
      if(cellWidth < obj.text.length){
        tooLong = true;
        obj.originalText = obj.text;
        obj.text = obj.text.substring(0, cellWidth);
      }

      if(obj.align == "CENTER"){
        var spaces = (cellWidth - obj.text.toString().length) / 2;
        for(var j=0; j<spaces; j++){
          append(new Buffer(" "));
        }
        if(obj.text != '')  append(obj.text);
        for(var j=0; j<spaces-1; j++){
          append(new Buffer(" "));
        }

      } else if(obj.align == "RIGHT") {
        var spaces = cellWidth - obj.text.toString().length;
        for(var j=0; j<spaces; j++){
          append(new Buffer(" "));
        }
        if(obj.text != '') append(obj.text);

      } else {
        if(obj.text != '') append(obj.text);
        var spaces = cellWidth - obj.text.toString().length;
        for(var j=0; j<spaces; j++){
          append(new Buffer(" "));
        }

      }

      if(obj.bold) module.exports.bold(false);


      if(tooLong){
        secondLineEnabled = true;
        obj.text = obj.originalText.substring(cellWidth-1);
        secondLine.push(obj);
      } else {
        obj.text = "";
        secondLine.push(obj);
      }
    }

    // Print the second line
    if(secondLineEnabled){
      module.exports.tableCustom(secondLine);
    }
  },

  isPrinterConnected: function(exists){
    if(printerConfig.interface){
      var fs = require('fs');
      fs.exists(printerConfig.interface, function(ex){
        return ex;
      });
    }

  },


  printQR: function(str){
    if (printerConfig.type == 'star') {
      // ------------------------------ Star QR ------------------------------
      // [Name] Set QR code model
      // [Code] Hex. 1B 1D 79 53 30 n
      // [Defined Area] 1 ≤ n ≤ 2
      // [Initial Value] n = 2
      // [Function] Sets the model.
      // 	• Parameter details
      // n | Set Model
      //---+---------------
      // 1 | Model 1
      // 2 | Model 2
      append(config.QRCODE_MODEL1);


      // [Name] Set QR code mistake correction level
      // [Code] Hex. 1B 1D 79 53 31 n
      // [Defined Area] 0 ≤ n ≤ 3
      // [Initial Value] n = 0
      // [Function] Sets the mistake correction level.
      // 	• Parameter details
      // n | Correction Level | Mistake Correction Rate (%)
      // --+------------------+----------------------------
      // 0 | L 								|	7
      // 1 | M 								| 15
      // 2 | Q 							  | 25
      // 3 | H 								| 30
      append(config.QRCODE_CORRECTION_M);


      // [Name] Set QR code cell size
      // [Code] Hex. 1B 1D 79 53 32 n
      // [Defined Area] 1 ≤ n ≤ 8
      // [Initial Value] n = 3
      // [Function] Sets the cell size.
      //	• Parameter details
      //	• n: Cell size (Units: Dots)
      //	• It is recommended that the specification using this command be 3 ≤ n.
      //	  If n = 1 or 2, check by actually using.
      append(config.QRCODE_CELLSIZE_4);


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
      //	• Parameter details
      //	• nL + nH x 256: Byte count of bar code data
      //	• dk: Bar code data (Max. 7089 bytes)
      //	• When using this command, the printer receives data for the number of bytes (k) specified by nL and nH. The data automatically expands to be set as the qr code data.
      //	• Indicates the number bytes of data specified by the nL and nH. Bar code data is cleared at this time.
      //	• The data storage region of this command is shared with the manual setting command so data is updated each time either command is executed.
      var s = str.length;
      var lsb = parseInt(s % 256);
      var msb = parseInt(s / 256);

      append(new Buffer([lsb, msb]));  // nL, nH
      append(new Buffer(str.toString()));  // Data
      append(new Buffer([0x0a])); // NL (new line)


      // [Name] Print QR code
      // [Code] 1B 1D 79 50
      // [Function] Prints bar code data.
      // When receiving this command, if there is unprinted data in the image buffer, the printer will print the bar code after printing the unprinted print data.
      // A margin of more than 4 cells is required around the QR code. The user should ensure that space. Always check printed bar codes in actual use.
      append(config.QRCODE_PRINT);

    } else {
      // ------------------------------ Epson QR ------------------------------

      // [Name] Select the QR code model
      // [Code] 1D 28 6B 04 00 31 41 n1 n2
      // n1
      // [49 x31, model 1]
      // [50 x32, model 2]
      // [51 x33, micro qr code]
      // n2 = 0
      // https://reference.epson-biz.com/modules/ref_escpos/index.php?content_id=140
      append(config.QRCODE_MODEL1);

      // [Name]: Set the size of module
      // 1D 28 6B 03 00 31 43 n
      // n depends on the printer
      // https://reference.epson-biz.com/modules/ref_escpos/index.php?content_id=141
      append(config.QRCODE_CELLSIZE_6);


      // [Name] Select the error correction level
      // 1D 28 6B 03 00 31 45 n
      // n
      // [48 x30 -> 7%]
      // [49 x31-> 15%]
      // [50 x32 -> 25%]
      // [51 x33 -> 30%]
      // https://reference.epson-biz.com/modules/ref_escpos/index.php?content_id=142
      append(config.QRCODE_CORRECTION_M);


      // [Name] Store the data in the symbol storage area
      // 1D 28  6B pL pH 31 50 30 d1...dk
      // https://reference.epson-biz.com/modules/ref_escpos/index.php?content_id=143
      var s = str.length + 3;
      var lsb = parseInt(s % 256);
      var msb = parseInt(s / 256);
      append(new Buffer([0x1d, 0x28, 0x6b, lsb, msb, 0x31, 0x50, 0x30]));
      append(new Buffer(str));


      // [Name] Print the symbol data in the symbol storage area
      // 1D 28 6B 03 00 31 51 m
      // https://reference.epson-biz.com/modules/ref_escpos/index.php?content_id=144
      append(config.QRCODE_PRINT);

    }
  },


  printBarcode: function(data, settings){
    if (printerConfig.type == 'star'){
      // ------------------------------ Star Barcode ------------------------------
      console.error("Barcode not supported on STAR yet");

    } else {
      // ------------------------------ Epson Barcode ------------------------------
      // [Name] Select bar code height
      // [Code] Hex 1D 68 n
      // [Range] 1 ≤ n ≤ 255
      // [Default] n = 162
      // [Description] Selects the height of the bar code as n dots.
      //append(new Buffer([162]));

      // [Name] Print bar code
      // [Code]  (1) 1D 6B m d1...dk 00
      //         (2) 1D 6B m n d1...dn
      // [Range] (1) 0 ≤ m ≤ 6 (k and d depend on the bar code system used)
      //         (2) 65 ≤ m ≤ 73 (n and d depend on the bar code system used)
      // [Description] Selects a bar code system and print the bar code.

      // (1)
      // m   Bar code       Range of k        Range of d
      // --------------------------------------------------
      // 0   UPC-A          11 <= k <= 12     48 <= d <= 57
      // 1   UPC-E          11 <= k <= 12     48 <= d <= 57
      // 2   JAN13(EAN13)   12 <= k <= 13     48 <= d <= 57
      // 3   JAN8(EAN8)      7 <= k <= 8      48 <= d <= 57
      // 4   CODE39          1 <= k           48 <= d <= 57, 65 <= d <= 90, d = 32, 36, 37, 43, 45, 46, 47
      // 5   ITF             1 <= k (even)    48 <= d <= 57
      // 6   CODEBAR(NW7)    1 <= k           48 <= d <= 57, 65 <= d <= 68, d = 36, 43, 45, 46, 47, 58

      // (2)
      // m   Bar code       Range of n        Range of d
      // --------------------------------------------------
      // 65   UPC-A          11 <= n <= 12     48 <= d <= 57
      // 66   UPC-E          11 <= n <= 12     48 <= d <= 57
      // 67   JAN13(EAN13)   12 <= n <= 13     48 <= d <= 57
      // 68   JAN8(EAN8)      7 <= n <= 8      48 <= d <= 57
      // 69   CODE39          1 <= n <= 255    48 <= d <= 57, 65 <= d <= 90, d = 32, 36, 37, 43, 45, 46, 47
      // 70   ITF             1 <= k <= 255    48 <= d <= 57
      // 71   CODEBAR(NW7)    1 <= k <= 255    48 <= d <= 57, 65 <= d <= 68, d = 36, 43, 45, 46, 47, 58
      // 72   CODE93          1 <= k <= 255     0 <= d <= 127
      // 73   CODE128         2 <= n <= 255     0 <= d <= 127
      //append(new Buffer([0x1d, 0x6B, 73]));
      //append(new Buffer([data.length]));
      //append(new Buffer(data));

      //append(new Buffer([0x1d, 0x6B, 50]));
      //append(new Buffer([0x1d, 0x77, 2]));
      //append(new Buffer([0x1d, 0x48, 2]));

      append(new Buffer([0x1d, 0x6B, 0x49]));
      append(new Buffer([data.length+1]));
      append(new Buffer(data));
      append(new Buffer([0x10]));

    }
  },


  code128: function(data, settings) {
    if (printerConfig.type == 'star') {
      append(config.BARCODE_CODE128);

      // Barcode option
      // 1 - No text
      // 2 - Text on bottom
      // 3 - No text inline
      // 4 - Text on bottom inline
      if(settings){
        if(settings.text == 1) append(config.BARCODE_CODE128_TEXT_1);
        else if(settings.text == 2) append(config.BARCODE_CODE128_TEXT_2);
        else if(settings.text == 3) append(config.BARCODE_CODE128_TEXT_3);
        else if(settings.text == 4) append(config.BARCODE_CODE128_TEXT_4);
      } else {
        append(config.BARCODE_CODE128_TEXT_2);
      }

      // Barcode width
      // 31 - Small
      // 32 - Medium
      // 33 - Large
      if(settings) {
        if (settings.width == "SMALL") append(config.BARCODE_CODE128_WIDTH_SMALL);
        else if (settings.width == "MEDIUM") append(config.BARCODE_CODE128_WIDTH_MEDIUM);
        else if (settings.width == "LARGE") append(config.BARCODE_CODE128_WIDTH_LARGE);
      } else {
        append(config.BARCODE_CODE128_WIDTH_LARGE);
      }

      // Barcode height
      if(settings && settings.height) append(new Buffer([settings.height]));
      else append(new Buffer([0x50]));

      // Barcode data
      append(new Buffer(data.toString()));

      // Append RS(record separator)
      append(new Buffer([0x1e]));
    } else {
      console.error("Code128 not supported on EPSON yet");
    }
  },

  pdf417: function(data) {
    if (printerConfig.type == 'star') {
      //(1) Bar code type setting (<ESC> <GS> “x” “S”)
      //(2) Bar code data setting (<ESC> <GS> “x” “D”)
      //(3) Bar code printing (<ESC> <GS> “x” “P”)
      //(4) Bar code expansion information acquisition (<ESC> <GS> “x” “I”)


      // Set PDF417 bar code size
      // 1B 1D 78 53 30 n p1 p2
      append(new Buffer([0x1b, 0x1d, 0x78, 0x53, 0x30, 0x00, 0x01, 0x02]));

      // Set PDF417 ECC (security level)
      // 1B 1D 78 53 31 n
      append(new Buffer([0x1b, 0x1d, 0x78, 0x53, 0x31, 0x02]));

      // Set PDF417 module X direction size
      // 1B 1D 78 53 32 n
      append(new Buffer([0x1b, 0x1d, 0x78, 0x53, 0x32, 0x02]));

      // Set PDF417 module aspect ratio
      // 1B 1D 78 53 33 n
      append(new Buffer([0x1b, 0x1d, 0x78, 0x53, 0x33, 0x03]));

      // Set PDF417 bar code data
      // 1B 1D 78 44 nL nH d1 d2 … dk
      var s = data.length;
      var lsb = parseInt(s % 256);
      var msb = parseInt(s / 256);

      append(new Buffer([0x1b, 0x1d, 0x78, 0x44]));
      append(new Buffer([lsb, msb]));  // nL, nH
      append(new Buffer(data.toString()));  // Data
      append(new Buffer([0x0a])); // NL (new line)


      // Print PDF417 bar code
      // 1B 1D 78 50
      append(new Buffer([0x1b, 0x1d, 0x78, 0x50]));

    } else {
      console.error("PDF417 not supported on EPSON yet");
    }
  },

  raw: function(text) {
    if (printerConfig.ip) {
      var printer = net.connect({
        host: printerConfig.ip,
        port: printerConfig.port
      });
      printer.write(text);
      printer.end();

    } else {
      writeFile(printerConfig.interface, text, function (err) {
        if (err) {
          console.error('Print failed', err);
        } else {
          console.log('Print done');
        }
      });
    }
  }
};


var setInternationalCharacterSet = function(charSet){
  if (printerConfig.type == 'star') {
    // ------------------------------ Star Character set ------------------------------
    return null;
  } else {
    // ------------------------------ Epson Character set ------------------------------
    if(charSet == "USA") return config.CHARCODE_USA;
    if(charSet == "FRANCE") return config.CHARCODE_FRANCE;
    if(charSet == "GERMANY") return config.CHARCODE_GERMANY;
    if(charSet == "UK") return config.CHARCODE_UK;
    if(charSet == "DENMARK1") return config.CHARCODE_DENMARK1;
    if(charSet == "SWEDEN") return config.CHARCODE_SWEDEN;
    if(charSet == "ITALY") return config.CHARCODE_ITALY;
    if(charSet == "SPAIN1") return config.CHARCODE_SPAIN1;
    if(charSet == "JAPAN") return config.CHARCODE_JAPAN;
    if(charSet == "NORWAY") return config.CHARCODE_NORWAY;
    if(charSet == "DENMARK2") return config.CHARCODE_DENMARK2;
    if(charSet == "SPAIN2") return config.CHARCODE_SPAIN2;
    if(charSet == "LATINA") return config.CHARCODE_LATINA;
    if(charSet == "KOREA") return config.CHARCODE_KOREA;
    if(charSet == "SLOVENIA") return config.CHARCODE_SLOVENIA;
    if(charSet == "CHINA") return config.CHARCODE_CHINA;
    if(charSet == "VIETNAM") return config.CHARCODE_VIETNAM;
    if(charSet == "ARABIA") return config.CHARCODE_ARABIA;
    return null;
  }
};


var append = function(buff){
  if(typeof buff == "string"){
    buff = unorm.nfkd(buff).replace(combining, '');

    var endBuff = null;
    for(var i=0; i<buff.length; i++){
      var value = buff[i];
      var tempBuff = new Buffer(value);
      // Replace special characters
      for(var key in config.specialCharacters){
        if(value == key){
          tempBuff = new Buffer([config.specialCharacters[key]]);
          break;
        }
      }

      if(endBuff) endBuff = Buffer.concat([endBuff,tempBuff]);
      else endBuff = tempBuff;
    }

    buff = endBuff;
  }




  if(!buffer && printerConfig.characterSet) buffer = setInternationalCharacterSet(printerConfig.characterSet);
  if (buffer) {
    buffer = Buffer.concat([buffer,buff]);
  } else {
    buffer = buff;
  }
};


var fix = function(str){
  return unorm.nfkd(str).replace(combining, '');
};
