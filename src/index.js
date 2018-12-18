/**
 * 入口文件
 */
import mainModule from './component/main';
import router from  './app/config.router';
// import appRun from './app/appRun';
// console.log(appService, 'asdasd')
// 注册全局指令
import globelDirctive from './app/appDriective';

// console.log(mainModule, 'app')
let app = angular
    .module('bootstrap', ['ui.router', mainModule, globelDirctive]);
// app.run(appRun);
app.config(router);

