# vue-simple-micro-frontends

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

灵感来自于 [用微前端的方式搭建类单页应用](https://tech.meituan.com/fe_tiny_spa.html)(@[美团技术团队](https://tech.meituan.com))

## 设计目标

1. 子项目支持单独开发，单独部署（避免前端巨无霸，多团队同时开发）
2. 单一的入口 HTML（不同项目之间切换时无白屏现象）
3. 支持多语言开发（JavaScript、TypeScript 等）

## 加载子项目的两种方式

- 预加载子项目入口文件 -- [文档](./v2.md) / [source code](https://github.com/zh-rocco/vue-simple-micro-frontends/tree/master)
- 懒加载子项目 -- [文档](./v1.md) / [source code](https://github.com/zh-rocco/vue-simple-micro-frontends/tree/v1)

## 使用

### 开发

```bash
# 安装依赖
yarn

# 开发模式
yarn serve

# 打开: http://localhost:10240/
```

### 构建

```bash
# 生产构建
yarn build

# 构建 example 站点
yarn build:example
```
