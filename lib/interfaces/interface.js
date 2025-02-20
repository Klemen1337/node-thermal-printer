class Interface {
  getPrinterName () {
    throw new Error("'getPrinterName' function not implemented.");
  }

  async isPrinterConnected () {
    throw new Error("'isPrinterConnected' function not implemented.");
  }

  async execute () {
    throw new Error("'execute' function not implemented.");
  }
}

module.exports = Interface;
