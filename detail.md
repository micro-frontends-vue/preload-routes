# 基于 Vue 的前端项目集成方案

## DEMO

[vue-simple-micro-frontends](https://github.com/zh-rocco/vue-simple-micro-frontends)

## 目标

1. 子项目支持单独开发，单独部署（避免前端巨无霸，多团队同时开发）
2. 单一的入口 HTML（不同项目之间切换时无白屏现象）
3. 支持多语言开发（JavaScript、TypeScript 等）

## 思路

1. 将子项目打包成库文件，umd 模块
2. 在入口项目中加载子项目
3. 使用 vue-router 的 [`router.addRoutes`](https://github.com/zh-rocco/fe-notes/issues/29) 将子项目的路由动态注册到入口项目中
4. 使用 Vuex 的 [`store.registerModule`](https://github.com/zh-rocco/fe-notes/issues/31) 将子项目的 store module 动态注册到入口项目中

## 具体实现

### 一、初始化项目

```bash
# 安装 Vue CLI 3
yarn global add @vue/cli

mkdir projects
cd ./projects

vue create entry-app
vue create sub-app-one
```

### 二、入口项目 (entry-app)

#### 1. 提取公共依赖

```javascript
// vue.config.js
module.exports = {
  configureWebpack: {
    externals: {
      vue: 'Vue',
      vuex: 'Vuex',
      'vue-router': 'VueRouter',
      'element-ui': 'ELEMENT',
      moment: 'moment',
    },
  },
};
```

#### 2. 手动引入外部依赖

```html
<!-- index.html -->
<head>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.3.9/theme-chalk/index.css" rel="stylesheet">
</head>

<body>
  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.16/vue.min.js"></script>
  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/vuex/3.0.1/vuex.min.js"></script>
  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/vue-router/3.0.1/vue-router.min.js"></script>
  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.4.0/index.js"></script>
  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.1/moment.min.js"></script>
</body>
```

#### 3. 挂载 router / store 实例

在子项目中用到了这两个实例

```javascript
// main.js
window.microApp = {};
```

```javascript
// store.js
const store = new Vuex.Store({
  state: { name: 'entry-app' },
  mutations: {},
  actions: {},
});

window.microApp.store = store;
```

```javascript
// router.js
const router = new Router({ routes });

window.microApp.router = router;
```

#### 4. 加载子项目

```javascript
// load-module.js
export default function loadModule(url, options = {}) {
  if (!url || typeof url !== 'string') {
    return Promise.reject('Illegal parameter: url, expect a not empty string.');
  }

  if (typeof options !== 'object') {
    return Promise.reject('Illegal parameter: options, expect an object.');
  }

  const noCache = !!options.noCache;

  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.onload = ({ type }) => resolve({ type, url });
    script.onerror = ({ type }) => resolve({ type, url });
    script.src = noCache ? addTimestamp(url) : url;
    document.body.appendChild(script);
  });
}

function addTimestamp(url) {
  return url.indexOf('?') > -1 ? `${url}&t=${Date.now()}` : `${url}?t=${Date.now()}`;
}
```

```javascript
// main.js
import loadModule, { remove } from 'path/to/load-module.js';

const modules = [
  'http://localhost:7200/sub-app-one/dist/sub-app-one.umd.min.js',
  'http://localhost:7200/sub-app-two/dist/sub-app-two.umd.min.js',
];

Promise.all(modules.map((url) => loadModule(url))).then((res) => {
  console.log(res);
  remove();
});
```

### 三、子项目 (sub-app-one)

#### 1. 修改 build script

package.json

```json
{
  "scripts": {
    "build": "vue-cli-service build --target lib --name sub-app-one ./src/module.js"
  }
}
```

这样可以将 sub-app-one 构建成一个库，然后在 entry-app 中引用，[参考](https://cli.vuejs.org/zh/guide/build-targets.html#%E5%BA%93)

#### 2. 提取公共依赖

```javascript
// vue.config.js
const webpack = require('webpack');

const APP_NAME = require('./package.json').name;
const IS_DEV = process.env.NODE_ENV === 'development';

module.exports = {
  configureWebpack: {
    externals: IS_DEV
      ? {}
      : {
          vue: 'Vue',
          vuex: 'Vuex',
          'vue-router': 'VueRouter',
          'element-ui': 'ELEMENT',
          moment: 'moment',
        },

    plugins: [
      new webpack.DefinePlugin({
        'process.env.VUE_APP_NAME': JSON.stringify(APP_NAME),
      }),
    ],
  },
};
```

开发时使用 node_modules 文件，构建后使用外部依赖

#### 3. 动态注册路由

为子项目路由添加命名空间

```javascript
// router-list.js
const IS_DEV = process.env.NODE_ENV === 'development';
const APP_NAME = process.env.VUE_APP_NAME;

export default [
  {
    path: IS_DEV ? '/' : `/${APP_NAME}`,
    name: APP_NAME,
    title: APP_NAME,
    redirect: { name: `${APP_NAME}.page-a` },
    component: () => import(/* webpackChunkName: "index" */ '@/views/Index.vue'),
    children: [
      {
        path: 'page-a',
        name: `${APP_NAME}.page-a`,
        component: () => import(/* webpackChunkName: "page-a" */ '@/views/PageA.vue'),
      },
      {
        path: 'page-b',
        name: `${APP_NAME}.page-b`,
        component: () => import(/* webpackChunkName: "page-b" */ '@/views/PageB.vue'),
      },
    ],
  },
];
```

注册路由

```javascript
// module.js
import routes from 'path/to/router-list.js';

const routerInstance = window.microApp.router; // 后面有解释
routerInstance.addRoutes(routes);
```

#### 4. 动态注册 Vuex module

提取 Vuex module，添加命名空间

```javascript
// store-module.js
export default {
  namespaced: true, // namespaced must be true in module app.
  state: { name: process.env.VUE_APP_NAME },
  mutations: {},
  actions: {},
};
```

注册 Vuex module

```javascript
// module.js
import store from 'path/to/store-module.js';

const storeInstance = window.microApp.store; // 后面有解释
const moduleName = process.env.VUE_APP_NAME;
storeInstance.registerModule(moduleName, store);
```

#### 5. 自动添加 CSS 命名空间

1. 添加插件

```bash
yarn add postcss-selector-namespace -D
```

2. 使用插件

```javascript
// postcss.config.js
const APP_NAME = require('./package.json').name;

module.exports = {
  plugins: {
    autoprefixer: {},
    'postcss-selector-namespace': { namespace: `.${APP_NAME}` },
  },
};
```

3. 入口 \*.vue 内添加 namespace className

```vue
<template>
  <div class="sub-app-wrapper sub-app-one"></div>
</template>
```

## Nginx 配置

修改 nginx.conf

nginx.conf 默认路径：`/usr/local/etc/nginx/nginx.conf`

```nginx
http {
    # ...

    server {
        listen       5080;
        server_name  localhost;
        client_max_body_size    600m;

        location /api {
            proxy_pass  custom_path/to/api;
            proxy_set_header  X-Real-IP $remote_addr;
            proxy_set_header  Host $host;
            proxy_set_header  X-Forwarded-For $proxy_add_x_forwarded_for;
        }
        location /sub-app-one {
            proxy_pass  custom_path/to/sub-app-one;
            proxy_set_header  X-Real-IP $remote_addr;
            proxy_set_header  Host $host;
            proxy_set_header  X-Forwarded-For $proxy_add_x_forwarded_for;
        }
        location /sub-app-two {
            proxy_pass  custom_path/to/sub-app-two;
            proxy_set_header  X-Real-IP $remote_addr;
            proxy_set_header  Host $host;
            proxy_set_header  X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }

    # ...
}
```

## 不足 & 待解决的问题

1. 开发环境复杂，子项目开发时依赖 Nginx 转发
2. 子项目开发模式下无法加载公共导航模块

## OA 具体实践

### meeting 项目修改

1. build 脚本及入口文件修改
2. 提取公共依赖
3. 移除无用的功能
   - 顶部导航
   - logout
4. 修改路由表（namespace、path、name 等）
5. 移除无用样式
6. iconfont 修改
   - 重新生成图标字体文件，只包含 meeting-app 需要的图标
   - iconfont 增加 namespace
   - 替换目前系统用到的图标字体
7. 涉及使用 username、user_id、department_id 的地方，修改成从 localStorage 中读取

### flow 项目拆分

从 flow 中分离出基础功能和模块

目前 flow 项目使用 Vue CLI 2 开发，此次顺便升级到 Vue CLI 3

#### entry-app

1. 登录页面
2. 顶部导航
3. 提取公共依赖，index.html 内手动引入公共依赖
4. 打包基础 iconfont
5. 全局事件总线（Event Bus），挂载到 Vue.prototype 上 ?
6. 将 username、user_id、department_id 等信息存储到 localStorage
7. 手动引入子项目的入口 JS

#### flow-app

1. flow 项目的剩余部分
2. 参考 meeting 项目修改

### 特别注意

1. 在代码中使用 process.env.VUE_APP_NAME 即可获取到当前项目的 namespace
2. 使用本地存储时记得添加 namespace
3. 使用全局 Event Bus 时记得添加 namespace
4. 子项目销毁时，记得
   - 移除该项目监听的全局 Event Bus ?
   - 移除全局事件监听
   - 重置 Vuex store ?

## 杂项

### 参考

- [微前端的那些事儿](https://github.com/phodal/microfrontends)
- [用微前端的方式搭建类单页应用](https://tech.meituan.com/fe_tiny_spa.html)
- [微前端 - 将微服务理念延伸到前端开发中](http://zzfe.org/#/detail/59dc6e1f91d3e35ba880fd0d)
- [Micro Frontends](https://micro-frontends.org/) ([Github](https://github.com/neuland/micro-frontends))
- [微前端 - 将微服务理念扩展到前端开发（实战篇）](http://insights.thoughtworkers.org/micro-frontends-2/)
- [Medium: micro frontends](https://medium.com/search?q=micro%20frontends)
- [single-spa: 在一个页面将多个不同的框架整合](https://github.com/CanopyTax/single-spa)
- [Ueact: 渐进式，多调和策略，多渲染终端的乐高式微前端框架，以及可复用的多框架碎片化组件](https://github.com/wxyyxc1992/Ueact)
- [Web Components](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components)
- [微前端: Alili](https://alili.tech/tags/%E5%BE%AE%E5%89%8D%E7%AB%AF/)

### Web Components

#### 技术组成

- Custom elements，允许开发者创建自定义的元素
- Shadow DOM，即影子 DOM，通常是将 Shadow DOM 附加到主文档 DOM 中，并可以控制其关联的功能。而这个 Shadow DOM 则是不能直接用其它主文档 DOM 来控制的
- HTML templates，即 `<template>` 和 `<slot>` 元素，用于编写不在页面中显示的标记模板
- HTML Imports，用于引入自定义组件

#### 缺点

- 上下游生态不完善
- 系统架构复杂，组件通信问题
- 兼容性差

#### 工具

- [vue-web-component-wrapper](https://github.com/vuejs/vue-web-component-wrapper)
- [stencil](https://github.com/ionic-team/stencil)
