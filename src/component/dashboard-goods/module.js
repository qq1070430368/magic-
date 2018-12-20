
import echartsSeror from '../../app/commonDirective/echart.seror.directive';
import AppCtrl from './ctr';
export default
angular.module('fmDashboardGoods', [echartsSeror])
    .constant('goodsNavTaskList', goodsNavTaskList())
    .filter('isNull', isNull)
    .controller('dashboard_goods', AppCtrl)
    .name;





function goodsNavTaskList() {
    let GoodsNavTaskList = [{
        name: '基本信息',
        type: 'basic',
        show: true
    }, {
        name: '收前检测',
        type: 'closeds',
        show: true
    }, {
        name: '入库前快速检测',
        type: 'storage',
        show: true
    }, {
        name: '营养价值',
        type: 'nutritional',
        show: true
    }, {
        name: '农药使用情况',
        type: 'pesticide',
        show: true
    }, {
        name: '肥料使用情况',
        type: 'fertilizer',
        show: true
    }, {
        name: '病虫害情况',
        type: 'diseases',
        show: true
    }, {
        name: '环境情况',
        type: 'environment',
        show: true
    }, {
        name: '人员参与情况',
        type: 'personnel',
        show: true
    }, {
        name: '流转情况',
        type: 'circulation',
        show: true
    }, {
        name: '过程消耗情况',
        type: 'consumption',
        show: true
    }, {
        name: '全生命事件信息',
        type: 'lifecycle',
        show: true
    }, {
        name: '评 价',
        type: 'evaluation',
        show: true
    }, {
        name: '小 知 识',
        type: 'information',
        show: true
    }]
    return GoodsNavTaskList;
}


function isNull() {
    return function (input) {
        return (input === null || input === 'null级' || input === 'nullkg/箱' || input === 'nullnull/null' || input === 'null' || input === 'nullnullnull' || input === undefined) ? '' : input;
    };
}