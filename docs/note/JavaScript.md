---
layout: doc
---
# JavaScript

## JS运行机制与原理

### JS内存存储原理与垃圾回收机制

内存分为了栈空间与堆空间

栈空间存放了全局执行上下文与函数执行上下文,执行上下文中,基本数据类型直接通过键值对的方式存储.引用类型存储方式是它的值为内存地址,也就是说它存储了引用类型的引用,内存地址指向堆空间



为什么不能只有栈空间?

1. 当所有数据都放到栈空间时,栈的上下文切换变得很困难.比如从全局上下文转向函数上下文时,只要将指向全局上下文的指针移动到函数上下文就可以了.数据太大造成指针转移的效率大大降低

如何进行垃圾回收?

1. 对于栈空间,比如顶层的函数执行完毕,需要内存回收.直接将指针下移,就完成了栈空间的内存回收

那堆空间呢?

1. 将堆空间分为两部分,一部分为老生代,存放存放时间长的对象.一部分为新生代,空间很小,存放时间短的对象
2. 老生代使用主垃圾回收器,新生代使用副垃圾回收器
3. 

### js继承原理

```js
// 预设代码
function Person(name,age){
  this.name=name;
  this.age=age;
}

Person.prototype.running=function(){
  console.log(this.name+'running');
}

function Student(sno){
  this.sno=sno
}

Student.prototype.studying=function(){
  console.log(this.name+'studying');
}
```

#### 原型链继承

思路:要想实现子类继承父类,子类的原型对象中得包括父类

两种方案:1.子类原型为父类的原型,`Student.prototype=Person.prototype`但这样会造成person的内容太多

2.子类原型为父类的实例对象`Student.prototype=person`

```js
function Person(name,age){
  this.name=name;
  this.age=age;
}

Person.prototype.running=function(){
  console.log(this.name+'running');
}

let person = new Person('cheng',18);

function Student(sno){
  this.sno=sno
}

Student.prototype=person;

Student.prototype.studying=function(){
  console.log(this.name+'studying');
}

let student = new Student(0001);
console.log(student);
```

但此时就有问题:1.student对象不能看到自己的父类person对象里的属性,只能看到自己的属性

2.person对象里的属性是写死的,不能随着student的生成而更改

#### 借用构造函数继承

上面的问题是,student能获得person的属性,却没法自定义person的属性

于是在子类使用父类的构造函数让父类的属性与方法定义语句在子类中执行,子类就实现了自定义属性

```js
function Person(name, age) {
      this.name = name;
      this.age = age;
    }

    Person.prototype.running = function () {
      console.log(this.name + 'running');
    }

    let person = new Person('cheng', 18);

    function Student(name,age,sno) {
      // 此时this指向了student的实例对象
      Person.call(this,name,age);
      this.sno = sno;
    }

    Student.prototype = person;

    Student.prototype.studying = function () {
      console.log(this.name + 'studying');
    }

    let student = new Student('hah',20,0001);
    console.log(student);
```

#### 组合借用继承

以上的两种方法被称为组合借用继承,它们有问题:

1. 借用构造函数时把父类的属性写在了子类里,造成了代码重复
2. 在很多情况下,这种继承方式调用了两次父类构造函数.一次在生成父类实例中,一次在借用父类的构造方法中

#### 原型式继承

明确如果搞成继承:子类实例的隐性原型为父类构造函数的显示原型

student.__proto__==Person.prototype; 这样会把大量的属性都堆到父亲上面去;

这里改进方法,找一个中间量来过度

```js
function Student(){};
function Person(){};

let obj={};
Object.setPrototypeOf(obj,Person.prototype);
Student.prototype=obj;

// 化简以后为
let obj = Object.create(Person.prototype);
Student.prototype=obj;

// 实际开发过程中会进行封装
function inherit(Subtype,Supertype){
  let obj=Object.create(Supertype.prototype);
  Subtype.prototype=obj;
  return Subtype;
}
```

#### 寄生组合式继承

```js
// createObject(为了解决object.create的兼容性而存在)
function createObject(obj){
    let F = function(){};
    F.prototype=obj;
    return new F();
}
// 寄生函数
function inherit(Subtype,Supertype){
  Subtype.prototype=createObject(Supertype.prototype);
  return Subtype;
}
```



### 函数柯里化

只传给函数一部分的参数,让它返回一个函数去处理剩余的参数

柯里化使得函数的功能更加单一,这样更方便我们写逻辑

封装一个函数,使得新产出的函数可以随意调用参数的数量

```js
function add(x,y,z){
  return x+y+z
}

function currying(fn){
  return function isEnough(...args){
    // 如果调用柯里化函数时传入的参数不满足调用整个函数时,进行参数合并后再调用
    if(args.length>=fn.length){
      return fn(...args)
    }else{
      return function(...args2){
        return isEnough(...args,...args2)
      }
    }
  }
}

const curriedAdd = currying(add)
console.log(curriedAdd(1,2,3));
console.log(curriedAdd(1)(2,3));
console.log(curriedAdd(1)); //如果参数不够执行戛然而止返回一个匿名函数
```

### 普通函数与箭头函数的区别

箭头函数本身也没有绑定arguments

箭头函数不绑定this,它的this需要到上层的作用域的上下文对象中去寻找

或者也可以说箭头函数绑定的是上层作用域的上下文对象

箭头函数的底层实现原理是.bind(this),也就是返回一个改变this后的函数

### 事件循环机制

#### 以下为浏览器中的情况

就是js引擎去处理代码时的顺序

1. 一般自上而下处理任务,把任务放到上下文调用栈中
2. 部分任务放到任务队列中
   1. 宏任务: ajax 计时器 DOM监听 UI rendering
   2. 微任务: promise的then回调 queueMicroTask()
   3. 在任何一个宏任务执行之前,都得确保微任务已经执行完毕
3. 待上下文调用栈中的所用任务执行完毕后,任务队列中的任务会入栈执行

#### node中的情况完全不同

### V8引擎(JS引擎架构)

V8引擎完成了将普通的代码转换为机器可以识别的字节码

编译器与解释器



包括

1. Parse模块
   1. 生成执行上下文
   2. 完成词法分析与语法分析,将代码转换成AST语法树

2. ignition模块
   1. 将AST转换成ByteCode（字节码）,并且一条一条的执行字节码,字节码可以理解为机器码的抽象
   1. 对于第一次执行的代码,ignition解释器直接将字节码转换为机器码运行.如果在这个期间遇到了可以重复利用的热点代码(hotspot),就交给turbofan来保存字节码转换后的机器码,下次再次解释该段代码时可以直接使用这里的机器码
   1. 之所以没有直接转换为机器码,是因为机器码的内存占用大小远远大于字节码,这样会造成内存占用量太大
3. turbofan模块
   1. 将字节码编译为CPU可以直接执行的机器码(在这段过程中,如果遇到了可以使用多次的代码,可以直接多次使用,实现重复利用)

经过字节码的中间过程,再加上热点代码的加持,效率比直接使用机器码差不多,内存占用减少不少

## 数据类型

#### API相关

##### 数组API的实践(是否改变原数组)

##### Promise

then all allSettle race any resolve reject

##### Object

###### Object.assign

**`Object.assign()`** 方法将所有[可枚举](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/propertyIsEnumerable)（`Object.propertyIsEnumerable()` 返回 true）的[自有](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty)（`Object.hasOwnProperty()` 返回 true）属性从一个或多个源对象复制到目标对象，返回修改后的对象。

即从源对象先拷贝所有可枚举的自身的属性到目标对象,返回拷贝后的对象.**会改变源对象**

`Object.assign(target,source)`

##### Array

###### array.includes array.indexOf

判断是否包含某个值,includes返回boolean.indexOf返回索引

##### ES6新增的内容

1. let const
2. 函数上的拓展：
   1. 箭头函数
   2. 剩余参数
   3. 默认参数
3. 对象上的拓展：
   1. class module
   2. Proxy
   3. Promise（aysnc/await）
   4. Set Map WeakSet WeakMap
4. 字符串上的拓展：模板字符串
5. 新增数据类型：bigInt symbol
6. 新增运算符： `**` `??` 

### js的基本类型有哪些

number string boolean null undefined symbol bigint

### NaN

```js
let name="cheng";
name = name*2;
// 值为NaN
```

### set map weakset weakmap

map与对象类型,也是键值对的形式,但是map的键的类型不止是string或者symbol,可以是任意类型.

set 与 map都是有序的 它们也都可以迭代 能使用for of 遍历. array也可以.object不可以

set类似如数组,不过set是不能存在重复元素的.因此可以利用set来进行数组去重

weakset与weakmap的重要特性是,它们都是弱引用

弱引用是虚假的连接,是手指的指向.一旦连接狗的绳子断了以后,狗就没有了

因此,放入weakset里的对象,一旦外部对它的引用消失,它就会被内存回收.weakset本身对它的引用并没有效果.

weakset里的元素只能是对象,weakmap元素的key也只能是对象.它们没有迭代的能力

## 手写实现

### 手写instanceof

instanceof用于判断左边的对象是否是右边函数的实例

```js
{} instanceof Object  // true
```

其原理在于左边的对象原型链上是否包含右边的原型对象

右边的原型对象是否在左边对象的原型链上

```js
function newInstanceof(obj, fn) {
  while (true) {
    // 这里检测到顶层原型null为止,因为上面再也没有原型了
    // 如果仅仅是原型为null,有可能函数的原型也为null,这会少检测一次原型为null的情况
    if (obj === null) {
      return false;
    }
    if (obj.__proto__ === fn.prototype) {
      return true;
    }
    obj = obj.__proto__;
  }
}

console.log(newInstanceof({},Object));
```

### 手写Array.filter

```js
Array.prototype._filter=function(fn){
                let newArray = []
                this.forEach((item,index,array)=>{
                    if(fn(item,index,array)){
                        newArray.push(item)
                    }
                })
                return newArray
            }
```



6. 





## 设计模式

### 观察者模式

目标对象:

- 维护观察者列表
- 告知观察者状态更新

观察者:

- 更新自己的状态

```
class TargetObject {
  constructor() {
    this.ObserverList = []
  }
  addObserver(observer) {
    this.ObserverList.push(observer)
  }
  notify() {
    this.ObserverList.forEach(item => {
      item.update()
    })
  }
}

class observer {
  update() {
  }
}
```

### 介绍一下发布订阅模式

利用构造函数,创建一个观察者来观察是否有

- 发布者（Publisher）发布该事件（Publish Event）到调度中心，也就是事件触发

- 调度中心(Event Channel)也就是中介,负责任务订阅管理,提供订阅功能,发布订阅任务

- 订阅者（Subscriber）把自己想订阅的事件注册（Subscribe）到调度中心（Event Channel）

```js
class EventChannel{
  constructor(){
    this.events={}
  }
  subscribe(type,callBack){  // 在eventbus中,on就是订阅,emit就是发布
    if(!this.events[type]){
      this.events[type]=[]
    }
    this.events[type].push(callBack)
  }
  publish(type,...args){
    this.events[type].forEach(element => {
      element(...args)
    });
  }
}

let eventChannel = new EventChannel();
eventChannel.subscribe('warname',()=>{
  console.log('warname');
})
eventChannel.publish('warname')
```

## 场景应用

### 实现懒加载

#### 使用scroll滚动事件

获取浏览器窗口的高度`window.innerHeight`

元素到窗口顶部的距离`element.getBoundingClinetRect().top`

getBoundingClinetRect()

`getBoundingClientRect()` 提供了元素的大小以及视口的位置

1. 在元素身上自定义一个属性
2. window对象上监听滚动事件,滚动事件一旦触发,遍历所有需要懒加载的元素判断它的高度与浏览器视口之间的关系

```html
<img data-src="./images/幻灯片1.JPG" alt="">
  <img data-src="./images/幻灯片2.JPG" alt="">
  <img data-src="./images/幻灯片3.JPG" alt="">
  <p>幻灯片1.JPG
    幻灯片2.JPG
    幻灯片3.JPG
    幻灯片15.JPG</p>
    <script>
      var img = document.querySelectorAll('img');
      window.addEventListener("scroll",(e)=>{
        img.forEach(image=>{
          const imgTop=image.getBoundingClientRect().top;
          if(imgTop<window.innerHeight){
            const data_src =image.getAttribute('data-src');
            image.setAttribute('src',data_src); 
          };
          console.log('scroll已触发')
        })
      })
```

#### IntersectionObserver

它的用法非常简单。

> ```javascript
> var io = new IntersectionObserver(callback, option);
> ```

目标元素的可见性变化时，就会调用观察器的回调函数`callback`。

`callback`一般会触发两次。一次是目标元素刚刚进入视口（开始可见），另一次是完全离开视口（开始不可见）。

```javascript
// 开始观察
io.observe(document.getElementById('example'));

// 停止观察
io.unobserve(element);
```

## 经典闭包面试题

为什么会保存最后一个变量

```js
var divElems = document.getElementsByTagName('div');
for (var i = 0; i < divElems.length; i++) {
  var elem = divElems[i];
  elem.onclick = function () {
    console.log(i);
  }
}
```

## 手写Array.map

先想,这个东西是干什么用的?(注意是直接修改原数组还是返回一个新的数组?)

```js
Array.prototype._map=function(callback){
                let res=[];
                 this.forEach((item,index)=>{
                     res.push(callback(item));
                 })
                return res;
            }
```

## 跨域

出现跨域问题是由于浏览器的同源策略导致的

同源:协议 端口 主机

浏览器将跨域行为分成了3类,包括`reads writes embedding(资源嵌入)`

### jsonp

同策略的影响,浏览器不允许使用xhr请求不同源的网站(跨域读)

但在页面上引入不同源的js脚本是可以的(跨域嵌入)

使用jsonp解决跨域就是利用script标签请求资源然后进行进一步的处理

缺点: 只能发送GET请求; 优点是兼容性较好

## 事件传播机制与事件代理

监听事件流的两种方式:事件冒泡与事件捕获

一下可以理解为事件传播机制:

- 从最外层元素向内传播,遇到绑定了捕获事件的元素会触发事件

- 找到事件触发元素,触发事件

- 从内向外传播,遇到元素绑定冒泡事件会触发冒泡事件

在使用addEventlistener时,对于第三个参数可以指定 是捕获阶段触发还是冒泡阶段触发

第三个参数可以指定为对象

```
once:true 实现只触发一次事件
passive: 消极的 
```

在事件源对象上,有几个方法,对事件传播有进一步的功效

```
preventDefault: 阻止事件的默认行为
stopPropagation: 禁止冒泡或捕获事件的进一步传播
stopImmediatePropagation: 除了阻止事件的进一步传播,还禁止调用该元素其它的事件监听
```

## 事件委托原理与实现

主要利用js中的事件监听机制--冒泡机制,将子元素的事件监听放到父元素上,子元素被点击后,事件将随着冒泡阶段传递到父元素上,通过event.target来获取子元素对象.

## 为什么0.1+0.2 != 0.3

注意,这个结果为0.30000000xx4

主要问题是js进行进制转换过程中,转换二进制后是一个无限循环的小数,js会剪掉一定的位数来保留精度,这样两个数相加后依然不是一个小数,而是一个循环小数

解决方法:

toFixed可以返回一个指定位数的小数,返回的小数类型为字符串,需要parseFloat来转换

```js
console.log(parseFloat((0.1+0.2).toFixed(1))===0.3);
```

## new运算符

```js
function create(fn,...args){
  let obj={};
  Object.setPrototypeOf(obj,fn.prototype);
  // 改变this
  fn.apply(obj,args);
  return obj;
}

function cons(val,num){
  this.val=val;
  this.num=num;

  // 如果这里return了一个东西,就需要做进一步的处理???
    // 这里看不明白,为何要进一步的处理
  return 5;
};

let obj = create(cons,11,22);
// 返回一个新对象
// 原型对象一致
// cons.apply(obj,args)
console.log(obj);
```

## Promise

promise就是承诺的意思,承诺未来某一个时间一定会做某一件事

promise进行异步请求后,会把状态与数据保存起来,因此它的回调可以随时执行

他的callback可以拿到结果后再执行,而普通的事件(不使用Promise时)处理回调需要在执行 之前设置好,也就是说你的callback什么时候执行是不确定的

```
// 传统的异步回调
const data = axios.get({url:'http://www.baidu.com'})
data.trim()
```



```js
let promise = new Promise((reslove,reject)=>{
  //main函数
  setTimeout(() => {
    reslove('我是返回的结果')
  }, 1000); //模拟异步操作
}) 
//promise本体主函数执行完操作会拿到结果并保存起来

那么我要什么时候指定回调函数呢？？
想什么时候都可以，甚至可以加一个10s的定时器再指定毁掉函授
setTimeout(() => {
  promise.then(res=>{
    console.log(res);
  },err=>{
    console.log(err);
  })
}, 5000);
//我是返回的结果
```



### 实现promise的基本功能

```js
// 保存状态常量
const PROMISE_STATUS_PENDING = 'pending';
const PROMISE_STATUS_FULFILLED = 'fulfilled';
const PROMISE_STATUS_REJECTED = 'rejected';

class newPromise {
  // 英文执行器
  constructor(executor) {

    this.status = PROMISE_STATUS_PENDING;

    const resolve = (value) => {
      if (this.status === PROMISE_STATUS_PENDING) {
        this.status = PROMISE_STATUS_FULFILLED;
        this.value = value;
        queueMicrotask(() => {
          this.onFulfilled(this.value);
        })
      };

    };

    const reject = (reason) => {
      if (this.status === PROMISE_STATUS_PENDING) {
        this.status = PROMISE_STATUS_REJECTED;
        this.reason = reason;
        queueMicrotask(() => {
          this.onRejected(this.reason);
        })
      };

    };

    executor(resolve, reject);
  };

  then(onFulfilled, onRejected) {
    this.onFulfilled = onFulfilled;
    this.onRejected = onRejected;
  }


}

// 手写一个promise
// 由此可见,之所以函数里有参数能够让你调用,是因为有人调用了该函数,并且把实参传入了进去
let promise = new newPromise((resolve, reject) => {
  resolve(111);
  reject(222);
})

// 一旦状态改变了,promise就可以调用then方法对返回的值进行处理
// 怎么处理,当然是调用你给传入的函数,也就是你传什么函数,它怎么处理
promise.then(value => {
  console.log(value);
}, reason => {
  console.log(reason);
})
```

### 实现一下Promise.all与Promise.race

all接受一个可迭代元素(Array,Map,Set),all返回一个新的promise对象,可迭代元素中有一个reject的promise,返回它的data,所有的都是resolve的promise,返回一个数组,值为它们的data

```js
Promise.newPromiseAll = (promises)=>{
  return new Promise((resolve,reject)=>{
    const allValues=[];
    promises.forEach(element => {
      element.then(value=>{
        allValues.push(value);
        if(allValues.length===promises.length){
          resolve(allValues);
        }
      },reason=>{
        reject(reason);
      })
    });
  })
}


const promise1 = Promise.resolve(3);
const promise2 = Promise.resolve(5);  // 如果元素是个数字呢?需要进行判断的.
const promise3 = new Promise((resolve, reject) => {
 reject('你完了')
});
Promise.newPromiseAll([promise1,promise2,promise3]).then(value=>{
  console.log(value);
},reason=>{
  console.log(reason);
})
```

race就是竞赛,谁先有返回值就返回对象状态的promise

```js
Promise.myRace=(promises)=>{
  return new Promise((resolve,reject)=>{
    promises.forEach(element => {
      element.then(value=>{
        resolve(value)
      },reason=>{
        reject(reason)
      })
    });
  })
}
```



## 介绍一下async与await,以及实现的原理



## 说一下并发与并行的区别

并行,共同执行,cpu有多个核心,就可以同时进行多个任务,任务在进行过程中互不打扰

并发,一个人做多个任务,且在做这多个任务时反复横跳,切换执行

## 介绍一下var let const

1. 作用域提升 放到全局上下文中 这么做解决了函数的互相调用问题

   ```js
   function test1() {
   	test2()
   }
   function test2() {
   	test1()
   }
   test1()
   ```

2. let没有作用域提升 在ECMA规范中,声明了但访问不到 不会挂载到window上

3. const 不可改变 但如果是引用类型,改变的话其实就是改变引用到的那个变量

## 介绍一下原型与原型链

js万物皆为对象,函数也是对象,对于一个构造函数来讲,它内置了一个prototype属性,该属性指向该构造函数的原型对象,该原型对象被成为显示原型.原型上的属性和方法可以被构造函数所创建出来的对象所继承.

构造函数的原型对象作为一个对象,它也有指向原型的prototype属性,该对象的原型对象被称为该对象的隐式原型.原型对象上也会有一个原型对象,经过这一层又一层的寻找,就形成了原型链.

js中每一个对象都会包含一个内置属性[[prototype]],这个属性指向一个对象,这个对象就是原型对象.当该对象调用某个方法或者属性时,如果对象本身没有,就会向它的原型对象上去寻找.原型对象上也会有一个原型对象,经过这一层又一层的寻找,就形成了原型链.

获取对象的原型有两种方法:`对象.__proto__`或使用`Object.getPrototypeOf`

同时,函数也有一个prototype属性,同上

new操作符,首先创建一个新对象,将新对象的原型指向构造函数的原型对象

原型对象上有一个constructor属性,该属性指向构造函数

## 介绍一下闭包

所谓闭包,通俗的讲就是内部函数可以访问到外部函数的作用域

由于对象内的变量一直被引用，所以这对象不会被垃圾回收机制回收。可以始终保持在内存中。

### 使用闭包解决问题

一下输出什么?

```js
for (var i = 1; i <= 5; i++) {
		setTimeout(function timer() {
		console.log(i)
	}, i * 1000)
}

//5个六,每个间隔1秒
```

解决方案

```
使用立即执行函数,把i作为参数传入进去
for (var i = 1; i <= 5; i++) {
  ; (function (i) {
    setTimeout(function () {
      console.log(i)
    }, i * 1000)
  })(i)
}

除此之外使用let
```

## 实现call apply bind

### bind

相较于call与apply,bind的方法在于return一个函数供调用,在调用的过程中把this改变并删除

```js
function test(hahaha,lalala){
  console.log(this,hahaha,lalala);
}

Function.prototype.newBind=function(thisArg,...args){

  // 这一层是返回函数后调用的参数位置
  let bindFunc=()=>{
    thisArg.fn=this;
    // 这一层是在调用newBind方法时就要传入的参数
    thisArg.fn(...args);
    delete thisArg.fn;
  }
  return bindFunc
}

let res = test.newBind({age:18},'hahaha')
res();
```

## 浅浅写一下cache工具类

```js
class Cache{
  setCache(key,value){
    localStorage.setItem(key,value);
  };

  getCache(key){
    return localStorage.getItem(key);
  }

  removeCache(key){
    localStorage.removeItem(key);
  }
}

let cacheUtil = new Cache();
```

## 深浅拷贝

### 浅拷贝的实现

使用object.assign

```
该方法传入多个参数,一个target对象,多个source对象.用于从一个或多个源对象中把所有可枚举(enumerable)且为自身(hasOwnProperty)的属性复制到目标对象中
```

除此之外,使用展开运算符可以轻松实现浅拷贝

```js
// 这是两种浅拷贝方式
let obj={
  name:''
}

const res = Object.assign({},obj);
const res2={...obj};

console.log(res);
console.log(res2);
```

### 深拷贝

深拷贝最简单的实现就是json,但有很多问题

好一点的方法是使用lodash的深拷贝函数

这里手写一个没有考虑太多边界条件的深拷贝

```js
let obj={
  name:'cheng',
  age:[111,222],
  hahah:{
    wawawa:'111',
    cacaca:[555]
  }
}

function isObject(item){
  return Object.prototype.toString.call(item)==='[object Object]';
}

function deepCopy(obj){
    // 非常经典的递归调用,这里要注意考虑到递归必须要return回去,if的判断写在前面而不是for里面
  if(!isObject(obj)){
    return obj;
  }

  let copyObj = {};
  for(let key in obj){
    copyObj[key] = deepCopy(obj[key]);
  }
  return copyObj
}

const res = deepCopy(obj);
console.log(res);
```



## ==与===的区别

核心点:==进行了类型转换

[]==![] 结果为true

## 构造一个100个0的数组

```
let arr = [];
for (let i = 0; i < 10; i++) {
  arr.push(0);
}
console.log('1', arr);

// fill以指定索引填充数组
// fill不会改变原数组
// 原型上的方法即实例方法是供这个数组实例调用的,而静态方法是让数组对象调用的

console.log(Array(10).fill(0));

// from返回一个传入的可迭代对象或类数组的浅拷贝实例,
// 可传入第二个参数作为每一个参数的回调,其实就是再调用了一次map方法
// 它不会改变原数组
let arr3 = [];
console.log(Array.from({length:10},item=>0));
```

## 如何将一个类数组转换为普通数组

```JS
let likeArray = {length:3};
let trans = Array.from(likeArray);
console.log(trans);

// 同样是遍历输出,使用拓展运算符会报错,因为拓展运算符只能适用于iterable元素
let likeArray = {length:3};
let trans = [...likeArray];
console.log(trans);

// 可以想到的普通做法
// 这里keys与values方法都返回一个数组
// 注意!entries返回的是一个二维数组,且每一个子元素均为数组的键值对;
// let obj={
// 	oneArr:[111,222,333],
// 	twoArr:[444,555,666]
//}
//[ [ 'oneArr', [ 111, 222, 333 ] ], [ 'twoArr', [ 444, 555, 666 ] ] ]
// 
let likeArray = {length:3};
let trans =[];
let key = Object.keys(likeArray)
let value = Object.values(likeArray)

for(let i=0;i<key.length;i++){
  trans.push(key[i]);
}

console.log(trans);

let likeArray = {
  0:0,
  1:1,
  2:2,
  length:3
};

// 使用数组方法可以转化,但如果直接调用会导致找不到相应的方法
const res = Array.prototype.slice.call(likeArray);
console.log(res);

let likeArray = {
  0: 0,
  1: 1,
  2: 2,
  length: 3
};

// 使用数组方法可以转化,但如果直接调用会导致找不到相应的方法
// const res = Array.prototype.slice.call(likeArray);
// console.log(res);

// 然后我这里使用不同的数组API,注意这里的使用特性
// const res = Array.prototype.concat.apply([],likeArray);
// console.log(res);

// 除了数组API,也别忘记了构造函数,其实这也算是API的一部分
const res = Array.apply(null, likeArray);
console.log(res);
```

## 稀疏数组

```js
// 稀疏数组是一个纯纯的空数组,注意不是元素为undefined的数组
// 为空的数组是不能使用map方法的,但元素为undefined是可以使用的
Array(10);
Array(10).map(item=>1); // 这不会改变数组,因为数组还是空的

// 构造100
console.log(Array(10).fill(1));

// 使用from进行迭代的过程中说明其把empty转换成了undefined
// 此时使用map方法是可以的
console.log(Array.from(Array(10),item=>1));
```

## 手写拍平flat

#### 拍平的层数没有解决

ES5

```js
// 使用数组类方法API判断是否为数组
// concat方法不会改变原有数组,而是返回一个新的数组

Array.prototype.flatten=function(number){
  // 我传入number了啊
  console.log(number);
  if(number<=0){
    return
  };
  let res =[];
  for(let i=0;i<this.length;i++){
    if(Array.isArray(this[i])){
      res = res.concat(this[i].flatten());
      console.log(number);
      number--;
    }else{
      res.push(this[i])
    }
  };
  return res;
}

let arr = [111,[222,[333]]];
let res= arr.flatten(1);
console.log(res);

```

ES6

```
// some用于判断数组中是否至少有一个元素通过了提供的函数测试
function flatten(arr) {
  while (arr.some(item => Array.isArray(item))) {
    // 注意这里的解构赋值,111先放进数组里,222,[333]再放进数组里
      arr = [].concat(...arr);
      //此外,这里每一次赋值都直接改变了数组原值,否则就会进入死循环
  }
  return arr;
}

let arr =[111,[222,[333]]];
console.log(flatten(arr));
```

## 防抖节流

防止手抖,如果在限定时间内有一次发送请求,就停止这次请求,重新计时直到设定的时间

```js
  // 防抖最终是一种函数,封装要防抖的东西
    function debounce(fn, wait) {
      let timer;
      
      let _debounce = (...args) => {
          clearTimeout(timer);
          timer = setTimeout(() => {
            fn(...args);
          }, wait)
      }
      // 我们的函数的最终目的就是返回一个防抖函数
      // 让用户在click时运行这个防抖函数
      return _debounce
    }

    let input = document.querySelector('input');

    // debounce是window调用的
    // 调用以后返回的_debounce函数是button调用的
    // 因此_debounce函数可以接收到event事件对象
    input.addEventListener('input', debounce((event) => {
        console.log('发送成功!',event.target.value);
    }, 1000));
```

节省流量,规定时间内只能发送一次请求

核心原理是使用计时来操作

现在的时间减去开始的时间大于间隔时间时进行一次请求,同时注意第一次请求直接发出来

```js
const input = document.querySelector('input')


    function newThrottle(fn, interval) {
      let startTime = 0;
      const _throttle = function () {
        let nowTime = new Date().getTime();
        if ((nowTime - startTime) >= interval) {
          fn();
          startTime = nowTime;
        }
      };
      return _throttle
    }

    let counter=0;
    input.addEventListener('input', newThrottle(() => {
      console.log('循环了'+counter);
      counter++;
    }, 3000))
```
