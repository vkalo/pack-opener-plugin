
const { allFiles, othersList, moduleList, moduleName, outfiles, errors } = require('./init');
const { loadChart, modularization } = require('./loadChart');
const { getModulePath } = require('./parsePath');

/**
 * 新增文件
 * @param {string} path 
 */
function addFile(path) {
  if (path in errors) {
    loadChart(path);
    modularization();
  }
}

/**
 * 修改文件
 * @param {string} path 
 */
function modifyFile(path) {
  if (path in allFiles) {
    Reflect.deleteProperty(outfiles, moduleName);
    removerFile(path);
    loadChart(path);
    modularization();
  }
}

/**
 * 删除文件
 * @param {string} path 
 */
function deleteFile(path) {
  if (path in allFiles) {
    Reflect.deleteProperty(outfiles, moduleName);
    const fileList = [path];

    //  删除所有依赖文件
    while (fileList.length > 0) {
      const filesPath = fileList.shift();
      if (filesPath in allFiles) {
        const { imports } = allFiles[filesPath];
        fileList.push(...imports);
        removerFile(filesPath);
      }
    }
    modularization();
  }
}


function removerFile(path) {
  const modulePath = getModulePath(path);
  Reflect.deleteProperty(allFiles, path);
  Reflect.deleteProperty(othersList, modulePath);
  Reflect.deleteProperty(moduleList[moduleName].contain, modulePath);
  Reflect.deleteProperty(outfiles, modulePath);
}

module.exports = {
  addFile,
  modifyFile,
  deleteFile,
}