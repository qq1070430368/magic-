/**
 * 入口文件
 */
// import appServices from './app/appService';
// import bootstrap from './component/main';
import mainModule from './component/main';
import router from  './app/config.router';
// 注册全局指令
import globelDirctive from './app/appDriective'
// console.log(mainModule, 'app')
let app = angular
    .module('bootstrap', ['ui.router', mainModule, globelDirctive])

app.config(router)



