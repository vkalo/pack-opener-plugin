

module.exports.currDirRegExp = /^\.\/|\.\.\//; //相对路径匹配正则

module.exports.jsSuffixRegExp = /\.js$/i; // js匹配正则

module.exports.modulePathReg = /^.*\/node_modules\/(.*?)(?=\/)/;// 匹配模块地址和模块名；

module.exports.node_modulesReg = /(^.*\/node_modules\/)/; // 匹配node_modules目录

module.exports.commentRegExp = /\/\*[\s\S]*?\*\/|([^:"'=]|^)(?<!\w)\/\/.*$/mg; // 注释匹配正则

module.exports.requireRegExp = /\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g; // require匹配正则

module.exports.jsSuffixRegExp = /\.js$/i; // js匹配正则