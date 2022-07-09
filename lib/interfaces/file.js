const fs = require('fs');
const Interface = require('./interface');

class File extends Interface {
  constructor(path) {
    super();
    this.path = path;
    this.writeFile = require('write-file-queue')({
      retries: 1000, // number of write attempts before failing
      waitTime: 200, // number of milliseconds to wait between write attempts
    });
  }

  async isPrinterConnected() {
    try {
      return fs.existsSync(this.path);
    } catch (error) {
      throw error;
    }
  }

  async execute(buffer) {
    return new Promise((resolve, reject) => {
      const pTimeout = setTimeout(() => { reject('Printer Error'); }, 5000);
      this.writeFile(this.path, buffer, (error) => {
        clearTimeout(pTimeout);
        if (error) {
          reject(error);
        } else {
          resolve('Print done');
        }
      });
    });
  }
}

module.exports = File;
