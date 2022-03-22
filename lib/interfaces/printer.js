const Interface = require('./interface');

class Printer extends Interface {
  constructor(printerName, moduleName) {
    super();
    this.name = printerName;
    if (moduleName && typeof moduleName === 'object') {
      this.driver = moduleName;
    } else {
      throw new Error('No driver set!');
    }
  }

  getPrinterName() {
    let { name } = this;
    if (!name || name === 'auto') {
      const pl = this.driver.getPrinters().filter((p) => p.attributes.indexOf('RAW-ONLY') > -1);
      if (pl.length > 0) {
        name = pl[0].name;
      }
    }
    if (!name || name === 'auto') {
      throw new Error('A RAW-ONLY Printer could not be detected. Please configure a Printer-Name');
    }
    return name;
  }

  async isPrinterConnected() {
    const foundPrinter = this.driver.getPrinter(this.getPrinterName());
    if (foundPrinter && foundPrinter.status.indexOf('NOT-AVAILABLE') === -1) {
      return true;
    }
    throw false;
  }

  async execute(buffer) {
    return new Promise((resolve, reject) => {
      this.driver.printDirect({
        data: buffer,
        printer: this.getPrinterName(),
        type: 'RAW',
        success(jobID) {
          resolve(`Printed with job id: ${jobID}`);
        },
        error(error) {
          reject(error);
        },
      });
    });
  }
}

module.exports = Printer;
