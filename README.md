# pack-opener-plugin

## 简介
pack-opener-plugin用于将js代码打包成浏览器能识别的模块，能够识别打包js,css,png,json等文件，打包将生成模块@版本的格式方便复用。

## 安装
`npm install pack-opener-plugin`

## 使用

const init = require('pack-opener-plugin');
/**
* {string} entryPath 需要打包的文件入口
/
const moduleInfo = init({entryPath:'/index.js'})

## 其他
本项目的优点是无需resourceMap等依赖文件，所有代码依赖关系由都包含在代码自身,加载配合pack-opener使用。