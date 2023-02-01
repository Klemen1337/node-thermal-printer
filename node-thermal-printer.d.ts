// Type definitions for node-thermal-printer 4.1.0
// Project: https://github.com/Klemen1337/node-thermal-printer
// Definitions by: Klemen Kastelic<https://github.com/Klemen1337>
// TypeScript Version: 3.5.2

/**
 * Supported printer types are EPSON and STAR
 */
declare enum PrinterTypes {
  EPSON = "epson",
  TANCA = "tanca",
  STAR = "star"
}

declare enum BreakLine {
  NONE = 'NONE', // No word break
  CHARACTER = 'CHARACTER', // Break by characters
  WORD = 'WORD' // Break by words
}

declare enum CharacterSet {
  PC437_USA = 'PC437_USA',
  PC850_MULTILINGUAL = 'PC850_MULTILINGUAL',
  PC860_PORTUGUESE = 'PC860_PORTUGUESE',
  PC863_CANADIAN_FRENCH = 'PC863_CANADIAN_FRENCH',
  PC865_NORDIC = 'PC865_NORDIC',
  PC851_GREEK = 'PC851_GREEK',
  PC857_TURKISH = 'PC857_TURKISH',
  PC737_GREEK = 'PC737_GREEK',
  ISO8859_7_GREEK = 'ISO8859_7_GREEK',
  WPC1252 = 'WPC1252',
  PC866_CYRILLIC2 = 'PC866_CYRILLIC2',
  PC852_LATIN2 = 'PC852_LATIN2',
  SLOVENIA = 'SLOVENIA',
  PC858_EURO = 'PC858_EURO',
  WPC775_BALTIC_RIM = 'WPC775_BALTIC_RIM',
  PC855_CYRILLIC = 'PC855_CYRILLIC',
  PC861_ICELANDIC = 'PC861_ICELANDIC',
  PC862_HEBREW = 'PC862_HEBREW',
  PC864_ARABIC = 'PC864_ARABIC',
  PC869_GREEK = 'PC869_GREEK',
  ISO8859_2_LATIN2 = 'ISO8859_2_LATIN2',
  ISO8859_15_LATIN9 = 'ISO8859_15_LATIN9',
  PC1125_UKRANIAN = 'PC1125_UKRANIAN',
  WPC1250_LATIN2 = 'WPC1250_LATIN2',
  WPC1251_CYRILLIC = 'WPC1251_CYRILLIC',
  WPC1253_GREEK = 'WPC1253_GREEK',
  WPC1254_TURKISH = 'WPC1254_TURKISH',
  WPC1255_HEBREW = 'WPC1255_HEBREW',
  WPC1256_ARABIC = 'WPC1256_ARABIC',
  WPC1257_BALTIC_RIM = 'WPC1257_BALTIC_RIM',
  WPC1258_VIETNAMESE = 'WPC1258_VIETNAMESE',
  KZ1048_KAZAKHSTAN = 'KZ1048_KAZAKHSTAN',
  JAPAN = 'JAPAN',
  KOREA = 'KOREA',
  CHINA = 'CHINA',
  HK_TW = 'HK_TW',
  TCVN_VIETNAMESE = 'TCVN_VIETNAMESE'
}

declare class ThermalPrinter {
  printerTypes: PrinterTypes;

  /**
   * Constructor
   * @param Object config (type, interface, width, characterSet, removeSpecialCharacters, options)
  */
  constructor(config: {
    type?: PrinterTypes;
    interface: string;
    width?: number;
    characterSet?: CharacterSet;
    lineCharacter?: string;
    driver?: Object;
    removeSpecialCharacters?: boolean;
    breakLine?: BreakLine;
    options?: {
      timeout?: number
    };
  });

  /**
   * Send printing buffer to printer
   * @returns Promise<String>
  */
  execute(): Promise<String>;

  /**
   * Add cut
  */
  cut(): void;

  /**
   * Add parital cut
  */
  partialCut(): void;

  /**
   * Add beep
  */
  beep(): void;

  /**
   * Get number of characters in one line
   * @returns Number
  */
  getWidth(): number;

  /**
   * Get printing buffer in string
   * @returns String
  */
  getText(): string;

  /**
   * Get printing buffer
   * @returns Buffer
  */
  getBuffer(): Buffer;

  /**
   * Clear printing buffer
  */
  clear(): void;

  /**
   * Add buffer to printing buffer
   * @param Buffer
  */
  add(buffer: Buffer): void;

  /**
   * Set character set
   * @param String character set
  */
  setCharacterSet(characterSet: String): void;

  /**
   * Add text
   * @param String text
  */
  print(text: string): void;

  /**
   * Add text with new line
   * @param String text
  */
  println(text: string): void;

  /**
   * Add vertical tab
  */
  printVerticalTab(): void;

  /**
   * Set text bold
   * @param Boolean is enabled
  */
  bold(enabled: boolean): void;

  /**
   * Set text undeline
   * @param Boolean is enabled
  */
  underline(enabled: boolean): void;

  /**
   * Set text undeline and bold
   * @param Boolean is enabled
  */
  underlineThick(enabled: boolean): void;

  /**
   * Set text upside down
   * @param Boolean is enabled 
   */
  upsideDown(enabled: boolean): void;

  /**
   * Set text background and text color inverted
   * @param Boolean is enabled
  */
  invert(enabled: boolean): void;

  /**
   * Add open cash drawer
  */
  openCashDrawer(): void;

  /**
   * Align text to center
  */
  alignCenter(): void;

  /**
   * Align text to left
  */
  alignLeft(): void;

  /**
   * Align text to right
  */
  alignRight(): void;

  /**
   * Set font type A
  */
  setTypeFontA(): void;

  /**
   * Set font type B
  */
  setTypeFontB(): void;

  /**
   * Set text size to normal
  */
  setTextNormal(): void;

  /**
   * Set text size to double height
  */
  setTextDoubleHeight(): void;

  /**
   * Set text size to double width
  */
  setTextDoubleWidth(): void;

  /**
   * Set text size to double height and width
  */
  setTextQuadArea(): void;

  /**
   * Add new line
  */
  newLine(): void;

  /**
    * Draw a line of characters
  */
  drawLine(): void;

  /**
   * Set height and width font size
   * @param Number height
   * @param Number width
  */
  setTextSize(height: number, width: number): void;

  /**
   * Add font to left side and right side
   * @param String left side text
   * @param String right side text
  */
  leftRight(left: string, right: string): void;

  /**
   * Insert table of data (width split equally)
   * @param Array Array of values
  */
  table(data: string[]): void;

  /**
   * Insert table of data with custom cell settings
   * @param Array Array of objects
  */
  tableCustom(data: {
    text: string;
    align?: "CENTER" | "RIGHT" | "LEFT";
    width?: number;
    cols?: number;
    bold?: boolean;
  }[]): void;

  /**
   * Check if printer is connected
   * @returns Promise<boolean>
  */
  isPrinterConnected(): Promise<boolean>;

  /**
   * Print QR code
   * @param String QR data
   * @param Object Settings (cellSize, correction, model)
  */
  printQR(
    str: string,
    settings?: {
      cellSize?: number;
      correction?: "L" | "M" | "Q" | "H";
      model?: number;
    }
  ): void;

  /**
   * Add barcode
   * @param String barcode data
   * @param Number type of barcode
   * @param Object barcode settings (hriPos, hriFont, width, height)
  */
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

  /**
   * Add maxiCode barcode
   * @param String barcode data
   * @param Object barcode settings (mode)
  */
  maxiCode(
    data: string,
    settings?: {
      mode?: number;
    }
  ): void;

  /**
   * Add code128 barcode
   * @param String barcode data
   * @param Object barcode settings (width, height, text)
  */
  code128(
    data: string,
    settings?: {
      width?: "LARGE" | "SMALL" | "MEDIUM";
      height?: number;
      text?: number;
    }
  ): void;

  /**
   * Add pdf417 barcode
   * @param String barcode data
   * @param Object settings (rowHeight, width, correction, truncated, columns)
  */
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

  /**
   * Add image
   * @param String file path
   * @returns Promise<Buffer> image buffer
  */
  printImage(image: string): Promise<Buffer>;

  /**
   * Add image buffer
   * @param Buffer image buffer
   * @returns Promise<Buffer> printer image buffer
  */
  printImageBuffer(buffer: Buffer): Promise<Buffer>;

  /**
   * Send buffer to printer
   * @param Buffer
   * @returns Promise<String>
  */
  raw(text: Buffer): Promise<String>;

  /**
   * Manually set the printer driver
   * @param Object driver the printer driver
  */
  setPrinterDriver(driver: Object): void;

  /**
   * Manually append content to the current buffer
   * @param {string|Buffer} - content string or buffer to append
   */
  append(content: string | Buffer): void;
}


export {
  ThermalPrinter as printer,
  PrinterTypes as types,
  BreakLine as breakLine,
  CharacterSet as characterSet,
  ThermalPrinter,
  PrinterTypes,
  BreakLine,
  CharacterSet
};
