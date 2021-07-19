const PrinterType = require("./printer-type");

class Brother extends PrinterType {
  constructor() {
    super();
    this.config = require('./brother-config');
  }
  

  // ------------------------------ Append ------------------------------
  append(appendBuffer) {
    if (this.buffer) {
      this.buffer = Buffer.concat([this.buffer, appendBuffer]);
    } else {
      this.buffer = appendBuffer;
    }
  }


  
}

module.exports = Brother;