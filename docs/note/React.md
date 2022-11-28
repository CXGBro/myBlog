---
layout: doc
---

# React

## 介绍一下什么是React

前端开发框架,相比较于原生开发,使用react的特点是声明式\组件化\通用性

声明式: 使用return模块的形式?

组件化: 使用组件化来提高复用性,降低耦合性

通用性: react使用虚拟DOM ,这使得react实现了一次书写,处处运行成为了可能

## 为什么React使用JSX

JSX就是js的一种语法扩展,形式类似于xml,通过jsx书写js文件,让js的结构代码可以用标签的形式书写,显著提高了js代码的可读性.

react并不是严格要求使用jsx,当不使用jsx声明元素时,使用react.createElement方法声明.其实,使用了jsx,在编译阶段,babel也会将代码转换为createElement

之所以使用jsx,在于react团队的设计模式,相比于vue的模板语法,react就尽可能的不去引入新的概念,诸如模板指令等在react是找不到的.
