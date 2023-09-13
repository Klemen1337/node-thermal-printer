module.exports = {
  // Feed control sequences
  CTL_LF: Buffer.from([0x0a]),                  // Print and line feed
  CTL_FF: Buffer.from([0x0c]),                  // Form feed
  CTL_CR: Buffer.from([0x0d]),                  // Carriage return
  CTL_HT: Buffer.from([0x09]),                  // Horizontal tab
  CTL_SET_HT: Buffer.from([0x1b, 0x44]),        // Set horizontal tab positions
  CTL_VT: Buffer.from([0x0b]),                  // Perform vertical tab    

  // Printer hardware
  HW_INIT: Buffer.from([0x1b, 0x69, 0x61, 0x00, 0x1b, 0x40]), // Clear data in buffer and reset modes
  HW_INITSOFT: Buffer.from([0x1b, 0x40]),

  // Paper
  PAPER_FULL_CUT: Buffer.from([0x1b, 0x69, 0x43, 0x01]), // Full cut paper
  PAPER_PART_CUT: Buffer.from([0x1b, 0x69, 0x43, 0x02]), // Cancels cutting

  // Text format
  // TXT_NORMAL      : Buffer.from([0x1b, 0x21, 0x00]), // Normal text
  // TXT_2HEIGHT     : Buffer.from([0x1b, 0x21, 0x10]), // Double height text
  TXT_2WIDTH: Buffer.from([0x1b, 0x57, 0x01]), // Double width text
  TXT_2WIDTH_OFF: Buffer.from([0x1b, 0x57, 0x00]), // Cancel Double width text
  // TXT_4SQUARE     : Buffer.from([0x1b, 0x21, 0x30]), // Quad area text
  TXT_UNDERL_OFF: Buffer.from([0x1b, 0x2d, 0x00]), // Underline font OFF
  TXT_UNDERL_ON: Buffer.from([0x1b, 0x2d, 0x01]), // Underline font 1-dot ON
  TXT_UNDERL2_ON: Buffer.from([0x1b, 0x2d, 0x02]), // Underline font 2-dot ON
  TXT_BOLD_OFF: Buffer.from([0x1b, 0x46]), // Bold font OFF
  TXT_BOLD_ON: Buffer.from([0x1b, 0x45]), // Bold font ON
  // TXT_INVERT_OFF  : Buffer.from([0x1d, 0x42, 0x00]), // Invert font OFF (eg. white background)
  // TXT_INVERT_ON   : Buffer.from([0x1d, 0x42, 0x01]), // Invert font ON (eg. black background)
  TXT_FONT_A: Buffer.from([0x1b, 0x6b, 0x0b]), // Font type A
  // TXT_FONT_B      : Buffer.from([0x1b, 0x4d, 0x01]), // Font type B
  TXT_ALIGN_LT: Buffer.from([0x1b, 0x61, 0x00]), // Left justification
  TXT_ALIGN_CT: Buffer.from([0x1b, 0x61, 0x01]), // Centering
  TXT_ALIGN_RT: Buffer.from([0x1b, 0x61, 0x02]), // Right justification

  // All code pages supported by printer.
  CODE_PAGE_STANDARD: Buffer.from([0x1b, 0x74, 0]),
  CODE_PAGE_EASTERN_EUROPEAN: Buffer.from([0x1b, 0x74, 1]),
  CODE_PAGE_WESTERN_EUROPEAN: Buffer.from([0x1b, 0x74, 2]),
  CODE_PAGE_RESERVED: Buffer.from([0x1b, 0x74, 3]),
  CODE_PAGE_JAPANESE: Buffer.from([0x1b, 0x74, 4]),

  // Character code pages / iconv name of code table.
  // Only code pages supported by iconv-lite:
  // https://github.com/ashtuchkin/iconv-lite/wiki/Supported-Encodings
  CODE_PAGES: {
    STANDARD: 'CP437',
    WESTERN_EUROPEAN: 'CP1252',
    EASTERN_EUROPEAN: 'WIN1250',
    JAPANESE: 'EUC-JP'
  },

  // Character / style selection commands
  ESCR: Buffer.from([0x1b, 0x52]), //Select international character set
  ESCq: Buffer.from([0x1b, 0x71]), //Select character style
  ESCk: Buffer.from([0x1b, 0x6b]), //Select font
  ESCt: Buffer.from([0x1b, 0x74]), //Select character code set

  // Text printing commands
  ESC4: Buffer.from([0x1b, 0x34]), //	Apply italic style
  ESC5: Buffer.from([0x1b, 0x35, 0x00]), //	Cancel italic style
  ESCE: Buffer.from([0x1b, 0x45, 0x00]), //Apply bold style
  ESCF: Buffer.from([0x1b, 0x46, 0x00]), //	Cancel bold style
  ESCG: Buffer.from([0x1b, 0x47, 0x00]), //	Apply double-strike printing
  ESCH: Buffer.from([0x1b, 0x48, 0x00]), //	Cancel double-strike printing
  ESCP: Buffer.from([0x1b, 0x50, 0x00]), //	Apply pica pitch (10 cpi)
  ESCM: Buffer.from([0x1b, 0x4d, 0x00]), //	Apply elite pitch (12 cpi)
  ESCq: Buffer.from([0x1b, 0x67, 0x00]), //	Apply micron pitch (15 cpi)
  ESCp: Buffer.from([0x1b, 0x70, 0x00]), //	Specify proportional characters
  ESCW: Buffer.from([0x1b, 0x57, 0x00]), //	Specify double-width characters
  SO: Buffer.from([0x0e]), //	"Specify  auto-canceling   stretched characters"
  ESCSO: Buffer.from([0x1b, 0x0e, 0x00]), //	"Specify  auto-canceling   stretched characters"
  SI: Buffer.from([0x0f]), //	Specify compressed characters
  ESCSI: Buffer.from([0x1b, 0x0f]), //	Specify compressed characters
  DC2: Buffer.from([0x12]), //	Cancel compressed characters
  DC4: Buffer.from([0x14]), //Cancel auto-canceling double-width characters
  ESC_UNDER: Buffer.from([0x1b, 0x2d]),	//Apply/cancel underlining
  ESC_GFOR: Buffer.from([0x1b, 0x21]),	//	Global formatting
  ESCSP: Buffer.from([0x1b, 0x20]), //	Specify character spacing
  ESCX: Buffer.from([0x1b, 0x58]), //Specify character size

  // Line feed commands
  ESC0: Buffer.from([0x1b, 0x30]), //Specify line feed of 1/8 inch
  ESC2: Buffer.from([0x1b, 0x32]), //Specify line feed of 1/6 inch
  ESC3: Buffer.from([0x1b, 0x33]), //	Specify minimum line feed
  ESCA: Buffer.from([0x1b, 0x41]), //Specify line feed of n/60 inch

  // Horizontal movement commands
  ESCl: Buffer.from([0x1b, 0x6c]), //Specify left margin
  ESCQ: Buffer.from([0x1b, 0x51]), //Specify right margin
  CR: Buffer.from([0x0d]), //	Carriage return
  ESCD: Buffer.from([0x1b, 0x44]), //	Specify horizontal tab position
  HT: Buffer.from([0x09]), //	Perform horizontal tab
  ESC$: Buffer.from([0x1b, 0x24]), //	"Specify absolutehorizontal position"
  ESC_RHP: Buffer.from([0x1b, 0x5c]),	//	Specify relative horizontal position
  ESCa: Buffer.from([0x1b, 0x61]), //Specify alignment

  // Vertical movement commands
  LF: Buffer.from([0x0a]), //	Line feed
  FF: Buffer.from([0x0c]), //	Page feed
  ESCJ: Buffer.from([0x1b, 0x4a]), //Forward paper feed
  ESCB: Buffer.from([0x1b, 0x42]), //	Specify vertical tab position
  VT: Buffer.from([0x0b]), //	Perform vertical tab
  ESC_ABSV: Buffer.from([0x1b, 0x28, 0x56]),	//	Specify absolute vertical position
  ESC_RELV: Buffer.from([0x1b, 0x28, 0x76]),	//Specify relative vertical position

  // Paper formatting commands
  ESC_PF: Buffer.from([0x1b, 0x28, 0x63]),	//Specify page format
  ESC_PL: Buffer.from([0x1b, 0x28, 0x43]),	//Specify page length

  // Printer control commands
  ESC_INIT: Buffer.from([0x1b, 0x40]),	//Initialize (defaults)

  // Graphics commands
  ESC_BIT_IMG: Buffer.from([0x1b, 0x2a]),	//Select bit image.
  ESCK: Buffer.from([0x1b, 0x4b]), //8-dot single-density bit image
  ESCL: Buffer.from([0x1b, 0x4c]), //8-dot double-density bit image
  ESCY: Buffer.from([0x1b, 0x59]), //"8-dot double-speeddouble-density bit image"
  ESCZ: Buffer.from([0x1b, 0x5a]), //8-dot quadruple-density bit image

  // Advanced commands
  ESCiB: Buffer.from([0x1b, 0x69, 0x42]), //Barcode
  ESCiQ: Buffer.from([0x1b, 0x69, 0x51]), //2D barcode (QR Code)
  ESCiP: Buffer.from([0x1b, 0x69, 0x50]), //Specify QR Code version
  ESCiV: Buffer.from([0x1b, 0x69, 0x56]), //	2D barcode (PDF417)
  ESCiD: Buffer.from([0x1b, 0x69, 0x44]), //2D barcode (DataMatrix)
  ESCiM: Buffer.from([0x1b, 0x69, 0x4d]), //2D barcode (MaxiCode)
  ESCiJ: Buffer.from([0x1b, 0x69, 0x6a]), //2D barcode (Aztec)
  ESCiG: Buffer.from([0x1b, 0x69, 0x47]), //Specify font setting
  ESCiFP: Buffer.from([0x1b, 0x69, 0x46, 0x50]), //Print downloaded data
  ESCia: Buffer.from([0x1b, 0x69, 0x61]), //Switch command mode
  ESCiS: Buffer.from([0x1b, 0x69, 0x53]), //Status information request
  ESCiL: Buffer.from([0x1b, 0x69, 0x4c]), //Specify landscape orientation
  ESCiC: Buffer.from([0x1b, 0x69, 0x43]), //Specify cutting
  ESCiH: Buffer.from([0x1b, 0x7c, 0x48]), //Specify recovery setting

  // Advanced static commands
  ESCiXQ2: Buffer.from([0x1b, 0x69, 0x58, 0x51, 0x32]), //Select default character style
  ESCiXQ1: Buffer.from([0x1b, 0x69, 0x58, 0x51, 0x31]), //Retrieve default character style
  ESCiXk2: Buffer.from([0x1b, 0x69, 0x58, 0x6b, 0x32]), //Select default font
  ESCiXk1: Buffer.from([0x1b, 0x69, 0x58, 0x6b, 0x31]), //Retrieve default font
  ESCiXX2: Buffer.from([0x1b, 0x69, 0x58, 0x58, 0x32]), //Specify default character size
  ESCiXX1: Buffer.from([0x1b, 0x69, 0x58, 0x58, 0x31]), //Retrieve default character size
  ESCiX32: Buffer.from([0x1b, 0x69, 0x58, 0x33, 0x32]), //Specify default line feed
  ESCiX31: Buffer.from([0x1b, 0x69, 0x58, 0x33, 0x31]), //Retrieve default line feed
  ESCiXA2: Buffer.from([0x1b, 0x69, 0x58, 0x41, 0x32]), //Select default alignment
  ESCiXA1: Buffer.from([0x1b, 0x69, 0x58, 0x41, 0x31]), //Retrieve default alignment
  ESCiXL2: Buffer.from([0x1b, 0x69, 0x58, 0x4c, 0x32]), //"Select default landscape orientation"
  ESCiXL1: Buffer.from([0x1b, 0x69, 0x58, 0x4c, 0x31]), //"Retrieve default landscapeorientation"
  ESCiXj2: Buffer.from([0x1b, 0x69, 0x58, 0x6a, 0x32]), //Select default international character set
  ESCiXj1: Buffer.from([0x1b, 0x69, 0x58, 0x6a, 0x31]), //"Retrieve default internationalcharacter set"
  ESCiXm2: Buffer.from([0x1b, 0x69, 0x58, 0x6d, 0x32]), //Select default character code set
  ESCiXm1: Buffer.from([0x1b, 0x69, 0x58, 0x6d, 0x31]), //"Retrieve   default   character   codeset"
  ESCiXd2: Buffer.from([0x1b, 0x69, 0x58, 0x64, 0x32]), //Specify recovery setting
  ESCiXd1: Buffer.from([0x1b, 0x69, 0x58, 0x64, 0x31]), //Retrieve recovery setting
  ESCiXE2: Buffer.from([0x1b, 0x69, 0x58, 0x45, 0x32]), //Specify barcode margin setting
  ESCiXE1: Buffer.from([0x1b, 0x69, 0x58, 0x45, 0x31]), //Retrieve barcode margin setting
};