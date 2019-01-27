const webpack = require('webpack');
const InsertScriptPlugin = require('./scripts/InsertScriptWebpackPlugin');
const APP_NAME = require('./package.json').name;
const PORT = require('./package.json').devPort;
const PROXY = require('./config/proxy');
const modules = require('./src/modules');

const NODE_ENV = process.env.NODE_ENV || 'development';

log('APP_NAME: ', APP_NAME);
log('NODE_ENV: ', NODE_ENV);

module.exports = {
  publicPath: './',

  productionSourceMap: false,

  configureWebpack: {
    externals: {
      vue: 'Vue',
      'element-ui': 'ELEMENT',
    },

    plugins: [
      new webpack.DefinePlugin({
        'process.env.VUE_APP_NAME': JSON.stringify(APP_NAME),
      }),
      new InsertScriptPlugin({ files: modules }),
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
