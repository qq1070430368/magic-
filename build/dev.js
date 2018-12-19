const
    gulp = require('gulp'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    $if = require('gulp-if'),
    del = require('del'),
    cached = require('gulp-cached'),
    webpack = require('webpack-stream'),
    plumber = require('gulp-plumber'),
    // shell = require('shelljs'),
    // sourceMaps = require('gulp-sourcemaps'),
    utile = require('gulp-util'),
    imageMin = require('gulp-imagemin'),
    Uglify = require('uglifyjs-webpack-plugin');

const kit = require('./kit');

const
    SRC = {
        html: [
            'src/component/**/*.html'
        ],
        js: [
            'src/index.js',
            'component/**/*.js'
        ],
        img: [
            'src/img/**'
        ],
        favicon: [
            'src/img/favicon'
        ],
        rootPath: 'dist',
    };

// 第三方JS
const
    concatLib = ['lib/jquery/jquery.min.js', 'lib/bootstrap/bootstrap.min.js', 'lib/angular.js', 'lib/angular-ui-router.min.js',
        'lib/ECharts/echarts-3.8.0.min.js', 'lib/PhotoSwipe/photoswipe.min.js', 'lib/PhotoSwipe/photoswipe-ui-default.min.js', 'lib/qcode-2/qrcode.min.js', 'lib/swiperSlide/swipeslider.min.js'];

let webpackConfig = require('./webpack.config');

let even = ['develop', 'preProduct', 'product'];
// 开发环境配置
if (kit.isProduction().dev) {
    kit.even = even[0];
} else if (kit.isProduction().pro) {
    kit.even = even[1];
    webpackConfig(kit.even).plugins.push(new Uglify());
} else if (kit.isProduction().prod) {
    kit.even = even[2];
    webpackConfig(kit.even).plugins.push(new Uglify());
}

// 清理dist目录线上代码
function clear(cb) {
    // shell.exec('npm -v');
    return del([SRC.rootPath], cb);
    // shell.exec('mkdir dist');
    // shell.rm('dist/index.js');
}
// HTML
function buildBasicHtml() {
    return new Promise((reslove, reject) => {
        gulp
            .src(SRC.html, {
                base: 'src'
            })
            .pipe(plumber())
            .pipe(cached('baseJs-task'))  // 取个名字
            .pipe(gulp.dest(SRC.rootPath))
            .pipe(connect.reload())
            .on('end', function () {
                reslove();
            })
            .on('error', function (err) {
                reject(err);
            });
    });
}

// 三方js文件
function buildLibJs() {
    return new Promise((reslove, reject) => {
        gulp
            .src([...concatLib])
            // .pipe(plumber())
            // .pipe(cached('baseJs-task'))  // 取个名字
            .pipe(concat('lib.js'))
            .pipe(gulp.dest('dist/js/'))
            .pipe(connect.reload())
            .on('end', function () {
                reslove();
            })
            .on('error', function (err) {
                reject(err);
            });
    });
}
// js文件

gulp.task('buildJs', function() {
    gulp
        .src([...SRC.js])
    // .pipe(gulpImportCss({
    //     matchPattern: '!*.{less,sass,js}'
    // }))
        .pipe(plumber())
        .pipe(cached('baseJs-task'))  // 取个名字
    // .pipe(sourceMaps.init({
    //     loadMaps: true
    // }))
        .pipe(webpack(webpackConfig(kit.even)))
    // .pipe(sourceMaps.write('.'))
    // .on('error', function (err) {
    //     utile.log(utile.colors.red('[Error]'), err.toString());
    // })
        .pipe(gulp.dest('./dist'))
        .pipe(connect.reload())
        .on('end', function () {
            reslove();
        })
        .on('error', function (err) {
            reject(err);
        });
});

function buildJs() {
    return new Promise((reslove, reject) => {
        gulp
            .src([...SRC.js])
            // .pipe(gulpImportCss({
            //     matchPattern: '!*.{less,sass,js}'
            // }))
            .pipe(plumber())
            .pipe(cached('baseJs-task'))  // 取个名字
            // .pipe(sourceMaps.init({
            //     loadMaps: true
            // }))
            .pipe(webpack(webpackConfig))
            // .pipe(sourceMaps.write('.'))
            // .on('error', function (err) {
            //     utile.log(utile.colors.red('[Error]'), err.toString());
            // })
            .pipe(gulp.dest('./dist'))
            .pipe(connect.reload())
            .on('end', function () {
                reslove();
            })
            .on('error', function (err) {
                reject(err);
            });
    });
}


// 监听其他html文件
(() => {
    gulp
        .task('watch-basic-html', () => {
            gulp
                .watch(SRC.html, kit.getWatcherConfig())
                .on('change', () => {
                    kit.log('watch:  basic.html ---- event');
                    buildBasicHtml();
                });
        });
})();

// 监听第三方JS
(() => {
    gulp
        .task('watch-Lib-js', () => {
            gulp
                .watch(concatLib, kit.getWatcherConfig())
                .on('change', () => {
                    kit.log('watch:  lib js ---- event');
                    buildLibJs();
                });
        });
})();


// 监听js

gulp
    .task('watch-js', () => {
        gulp
            .watch(SRC.js, ['buildJs']);
    });

// 监听复制第三方JS改动
(() => {
    gulp
        .task('watch-static-js', () => {
            gulp
                .watch([...concatLib], kit.getWatcherConfig())
                .on('change', () => {
                    kit.log('watch: staticjs ---- event');
                    buildFileStatic();
                });
        });
})();

// 复制第三方静态文件
// js文件
function buildFileStatic() {
    return new Promise((reslove, reject) => {

        gulp
            .src('./lib/**/*.*')
            .pipe(plumber())
            .pipe(gulp.dest('dist/lib'))
            .pipe(connect.reload())
            .on('end', function () {
                reslove();
            })
            .on('error', function (err) {
                reject(err);
            });
    });
}

// 构建图片
/**
 *  构建 image
 *
 */
function distImage() {

    return new Promise((resolve, reject) => {

        gulp
            .src(SRC.img)
            .pipe(imageMin())
            .pipe(gulp.dest('dist/img'))
            .on('end', function () {
                resolve();
            })
            .on('error', function (err) {
                reject(err);
            });
    });
}

// 字体图标复制
function buildIconFonts() {
    return new Promise((reslove, reject) => {

        gulp
            .src('./src/fonts/**/*.*')
            .pipe(plumber())
            .pipe(gulp.dest('dist/fonts'))
            .pipe(connect.reload())
            .on('end', function () {
                reslove();
            })
            .on('error', function (err) {
                reject(err);
            });
    });
}



function build() {
    let configAsync = [distImage(), buildBasicHtml(), buildLibJs(), buildJs(), buildIconFonts()];
    return Promise
        .all([...configAsync])
        .then(() => {
            kit.log('All well down、 you are very best!');
        })
        .catch((err) => {
            kit.log('Bad error ---- Cause: ');
            kit.log(err);
        });
}

module.exports = {
    clear,
    build
};