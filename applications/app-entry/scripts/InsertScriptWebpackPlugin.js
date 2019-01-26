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
              js.unshift(...self.files);
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
