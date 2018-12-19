// let app =
// export default app.name;

import fmDashboardCrop from './dashboard-crops/module';
import fmDashboardGoods from './dashboard-goods/module';
import appService from '../app/appService';
import photoSwipe from '../app/commonDirective/photo.swipe.directive';
export default angular.module('mainModule', [appService, photoSwipe, fmDashboardCrop, fmDashboardGoods])
    .name;