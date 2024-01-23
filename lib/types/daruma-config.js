module.exports = {
  // Feed control sequences
  CTL_LF: Buffer.from([0x0a]), // Print and line feed
  CTL_FF: Buffer.from([0x0c]), // Form feed
  CTL_CR: Buffer.from([0x0d]), // Carriage return
  CTL_HT: Buffer.from([0x09]), // Horizontal tab
  CTL_SET_HT: Buffer.from([0x1b, 0x44]), // Set horizontal tab positions
  CTL_VT: Buffer.from([0x0b]), // Vertical tab

  // Printer hardware
  HW_INIT: Buffer.from([0x1b, 0x40]), // Clear data in buffer and reset modes
  HW_SELECT: Buffer.from([0x1b, 0x3d, 0x01]), // Printer select
  HW_RESET: Buffer.from([0x1b, 0x3f, 0x0a, 0x00]), // Reset printer hardware
  BEEP: Buffer.from([0x07]), // Sounds built-in buzzer (if equipped)

  // Cash Drawer
  CD_KICK_2: Buffer.from([0x1b, 0x70, 0x00]), // Sends a pulse to pin 2 []
  CD_KICK_5: Buffer.from([0x1b, 0x70, 0x01]), // Sends a pulse to pin 5 []

  // Paper
  PAPER_FULL_CUT: Buffer.from([0x1b, 0x6d]), // Full cut paper
  PAPER_PART_CUT: Buffer.from([0x1b, 0x6d]), // Partial cut paper

  // Text format
  TXT_NORMAL: Buffer.from([0x1b, 0x21, 0x00, 0x12]), // Normal text
  TXT_2HEIGHT: Buffer.from([0x1b, 0x77, 0x01]), // Double height text
  TXT_2WIDTH: Buffer.from([0x1b, 0x0e, 0x00]), // Double width text
  TXT_UNDERL_OFF: Buffer.from([0x1b, 0x2d, 0x00]), // Underline font OFF
  TXT_UNDERL_ON: Buffer.from([0x1b, 0x2d, 0x01]), // Underline font 1-dot ON
  TXT_BOLD_OFF: Buffer.from([0x1b, 0x46]), // Bold font OFF
  TXT_BOLD_ON: Buffer.from([0x1b, 0x45]), // Bold font ON
  TXT_FONT_A: Buffer.from([0x14]), // Font type A
  TXT_FONT_B: Buffer.from([0x1b, 0x0f]), // Font type B
  TXT_ALIGN_LT: Buffer.from([0x1b, 0x6a, 0x00]), // Left justification
  TXT_ALIGN_CT: Buffer.from([0x1b, 0x6a, 0x01]), // Centering
  TXT_ALIGN_RT: Buffer.from([0x1b, 0x6a, 0x02]), // Right justification

  // All code pages supported by printer.
  CODE_PAGE_PC437_USA: Buffer.from([0x1b, 0x74, 0]),
  CODE_PAGE_KATAKANA: Buffer.from([0x1b, 0x74, 1]),
  CODE_PAGE_PC850_MULTILINGUAL: Buffer.from([0x1b, 0x74, 2]),
  CODE_PAGE_PC860_PORTUGUESE: Buffer.from([0x1b, 0x74, 3]),
  CODE_PAGE_PC863_CANADIAN_FRENCH: Buffer.from([0x1b, 0x74, 4]),
  CODE_PAGE_PC865_NORDIC: Buffer.from([0x1b, 0x74, 5]),
  CODE_PAGE_PC851_GREEK: Buffer.from([0x1b, 0x74, 11]),
  CODE_PAGE_PC853_TURKISH: Buffer.from([0x1b, 0x74, 12]),
  CODE_PAGE_PC857_TURKISH: Buffer.from([0x1b, 0x74, 13]),
  CODE_PAGE_PC737_GREEK: Buffer.from([0x1b, 0x74, 14]),
  CODE_PAGE_ISO8859_7_GREEK: Buffer.from([0x1b, 0x74, 15]),
  CODE_PAGE_WPC1252: Buffer.from([0x1b, 0x74, 16]),
  CODE_PAGE_PC866_CYRILLIC2: Buffer.from([0x1b, 0x74, 17]),
  CODE_PAGE_PC852_LATIN2: Buffer.from([0x1b, 0x74, 18]),
  CODE_PAGE_SLOVENIA: Buffer.from([0x1b, 0x74, 18]),
  CODE_PAGE_PC858_EURO: Buffer.from([0x1b, 0x74, 19]),
  CODE_PAGE_KU42_THAI: Buffer.from([0x1b, 0x74, 20]),
  CODE_PAGE_TIS11_THAI: Buffer.from([0x1b, 0x74, 21]),
  CODE_PAGE_TIS18_THAI: Buffer.from([0x1b, 0x74, 26]),
  CODE_PAGE_TCVN3_VIETNAMESE_L: Buffer.from([0x1b, 0x74, 30]),
  CODE_PAGE_TCVN3_VIETNAMESE_U: Buffer.from([0x1b, 0x74, 31]),
  CODE_PAGE_PC720_ARABIC: Buffer.from([0x1b, 0x74, 32]),
  CODE_PAGE_WPC775_BALTIC_RIM: Buffer.from([0x1b, 0x74, 33]),
  CODE_PAGE_PC855_CYRILLIC: Buffer.from([0x1b, 0x74, 34]),
  CODE_PAGE_PC861_ICELANDIC: Buffer.from([0x1b, 0x74, 35]),
  CODE_PAGE_PC862_HEBREW: Buffer.from([0x1b, 0x74, 36]),
  CODE_PAGE_PC864_ARABIC: Buffer.from([0x1b, 0x74, 37]),
  CODE_PAGE_PC869_GREEK: Buffer.from([0x1b, 0x74, 38]),
  CODE_PAGE_ISO8859_2_LATIN2: Buffer.from([0x1b, 0x74, 39]),
  CODE_PAGE_ISO8859_15_LATIN9: Buffer.from([0x1b, 0x74, 40]),
  CODE_PAGE_PC1098_FARCI: Buffer.from([0x1b, 0x74, 41]),
  CODE_PAGE_PC1118_LITHUANIAN: Buffer.from([0x1b, 0x74, 42]),
  CODE_PAGE_PC1119_LITHUANIAN: Buffer.from([0x1b, 0x74, 43]),
  CODE_PAGE_PC1125_UKRANIAN: Buffer.from([0x1b, 0x74, 44]),
  CODE_PAGE_WPC1250_LATIN2: Buffer.from([0x1b, 0x74, 45]),
  CODE_PAGE_WPC1251_CYRILLIC: Buffer.from([0x1b, 0x74, 46]),
  CODE_PAGE_WPC1253_GREEK: Buffer.from([0x1b, 0x74, 47]),
  CODE_PAGE_WPC1254_TURKISH: Buffer.from([0x1b, 0x74, 48]),
  CODE_PAGE_WPC1255_HEBREW: Buffer.from([0x1b, 0x74, 49]),
  CODE_PAGE_WPC1256_ARABIC: Buffer.from([0x1b, 0x74, 50]),
  CODE_PAGE_WPC1257_BALTIC_RIM: Buffer.from([0x1b, 0x74, 51]),
  CODE_PAGE_WPC1258_VIETNAMESE: Buffer.from([0x1b, 0x74, 52]),
  CODE_PAGE_KZ1048_KAZAKHSTAN: Buffer.from([0x1b, 0x74, 53]),
  CODE_PAGE_JAPAN: Buffer.from([0x1b, 0x52, 0x08]),
  CODE_PAGE_KOREA: Buffer.from([0x1b, 0x52, 0x0D]),
  CODE_PAGE_CHINA: Buffer.from([0x1b, 0x52, 0x0F]),
  CODE_PAGE_HK_TW: Buffer.from([0x1b, 0x52, 0x00]),
  CODE_PAGE_TCVN_VIETNAMESE: Buffer.from([0x1b, 0x74, 52]),

  // Character code pages / iconv name of code table.
  // Only code pages supported by iconv-lite:
  // https://github.com/ashtuchkin/iconv-lite/wiki/Supported-Encodings
  CODE_PAGES: {
    PC437_USA: 'CP437',
    PC850_MULTILINGUAL: 'CP850',
    PC860_PORTUGUESE: 'CP860',
    PC863_CANADIAN_FRENCH: 'CP863',
    PC865_NORDIC: 'CP865',
    PC851_GREEK: 'CP860',
    PC857_TURKISH: 'CP857',
    PC737_GREEK: 'CP737',
    ISO8859_7_GREEK: 'ISO-8859-7',
    WPC1252: 'CP1252',
    PC866_CYRILLIC2: 'CP866',
    PC852_LATIN2: 'CP852',
    SLOVENIA: 'CP852',
    PC858_EURO: 'CP858',
    WPC775_BALTIC_RIM: 'CP775',
    PC855_CYRILLIC: 'CP855',
    PC861_ICELANDIC: 'CP861',
    PC862_HEBREW: 'CP862',
    PC864_ARABIC: 'CP864',
    PC869_GREEK: 'CP869',
    ISO8859_2_LATIN2: 'ISO-8859-2',
    ISO8859_15_LATIN9: 'ISO-8859-15',
    PC1125_UKRANIAN: 'CP1125',
    WPC1250_LATIN2: 'WIN1250',
    WPC1251_CYRILLIC: 'WIN1251',
    WPC1253_GREEK: 'WIN1253',
    WPC1254_TURKISH: 'WIN1254',
    WPC1255_HEBREW: 'WIN1255',
    WPC1256_ARABIC: 'WIN1256',
    WPC1257_BALTIC_RIM: 'WIN1257',
    WPC1258_VIETNAMESE: 'WIN1258',
    KZ1048_KAZAKHSTAN: 'RK1048',
    JAPAN: 'EUC-JP',
    KOREA: 'EUC-KR',
    CHINA: 'EUC-CN',
    HK_TW: 'Big5-HKSCS',
    TCVN_VIETNAMESE: 'tcvn',
  }
};
