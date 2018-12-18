

class loadingController {
    constructor() {
    }
}
const loading = {
    template: '<div class="loadings" >' +
        '<div class="box"><div class="loader-16"></div>' +
        '</div>' +
        '<div class="copyright">© 2018 www.fmbj.com.cn. All rights reserved</div>' +
        '</div>',
    controller: loadingController,
};

class noData {
    constructor() {
        this.restrict = 'E'
        this.scope = {
            data: '='
        }
        this.template = '<div class="mainpage-wu" ng-if="!mainpagewu || mainpagewu.length === 0">{{textStr}}</div>';
        this.link = (scope, element, attrs) => {
            if (angular.isObject(scope.data)) {

                scope.mainpagewu = Object.keys(scope.data).length == 0 ? [] : scope.data;

            } else {
                scope.mainpagewu = scope.data;
            }

            scope.textStr = attrs.textStr || '暂无数据';
        }
    }
}

class fmEchart {
    constructor() {
        this.restrict = 'EA'
        // this.scope = {
        //     data: '='
        // }
    }
    link(scope, element, attrs) {
        console.log(scope, 'asdasd')
        debugger;
        if (!echarts) {
            return;
        }
        // 先echarts.init(element[0])将图表初始化在准备好的dom
        scope.myChart = echarts.init(element[0], attrs.fmEchart);
        // $scope.$watch(attrs['eData']，当option里的配置或者数据变化的时候，绘制图表
        scope.$watch(attrs['eData'], function () {
            let option = scope.$eval(attrs.eData);

            if (angular.isObject(option)) {
                // 绘制图表直接调用echart的API去setOption
                scope.myChart.setOption(option, true);
            }
        }, true);
        scope.getDom = function () {
            return {
                'height': element[0].offsetHeight,
                'width': element[0].offsetWidth
            };
        };
        // $scope.$watch($scope.getDom为了响应式准备的，当dom的width或者height变化的时候调用api里的resize()方法
        scope.$watch(scope.getDom, function () {
            // resize echarts图表
            scope.myChart.resize();
        }, true);
    }

}



// function fmEchart() {
//     function link(scope, element, attrs) {

//        

//        

//     }
//     return {
//         restrict: 'A',
//         link: link
//     };
// }

export default angular.module('GlobelDirctive', [])
    .directive('noData', () => new noData())
    .directive('fmEchart', () => new fmEchart())
    .component('loading', loading)
    .name

