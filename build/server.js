function devServer() {
    const
        _browser = require('child_process');


    const os = require('os');


    const server = require('gulp-connect');

    server.server({
        root: 'dist',
        host: 'localhost',
        port: 443,
        livereload: true
    });
    // OS模块  操作系统相关的
    let platform = os.platform();
    switch (platform) {
        case 'darwin':
            _browser.exec('open -a "Google Chrome" http://localhost:443');
            break;
        case 'win32':
            _browser.exec('start chrome http://localhost:443');
            break;
    }
}

module.exports = {
    devServer: devServer
};