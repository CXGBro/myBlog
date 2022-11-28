---
layout: doc
---

# CSS

## 左侧固定,右侧自适应

flex:

```css
.main{
      display: flex;
    }
    .left{
      background: red;
      width: 300px;
      /* 内容超出主轴的时候这一部分不会被压缩 */
      flex-shrink: 0;
    }
    .content{
      background-color: blue;
      /* 占满整个剩余部分 */
      flex-grow: 1;
    }

  <div class="main">
    <div class="left">左侧</div>
    <div class="content">右侧</div>
  </div>
```

grid:

```css
.main{
      display: grid;
      // 左边占300px 右边占所有的比例
      grid-template-columns: 300px 1fr;
    }
```

float+BFC

```css
.left{
      background: red;
      /* 让其脱离标准流 */
      float: left;
      width: 300px;
    }
    .content{
      background-color: blue;
      /* 触发BFC */
      overflow: hidden;
    }
```



## 清除浮动的方法:

1. clear属性,将标准流(文档最上面的元素)移动到所有浮动元素的下面

   实际操作中通过添加一个类名为line的div,(是标准流)让它跑到浮动元素的下面撑起来整个父元素

   1. left 移动到左浮动的下面
   2. right 移动到右浮动的下面
   3. both 两者同时的下面

2. 伪元素方式(核心思路就是把 一个元素放到所有浮动元素的下面

   ```css
   <div class="clear-fix">
   	<浮动元素></>
   	<浮动元素></>
   </div>
   
   
   .clear-fix::after{
   	content:'';  //在浮动元素的后面添加一个伪元素,内容为空,让它跑到所有浮动元素的后面
   	clear:both;
   	display:block;  //伪元素的默认格式是行内元素
   	
   }
   ```

   

## 讲一下CSS定位吧

1. static: position属性的默认值,元素不会脱离标准流,也不会成为定位元素

2. relative: 相对于自己的位置的定位,元素不会脱离标准流

3. absolute: 相对于自己第一个非static属性的父级元素的定位,如果没有相对于视口

4. fixed: 相对于视口的定位,窗口滚动时不会影响fixed. 

   > 视口(viewport): 自己能看到的页面
   >
   > 画布(canvas): 整个窗口大小

为什么子绝父相:1.让子元素找到相对的元素 2. 父亲不要脱离标准流

5. sticky: 默认为relative,设置的属性值触发以后变为fixed

比较常见的就是搜索栏,向下滚动的时候自动跟着你的屏幕滚

## 盒模型

```
标准盒模型
content-box 
IE盒模型 box-sizing: border-box;
```



## 实现一个三角形

```
核心原理,内容区设置为0,然后设置边框,将边框设置为透明色,那个方向需要三角形,就设置哪个方向的颜色
#test{
      width: 0;
      height: 0;
      border:solid 100px transparent;
      border-bottom:solid 100px red;
    }
```

## 权重问题

不同的选择器会有不同的权重,权重越大,意味着选择器属性的渲染优先级越高.

 !important>行内样式>id>类 属性 伪类>标签 伪元素>通配符选择器

权重问题是基于层叠性而来,

!important：10000  内联样式：1000  id选择器：100  类选择器、属性选择器、伪类：10  元素选择器、伪元素：1  通配符：0

## 毛玻璃的实现效果

重点在于backdrop-filter,该属性的作用在于让元素的后面元素添加一些效果,如模糊等



## 水平垂直居中的方式

```html
.parent {
      width: 200px;
      height: 100px;
      /* position: relative; */
      background-color: #374858;
    }

    .parent .child {
      width: 100px;
      height: 50px;
      background-color: #9dc3e6;
    }

<div class="parent">
    <div class="child"></div>
</div>
```

### 水平居中

子元素为内联元素(行内块元素为内联元素),

为**父元素**设置text-align

```
.parent
```

子元素为块级元素

为子元素设置margin:0 auto

```css
.child{
      margin: 0 auto;
}
```

使用绝对定位

相对定位是相对自己原来的位置的定位

绝对定位是相对自己的父级元素的定位

```css
.child{
      position: absolute;
      left: 50%;
      transform:translate(-50%,0);
    }
```

使用flex布局

在**父元素**上使用justify-content,规定flex-item在主轴上的对齐方式

```css
.parent{
      display: flex;
      justify-content: center;
    }
```

### 垂直居中

```css
.parent{
      display: flex;
      align-items:center;
    }
    

// 针对表格元素???
.parent{
      display: table-cell;
      vertical-align: middle;
    }
    
// 定位很容易想到
.child{
      position:absolute;
      top: 50%;
      transform:translate(0,-50%);
    }
```

### 两者 同时居中

```
块元素
.child{
      position:absolute;
      top: 50%;
      left: 50%;
      transform:translate(-50%,-50%);
    }
    
    //flex
.parent{
      display: flex;
      justify-content: center;
      align-items: center;
    }

行内块元素
```

## BFC

块级格式化上下文,当你在使用某些css属性的时候会触发BFC,这个上下文环境独立于其它的环境,不受其他的环境影响.

## BFC及其应用

## 解决高度塌陷问题

子元素采用了浮动,就脱离了标准流,这样它就不会向父元素汇报高度,父元素认为子元素没有高度,就会造成高度塌陷

1. 
