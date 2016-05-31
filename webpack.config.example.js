/**
 * Created by elly on 16/5/31.
 */
const webpack = require('webpack');

module.exports = {
    entry: './examples/src/index.js',
    output: {
        path: './examples/lib',
        filename: 'index.js',
        publicPath: "http://127.0.0.1:9010/lib"
    },
    module: {
        loaders: [{
            test: /\.js?$/,
            exclude: /node_modules/,
            loader: 'babel'
        }, {
            test: /\.css?$/,
            loader: 'style-loader!css-loader'
        }]
    },
    plugins: [new webpack.HotModuleReplacementPlugin()]
};
