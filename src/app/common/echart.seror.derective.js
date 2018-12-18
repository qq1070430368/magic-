export default
    angular.module('echartsSeror', [])
        .directive('fmEquipmentChat', () => new fmEquipmentChat())
        .name


class fmEquipmentChat {
    constructor() {
        this.restrict = 'A'
        this.scope = {
            equipmentData: '='
        },
            this.template = '<div fm-echart e-data="equipmentData" style="height: 200px" class="per-full-height" ng-if="equipmentData"></div>'
    }
    link($scope, element, attrs) {
        console.log($scope.equipmentData, '数据d')
        let lineStyle = {
            color: 'rgba(0, 0, 0, .3)'
        };
        let axisTextStyle = {
            fontSize: 12,
            color: 'rgba(0, 0, 0, .5)'
        };
        if ($scope.equipmentData) {
            $scope.equipmentData = initSensorDetailData('now', $scope.equipmentData, 'month');
        }

        // $scope.$watch('equipmentData', refeshData);
        function initSensorDetailData(row, monthData, type) {
            let optionsTitle = [];
            for (let i = 1; i <= monthData.multi; i++) {
                // 拿出最大值
                if (monthData[i].maxList.length > 0 && monthData[i].minList.length > 0) {
                    const maxDateArr = new Set(monthData[i].maxList);
                    const maxDate = Math.max(...maxDateArr);
                    // 拿出最小值
                    const minDateArr = new Set(monthData[i].minList);
                    const minDate = Math.max(...minDateArr);
                    optionsTitle.push(
                        {
                            title: monthData[i].description,
                            unit: monthData[i].unit,
                            max: maxDate,
                            min: minDate
                        }
                    );
                }

            }
            var maxAlertList = Number(monthData['1'].alertRang.maxAlert);
            var maxyAxisList;
            monthData['1'].maxList.map(function (item) {
                item = Number(item);
                return item;
            });
            var maxs = Math.max.apply(null, monthData['1'].maxList);
            if (maxs > maxAlertList) {
                maxyAxisList = maxs;
            } else {
                maxyAxisList = maxAlertList;
            }
            let sensorMonthOpt = {
                grid: {
                    show: false,
                    top: '3%',
                    bottom: '12%',
                    right: '4%',
                    left: '2%'
                },
                optionsTitle: optionsTitle,
                tooltip: {
                    trigger: 'axis',
                    formatter: function (params) {
                        var res = '<div class="environment-top">传感器数据<span>（2018/' + params[0].name.replace('-', '/') + '）</span></div>';
                        if (params.length > 3) {
                            res += '<div class="environment-con environment-con-border"><div>名称</div><div class="environment-you">' + monthData[1].description + '</div><div class="environment-you">' + monthData[2].description + '</div></div>';
                            let i;
                            for (i = 0; i < params.length - 3; i++) {
                                res += '<div class="environment-con"><div>' + params[i].seriesName + '</div> <div class="environment-you">' + params[i].value + monthData[1].unit + '</div> <div class="environment-you">' + params[i + 3].value + monthData[2].unit + '</div></div>';
                            }
                        } else {
                            res += '<div class="environment-con environment-con2 environment-con-border"><div>名称</div><div class="environment-bor-right environment-you">' + monthData[1].description + '</div></div>';
                            let i;
                            for (i = 0; i < params.length; i++) {
                                res += '<div class="environment-con environment-con2"><div>' + params[i].seriesName + '</div> <div class="environment-bor-right environment-you">' + params[i].value + monthData[1].unit + '</div></div>';
                            }
                        }
                        return res;
                    },
                    confine: true,
                    textStyle: {
                        fontSize: 12
                    }
                },
                xAxis: {
                    axisLabel: {
                        margin: 8,
                        textStyle: {
                            fontSize: 12,
                            color: '#8e8e93',
                            padding: [0, 0, 0, -10]
                        },
                        align: 'left',
                        // interval: 2,
                        showMaxLabel: true,
                        showMinLabel: true
                    },
                    splitNumber: 10,
                    nameGap: '35',
                    axisPointer: {
                        show: true
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#8e8e93',
                        }
                    },
                    axisTick: {
                        alignWithLabel: true
                    },
                    data: monthData.dateList.map(function (item) {
                        let arr = '';
                        if (type === 'day') {
                            arr = item.split('');
                            item = arr[6] + arr[7] + '日' + item.split(':')[1] + '时';
                        } else {
                            arr = item.split('');
                            item = arr[4] + arr[5] + '/' + arr[6] + arr[7];
                        }

                        return item;
                    })
                },
                yAxis: [{
                    // name: monthData[1].description + '(' + monthData[1].unit + ')',
                    // nameLocation: (type === 'day') ? 'center' : 'end',
                    axisLabel: {
                        margin: 10
                    },
                    max: maxyAxisList,
                    nameGap: '0',
                    nameLocation: 'center',
                    splitLine: {
                        show: false
                    },
                    show: false,
                    type: 'value'

                }],
                visualMap: [{
                    show: false,
                    align: 'top',
                    top: 0,
                    right: 0,
                    pieces: [{
                        lte: Number(monthData['1'].alertRang.minAlert),
                        color: '#FF0000'
                    }, {
                        gt: Number(monthData['1'].alertRang.minAlert),
                        lte: Number(monthData['1'].alertRang.minWarning),
                        color: '#FFB800'
                    }, {
                        gt: Number(monthData['1'].alertRang.minWarning),
                        lte: Number(monthData['1'].alertRang.maxWarning),
                        color: '#81B441'
                    }, {
                        gt: Number(monthData['1'].alertRang.maxWarning),
                        lte: Number(monthData['1'].alertRang.maxAlert),
                        color: '#FFB800'
                    }, {
                        gt: Number(monthData['1'].alertRang.maxAlert),
                        color: '#FF0000'
                    }],
                }],
                series: [{
                    name: '最小值',
                    type: 'line',
                    data: monthData['1'].minList || [],
                    lineStyle: {
                        normal: {
                            // color: ['#0b61a4'],
                            width: 1
                        }
                    },
                    smooth: true,
                },
                {
                    name: '最大值',
                    type: 'line',
                    data: monthData['1'].maxList || [],
                    lineStyle: {
                        normal: {
                            // color: ['#66a3d2'],
                            width: 1
                        }
                    },
                    smooth: true,

                },
                {
                    name: '平均值',
                    type: 'line',
                    data: monthData['1'].avgList || [],
                    lineStyle: {
                        normal: {
                            // color: ['#B6A2DE'],
                            width: 1
                        }
                    },
                    smooth: true
                }
                ]
            };

            // let visualMapData = [
            //     {
            //         name: '预警值',
            //         warningXiao: '30',
            //         warningGao: '60'
            //     }, {
            //         name: '正常值',
            //         warningXiao: '40',
            //         warningGao: '70'
            //     }, {
            //         name: '报警值',
            //         warningXiao: '10',
            //         warningGao: '80'
            //     }
            // ]
            // visualMapData.map(function(item){
            //     if (item.name === '预警值') {
            //         sensorMonthOpt.visualMap.pieces[0].lte = Math.floor(item.warningXiao);
            //     }
            //     if (item.name === '正常值') {
            //         sensorMonthOpt.visualMap.pieces[0].lte = Math.floor(item.warningXiao);
            //     }
            //     if (item.name === '报警值') {
            //         sensorMonthOpt.visualMap.pieces[0].lte = Math.floor(item.warningXiao);
            //     }
            // })

            // 增加y轴
            let yAxisMap = null;
            let seriesMap = null;
            let visualMaps = null;
            let visualMaps1 = null;
            let visualMaps2 = null;
            if (monthData['2']) {
                var maxAlertList2 = Number(monthData['2'].alertRang.maxAlert);
                var maxyAxisList2;
                monthData['2'].maxList.map(function (item) {
                    item = Number(item);
                    return item;
                });
                var maxs2 = Math.max.apply(null, monthData['2'].maxList);
                if (maxs2 > maxAlertList2) {
                    maxyAxisList2 = maxs2;
                } else {
                    maxyAxisList2 = maxAlertList2;
                }
                yAxisMap = {
                    name: monthData[2].description + '(' + monthData[2].unit + ')',
                    nameLocation: (type === 'day') ? 'center' : 'end',
                    splitLine: {
                        show: false
                    },
                    max: Number(monthData['2'].alertRang.maxAlert),
                    type: 'value',
                    show: false,
                    axisLine: {
                        lineStyle: lineStyle
                    },
                    axisLabel: {
                        margin: 10,
                        textStyle: axisTextStyle
                    },
                    nameGap: 35,
                };
                visualMaps = {
                    type: 'piecewise',
                    seriesIndex: 3,
                    align: 'right',
                    show: false,
                    pieces: [{
                        lte: Number(monthData['2'].alertRang.minAlert),
                        color: 'blueviolet'
                    }, {
                        gt: Number(monthData['2'].alertRang.minAlert),
                        lte: Number(monthData['2'].alertRang.minWarning),
                        color: 'palevioletred'
                    }, {
                        gt: Number(monthData['2'].alertRang.minWarning),
                        lte: Number(monthData['2'].alertRang.maxWarning),
                        color: '#55ACEE'
                    }, {
                        gt: Number(monthData['2'].alertRang.maxWarning),
                        lte: Number(monthData['2'].alertRang.maxAlert),
                        color: 'palevioletred'
                    }, {
                        gt: Number(monthData['2'].alertRang.maxAlert),
                        color: 'blueviolet'
                    }],
                };
                visualMaps1 = {
                    type: 'piecewise',
                    seriesIndex: 4,
                    align: 'right',
                    show: false,
                    pieces: [{
                        lte: Number(monthData['2'].alertRang.minAlert),
                        color: 'blueviolet'
                    }, {
                        gt: Number(monthData['2'].alertRang.minAlert),
                        lte: Number(monthData['2'].alertRang.minWarning),
                        color: 'palevioletred'
                    }, {
                        gt: Number(monthData['2'].alertRang.minWarning),
                        lte: Number(monthData['2'].alertRang.maxWarning),
                        color: '#55ACEE'
                    }, {
                        gt: Number(monthData['2'].alertRang.maxWarning),
                        lte: Number(monthData['2'].alertRang.maxAlert),
                        color: 'palevioletred'
                    }, {
                        gt: Number(monthData['2'].alertRang.maxAlert),
                        color: 'blueviolet'
                    }],
                };
                visualMaps2 = {
                    type: 'piecewise',
                    seriesIndex: 5,
                    align: 'right',
                    show: false,
                    pieces: [{
                        lte: Number(monthData['2'].alertRang.minAlert),
                        color: 'blueviolet'
                    }, {
                        gt: Number(monthData['2'].alertRang.minAlert),
                        lte: Number(monthData['2'].alertRang.minWarning),
                        color: 'palevioletred'
                    }, {
                        gt: Number(monthData['2'].alertRang.minWarning),
                        lte: Number(monthData['2'].alertRang.maxWarning),
                        color: '#55ACEE'
                    }, {
                        gt: Number(monthData['2'].alertRang.maxWarning),
                        lte: Number(monthData['2'].alertRang.maxAlert),
                        color: 'palevioletred'
                    }, {
                        gt: Number(monthData['2'].alertRang.maxAlert),
                        color: 'blueviolet'
                    }],
                };
                seriesMap = [{
                    name: '最小值',
                    type: 'line',
                    yAxisIndex: 1,
                    data: monthData['2'].minList || [],
                    lineStyle: {
                        normal: {
                            // color: ['#00c322'],
                            width: 1
                        }
                    },
                    smooth: true
                },
                {
                    name: '最大值',
                    type: 'line',
                    yAxisIndex: 1,
                    data: monthData['2'].maxList || [],
                    lineStyle: {
                        normal: {
                            // color: ['#38e156'],
                            width: 1
                        }
                    },
                    smooth: true
                },
                {
                    name: '平均值',
                    type: 'line',
                    yAxisIndex: 1,
                    data: monthData['2'].avgList || [],
                    lineStyle: {
                        normal: {
                            // color: ['#65e17b'],
                            width: 1
                        }
                    },
                    smooth: true
                }
                ];

                sensorMonthOpt.yAxis.push(yAxisMap);
                sensorMonthOpt.visualMap.push(visualMaps);
                sensorMonthOpt.visualMap.push(visualMaps1);
                sensorMonthOpt.visualMap.push(visualMaps2);

                seriesMap.map(function (item) {
                    sensorMonthOpt.series.push(item);
                    return item;
                });
            }
            // vm.devViewLoading = false;
            // $scope.sensorMonthOpt = sensorMonthOpt;
            console.log(sensorMonthOpt , '配置')
            return sensorMonthOpt;
            
        }
    }

}