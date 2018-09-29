const APP_NAME = require('./package.json').name;

module.exports = {
  plugins: {
    autoprefixer: {},
    'postcss-selector-namespace': { namespace: `.${APP_NAME}` },
  },
};
