function AppCtrl($scope, $rootScope, $state, dashboardServive, $location, $anchorScroll, $timeout, goodsNavTaskList) {
    $rootScope.loaderLoading = true;
    var vm = this;
    $('body').scrollspy({
        target: '#navbar-example'
    });
    vm.jumpTo = function ($event, id) {
        $location.hash(id);
        $anchorScroll();
        $event.preventDefault();
        $event.stopPropagation();
    };
    
    var getCurPageData = function (lists, itemsPerPage, currentPage) {
        var list = [];
        var index = 0;
        var i = null;
        if (currentPage > 1) {
            index = itemsPerPage * (currentPage - 1);
        }
        for (i = index; i < lists.length; i++) {
            if (i < itemsPerPage * currentPage) {
                list.push(lists[i]);
            }
        }
        return list;
    };
    vm.anchorsData = goodsNavTaskList;
    vm.barcode = false; 
    vm.productCodeList = true;
    // 初始化
    vm.initListData = _initListData;
    // 异步拉取数据
    dashboardServive.getData()
        .then(function (response) {
        if (response.data) {
            vm.initListData(response.data)
            $rootScope.loaderLoading = false;
        }
        if (response._ERROR_MESSAGE_) {
            // alert(response._ERROR_MESSAGE_);
            $rootScope.loaderLoading = false;
            vm.barcode = true;
        }
    });
    vm.pageNumber = vm.pageNumber2 = vm.pageNumber3 = vm.pageNumber4 = vm.pageNumber5 = vm.pageNumber6 = vm.pageNumber7 = vm.pageNumber8 = vm.pageNumber9 = vm.pageNumber11 = vm.pageNumber12 = vm.pageNumber13 = vm.pageNumber14 = vm.pageNumber15 = vm.pageNumber16 = 1;
    vm.pageNumber10 = 10;
    vm.lifePageNumber = 5;
    function _initListData(temp) {
        if (temp.productCode) {
            if (temp.productCode === 'false') {
                vm.productCodeList = false;
                vm.anchorsData.map(function(item){
                    if (item.type === 'circulation' || item.type === 'consumption' || item.type === 'evaluation') {
                        item.show = vm.productCodeList;
                    }
                    return item;
                });
            }
        }
        vm.PageData = angular.copy(temp);
        vm.scrollImage = temp.scrollImage;
        vm.knowlage = temp.knowlage;
        // 基本信息
        vm.basicInfo = temp.basicInfo;
        // 公司信息
        vm.registered = temp.registered;
        // 入库在途信息
        vm.logisticsData = temp.logisticsData;
        // 执照证书图品
        vm.zizhiImg = temp.zizhiImg;
        // 检测图片
        vm.imgArr = temp.imgArr;
        if (vm.imgArr && vm.imgArr.length > 0) {
            if (vm.imgArr[0].images && vm.imgArr[0].images.length === 0) {
                vm.imgArr = [];
            }
        }
        // 指数信息
        vm.quality = temp.quality;
        // 包装信息
        vm.starrating = temp.starrating;
        // 收前检测
        vm.shouqianjiance = temp.automaticDetection;
        if (temp.automaticDetection && temp.automaticDetection.storageDetectionValue) {
            vm.shouqianjiance.storageDetectionValue = getCurPageData(temp.automaticDetection.storageDetectionValue, vm.pageNumber10, vm.pageNumber);
            vm.viewmore = Math.ceil(vm.PageData.automaticDetection.storageDetectionValue.length / 10);
        }
        // 入库检测
        vm.rukujiance = temp.storageDetection;
        if (temp.storageDetection && temp.storageDetection.automaticDetectionValue) {
            vm.rukujiance.automaticDetectionValue = getCurPageData(temp.storageDetection.automaticDetectionValue, vm.pageNumber10, vm.pageNumber2);
            vm.viewmore2 = Math.ceil(vm.PageData.storageDetection.automaticDetectionValue.length / 10);
        }
        // 营养价值
        vm.yingyang = temp.nutritional;
        if (temp.nutritional && temp.nutritional.nutritionalValue) {
            vm.yingyang.nutritionalValue = getCurPageData(temp.nutritional.nutritionalValue, vm.pageNumber10, vm.pageNumber3);
            vm.viewmore3 = Math.ceil(vm.PageData.nutritional.nutritionalValue.length / 10);
        }
        // 农药使用情况
        vm.nongyao = temp.pesticide;
        if (temp.pesticide && temp.pesticide.pesticideValue) {
            vm.viewmore4 = Math.ceil(vm.PageData.pesticide.pesticideValue.length / 10);
            vm.nongyao.pesticideValue = getCurPageData(temp.pesticide.pesticideValue, vm.pageNumber10, vm.pageNumber4);
            vm.nongyao.pesticideValue.map(function(item){
                item.areaDosage = Number(item.areaDosage.replace('g', '')).toFixed(2) + 'g';
                item.fromData = item.fromData.replace(/-/g, '/');
                return item;
            });
        }
        // 肥料使用情况
        vm.feiliao = temp.fertilizer;
        if (temp.fertilizer && temp.fertilizer.fertilizerValue) {
            vm.viewmore5 = Math.ceil(vm.PageData.fertilizer.fertilizerValue.length / 10);
            vm.feiliao.fertilizerValue = getCurPageData(temp.fertilizer.fertilizerValue, vm.pageNumber10, vm.pageNumber5);
            vm.feiliao.fertilizerValue.map(function(item){
                item.areaDosage = Number(item.areaDosage.replace('g', '')).toFixed(2) + 'g';
                item.fromData = item.fromData.replace(/-/g, '/');
                return item;
            });
        }
        // 病虫害情况
        vm.bingchonghai = temp.plantDiseases;
        if (temp.plantDiseases && temp.plantDiseases.plantDiseasesValue) {
            vm.viewmore6 = Math.ceil(vm.PageData.plantDiseases.plantDiseasesValue.length / 10);
            vm.bingchonghai.plantDiseasesValue = getCurPageData(temp.plantDiseases.plantDiseasesValue, vm.pageNumber10, vm.pageNumber6);
            vm.bingchonghai.plantDiseasesValue.map(function(item) {
                item.fromData = item.fromData.replace(/-/g, '/');
                item.description = item.description.replace(/<(S*?)[^>]*>.*?|<.*?\/>/g, '');
            });
        }
        // 人员参与情况
        vm.renyuan = temp.personParty;
        if (temp.personParty && temp.personParty.responsibleData) {
            vm.viewmore7 = Math.ceil(vm.PageData.personParty.responsibleData.length / 10);
            vm.renyuan.responsibleData = getCurPageData(temp.personParty.responsibleData, vm.pageNumber10, vm.pageNumber7);
            responsMan(vm.renyuan.responsibleData);
        }
        // 传感器数据
        if (temp.sensorData && temp.sensorData.data) {
            vm.sensorData = temp.sensorData.data;
        }
        // 流转情况
        vm.liuzhuan = temp.circulation;
        if (temp.circulation && temp.circulation.circulationValue) {
            vm.viewmore8 = Math.ceil(vm.PageData.circulation.circulationValue.length / 10);
            vm.liuzhuan.circulationValue = getCurPageData(temp.circulation.circulationValue, vm.pageNumber10, vm.pageNumber8);
        }
        // // 过程消耗情况
        vm.xiaohao = temp.consumption;
        if (temp.consumption && temp.consumption.consumptionValue) {
            vm.viewmore9 = Math.ceil(vm.PageData.consumption.consumptionValue.length / 10);
            vm.xiaohao.consumptionValue = getCurPageData(temp.consumption.consumptionValue, vm.pageNumber10, vm.pageNumber9);
            vm.xiaohao.consumptionValue.map(function(item) {
                item.startDate = item.startDate.replace(/-/g, '/');
                item.endDate = item.endDate.replace(/-/g, '/');
            });
        }

        // 全生命事件信息
        vm.shengmingshijian = temp.lifeCycle;
        if(temp.lifeCycle && temp.lifeCycle.lifeCycleValue) {
            vm.PageData.lifeCycle.lifeCycleValue.map(function(item) {
                if (item.seedlingsName === '耕地阶段') {
                    vm.viewmore10 = Math.ceil(item.seedValueList.length / 5);
                }
                if (item.seedlingsName === '播种阶段') {
                    vm.viewmore11 = Math.ceil(item.seedValueList.length / 5);
                }
                if (item.seedlingsName === '准备阶段') {
                    vm.viewmore12 = Math.ceil(item.seedValueList.length / 5);
                }
                if (item.seedlingsName === '成长阶段') {
                    vm.viewmore13 = Math.ceil(item.seedValueList.length / 5);
                }
                if (item.seedlingsName === '成熟阶段') {
                    vm.viewmore14 = Math.ceil(item.seedValueList.length / 5);
                }
                if (item.seedlingsName === '收获阶段') {
                    vm.viewmore15 = Math.ceil(item.seedValueList.length / 5);
                }
                return item;
            })
            vm.shengmingshijian.lifeCycleValue.map(function(item) {
                if (item.seedlingsName === '耕地阶段') {
                    item.viewmore10 = vm.viewmore10;
                    item.seedValueList = getCurPageData(item.seedValueList, vm.lifePageNumber, vm.pageNumber11);
                }
                if (item.seedlingsName === '播种阶段') {
                    item.viewmore11 = vm.viewmore11;
                    item.seedValueList = getCurPageData(item.seedValueList, vm.lifePageNumber, vm.pageNumber12);
                }
                if (item.seedlingsName === '准备阶段') {
                    item.viewmore12 = vm.viewmore12;
                    item.seedValueList = getCurPageData(item.seedValueList, vm.lifePageNumber, vm.pageNumber13);
                }
                if (item.seedlingsName === '成长阶段') {
                    item.viewmore13 = vm.viewmore13;
                    item.seedValueList = getCurPageData(item.seedValueList, vm.lifePageNumber, vm.pageNumber14);
                }
                if (item.seedlingsName === '成熟阶段') {
                    item.viewmore14 = vm.viewmore14;
                    item.seedValueList = getCurPageData(item.seedValueList, vm.lifePageNumber, vm.pageNumber15);
                }
                if (item.seedlingsName === '收获阶段') {
                    item.viewmore15 = vm.viewmore16;
                    item.seedValueList = getCurPageData(item.seedValueList, vm.lifePageNumber, vm.pageNumber16);
                }
                item.seedValueList.map(function(data) {
                    data.startDate = data.startDate.replace(/-/g, '/');
                    data.endDate = data.endDate.replace(/-/g, '/');
                    return data;
                });
                // item.seedValueList = []
                return item;
            });

            // let [list, two, three, four, five] =vm.shengmingshijian.lifeCycleValue;
            // debugger
            // console.log(one, 'dsadasd')
            let [list, two, three, four, five, fivse] =vm.shengmingshijian.lifeCycleValue;
            
            if(!list.seedValueList.length && !two.seedValueList.length && !three.seedValueList.length && !four.seedValueList.length && !five.seedValueList.length && !fivse.seedValueList.length) {
                vm.shengmingshijian.lifeCycleValue = [];
                
            }
            
        }
        
        
        // vm.shengmingshijian.lifeCycleValue = []
        // vm.shengmingshijian.nutritionalValue = getCurPageData(temp.pesticide.nutritionalValue, vm.pageNumber2, vm.pageNumber);

        // 星星评价
        if (vm.starrating && vm.starrating.length > 0) {
            vm.starrating.map(function (item) {
                if (item.value instanceof Array) {
                    return item;
                } else {
                    item.value = _returnStar(item.value);
                }
                // console.log(item.value);
                return item;
            });
        }
        // 轮播图
        if (vm.scrollImage && vm.scrollImage.length > 0) {
            let timer = $timeout(function () {
                $('#full_feature').swipeslider();
                $timeout.cancel(timer);
            }, 0);
        }

    }
    // 资讯轮播
    $scope.renderFinish = function () {
        $('#zixun_feature').swipeslider({
            sliderHeight: 0
        });
    };
    function _returnStar(num) {
        let starArr = [{
            star: false
        }, {
            star: false
        }, {
            star: false
        }, {
            star: false
        }, {
            star: false
        }];
        for (let i = 0; i < num; i++) {
            starArr[i].star = true;
        }
        return starArr;
    }
    // 人员图标排序
    function responsMan(data) {
        data.map(function (item) {
            var mp = new Map();
            for (var i = 0; i < item.iconValue.length; i++) {
                var iconValue = item.iconValue[i];
                // 阶段归类
                switch (iconValue) {
                    case '耕地阶段':
                    case '土地规划':
                        item.iconValue[i] = '土地规划';
                        mp.set(1, item.iconValue[i]);
                        break;
                    case '准备阶段':
                    case '播种阶段':
                    case '成长阶段':
                    case '生长期':
                        item.iconValue[i] = '生长期';
                        mp.set(2, item.iconValue[i]);
                        break;
                    case '收获阶段':
                    case '成熟阶段':
                    case '收获期':
                        item.iconValue[i] = '收获期';
                        mp.set(3, item.iconValue[i]);
                        break;
                    case '商品阶段':
                    case '商品期':
                        item.iconValue[i] = '商品期';
                        mp.set(4, item.iconValue[i]);
                        break;
                    default:
                        item.iconValue[i] = '物流';
                        mp.set(5, item.iconValue[i]);
                        break;
                }
            }
            var keyArr = new Array();
            var valueArr = new Array();
            for (var kv of mp) {
                keyArr.push(kv[0]);
            }
            keyArr.sort();
            keyArr.forEach(function (x) {
                valueArr.push(mp.get(x))

            })
            item.iconValue = valueArr;
            return item;
        });
    }
    vm.dropDown = function () {
        vm.pageNumber++;
        vm.shouqianjiance.storageDetectionValue = vm.shouqianjiance.storageDetectionValue.concat(getCurPageData(vm.PageData.automaticDetection.storageDetectionValue, vm.pageNumber10, vm.pageNumber));
    };
    vm.rukuDrop = function () {
        vm.pageNumber2++;
        vm.rukujiance.automaticDetectionValue = vm.rukujiance.automaticDetectionValue.concat(getCurPageData(vm.PageData.storageDetection.automaticDetectionValue, vm.pageNumber10, vm.pageNumber2));
    };
    vm.yingyangDrop = function () {
        vm.pageNumber3++;
        vm.yingyang.nutritionalValue = vm.yingyang.nutritionalValue.concat(getCurPageData(vm.PageData.nutritional.nutritionalValue, vm.pageNumber10, vm.pageNumber3));
    };
    vm.nongyaoDrop = function () {
        vm.pageNumber4++;
        vm.nongyao.pesticideValue = vm.nongyao.pesticideValue.concat(getCurPageData(vm.PageData.pesticide.pesticideValue, vm.pageNumber10, vm.pageNumber4));
        vm.nongyao.pesticideValue.map(function(item){
            item.areaDosage = Number(item.areaDosage.replace('g', '')).toFixed(2) + 'g';
            item.fromData = item.fromData.replace(/-/g, '/');
            return item;
        });
    };
    vm.feiliaoDrop = function () {
        vm.pageNumber5++;
        vm.feiliao.fertilizerValue = vm.feiliao.fertilizerValue.concat(getCurPageData(vm.PageData.fertilizer.fertilizerValue, vm.pageNumber10, vm.pageNumber5));
        vm.feiliao.fertilizerValue.map(function(item){
            item.areaDosage = Number(item.areaDosage.replace('g', '')).toFixed(2) + 'g';
            item.fromData = item.fromData.replace(/-/g, '/');
            return item;
        });
    };
    vm.bingchonghaiDrop = function () {
        vm.pageNumber6++;
        vm.bingchonghai.plantDiseasesValue = vm.bingchonghai.plantDiseasesValue.concat(getCurPageData(vm.PageData.plantDiseases.plantDiseasesValue, vm.pageNumber10, vm.pageNumber6));
        vm.bingchonghai.plantDiseasesValue.map(function(item) {
            item.fromData = item.fromData.replace(/-/g, '/');
            item.description = item.description.replace(/<(S*?)[^>]*>.*?|<.*?\/>/g, '');
            return item;
        });
    };
    vm.renyuanDrop = function () {
        vm.pageNumber7++;
        vm.renyuan.responsibleData = vm.renyuan.responsibleData.concat(getCurPageData(vm.PageData.personParty.responsibleData, vm.pageNumber10, vm.pageNumber7));
        responsMan(vm.renyuan.responsibleData);
    };
    vm.liuzhuaniDrop = function () {
        vm.pageNumber8++;
        vm.liuzhuan.circulationValue = vm.liuzhuan.circulationValue.concat(getCurPageData(vm.PageData.circulation.circulationValue, vm.pageNumber10, vm.pageNumber8));
    };
    vm.xiaohaoDrop = function () {
        vm.pageNumber9++;
        vm.xiaohao.consumptionValue = vm.xiaohao.consumptionValue.concat(getCurPageData(vm.PageData.consumption.consumptionValue, vm.pageNumber10, vm.pageNumber9));
        vm.xiaohao.consumptionValue.map(function(item) {
            item.startDate = item.startDate.replace(/-/g, '/');
            item.endDate = item.endDate.replace(/-/g, '/');
            return item;
        });
    };
    vm.lifeCycleDrop = function () {
        vm.PageData.lifeCycle.lifeCycleValue.map(function(item) {
            if (item.seedlingsName === '耕地阶段') {
                vm.SeedLandValue = angular.copy(item.seedValueList);
            }
            if (item.seedlingsName === '播种阶段') {
                vm.SeedSowValue = angular.copy(item.seedValueList);
            }
            if (item.seedlingsName === '准备阶段') {
                vm.SeedPrepareValue = angular.copy(item.seedValueList);
            }
            if (item.seedlingsName === '成长阶段') {
                vm.SeedGrowthValue = angular.copy(item.seedValueList);
            }
            if (item.seedlingsName === '成熟阶段') {
                vm.SeedMatureValue = angular.copy(item.seedValueList);
            }
            if (item.seedlingsName === '收获阶段') {
                vm.SeedHarvestValue = angular.copy(item.seedValueList);
            }
        })
        vm.shengmingshijian.lifeCycleValue.map(function(item) {
            if(item.seedlingsName === '耕地阶段') {
                if (item.seedValueList.length >= 5) {
                    vm.pageNumber11++;
                    item.seedValueList = item.seedValueList.concat(getCurPageData(vm.SeedLandValue, vm.lifePageNumber, vm.pageNumber11));
                }
            }
            if(item.seedlingsName === '播种阶段') {
                if (item.seedValueList.length >= 5) {
                    vm.pageNumber12++;
                    item.seedValueList = item.seedValueList.concat(getCurPageData(vm.SeedSowValue, vm.lifePageNumber, vm.pageNumber12));                    
                }
            }
            if(item.seedlingsName === '准备阶段') {
                if (item.seedValueList.length >= 5) {
                    vm.pageNumber13++;
                    item.seedValueList = item.seedValueList.concat(getCurPageData(vm.SeedPrepareValue, vm.lifePageNumber, vm.pageNumber13));
                }
            }
            if(item.seedlingsName === '成长阶段') {
                if (item.seedValueList.length >= 5) {
                    vm.pageNumber14++;
                    item.seedValueList = item.seedValueList.concat(getCurPageData(vm.SeedGrowthValue, vm.lifePageNumber, vm.pageNumber14));                    
                }
            }
            if(item.seedlingsName === '成熟阶段') {
                if (item.seedValueList.length >= 5) {
                    vm.pageNumber15++;
                    item.seedValueList = item.seedValueList.concat(getCurPageData(vm.SeedMatureValue, vm.lifePageNumber, vm.pageNumber15));                    
                }
            }
            if(item.seedlingsName === '收获阶段') {
                if (item.seedValueList.length >= 5) {
                    vm.pageNumber16++;
                    item.seedValueList = item.seedValueList.concat(getCurPageData(vm.SeedHarvestValue, vm.lifePageNumber, vm.pageNumber16));                    
                }
            }
            item.seedValueList.map(function(data) {
                data.startDate = data.startDate.replace(/-/g, '/');
                data.endDate = data.endDate.replace(/-/g, '/');
                return data;
            });
        })
    }

    vm.canshu = true;
    vm.jiance = true;
    vm.ruku = true;
    vm.wuliu = true;
    vm.xiaoshou = true;

    vm.showPanel = function (type) {
        vm[type] = !vm[type];
    };
    // 评价
    /* vm.comments = [{
            'headPic': 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3742948713,2733458390&fm=27&gp=0.jpg',
            'nickname': '桃**夭',
            'commodityCode': '01591324',
            'formDate': '2017-12-28 08:23',
            'specification': '5斤装',
            'channel': '河马生鲜',
            'description': '结缘原始点，来买点姜，味道真的很辛辣，吃了这个姜感觉市场买的大块姜再也不能入口，一点味道都没有！真不错，发货还快，价格便宜，品质也不错，每天早晚都会用这个姜加上小麦胚芽加红枣、糖打上一杯汁真的很美味，还能给身体去湿气，感谢商家良心作产品，会回购的。',
            'id': '10001',
            'images': [{
                url: 'img/jiang1.png'
            }, {
                url: 'img/jiang2.png'
            }, {
                url: 'img/jiang3.png'
            }]
        },
        {
            'headPic': 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1863250278,3643849680&fm=27&gp=0.jpg',
            'nickname': '花**子',
            'commodityCode': '02358452',
            'formDate': '2017-12-27 13:54',
            'specification': '5斤装',
            'channel': '天猫超市',
            'description': '速度快是最大优点， 产品品质好质量好，又新鲜又实惠包装非常仔细． 整个箱子的空隙护用品都用塑料袋包着防止泄露． 都用空气袋充满，不会有物品的移位和晃动．零食 什么的都很美味，日用品都是正品，真的是一直都 在天猫超市购买牛奶啊日用品什么的．比在超市买 方便多了好嘛．最重要的是真的不用自己提呢一和 在超市买的味道一样，还比超市便宜．看来以后还 是要在网上买合适.',
            'id': '10001',
            'images': [{
                url: 'img/jiang2.png'
            }, {
                url: 'img/jiang5.png'
            }, {
                url: 'img/jiang3.png'
            }]
        }
    ]; */
    // 资讯
    vm.message = {
        "messageValue": [{
                "sildeMessageList": [{
                    "imgSrc": "null",
                    "title": "猕猴桃的小知识",
                    "content": "成人每日如果吃两个猕猴桃，就能补充人体每天需要纤维量的……"
                }],
                "imgUrl": "null",
                "name": "天王牌猕猴桃",
                "doasge": "2500g",
                "quality": "一等品",
                "placeName": "四川省彭州市",
                "archives": "GB/T 31121-2014"
            },
            {
                "sildeMessageList": [{
                    "imgSrc": "null",
                    "title": "猕猴桃的小知识",
                    "content": "成人每日如果吃两个猕猴桃，就能补充人体每天需要纤维量的……"
                }],
                "imgUrl": "null",
                "name": "天王牌猕猴桃",
                "doasge": "2500g",
                "quality": "一等品",
                "placeName": "四川省彭州市",
                "archives": "GB/T 31121-2014"
            },
            {
                "sildeMessageList": [{
                    "imgSrc": "null",
                    "title": "猕猴桃的小知识",
                    "content": "成人每日如果吃两个猕猴桃，就能补充人体每天需要纤维量的……"
                }],
                "imgUrl": "null",
                "name": "天王牌猕猴桃",
                "doasge": "2500g",
                "quality": "一等品",
                "placeName": "四川省彭州市",
                "archives": "GB/T 31121-2014"
            },
            {
                "sildeMessageList": [{
                    "imgSrc": "null",
                    "title": "猕猴桃的小知识",
                    "content": "成人每日如果吃两个猕猴桃，就能补充人体每天需要纤维量的……"
                }],
                "imgUrl": "null",
                "name": "天王牌猕猴桃",
                "doasge": "2500g",
                "quality": "一等品",
                "placeName": "四川省彭州市",
                "archives": "GB/T 31121-2014"
            }

        ]
    }

    vm.messagess = {
        name: '生姜的小知识，你肯定不知道',
        data: ['1.生姜可以增强食欲，驱寒散邪，抗衰老，抗菌，促进头发生长，治疗中暑，治疗晕车晕船，用处非常广泛。用于风寒感冒轻症，可单煎或配红糖、葱白煎服；治风寒感冒重者，以增强发汗解表之力。',
        '2.生姜治疗胃寒呕吐，配半夏，即小半夏汤；治寒犯中焦之胃脘冷痛、食少、呕吐者，与高良姜、胡椒等温里散寒药配伍；治脾胃虚寒者，与人参、白术等补益脾气药同用；治胃热呕吐者，须与黄连、竹茹等清胃止呕药同用。',
        '3.生姜止牙痛：取一块姜，切除一小块下来。放入口中。咬在痛牙处，慢慢地你会发现你的牙痛会减轻很多。这时候再出门看医生，也会令自己会舒服很多。']
    }
    $rootScope.items = [];
    vm.viewPicture = viewPicture;

    function viewPicture(images) {
        $rootScope.items = images.map(function (item) {
            var imgSrc = item + '?size=original';
            if (item instanceof Object) {
                imgSrc = item.url + '?size=original';
            }
            return {
                src: imgSrc,
                w: 600,
                h: 400
            };
        });
    }

    vm.personIcons = {
        '耕地阶段': 'icon-tudi',
        // "播种阶段": 'icon-shengchangqi pro-orange',
        "土地规划": 'icon-tudi',
        "生长期": 'icon-shengchangqi pro-orange',
        "收获期": 'icon-shouhuoqi pro-yellow',
        "商品期": 'icon-shangpinqi pro-blue',
        "物流": 'icon-wuliuxinxicopy pro-red'
    };


    // $scope.anchors = true;
    vm.clickAll = function (e) {
        var target = e.target;
        if (!angular.element(target).hasClass('iconfont icon-shouhui') && !angular.element(target).hasClass('aa') && !angular.element(target).hasClass('anchor-icon')) {
            angular.element('.anchor-list').removeClass('active1');
            angular.element('.anchor-icon').addClass('anchor-icon1');
            angular.element('.anchor-icon .iconfont').removeClass('icon-shouhui').addClass('icon-caidan');
        }
    }
    vm.anchorHidden = function (e) {
        var target = e.target;
        if (angular.element(target).hasClass('iconfont icon-caidan') || angular.element(target).hasClass('anchor-icon1')) {
            angular.element('.anchor-icon .iconfont').removeClass('icon-caidan').addClass('icon-shouhui');
            angular.element('.anchor-icon').removeClass('anchor-icon1');
            angular.element('.anchor-list').addClass('active1');
        } else {
            angular.element('.anchor-icon .iconfont').removeClass('icon-shouhui').addClass('icon-caidan');
            angular.element('.anchor-icon').addClass('anchor-icon1');
            angular.element('.anchor-list').removeClass('active1');
        }
        
    }

    vm.itemNum = 0;
    $scope.anchorClick = function (event, item, index) {
        vm.itemNum = index;
        vm.jumpTo(event, item.type);
        event.preventDefault();
        event.stopPropagation();

    }

    return vm;
}


AppCtrl.$inject = ['$scope', '$rootScope', '$state', 'dashboardServive', '$location', '$anchorScroll', '$timeout', 'goodsNavTaskList'];

module.exports = AppCtrl;