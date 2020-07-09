

const { readFileSync } = require('fs');
const { dirname, join } = require('path');
const { setModule, existsFiles } = require('./utils');


const chartInfo = {
  outfiles: {},
  allFiles: {}, //所有文件原始信息
  moduleList: {}, //模块文件
  othersList: {}, //非模文件
  moduleName: null,
  errors: {}, // 错误池

  outlet: '',
  inlet: '',
  init,
}

function init({ entryPath, extra }) {
  console.log('初始化模块信息')
  existsFiles(entryPath, ...extra);
  const inlet = dirname(entryPath);
  const packageText = readFileSync(join(inlet, 'package.json'), 'utf-8');
  const packageJson = JSON.parse(packageText);
  const { name, version } = packageJson;
  const { moduleName, modulePath } = setModule(name, version);
  const rootReg = new RegExp(`^${inlet}/(?!node_modules/)`);

  chartInfo.moduleName = moduleName;
  chartInfo.entryPath = entryPath;
  chartInfo.inlet = inlet;
  chartInfo.moduleList = {
    [moduleName]: { name, version, entryPath, rootReg, moduleName, modulePath, needUpdate: true },
  };
}


module.exports = chartInfo;