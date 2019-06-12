# 预加载子项目入口文件

## 思路

1. 将子项目打包 UMD 模块，[教程](https://cli.vuejs.org/zh/guide/build-targets.html#库)
2. 在主项目中预先（主项目实例化 Vue 之前）挂载子项目的 routes
3. 合并主项目和子项目的路由表
4. 实例化主项目 Vue

## 具体实现

### 一、主项目（app-entry）

#### 1. 配置 `vue.config.js`

`app-entry/vue.config.js`

```js
const webpack = require('webpack');
const APP_NAME = require('./package.json').name;
const PORT = require('./package.json').devPort; // 开发模式下项目的启动端口
const PROXY = require('./config/proxy'); // 开发模式下的 proxy 配置

module.exports = {
  baseUrl: './',
  configureWebpack: {
    // 提取公共依赖
    externals: {
      vue: 'Vue',
      'element-ui': 'ELEMENT',
    },
    plugins: [
      // 定义全局变量
      new webpack.DefinePlugin({
        'process.env.VUE_APP_NAME': JSON.stringify(APP_NAME),
      }),
      new InsertScriptPlugin({ files: modules }), // 自动添加子项目入口文件至 index.html
    ],
  },
  devServer: {
    port: PORT,
    proxy: PROXY,
  },
};
```

`app-entry/scripts/InsertScriptWebpackPlugin.js`

```js
class InsertScriptWebpackPlugin {
  constructor(options = {}) {
    const { files = [] } = options;
    this.files = files;
  }

  apply(compiler) {
    const self = this;
    compiler.hooks.compilation.tap(
      'InsertScriptWebpackPlugin',
      (compilation) => {
        if (compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing) {
          compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tap(
            'InsertScriptWebpackPlugin',
            (htmlPluginData) => {
              const {
                assets: { js },
              } = htmlPluginData;
              js.unshift(...self.files); // 优先加载 files 文件
            },
          );
        } else {
          console.log('\n');
          console.log(
            '\x1b[41m%s\x1b[0m',
            'Error:',
            '`insert-script-webpack-plugin` dependent on `html-webpack-plugin`',
          );
        }
      },
    );
  }
}

module.exports = InsertScriptWebpackPlugin;
```

#### 2. 手动引入外部依赖

`app-entry/public/index.html`

```html
<head>
  <link href="path/to/element-ui/index.css" rel="stylesheet" />
</head>

<body>
  <script src="path/to/vue.min.js"></script>
  <script src="path/to/element-ui/index.js"></script>
</body>
```

#### 3. 配置开发代理

`app-entry/config/proxy.js`

```js
module.exports = {
  '/app-typescript/': {
    target: 'http://localhost:10241/', // 指向 app-typescript 开发服务
  },
  'app-javascript/': {
    target: 'http://localhost:10242/', // 指向 app-javascript 开发服务
  },
};
```

#### 4. 将主项目的 store 实例挂载到 `Vue['__share_pool__']` 上

`app-entry/src/main.js`

```js
import store from './store'; // store 实例

// 挂载主项目的 store 和 router 实例
Reflect.defineProperty(Vue, '__share_pool__', {
  value: {
    store,
  },
});
```

#### 5. 合并主项目 / 子项目的 routes

```js
import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

// 获取子项目的 route-list
const routes = Vue.__share_pool__.routes;

export default new Router({
  routes: Object.values(routes).reduce((acc, prev) => acc.concat(prev), [
    {
      path: '/',
      redirect: '/app-typescript',
    },
  ]),
});
```

### 二、子项目（app-javascript）

以 app-javascript 为例

#### 1. 添加 mfv-cli-service 依赖

```bash
yarn add mfv-cli-service -D
```

#### 2. 修改 build script

`app-javascript/package.json`

```json
{
  "scripts": {
    "build": "mfv-cli-service build --report --target lib --formats umd-min ./src/main.js"
  }
}
```

这样可以将 app-javascript 构建成一个 UMD 文件，然后在 app-entry 中引用，[参考](https://cli.vuejs.org/zh/guide/build-targets.html#库)

#### 3. 配置 `vue.config.js`

`app-javascript/vue.config.js`

```js
const webpack = require('webpack');
const APP_NAME = require('./package.json').name;
const PORT = require('./package.json').devPort; // 开发模式下项目的启动端口

module.exports = {
  publicPath: `/${APP_NAME}/`, // 必须为绝对路径；配合 app-entry 中的 proxy 配置，配合生产环境下的 Nginx 配置
  configureWebpack: {
    // 提取公共依赖
    externals: {
      vue: 'Vue',
      'element-ui': 'ELEMENT',
    },
    entry: './src/main.js',
    output: {
      libraryExport: 'default', // https://cli.vuejs.org/zh/guide/build-targets.html#应用
      jsonpFunction: `webpackJsonp-${APP_NAME}`, // 解决默认情况下子项目 chunkname 冲突的问题
    },
    plugins: [
      // 定义全局变量，项目中会使用
      new webpack.DefinePlugin({
        'process.env.VUE_APP_NAME': JSON.stringify(APP_NAME),
      }),
    ],
  },

  devServer: {
    port: PORT,
  },
};
```

#### 4. 修改入口文件，挂载 routes

`app-javascript/src/main.js`

```js
import Vue from 'vue';
import routes from './routes';

const sharePool = (Vue.__share_pool__ = Vue.__share_pool__ || {});
const routesPool = (sharePool.routes = sharePool.routes || {});

// 挂载子项目的 routes
routesPool[process.env.VUE_APP_NAME] = routes;
```

`app-javascript/src/routes.js`

```js
/* routes-list */

const APP_NAME = process.env.VUE_APP_NAME;

const App = () => import('./App.vue');
const Home = () => import('./views/Home.vue');
const About = () => import('./views/About.vue');

export default [
  {
    path: `/${APP_NAME}`,
    name: APP_NAME,
    redirect: { name: `${APP_NAME}.home` },
    component: App,
    children: [
      {
        path: 'home',
        name: `${APP_NAME}.home`,
        component: Home,
      },
      {
        path: 'about',
        name: `${APP_NAME}.about`,
        component: About,
      },
    ],
  },
];
```

#### 4. 异步挂载 store module

`app-javascript/src/base.js`

```js
import Vue from 'vue';
import store from './store';

// 子项目异步注册 store module
Vue.__share_pool__.store.registerModule(process.env.VUE_APP_NAME, store);

export default null;
```

`app-javascript/src/store.js`

```js
/* store module */

export default {
  namespaced: true, // namespaced must be true in module app.
  state: {
    name: process.env.VUE_APP_NAME,
  },
  mutations: {},
  actions: {},
};
```

## 关于部署

- 方式一：通过 CI 合并主项目和子项目的 dist 目录，然后部署
- 方式二：将子项目当成单独服务对待，独立部署，然后通过 Nginx 反向代理合并主项目和子项目

## 不足 & 待解决的问题

### 1. 子项目缓存问题

推荐在服务端为子项目入口文件添加协商缓存。

## 参考

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
