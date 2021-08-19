const themeName = 'theme_name';

const path = require('path');
const url = require('url');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const paths = {
  url:"",
  js:{
    rootDir:`wp-content/themes/${themeName}/assets/js`,
    index:`wp-content/themes/${themeName}/assets/js/index.js`,
    bundle:`wp-content/themes/${themeName}/assets/js/index.bundle.js`
  },
}
//master branch では mode: "production" とする
module.exports = {
  mode: 'development',
  entry: {
    path: path.resolve(__dirname, paths.js.rootDir),
    index: path.resolve(__dirname, paths.js.index),
    
    //index: path.join(__dirname, 'httpdocs', 'cms', 'wp-content', 'themes', `${themeName}`, 'js','app.js');
  },
  output: {
    path: path.join(__dirname, paths.js.rootDir),
    filename: path.join('[name].bundle.js'),
    //filename: path.join(__dirname, 'httpdocs', 'cms', 'wp-content', 'themes', `${themeName}`, 'js','bundle.js');
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  'modules': false
                }]
              ]
            }
          }
        ]
      }
    ]
  },
  devtool: 'source-map',
  optimization: {
    minimizer: [ // js圧縮
    new TerserPlugin({
        extractComments: 'all', // コメント削除
        terserOptions: {
            compress: {
              drop_console: false, // console.log削除 boolean
            },
        },
    }),
  ],
}
};