var lwip = require('lwip');
var writeFile = require('write-file-queue')({
    retries : 1000 						// number of write attempts before failing
    , waitTime : 200 					// number of milliseconds to wait between write attempts
    //, debug : console.error 			// optionally pass a function to do dump debug information to
});

// Feed control sequences
const CTL_LF     = '\x0a'              // Print and line feed
const CTL_FF     = '\x0c'              // Form feed
const CTL_CR     = '\x0d'              // Carriage return
const CTL_HT     = '\x09'              // Horizontal tab
const CTL_SET_HT = '\x1b\x44'          // Set horizontal tab positions
const CTL_VT     = '\x1b\x64\x04'      // Vertical tab

// Printer hardware
const HW_INIT    = '\x1b\x40'          // Clear data in buffer and reset modes
const HW_SELECT  = '\x1b\x3d\x01'      // Printer select
const HW_RESET   = '\x1b\x3f\x0a\x00'  // Reset printer hardware

// Cash Drawer
const CD_KICK_2  = '\x1b\x70\x00'      // Sends a pulse to pin 2 [] 
const CD_KICK_5  = '\x1b\x70\x01'      // Sends a pulse to pin 5 [] 

// Paper
const PAPER_FULL_CUT  = '\x1d\x56\x00' // Full cut paper
const PAPER_PART_CUT  = '\x1d\x56\x01' // Partial cut paper

// Text format   
const TXT_NORMAL      = '\x1b\x21\x00' // Normal text
const TXT_2HEIGHT     = '\x1b\x21\x10' // Double height text
const TXT_2WIDTH      = '\x1b\x21\x20' // Double width text
const TXT_4SQUARE     = '\x1b\x21\x30' // Quad area text
const TXT_UNDERL_OFF  = '\x1b\x2d\x00' // Underline font OFF
const TXT_UNDERL_ON   = '\x1b\x2d\x01' // Underline font 1-dot ON
const TXT_UNDERL2_ON  = '\x1b\x2d\x02' // Underline font 2-dot ON
const TXT_BOLD_OFF    = '\x1b\x45\x00' // Bold font OFF
const TXT_BOLD_ON     = '\x1b\x45\x01' // Bold font ON
const TXT_FONT_A      = '\x1b\x4d\x00' // Font type A
const TXT_FONT_B      = '\x1b\x4d\x01' // Font type B
const TXT_ALIGN_LT    = '\x1b\x61\x00' // Left justification
const TXT_ALIGN_CT    = '\x1b\x61\x01' // Centering
const TXT_ALIGN_RT    = '\x1b\x61\x02' // Right justification

// Char code table
const CHARCODE_PC437  = '\x1b\x74\x00' // USA: Standard Europe
const CHARCODE_JIS    = '\x1b\x74\x01' // Japanese Katakana
const CHARCODE_PC850  = '\x1b\x74\x02' // Multilingual
const CHARCODE_PC860  = '\x1b\x74\x03' // Portuguese
const CHARCODE_PC863  = '\x1b\x74\x04' // Canadian-French
const CHARCODE_PC865  = '\x1b\x74\x05' // Nordic
const CHARCODE_WEU    = '\x1b\x74\x06' // Simplified Kanji, Hirakana
const CHARCODE_GREEK  = '\x1b\x74\x07' // Simplified Kanji
const CHARCODE_HEBREW = '\x1b\x74\x08' // Simplified Kanji
const CHARCODE_PC1252 = '\x1b\x74\x11' // Western European Windows Code Set
const CHARCODE_PC866  = '\x1b\x74\x12' // Cirillic //2
const CHARCODE_PC852  = '\x1b\x74\x13' // Latin 2
const CHARCODE_PC858  = '\x1b\x74\x14' // Euro
const CHARCODE_THAI42 = '\x1b\x74\x15' // Thai character code 42
const CHARCODE_THAI11 = '\x1b\x74\x16' // Thai character code 11
const CHARCODE_THAI13 = '\x1b\x74\x17' // Thai character code 13
const CHARCODE_THAI14 = '\x1b\x74\x18' // Thai character code 14
const CHARCODE_THAI16 = '\x1b\x74\x19' // Thai character code 16
const CHARCODE_THAI17 = '\x1b\x74\x1a' // Thai character code 17
const CHARCODE_THAI18 = '\x1b\x74\x1b' // Thai character code 18

// Barcode format
const BARCODE_TXT_OFF = '\x1d\x48\x00' // HRI barcode chars OFF
const BARCODE_TXT_ABV = '\x1d\x48\x01' // HRI barcode chars above
const BARCODE_TXT_BLW = '\x1d\x48\x02' // HRI barcode chars below
const BARCODE_TXT_BTH = '\x1d\x48\x03' // HRI barcode chars both above and below
const BARCODE_FONT_A  = '\x1d\x66\x00' // Font type A for HRI barcode chars
const BARCODE_FONT_B  = '\x1d\x66\x01' // Font type B for HRI barcode chars
const BARCODE_HEIGHT  = '\x1d\x68\x64' // Barcode Height [1-255]
const BARCODE_WIDTH   = '\x1d\x77\x03' // Barcode Width  [2-6]
const BARCODE_UPC_A   = '\x1d\x6b\x00' // Barcode type UPC-A
const BARCODE_UPC_E   = '\x1d\x6b\x01' // Barcode type UPC-E
const BARCODE_EAN13   = '\x1d\x6b\x02' // Barcode type EAN13
const BARCODE_EAN8    = '\x1d\x6b\x03' // Barcode type EAN8
const BARCODE_CODE39  = '\x1d\x6b\x04' // Barcode type CODE39
const BARCODE_ITF     = '\x1d\x6b\x05' // Barcode type ITF
const BARCODE_NW7     = '\x1d\x6b\x06' // Barcode type NW7

// Image format  
const S_RASTER_N      = '\x1d\x76\x30\x00' // Set raster image normal size
const S_RASTER_2W     = '\x1d\x76\x30\x01' // Set raster image double width
const S_RASTER_2H     = '\x1d\x76\x30\x02' // Set raster image double height
const S_RASTER_Q      = '\x1d\x76\x30\x03' // Set raster image quadruple

// Printing Density
const PD_N50          = '\x1d\x7c\x00' // Printing Density -50%
const PD_N37          = '\x1d\x7c\x01' // Printing Density -37.5%
const PD_N25          = '\x1d\x7c\x02' // Printing Density -25%
const PD_N12          = '\x1d\x7c\x03' // Printing Density -12.5%
const PD_0            = '\x1d\x7c\x04' // Printing Density  0%
const PD_P50          = '\x1d\x7c\x08' // Printing Density +50%
const PD_P37          = '\x1d\x7c\x07' // Printing Density +37.5%
const PD_P25          = '\x1d\x7c\x06' // Printing Density +25%


module.exports.execute = execute;
module.exports.print = print;
module.exports.println = println;
module.exports.cut = cut;

module.exports.bold = bold;
module.exports.drawLine = drawLine;

module.exports.alignCenter = alignCenter;
module.exports.alignLeft = alignLeft;
module.exports.alignRight = alignRight;

module.exports.setTypeFontA = setTypeFontA;
module.exports.setTypeFontB = setTypeFontB;

module.exports.setTextNormal = setTextNormal;
module.exports.setTextDoubleHeight = setTextDoubleHeight;
module.exports.setTextDoubleWidth = setTextDoubleWidth;
module.exports.setTextQuadArea = setTextQuadArea;

module.exports.printImage = printImage;
//module.exports.barcode = barcode;

var printText = "";

function cut(){
	append(CTL_VT);
	append(CTL_VT);
    append(PAPER_FULL_CUT);
    append(HW_INIT);
}

function print(text){
	append(text);
}

function println(text){
	append(text + "\n");
}

function bold(enabled){
	if(enabled) append(TXT_BOLD_ON);
	else append(TXT_BOLD_OFF);
}


function alignCenter(){
	append(TXT_ALIGN_CT);
}

function alignLeft(){
	append(TXT_ALIGN_LT);
}

function alignRight(){
	append(TXT_ALIGN_RT);
}


function setTypeFontA(){
	append(TXT_FONT_A);
}

function setTypeFontB(){
	append(TXT_FONT_B);
}

function setTextNormal(){
	append(TXT_NORMAL);
}

function setTextDoubleHeight(){
	append(TXT_2HEIGHT);
}

function setTextDoubleWidth(){
	append(TXT_2WIDTH);
}

function setTextQuadArea(){
	append(TXT_4SQUARE);
}

function drawLine(){
	append(TXT_BOLD_ON);
	append("\n-----------------------------------------------\n");
	append(TXT_BOLD_OFF);
}

String.prototype.parseHex = function(){
    return this.replace(/\\x([a-fA-F0-9]{2})/g, function(a,b){
        return String.fromCharCode(parseInt(b,16));
    });
};

function printImage(filename){
	var width, height, pix_line;
	lwip.open(filename, function(err, image){
		width = image.width();
		height = image.height();
		pix_line = "";

		for(var i=0; i<height; i++){
			for(var j=0; j<width; j++){
				var rgb = image.getPixel(i,j);
				var color = rgb.r + rgb.g + rgb.b;
				var bw = parseInt(0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b);
				//console.log("\x" + bw.toString(16));

				if(color > 255) pix_line += '\xFF';
				else pix_line += '\x00';
				
			}
		}

		append(S_RASTER_N);
        append("\x00\x00\xFA\x00");
        append(pix_line);
	});
}





function barcode(code, type, width, height, position, font){
	alignCenter();

	try{
		if(height >=2 && height <=6) append(BARCODE_HEIGHT);
		else throw("Barcode height error");

		if(width >= 1 && width <=255) append(BARCODE_WIDTH);
		else throw("Barcode width error");

		if(font.toUpperCase() == "B") setTypeFontB();
		else setTypeFontA();

		if(position.toUpperCase() == "OFF") append(BARCODE_TXT_OFF);
		else if(position.toUpperCase() == "BOTH") append(BARCODE_TXT_BTH);
		else if(position.toUpperCase() == "ABOVE") append(BARCODE_TXT_ABV);
		else append(BARCODE_TXT_BLW);

		if(type.toUpperCase() == "UPC-A") append(BARCODE_UPC_A);
		else if(type.toUpperCase() == "UPC-E") append(BARCODE_UPC_E);
		else if(type.toUpperCase() == "EAN13") append(BARCODE_EAN13);
		else if(type.toUpperCase() == "EAN8") append(BARCODE_EAN8);
		else if(type.toUpperCase() == "CODE39") append(BARCODE_CODE39);
		else if(type.toUpperCase() == "ITF") append(BARCODE_ITF);
		else if(type.toUpperCase() == "NW7") append(BARCODE_NW7);
		else throw "Barcode type error"


		if(code) append(code);
		else throw "No code!";

	} catch(err) { 
		console.error(err);
	}

	alignLeft();
}


function intToHex(int){
	return "\\x" + int.toString(16);
}



function append(text){
	printText += text;
}

function execute(){
	writeFile('/dev/usb/lp0', printText, function (err) {
	    if (err) {
	        console.log('Print failed', err);
	    } else {
	    	console.log('Print done');
	    	printText = "";
	    }
	});
	
}

function raw(text){
	writeFile('/dev/usb/lp0', text, function (err) {
	    if (err) {
	        console.log('Raw write failed', err);
	    } else {
	    	console.log('Raw done');
	    }
	});
}

// exec('echo "' + text + '" > /dev/usb/lp0', function (error, stdout, stderr) {
// 	if (error !== null) {
// 		console.log('exec error: ' + error);
// 	}
// });