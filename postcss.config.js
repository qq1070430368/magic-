let kit = require('./build/kit');
module.exports = {
    plugins: [
        require('postcss-import')(),
        require('autoprefixer'),
        kit.isProduction().dev ? false : require('cssnano')
    ]
};