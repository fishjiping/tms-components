var path = require('path');
var fs = require('fs');
var config = require('../config');
var pkg = require('../package.json');
var webpack = require('webpack');
var utils = require('./utils');

process.traceDeprecation = true;

module.exports = {
    entry: {
        app: ['./src/app.jsx']
    },
    output: {
        path: config.build.assetsRoot,
        filename: '[name].js',
        publicPath: process.env.NODE_ENV === 'production' ?
            config.build.assetsPublicPath :
            config.dev.assetsPublicPath
    },
    externals: {
        react: 'window.React',
        'react-dom': 'window.ReactDOM',
    },
    resolve: {
        extensions: ['.js', '.jsx', '.less'],
        alias: {
            components: path.join(__dirname, '../src/components'),
            mixComponent: path.join(__dirname, '../src/mixComponent'),
            libs: path.join(__dirname, '../src/libs')
        }
    },

    plugins: [
        // 根据模块调用次数，给模块分配ids，常被调用的ids分配更短的id, 使得ids可预测，降低文件大小，该模块推荐使用
        new webpack.optimize.OccurrenceOrderPlugin(),
        
        // 限制打包文件的个数
        new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 15 }),

        // 把多个小模块进行合并，以减少文件的大小
        new webpack.optimize.MinChunkSizePlugin({ minChunkSize: 8192 }),

        // 设置postcss-loader,autoprefixer
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: function(){
                    return [
                        require("autoprefixer")({
                            browsers: ['last 2 versions', 'iOS >= 7', 'Android >= 4']
                        })
                    ]
                }
            }
        })
    ],

    module: {
        rules: [
            {
                test: /\.js|\.jsx$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.less$/, 
                use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader']
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            },
            
        ]
    }
}
