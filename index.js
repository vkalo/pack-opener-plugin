const chartInfo = require('./src/init');

function init(config) {
  chartInfo.init(config);
  const { loadChart, modularization } = require('./src/loadChart');
  const exportModule = require('./src/outChart');
  const { outfiles, errors, inlet, moduleName } = chartInfo;

  if (!loadChart(chartInfo.entryPath)) {
    throw new Error('初始化失败');
  }
  modularization();
  require('./src/watch');
  return { outfiles, errors, inlet, moduleName, exportModule };
}

module.exports = init;