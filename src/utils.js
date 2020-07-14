const { existsSync,writeFileSync } = require('fs');
const mkdirp = require('mkdirp');
const {dirname} = require('path');

/**
 * 配置模块
 * @param {string} name 模块名
 * @param {string} version 版本👌
 */
function setModule(name, version) {
  const moduleName = name + '@' + version;
  const modulePath = `${moduleName}/index.js`;
  return { moduleName, modulePath };
}

/**
 * 封装成pack-opener模块格式
 * @param {string} id 模块id
 * @param {Array|Object} dependent 子项依赖
 * @param {string} text 模块回调函数内容
 */
function packCode(id, dependent, text) {
  if (typeof dependent === 'string') {
    text ? (dependent = [dependent]) : (text = dependent, dependent = [])
  }
  dependent = Array.isArray(dependent) ? dependent : Object.keys(dependent);
  return `pack('${id}',[${dependent.map(i => `'${i}'`).toString()}], function (opener, exports, module){
    ${text}
  });`;
};

function dealJsFile(text){
  return `(function(){var define=null;var require=null;${text}})();`;
}
/**
 * 查看文件是否存在
 * @param  {...any} files 
 */
function existsFiles(...files) {
  let flag = true;
  let err = '';
  files.forEach((path) => {
    if (!existsSync(path)) {
      flag = false;
      err += `缺少文件${path}`;
    }
  });
  if (err) {
    throw new Error(err);
  }
  return flag;
}

var styles = {
  'bold': ['\x1B[1m', '\x1B[22m'],
  'italic': ['\x1B[3m', '\x1B[23m'],
  'underline': ['\x1B[4m', '\x1B[24m'],
  'inverse': ['\x1B[7m', '\x1B[27m'],
  'strikethrough': ['\x1B[9m', '\x1B[29m'],
  'white': ['\x1B[37m', '\x1B[39m'],
  'grey': ['\x1B[90m', '\x1B[39m'],
  'black': ['\x1B[30m', '\x1B[39m'],
  'blue': ['\x1B[34m', '\x1B[39m'],
  'cyan': ['\x1B[36m', '\x1B[39m'],
  'green': ['\x1B[32m', '\x1B[39m'],
  'magenta': ['\x1B[35m', '\x1B[39m'],
  'red': ['\x1B[31m', '\x1B[39m'],
  'yellow': ['\x1B[33m', '\x1B[39m'],
  'whiteBG': ['\x1B[47m', '\x1B[49m'],
  'greyBG': ['\x1B[49;5;8m', '\x1B[49m'],
  'blackBG': ['\x1B[40m', '\x1B[49m'],
  'blueBG': ['\x1B[44m', '\x1B[49m'],
  'cyanBG': ['\x1B[46m', '\x1B[49m'],
  'greenBG': ['\x1B[42m', '\x1B[49m'],
  'magentaBG': ['\x1B[45m', '\x1B[49m'],
  'redBG': ['\x1B[41m', '\x1B[49m'],
  'yellowBG': ['\x1B[43m', '\x1B[49m']
}


/**
 * 输出文件
 * @param {string} path 
 * @param {string} text 
 */
function outFile(path, text) {
  mkdirp.sync(dirname(path));
  writeFileSync(path, text, "utf-8");
}


function warn(message) {
  const key = 'red'
  console.log(styles[key][0] + '%s' + styles[key][1], message)
}
module.exports = {
  setModule,
  packCode,
  existsFiles,
  warn,
  outFile,
  dealJsFile,
}