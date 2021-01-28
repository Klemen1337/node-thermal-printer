import { parseQueryOptions } from "./helper";

export default function getInterface (uri: string, options = {}, driver: any) {
  const networkRegex = /^tcp:\/\/([^\/:]+)(?::(\d+))?\/?$/i;
  const printerRegex = /^printer:([^\/]+)(?:\/([\w-]*))?$/i;
  const serialRegex  = /^serial:([^?]+)(?:\?(.*))?$/i;

  const net = networkRegex.exec(uri);
  const printer = printerRegex.exec(uri);
  const serial = serialRegex.exec(uri);

  if (typeof uri === "object") {
    return uri;
  } else if (net) {
    const Network = require('./network').default;
    return new Network(net[1], net[2], options);
  } else if (printer) {
    const Printer = require('./printer');
    return new Printer(printer[1], driver);
  } else if (serial) {
    const Serial = require('./serialport').default;
    return new Serial(serial[1], { ...(options || {}), ...(serial[2] && parseQueryOptions(serial[2]) || {})});
  } else {
    const File = require('./file');
    return new File(uri);
  }
}
