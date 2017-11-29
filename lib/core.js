var fs = require('fs'),
    net = require("net"),
    PNG = require('pngjs').PNG,
    star = require('./star'),
    epson = require('./epson'),
    getInterface = require("../interfaces");

var printerTypes = {
  EPSON: 'epson',
  STAR: 'star'
};

var iface = null;
var config = undefined;
var buffer = null;
var printerConfig;

module.exports = {
  printerTypes: printerTypes,

  init: function(initConfig){
    if(initConfig.type === printerTypes.STAR){
      config = require('../configs/starConfig');
    } else {
      config = require('../configs/epsonConfig');
    }

    iface = getInterface(initConfig.interface);

    if(!initConfig.width) initConfig.width = 48;
    if(!initConfig.characterSet) initConfig.characterSet = "SLOVENIA";
    if(initConfig.removeSpecialCharacters === undefined) initConfig.removeSpecialCharacters = false;
    if(initConfig.replaceSpecialCharacters === undefined) initConfig.replaceSpecialCharacters = true;
    if(initConfig.extraSpecialCharacters) config.specialCharacters = mergeObjects(config.specialCharacters, initConfig.extraSpecialCharacters);

    printerConfig = initConfig;
  },


  execute: function(cb){
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


  cut: function(){
    append(config.CTL_VT);
    append(config.CTL_VT);
    append(config.PAPER_FULL_CUT);
    append(config.HW_INIT);
  },


  partialCut: function(){
    append(config.CTL_VT);
    append(config.CTL_VT);
    append(config.PAPER_PART_CUT);
    append(config.HW_INIT);
  },


  beep: function(){
    if (printerConfig.type === printerTypes.STAR){
      console.error("Beep not supported on STAR yet!");
    } else {
      append(config.BEEP);
    }
  },

  getWidth: function(){
    return parseInt(printerConfig.width);
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


  underline: function(enabled){
    if(enabled) append(config.TXT_UNDERL_ON);
    else append(config.TXT_UNDERL_OFF);
  },


  underlineThick: function(enabled){
    if(enabled) append(config.TXT_UNDERL2_ON);
    else append(config.TXT_UNDERL_OFF);
  },


  upsideDown: function(enabled){
     if(enabled) append(config.UPSIDE_DOWN_ON);
     else append(config.UPSIDE_DOWN_OFF);
  },


  invert: function(enabled){
    if(enabled) append(config.TXT_INVERT_ON);
    else append(config.TXT_INVERT_OFF);
  },


  openCashDrawer: function(){
    if(printerConfig.type === printerTypes.STAR){
      append(config.CD_KICK);
    } else {
      append(config.CD_KICK_2);
      append(config.CD_KICK_5);
    }
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
    // module.exports.newLine();
    for(var i=0; i<printerConfig.width; i++) {
      if (printerConfig.lineChar) append(new Buffer(printerConfig.lineChar));
      else append(new Buffer([196]));
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
    module.exports.newLine();
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
    module.exports.newLine();
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

    module.exports.newLine();

    // Print the second line
    if(secondLineEnabled){
      module.exports.tableCustom(secondLine);
    }
  },


  isPrinterConnected: function(exists){
    iface.isPrinterConnected(exists);
  },


  // ----------------------------------------------------- PRINT QR -----------------------------------------------------
  printQR: function(str, settings){
    if (printerConfig.type === printerTypes.STAR) {
      append(star.printQR(str, settings));
    } else if(printerConfig.type === printerTypes.EPSON) {
      append(epson.printQR(str, settings));
    } else {
      console.error("QR not supported on '" + printerConfig.type + "' yet!");
    }
  },


  // ----------------------------------------------------- PRINT BARCODE -----------------------------------------------------
  printBarcode: function(data, type, settings){
    if(printerConfig.type === printerTypes.EPSON) {
      append(epson.printBarcode(data, type, settings));
    } else {
      console.error("Barcode not supported on '" + printerConfig.type + "' yet!");
    }
  },


  // ----------------------------------------------------- PRINT MAXICODE -----------------------------------------------------
  maxiCode: function(data, settings){
    if(printerConfig.type === printerTypes.EPSON) {
      append(epson.maxiCode(data, settings));
    } else {
      console.error("MaxiCode not supported on '" + printerConfig.type + "' yet!");
    }
  },


  // ----------------------------------------------------- PRINT CODE128 -----------------------------------------------------
  code128: function(data, settings) {
    if (printerConfig.type === printerTypes.STAR) {
      append(star.code128(data, settings));
    } else {
      console.error("Code128 not supported on '" + printerConfig.type + "' yet!");
    }
  },


  // ----------------------------------------------------- PRINT PDF417 -----------------------------------------------------
  pdf417: function(data, settings) {
    if (printerConfig.type === printerTypes.STAR) {
      append(star.pdf417(data, settings));
    } else if(printerConfig.type === printerTypes.EPSON) {
      append(epson.pdf417(data, settings));
    } else {
      console.error("PDF417 not supported on '" + printerConfig.type + "' yet!");
    }
  },



  // ----------------------------------------------------- PRINT IMAGE -----------------------------------------------------
  printImage: function(image, callback){
    try {
      // Check if file exists
      fs.accessSync(image);

      // Check for file type
      if(image.slice(-4) === ".png"){
        if (printerConfig.type === printerTypes.STAR){
          star.printImageStar(image, function(response){
            if(response) append(response);
            callback(response);
          });
        } else if(printerConfig.type === printerTypes.EPSON) {
          epson.printImageEpson(image, function(response){
            if(response) append(response);
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


  // ----------------------------------------------------- PRINT IMAGE BUFFER -----------------------------------------------------
  printImageBuffer: function(buffer, callback){
    var png = new PNG({
      filterType: 4
    }).parse(buffer);

    png.on('parsed', function() {
      if (printerConfig.type === printerTypes.STAR){
        star._printImageBufferStar(this.width, this.height, this.data, function(response){
          if(response) append(response);
          callback(response);
        });
      } else {
        epson._printImageBufferEpson(this.width, this.height, this.data, function(response){
          if(response) append(response);
          callback(response);
        });
      }
    });
  },


  // ------------------------------ RAW ------------------------------
  raw: function(text, cb) {
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
  }
};


// ------------------------------ Set international character set ------------------------------
var setInternationalCharacterSet = function(charSet){
  if (printerConfig.type == 'star') {
    // ------------------------------ Star Character set ------------------------------
    if(charSet == "USA") return config.CHARCODE_PC437;
    if(charSet == "JAPANESE") return config.CHARCODE_JIS;
    if(charSet == "MULTI") return config.CHARCODE_PC858;
    if(charSet == "PORTUGUESE") return config.CHARCODE_PC860;
    if(charSet == "CANADIAN") return config.CHARCODE_PC863;
    if(charSet == "NORDIC") return config.CHARCODE_PC865;
    if(charSet == "GREEK") return config.CHARCODE_GREEK;
    if(charSet == "HEBREW") return config.CHARCODE_HEBREW;
    if(charSet == "WESTEUROPE") return config.CHARCODE_PC1252;
    if(charSet == "CIRLILLIC") return config.CHARCODE_PC866;
    if(charSet == "LATIN2") return config.CHARCODE_PC852;
    if(charSet == "SLOVENIA") return config.CHARCODE_PC852;
    if(charSet == "THAI42") return config.CHARCODE_THAI42;
    if(charSet == "THAI11") return config.CHARCODE_THAI11;
    if(charSet == "THAI13") return config.CHARCODE_THAI13;
    if(charSet == "THAI14") return config.CHARCODE_THAI14;
    if(charSet == "THAI16") return config.CHARCODE_THAI16;
    if(charSet == "THAI17") return config.CHARCODE_THAI17;
    if(charSet == "THAI18") return config.CHARCODE_THAI18;
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


// ------------------------------ Merge objects ------------------------------
var mergeObjects = function(obj1, obj2) {
  var obj3 = {};
  for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
  for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
  return obj3;
};


// ------------------------------ Append ------------------------------
var append = function(buff){
  if(typeof buff === "string"){

    // Remove special characters
    if(printerConfig.removeSpecialCharacters) {
      var unorm = require('unorm');
      var combining = /[\u0300-\u036F]/g;
      buff = unorm.nfkd(buff).replace(combining, '');
    }

    var endBuff = null;
    for(var i=0; i<buff.length; i++) {
      var value = buff[i];
      var tempBuff = new Buffer(value);

      // Replace special characters
      if (printerConfig.replaceSpecialCharacters) {
        for (var key in config.specialCharacters) {
          if (value === key) {
            tempBuff = new Buffer([config.specialCharacters[key]]);
            break;
          }
        }
      }

      if (endBuff) endBuff = Buffer.concat([endBuff, tempBuff]);
      else endBuff = tempBuff;
    }

    buff = endBuff;
  }

  // Append character set
  if(!buffer && printerConfig.characterSet) buffer = setInternationalCharacterSet(printerConfig.characterSet);

  // Append new buffer
  if (buffer) {
    buffer = Buffer.concat([buffer,buff]);
  } else {
    buffer = buff;
  }
};
