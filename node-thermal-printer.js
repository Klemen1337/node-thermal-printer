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
    append(config.CTL_VT);
    append(config.CTL_VT);
    append(config.PAPER_FULL_CUT);
    append(config.HW_INIT);
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
    append(new Buffer("\n"));
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
    for(var i=0; i<data.length; i++){
      var obj = data[i];
      obj.text = obj.text.toString();

      if(obj.width) cellWidth = printerConfig.width * obj.width;
      if(obj.bold) module.exports.bold(true);

      if(obj.align == "CENTER"){
        var spaces = (cellWidth - obj.text.toString().length) / 2;
        for(var j=0; j<spaces; j++){
          append(new Buffer(" "));
        }
        append(obj.text);
        for(var j=0; j<spaces-1; j++){
          append(new Buffer(" "));
        }

      } else if(obj.align == "RIGHT") {
        var spaces = cellWidth - obj.text.toString().length;
        for(var j=0; j<spaces; j++){
          append(new Buffer(" "));
        }
        append(obj.text);

      } else {
        append(obj.text);
        var spaces = cellWidth - obj.text.toString().length;
        for(var j=0; j<spaces; j++){
          append(new Buffer(" "));
        }

      }

      if(obj.bold) module.exports.bold(false);

    }
  },

  isPrinterConnected: function(exists){
    if(printerConfig.interface){
      var fs = require('fs');
      fs.exists(printerConfig.interface, function(ex){
        exists(ex);
      });
    }

  },

  printQR: function(str){
    if (printerConfig.type == 'star') {
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
      append(new Buffer("\n"));
    } else {
      console.error("Not yet supported");
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
      append(new Buffer("\n"));
    } else {
      console.error("Not yet supported");
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
      console.error("Not yet supported");
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

var append = function(buff){
  if(typeof buff == "string"){

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

      if(buffer) buffer = Buffer.concat([buffer,tempBuff]);
      else buffer = tempBuff;
    }

  } else {
    if(buffer) buffer = Buffer.concat([buffer,buff]);
    else buffer = buff;

  }
};
