let fs = require('fs');
let PNG = require('pngjs').PNG;
let config = require('../configs/starConfig');

let buffer = null;
function append(buff) {
  if (buffer) buffer = Buffer.concat([buffer, buff]);
  else buffer = buff;
}


module.exports = {

  // ------------------------------ Star QR ------------------------------
  printQR: function (str, settings) {
    if (settings) {
      console.error('QR settings not yet available for star printers!');
    }

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


    // Don't forget to clean the buffer
    let buff = buffer;
    buffer = null;
    return buff;
  },


  // ------------------------------ Star PDF417 ------------------------------
  pdf417: function(data, settings) {
    if (settings) {
      console.error('PDF417 settings not yet available for star printers!');
    }

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


    // Don't forget to clean the buffer
    let buff = buffer;
    buffer = null;
    return buff;
  },


  // ------------------------------ Star CODE128 ------------------------------
  code128: function(data, settings) {
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

    // Don't forget to clean the buffer
    let buff = buffer;
    buffer = null;
    return buff;
  },


  // ----------------------------------------------------- PRINT IMAGE STAR -----------------------------------------------------
  printImageStar: function(image, callback){
    fs.createReadStream(image).pipe(new PNG({
      filterType: 4
    })).on('parsed', function() {
      module.exports._printImageBufferStar(this.width, this.height, this.data, function(buff){
        callback(buff);
      });
    });
  },


  _printImageBufferStar: function(width, height, data, callback) {
    // Get pixel rgba in 2D array
    var pixels = [];
    for (var i = 0; i < height; i++) {
      var line = [];
      for (var j = 0; j < width; j++) {
        var idx = (width * i + j) << 2;
        line.push({
          r: data[idx],
          g: data[idx + 1],
          b: data[idx + 2],
          a: data[idx + 3]
        });
      }
      pixels.push(line);
    }

    append(new Buffer([0x1b, 0x30]));

    // v3
    for(var i = 0; i < Math.ceil(height/24); i++){
      var imageBuffer = new Buffer([]);
      for(var y = 0; y < 24; y++){

        for (var j = 0; j < Math.ceil(width/8); j++) {
          var byte = 0x0;

          for (var x = 0; x < 8; x++) {

            if((i*24 + y < pixels.length) && (j*8 + x < pixels[i*24 + y].length)){
              var pixel = pixels[i*24 + y][j*8 + x];
              if(pixel.a > 126){ // checking transparency
                var grayscale = parseInt(0.2126 * pixel.r + 0.7152 * pixel.g + 0.0722 * pixel.b);

                if(grayscale < 128){ // checking color
                  var mask = 1 << 7-x; // setting bitwise mask
                  byte |= mask; // setting the correct bit to 1
                }
              }
            }
          }

          imageBuffer = Buffer.concat([imageBuffer, new Buffer([byte])]);
        }
      }
      append(new Buffer([0x1b, 0x6b, parseInt(imageBuffer.length/24), 0x00]));
      append(imageBuffer);
      append(new Buffer("\n"));
    }

    append(new Buffer([0x1b, 0x7a, 0x01]));

    // Don't forget to clean the buffer
    let buff = buffer;
    buffer = null;
    callback(buff);
  },


};