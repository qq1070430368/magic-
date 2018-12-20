import { runInNewContext } from 'vm';

class AppCtrl {
    static get $inject() {
        return ['$state', '$rootScope', '$scope', '$http', 'dashboardServive', 'cropNavTaskList', '$sce', '$q', '$location', '$anchorScroll', 'fmtoast'];
    }
    constructor($state, $rootScope, $scope, $http, dashboardServive, cropNavTaskList, $sce, $q, $location, $anchorScroll, fmtoast) {
        let vm = this;
        vm.fmtoast = fmtoast;
        vm.$rootScope = $rootScope;
        vm.$scope = $scope;
        vm.$location = $location;
        // 控制评级登记
        vm.flagIndex = {
            // star1: 0,
            // start2: 0,
            // start3: 0
        };
        // 存放星评数据
        vm.flagValue = [];
        vm.$anchorScroll = $anchorScroll;
        vm.maskComponent = {
            MASK: false
        };
        // vm.meaudropDown = meaudropDown;
        vm.viewMake = true;
        // 控制评价按钮显示
        vm.viewShare = true;
        vm.viewBtn = false;
        vm.tabIndex = 0;
        vm.starIndex = 5; // 默认是5颗星
        vm.meauClip = true;
        vm.noData = false;
        $rootScope.loaderLoading = true;
        // $rootScope.app.components.maskBlack = true;
        // $rootScope.$on('closeMask', (ev, data) => {

        // })
        init();

        function init() {
            // 初始化页面模板
            vm.cropNavTaskList = cropNavTaskList;
            dashboardServive.getData()
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
            vm.data.starRate = [
                {
                    'name': '口感',
                    'description': '（味道、冷热、软硬评分）',
                    'value': '5'
                },
                {
                    'name': '外观',
                    'description': '（形状、色泽、腐烂评分）',
                    'value': '5'
                },
                {
                    'name': '包装',
                    'description': '（重量、造型、破损评分）',
                    'value': '5'
                }
            ];
            vm.data.starRate.map((item, index) => {
                item.star = [];
                for (let i = 0; i < vm.starIndex; i++) {
                    item.star.push({
                        state: false,
                        type: `star${index}`
                    });
                }
                return item;
            });
            vm.noData = false;
            // 评价星评
            vm.starRate = vm.data.starRate;
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
            vm.codeWolfArr = [];
            if (arr && arr.length > 0) {
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

                angular.forEach(arr, (item) => {
                    item.codeInfo.map((currentItem)=> vm.codeWolfArr.push(currentItem));
                });
            }
            return vm.putCodeList;
        }

        // 控制图片
        $rootScope.items = [];
        vm.viewPicture = viewPicture;

        function viewPicture(images) {
            var pullImg = [];
            if (typeof images === 'string') {
                pullImg.push(images);
                images = pullImg;
            }
            $rootScope.items = images.map(function (item) {
                var imgSrc = item + '?size=original';
                if (item instanceof Object) {
                    imgSrc = item.image + '?size=original';
                }
                return {
                    src: imgSrc,
                    w: 600,
                    h: 400
                };
            });
        }


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
            putNum: 10,
            putInNum: 10
        };
        vm.keyWords = ['land', 'dec', 'sow', 'plant', 'putcode', 'putIncode'];
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

        // 评价组件销毁
        vm.destroy = () => {
            this.flagIndex = [];
            this.flagValue = [];
            this.evaluateData = '';
        };

    }
    meaudropDown(e) {
        this.meauClip = !this.meauClip;
        if (!this.meauClip) {
            this.viewShare = false;
        } else {
            this.viewShare = true;
        }
        e.stopPropagation();
    }
    anchorClick(e, $item, $index) {
        this.tabIndex = $index;
        this.$location.hash($item.id);
        // 每次跳转完毕不计入历史记录
        this.$location.replace();
        // $anchorScroll.yOffset = 175;
        this.$anchorScroll();
        e.stopPropagation();
        e.preventDefault();
        return false;
    }
    clickAll() {
        this.meauClip = true;
        this.viewShare = true;
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
        } else if (hot === 'putIncode') {
            this.changeI = this.initNum.putInNum += this.initNum.init;
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
    maskComponentOpen(ev) {
        console.log('open mask components');
        this.$rootScope.app.components.maskBlack = true;
        this.maskComponent.MASK = true;

    }
    saveMaskFun() {
        // promise.then();
        this.$rootScope.app.components.maskBlack = false;
        this.maskComponent.MASK = false;
        this.fmtoast.pop('提交成功', 1000);
    }
    closeMaskFun() {
        this.$rootScope.app.components.maskBlack = false;
        this.maskComponent.MASK = false;
        // 销毁组件
        this.destroy();
    }
    findStarFun(data, index) {
        this.flagIndex[data.type] = index;
        this.flagValue = this.flagIndex;
    }
}

export {
    AppCtrl
};