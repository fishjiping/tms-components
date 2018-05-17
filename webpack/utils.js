var path = require('path');
var config = require('../config');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: ['./src/app.js'],

    assetsPath: function (_path) {
        var assetsSubDirectory = process.env.NODE_ENV === 'production'
          ? config.build.assetsSubDirectory
          : config.dev.assetsSubDirectory
        return path.posix.join(assetsSubDirectory, _path)
    },

    cssLoaders: function (options) {
        options = options || {}
      
        var cssLoader = {
            loader: 'css-loader',
            options: {
                minimize: process.env.NODE_ENV === 'production',
                sourceMap: options.sourceMap
            }
        }

        // generate loader string to be used with extract text plugin
        function generateLoaders (loader, loaderOptions) {
            var loaders = [cssLoader]
            if (loader) {
                loaders.push({
                    loader: loader + '-loader',
                    options: Object.assign({}, loaderOptions, {
                        sourceMap: options.sourceMap
                    })
                })
            }

            if (options.extract && 0) {
                return ExtractTextPlugin.extract({
                    use: loaders,
                    fallback: 'style-loader'
                })
            } else {
                return ['style-loader'].concat(loaders);
            }
        }

        return {
            css: generateLoaders(),
            postcss: generateLoaders('postcss'),
            less: generateLoaders('less'),
            sass: generateLoaders('sass', { indentedSyntax: true }),
            scss: generateLoaders('sass'),
            stylus: generateLoaders('stylus'),
            styl: generateLoaders('stylus')
        }
    },

    styleLoaders: function (options) {
        var output = []
        var loaders = this.cssLoaders(options)
        for (var extension in loaders) {
            var loader = loaders[extension];
            var matchRule = new RegExp('\\.' + extension + '$');
            if (extension === 'less') {
                matchRule = function(filePath) {
                    return /\.less$/.test(filePath) && !/antd\/.*\.less$/.test(filePath);
                }
            }
            output.push({
                test: matchRule,
                use: loader
            })
        }
        return output
    }
}