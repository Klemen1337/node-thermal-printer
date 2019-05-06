type printerTypes = {
  EPSON: "epson";
  STAR: "start";
};
type charSets = {
  EPSON: {
    USA        : Buffer,
    FRANCE     : Buffer,
    GERMANY    : Buffer,
    UK         : Buffer,
    DENMARK1   : Buffer,
    SWEDEN     : Buffer,
    ITALY      : Buffer,
    SPAIN1     : Buffer,
    JAPAN      : Buffer,
    NORWAY     : Buffer,
    DENMARK2   : Buffer,
    SPAIN2     : Buffer,
    LATINA     : Buffer,
    KOREA      : Buffer,
    SLOVENIA   : Buffer,
    CHINA      : Buffer,
    VIETNAM    : Buffer,
    ARABIA     : Buffer,
    PC437      : Buffer,
    Katakana   : Buffer,
    PC850      : Buffer,
    PC860      : Buffer,
    PC863      : Buffer,
    PC865      : Buffer,
    HIRAGANA   : Buffer,
    KANJI1     : Buffer,
    KANJI2     : Buffer,
    PC851      : Buffer,
    PC853      : Buffer,
    PC857      : Buffer,
    PC737      : Buffer,
    ISO8859_7  : Buffer,
    WPC1252    : Buffer,
    PC866      : Buffer,
    PC852      : Buffer,
    PC858      : Buffer,
    THAI42     : Buffer,
    THAI11     : Buffer,
    THAI13     : Buffer,
    THAI14     : Buffer,
    THAI16     : Buffer,
    THAI17     : Buffer,
    THAI18     : Buffer,
    TCVN3V1    : Buffer,
    TCVN3V2    : Buffer,
    PC720      : Buffer,
    WPC775     : Buffer,
    PC855      : Buffer,
    PC861      : Buffer,
    PC862      : Buffer,
    PC864      : Buffer,
    PC869      : Buffer,
    ISO8859_2  : Buffer,
    ISO8859_15 : Buffer,
    PC1098     : Buffer,
    PC1118     : Buffer,
    PC1119     : Buffer,
    PC1125     : Buffer,
    WPC1250    : Buffer,
    WPC1251    : Buffer,
    WPC1253    : Buffer,
    WPC1254    : Buffer,
    WPC1255    : Buffer,
    WPC1256    : Buffer,
    WPC1257    : Buffer,
    WPC1258    : Buffer,
    KZ1048	   : Buffer,
    DEVANAGARI : Buffer,
    BENGALI    : Buffer,
    TAMIL      : Buffer,
    TELUGU     : Buffer,
    ASSAMESE   : Buffer,
    ORIYA      : Buffer,
    KANNADA    : Buffer,
    MALAYALAM  : Buffer,
    GUJARATI   : Buffer,
    PUNJABI    : Buffer,
    MARATHI    : Buffer,
  },
  STAR: {
    PC437      : Buffer,
    JIS        : Buffer,
    PC858      : Buffer,
    PC860      : Buffer,
    PC863      : Buffer,
    PC865      : Buffer,
    GREEK      : Buffer,
    HEBREW     : Buffer,
    PC1252     : Buffer,
    PC866      : Buffer,
    PC852      : Buffer,
    THAI42     : Buffer,
    THAI11     : Buffer,
    THAI13     : Buffer,
    THAI14     : Buffer,
    THAI16     : Buffer,
    THAI17     : Buffer,
    THAI18     : Buffer,
    USA        : Buffer,
    JAPANESE   : Buffer,
    MULTI      : Buffer,
    PORTUGUESE : Buffer,
    CANADIAN   : Buffer,
    NORDIC     : Buffer,
    WESTEUROPE : Buffer,
    CIRLILLIC  : Buffer,
    LATIN2     : Buffer,
    SLOVENIA   : Buffer,
  },
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
  setTextSize(height: number, width: number): void;
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

export = {printer, types: printerTypes, charSets};
