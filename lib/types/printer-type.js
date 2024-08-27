const {PNG} = require("pngjs");
const jpeg = require("jpeg-js");

class PrinterType {
  constructor() {
    // console.error('Constructor not set');
  }

  beep() {
    console.error(new Error("'beep' not implemented yet"));
    return null;
  }

  printQR(str, settings) {
    console.error(new Error("'printQR' not implemented yet"));
    return null;
  }

  pdf417(data, settings) {
    console.error(new Error("'pdf417' not implemented yet"));
    return null;
  }

  code128(data, settings) {
    console.error(new Error("'code128' not implemented yet"));
    return null;
  }

  maxiCode(data, settings) {
    console.error(new Error("'maxiCode' not implemented yet"));
    return null;
  }

  printBarcode(data, type, settings) {
    console.error(new Error("'printBarcode' not implemented yet"));
    return null;
  }

  async printImage(image) {
    console.error(new Error("'printImage' not implemented yet"));
    return null;
  }

  printImageBuffer(width, height, data) {
    console.error(new Error("'printImageBuffer' not implemented yet"));
    return null;
  }

  getImageData(imagePath) {
    const fs = require('fs');

    let image = null;

    const file = fs.readFileSync(imagePath);
    if(!file){
      throw new Error(`Could not read image ${imagePath}.`);
    }

    // Detect if file is jpg
    if (file[0] === 0xff) {
      image = jpeg.decode(file);
    } else {
      image = PNG.sync.read(file);
    }

    if (image == null) {
      throw new Error("Could not read image.");
    }

    return image;
  }
}

module.exports = PrinterType;
