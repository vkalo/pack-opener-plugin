
const { outfiles, moduleList, moduleName } = require('./init');
const uglifyjs = require("uglify-es");
const options = { toplevel: true };
const { join } = require('path');
const { readdirSync, readFileSync, writeFileSync,mkdirSync,existsSync } = require('fs');

const moduleCachePath = join(__dirname, '../moduleCache');
if (!existsSync(moduleCachePath)) {
  mkdirSync(moduleCachePath);
}

function exportModule() {
  let { [moduleName]: selfModule, ...nodeModule } = moduleList;
  let nodeModuleList = {};
  Object.values(nodeModule).forEach(item => {
    nodeModuleList[item.modulePath] = item;
  });
  const moduleCache = readdirSync(moduleCachePath);

  return Object.entries(outfiles).reduce((out, [path, text]) => {
    if (path.endsWith('.js')) {
      if (path in nodeModuleList) {
        const cacheName = nodeModuleList[path].moduleName + '.js';
        if (moduleCache.includes(cacheName)) {
          text = readFileSync(join(moduleCachePath, cacheName))
        } else {
          text = uglifyjs.minify(text, options).code;
          writeFileSync(join(moduleCachePath, cacheName), text);
        }
      } else {
        text = uglifyjs.minify(text, options).code;
      }
      out[path] = text;
    } else {
      out[path] = text;
    }
    return out;
  }, {});
}

module.exports = exportModule;