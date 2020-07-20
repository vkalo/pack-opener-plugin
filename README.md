# pack-opener-plugin

## 简介
pack-opener-plugin用于将js代码打包成浏览器能识别的模块，通过入口文件，解析依赖树，将代码打包，能够识别打包js,css,png,json等文件，打包将生成`模块@版本`的格式方便复用。每一个模块独立成包（npmpackge模块或入口文件形成的模块），不在模块入口文件依赖树内的文件将独立成包（部分npm模块会出现这种情况）,因此打包后的文件数量会>=包的数量。

## 安装
`npm install pack-opener-plugin`

## 使用

```javascript
const init = require('pack-opener-plugin');
/**
* {string} entryPath 需要打包的文件入口
* {array[string]} extra 额外打包的文件（不在文件入口的依赖树内）
* {string} name 打包生成的模块名
* {string} version 打包生成的模块版本
* {array[function]} hotCallback 热更新回调函数
/
const moduleInfo = init({entryPath:'/index.js',extra,name,version,hotCallback});

const {
	outfiles,// 打包翻译后的文件列表
	errors, // 打包错误集合
	inlet, // 入口文件夹
	moduleName, // 打包生成的模块名称 name@version
	exportModule, // 输出打包压缩后的模块文件列表（uglify压缩）
	hotCallback, // 热更新回调函数集合，初始化后可通过此次增减函数
} = moduleInfo；

```

## 其他
本项目无需resourceMap等依赖文件，所有代码依赖关系由都包含在代码自身,加载配合pack-opener使用。
