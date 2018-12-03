const fs = require('fs');
const path = require('path');

module.exports = function patchCliService() {
  const libConfigPath = path.resolve(
    __dirname,
    '../node_modules/@vue/cli-service/lib/commands/build/resolveLibConfig.js',
  );
  const libConfig = fs.readFileSync(libConfigPath, { encoding: 'utf-8' });
  const patchedLibConfig = libConfig
    .replace('${entryName}.js', 'main.js')
    .replace('${entryName}.[name].js', '[name].[chunkhash:5].js');

  fs.writeFileSync(libConfigPath, patchedLibConfig, { encoding: 'utf-8' });
};
