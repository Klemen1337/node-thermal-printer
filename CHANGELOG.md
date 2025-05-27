# Changelog

## v4.5.0 (27.5.2025)

- added support for CUSTOM printer (#270) ([yoyo53](https://github.com/yoyo53)),
- added check if interface and printer types are set on init,
- added hide network logs behind debug flag,
- updated iconv-lite to v0.6.3,
- updated pngjs to v7.0.0,
- updated unorm to v1.6.0

## v4.4.5 (25.3.2025)

- added Brother printer type to .d.ts

## v4.4.4 (20.2.2025)

- fixed fold function when string contains \n,
- updated eslint

## v4.4.3 (26.8.2024)

- fixed ReferenceError: waitForResponse is not defined (#259) ([ssxv](https://github.com/ssxv))
- added setBuffer method to ThermalPrinter class (#253) ([borisloor06](https://github.com/borisloor06))

## v4.4.2 (23.1.2024)

- fixed network hang ([treeindark](https://github.com/treeindark))
- added Daruma cash drawer kick codes ([Rafatcb](https://github.com/Rafatcb))
- added accept an optional character on drawLine ([Rafatcb](https://github.com/Rafatcb))

## v4.4.1 (18.10.2023)

- fixed star code page commands,
- changed to no default character set,
- changed no interface is available
- fixed fold sometimes fails because it is not string

## v4.4.0 (13.9.2023)

- added Brother support from ([younessssssss](https://github.com/younessssssss))
- added code128 for epson support from ([treeindark](https://github.com/treeindark))
- worked on epson default settings,
- fixed epson beep command

## v4.3.0 (13.9.2023)

- added experimental getStatus for epson printer,
- added wait for response flag to network interface,
- added example for get status with a network printer,
- added optional cut feeding ([jdgjsag67251](https://github.com/jdgjsag67251)),
- added encoding for TIS11 and TIS66 code pages (Thai language) ([kumkao](https://github.com/kumkao)),
- added options param to execute command ([avivsalman](https://github.com/avivsalman)),
- added support for Daruma thermal printer ([riquemoraes](https://github.com/riquemoraes)),
- fixed make library work with browser ([yelhouti](https://github.com/yelhouti))

## v4.2.1 (27.6.2023)

- fixed keep initial CharacterSet after clear ([perbyhring](https://github.com/perbyhring)),
- fixed printing code 128 barcodes ([zigzagzak](https://github.com/zigzagzak)),
- removed super calling when there is constructor to avoid unnecessary console error ([avivsalman](https://github.com/avivsalman)),
- removed console.log when printing ([OverSamu](https://github.com/OverSamu))

## v4.2.0 (1.2.2023)

- changed `print` and `println` functions to respect `width` configuration,
- added breakLine to break long sentances into multiple lines,
- added new printer implementation TANCA ([cecon](https://github.com/cecon)),
- added file.js timeout ([aas-mohammed](https://github.com/aas-mohammed)),
- added TCVN_VIETNAMESE encoding ([iamncdai](https://github.com/iamncdai)),
- added KOREA encoding ([LimHaksu](https://github.com/LimHaksu)),
- added characterSet enum,
- added eslint config,
- added vscode settings,
- update printer.js to return correct `isPrinterConnected` status ([hoangphan84](https://github.com/hoangphan84)),
- updated core.js to save PrinterType in config ([selenecodes](https://github.com/selenecodes)),
- styled the code

## v4.1.2 (21.1.2020)

- fixed initial driver setup ([antoniomgatto](https://github.com/antoniomgatto))

## v4.1.1 (7.1.2020)

- added no driver set error,
- added example to readme,
- added parse width config to number,
- added traditional chinese support (HK_TW),
- added changelog,
- updated `iconv-lite` from v0.4.24 to v0.5.0 closes #109,
- updated readme,
- updated typescript type information file,
- renamed printerTypes to PrinterTypes
