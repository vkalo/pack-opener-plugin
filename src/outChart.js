
const { outfiles} = require('./init');
const uglifyjs = require("uglify-es");
const options = { toplevel: true };

function exportModule() {
  return Object.entries(outfiles).reduce((out, [path, text]) => {
    console.log(path);
    if (path.endsWith('.js')) {
      // out[path] = uglifyjs.minify(text, options).code;
      out[path] = text;
    } else {
      out[path] = text;
    }
    return out;
  }, {});
}

module.exports = exportModule;