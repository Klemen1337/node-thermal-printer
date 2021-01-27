// @ts-ignore
import InterByteTimeout from "@serialport/parser-inter-byte-timeout";
import SerialPort, { OpenOptions, Readable } from "serialport";
import PromiseQueue from "./helper";
import {URLSearchParams} from "url";
import Interface from "./interface";

export default class SerialInterface extends Interface {
  public readonly port: SerialPort;
  private promiseQueue = new PromiseQueue<Buffer>();
  private stream: Readable;
  private connected: boolean = false;

  constructor(port: string, options: OpenOptions = {}) {
    super();
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
          this.connected = false;
        } else {
          this.connected = true;
        }
      }
    );

    this.stream = this.port.pipe(new InterByteTimeout({ interval: 100 }));
    this.stream.on("data", data => {
      this.promiseQueue.push(data);
    });
  }

  public async isPrinterConnected() {
    return this.connected;
  }

  public async execute(cmd: Buffer, cb?: (err: Error | null) => void) {
    try {
      this.port.write(cmd);
    } catch (e) {
      cb && cb(e);
    }
    cb && cb(null);
  }
  public async executeCommand(cmd: Buffer, timeout?: number) {
    this.port.write(cmd);
    return this.promiseQueue.readBlocking(timeout);
  }

}
