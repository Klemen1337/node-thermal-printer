
export default class Interface {
  getPrinterName(): string {
    throw new Error("'getPrinterName' function not implemented.");
  }

  async isPrinterConnected(): Promise<boolean> {
    throw new Error("'isPrinterConnected' function not implemented.");
  }

  async execute(buffer): Promise<String> {
    throw new Error("'execute' function not implemented.");
  }
}
