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
      config = require('./starConfig');
    } else {
      config = require('./epsonConfig');
    }

    if(!initConfig.width) initConfig.width = 48;

    printerConfig = initConfig;
  },

  execute: function(){
    //printText = printText.replace(/š/g, 's');
    //printText = printText.replace(/Š/g, 'S');
    //printText = printText.replace(/č/g, 'c');
    //printText = printText.replace(/Č/g, 'C');
    //printText = printText.replace(/ć/g, 'c');
    //printText = printText.replace(/Ć/g, 'c');
    //printText = printText.replace(/ž/g, 'z');
    //printText = printText.replace(/Ž/g, 'Z');

    if(printerConfig.ip){
      var printer = net.connect({host : printerConfig.ip, port : printerConfig.port });
      printer.write(buffer);
      printer.end();

    } else {
      console.log(buffer.toString());

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

  print: function(text){
    append(new Buffer(text, "utf-8"));
  },

  println: function(text){
    append(new Buffer(text, "utf-8"));
    append(new Buffer("\n"));
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
    append(new Buffer(left, "utf-8"));
    var width = printerConfig.width - left.toString().length - right.toString().length;
    for(var i=0; i<width; i++){
      append(new Buffer(" "));
    }
    append(new Buffer(right, "utf-8"));
  },

  table: function(data){
    var cellWidth = printerConfig.width/data.length;
    for(var i=0; i<data.length; i++){
      append(new Buffer(data[i]));
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

      if(obj.width) cellWidth = printerConfig.width * obj.width;
      if(obj.bold) module.exports.bold(true);

      if(obj.align == "CENTER"){
        var spaces = (cellWidth - obj.text.toString().length) / 2;
        for(var j=0; j<spaces; j++){
          append(new Buffer(" "));
        }
        append(new Buffer(obj.text));
        for(var j=0; j<spaces-1; j++){
          append(new Buffer(" "));
        }

      } else if(obj.align == "RIGHT") {
        var spaces = cellWidth - obj.text.toString().length;
        for(var j=0; j<spaces; j++){
          append(new Buffer(" "));
        }
        append(new Buffer(obj.text));

      } else {
        append(new Buffer(obj.text));
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
      append(new Buffer(str));  // Data
      append(new Buffer([0x0a])); // NL (new line)


      // [Name] Print QR code
      // [Code] 1B 1D 79 50
      // [Function] Prints bar code data.
      // When receiving this command, if there is unprinted data in the image buffer, the printer will print the bar code after printing the unprinted print data.
      // A margin of more than 4 cells is required around the QR code. The user should ensure that space. Always check printed bar codes in actual use.
      append(config.QRCODE_PRINT);

      //append(new Buffer([0x1b, 0x1d, 0x79, 0x49]));
      append(new Buffer("\n"));
    } else {
      console.error("Not yet supported");
    }
  },


  code128: function(data) {
    if (printerConfig.type == 'star') {
      append(config.BARCODE_CODE128);

      // Barcode option
      // 1 - No text
      // 2 - Text on bottom
      // 3 - No text inline
      // 4 - Text on bottom inline
      append(config.BARCODE_CODE128_TEXT_2);

      // Barcode width
      // 31 - Small
      // 32 - Medium
      // 33 - Large
      append(config.BARCODE_CODE128_WIDTH_LARGE);

      // Barcode height
      append(new Buffer([0x50]));

      // Barcode data
      append(new Buffer(data, "utf-8"));

      // Append RS(record separator)
      append(new Buffer([0x1e]));
      append(new Buffer("\n"));
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
  if(buffer) buffer = Buffer.concat([buffer,buff]);
  else buffer = buff;
};
