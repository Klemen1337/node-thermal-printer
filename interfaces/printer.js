const electron = typeof process !== 'undefined' && process.versions && !!process.versions.electron;

function PrinterIface (printerName, moduleName) {
  this.name = printerName;
  if (moduleName && typeof moduleName === "object") {
    this.driver = moduleName;
  } else {
    this.driver = require(moduleName || (electron ? "electron-printer" : "printer"));
  }
}


PrinterIface.prototype.getPrinterName = function () {
  var name = this.name;
  if (!name || name === "auto") {
    const pl = this.driver.getPrinters().filter(function (p) {
      return p.attributes.indexOf("RAW-ONLY") > -1
    });
    if (pl.length > 0) {
      name = pl[0].name;
    }
  }
  if (!name || name === "auto") {
    throw new Error("A RAW-ONLY Printer could not be detected. Please configure a Printer-Name");
  }
  return name;
};


PrinterIface.prototype.isPrinterConnected = async function () {
  if (this.driver.getPrinter(this.getPrinterName())) {
    return true;
  } else {
    throw false;
  }
};


PrinterIface.prototype.execute = async function (buffer) {
  return new Promise((resolve, reject) => {
    this.driver.printDirect({
      data: buffer,
      printer: this.getPrinterName(),
      type: "RAW",
      success: function (jobID) {
        resolve("Printed with job id: " + jobID);
      },
      error: function (error) {
        reject(error);
      }
    });
  });
};

module.exports = PrinterIface;