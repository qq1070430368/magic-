
// static get $inject(){ return ["$window", '$stateProvider', '$urlRouterProvider']; }
function coreRouter($stateProvider, $urlRouterProvider) {
    // 默认路由
    let temp = new LoadController();
    let get = temp.loadTemplate();
    $urlRouterProvider.otherwise('/app');
    $stateProvider
        .state('/app', get);
}


class LoadController {
    constructor() {
        // this.code = 'IEDW1yAwvyi6';
        // this.code = 'IQtkAZ9pDrET';
        // 商品 测试
        this.code = 'EoMCxzUzKTYW'
        this.$location = window.location.href;
        this.cropFile = {
            url: '/app',
            templateUrl: './component/dashboard-crops/ctr.html',
            controller: 'dashboard_crop',
            controllerAs: '$ctrl', 
        };
        this.goodsProduct = {
            url: '/app',
            templateUrl: './component/dashboard-goods/ctr.html',
            controller: 'dashboard_goods',
            controllerAs: '$ctrl'
        };
        this.justUrl = (path) => {
            if (path.indexOf('=') > -1) {
                let temp = path.split('=')[1];
                if (temp.indexOf('/#') > -1) {
                    this.code = temp.split('/')[0];
                } else if (temp.indexOf('#') > -1) {
                    this.code = temp.split('#')[0];
                } else {
                    this.code = temp;
                }
            }
            return this.code;
        };

    }
    loadTemplate() {
        // 初始化状态
        this.path = this.$location;
        this.code = this.justUrl(this.path);
        let codeStartWith = this.code.startsWith('IE');
        if (codeStartWith) {
            this.cropFile.code = this.code;
            return this.cropFile;
            // 判断为作物档案模板 返回相应的template controller controller as
        } else {
            this.goodsProduct.code = this.code;
            return this.goodsProduct;
        }


    }
}
coreRouter.$inject = ['$stateProvider', '$urlRouterProvider'];

export default coreRouter;