const { 
  disableEsLint,
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
    disableEsLint(),
    // fixBabelImports('import', {
    //   libraryName: '@material-ui/core',
    //   libraryDirectory: 'es',
    //   camel2DashComponentName: false,
    // }),
    addBabelPlugin('react-hot-loader/babel'),
    addWebpackAlias({
      '@': path.resolve(__dirname, './src'),
      //'react-dom': process.env.NODE_ENV === 'production' ? 'react-dom' : '@hot-loader/react-dom',
    }),
    addWebpackPlugin(
      new ProgressBarPlugin(),
    ),
  ),
};
