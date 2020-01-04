import Interface from './interface';
// const Net = require("net");
import * as Net from "net";


export interface NetworkOptions {
  timeout?: number;
}



export class Network extends Interface {

  timeout: number;
  host: string;
  port: number;

  constructor(host: string, port: number, options: NetworkOptions) {
    super();
    options = options || {};
    this.timeout = options.timeout || 3000;
    this.host = host;
    this.port = port || 9100;
  }


  async isPrinterConnected(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      var printer = Net.connect(
        {
          host: this.host,
          port: this.port,
          timeout: this.timeout
        }, 
        function () {
          resolve(true);
          printer.destroy();
        }
      );
  
      printer.on('error', function (error) {
        console.error("Printer network connection error:", error);
        resolve(false);
        printer.destroy();
      });
  
      printer.on('timeout', function () {
        console.error("Printer network connection timeout.");
        resolve(false);
        printer.destroy();
      });
    });
  }


  async execute(buffer): Promise<String> {
    return new Promise((resolve, reject) => {
      let name = this.host + ":" + this.port;
      var printer = Net.connect(
        {
          host: this.host,
          port: this.port,
          timeout: this.timeout
        },
        function () {
          printer.write(buffer, null, function () {

            console.log( printer.read() );
            resolve("Data sent to printer: " + name);
            printer.destroy();
          });
        }
      );
  
      printer.on('error', function (error) {
        reject(error);
        printer.destroy();
      });
  
      printer.on('timeout', function () {
        reject(new Error("Socket timeout"));
        printer.destroy();
      });
    });
  }
}