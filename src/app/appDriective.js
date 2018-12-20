// 全局loaing加载动画 type component
const loading = {
    template: '<div class="loadings" >' +
        '<div class="box"><div class="loader-16"></div>' +
        '</div>' +
        '<div class="copyright">© 2018 www.fmbj.com.cn. All rights reserved</div>' +
        '</div>',
    name: 'loading'
};

// 全局弹出层黑色背景
class FmBlackProps {
    static get $inject() { return ['$scope'] }
    constructor($scope) {
        // 点击弹出层 消失
        this.colseBalck = () => {
            $scope.$emit('closeMask', true);
        };
    }
}

const fmBlackProp = {
    template: '<div class="mui-popup-backdrop mui-active" ng-click="bp.colseBalck()"></div>',
    name: 'fmBlackProps',
    controller: FmBlackProps,
    controllerAs: 'bp'
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
        };
    }
    link(scope, ele, attrs) {
        scope.talkR = attrs['talkText'];
    }
}


// 服务
fmoastService.$inject = ['$timeout', '$rootScope'];

function fmoastService($timeout, $rootScope) {
    // 自动消失的提示框
    this.pop = function (data, time) {
        $rootScope.$emit('new-toaster', data);
        angular.element('.toast-container').show();
        var timer = $timeout(function () {
            angular.element('.toast-container').hide();
            // $timeout.cancel(timer);
        }, time || 1000);
    };
    // 销毁· $destory

}

fmToaster.$inject = ['fmtoast', '$rootScope'];

function fmToaster(fmtoast, $rootScope) {
    return {
        restrict: 'EA',
        replace: true,
        templateUrl: 'toaster.html',
        link: function (scope) {
            scope.toasts = '';
            // 自动消失的提示框
            $rootScope.$on('new-toaster', function (event, data) {
                scope.toasts = data;
            });
            // 确定以后消失的警示框;
            // @param
            // msg  object
            // @type  类型警告 警示这样的类型；
            // @data  body主体信息;
            $rootScope.$on('warn-toaster', function (event, msg) {
                if (msg || scope.warnTip) {
                    $rootScope.pipop = true;
                }
                scope.warnTip = msg.data;
                scope.type = msg.type;
                scope.confim = false;
                scope.done = true;
                scope.colseMode = function () {
                    $rootScope.pipop = false;
                    scope.warnTip = '';
                };

            });
            // 隐藏
            scope.remove = function () {
                scope.toasts = '';
                scope.loading = false;
            };
        },

    };
}
export default angular.module('GlobelDirctive', [])
    .run(['$templateCache', function ($templateCache) {
        $templateCache.put('toaster.html',
            '<div>' +
        '<div ng-if="toasts" ng-click="remove()" class="toast-container" > ' +
        '<div class="toast"><div class="content" ng-bind="toasts"></div></div>' +
        '</div>' +
        '<div class="mui-popup mui-popup-in" ng-if="warnTip"><div class="mui-popup-inner">' +
        '<div class="mui-popup-title" ng-if="done">{{type}}</div><div class="mui-popup-text">{{warnTip}}</div></div>' +
        '<div class="mui-popup-buttons" ng-click="colseMode()">' +
        '<span class="mui-popup-button mui-popup-button-bold" ng-if="done">确定</span>' +
        '<span class="mui-popup-button mui-popup-button-bold" ng-if="confim" style="border-right:2px solid #eee" ng-click="back()">取消</span>' +
        '<span class="mui-popup-button mui-popup-button-bold" ng-if="confim" ng-click="ok()">确定</span>' +
        '</div></div>' +
        '<div class="mui-toast-container mui-active" ng-if="botShow"><div class="mui-toast-message">{{message}}</div></div>' +
        '<div class="item-loader-container" ng-if="loading"><div class="loading-contain"><span class="fa fa-spinner spinner_cirl"></span><p>加载中···</p></div></div>' +
        '</div>'
        );
    }])
    .directive('noData', () => new NoData())
    .directive('fmEchart', () => new FmEchart())
    .directive('errSrc', () => new ErrSrc())
    .directive('noBarcode', () => new NoBarcode())
    .directive('fmToaster', fmToaster)
    .service('fmtoast', fmoastService)
    .component('loading', loading)
    .component('fmBlackMask', fmBlackProp)
    .name;