
export default angular.module('photoSwipe', [])
    .run(['$templateCache', function ($templateCache) {
        $templateCache.put('template.html', '<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">' +
            '<!-- Background of PhotoSwipe. ' +
            '     It\'s a separate element as animating opacity is faster than rgba(). -->' +
            '<div class="pswp__bg"></div>' +
            '<!-- Slides wrapper with overflow:hidden. -->' +
            '<div class="pswp__scroll-wrap">' +
            '    <!-- Container that holds slides. PhotoSwipe keeps only 3 of them in the DOM to save memory.Don\'t modify these 3 pswp__item elements, data is added later on. -->' +
            '    <div class="pswp__container">' +
            '        <div class="pswp__item"></div>' +
            '        <div class="pswp__item"></div>' +
            '        <div class="pswp__item"></div>' +
            '    </div>' +
            '    <!-- Default (PhotoSwipeUI_Default) interface on top of sliding area. Can be changed. -->' +
            '    <div class="pswp__ui pswp__ui--hidden">' +
            '        <div class="pswp__top-bar">' +
            '            <!--  Controls are self-explanatory. Order can be changed. -->' +
            '            <div class="pswp__counter"></div>' +
            '            <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>' +
            '            <button class="pswp__button pswp__button--share" title="Share"></button>' +
            '            <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>' +
            '            <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>' +
            '            <!-- Preloader demo http://codepen.io/dimsemenov/pen/yyBWoR -->' +
            '            <!-- element will get class pswp__preloader--active when preloader is running -->' +
            '            <div class="pswp__preloader">' +
            '                <div class="pswp__preloader__icn">' +
            '                  <div class="pswp__preloader__cut">' +
            '                    <div class="pswp__preloader__donut"></div>' +
            '                  </div>' +
            '                </div>' +
            '            </div>' +
            '        </div>' +
            '        <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">' +
            '            <div class="pswp__share-tooltip"></div> ' +
            '        </div>' +
            '        <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)">' +
            '        </button>' +
            '        <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)">' +
            '        </button>' +
            '        <div class="pswp__caption">' +
            '            <div class="pswp__caption__center"></div>' +
            '        </div>' +
            '    </div>' +
            '</div>' +
            '</div>');
    }])
    .directive('photoSwipe', photoSwipe)
    .name;
function photoSwipe() {
    return {
        restrict: 'EA',
        replace: true,
        templateUrl: 'template.html',
        scope: {
            photoItems: '=',
            itemIndex: '='
        },
        link: link
    };
}

function link(scope, el, attr) {
    var id = attr.id || 'pswp_' + Math.floor((Math.random() * 999999999) + 1);
    angular.element(el).attr('id', id);
    // var pswpElement = document.querySelectorAll('.pswp')[0];
    // var pswpElement = document.getElementById(id);

    var pswpElement = angular.element(el)[0];

    // build items array
    /* scope.items = [
        {
            src: 'https://placekitten.com/600/400',
            w: 600,
            h: 400
        },
        {
            src: 'https://placekitten.com/1200/900',
            w: 1200,
            h: 900
        },
        {
            src: 'https://placekitten.com/600/400',
            w: 600,
            h: 400
        },
        {
            src: 'https://placekitten.com/1200/900',
            w: 1200,
            h: 900
        },
        {
            src: 'https://placekitten.com/600/300',
            w: 600,
            h: 300
        },
        {
            src: 'https://placekitten.com/1200/900',
            w: 1200,
            h: 900
        }
    ]; */

    // define options (if needed)
    scope.options = {
        // optionName: 'option value'
        // for example:
        index: scope.itemIndex || 0, // start at first slide
        fullscreenEl: false,
        shareEl: false,
        history: false,
        // showAnimationDuration: 333,
        showHideOpacity: true
    };
    /* scope.options.mainClass = 'pswp--minimal--dark';
    scope.options.barsSize = { top: 0, bottom: 0 };
    scope.options.captionEl = false;
    scope.options.fullscreenEl = false;
    scope.options.shareEl = false;
    // scope.options.bgOpacity = 0.85;
    scope.options.tapToClose = true;
    scope.options.tapToToggleControls = false; */

    scope.$watch('photoItems', function (nv) {
        // Initializes and opens PhotoSwipe
        var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, nv, scope.options);
        gallery.init();
    });
}

/* function setOptions(obj, options) {
    if (!obj.hasOwnProperty('options')) {
        obj.options = obj.options ? obj.options : {};
    }

    for (var i in options) {
        obj.options[i] = options[i];
    }
    return obj.options;
} */