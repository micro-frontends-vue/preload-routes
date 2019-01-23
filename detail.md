# 基于 Vue 的前端项目集成方案（v1）

## Repository

[vue-simple-micro-frontends](https://github.com/zh-rocco/vue-simple-micro-frontends)

[Online demo](https://zh-rocco.github.io/vue-simple-micro-frontends/)

## 目标

1. 子项目支持单独开发，单独部署（避免前端巨无霸，多团队同时开发）
2. 单一的入口 HTML（不同项目之间切换时无白屏现象）
3. 支持多语言开发（JavaScript、TypeScript 等）\*

## 思路

1. 将 sub-app(子项目) 打包成库文件，umd 模块
2. 在 entry-app(入口项目) 中加载 sub-app
3. 使用 vue-router 的 [`router.addRoutes`](https://github.com/zh-rocco/fe-notes/issues/29) 将 sub-app 的路由动态注册到 entry-app 中
4. 使用 Vuex 的 [`store.registerModule`](https://github.com/zh-rocco/fe-notes/issues/31) 将 sub-app 的 `store module` 动态注册到 entry-app 中

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

### 二、entry-app

#### 1. 配置 `vue.config.js`

`vue.config.js`

```javascript
const webpack = require('webpack');
const APP_NAME = require('./package.json').name;
const PORT = require('./package.json').devPort;
const PROXY = require('./config/proxy');

const NODE_ENV = process.env.NODE_ENV || 'development';

log('APP_NAME: ', APP_NAME);
log('NODE_ENV: ', NODE_ENV);

module.exports = {
  baseUrl: './',
  productionSourceMap: false,
  configureWebpack: {
    externals: {
      lodash: '_',
      moment: 'moment',
      vue: 'Vue',
      vuex: 'Vuex',
      'vue-router': 'VueRouter',
      'element-ui': 'ELEMENT',
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.VUE_APP_NAME': JSON.stringify(APP_NAME),
      }),
    ],
  },
  devServer: {
    port: PORT,
    proxy: PROXY,
  },
};

function log(label, content, options) {
  console.log('\x1b[1m%s\x1b[31m%s\x1b[0m', label, content);
}
```

#### 2. 手动引入外部依赖

`public/index.html`

```html
<head>
  <link
    href="https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.3.9/theme-chalk/index.css"
    rel="stylesheet"
  />
</head>

<body>
  <script
    type="text/javascript"
    src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.16/vue.min.js"
  ></script>
  <script
    type="text/javascript"
    src="https://cdnjs.cloudflare.com/ajax/libs/vuex/3.0.1/vuex.min.js"
  ></script>
  <script
    type="text/javascript"
    src="https://cdnjs.cloudflare.com/ajax/libs/vue-router/3.0.1/vue-router.min.js"
  ></script>
  <script
    type="text/javascript"
    src="https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.4.0/index.js"
  ></script>
  <script
    type="text/javascript"
    src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.1/moment.min.js"
  ></script>
</body>
```

#### 3. 配置开发代理

`config/proxy.js`

```javascript
module.exports = {
  '/sub-app-one/': {
    target: 'http://localhost:7310/', // 指向 sub-app-one 开发服务
  },
  '/sub-app-two/': {
    target: 'http://localhost:7320/', // 指向 sub-app-two 开发服务
  },
};
```

#### 4. 挂载 router / store 实例

`src/loader-mixin.js`

```javascript
import { CreateLoaderMixin } from 'vue-module-register';
import store from '@/store';
import router from '@/router';

// 打包后的 sub-app 路径
const modules = [
  { name: 'sub-app-one', url: '/sub-app-one/main.js' },
  { name: 'sub-app-two', url: '/sub-app-two/main.js' },
  // more...
];

export default new CreateLoaderMixin({
  modules,
  store,
  router,
  cache: false,
});
```

#### 5. 异步加载子项目

`src/App.vue`

```javascript
import loaderMixin from '@/loader-mixin';

export default {
  name: 'EntryApp',
  mixins: [loaderMixin],
};
```

### 三、sub-app

#### 1. 修改 build script

`package.json`

```json
{
  "scripts": {
    "build": "vue-cli-service build --target lib --formats umd-min --name sub-app-one ./src/module.js"
  }
}
```

这样可以将 sub-app-one 构建成一个库，然后在 entry-app 中引用，[参考](https://cli.vuejs.org/zh/guide/build-targets.html#%E5%BA%93)

#### 2. 配置 `vue.config.js`

```javascript
const webpack = require('webpack');
const APP_NAME = require('./package.json').name;
const PORT = require('./package.json').devPort;
const patchCliService = require('./scripts/patch-cli-service');

patchCliService();

const NODE_ENV = process.env.NODE_ENV || 'development';

log('APP_NAME: ', APP_NAME);
log('NODE_ENV: ', NODE_ENV);

module.exports = {
  baseUrl: `/${APP_NAME}/`,
  css: { extract: false },
  productionSourceMap: false,
  configureWebpack: {
    externals: {
      lodash: '_',
      moment: 'moment',
      vue: 'Vue',
      vuex: 'Vuex',
      'vue-router': 'VueRouter',
      'element-ui': 'ELEMENT',
    },
    entry: './src/module.js',
    output: {
      libraryExport: 'default',
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.VUE_APP_NAME': JSON.stringify(APP_NAME),
      }),
    ],
  },
  devServer: {
    port: PORT,
  },
};

function log(label, content, options) {
  console.log('\x1b[1m%s\x1b[31m%s\x1b[0m', label, content);
}
```

#### 3. 动态注册路由 / Vuex module

`src/module.js`

```javascript
import { CreateRegister } from 'vue-module-register';
import store from '@/store/store-module';
import routes from '@/router/router-list';

const register = new CreateRegister({
  name: process.env.VUE_APP_NAME,
});

register.registerModule(store).addRoutes(routes);
```

#### 4. 自动添加 CSS 命名空间（可选）

1. 添加插件

```bash
yarn add postcss-selector-namespace -D
```

2. 使用插件

`postcss.config.js`

```javascript
const APP_NAME = require('./package.json').name;

module.exports = {
  plugins: {
    autoprefixer: {},
    'postcss-selector-namespace': { namespace: `.${APP_NAME}` },
  },
};
```

3. 入口 \*.vue 内添加 namespace className: `sub-app-one`

```vue
<template>
  <div class="sub-app-wrapper sub-app-one"></div>
</template>
```

### 注意事项

#### ~~1. 为异步加载的模块提供唯一的 `webpackChunkName`~~

例如:

`router-list.js`

```javascript
{
  "path": "page-a",
  "name": `${APP_NAME}.page-a`,
  "component": () => import(/* webpackChunkName: "app-one" */ "@/views/PageA.vue")
}
```

原因:

默认情况下 `webpackChunkName` 为递增的数字，开发模式下会将 sub-app 的服务转发至 entry-app，此时会出现 chunk 重名的问题，导致资源加载失败。

**此问题已解决，解决办法如下：**

`sub-app` 下安装插件 [modify-chunk-id-webpack-plugin](https://github.com/zh-rocco/modify-chunk-id-webpack-plugin)

```bash
yarn add modify-chunk-id-webpack-plugin -D
```

`vue.config.js`

```javascript
const ModifyChunkIdPlugin = require('modify-chunk-id-webpack-plugin');

module.exports = {
  configureWebpack: {
    plugins: [
      new ModifyChunkIdPlugin({ random: process.env.NODE_ENV === 'development' }),
      // other plugins
    ],
  },
};
```

## 不足 & 待解决的问题

#### 1. 鉴权问题

由于 sub-app 的路由是异步加载 / 注册的，导致 sub-app 无法使用 `meta` 判断路由是否需要鉴权

**优化方向: 在 entry-app 实例化之前加载 sub-app 的路由**

#### 2. sub-app 缓存问题

sub-app 构建结果的入口文件是 `main.js`，然后使用 `vue-module-register` 的 `loaderMixin` 方法异步加载，为了防缓存会在加载 `main.js` 时添加时间戳。此操作会导致 sub-app 的入口文件无法缓存，每次都需要向服务端请求。

一种解决思路：entry-app 里加载子项目时手动添加版本号，缺点是升级 sub-app 的时候需要升级 entry-app

`src/loader-mixin.js`

```javascript
const VERSION = require('../../package.json').version;
const modules = [
  { name: 'sub-app-one', url: `/sub-app-one/main.js?version=${VERSION}` },
  { name: 'sub-app-two', url: `/sub-app-two/main.js?version=${VERSION}` },
  // more...
];

// CreateLoaderMixin options 里关闭 cache
export default new CreateLoaderMixin({
  store,
  router,
  modules,
  cache: false,
});
```

另一种解决思路：额外加载一个 sub-app 的 version map 文件，每次构建 sub-app 时自动维护此 map

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
