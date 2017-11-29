var fs = require("fs");

var writeFile = require("write-file-queue")({
  retries : 1000, 						    // number of write attempts before failing
  waitTime : 200 					        // number of milliseconds to wait between write attempts
  //, debug : console.error 			// optionally pass a function to do dump debug information to
});


function File(path) {
  this.path = path;
}


File.prototype.execute = function(buffer, cb) {
  writeFile(this.path, buffer, function (err) {
    if (err) {
      if ("function" === typeof cb) {
        cb("Print failed: " + err);
      } else {
        console.error("Print failed", err);
      }
    } else {
      if ("function" === typeof cb) {
        cb( null );
      } else {
        console.log("Print done");
      }
    }
  });
};


File.prototype.isPrinterConnected = function(exists){
  if (this.path){
    fs.exists(this.path, function(ex){
      exists(ex);
    });
  }
};

module.exports = File;
