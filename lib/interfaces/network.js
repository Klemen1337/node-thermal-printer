const Net = require('net');
const Interface = require('./interface');

class Network extends Interface {
  constructor(host, port, options) {
    super();
    options = options || {};
    this.timeout = options.timeout || 3000;
    this.host = host;
    this.port = port || 9100;
  }

  async isPrinterConnected() {
    return new Promise((resolve) => {
      const printer = Net.connect(
        {
          host: this.host,
          port: this.port,
          timeout: this.timeout,
        },
        () => {
          resolve(true);
          printer.destroy();
        },
      );

      printer.on('error', (error) => {
        console.error('Printer network connection error:', error);
        resolve(false);
        printer.destroy();
      });

      printer.on('timeout', () => {
        console.error('Printer network connection timeout.');
        resolve(false);
        printer.destroy();
      });
    });
  }

  async execute(buffer) {
    return new Promise((resolve, reject) => {
      const name = `${this.host}:${this.port}`;
      const printer = Net.connect(
        {
          host: this.host,
          port: this.port,
          timeout: this.timeout,
        },
        () => {
          printer.write(buffer, null, () => {
            resolve(`Data sent to printer: ${name}`);
            printer.destroy();
          });
        },
      );

      printer.on('error', (error) => {
        reject(error);
        printer.destroy();
      });

      printer.on('timeout', () => {
        reject(new Error('Socket timeout'));
        printer.destroy();
      });
    });
  }
}

module.exports = Network;
