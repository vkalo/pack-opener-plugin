const eResolve = require("enhanced-resolve"); // 路径解析工具
const { readFileSync, existsSync, statSync } = require('fs');
const { resolve } = require('path');
const { currDirRegExp, jsSuffixRegExp, node_modulesReg } = require('./constants/reg');
const { inlet, moduleList, moduleName } = require('./init');
const { setModule } = require('./utils');

function realPath(requirePath, filePath) {
  try {
    if (currDirRegExp.test(requirePath)) {
      return fromRelativePath(requirePath, filePath)
    } else {
      return fromModulePath(requirePath)
    }
  } catch (err) {
    throw new Error(`${filePath}文件内的${requirePath}未找到，`);
  }
}

function fromRelativePath(requirePath, filePath) {
  let realPath = resolve(filePath, '../', requirePath);
  if (existsSync(realPath) && statSync(realPath).isFile()) {
    return realPath;
  } else {
    if (existsSync(realPath + '.js')) {
      return realPath + '.js';
    } else if (existsSync(realPath + '/index.js')) {
      return realPath + '/index.js';
    }
    throw Error('文件未找到');
  }
}

function fromModulePath(requirePath) {
  let path = null;
  try {
    path = eResolve.sync(__dirname, requirePath);
  } catch (err) {
    path = eResolve.sync(inlet, requirePath);
  }
  return path;
}


const pathMap = {};
function getModulePath(path) {
  if (pathMap[path]) {
    return pathMap[path];
  }
  if (!path.includes('/node_modules/')) {
    pathMap[path] = path.replace(inlet, `${moduleName}`);
  } else {
    const {rootPath,name}=parseModulePath(path);
    if (!moduleList[name]) {
      const { version } = JSON.parse(readFileSync(resolve(rootPath, './package.json')));
      const { moduleName, modulePath } = setModule(name, version);
      const entryPath = realPath(name);
      const rootReg = new RegExp(`^${rootPath}`);
      moduleList[name] = { name, version, entryPath, rootReg, moduleName, modulePath };
    }
    pathMap[path] = path.replace(rootPath, name + '@' + moduleList[name].version);
  }
  return pathMap[path];
}

function parseModulePath(path){
  const [node_modules] = path.match(node_modulesReg);
  const pathArr = path.replace(node_modules, '').split('/');
  const name = pathArr[0].startsWith('@') ? pathArr[0] + '/' + pathArr[1] : pathArr[0];
  const rootPath = node_modules + name;
  return {rootPath,name}
}

module.exports = {
  realPath,
  getModulePath,
  parseModulePath,
}