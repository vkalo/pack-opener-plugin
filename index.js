const chartInfo = require('./src/init');

function init({ entryPath, extra, name, version, hotCallback = [] }) {
  chartInfo.init({ entryPath, extra, name, version });
  hotCallback = Array.isArray(hotCallback) ? hotCallback : [hotCallback];
  const { loadChart, modularization } = require('./src/loadModule');
  const exportModule = require('./src/outModule');
  const watch = require('./src/watch');
  const { outfiles, errors, inlet, moduleName } = chartInfo;
  const loadFiles = [chartInfo.entryPath, ...extra];

  if (!loadFiles.reduce((res, path) => loadChart(path) && res, true)) {
    throw new Error('初始化失败');
  }

  modularization();
  watch(inlet, hotCallback);
  console.log('完成了模块化,模块数' + Object.keys(outfiles).length);
  return { outfiles, errors, inlet, moduleName, exportModule, hotCallback };
}

module.exports = init;