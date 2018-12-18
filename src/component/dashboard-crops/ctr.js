import { runInThisContext } from 'vm';

class AppCtrl {
    static get $inject() {
        return ['$state', '$rootScope', '$scope', '$http', 'dashboardCropServive', 'cropNavTaskList', '$sce', '$q', '$location', '$anchorScroll'];
    }
    constructor($state, $rootScope, $scope, $http, dashboardCropServive, cropNavTaskList, $sce, $q, $location, $anchorScroll) {
        let vm = this;
        // vm.meaudropDown = meaudropDown;
        vm.viewMake = true;
        vm.viewBtn = false;
        vm.tabIndex = 0;
        vm.meauClip = true;
        vm.noData = false;
        vm.$location = $location;
        vm.$anchorScroll = $anchorScroll;
        $rootScope.loaderLoading = true;
        init();

        function init() {
            // 初始化页面模板
            vm.cropNavTaskList = cropNavTaskList;
            dashboardCropServive.getData()
                .then((response) => {
                    if (response._ERROR_MESSAGE_) {
                        // alert(response._ERROR_MESSAGE_);
                        $rootScope.loaderLoading = false;
                        vm.noData = true;
                    } else {
                        initTemplate(response);
                    }
                });
        }

        function initTemplate(response) {
            console.log(response);
            $rootScope.loaderLoading = false;
            vm.data = response.data;
            vm.noData = false;
            // 种植百科
            vm.cropIntroduce = $sce.trustAsHtml(vm.data.cropIntroduce);
            // 种植企业信息
            vm.companyPlant = vm.data.planting_enterprise;

            // 作物责任人
            vm.responselist = vm.data.responsibleMan;
            dataInit(vm.responselist, initIcon);

            // 土地平整事务
            vm.smooththingsData = vm.data.flat;
            // 作物空间位置
            vm.spaceData = vm.data.cropSpatial;
            // 作物生长环境
            vm.chatData = vm.data.plantEnvironment.data;
            vm.newOpionsChat = [];
            angular.forEach(vm.chatData, function (item) {
                // let optionsEchat = fmEquipmentChatFactory.getDashboardPlant(item);
                // vm.newOpionsChat.push(optionsEchat);
            });

            // 播种登记
            vm.plantSmoothData = vm.data.plant;
            // 种植过程打理
            vm.plantProduce = vm.data.produce;
            // 实验室检测
            vm.laboratoryData = vm.data.detectionResult.detectionList;
            // 入库检测smooththingsData

            // 入库赋码
            if (vm.data.putInCode && vm.data.putInCode.data) {
                vm.putCodeList = vm.data.putInCode.data;
            }

            dataInit(vm.putCodeList, initPutCode);

            // 商品赋码
            vm.commityCode = vm.data.commodityCode.data;
            angular.forEach(vm.commityCode, function (item) {
                item.text = `https://www.fmbiz.com.cn:10220?code=${item.codeHistoryCode}`;
            });
            vm.evaluateData = vm.data.evaluateData;
            dataInit(vm.evaluateData, initEval);
            vm.circulationData = vm.data.circulationData;
            vm.codeProductData = vm.data.codeProductData;
            return;

        }

        function dataInit(arr, callback) {
            var defer = $q.defer();
            if (arr) {
                if (defer.isCalled) return;
                defer.isCalled = true;
                callback(arr);
            }
            return arr;
        }

        function initIcon(arr) {
            arr.responsibleData.map(function (item) {
                item.stageIcon = [];
                item.stage.map(function (d) {
                    switch (d) {
                        case '耕地阶段':
                            item.stageIcon.push('icon-tudi1');
                            break;
                        case '成长阶段':
                            item.stageIcon.push('icon-shengchangqi');
                            break;
                        case '准备阶段':
                            item.stageIcon.push('icon-shouhuoqi');
                            break;
                        case '播种阶段':
                            item.stageIcon.push('icon-shangpinqi');
                            break;
                        case '运输':
                            item.stageIcon.push('icon-wuliuqi');
                            break;
                        default:
                            item.stageIcon.push('icon-shengchangqi');
                    }
                    return d;
                });
                return item;

            });
        }

        function initEval(arr) {
            arr.evaluate.map(function (item) {
                item.evaluateimages1 = item.evaluateimages;
                return item;
            });
        }

        function initPutCode(arr) {
            if (arr) {
                arr.map(function (item) {
                    let currentItem = item;
                    item.codeInfo.map(function (data) {
                        Object.assign(data, currentItem);
                        delete data.codeInfo;
                        data.text = `https://www.fmbiz.com.cn:10220?code=${data.codeHistoryCode}`;
                        return data;
                    });
                    return item;
                });
            }
            vm.putCodeList = arr.slice(0, 10);

            return vm.putCodeList;
        }

        // 控制图片



        // filter 过滤数组
        vm.myFilter = {};
        vm.noMore = {};
        // vm.changeI = null;
        this.initNum = {
            init: 10,
            landNum: 10,
            decNum: 10,
            sowNum: 10,
            plantNum: 10,
            putNum: 10
        };
        vm.keyWords = ['land', 'dec', 'sow', 'plant', 'putcode'];
        vm.keyWords.map((item) => {
            vm.myFilter[item] = function (data, index) {
                // 默认显示10条检测数据
                if (index <= 9) {
                    return data;
                }
            };

            // 控制暂无更多数据
            vm.noMore[item] = false;
            return item;
        });

    }
    meaudropDown(e) {
        this.meauClip = !this.meauClip;
        e.stopPropagation();
    }
    anchorClick(e, $item, $index) {
        this.tabIndex = $index;
        this.$location.hash($item.id);
        // 每次跳转完毕不计入历史记录
        // $location.replace();
        // $anchorScroll.yOffset = 175;
        this.$anchorScroll();
        e.stopPropagation();
        e.preventDefault();
        return false;
    }
    clickAll() {
        this.meauClip = true;
    }
    dropDown(arrAll, hot) {
        if (!angular.isUndefined(arrAll) && arrAll.length <= 10) {
            return false;
        }
        // 这里这是为了控制每次 ++ 的时候变量
        if (hot === 'dec') {
            this.changeI = this.initNum.landNum += this.initNum.init;
        } else if (hot === 'land') {
            this.changeI = this.initNum.decNum += this.initNum.init;
        } else if (hot === 'sow') {
            this.changeI = this.initNum.sowNum += this.initNum.init;
        } else if (hot === 'plant') {
            this.changeI = this.initNum.plantNum += this.initNum.init;
        } else if (hot === 'putcode') {
            this.changeI = this.initNum.putNum += this.initNum.init;
        }

        let _this = this;

        this.myFilter[hot] = function (data, index, arr) {
            // 默认显示10条检测数据
            if (_this.changeI > arr.length) {
                // 显示暂无更多数据
                _this.noMore[hot] = true;
                return data;
            }
            if (_this.changeI > index) {
                // 如果小于本身的index 则让全部返回 每次会 +  10条
                return arr[index];
            }
        };

    }
}

// function AppCtrl(){
//     console.log('appCtrl')
// }
// module.exports  = AppCtrl;
export {
    AppCtrl
};