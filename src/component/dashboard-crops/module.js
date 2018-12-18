import { AppCtrl } from './ctr';
import echartsSeror from '../../app/commonDirective/echart.seror.directive';
import canvasQrcode from '../../app/commonDirective/qrcode.make.directive';



export default
angular.module('fmDashboardCrop', [echartsSeror, canvasQrcode])
    .constant('cropNavTaskList', cropNavTaskList())
    .controller('dashboard_crop', AppCtrl)
    .name;



// 定义全局常量
function cropNavTaskList() {
    let cropNavTaskList = [{
        name: '作物介绍',
        templateUrl: 'crop_introduction.html',
        id: 'introduct'
    },
    {
        name: '企业信息',
        templateUrl: 'crop_enterprise_plant.html',
        id: 'company'
    },
    {
        name: '负责人',
        templateUrl: 'crop_responsibleMan.html',
        id: 'responsibe'
    },
    {
        name: '土地平整',
        templateUrl: 'crop_land_flat.html',
        id: 'flat'
    },
    {
        name: '空间位置',
        templateUrl: 'crop_space_place.html',
        id: 'space'
    },
    {
        name: '生长环境',
        templateUrl: 'crop_plant_environment.html',
        id: 'grownning'
    },
    {
        name: '播种登记',
        templateUrl: 'crop_sowregistration.html',
        id: 'plant_resgister'
    },
    {
        name: '过程打理',
        templateUrl: 'crop_plant_progress.html',
        id: 'progress_plant'
    },
    {
        name: '检测',
        templateUrl: 'crop_laboratory.html',
        id: 'dection'
    },
    {
        name: '入库检测',
        templateUrl: 'crop_putincode.html',
        id: 'put_dection'
    },
    {
        name: '入库赋码',
        templateUrl: 'crop_put_code.html',
        id: 'put_code'
    },
    // 仓储异动的位置
    {
        name: '商品赋码',
        templateUrl: 'crop_goods_code.html',
        id: 'goods_code'
    },
    {

        name: '流通过程',
        templateUrl: 'crop_circulation_process.html',
        id: 'flow'
    },
    {
        name: '客户点评',
        templateUrl: 'crop_customer_reviews.html',
        id: 'review'
    },
    ];
    return cropNavTaskList;
}