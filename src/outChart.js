
const { outfiles} = require('./init');
const uglifyjs = require("uglify-es");
const options = { toplevel: true };

function exportModule() {
  return Object.entries(outfiles).reduce((out, [path, text]) => {
    if (path.endsWith('.js')) {
      out[path] = uglifyjs.minify(text, options).code;
    } else {
      out[path] = text;
    }
    return out;
  }, {});
}

module.exports = exportModule;