import Net from "net";
import Interface from "./interface";
import PromiseQueue from "./helper";

let i = 0;
export default class Network extends Interface {
  private readonly timeout: number;
  private readonly host: string;
  private readonly port: number;
  private promiseQueue: PromiseQueue<Buffer>;
  private connectPromise?: Promise<Net.Socket | undefined>;
  private connection?: Net.Socket;

  constructor(host: string, port?: number, options?: { timeout?: number }) {
    super();
    options = options || {};
    this.timeout = options.timeout || 8000;
    this.host = host;
    this.port = port || 9100;
    this.promiseQueue = new PromiseQueue();
  }

  async isPrinterConnected() {
    return Boolean(await this.connect());
  }

  async connect() {
    if (this.connectPromise) {
      return this.connectPromise;
    }
    let conId = ++i;
    if (!this.connection) {
        this.connectPromise = new Promise((resolve, reject) => {
          let connection = Net.connect({
              host: this.host,
              port: this.port,
              timeout: this.timeout
            },
            () => {
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
            this.connectPromise && resolve(undefined);
            connection.destroy();
            this.connection = undefined;
            this.connectPromise = undefined;
          });

          connection.on('timeout', () => {
            if (this.connectPromise) {
              console.error("Printer network connection timeout.", conId);
              this.connectPromise && resolve(undefined);
            } else {
              console.log("Printer network connection timeout: closing unused connection", conId);
            }
            connection.destroy();
            this.connection = undefined;
            this.connectPromise = undefined;
          });
          connection.on('close', () => {
            console.warn("Printer network connection closed.");
            this.connectPromise && resolve(undefined);
            connection.destroy();
            this.connection = undefined;
            this.connectPromise = undefined;
          })
        });
      return this.connectPromise;
    }
    return this.connection;
  }


  async execute(buffer: Buffer) {
    return new Promise<void>(async (resolve, reject) => {
      let connection = await this.connect();
      if (connection) {
        connection.write(buffer, 'utf8', (err) => err ? reject(err) : resolve());
      } else {
        reject('connection failed');
      }
    });
  }

  public async executeCommand(cmd: Buffer, timeout?: number) {
    this.execute(cmd);
    return this.promiseQueue.readBlocking(timeout);
  }
}