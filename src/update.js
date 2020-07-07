
const { allFiles, othersList, moduleList, moduleName, outfiles } = require('./init');
const { loadChart, modularization } = require('./loadChart');
const { getModulePath } = require('./parsePath');
/**
 * 增加修改文件
 * @param {string} path 
 */
function modifyFile(path) {
  Reflect.deleteProperty(outfiles, moduleName);
  removerFile(path);
  loadChart(path);
  modularization();
  // console.log('完成文件更新')
}

function deleteFile(path) {
  Reflect.deleteProperty(outfiles, moduleName);
  const fileList = [path];

  //  输出所有依赖文件
  while (fileList.length > 0) {
    const filesPath = fileList.shift();
    if (filesPath in allFiles) {
      const { imports } = allFiles[filesPath];
      fileList.push(...imports);
      removerFile(filesPath);
    }
  }
  modularization();
  // console.log('文件完成删除')
}


function removerFile(path) {
  const modulePath = getModulePath(path);
  Reflect.deleteProperty(allFiles, path);
  Reflect.deleteProperty(othersList, modulePath);
  Reflect.deleteProperty(moduleList[moduleName].contain, modulePath);
}

module.exports = {
  modifyFile,
  deleteFile,
}