import { OpenOptions } from "serialport";

// Type definitions for node-thermal-printer 4.1.0
// Project: https://github.com/Klemen1337/node-thermal-printer
// Definitions by: Klemen Kastelic<https://github.com/Klemen1337>
// TypeScript Version: 3.5.2

/**
 * Supported printer types are EPSON and STAR
 */

declare enum PrinterTypes {
  EPSON = "epson",
  STAR = "star"
}

interface PrinterConfig {
  type?: PrinterTypes;
  interface: string;
  width?: number;
  characterSet?: string;
  lineCharacter?: string;
  /**
   * @var require("printer") or require("electron-printer") only needed for interface `printer:`
   */
  driver?: Object;
  removeSpecialCharacters?: boolean;
  options?: {
    commandTimeout?: number
  } & (
    | { // network-Interface
      timeout?: number
    }
    | OpenOptions // serialport-Interface
  );
}

declare class ThermalPrinter {
  printerTypes: PrinterTypes;

  /**
   * Constructor
  */
  constructor(config: PrinterConfig);

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
   * @param {Buffer} buffer
  */
  add(buffer: Buffer): void;

  /**
   * Set character set
   * @param {String} characterSet character set
  */
  setCharacterSet(characterSet: String): void;

  /**
   * Add text
   * @param {String} text
  */
  print(text: string): void;

  /**
   * Add text with new line
   * @param {String} text
  */
  println(text: string): void;

  /**
   * Add vertical tab
  */
  printVerticalTab(): void;

  /**
   * Set text bold
   * @param {Boolean} enabled is enabled
  */
  bold(enabled: boolean): void;

  /**
   * Set text undeline
   * @param {Boolean} enabled is enabled
  */
  underline(enabled: boolean): void;

  /**
   * Set text undeline and bold
   * @param {Boolean} enabled is enabled
  */
  underlineThick(enabled: boolean): void;

  /**
   * Set text upside down
   * @param {Boolean} enabled is enabled
   */
  upsideDown(enabled: boolean): void;

  /**
   * Set text background and text color inverted
   * @param {Boolean} enabled is enabled
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
   * @param {Number} height
   * @param {Number} width
  */
  setTextSize(height: number, width: number): void;

  /**
   * Add font to left side and right side
   * @param {String} left left side text
   * @param {String} right right side text
  */
  leftRight(left: string, right: string): void;

  /**
   * Insert table of data (width split equally)
   * @param {Array} data Array of values
  */
  table(data: string[]): void;

  /**
   * Insert table of data with custom cell settings
   * @param {Array} data Array of objects
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
   * @param {String} str QR data
   * @param {Object} settings Settings (cellSize, correction, model)
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
   * @param {String} data barcode data
   * @param {Number} type type of barcode
   * @param {Object} settings barcode settings (hriPos, hriFont, width, height)
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
   * @param {String} data barcode data
   * @param {Object} settings barcode settings (mode)
  */
  maxiCode(
    data: string,
    settings?: {
      mode?: number;
    }
  ): void;

  /**
   * Add code128 barcode
   * @param {String} data barcode data
   * @param {Object} settings barcode settings (width, height, text)
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
   * @param {String} data barcode data
   * @param {Object} settings (rowHeight, width, correction, truncated, columns)
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
   * @param {String} image file path
   * @returns Promise<Buffer> image buffer
  */
  printImage(image: string): Promise<Buffer>;

  /**
   * Add image buffer
   * @param {Buffer} buffer image buffer
   * @returns Promise<Buffer> printer image buffer
  */
  printImageBuffer(buffer: Buffer): Promise<Buffer>;

  /**
   * Send buffer to printer
   * @param {Buffer} text
   * @returns Promise<String>
  */
  raw(text: Buffer): Promise<String>;

  /**
   * Manually set the printer driver
   * @param {Object} driver Object driver the printer driver
  */
  setPrinterDriver(driver: Object): void;

  /**
   * Manually append content to the current buffer
   * @param {string|Buffer} content string or buffer to append
   */
  append(content: string | Buffer): void;

  /**
   * Fetches the Drawer-Status
   * Only works with supported Interfaces. The `printer`-Interface doesn't support reading!
   */
  readPeripheralStatus(): Promise<boolean>;
  /**
   * Fetches the Paper-Status
   * Only works with supported Interfaces. The `printer`-Interface doesn't support reading!
   */
  readPaperStatus(): Promise<number>;
}


export {
  ThermalPrinter as printer,
  PrinterTypes as types
};