var watch = require('watch')
const { addFile, modifyFile, deleteFile } = require('./update');

function wathcFolder(path, hotCallback) {
  function callback(path, type) {
    hotCallback.forEach(function (f) {
      f(path, type)
    })
  }
  watch.createMonitor(path, function (monitor) {
    monitor.on("created", function (f) {
      addFile(f);
      callback(f, "created")
    })
    monitor.on("changed", function (f) {
      modifyFile(f);
      callback(f, "changed")
    })
    monitor.on("removed", function (f, stat) {
      deleteFile(f);
      callback(f, "removed")
      // Handle removed files
    })
    // monitor.stop(); // Stop watching
  })
}

module.exports = wathcFolder;