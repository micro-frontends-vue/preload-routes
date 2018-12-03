const path = require('path');
const express = require('express');
const timeout = require('connect-timeout');

const app = express();

// 这里从环境变量读取配置，方便命令行启动
// HOST 指目标地址
// PORT 服务端口
// const { HOST, PORT } = process.env;

// 超时时间
const TIME_OUT = 30 * 1e3;

// 设置端口
app.set('port', 3000);

// 设置超时 返回超时响应
app.use(timeout(TIME_OUT));
app.use((req, res, next) => {
  if (!req.timeout) next();
});

function resolvePath(relativePath) {
  return path.resolve(__dirname, relativePath);
}

// 静态页面（这里一般设置你的静态资源路径）
app.use('/sub-app-ts/', express.static(resolvePath('./sub-app-ts/dist/')));
app.use('/sub-app-js/', express.static(resolvePath('./sub-app-js/dist/')));
app.use('/', express.static(resolvePath('./entry-app/dist/')));

// 监听端口
app.listen(app.get('port'), () => {
  console.log('App running at:\n');
  console.log(`http://localhost:${app.get('port')}/`);
});
