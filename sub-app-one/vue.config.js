const webpack = require('webpack');
const APP_NAME = require('./package.json').name;
const PORT = require('./package.json').devPort;

const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_DEV = NODE_ENV === 'development';

log('APP_NAME: ', APP_NAME);
log('NODE_ENV: ', NODE_ENV);

module.exports = {
  baseUrl: IS_DEV ? APP_NAME : './',

  css: { extract: false },

  productionSourceMap: false,

  configureWebpack: {
    externals: IS_DEV
      ? {}
      : {
          lodash: '_',
          moment: 'moment',
          vue: 'Vue',
          vuex: 'Vuex',
          'vue-router': 'VueRouter',
          'element-ui': 'ELEMENT',
        },

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
