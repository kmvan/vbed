'use strict'

global.__DEV__ = process.env.WEBPACK_ENV === 'development'

const APP_NAME = '微图床'
const APP_NAME_EN = 'V-Bed'

const webpack = require('webpack')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const node_modules = path.resolve(__dirname, 'node_modules')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const htmlMinifier = require('html-minifier').minify
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const fs = require('fs')

console.log(`Run in ${process.env.WEBPACK_ENV}`)

function deleteall(path) {
    let files = []
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path)
        files.forEach(function (file, index) {
            const curPath = `${path}/${file}`
            if (fs.statSync(curPath).isDirectory()) {
                deleteall(curPath)
            } else {
                fs.unlinkSync(curPath)
            }
        })
        fs.rmdirSync(path)
    }
}

if (!__DEV__) {
    console.log(`Deletting ./dist...`)
    deleteall('./dist')
    console.log(`Deleted .dist`)
}

console.log(`Start packing...`)

const alias = {
    '~root': __dirname,
    '~helper': `${__dirname}/src/helper`,
    '~stores': `${__dirname}/src/stores`,
    '~components': `${__dirname}/src/components`,
}

let plugins = [
    new webpack.DefinePlugin({
        __DEV__,
        'process.env': {
            NODE_ENV: __DEV__ ? JSON.stringify('development') : JSON.stringify('production'),
        },
        DEBUG: __DEV__,
    }),
    new ExtractTextPlugin({
        filename: "[name].css?h=[hash]",
        allChunks: true,
    }),
    new LodashModuleReplacementPlugin({
        'paths': true,
    }),
    new HtmlWebpackPlugin({
        title: `${APP_NAME} - ${APP_NAME_EN}`,
        filename: `${__dirname}/index.html`,
        template: `${__dirname}/src/index.ejs`,
        inject: 'head',
        minify: __DEV__ ? false : {
            removeAttributeQuotes: true,
            collapseWhitespace: true,
            html5: true,
            minifyCSS: true,
            removeComments: true,
            removeEmptyAttributes: true,
        },
    }),
    new FaviconsWebpackPlugin({
        logo: `./src/favicon.png`,
        prefix: `icons-[hash]/`,
        path: './dist/',
        emitStats: false,
        persistentCache: true,
        inject: true,
        title: `${APP_NAME} - ${APP_NAME_EN}`,
        theme_color: '#E66482',
        icons: {
            android: true,
            appleIcon: true,
            appleStartup: true,
            favicons: true,
            firefox: true,
        }
    }),
    new ScriptExtHtmlWebpackPlugin({
        defaultAttribute: 'async',
    }),
]

if (!__DEV__) {
    plugins = plugins.concat([
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.LimitChunkCountPlugin(),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorOptions: { discardComments: { removeAll: true } },
            canPrint: true
        }),
        // new UglifyJsPlugin({
        new webpack.optimize.UglifyJsPlugin({
            parallel: true,
            // uglifyOptions: {
            mangle: {
                eval: true,
                toplevel: true,
            },
            parse: {
                html5_comments: false,
            },
            output: {
                comments: false,
                beautify: false,
            },
            ecma: 5,
            ie8: false,
            compress: {
                properties: true,
                unsafe: true,
                unsafe_comps: true,
                unsafe_math: true,
                unsafe_proto: true,
                unsafe_regexp: true,
                // unsafe_Func: true,
                dead_code: true,
                unused: true,
                conditionals: true,
                keep_fargs: false,
                drop_console: true,
                drop_debugger: true,
                reduce_vars: true,
                if_return: true,
                comparisons: true,
                evaluate: true,
                booleans: true,
                // typeofs: false,
                loops: true,
                toplevel: true,
                top_retain: true,
                hoist_funs: true,
                // hoist_vars: true,
                // inline: true,
                join_vars: true,
                cascade: true,
                collapse_vars: true,
                negate_iife: true,
                pure_getters: true,
                pure_funcs: [],
                // passes: 3,
                // ecma: 5,
            },
            // },
            sourceMap: false,
        }),
        new webpack.BannerPlugin({
            banner: `Author: Km.Van <kmvan@outlook.com> INN-STUDIO.com - ${new Date} `,
        }),

    ])
}

let config = {
    entry: {
        'app': `${__dirname}/src/app.jsx`,
    },
    output: {
        path: `${__dirname}/dist`,
        filename: '[name].js?h=[hash]',
        publicPath: `dist/`,
    },
    resolve: {
        extensions: ['.js', '.jsx', '.sass', '.scss', '.css'],
        alias: alias || {},
        enforceExtension: false,
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: ['babel-loader'],
                exclude: [node_modules],
            }, {
                test: /\.(css|scss|sass)$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [{
                        loader: 'css-loader',
                        options: {
                            sourceMap: __DEV__,
                            minimize: !__DEV__,
                        },
                    }, {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: __DEV__,
                        },
                    }, {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: __DEV__,
                        },
                    }]
                }),
            }, {
                test: /\.html$/,
                loader: 'html-loader',
            }
        ]
    },
    plugins,
    stats: {
        errorDetails: true
    },
    devtool: __DEV__ ? 'source-map' : 'hidden',
    watchOptions: {
        poll: __DEV__,
    },
}

module.exports = config
