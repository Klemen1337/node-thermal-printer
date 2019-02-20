type printerTypes = {
  EPSON: "epson";
  STAR: "start";
};
interface printer {
  printerTypes: printerTypes;
  init(initConfig: {
    type?: printerTypes["EPSON"] | printerTypes["STAR"];
    interface: string;
    width?: number;
    characterSet?: string;
    removeSpecialCharacters?: boolean;
    replaceSpecialCharacters?: boolean;
    extraSpecialCharacters?: { 
      [key: string]: string
    };
    options?: { 
      timeout?: number
    };
  }): void;

  execute(): Promise;
  cut(): void;
  partialCut(): void;
  beep(): void;
  getWidth(): number;
  getText(): string;
  getBuffer(): Buffer;
  clear(): void;
  add(buffer: Buffer): void;
  print(text: string): void;
  println(text: string): void;
  printVerticalTab(): void;
  bold(enabled: boolean): void;
  underline(enabled: boolean): void;
  underlineThick(enabled: boolean): void;
  invert(enabled: boolean): void;
  openCashDrawer(): void;
  alignCenter(): void;
  alignLeft(): void;
  alignRight(): void;
  setTypeFontA(): void;
  setTypeFontB(): void;
  setTextNormal(): void;
  setTextDoubleHeight(): void;
  setTextDoubleWidth(): void;
  setTextQuadArea(): void;
  newLine(): void;
  drawLine(): void;
  leftRight(left: string, right: string): void;
  table(data: string[]): void;
  tableCustom(data: { 
    text: string; 
    align?: "CENTER" | "RIGHT" | "LEFT"; 
    width?: number; 
    bold?: boolean
  }[]): void;
  isPrinterConnected(): Promise<boolean>;
  printQR(
    str: string,
    settings?: {
      cellSize?: number;
      correction?: "L" | "M" | "Q" | "H";
      model?: number;
    }
  ): void;
  printBarcode(
    data: string,
    type?: number,
    settings?: {
      hriPos?: number;
      hriFont?: number;
      width?: number;
      height?: number;
    }
  ): void;
  maxiCode(
    data: string,
    settings?: {
      mode?: number;
    }
  ): void;
  code128(
    data: string,
    settings?: {
      width?: "LARGE" | "SMALL" | "MEDIUM";
      height?: number;
      text?: number;
    }
  ): void;
  pdf417(
    data: string,
    settings?: {
      rowHeight?: number;
      width?: number;
      correction?: number;
      truncated?: boolean;
      columns?: number;
    }
  ): void;
  printImage(image: string): Promise<Buffer>;
  printImageBuffer(buffer: Buffer): Promise<string>;
  raw(text: Buffer): Promise<string>;
}

export = printer;
