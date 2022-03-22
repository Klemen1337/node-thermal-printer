function getInterface(uri, options, driver) {
  const networkRegex = /^tcp:\/\/([^/:]+)(?::(\d+))?\/?$/i;
  const printerRegex = /^printer:([^/]+)(?:\/([\w-]*))?$/i;

  const net = networkRegex.exec(uri);
  const printer = printerRegex.exec(uri);

  if (typeof uri === 'object') {
    return uri;
  } if (net) {
    const Network = require('./network');
    return new Network(net[1], net[2], options);
  } if (printer) {
    const Printer = require('./printer');
    return new Printer(printer[1], driver);
  }
  const File = require('./file');
  return new File(uri);
}

module.exports = getInterface;
