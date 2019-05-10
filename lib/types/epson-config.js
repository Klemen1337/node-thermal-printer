module.exports = {
    // Feed control sequences
    CTL_LF     : Buffer.from([0x0a]),                  // Print and line feed
    CTL_FF     : Buffer.from([0x0c]),                  // Form feed
    CTL_CR     : Buffer.from([0x0d]),                  // Carriage return
    CTL_HT     : Buffer.from([0x09]),                  // Horizontal tab
    CTL_SET_HT : Buffer.from([0x1b, 0x44]),            // Set horizontal tab positions
    CTL_VT     : Buffer.from([0x1b, 0x64, 0x04]),      // Vertical tab

    // Printer hardware
    HW_INIT         : Buffer.from([0x1b, 0x40]),               // Clear data in buffer and reset modes
    HW_SELECT       : Buffer.from([0x1b, 0x3d, 0x01]),         // Printer select
    HW_RESET        : Buffer.from([0x1b, 0x3f, 0x0a, 0x00]),   // Reset printer hardware
    BEEP            : Buffer.from([0x1b, 0x1e]),               // Sounds built-in buzzer (if equipped)
    UPSIDE_DOWN_ON  : Buffer.from([0x1b,0x7b,0x01]),           // Upside down printing ON (rotated 180 degrees).
    UPSIDE_DOWN_OFF : Buffer.from([0x1b,0x7b,0x00]),           // Upside down printing OFF (default).

    // Cash Drawer
    CD_KICK_2 : Buffer.from([0x1b, 0x70, 0x00]),      // Sends a pulse to pin 2 []
    CD_KICK_5 : Buffer.from([0x1b, 0x70, 0x01]),      // Sends a pulse to pin 5 []

    // Paper
    PAPER_FULL_CUT : Buffer.from([0x1d, 0x56, 0x00]), // Full cut paper
    PAPER_PART_CUT : Buffer.from([0x1d, 0x56, 0x01]), // Partial cut paper

    // Text format
    TXT_NORMAL      : Buffer.from([0x1b, 0x21, 0x00]), // Normal text
    TXT_2HEIGHT     : Buffer.from([0x1b, 0x21, 0x10]), // Double height text
    TXT_2WIDTH      : Buffer.from([0x1b, 0x21, 0x20]), // Double width text
    TXT_4SQUARE     : Buffer.from([0x1b, 0x21, 0x30]), // Quad area text
    TXT_UNDERL_OFF  : Buffer.from([0x1b, 0x2d, 0x00]), // Underline font OFF
    TXT_UNDERL_ON   : Buffer.from([0x1b, 0x2d, 0x01]), // Underline font 1-dot ON
    TXT_UNDERL2_ON  : Buffer.from([0x1b, 0x2d, 0x02]), // Underline font 2-dot ON
    TXT_BOLD_OFF    : Buffer.from([0x1b, 0x45, 0x00]), // Bold font OFF
    TXT_BOLD_ON     : Buffer.from([0x1b, 0x45, 0x01]), // Bold font ON
    TXT_INVERT_OFF  : Buffer.from([0x1d, 0x42, 0x00]), // Invert font OFF (eg. white background)
    TXT_INVERT_ON   : Buffer.from([0x1d, 0x42, 0x01]), // Invert font ON (eg. black background)
    TXT_FONT_A      : Buffer.from([0x1b, 0x4d, 0x00]), // Font type A
    TXT_FONT_B      : Buffer.from([0x1b, 0x4d, 0x01]), // Font type B
    TXT_ALIGN_LT    : Buffer.from([0x1b, 0x61, 0x00]), // Left justification
    TXT_ALIGN_CT    : Buffer.from([0x1b, 0x61, 0x01]), // Centering
    TXT_ALIGN_RT    : Buffer.from([0x1b, 0x61, 0x02]), // Right justification

    CHARCODES: {
      // Char code table (international)
      USA           : Buffer.from([0x1b, 0x52, 0x00]), // USA
      FRANCE        : Buffer.from([0x1b, 0x52, 0x01]), // France
      GERMANY       : Buffer.from([0x1b, 0x52, 0x02]), // Germany
      UK            : Buffer.from([0x1b, 0x52, 0x03]), // U.K.
      DENMARK1      : Buffer.from([0x1b, 0x52, 0x04]), // Denmark I
      SWEDEN        : Buffer.from([0x1b, 0x52, 0x05]), // Sweden
      ITALY         : Buffer.from([0x1b, 0x52, 0x06]), // Italy
      SPAIN1        : Buffer.from([0x1b, 0x52, 0x07]), // Spain I
      JAPAN         : Buffer.from([0x1b, 0x52, 0x08]), // Japan
      NORWAY        : Buffer.from([0x1b, 0x52, 0x09]), // Norway
      DENMARK2      : Buffer.from([0x1b, 0x52, 0x0A]), // Denmark II
      SPAIN2        : Buffer.from([0x1b, 0x52, 0x0B]), // Spain II
      LATINA        : Buffer.from([0x1b, 0x52, 0x0C]), // Latin America
      KOREA         : Buffer.from([0x1b, 0x52, 0x0D]), // Korea
      SLOVENIA      : Buffer.from([0x1b, 0x52, 0x0E]), // Slovenia
      CHINA         : Buffer.from([0x1b, 0x52, 0x0F]), // China
      VIETNAM       : Buffer.from([0x1b, 0x52, 0x10]), // Vietnam
      ARABIA        : Buffer.from([0x1b, 0x52, 0x11]), // ARABIA

      // Single-byte char code tables (regional)
      CP437         : Buffer.from([0x1b, 0x74, 0]), // CP437: USA, Standard Europe
      Katakana      : Buffer.from([0x1b, 0x74, 1]), // Katakana
      CP850         : Buffer.from([0x1b, 0x74, 2]), // CP850: Multilingual
      CP860         : Buffer.from([0x1b, 0x74, 3]), // CP860: Portuguese
      CP863         : Buffer.from([0x1b, 0x74, 4]), // CP863: Canadian-French
      CP865         : Buffer.from([0x1b, 0x74, 5]), // CP865: Nordic
      HIRAGANA      : Buffer.from([0x1b, 0x74, 6]), // Hiragana
      KANJI1        : Buffer.from([0x1b, 0x74, 7]), // One-pass printing Kanji characters
      KANJI2        : Buffer.from([0x1b, 0x74, 8]), // One-pass printing Kanji characters
      CP851         : Buffer.from([0x1b, 0x74, 11]), // CP851: Greek
      CP853         : Buffer.from([0x1b, 0x74, 12]), // CP853: Turkish
      CP857         : Buffer.from([0x1b, 0x74, 13]), // CP857: Turkish
      CP737         : Buffer.from([0x1b, 0x74, 14]), // CP737: Greek
      ISO_8859_7    : Buffer.from([0x1b, 0x74, 15]), // ISO8859-7: Greek
      CP1252        : Buffer.from([0x1b, 0x74, 16]), // WCP1252 Russian
      CP866         : Buffer.from([0x1b, 0x74, 17]), // CP866: Cyrillic #2
      CP852         : Buffer.from([0x1b, 0x74, 18]), // CP852: Latin 2
      CP858         : Buffer.from([0x1b, 0x74, 19]), // CP858: Euro
      THAI42        : Buffer.from([0x1b, 0x74, 20]), // Thai Character Code 42
      THAI11        : Buffer.from([0x1b, 0x74, 21]), // Thai Character Code 11
      THAI13        : Buffer.from([0x1b, 0x74, 22]), // Thai Character Code 13
      THAI14        : Buffer.from([0x1b, 0x74, 23]), // Thai Character Code 14
      THAI16        : Buffer.from([0x1b, 0x74, 24]), // Thai Character Code 16
      THAI17        : Buffer.from([0x1b, 0x74, 25]), // Thai Character Code 17
      THAI18        : Buffer.from([0x1b, 0x74, 26]), // Thai Character Code 18
      TCVN3V1       : Buffer.from([0x1b, 0x74, 30]), // TCVN-3: Vietnamese
      TCVN3V2       : Buffer.from([0x1b, 0x74, 31]), // TCVN-3: Vietnamese
      CP720         : Buffer.from([0x1b, 0x74, 32]), // CP720: Arabic
      CP775         : Buffer.from([0x1b, 0x74, 33]), // WCP775: Baltic Rim
      CP855         : Buffer.from([0x1b, 0x74, 34]), // CP855: Cyrillic
      CP861         : Buffer.from([0x1b, 0x74, 35]), // CP861: Icelandic
      CP862         : Buffer.from([0x1b, 0x74, 36]), // CP862: Hebrew
      CP864         : Buffer.from([0x1b, 0x74, 37]), // CP864: Arabic
      CP869         : Buffer.from([0x1b, 0x74, 38]), // CP869: Greek
      ISO_8859_2    : Buffer.from([0x1b, 0x74, 39]), // ISO8859-2: Latin 2
      ISO_8859_15   : Buffer.from([0x1b, 0x74, 40]), // ISO8859-15: Latin 9
      CP1098        : Buffer.from([0x1b, 0x74, 41]), // CP1098: Farsi
      CP1118        : Buffer.from([0x1b, 0x74, 42]), // CP1118: Lithuanian
      CP1119        : Buffer.from([0x1b, 0x74, 43]), // CP1119: Lithuanian
      CP1125        : Buffer.from([0x1b, 0x74, 44]), // CP1125: Ukrainian
      CP1250        : Buffer.from([0x1b, 0x74, 45]), // WCP1250: Latin 2
      CP1251        : Buffer.from([0x1b, 0x74, 46]), // WCP1251: Cyrillic
      CP1253        : Buffer.from([0x1b, 0x74, 47]), // WCP1253: Greek
      CP1254        : Buffer.from([0x1b, 0x74, 48]), // WCP1254: Turkish
      CP1255        : Buffer.from([0x1b, 0x74, 49]), // WCP1255: Hebrew
      CP1256        : Buffer.from([0x1b, 0x74, 50]), // WCP1256: Arabic
      CP1257        : Buffer.from([0x1b, 0x74, 51]), // WCP1257: Baltic Rim
      CP1258        : Buffer.from([0x1b, 0x74, 52]), // WCP1258: Vietnamese
      RK1048	      : Buffer.from([0x1b, 0x74, 53]), // KZ-1048: Kazakhstan
      DEVANAGARI    : Buffer.from([0x1b, 0x74, 66]), // Devanagari
      BENGALI       : Buffer.from([0x1b, 0x74, 67]), // Bengali
      TAMIL         : Buffer.from([0x1b, 0x74, 68]), // Tamil
      TELUGU        : Buffer.from([0x1b, 0x74, 69]), // Telugu
      ASSAMESE      : Buffer.from([0x1b, 0x74, 70]), // Assamese
      ORIYA         : Buffer.from([0x1b, 0x74, 71]), // Oriya
      KANNADA       : Buffer.from([0x1b, 0x74, 72]), // Kannada
      MALAYALAM     : Buffer.from([0x1b, 0x74, 73]), // Malayalam
      GUJARATI      : Buffer.from([0x1b, 0x74, 74]), // Gujarati
      PUNJABI       : Buffer.from([0x1b, 0x74, 75]), // Punjabi
      MARATHI       : Buffer.from([0x1b, 0x74, 82]), // Marathi
    },

    // Barcode format
    BARCODE_TXT_OFF : Buffer.from([0x1d, 0x48, 0x00]), // HRI barcode chars OFF
    BARCODE_TXT_ABV : Buffer.from([0x1d, 0x48, 0x01]), // HRI barcode chars above
    BARCODE_TXT_BLW : Buffer.from([0x1d, 0x48, 0x02]), // HRI barcode chars below
    BARCODE_TXT_BTH : Buffer.from([0x1d, 0x48, 0x03]), // HRI barcode chars both above and below
    BARCODE_FONT_A  : Buffer.from([0x1d, 0x66, 0x00]), // Font type A for HRI barcode chars
    BARCODE_FONT_B  : Buffer.from([0x1d, 0x66, 0x01]), // Font type B for HRI barcode chars
    BARCODE_HEIGHT  : Buffer.from([0x1d, 0x68, 0x64]), // Barcode Height [1-255]
    BARCODE_WIDTH   : Buffer.from([0x1d, 0x77, 0x03]), // Barcode Width  [2-6]
    BARCODE_UPC_A   : Buffer.from([0x1d, 0x6b, 0x00]), // Barcode type UPC-A
    BARCODE_UPC_E   : Buffer.from([0x1d, 0x6b, 0x01]), // Barcode type UPC-E
    BARCODE_EAN13   : Buffer.from([0x1d, 0x6b, 0x02]), // Barcode type EAN13
    BARCODE_EAN8    : Buffer.from([0x1d, 0x6b, 0x03]), // Barcode type EAN8
    BARCODE_CODE39  : Buffer.from([0x1d, 0x6b, 0x04]), // Barcode type CODE39
    BARCODE_ITF     : Buffer.from([0x1d, 0x6b, 0x05]), // Barcode type ITF
    BARCODE_NW7     : Buffer.from([0x1d, 0x6b, 0x06]), // Barcode type NW7


    // QR Code
    QRCODE_MODEL1 : Buffer.from([0x1d, 0x28, 0x6b, 0x04, 0x00, 0x31, 0x41, 0x31, 0x00]), // Model 1
    QRCODE_MODEL2 : Buffer.from([0x1d, 0x28, 0x6b, 0x04, 0x00, 0x31, 0x41, 0x32, 0x00]), // Model 2
    QRCODE_MODEL3 : Buffer.from([0x1d, 0x28, 0x6b, 0x04, 0x00, 0x31, 0x41, 0x33, 0x00]), // Model 3

    QRCODE_CORRECTION_L : Buffer.from([0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x45, 0x30]), // Correction level: L - 7%
    QRCODE_CORRECTION_M : Buffer.from([0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x45, 0x31]), // Correction level: M - 15%
    QRCODE_CORRECTION_Q : Buffer.from([0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x45, 0x32]), // Correction level: Q - 25%
    QRCODE_CORRECTION_H : Buffer.from([0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x45, 0x33]), // Correction level: H - 30%

    QRCODE_CELLSIZE_1 : Buffer.from([0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x43, 0x01]),   // Cell size 1
    QRCODE_CELLSIZE_2 : Buffer.from([0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x43, 0x02]),   // Cell size 2
    QRCODE_CELLSIZE_3 : Buffer.from([0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x43, 0x03]),   // Cell size 3
    QRCODE_CELLSIZE_4 : Buffer.from([0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x43, 0x04]),   // Cell size 4
    QRCODE_CELLSIZE_5 : Buffer.from([0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x43, 0x05]),   // Cell size 5
    QRCODE_CELLSIZE_6 : Buffer.from([0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x43, 0x06]),   // Cell size 6
    QRCODE_CELLSIZE_7 : Buffer.from([0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x43, 0x07]),   // Cell size 7
    QRCODE_CELLSIZE_8 : Buffer.from([0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x43, 0x08]),   // Cell size 8

    QRCODE_PRINT : Buffer.from([0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x51, 0x30]),        // Print QR code

    // PDF417
    PDF417_CORRECTION       : Buffer.from([0x1D, 0x28, 0x6B, 0x04, 0x00, 0x30, 0x45, 0x31]),  // Append 1-40 for ratio
    PDF417_ROW_HEIGHT       : Buffer.from([0x1D, 0x28, 0x6B, 0x03, 0x00, 0x30, 0x44]),        // Append 2-8 for height
    PDF417_WIDTH            : Buffer.from([0x1D, 0x28, 0x6B, 0x03, 0x00, 0x30, 0x43]),        // Append 2-8 for width
    PDF417_COLUMNS          : Buffer.from([0x1D, 0x28, 0x6B, 0x03, 0x00, 0x30, 0x41]),
    PDF417_OPTION_STANDARD  : Buffer.from([0x1D, 0x28, 0x6B, 0x03, 0x00, 0x30, 0x46, 0x00]),  // Standard barcode
    PDF417_OPTION_TRUNCATED : Buffer.from([0x1D, 0x28, 0x6B, 0x03, 0x00, 0x30, 0x46, 0x01]),  // Truncated barcode
    PDF417_PRINT            : Buffer.from([0x1D, 0x28, 0x6B, 0x03, 0x00, 0x30, 0x51, 0x30]),

    // MaxiCode
    MAXI_MODE2 : Buffer.from([0x1d, 0x28, 0x6b, 0x03, 0x00, 0x32, 0x41, 0x32]), // Formatted data containing a structured Carrier Message with a numeric postal code. (US)
    MAXI_MODE3 : Buffer.from([0x1d, 0x28, 0x6b, 0x03, 0x00, 0x32, 0x41, 0x33]), // Formatted data containing a structured Carrier Message with an alphanumeric postal code. (International)
    MAXI_MODE4 : Buffer.from([0x1d, 0x28, 0x6b, 0x03, 0x00, 0x32, 0x41, 0x34]), // Unformatted data with Standard Error Correction.
    MAXI_MODE5 : Buffer.from([0x1d, 0x28, 0x6b, 0x03, 0x00, 0x32, 0x41, 0x35]), // Unformatted data with Enhanced Error Correction.
    MAXI_MODE6 : Buffer.from([0x1d, 0x28, 0x6b, 0x03, 0x00, 0x32, 0x41, 0x36]), // For programming hardware devices.

    MAXI_PRINT : Buffer.from([0x1d, 0x28, 0x6B, 0x03, 0x00, 0x32, 0x51, 0x30]),

    // Image format
    S_RASTER_N      : Buffer.from([0x1d, 0x76, 0x30, 0x00]), // Set raster image normal size
    S_RASTER_2W     : Buffer.from([0x1d, 0x76, 0x30, 0x01]), // Set raster image double width
    S_RASTER_2H     : Buffer.from([0x1d, 0x76, 0x30, 0x02]), // Set raster image double height
    S_RASTER_Q      : Buffer.from([0x1d, 0x76, 0x30, 0x03]), // Set raster image quadruple

    // Printing Density
    PD_N50          : Buffer.from([0x1d, 0x7c, 0x00]), // Printing Density -50%
    PD_N37          : Buffer.from([0x1d, 0x7c, 0x01]), // Printing Density -37.5%
    PD_N25          : Buffer.from([0x1d, 0x7c, 0x02]), // Printing Density -25%
    PD_N12          : Buffer.from([0x1d, 0x7c, 0x03]), // Printing Density -12.5%
    PD_0            : Buffer.from([0x1d, 0x7c, 0x04]), // Printing Density  0%
    PD_P50          : Buffer.from([0x1d, 0x7c, 0x08]), // Printing Density +50%
    PD_P37          : Buffer.from([0x1d, 0x7c, 0x07]), // Printing Density +37.5%
    PD_P25          : Buffer.from([0x1d, 0x7c, 0x06]), // Printing Density +25%

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
      "á": 160,
      "é": 130,
      "í": 161,
      "ó": 162,
      "ú": 163,
      "ñ": 164
    }
}
