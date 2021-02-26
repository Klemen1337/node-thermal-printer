module.exports = {
  // Feed control sequences
  CTL_LF     : Buffer.from([0x0a]),              // Print and line feed
  CTL_FF     : Buffer.from([0x0c]),              // Form feed
  CTL_CR     : Buffer.from([0x0d]),              // Carriage return
  CTL_HT     : Buffer.from([0x09]),              // Horizontal tab
  CTL_VT     : Buffer.from([0x0b]),              // Vertical tab
  CTL_SET_HT : Buffer.from([0x1b, 0x44]),        // Set horizontal tab positions
  CTL_SET_VT : Buffer.from([0x1b, 0x42]),        // Set vertical tab positions

  // Printer hardware
  HW_INIT         : Buffer.from([0x1b, 0x40]),              // Clear data in buffer and reset modes
  HW_SELECT       : Buffer.from([0x1b, 0x3d, 0x01]),        // Printer select
  HW_RESET        : Buffer.from([0x1b, 0x3f, 0x0a, 0x00]),  // Reset printer hardware
  UPSIDE_DOWN_ON  : Buffer.from([0x0F]),                    // Upside down printing ON (rotated 180 degrees).
  UPSIDE_DOWN_OFF : Buffer.from([0x12]),                    // Upside down printing OFF (default).

  // Cash Drawer
  CD_KICK_2  : Buffer.from([0x1b, 0x70, 0x00]),              // Sends a pulse to pin 2 []
  CD_KICK_5  : Buffer.from([0x1b, 0x70, 0x01]),              // Sends a pulse to pin 5 []
  CD_KICK    : Buffer.from([0x1b, 0x07, 0x0b, 0x37, 0x07]),  // Kick the cash drawer

  // Paper
  PAPER_FULL_CUT  : Buffer.from([0x1b, 0x64, 0x02]), // Full cut paper
  PAPER_PART_CUT  : Buffer.from([0x1b, 0x64, 0x03]), // Partial cut paper

  // Text format
  TXT_NORMAL      : Buffer.from([0x1b, 0x69, 0x00, 0x00]), // Normal text
  TXT_2HEIGHT     : Buffer.from([0x1b, 0x69, 0x01, 0x00]), // Double height text
  TXT_2WIDTH      : Buffer.from([0x1b, 0x69, 0x00, 0x01]), // Double width text
  TXT_4SQUARE     : Buffer.from([0x1b, 0x69, 0x01, 0x01]), // Quad area text
  TXT_UNDERL_OFF  : Buffer.from([0x1b, 0x2d, 0x00]), // Underline font OFF
  TXT_UNDERL_ON   : Buffer.from([0x1b, 0x2d, 0x01]), // Underline font 1-dot ON
  TXT_UNDERL2_ON  : Buffer.from([0x1b, 0x2d, 0x02]), // Underline font 2-dot ON
  TXT_BOLD_OFF    : Buffer.from([0x1b, 0x46]), // Bold font OFF
  TXT_BOLD_ON     : Buffer.from([0x1b, 0x45]), // Bold font ON
  TXT_INVERT_OFF  : Buffer.from([0x1b, 0x35]), // Invert font OFF (eg. white background)
  TXT_INVERT_ON   : Buffer.from([0x1b, 0x34]), // Invert font ON (eg. black background)
  TXT_FONT_A      : Buffer.from([0x1b, 0x1e, 0x46, 0x00]), // Font type A
  TXT_FONT_B      : Buffer.from([0x1b, 0x1e, 0x46, 0x01]), // Font type B
  TXT_ALIGN_LT    : Buffer.from([0x1b, 0x1d, 0x61, 0x00]), // Left justification
  TXT_ALIGN_CT    : Buffer.from([0x1b, 0x1d, 0x61, 0x01]), // Centering
  TXT_ALIGN_RT    : Buffer.from([0x1b, 0x1d, 0x61, 0x02]), // Right justification

  // All code pages supported by printer.
  CODE_PAGE_PC437_USA             : Buffer.from([0x1b, 0x74, 0]),
  CODE_PAGE_KATAKANA              : Buffer.from([0x1b, 0x74, 1]),
  CODE_PAGE_PC850_MULTILINGUAL    : Buffer.from([0x1b, 0x74, 2]),
  CODE_PAGE_PC860_PORTUGUESE      : Buffer.from([0x1b, 0x74, 3]),
  CODE_PAGE_PC863_CANADIAN_FRENCH : Buffer.from([0x1b, 0x74, 4]),
  CODE_PAGE_PC865_NORDIC          : Buffer.from([0x1b, 0x74, 5]),
  CODE_PAGE_PC851_GREEK           : Buffer.from([0x1b, 0x74, 11]),
  CODE_PAGE_PC853_TURKISH         : Buffer.from([0x1b, 0x74, 12]),
  CODE_PAGE_PC857_TURKISH         : Buffer.from([0x1b, 0x74, 13]),
  CODE_PAGE_PC737_GREEK           : Buffer.from([0x1b, 0x74, 14]),
  CODE_PAGE_ISO8859_7_GREEK       : Buffer.from([0x1b, 0x74, 15]),
  CODE_PAGE_WPC1252               : Buffer.from([0x1b, 0x74, 16]),
  CODE_PAGE_PC866_CYRILLIC2       : Buffer.from([0x1b, 0x74, 17]),
  CODE_PAGE_PC852_LATIN2          : Buffer.from([0x1b, 0x74, 18]),
  CODE_PAGE_SLOVENIA              : Buffer.from([0x1b, 0x74, 18]),
  CODE_PAGE_PC858_EURO            : Buffer.from([0x1b, 0x74, 19]),
  CODE_PAGE_KU42_THAI             : Buffer.from([0x1b, 0x74, 20]),
  CODE_PAGE_TIS11_THAI            : Buffer.from([0x1b, 0x74, 21]),
  CODE_PAGE_TIS18_THAI            : Buffer.from([0x1b, 0x74, 26]),
  CODE_PAGE_TCVN3_VIETNAMESE_L    : Buffer.from([0x1b, 0x74, 30]),
  CODE_PAGE_TCVN3_VIETNAMESE_U    : Buffer.from([0x1b, 0x74, 31]),
  CODE_PAGE_PC720_ARABIC          : Buffer.from([0x1b, 0x74, 32]),
  CODE_PAGE_WPC775_BALTIC_RIM     : Buffer.from([0x1b, 0x74, 33]),
  CODE_PAGE_PC855_CYRILLIC        : Buffer.from([0x1b, 0x74, 34]),
  CODE_PAGE_PC861_ICELANDIC       : Buffer.from([0x1b, 0x74, 35]),
  CODE_PAGE_PC862_HEBREW          : Buffer.from([0x1b, 0x74, 36]),
  CODE_PAGE_PC864_ARABIC          : Buffer.from([0x1b, 0x74, 37]),
  CODE_PAGE_PC869_GREEK           : Buffer.from([0x1b, 0x74, 38]),
  CODE_PAGE_ISO8859_2_LATIN2      : Buffer.from([0x1b, 0x74, 39]),
  CODE_PAGE_ISO8859_15_LATIN9     : Buffer.from([0x1b, 0x74, 40]),
  CODE_PAGE_PC1098_FARCI          : Buffer.from([0x1b, 0x74, 41]),
  CODE_PAGE_PC1118_LITHUANIAN     : Buffer.from([0x1b, 0x74, 42]),
  CODE_PAGE_PC1119_LITHUANIAN     : Buffer.from([0x1b, 0x74, 43]),
  CODE_PAGE_PC1125_UKRANIAN       : Buffer.from([0x1b, 0x74, 44]),
  CODE_PAGE_WPC1250_LATIN2        : Buffer.from([0x1b, 0x74, 45]),
  CODE_PAGE_WPC1251_CYRILLIC      : Buffer.from([0x1b, 0x74, 46]),
  CODE_PAGE_WPC1253_GREEK         : Buffer.from([0x1b, 0x74, 47]),
  CODE_PAGE_WPC1254_TURKISH       : Buffer.from([0x1b, 0x74, 48]),
  CODE_PAGE_WPC1255_HEBREW        : Buffer.from([0x1b, 0x74, 49]),
  CODE_PAGE_WPC1256_ARABIC        : Buffer.from([0x1b, 0x74, 50]),
  CODE_PAGE_WPC1257_BALTIC_RIM    : Buffer.from([0x1b, 0x74, 51]),
  CODE_PAGE_WPC1258_VIETNAMESE    : Buffer.from([0x1b, 0x74, 52]),
  CODE_PAGE_KZ1048_KAZAKHSTAN     : Buffer.from([0x1b, 0x74, 53]),
  CODE_PAGE_JAPAN                 : Buffer.from([0x1b, 0x52, 0x08]),
  CODE_PAGE_KOREA                 : Buffer.from([0x1b, 0x52, 0x0D]),
  CODE_PAGE_CHINA                 : Buffer.from([0x1b, 0x52, 0x0F]),

  // Character code pages / iconv name of code table.
  // Only code pages supported by iconv-lite:
  // https://github.com/ashtuchkin/iconv-lite/wiki/Supported-Encodings
  CODE_PAGES: {
    PC437_USA             : 'CP437',
    PC850_MULTILINGUAL    : 'CP850',
    PC860_PORTUGUESE      : 'CP860',
    PC863_CANADIAN_FRENCH : 'CP863',
    PC865_NORDIC          : 'CP865',
    PC851_GREEK           : 'CP860',
    PC857_TURKISH         : 'CP857',
    PC737_GREEK           : 'CP737',
    ISO8859_7_GREEK       : 'ISO-8859-7',
    WPC1252               : 'CP1252',
    PC866_CYRILLIC2       : 'CP866',
    PC852_LATIN2          : 'CP852',
    SLOVENIA              : 'CP852',
    PC858_EURO            : 'CP858',
    WPC775_BALTIC_RIM     : 'CP775',
    PC855_CYRILLIC        : 'CP855',
    PC861_ICELANDIC       : 'CP861',
    PC862_HEBREW          : 'CP862',
    PC864_ARABIC          : 'CP864',
    PC869_GREEK           : 'CP869',
    ISO8859_2_LATIN2      : 'ISO-8859-2',
    ISO8859_15_LATIN9     : 'ISO-8859-15',
    PC1125_UKRANIAN       : 'CP1125',
    WPC1250_LATIN2        : 'WIN1250',
    WPC1251_CYRILLIC      : 'WIN1251',
    WPC1253_GREEK         : 'WIN1253',
    WPC1254_TURKISH       : 'WIN1254',
    WPC1255_HEBREW        : 'WIN1255',
    WPC1256_ARABIC        : 'WIN1256',
    WPC1257_BALTIC_RIM    : 'WIN1257',
    WPC1258_VIETNAMESE    : 'WIN1258',
    KZ1048_KAZAKHSTAN     : 'RK1048',
    JAPAN                 : 'EUC-JP',
    KOREA                 : 'EUC-KR',
    CHINA                 : 'EUC-CN'
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

  BARCODE_CODE128              : Buffer.from([0x1b, 0x62, 0x36]),     // Barcode type CODE128
  BARCODE_CODE128_TEXT_1       : Buffer.from([0x01]),                 // No text
  BARCODE_CODE128_TEXT_2       : Buffer.from([0x02]),                 // Text on bottom
  BARCODE_CODE128_TEXT_3       : Buffer.from([0x03]),                 // No text inline
  BARCODE_CODE128_TEXT_4       : Buffer.from([0x04]),                 // Text on bottom inline
  BARCODE_CODE128_WIDTH_SMALL  : Buffer.from([0x31]),                 // Small
  BARCODE_CODE128_WIDTH_MEDIUM : Buffer.from([0x32]),                 // Medium
  BARCODE_CODE128_WIDTH_LARGE  : Buffer.from([0x33]),                 // Large


  // QR Code
  QRCODE_MODEL1 : Buffer.from([0x1b, 0x1d, 0x79, 0x53, 0x30, 0x01]), // Model 1
  QRCODE_MODEL2 : Buffer.from([0x1b, 0x1d, 0x79, 0x53, 0x30, 0x02]), // Model 2

  QRCODE_CORRECTION_L : Buffer.from([0x1b, 0x1d, 0x79, 0x53, 0x31, 0x00]), // Correction level: L - 7%
  QRCODE_CORRECTION_M : Buffer.from([0x1b, 0x1d, 0x79, 0x53, 0x31, 0x01]), // Correction level: M - 15%
  QRCODE_CORRECTION_Q : Buffer.from([0x1b, 0x1d, 0x79, 0x53, 0x31, 0x02]), // Correction level: Q - 25%
  QRCODE_CORRECTION_H : Buffer.from([0x1b, 0x1d, 0x79, 0x53, 0x31, 0x03]), // Correction level: H - 30%

  QRCODE_CELLSIZE_1 : Buffer.from([0x1b, 0x1d, 0x79, 0x53, 0x32, 0x01]),   // Cell size 1
  QRCODE_CELLSIZE_2 : Buffer.from([0x1b, 0x1d, 0x79, 0x53, 0x32, 0x02]),   // Cell size 2
  QRCODE_CELLSIZE_3 : Buffer.from([0x1b, 0x1d, 0x79, 0x53, 0x32, 0x03]),   // Cell size 3
  QRCODE_CELLSIZE_4 : Buffer.from([0x1b, 0x1d, 0x79, 0x53, 0x32, 0x04]),   // Cell size 4
  QRCODE_CELLSIZE_5 : Buffer.from([0x1b, 0x1d, 0x79, 0x53, 0x32, 0x05]),   // Cell size 5
  QRCODE_CELLSIZE_6 : Buffer.from([0x1b, 0x1d, 0x79, 0x53, 0x32, 0x06]),   // Cell size 6
  QRCODE_CELLSIZE_7 : Buffer.from([0x1b, 0x1d, 0x79, 0x53, 0x32, 0x07]),   // Cell size 7
  QRCODE_CELLSIZE_8 : Buffer.from([0x1b, 0x1d, 0x79, 0x53, 0x32, 0x08]),   // Cell size 8
  QRCODE_CELLSIZE   : Buffer.from([0x1b, 0x1d, 0x79, 0x44, 0x31, 0x00]),   // Cell size nL nH dk


  QRCODE_PRINT : Buffer.from([0x1b, 0x1d, 0x79, 0x50]),                // Print QR code


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
  PD_P25          : Buffer.from([0x1d, 0x7c, 0x06])  // Printing Density +25%
}
