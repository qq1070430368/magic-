const
    webpackHtml = require('html-webpack-plugin'),
    extractTextPlugin = require('extract-text-webpack-plugin'),
    uglify = require('uglifyjs-webpack-plugin');




module.exports = {
    watch: true,
    mode: 'development',
    // entry: '../src/index.js',
    output: {
        filename: '[name].js',
    },
    // devtool: 'source-map',
    module: {
        rules:
            [
                {
                    test: /\.(woff|svg|eot|ttf)\??.*$/,
                    loader: 'url-loader?name=fonts/[name].[md5:hash:hex:7].[ext]'
                },
                {
                    test: /\.less$/,
                    use: extractTextPlugin.extract({
                        use: [
                            {
                                loader: 'css-loader',
                            },
                            {
                                loader: 'postcss-loader',
                                options: {
                                    sourceMap: true,
                                    config: {
                                        path: 'postcss.config.js'  // 这个得在项目根目录创建此文件
                                    }
                                }
                            },
                            {
                                loader: 'less-loader',

                            }
                        ],
                        fallback: 'style-loader'
                    }),
                    exclude: /(node_modules)/
                },
                {
                    test: /\.(png|jpg)$/,
                    loader: 'url-loader?limit=8192&name=img/[hash:8].[name].[ext]',
                    options: {
                        outputPath: './img'
                    }
                },
                {
                    //如果模块为html文件
                    test: /\.html/,
                    use: {
                        loader: "html-loader"
                    }
                },
                {
                    test: /\.json$/,
                    use: {
                        loader: 'json-loader',
                    }


                }, {
                    test: /\.js$/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    },
                    exclude: /(node_modules)/,
                    // loader: 'babel-loader'
                }]
    },
    plugins: [
        new webpackHtml({
            filename: 'index.html',
            template: 'src/index.html',
            cache: false,
            hash: true
        }),
        // css 从js中抽离出来
        new extractTextPlugin('css/style.css'),
        // 使用webpack插件压缩js 
        new uglify()
    ],

}