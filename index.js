const chartInfo = require('./src/init');
const { join } = require('path');
function init({ entryPath, extra, hotCallback = [] }) {
  chartInfo.init({ entryPath, extra });
  hotCallback = Array.isArray(hotCallback) ? hotCallback : [hotCallback];
  const { loadChart, modularization } = require('./src/loadChart');
  const exportModule = require('./src/outChart');
  const watch = require('./src/watch');
  const { outfiles, errors, inlet, moduleName } = chartInfo;
  if (!loadChart(chartInfo.entryPath) || !loadChart(join(inlet, 'package.json')) || !loadChart(join(inlet, 'poster.png'))) {
    throw new Error('初始化失败');
  }
  modularization();
  watch(inlet, hotCallback);
  console.log('完成了模块化');
  return { outfiles, errors, inlet, moduleName, exportModule, hotCallback };
}

module.exports = init;