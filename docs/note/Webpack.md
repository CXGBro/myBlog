---
layout: doc
---

# Webpack

## Loader与Plugin

定义:

loader用于将不同的模块转换为webpack可以识别的模块

webpack原生只能识别诸如js\json这样的模块,loader赋予了webpack识别css等模块的能力

loader的基本执行顺序是从下到上,可使用配置项来改变执行的顺序

### 手写loader

loader本质是一个函数,当webpack在编译到某个指定的文件格式时,就调用loader函数,并且把要编译的内容传给这个函数.

由此可见loader就是一个函数中转站,拦截你写的文件进行进一步的处理以便于webpack正确识别它原本不能识别的文件

```js
module.exports = function loader(content){
  return content;
}

// content内容就是 console.log(hello worlde)
// 因此控制台上输出就是hello world!
```



## 基本构建形式

```js
var path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  // 生产模式代码会被压缩
  mode: 'development',
  entry: './src/main.js',
  devServer:{
    static:{
      directory:path.resolve(__dirname,'dist')
    }
  },
  module:{
    rules:[
      {
        test:/\.(jpe?g|gif|png)$/,
        use:{
          // loader:'file-loader',
          loader:'url-loader',
          options:{
            name:'[name].[ext]',
            outputPath:'img/',
            limit:20480
          }
        }
      },
      {
        test:/\.css$/,
        // 注意此处的写法
        use:['style-loader','css-loader']
          //一个用来处理依赖关系,一个用来处理样式
      },
      {
        test:/\.m?js$/,
        exclude:/(node_modules)/,
        use:{
          loader:"swc-loader"
        }
      }
    ]
  },
  plugins:[
    new HtmlWebpackPlugin({
      template:'public/index.html'
    })
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    // filename: '[name].[contenthash:6].js',
    filename:'[name].js'
    // hashFunction:'xxhash64'
  }
};
```



## 优化构建速度

首先考虑到loader,loader是用来识别不同的格式进行转换的,

精简处理:

include,exclude约束执行范围,排除一部分不需要执行的

不重复处理(缓存):

模块解析以后,进行一次缓存,下次再次使用该模块时,直接使用缓存即可.配置方法:

```
module.exports={
	cache:{
		type:'filesystem'
	}
}
```

一条线处理的更快(高效编译器):

使用SWC或者ESBuild等更快的编译器

并行处理:

使用官方推出的thread-loader(多进程解决方案),这个一个loader,安装后把这个loader放置在所有loader的最前面即可.

但注意的是,由于创建进程也需要时间,该方法的处理效果并不理想



## 实现更好的性能优化

使用swc-loader转化js,替代babel

```
{
        test:/\.m?js$/,
        exclude:'/(node_modules)/',
        use:{
          loader:"swc-loader"
        }
      }
```

## npx命令

npx就是直接执行本地/node_modules/.bin下的命令,免去了在scripts里写东西的麻烦


