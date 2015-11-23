var writeFile = require('write-file-queue')({
    retries : 1000, 						    // number of write attempts before failing
    waitTime : 200 					        // number of milliseconds to wait between write attempts
    //, debug : console.error 			// optionally pass a function to do dump debug information to
});

var net = require("net");
var config = undefined;
var printerConfig;
var printText = "";

module.exports = {
  init: function(initConfig){
    if(initConfig.type === 'star'){
      config = require('./starConfig');
    } else {
      config = require('./epsonConfig');
    }

    printerConfig = initConfig;
  },

  execute: function(){
    printText = printText.replace(/š/g, 's');
    printText = printText.replace(/Š/g, 'S');
    printText = printText.replace(/č/g, 'c');
    printText = printText.replace(/Č/g, 'C');
    printText = printText.replace(/ć/g, 'c');
    printText = printText.replace(/Ć/g, 'c');
    printText = printText.replace(/ž/g, 'z');
    printText = printText.replace(/Ž/g, 'Z');

    if(printerConfig.ip){
      var printer = net.connect({host : printerConfig.ip, port : printerConfig.port });
      printer.write(printText);
      printText = "";
      printer.end();

    } else {
      writeFile(printerConfig.interface , printText, function (err) {
        if (err) {
          console.error('Print failed', err);
        } else {
          console.log('Print done');
          printText = "";
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
    return printText;
  },

  clear: function(){
    printText = "";
  },

  print: function(text){
    append(text);
  },

  println: function(text){
    append(text + "\n");
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

  drawLine: function(){
    append(config.TXT_BOLD_ON);
    append("\n------------------------------------------------\n");
    append(config.TXT_BOLD_OFF);
  },

  isPrinterConnected: function(exists){
    if(printerConfig.interface){
      var fs = require('fs');
      fs.exists(printerConfig.interface, function(ex){
        exists(ex);
      });
    }

  }
};

var append = function(text){
	printText += text;
};

var raw = function(text){
  if(printerConfig.ip){
    var printer = net.connect({host : printerConfig.ip, port : printerConfig.port });
    printer.write(printText);
    printer.end();

  } else {
    writeFile(printerConfig.interface , text, function (err) {
      if (err) {
        console.error('Print failed', err);
      } else {
        console.log('Print done');
      }
    });
  }
};