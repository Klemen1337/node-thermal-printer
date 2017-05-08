module.exports = {
    // Feed control sequences
    CTL_LF     : new Buffer([0x0a]),              // Print and line feed
    CTL_FF     : new Buffer([0x0c]),              // Form feed
    CTL_CR     : new Buffer([0x0d]),              // Carriage return
    CTL_HT     : new Buffer([0x09]),              // Horizontal tab
    CTL_SET_HT : new Buffer([0x1b, 0x44]),          // Set horizontal tab positions
    CTL_VT     : new Buffer([0x1b, 0x64, 0x04]),      // Vertical tab

    // Printer hardware
    HW_INIT    : new Buffer([0x1b, 0x40]),          // Clear data in buffer and reset modes
    HW_SELECT  : new Buffer([0x1b, 0x3d, 0x01]),      // Printer select
    HW_RESET   : new Buffer([0x1b, 0x3f, 0x0a, 0x00]),  // Reset printer hardware
    BEEP       : new Buffer([0x1b, 0x1e]),              // Sounds built-in buzzer (if equipped)
    UPSIDE_DOWN_ON  : new Buffer([0x1b,0x7b,0x01]),     // Upside down printing ON (rotated 180 degrees).
    UPSIDE_DOWN_OFF : new Buffer([0x1b,0x7b,0x00]),     // Upside down printing OFF (default).

    // Cash Drawer
    CD_KICK_2  : new Buffer([0x1b, 0x70, 0x00]),      // Sends a pulse to pin 2 []
    CD_KICK_5  : new Buffer([0x1b, 0x70, 0x01]),      // Sends a pulse to pin 5 []

    // Paper
    PAPER_FULL_CUT  : new Buffer([0x1d, 0x56, 0x00]), // Full cut paper
    PAPER_PART_CUT  : new Buffer([0x1d, 0x56, 0x01]), // Partial cut paper

    // Text format
    TXT_NORMAL      : new Buffer([0x1b, 0x21, 0x00]), // Normal text
    TXT_2HEIGHT     : new Buffer([0x1b, 0x21, 0x10]), // Double height text
    TXT_2WIDTH      : new Buffer([0x1b, 0x21, 0x20]), // Double width text
    TXT_4SQUARE     : new Buffer([0x1b, 0x21, 0x30]), // Quad area text
    TXT_UNDERL_OFF  : new Buffer([0x1b, 0x2d, 0x00]), // Underline font OFF
    TXT_UNDERL_ON   : new Buffer([0x1b, 0x2d, 0x01]), // Underline font 1-dot ON
    TXT_UNDERL2_ON  : new Buffer([0x1b, 0x2d, 0x02]), // Underline font 2-dot ON
    TXT_BOLD_OFF    : new Buffer([0x1b, 0x45, 0x00]), // Bold font OFF
    TXT_BOLD_ON     : new Buffer([0x1b, 0x45, 0x01]), // Bold font ON
    TXT_INVERT_OFF  : new Buffer([0x1d, 0x42, 0x00]), // Invert font OFF (eg. white background)
    TXT_INVERT_ON   : new Buffer([0x1d, 0x42, 0x01]), // Invert font ON (eg. black background)
    TXT_FONT_A      : new Buffer([0x1b, 0x4d, 0x00]), // Font type A
    TXT_FONT_B      : new Buffer([0x1b, 0x4d, 0x01]), // Font type B
    TXT_ALIGN_LT    : new Buffer([0x1b, 0x61, 0x00]), // Left justification
    TXT_ALIGN_CT    : new Buffer([0x1b, 0x61, 0x01]), // Centering
    TXT_ALIGN_RT    : new Buffer([0x1b, 0x61, 0x02]), // Right justification

    // Char code table
    CHARCODE_USA        : new Buffer([0x1b, 0x52, 0x00]), // USA
    CHARCODE_FRANCE     : new Buffer([0x1b, 0x52, 0x01]), // France
    CHARCODE_GERMANY    : new Buffer([0x1b, 0x52, 0x02]), // Germany
    CHARCODE_UK         : new Buffer([0x1b, 0x52, 0x03]), // U.K.
    CHARCODE_DENMARK1   : new Buffer([0x1b, 0x52, 0x04]), // Denmark I
    CHARCODE_SWEDEN     : new Buffer([0x1b, 0x52, 0x05]), // Sweden
    CHARCODE_ITALY      : new Buffer([0x1b, 0x52, 0x06]), // Italy
    CHARCODE_SPAIN1     : new Buffer([0x1b, 0x52, 0x07]), // Spain I
    CHARCODE_JAPAN      : new Buffer([0x1b, 0x52, 0x08]), // Japan
    CHARCODE_NORWAY     : new Buffer([0x1b, 0x52, 0x09]), // Norway
    CHARCODE_DENMARK2   : new Buffer([0x1b, 0x52, 0x0A]), // Denmark II
    CHARCODE_SPAIN2     : new Buffer([0x1b, 0x52, 0x0B]), // Spain II
    CHARCODE_LATINA     : new Buffer([0x1b, 0x52, 0x0C]), // Latin America
    CHARCODE_KOREA      : new Buffer([0x1b, 0x52, 0x0D]), // Korea
    CHARCODE_SLOVENIA   : new Buffer([0x1b, 0x52, 0x0E]), // Slovenia
    CHARCODE_CHINA      : new Buffer([0x1b, 0x52, 0x0F]), // China
    CHARCODE_VIETNAM    : new Buffer([0x1b, 0x52, 0x10]), // Vietnam
    CHARCODE_ARABIA     : new Buffer([0x1b, 0x52, 0x11]), // ARABIA


    // Barcode format
    BARCODE_TXT_OFF : new Buffer([0x1d, 0x48, 0x00]), // HRI barcode chars OFF
    BARCODE_TXT_ABV : new Buffer([0x1d, 0x48, 0x01]), // HRI barcode chars above
    BARCODE_TXT_BLW : new Buffer([0x1d, 0x48, 0x02]), // HRI barcode chars below
    BARCODE_TXT_BTH : new Buffer([0x1d, 0x48, 0x03]), // HRI barcode chars both above and below
    BARCODE_FONT_A  : new Buffer([0x1d, 0x66, 0x00]), // Font type A for HRI barcode chars
    BARCODE_FONT_B  : new Buffer([0x1d, 0x66, 0x01]), // Font type B for HRI barcode chars
    BARCODE_HEIGHT  : new Buffer([0x1d, 0x68, 0x64]), // Barcode Height [1-255]
    BARCODE_WIDTH   : new Buffer([0x1d, 0x77, 0x03]), // Barcode Width  [2-6]
    BARCODE_UPC_A   : new Buffer([0x1d, 0x6b, 0x00]), // Barcode type UPC-A
    BARCODE_UPC_E   : new Buffer([0x1d, 0x6b, 0x01]), // Barcode type UPC-E
    BARCODE_EAN13   : new Buffer([0x1d, 0x6b, 0x02]), // Barcode type EAN13
    BARCODE_EAN8    : new Buffer([0x1d, 0x6b, 0x03]), // Barcode type EAN8
    BARCODE_CODE39  : new Buffer([0x1d, 0x6b, 0x04]), // Barcode type CODE39
    BARCODE_ITF     : new Buffer([0x1d, 0x6b, 0x05]), // Barcode type ITF
    BARCODE_NW7     : new Buffer([0x1d, 0x6b, 0x06]), // Barcode type NW7


    // QR Code
    QRCODE_MODEL1: new Buffer([0x1d, 0x28, 0x6b, 0x04, 0x00, 0x31, 0x41, 0x31, 0x00]), // Model 1
    QRCODE_MODEL2: new Buffer([0x1d, 0x28, 0x6b, 0x04, 0x00, 0x31, 0x41, 0x32, 0x00]), // Model 2
    QRCODE_MODEL3: new Buffer([0x1d, 0x28, 0x6b, 0x04, 0x00, 0x31, 0x41, 0x33, 0x00]), // Model 3

    QRCODE_CORRECTION_L: new Buffer([0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x45, 0x30]), // Correction level: L - 7%
    QRCODE_CORRECTION_M: new Buffer([0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x45, 0x31]), // Correction level: M - 15%
    QRCODE_CORRECTION_Q: new Buffer([0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x45, 0x32]), // Correction level: Q - 25%
    QRCODE_CORRECTION_H: new Buffer([0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x45, 0x33]), // Correction level: H - 30%

    QRCODE_CELLSIZE_1: new Buffer([0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x43, 0x01]),   // Cell size 1
    QRCODE_CELLSIZE_2: new Buffer([0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x43, 0x02]),   // Cell size 2
    QRCODE_CELLSIZE_3: new Buffer([0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x43, 0x03]),   // Cell size 3
    QRCODE_CELLSIZE_4: new Buffer([0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x43, 0x04]),   // Cell size 4
    QRCODE_CELLSIZE_5: new Buffer([0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x43, 0x05]),   // Cell size 5
    QRCODE_CELLSIZE_6: new Buffer([0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x43, 0x06]),   // Cell size 6
    QRCODE_CELLSIZE_7: new Buffer([0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x43, 0x07]),   // Cell size 7
    QRCODE_CELLSIZE_8: new Buffer([0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x43, 0x08]),   // Cell size 8

    QRCODE_PRINT: new Buffer([0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x51, 0x30]),        // Print QR code

    // PDF417
    PDF417_CORRECTION: new Buffer([0x1D, 0x28, 0x6B, 0x04, 0x00, 0x30, 0x45, 0x31]),        // Append 1-40 for ratio

    PDF417_ROW_HEIGHT: new Buffer([0x1D, 0x28, 0x6B, 0x03, 0x00, 0x30, 0x44]),              // Append 2-8 for height

    PDF417_WIDTH: new Buffer([0x1D, 0x28, 0x6B, 0x03, 0x00, 0x30, 0x43]),                   // Append 2-8 for width

    PDF417_COLUMNS: new Buffer([0x1D, 0x28, 0x6B, 0x03, 0x00, 0x30, 0x41]),

    PDF417_OPTION_STANDARD: new Buffer([0x1D, 0x28, 0x6B, 0x03, 0x00, 0x30, 0x46, 0x00]),   // Standard barcode
    PDF417_OPTION_TRUNCATED: new Buffer([0x1D, 0x28, 0x6B, 0x03, 0x00, 0x30, 0x46, 0x01]),  // Truncated barcode

    PDF417_PRINT: new Buffer([0x1D, 0x28, 0x6B, 0x03, 0x00, 0x30, 0x51, 0x30]),

    // MaxiCode
    MAXI_MODE2: new Buffer([0x1d, 0x28, 0x6b, 0x03, 0x00, 0x32, 0x41, 0x32]), // Formatted data containing a structured Carrier Message with a numeric postal code. (US)
    MAXI_MODE3: new Buffer([0x1d, 0x28, 0x6b, 0x03, 0x00, 0x32, 0x41, 0x33]), // Formatted data containing a structured Carrier Message with an alphanumeric postal code. (International)
    MAXI_MODE4: new Buffer([0x1d, 0x28, 0x6b, 0x03, 0x00, 0x32, 0x41, 0x34]), // Unformatted data with Standard Error Correction.
    MAXI_MODE5: new Buffer([0x1d, 0x28, 0x6b, 0x03, 0x00, 0x32, 0x41, 0x35]), // Unformatted data with Enhanced Error Correction.
    MAXI_MODE6: new Buffer([0x1d, 0x28, 0x6b, 0x03, 0x00, 0x32, 0x41, 0x36]), // For programming hardware devices.

    MAXI_PRINT: new Buffer([0x1d, 0x28, 0x6B, 0x03, 0x00, 0x32, 0x51, 0x30]),

    // Image format
    S_RASTER_N      : new Buffer([0x1d, 0x76, 0x30, 0x00]), // Set raster image normal size
    S_RASTER_2W     : new Buffer([0x1d, 0x76, 0x30, 0x01]), // Set raster image double width
    S_RASTER_2H     : new Buffer([0x1d, 0x76, 0x30, 0x02]), // Set raster image double height
    S_RASTER_Q      : new Buffer([0x1d, 0x76, 0x30, 0x03]), // Set raster image quadruple

    // Printing Density
    PD_N50          : new Buffer([0x1d, 0x7c, 0x00]), // Printing Density -50%
    PD_N37          : new Buffer([0x1d, 0x7c, 0x01]), // Printing Density -37.5%
    PD_N25          : new Buffer([0x1d, 0x7c, 0x02]), // Printing Density -25%
    PD_N12          : new Buffer([0x1d, 0x7c, 0x03]), // Printing Density -12.5%
    PD_0            : new Buffer([0x1d, 0x7c, 0x04]), // Printing Density  0%
    PD_P50          : new Buffer([0x1d, 0x7c, 0x08]), // Printing Density +50%
    PD_P37          : new Buffer([0x1d, 0x7c, 0x07]), // Printing Density +37.5%
    PD_P25          : new Buffer([0x1d, 0x7c, 0x06]), // Printing Density +25%

    specialCharacters: {
      "Č": 94,
      "č": 126,
      "Š": 91,
      "š": 123,
      "Ž": 64,
      "ž": 96,
      "Đ": 92,
      "đ": 124,
      "Ć": 93,
      "ć": 125,
      "ß": 225,
      "ẞ": 225,
      "ö": 148,
      "Ö": 153,
      "Ä": 142,
      "ä": 132,
      "ü": 129,
      "Ü": 154,
      "é": 130
    }
}
