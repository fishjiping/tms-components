var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var merge = require('webpack-merge');
var utils = require('./utils');
var config = require('../config');
var baseWebpackConfig = require('./base');
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function(name) {
    baseWebpackConfig.entry[name] = ['webpack-hot-middleware/client?noInfo=true&reload=true'].concat(baseWebpackConfig.entry[name])
})

var devWebpackConfig = merge(baseWebpackConfig, {
    devtool: 'source-map',
    // module: {
    //     rules: utils.styleLoaders({
    //         sourceMap: config.dev.cssSourceMap
    //     })
    // },

    plugins: [
        new webpack.DefinePlugin({
            'process.env': config.dev.env
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new FriendlyErrorsPlugin()
    ]
});

module.exports = devWebpackConfig;