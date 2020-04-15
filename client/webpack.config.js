const webpack = require('webpack');
const dotenv = require('dotenv');

const env = dotenv.config().parsed;

// const envKeys = Object.keys(env).reduce((prev, next) => {
//     prev['process.env.${next}'] = JSON.stringify(env[next]);
//     return prev;
//   }, {});

module.exports = {
    
    entry: './src/App.js',
    output: {
        path: __dirname + '/public',
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                use: 'babel-loader',
                test: /\.js$/,
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                  'style-loader',
                  'css-loader'
                ]
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                  'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
                  'image-webpack-loader?bypassOnDebug&optimizationLevel=7&interlaced=false'
                ]
            }                         
        ]
    },
    plugins: [
        new webpack.DefinePlugin("envKeys")
    ]
  }