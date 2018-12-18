'use strict';

const
    gulp = require('gulp');

const oKit = {
    BASE_VERSION: '8.0.1'
};

const kit = {
    checkVersion: checkVersion,
    checkNodeVer: checkNodeVer,
    checkNpm: checkNpm,
    log: log,
    getErrors: getErrors,
    getWatcherConfig: getWatcherConfig,
    getUglifyConfig: getUglifyConfig,
};

/**
 * 检测 Node 版本
 * @returns { Boolean } 是否为稳定版
 */
function checkNodeVer() {

    var
        shell = require('shelljs'),

        baseVersion,
        curVersion,

        isNodeAvailable,
        isNodeLessVer;

    if (!shell.which('node')) {
        shell.echo('Require Node Environment.');
        shell.echo('Please install by: http://nodejs.org');
        shell.exit();
    }

    baseVersion = oKit.BASE_VERSION;
    curVersion = shell.exec('node -v', {
        silent: true
    }).stdout;

    isNodeAvailable = checkVersion(curVersion, baseVersion).eq;
    isNodeLessVer = checkVersion(curVersion, baseVersion).lt;

    if (!isNodeAvailable) {
        let error = isNodeLessVer ?
            `Your Node Version Is Out Of Date! \nPlease Install V${baseVersion} Node On: http://nodejs.org` :
            `Your Node Version Is Too High \nFor Stable,Please Install V${baseVersion} Node On: http://nodejs.org`;
        getErrors(error);
    }

    return isNodeAvailable;
}


/**
 * 检测版本号
 * @param { String } curVersion 当前版本号
 * @param { String } baseVersion 基准版本号
 */
function checkVersion(curVersion, baseVersion) {
    const
        curVer = transVersion(curVersion),
        baseVer = transVersion(baseVersion);
    let
        equal = true,
        lessThan = undefined;

    equal = curVer.reduce((lastVal, cur, index) => {
        if (!lastVal) {
            return false;
        }
        let isEqual = Number(cur) === Number(baseVer[index] || 0);

        if (!isEqual) {
            lessThan = Number(cur) < Number(baseVer[index]);
        }
        return isEqual;
    }, equal);
    return {
        eq: equal,
        lt: lessThan,
        gt: !lessThan
    };
}

/**
 * 检测 npm package 是否安装正确
 * @returns { Boolean } 是否通过验证
 */
function checkNpm() {

    const
        dependenvies = gulp.pkg.devDependencies,
        plugins = Object.keys(dependenvies),
        shell = require('shelljs'),
        promise = [];

    let
        isPassed = true,
        isNotFind = false;

    for (let plugin of plugins) {
        const baseVersion = dependenvies[plugin];
        let sInstallTips = `Can Not Find node_module: [${plugin}] \nPlease Install At First:\n` +
            `\n` +
            `   npm install ${plugin}` +
            `\n`;

        try {
            require(plugin);
            promise.push(checkNpmVer(plugin, baseVersion)
                .then((value) => value)
                .catch((msg) => {
                    let error;
                    isPassed = false;
                    switch (msg) {
                        case 'notFind':
                            isNotFind = true;
                            error = sInstallTips;
                            break;
                        case '<':
                            error = `Your [${plugin}] version is out of date! \nPlease Install V${baseVersion.match(/([\d\.]+)/g)[0]}!`;
                            break;
                        case '>':
                            error = `Your [${plugin}] version is too High, \nFor Stable,Please Install V${baseVersion.match(/([\d\.]+)/g)[0]}!`;
                    }

                    getErrors(error);
                }));
        } catch (err) {
            isPassed = false;
            isNotFind = true;
            let error = sInstallTips;
            getErrors(error);
        }

    }

    isNotFind && shell.exit(1);

    Promise.all(promise)
        .then(() => {
            isNotFind && shell.exit(1);
            return isPassed;
        });

}

/**
 * 检测 npm 版本
 * @returns { Promise }
 */
function checkNpmVer(plugin, baseVersion) {

    const fs = require('fs');

    return new Promise((resolve, reject) => {
        fs.readFile(`./node_modules/${plugin}/package.json`, 'utf-8', (err, data) => {
            if (err) {
                reject('notFind');
                return;
            }

            let
                isEqual,
                isLessThan,
                curVersion = JSON.parse(data).version;

            isEqual = checkVersion(curVersion, baseVersion).eq;
            isLessThan = checkVersion(curVersion, baseVersion).lt;

            if (!isEqual) {
                let msg = isLessThan ? '<' : '>';
                reject(msg);
            }

            resolve(true);

        });
    });
}


/**
 * 错误提示
 * @param { String } error 错误提示语
 */
function getErrors(error) {
    const shell = require('shelljs');
    shell.echo(' ');
    shell.echo('### Caution: ###');
    shell.echo('');
    shell.echo(error);
    shell.echo('');
}

/**
 * print something
 */
function log() {
    var arrLog = Array.prototype.slice.call(arguments);
    arrLog.unshift('-----');
    console.log.apply(console, arrLog);
}

/**
 * 获取 gulp-watch 默认配置
 * @returns {{interval: number, debounceDelay: number, mode: string}}
 */
function getWatcherConfig(onf) {

    // docs: https://github.com/shama/gaze

    return Object.assign({
        interval: 800,
        debounceDelay: 200,

        // "auto", "watch", "poll"
        mode: 'auto'
    }, onf);
}


/**
 * 获取 Uglify 默认配置
 * @param { Object } [onf]
 * @returns { Object }
 */
function getUglifyConfig(onf) {
    return assignDeep({
        mangle: true,
        compress: {
            sequences: true, // join consecutive statemets with the “comma operator”
            properties: true, // optimize property access: a["foo"] → a.foo
            dead_code: true, // discard unreachable code
            drop_debugger: true, // discard “debugger” statements
            unsafe: false, // some unsafe optimizations (see below)
            conditionals: true, // optimize if-s and conditional expressions
            comparisons: true, // optimize comparisons
            evaluate: true, // evaluate constant expressions
            booleans: true, // optimize boolean expressions
            loops: true, // optimize loops
            unused: true, // drop unused variables/functions
            hoist_funs: true, // hoist function declarations
            hoist_vars: false, // hoist variable declarations
            if_return: true, // optimize if-s followed by return/continue
            join_vars: true, // join declarations
            side_effects: true, // drop side-effect-free statements
            drop_console: false, // drop console
            warnings: false // warn about potentially dangerous optimizations/code
        }
    }, onf);
}

/**
 * Deep Mode For Object.assign
 * @param target
 * @param source
 * @returns {*}
 */
function assignDeep(target, source) {

    for (let prop in source) {

        let isDeepAssign;

        if (!source.hasOwnProperty(prop)) { continue }

        isDeepAssign = isObject(source[prop]);

        if (isDeepAssign) {
            target[prop] = isObject(target[prop]) ?
                target[prop] : {};
        }

        target[prop] = isDeepAssign ?
            assignDeep(target[prop], source[prop]) :
            '' === source[prop] ?
                target[prop] :
                source[prop];

    }

    return target;

}

// 转换版本号的个数
function transVersion(version) {
    return version.match(/([\d\.]+)/g)[0].split('.');
}


module.exports = kit;