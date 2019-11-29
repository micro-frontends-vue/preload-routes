const webpack = require('webpack');
const APP_NAME = require('./package.json').name;
const PORT = require('./package.json').devPort;
const NODE_ENV = process.env.NODE_ENV || 'development';

log('APP_NAME: ', APP_NAME);
log('NODE_ENV: ', NODE_ENV);

module.exports = {
  publicPath: `${NODE_ENV === 'development' ? '' : '.'}/${APP_NAME}/`,

  css: {
    extract: false
  },

  productionSourceMap: false,

  chainWebpack: (config) => {
    config.externals({
      'vue': 'Vue'
    })

    config.output
      .filename('main.js')
      .chunkFilename('[name].[chunkhash:8].js')
      .jsonpFunction(`webpackJsonp-${APP_NAME}`)
      .library(`app-${APP_NAME}`)
      .libraryExport('default')
      .libraryTarget('umd')

    config.optimization.splitChunks(false)

    config.plugin('define').use(webpack.DefinePlugin, [{
      'process.env.VUE_APP_NAME': JSON.stringify(APP_NAME)
    }])

    config.plugins
      .delete('html')
      .delete('preload')
      .delete('prefetch')
  },

  devServer: {
    port: PORT,
  },
};

function log(label, content, options) {
  console.log('\x1b[1m%s\x1b[31m%s\x1b[0m', label, content);
}
