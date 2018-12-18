import infoHeader from '../info-header/main.';
// import rFooter from "../rFooter/cmpt";
// import rMain from "../rMain/cmpt";

export default angular
    .module('homeModule', [
        infoHeader,
    ])
    .component('homeComonent', {
        templateUrl: 'components/info-header/main.html',
        controllerAs: 'zr',
        controller: ZkyResumeCtrl
    })
    .name;

function ZkyResumeCtrl() {
    console.log('主页控制器');
}