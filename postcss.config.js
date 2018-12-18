let kit = require('./build/kit');
module.exports = {
    plugins: [
        require('postcss-import')(),
        require('autoprefixer'),
        kit.isProduction() ?  require('cssnano'): false
    ]
};