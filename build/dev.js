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
    imageMin = require('gulp-imagemin');

const kit = require('./kit');

const
    SRC = {
        html: [
            'src/component/**/*.html'
        ],
        js: [
            'src/index.js',
            'src/component/**/*.js'
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
    concatLib = ['lib/jquery/jquery.min.js', 'lib/bootstrap/bootstrap.min.js', 'lib/angular.js', 'lib/angular-ui-router.min.js', 'lib/ECharts/echarts-3.8.0.min.js', 'lib/PhotoSwipe/photoswipe.min.js', 'lib/qcode-2/qrcode.min.js'];



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


(() => {
    gulp
        .task('watch-index-html', () => {
            gulp
                .watch('src/index.html', kit.getWatcherConfig())
                .on('change', () => {
                    kit.log('watch:  index.html ---- event');
                    // buildIndexHtml();
                });
        });
})();

// HTML  // css
function buildBasicCss() {
    // return new Promise((reslove, reject) => {
    //     gulp
    //         .src('src/css/index.less')
    //         .pipe(plumber())
    //         .pipe(cached('baseJs-task'))  // 取个名字
    //         .pipe(sourceMaps.init())
    //         .pipe(plumber())
    //         .pipe(gulpImportCss({
    //             matchPattern: '!*.{less,sass}'
    //         }))
    //         .pipe(less())
    //         .pipe(postcss([autoprefixer]))
    //         .pipe(rename('indexStyle.css'))
    //         .pipe(sourceMaps.write('.'))
    //         .pipe(gulp.dest('src/css/'))
    //         .pipe(connect.reload())
    //         .on('end', function () {
    //             reslove();
    //         })
    //         .on('error', function () {
    //             reject();
    //         });
    // });
}

// 三方js文件
function buildLibJs() {
    return new Promise((reslove, reject) => {
        gulp
            .src([...concatLib])
            .pipe(plumber())
            .pipe(cached('baseJs-task'))  // 取个名字
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
function buildJs() {
    return new Promise((reslove, reject) => {
        gulp
            .src(['src/index.html', 'src/css/index.less', ...SRC.js])
            // .pipe(gulpImportCss({
            //     matchPattern: '!*.{less,sass,js}'
            // }))
            .pipe(plumber())
            .pipe(cached('baseJs-task'))  // 取个名字
            // .pipe(sourceMaps.init({
            //     loadMaps: true
            // }))
            .pipe(webpack(
                require('./webpack.config'), null, (err, state) => {
                    if (err) {
                        return console.log('webpack 执行出错: ', err, state);
                    }
                    console.log('webpack 热执行完成!');
                    reslove();
                }))
            // .pipe(sourceMaps.write('.'))
            .on('error', function (err) {
                utile.log(utile.colors.red('[Error]'), err.toString());
            })
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


// 监听css文件
(() => {
    gulp
        .task('watch-basic-css', () => {
            gulp
                .watch(['src/css/index.less', 'src/component/**/*.less'], kit.getWatcherConfig())
                .on('change', () => {
                    kit.log('watch:  css ---- event');
                    buildBasicCss();
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
(() => {
    gulp
        .task('watch-js', () => {
            gulp
                .watch(SRC.js, kit.getWatcherConfig())
                .on('change', () => {
                    kit.log('watch: js ---- event');
                    buildJs();
                });
        });
})();

// 监听复制第三方JS改动
(() => {
    gulp
        .task('watch-static-js', () => {
            gulp
                .watch(SRC.js, kit.getWatcherConfig())
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
    let configAsync = [distImage(), buildBasicHtml(), buildBasicCss(), buildLibJs(), buildJs(), buildFileStatic(), buildIconFonts()];
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