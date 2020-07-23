const { 
  override,
  addWebpackAlias,
  addBabelPlugin,
  fixBabelImports,
  addWebpackPlugin,
} = require('customize-cra');
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const path =require('path');

module.exports = {
  webpack: override(
    fixBabelImports('import', {
      libraryName: '@material-ui/core',
      libraryDirectory: 'esm',
      camel2DashComponentName: false,
    }),
    addBabelPlugin('react-hot-loader/babel'),
    addWebpackAlias({
      '@': path.resolve(__dirname, './src'),
    }),
    addWebpackPlugin(
      new ProgressBarPlugin(),
    ),
  ),
};
