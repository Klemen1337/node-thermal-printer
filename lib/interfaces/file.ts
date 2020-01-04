import Interface from './interface';
const fs = require("fs");



export class File extends Interface {
  path: string;
  writeFile: any;
  constructor(path: string) {
    super();
    this.path = path;
    this.writeFile = require("write-file-queue")({
      retries: 1000, 	// number of write attempts before failing
      waitTime: 200   // number of milliseconds to wait between write attempts
    });
  }


  async isPrinterConnected() {
    try {
      return fs.existsSync(this.path);
    } catch(error) {
      throw error;
    }
  }


  async execute(buffer): Promise<string> {
    return new Promise((resolve, reject) => {
      this.writeFile(this.path, buffer, function (error) {
        if (error) {
          reject(error);
        } else {
          resolve("Print done");
        }
      });
    });
  }
}
