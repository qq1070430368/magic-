// 全局loaing加载动画 type component
const loading = {
    template: '<div class="loadings" >' +
        '<div class="box"><div class="loader-16"></div>' +
        '</div>' +
        '<div class="copyright">© 2018 www.fmbj.com.cn. All rights reserved</div>' +
        '</div>',
    name: 'loading'
};
// 暂无数据指令 type directive
class NoData {
    constructor() {
        this.restrict = 'E';
        this.scope = {
            data: '='
        };
        this.template = '<div class="mainpage-wu" ng-if="!mainpagewu || mainpagewu.length === 0">{{textStr}}</div>';
        this.link = (scope, element, attrs) => {
            if (angular.isObject(scope.data)) {

                scope.mainpagewu = Object.keys(scope.data).length === 0 ? [] : scope.data;

            } else {
                scope.mainpagewu = scope.data;
            }

            scope.textStr = attrs.textStr || '暂无数据';
        };
    }
}
// echats 加载 options type direvtive
class FmEchart {
    constructor() {
        this.restrict = 'EA';
        // this.scope = {
        //     data: '='
        // }
    }
    link(scope, element, attrs) {
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

// 图片占位符  type directive
class ErrSrc {
    constructor() {
        this.restrict = 'A';
    }
    link(scope, element, attrs) {
        element.bind('error', () => {
            if (attrs.src !== attrs.errSrc) {
                attrs.$set('src', attrs.errSrc);
                attrs.$set('ngSrc', '');
            }
        });
        if (attrs.src == null || attrs.src === '' || attrs.src === 'null') {
            attrs.$set('src', attrs.errSrc);
            attrs.$set('ngSrc', '');
        }
    }
}

// 条形码不存在 type directive
class NoBarcode {
    constructor() {
        this.template = 
        `<div class="empty" id="empty_id">
              <div class="empty-box">
                <span class="iconfont icon-kong"></span>
                <span class="empty-title">当前条码不存在~</span>
              </div>
        </div>`;
        this.restrict = 'EA',
        this.replace = true,
        this.scope = {
            showText: '='
        }
    }
    link(scope, ele, attrs) {
        scope.talkR = attrs['talkText'];
    }
}
export default angular.module('GlobelDirctive', [])
    .directive('noData', () => new NoData())
    .directive('fmEchart', () => new FmEchart())
    .directive('errSrc', () => new ErrSrc())
    .directive('noBarcode', () => new NoBarcode())
    .component('loading', loading)
    .name;