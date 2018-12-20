function appRun($rootScope, $state) {
    // 路由监听机制 之类的
    $rootScope.app = {
        name: '', // name of your project
        author: 'www.fmbj.com.cn', // author's name or company name
        description: 'FMBIZ', // brief description
        version: '1.0.0', // current version
        date: new Date(),
        components: {
            maskBlack: false
        },
        year: ((new Date()).getFullYear()), // automatic current year (for copyright information)
        isMobile: (function () { // true if the browser is a mobile device
            var check = false;
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                check = true;
            }
            return check;
        })(),
    };

    $rootScope.$on('$stateChangeStart', (event, toState) => {
        // index ，默认等于跳转的title
        $rootScope.app.name = toState.title;
    });

    $rootScope.$watch('app.components.maskBlack', (data) => {
        if (data) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

    });

    // window
    // 由 webapck 处理 的环境变量
    // --dev  --pro --prod;
    window._FMBIZENV = PRODUCTION;
}
appRun.$inject = ['$rootScope'];

export default appRun;