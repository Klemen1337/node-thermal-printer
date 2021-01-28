// @ts-ignore
import InterByteTimeout from "@serialport/parser-inter-byte-timeout";
import SerialPort, { OpenOptions, Readable } from "serialport";
import PromiseQueue from "./helper";
import Interface from "./interface";

export default class SerialInterface extends Interface {
  public port!: SerialPort;
  private promiseQueue = new PromiseQueue<Buffer>();
  private stream!: Readable;
  private connected: Promise<boolean>;

  constructor(port: string, options: OpenOptions = {}) {
    super();
    this.connected = new Promise(resolve => {
      this.port = new SerialPort(
        port,
        {
          baudRate: 115200,
          dataBits: 8,
          stopBits: 1,
          parity: "none",
          rtscts: false,
          xany: false,
          xon: false,
          xoff: false,
          ...options
        },
        (err) => {
          if (err) {
            console.warn(err);
            resolve(false);
          } else {
            resolve(true);
          }
        }
      );

      this.stream = this.port.pipe(new InterByteTimeout({ interval: 30 }));
      this.stream.on("data", data => {
        this.promiseQueue.push(data);
      });
    });
  }

  public async isPrinterConnected() {
    return this.connected;
  }

  public async execute(cmd: Buffer) {
    this.port.write(cmd);
  }
  public async executeCommand(cmd: Buffer, timeout?: number) {
    this.port.write(cmd);
    return this.promiseQueue.readBlocking(timeout);
  }

}
