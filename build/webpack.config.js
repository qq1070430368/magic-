const
    WebpackHtml = require('html-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    webpack = require('webpack'),
    Uglify = require('uglifyjs-webpack-plugin');

module.exports = (even) => {
    let options =  {
        watch: true,
        mode: 'development',
        output: {
            filename: '[name].js',
        },
        // devtool: 'source-map',
        module: {
            rules: [{
                test: /\.(woff|svg|eot|ttf)\??.*$/,
                loader: 'url-loader?name=fonts/[name].[md5:hash:hex:7].[ext]'
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    use: [{
                        loader: 'css-loader',
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                            config: {
                                path: 'postcss.config.js' // 这个得在项目根目录创建此文件
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
                test: /\.(png|jpg|gif)$/,
                loader: 'url-loader?limit=8192&name=img/[hash:8].[name].[ext]',
                options: {
                    outputPath: './img'
                }
            },
            {
                // 如果模块为html文件
                test: /\.html/,
                use: {
                    loader: 'html-loader'
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
                exclude: /(node_modules)/
            }
            ]
        },
        plugins: [
            new WebpackHtml({
                filename: 'index.html',
                template: 'src/index.html',
                cache: false,
                hash: true
            }),
            // css 从js中抽离出来
            new ExtractTextPlugin('css/style.css'),
            new webpack.DefinePlugin({
                PRODUCTION: JSON.stringify(even),
                VERSION: JSON.stringify('1.0'),
                BROWSER_SUPPORTS_HTML5: true,
            })
        ],
    };

    if (even === 'develop') {
        return options;
    } else {
        options.plugins.push(new Uglify());
        return options;
    }
};