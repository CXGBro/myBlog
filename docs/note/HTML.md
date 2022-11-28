---
layout: doc
---

#  HTML

## src与href的区别

两者都是请求外部的文件,src会将请求到的文件内容添加到html文件里,同时src会堵塞文件的加载,其实就是同步加载

href则仅仅建立外部文件与html文件之间的一种链接,href不会堵塞文件的加载,其实也是异步加载

## link与@import的区别

link为异步加载,@import是同步加载

@import会嵌入内容到html中,link则不会

## HTML语义化标签

```
header
footer
nav
section
```

## DOCTYPE的意义

告知浏览器使用哪一种文档类型定义来解析文档

在HTML5中,直接声明即可

## defer与async的区别

两者都可以异步请求资源,防止文档读取的堵塞

defer注意是异步加载,不是异步请求,也就是浏览器在读取到加载js标签时,会一边请求资源,一边继续向下读取html,直到读取完成后,再异步加载(执行)js代码

async就是单纯的异步,不会出现先请求再执行的情况.

## HTML5新增了哪些东西

1.语义化标签 2.本地存储 3.媒体标签 4.canvas 5.history API 6.websocket通信协议

## 介绍一下webworker
