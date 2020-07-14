const { allFiles, moduleList, othersList, outfiles, errors } = require('./init');
const { transLateFiles } = require('./transcoding');
const { packCode,warn,dealJsFile} = require('./utils');
const { getModulePath,parseModulePath } = require('./parsePath');

function loadChart(entryPath) {
  const fileList = [entryPath];
  //  输出所有依赖文件
  while (fileList.length > 0) {
    const filesPath = fileList.shift();
    if (!allFiles[filesPath]) {
      try {
        const { imports, text, modulePath } = transLateFiles(filesPath);
        allFiles[filesPath] = { imports, text, modulePath };
        othersList[filesPath] = allFiles[filesPath];
        fileList.push(...imports);
        Reflect.deleteProperty(errors, filesPath);
      } catch (err) {
        errors[filesPath] = err;
      }
    }
  }
  if (Object.keys(errors).length > 0) {
    Object.values(errors).forEach(errors => {
      warn(errors.message)
    })
    console.log('读取失败');
    return false;
  } else {
    return true;
  }
}

function modularization() {
  if (Object.keys(errors).length > 0) {
    return;
  }
  //提取模块
  Object.values(moduleList).forEach((item) => {
    if (item.needUpdate || !outfiles[item.modulePath]) {
      const { depends, contain } = pickModule(item);
      Object.assign(item, { depends, contain });
    }
  });

  //整合模块
  Object.values(moduleList).forEach((item) => {
    const { modulePath, depends, contain } = item;
    if (item.needUpdate || !outfiles[modulePath]) {
      const { [modulePath]: entryFile, ...other } = contain;
      const text = packCode(modulePath, mergeDependencies(depends), entryFile);
      outfiles[modulePath] = dealJsFile(Object.entries(other).reduce((res, [modulePath, text]) => {
        return packCode(modulePath, text) + res;
      }, text));
    }
  });

  //单独提取非模块文件
  Object.values(othersList).forEach(({ modulePath, text, imports }) => {
    if (!outfiles[modulePath]) {
      if (modulePath.endsWith('.js')) {
        text = dealJsFile(packCode(modulePath, mergeDependencies(imports), text));
      }
      outfiles[modulePath] = text;
    }
  });
}

function pickModule({ entryPath, rootReg, modulePath }) {
  const list = [entryPath];
  const depends = {}
  const contain = { [modulePath]: '' };

  while (list.length > 0) {
    const filePath = list.shift();
    const modulePath = getModulePath(filePath);
    const overlist = {};
    if (!overlist[filePath]) {
      if (allFiles[filePath] || loadChart(filePath)) {
        const { text, imports } = allFiles[filePath];

        filePath in othersList && Reflect.deleteProperty(othersList, filePath);
        contain[modulePath] = text;
        imports.forEach(path => {
          if (!rootReg.test(path) || path.endsWith('.json')) {
            depends[path] = true;
          } else if (path.endsWith('.js')) {
            list.push(path);
          }
        })
        overlist[filePath] = true;
      } else {
        break;
      }
    }
  }

  return { depends, contain };
}

/**
 * 整合模块依赖
 * @param {array} depends 
 */
function mergeDependencies(depends) {
  depends = Array.isArray(depends) ? depends : Object.keys(depends);
  return depends.reduce((res, filePath) => {
    if (filePath in othersList || filePath.endsWith('.json')) {
      res[getModulePath(filePath)] = true;
    } else {
      const {name} = parseModulePath(filePath);
      const { modulePath } = moduleList[name];
      res[modulePath] = true;
    }
    return res;
  }, {});
}

module.exports = {
  loadChart,
  modularization,
}