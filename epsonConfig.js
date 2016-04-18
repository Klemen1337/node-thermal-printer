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
    TXT_FONT_A      : new Buffer([0x1b, 0x4d, 0x00]), // Font type A
    TXT_FONT_B      : new Buffer([0x1b, 0x4d, 0x01]), // Font type B
    TXT_ALIGN_LT    : new Buffer([0x1b, 0x61, 0x00]), // Left justification
    TXT_ALIGN_CT    : new Buffer([0x1b, 0x61, 0x01]), // Centering
    TXT_ALIGN_RT    : new Buffer([0x1b, 0x61, 0x02]), // Right justification

    // Char code table
    CHARCODE_PC437  : new Buffer([0x1b, 0x74, 0x00]), // USA: Standard Europe
    CHARCODE_JIS    : new Buffer([0x1b, 0x74, 0x01]), // Japanese Katakana
    CHARCODE_PC850  : new Buffer([0x1b, 0x74, 0x02]), // Multilingual
    CHARCODE_PC860  : new Buffer([0x1b, 0x74, 0x03]), // Portuguese
    CHARCODE_PC863  : new Buffer([0x1b, 0x74, 0x04]), // Canadian-French
    CHARCODE_PC865  : new Buffer([0x1b, 0x74, 0x05]), // Nordic
    CHARCODE_WEU    : new Buffer([0x1b, 0x74, 0x06]), // Simplified Kanji, Hirakana
    CHARCODE_GREEK  : new Buffer([0x1b, 0x74, 0x07]), // Simplified Kanji
    CHARCODE_HEBREW : new Buffer([0x1b, 0x74, 0x08]), // Simplified Kanji
    CHARCODE_PC1252 : new Buffer([0x1b, 0x74, 0x11]), // Western European Windows Code Set
    CHARCODE_PC866  : new Buffer([0x1b, 0x74, 0x12]), // Cirillic //2
    CHARCODE_PC852  : new Buffer([0x1b, 0x74, 0x13]), // Latin 2
    CHARCODE_PC858  : new Buffer([0x1b, 0x74, 0x14]), // Euro
    CHARCODE_THAI42 : new Buffer([0x1b, 0x74, 0x15]), // Thai character code 42
    CHARCODE_THAI11 : new Buffer([0x1b, 0x74, 0x16]), // Thai character code 11
    CHARCODE_THAI13 : new Buffer([0x1b, 0x74, 0x17]), // Thai character code 13
    CHARCODE_THAI14 : new Buffer([0x1b, 0x74, 0x18]), // Thai character code 14
    CHARCODE_THAI16 : new Buffer([0x1b, 0x74, 0x19]), // Thai character code 16
    CHARCODE_THAI17 : new Buffer([0x1b, 0x74, 0x1a]), // Thai character code 17
    CHARCODE_THAI18 : new Buffer([0x1b, 0x74, 0x1b]), // Thai character code 18

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
    PD_P25          : new Buffer([0x1d, 0x7c, 0x06])  // Printing Density +25%
}
