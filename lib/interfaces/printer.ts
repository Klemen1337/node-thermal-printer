import Interface from './interface'

export class Printer extends Interface {
  name: string;
  driver: any;
  constructor(printerName: string, moduleName: Object) {
    super();
    this.name = printerName;
    if (moduleName && typeof moduleName === "object") {
      this.driver = moduleName;
    }
  }


  getPrinterName () {
    let name = this.name;
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
  }


  async isPrinterConnected () {
    if (this.driver.getPrinter(this.getPrinterName())) {
      return true;
    } else {
      throw false;
    }
  }

  async execute(buffer): Promise<String> {
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
  }
}
