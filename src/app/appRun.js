function appRun($rootScope) {
    // 路由监听机制 之类的
    $rootScope.app = {
        name: '作物档案', // name of your project
        author: 'www.fmbj.com.cn', // author's name or company name
        description: 'FMBIZ', // brief description
        version: '1.0.0', // current version
        date: new Date(),
        year: ((new Date()).getFullYear()), // automatic current year (for copyright information)
        isMobile: (function () { // true if the browser is a mobile device
            var check = false;
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                check = true;
            }
            return check;
        })(),
    };

    // window
    window._FMBIZENV = PRODUCTION;
    
}
appRun.$inject = ['$rootScope'];

export default appRun;
