const webpack = require('@nativescript/webpack');

module.exports = (env) => {
  webpack.init(env);

  // Disable service worker generation
  webpack.chainWebpack((config) => {
    if (config.plugins.has('GenerateSW')) {
      config.plugins.delete('GenerateSW');
    }
    if (config.plugins.has('InjectManifest')) {
      config.plugins.delete('InjectManifest');
    }
  });

  return webpack.resolveConfig();
};