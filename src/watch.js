var watch = require('watch')
const { modifyFile, deleteFile } = require('./update');
const { inlet,allFiles,errors } = require('./init');
watch.createMonitor(inlet, function (monitor) {
  // monitor.files['/home/mikeal/.zshrc'] // Stat object for my zshrc.
  monitor.on("created", function (f, stat) {
    console.log(f, 'created')
    if(f in errors){
      modifyFile(f);
    }
    // Handle new files
  })
  monitor.on("changed", function (f, curr, prev) {
    console.log(f, '文件修改');
    if(f in allFiles){
      modifyFile(f);
    }
    console.log('热更新开始')
    // Handle file changes
  })
  monitor.on("removed", function (f, stat) {
    console.log(f, '移除文件')
    if(f in allFiles){
      deleteFile(f);
    }
    // Handle removed files
  })
  // monitor.stop(); // Stop watching
})

