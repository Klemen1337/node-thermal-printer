var net = require("net");

function NetPrint(host, port) {
  this.timeout = 3000;
  this.host = host;
  this.port = port || 9100;
}


NetPrint.prototype.execute = function(buffer, cb) {
  var printer = net.connect({
    host : this.host,
    port : this.port,
    timeout: this.timeout
  }, function() {
    printer.write(buffer, null, function () {
      if (typeof cb !== "undefined") {
        cb(null);
      }
      printer.end();
    });
  });

  printer.on('error', function (err) {
    if (typeof cb !== "undefined") {
      cb(err);
    }
    printer.end();
  });

  printer.on('timeout', function () {
    if (typeof cb !== "undefined") {
      cb("Error: Socket Timeout");
    }
    printer.end();
  });
};


NetPrint.prototype.isPrinterConnected = function(exists){
  var printer = net.connect({
    host : this.host,
    port : this.port,
    timeout: this.timeout
  }, function() {
    exists(true);
    printer.end();
  });

  printer.on('error', function (err) {
    exists(false);
    printer.end();
  });
  
  printer.on('timeout', function () {
    exists(false);
    printer.end();
  });
};

module.exports = NetPrint;
