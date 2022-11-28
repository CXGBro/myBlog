---
layout: doc
---
# Vue



## 为什么vue的data属性是一个函数,而不是一个对象

js中对象是一种引用类型,组件是需要复用的,我们希望组件的data属性中的数据是独立的,也就是组件的每一次复用,data都是独立存在的.如果直接使用对象类型,一个组件的data数据改变就会导致其它所有的组件数据都改变

## vue组件通信的方式

1. 父子组件

   1. 使用props $emit

   2. html标签属性是不区分大小写的,也就是在html中使用驼峰法没有意义,可以使用连字符`xxx-yyy`

   3. 父组件传给子组件的props如果子组件没有接收,这种props叫做非props的属性,这些属性会直接添加到子组件的根节点

   4. 使用**$attrs**获取到这些非props的atrribute,在任何地方都可以使用

      ```vue
      Child
      <template>
        <div>
          <div>111</div>
          <div>{{$attrs.test}}</div>  // 111
        </div>
      </template>
      
      Parent
      <template>
        <div>
          <Child test="111"></Child>
        </div>
      </template>
      ```

   5. $emits在vue3中的实例

      ```vue
      Parent
      <template>
        <div>
          <div>计数器:{{count}}</div>
            // 子传父用的是自定义事件,因此这里使用了@
            // add是自定义的事件名称,add是自定义触发时触发的那个方法
            // 子组件拿到的是父组件的自定义的事件名称
          <Child test="111" @add="add" @minus="minus"></Child>
        </div>
      </template>
      <script>
      import {ref} from 'vue'
      
      import Child from './Child.vue'
      export default {
        components:{
          Child
        },
        setup(){
          let count = ref(0)
          // ref的结果是要.value的
          const add=(num)=>{
            count.value+=num
          }
          const minus=(num)=>{
            count.value-=num
          }
          return {
            count,
            add,
            minus
          }
        }
      }
      </script>
      
      Child
      <template>
        <div>
          <div>111</div>
          <div>{{$attrs.test}}</div>
          <button @click="add"> add one</button>
          <button @click="minus">minus one</button>
        </div>
      </template>
      
      <script>
      export default {
          // vue3中声明自定义事件,可以写的更加漂亮
        emits:["add","minus"],
        setup(props,{emit}){
          const add=()=>{
            console.log("chufa");
            emit('add',2)
          }
          const minus=()=>{
            emit('minus',2)
          }
          return {
            add,
            minus
          }
        }
      }
      </script>
      ```

2. 非父子组件

   1. provide与inject

      直接定义并接收使用即可

      ```vue
      provide
      <template>
        <div>
          <Child></Child>
        </div>
      </template>
      <script>
      import {computed} from 'vue'
      
      import Child from './Child.vue'
      export default {
        components:{
          Child
        },
        data(){
          return {
            la:'lalal'
          }
        },
          // 为了使用this获取到data,provide使用了函数式的写法.
        provide(){
          return {
            name:'xxx',
            age:18,
              // 为了让这里的this.la成为响应式的数据,这里引入了computed计算函数来实现响应式
            la:computed(()=>{
              return this.la
            })
          }
        }
      }
      
      inject
      <template>
        <div>
          <div>{{name}}</div>
          <div>{{age}}</div>
          <div>{{la.value}}</div>
        </div>
      </template>
      
      <script>
      export default {
          // 在vue3中可以使用provide与inject函数来通信
        inject:['name','age','la']
      }
      </script>
      ```

   2. 全局事件总线

      vue3中事件总线被第三方库代替

      emit /ɪˈmɪt/ 发射,发送

      on 当...时候

      ```
      eventBus.emit('事件名称',...事件参数)  //要去触发那个事件
      eventBus.on('事件名称')	//一直监听者某个事件是否被触发
      ```

      

## vue2与vue3的区别

ref一定要带上value,一定要带上value

1. 响应式的原理发生改变(两种啊方式对比?)
2. 组件是否支持根元素(是否有fragment的支持)
3. 由选项式API切换为了组合式API 增加可读性与复用性,写起来更加灵活,缺点是相对比较起来难以上手
4. 添加teleport(远距离传送) 与 suspense组件的支持
5. 更好的tree-shaking的支持,原本大量属性绑定在vue实例上,现在全部通过export的方式使用.没有export的方法不会被打包
6. 更好的ts支持
7. 其它源码 层面的更新:更好的diff算法等 

## methods

methods中的函数指定箭头函数时绑定window

## 路由懒加载

components属性可以接受一个函数,该函数返回一个promise来实现路由的懒加载

懒加载可以使当切换到路由映射的路径后才进行加载相应的组件.(本质是利用webpack的分包功能进行分包处理)

## 介绍一下vue的生命周期

在vue3中,没有beforeCreate与created,这一部分的代码直接在setup函数中使用就可以

生命周期把组件的一生从创建到销毁分为了不同的阶段,在不同的创建阶段调用不同的生命周期函数,以便于用户在不同的生命周期阶段注入代码

相比与vue2 vue3改名了最后一个生命周期:beforeunmount unmount

1. beforeCreate

2. 初始化组件实例,但选项对象还没有创建

3. created:这里可以拿到所有写好的数据了 如data,computed,methods等,在这里往往发送网络请求,监听数据($watch)

4. 进行template模板编译

5. beforeMount: 经过编译阶段,将template编译为render函数,此时还没有形成真实DOM

6. 虚拟DOM->真实DOM->DOM挂载

7. mounted: DOM已经渲染完毕,此时可以使用DOM

   1. 如果有数据更新
   2. beforeupdate: 在数据更新以后,DOM被更新之前调用
   3. 根据最新的数据生成新的vnode,然后通过diff算法更新vnode,之后更新真实DOM
   4. updated:在数据更改导致的DOM重新渲染完毕后调用

8. 使用v-if=false等方法导致组件不在进行渲染

9. beforeunmount

10. 将组件vnode从虚拟DOM中移出

11. unmounted(回收操作,如取消事件监听)

    Update写程序可能导致死循环,数据更改->调用updated->又导致数据更改...

keepalive这样的缓存组件是没有create,mount的周期的,要想监听到何时激活该组件

1. activated:激活keepalive组件时触发
2. deactivated:停用keepalive组件时触发

3. beforeDestory
4. 卸载各种各样的实例,方法,指令
5. destoryed

### 有父子关系嵌套时的生命周期:

父亲要想要成功渲染,就需要子组件的成功渲染,因此父亲至少要到达的阶段是beforemount,要渲染还没有渲染的阶段

加载渲染过程

- **父**beforeCreate
- **父**created
- **父**beforeMount
- **子**beforeCreate
- **子**created
- **子**beforeMount
- **子**mounted
- **父**mounted

销毁过程

- **父**beforeDestroy
- **子**beforeDestroy
- **子**destroyed
- **父**destroyed



## 讲一下自定义指令

全局app.directives

## vue2与vue3的响应式原理

何为响应式:即为一个数据的变化,能让网页自动重新渲染并且体现出数据的更新

即数据的改变引起函数的重新执行.哪些函数重新执行?使用到/与那些改变数据有关的函数重新执行

要想知道哪些数据有过更改,就要使用数据劫持

##### 如何监听对象中的属性是否被修改

Object.defineProperty

new Proxy

```js
// 是否是一个响应式函数用一个数组来存放,

const { get } = require("lodash");

// 当响应式数据发生改变时,分别调用数组中的每一个元素
class Depend{
  constructor(){
    this.reactiveFns=[];
  };
  appendFns(fn){
    if(fn){
      this.reactiveFns.push(fn);
    }
    // 添加响应式函数后就执行一次以便于看看初次响应式函数执行的内容
  };
  notify(){
    this.reactiveFns.forEach(value=>{
      value();
    });
  };
};

let obj={
  name:'cheng',
  age:18
};

// 这个对象专门作为这个属性的响应式函数的中心管理工具
let depend = new Depend();
function watchFn(fn){
  depend.appendFns(fn);
  fn();
}

Object.keys(obj).forEach(key=>{
  let value = obj[key];
  Object.defineProperty(obj,key,{
    // 注意这里的set方法只能接收到newValue,没有oldValue哦
    set(newValue){
      value = newValue;
      depend.notify();
    },
    // 没有get方法属性是拿不到的,只能返回undefined
    get(){
      return value;
    }
  })
})

watchFn(function render(){
  // name = name*2;
  console.log(obj.name);
});
watchFn(function render2(){
  console.log('hahahha');
});

// 一旦这个属性发生变化,就调用所有的响应式函数
obj.name="hahah";
```



object.defineProperty是对对象本身的属性进行修改的监听,而proxy通过new一个新的对象,监听新的对象的属性更新

为什么vue3使用proxy?

```js
let newObj = new Proxy(obj, {
      // proxy的target对象就是proxy函数的第一个参数对象
      set(target, key, value, receiver) {
        console.log(target, key, value, receiver);
      },
      // 
      get(target, key, receiver) {
        console.log(target, key, receiver);
      }
    })
```

proxy可以直接监听整个对象,而不是对对象的属性分别进行监听.proxy监听方式是新new出来的对象.proxy多了许多各种拦截方法是defineProperty所不具备的.

## hash路由与history路由

hash路由是利用浏览器地址栏中的hash值的改变来引起页面组件的改变,缺点是会产生一个#,改变hash路由使用window.location.hash

history路由,利用html5中所给的history对象及暴露的API,然后监听location.hash属性是否发生改变

## v-if与v-show的区别

v-show编译DOM代码,只是不会渲染,因为vue为其设置了display:none的属性

v-if直接就没有编译代码,在DOM树上找不到这个元素

## 原理系列

### diff

对比新旧的虚拟DOM,精准的找出差别,并更新对应的真实DOM

1. diff算法只会进行同层对比,(同层对比指的是父节点下的子节点之间的对比.层次深度相同,但不是一个父节点的情况下不会进行同层对比)

流程:

 1. 数据发生改变时,触发数据监听方法中的setter,调用Dep.notify去通知所有的订阅者 watcher,watcher调用patch方法给节点打补丁,也就是进行diff算法

 2. patch方法对比两个节点是否是同一类型的标签(调用sameVnode方法判断),如果是,调用patchVnode进行精细化的比较;如果不是,直接添加用新Vnode生成的DOM进入父节点下,然后删除老节点

    > 所谓同一类型标签,最简单的理解是同一key与同一标签名

 3. patchVnode:

    1. 判断两个节点是否为同一个节点,是直接return
       	2. 不是,两个节点是否都有文本节点,如果有,将el的文本节点设置为newvnode的文本节点
       	3. 如果oldvn有子节点,新节点没有子节点,直接删除el中的旧的节点
       	4. 如果旧节点没有子节点,新节点有子节点.将新节点转为真实DOM后添加到el节点上
       	5. 如果两者都有子节点,使用updateChildren方法对比子节点

4. updateChildren

   1. 分别在新旧节点添加两个首位指针 oldS oldE newS newE

   2. 依次对比 oldS-newS oldS-newE oldE-newS oldE-newE

   3. 如果存在相同的节点,直接将真实DOM中的节点移动到与newNode中相同节点的对齐位置,然后如果是S--,E++

      ![截屏2021-08-08 下午3.26.25.png](C:\Users\CXG\Desktop\Go\笔记\前端\面试题.assets\d7698f560bb44107911585580c241a99tplv-k3u1fbpfcp-zoom-in-crop-mark4536000.webp)

### 为什么不推荐使用index作为key

原节点:a b c

新节点:xxx a b c 

在diff算法的过程中,首先进行首部节点的对比,这里两个首部节点被认为是同一类型的节点,且两者的文字节点不同,这里直接使用了新节点的文字节点,c节点由于key是4,被当成了全新的节点添加进入DOM,这最终导致整个子节点全部更新,而不是简单的插入xxx节点

因此,我们需要item.id这种独一无二的key,而不是简单的数字作为key

vue的核心系统可以分为三个系统,编译系统,渲染系统,响应式系统.

1. 编译:template语法经过词法分析,语法分析转换成抽象语法树,放入renderer函数中.
2. 渲染:利用h函数生成虚拟DOM,利用mount函数将虚拟DOM转换为真实的DOM,每一次数据数据更新时都进行一次diff算法

```js
// 生成vnode
function h(tag, properties, children) {
  return {
    tag,
    properties,
    children
  }
}

// vnode上树
function mount(vnode, container) {
  const el = vnode.el = document.createElement(vnode.tag)

  // 处理props
  if (vnode.properties) {
    for (const key in vnode.properties) {
      let value = vnode.properties[key]
      if(key.startsWith('on')){
        // 对于事件属性,使用addEventListener来监听
        el.addEventListener(key.slice(2).toLowerCase(),value)
      }else{
        el.setAttribute(key,value)
      }
    }
  }

  // 处理真实DOM的child
  if(vnode.children){
    if(typeof vnode.children==='string'){
      el.textContent=vnode.children
    }else{
      vnode.children.forEach(element => {
        mount(element,el)
      });
    }
  }

  container.appendChild(el)

}
```


