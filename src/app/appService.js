// 初始化路由的时候需要根据二维码信息确定加载那个页面
// class loadController {
//     static get $inject() {
//         return ['$location'];
//     }
//     constructor($location) {
//         this.code = 'IEDW1yAwvyi6';
//         this.$location = $location;
//         this.cropFile = {
//             templateUrl: './component/dashboard-crops/ctr.html',
//             contrller: 'dashboard_crop'
//         };
//         this.justUrl = (path) => {
//             if (path.indexOf('=') > -1) {
//                 let temp = path.split('=')[1];
//                 if (temp.indexOf('/#') > -1) {
//                     this.code = temp.split('/')[0];
//                 } else if (temp.indexOf('#') > -1) {
//                     this.code = temp.split('#')[0];
//                 } else {
//                     this.code = temp;
//                 }
//             }
//             return this.code;
//         };

//     }
//     loadTemplate() {
//         // 初始化状态
//         let state = false;
//         this.path = this.$location.absUrl();
//         this.code = this.justUrl(this.path);
//         let codeStartWith = this.code.startsWith('IE');
//         if (codeStartWith) {
//             return this.cropFile;
//             // 判断为作物档案模板 返回相应的template controller controller as
//         }


//     }
// }



// export default angular

//     .module('appService', [])


//     .service('loadController', loadController)

//     .name;