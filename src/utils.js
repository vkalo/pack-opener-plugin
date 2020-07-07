const { existsSync } = require('fs');

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


/**
 * 查看文件是否存在
 * @param  {...any} files 
 */
function existsFiles(...files) {
  const flag = true;
  const err = '';
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

function warn(message) {
  console.log("%c " + message, "color: red");
}
module.exports = {
  setModule,
  packCode,
  existsFiles,
  warn,
}