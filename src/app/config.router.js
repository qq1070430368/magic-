


// static get $inject(){ return ["$window", '$stateProvider', '$urlRouterProvider']; }
function coreRouter($stateProvider, $urlRouterProvider) {
    // 默认路由
    $urlRouterProvider.otherwise('/cropFile');
    $stateProvider
        .state('/cropFile', {
            url: '/cropFile',
            templateUrl: './component/dashboard-crops/ctr.html',
            controller: 'dashboard_crop',
            controllerAs: "$ctrl"
        })
};
coreRouter.$inject = ['$stateProvider', '$urlRouterProvider']
//导出路由主模块

export default coreRouter 