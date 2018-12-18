// let app =
// export default app.name;

import fmDashboardCrop from './dashboard-crops/module';
// import photoSwipe from '../app/commonDirective/photo.swipe.directive';
export default angular.module('mainModule', ['photoswipe', fmDashboardCrop])
    .name;