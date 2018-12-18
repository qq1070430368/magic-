// 入口文件
const
    check = require('./cv'),
    gulp = require('gulp'),
    kit = require('./kit'),
    server = require('./server'),
    dist = require('./dev');
gulp.pkg = require('.././package');
gulp.kit = kit;
// 检测版本
check.run(kit);

// server.devServer();
// 开发服务器
gulp.task('server', server.devServer);
gulp.task('default', ['server'], () => console.log('Hello! welcome to build home!'));

gulp.task('clean', dist.clear);

// 项目构建
gulp.task('dev', ['clean'], dist.build);
// 开发环境构建

// 更新视图
gulp.task('watch', ['watch-index-html', 'watch-basic-html', 'watch-Lib-js', 'watch-basic-css', 'watch-js', 'watch-static-js']);



// 刷新模式
gulp.task('uu', ['dev', 'watch'], () => server.devServer());