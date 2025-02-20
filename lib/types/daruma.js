const PrinterType = require('./printer-type');

class Daruma extends PrinterType {
  constructor () {
    super();
    this.config = require('./daruma-config');
  }

  // ------------------------------ Append ------------------------------
  append (appendBuffer) {
    if (this.buffer) {
      this.buffer = Buffer.concat([this.buffer, appendBuffer]);
    } else {
      this.buffer = appendBuffer;
    }
  }

  // ------------------------------ Beep ------------------------------
  beep () {
    return this.config.BEEP;
  }
}

module.exports = Daruma;
