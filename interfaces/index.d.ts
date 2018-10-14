export interface IPrinterConfig {

    /**
     * Printer brand, currently the only supported brands are Star and Epson.
     * - star
     * - epson
     */
    type: string,

    /**
     * The maximum number of characters the printer can print in one row (Font A).
     */
    width: number,

    /**
     * The interface to connect to; eg
     * - /dev/usb/lp0
     * - tcp://10.0.1.23:9100
     */
    interface: string,

    /**
     * If true, it replaces special characters by ascii equivalent.
     */
    removeSpecialCharacters?: boolean,
}
