var fs = require("fs");

var writeFile = require("write-file-queue")({
  retries: 1000, 	// number of write attempts before failing
  waitTime: 200   // number of milliseconds to wait between write attempts
});


function File (path) {
  this.path = path;
}


File.prototype.execute = async function (buffer) {
  return new Promise((resolve, reject) => {
    writeFile(this.path, buffer, function (error) {
      if (error) {
        reject(error);
      } else {
        resolve("Print done");
      }
    });
  });
};


File.prototype.isPrinterConnected = function () {
  return new Promise((resolve, reject) => {
    if (this.path) {
      fs.exists(this.path, function (exists) {
        resolve(exists);
      });
    } else {
      reject(new Error("No path"));
    }
  });
};

module.exports = File;