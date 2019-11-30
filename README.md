# 预加载子项目路由

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

灵感来自于 [用微前端的方式搭建类单页应用](https://tech.meituan.com/fe_tiny_spa.html)(@[美团技术团队](https://tech.meituan.com))

## 关联项目

- 异步加载子项目路由 -- [传送门](https://github.com/micro-frontends-vue/async-routes)

## 设计目标

1. 子项目支持单独开发，单独部署（避免前端巨无霸，多团队同时参与）
2. 单一的入口 HTML（不同项目之间切换时无白屏现象）
3. 支持多语言开发（JavaScript、TypeScript）

## 使用

[详细教程](./detail.md)

```bash
# 安装依赖
npm run bootstrap

# 开发模式
npm run serve

# 打开: http://localhost:10240/
```

### 构建

```bash
# 生产构建
npm run build
```
