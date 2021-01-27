export default class Interface {
  getPrinterName() {
    throw new Error("'getPrinterName' function not implemented.");
  }

  async isPrinterConnected(): Promise<boolean> {
    throw new Error("'isPrinterConnected' function not implemented.");
  }

  async execute(buffer: Buffer): Promise<void> {
    throw new Error("'execute' function not implemented.");
  }

  async executeCommand(buffer: Buffer, timeout?: number): Promise<Buffer> {
    throw new Error("Reading from Printer isn't supported by this interface. use net or serial");
  }
}
