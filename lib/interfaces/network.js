const PromiseQueue = require("./helper").default;
const Interface = require("./interface").default;
const Net = require("net");


class Network extends Interface {
  constructor(host, port, options) {
    super();
    options = options || {};
    this.timeout = options.timeout || 3000;
    this.host = host;
    this.port = port || 9100;
    this.promiseQueue = new PromiseQueue();
  }


  async isPrinterConnected() {
    return Boolean(await this.connect());
  }

  connect() {
    if (this.connectPromise) {
      return this.connectPromise;
    }
    if (!this.connectPromise) {
        this.connectPromise = new Promise((resolve, reject) => {
          let connection =
           Net.connect( {
              host: this.host,
              port: this.port,
              timeout: this.timeout
            },
            function () {
             this.connectPromise = undefined;
              resolve(connection);
            }
          );
          this.connection = connection;

          connection.on("data", data => {
            this.promiseQueue.push(data);
          });

          connection.on('error', (error) => {
            console.error("Printer network connection error:", error);
            this.connectPromise && resolve(false);
            connection.destroy();
            this.connection = undefined;
            this.connectPromise = undefined;
          });

          connection.on('timeout', () => {
            console.error("Printer network connection timeout.");
            resolve(false);
            this.connectPromise && connection.destroy();
            this.connection = undefined;
            this.connectPromise = undefined;
          });
          connection.on('close', () => {
            console.warn("Printer network connection closed.");
            this.connectPromise && resolve(false);
            connection.destroy();
            this.connection = undefined;
            this.connectPromise = undefined;
          })
        });
      return this.connectPromise;
    }
    return this.connection;
  }


  async execute(buffer) {
    return new Promise(async resolve => (await this.connect()).write(buffer, 'utf8', resolve));
  }
}


module.exports = Network;