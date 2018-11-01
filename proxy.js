const express = require('express');
const timeout = require('connect-timeout');
const proxy = require('http-proxy-middleware');

const app = express();

// 这里从环境变量读取配置，方便命令行启动
// HOST 指目标地址
// PORT 服务端口
const { HOST = 'http://localhost:9080', PORT = '3300' } = process.env;

// 超时时间
const TIME_OUT = 30 * 1e3;

// 设置端口
app.set('port', PORT);

// 设置超时 返回超时响应
app.use(timeout(TIME_OUT));
app.use((req, res, next) => {
  if (!req.timeout) next();
});

// 静态页面（这里一般设置你的静态资源路径）
// app.use('/', express.static('static'));

// 反向代理（这里把需要进行反代的路径配置到这里即可）
app.use(
  proxy('/entry-app/', {
    target: 'http://localhost:7300/',
    changeOrigin: true,
  }),
  proxy('/sub-app-one/', {
    target: 'http://localhost:7310/',
    changeOrigin: true,
  }),
  proxy('/sub-app-two/', {
    target: 'http://localhost:7320/',
    changeOrigin: true,
  }),
);

// 监听端口
app.listen(app.get('port'), () => {
  console.log(`server running @${app.get('port')}`);
});
