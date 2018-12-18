export default
angular.module('canvasQrcode', [])
    .directive('canvasQrcodeMake', () => new CanvasQrcodeMake())
    .name;


class CanvasQrcodeMake {
    constructor() {
        this.restrict = 'AE';
        this.scope = {
            options: '='
        };
    }
    link($scope, $ele, $attr) {
        let $dom = '',
            randowId = '',
            width = '55',
            height = '55',
            options = {};

        function refresh(data) {
            if (data) {
                if (!$attr.id) {
                    randowId = $ele.attr('id', 'qrcode' + GenNonDuplicateID());
                    $dom = randowId;
                } else {
                    $dom = angular.element($attr.id);
                }
                // var id = $attr.id || randowId;
                options = data;
                options.width = data.width || width;
                options.height = data.height || height;
                // options.colorDark = '#eee';
                // options.colorLight = 'green';
                console.log(QRCode, '二维码');
                options.correctLevel = QRCode.CorrectLevel.H;
                $scope.qrcode = new QRCode($dom[0], options);
            }
        }
        $scope.$watch('options', refresh);

        // 生成唯一ID;
        function GenNonDuplicateID() {
            let idStr = Date.now().toString(36) + '-';
            idStr += Math.random().toString(36).substr(3);
            return idStr;
        }
        console.log(this, 'adasdad');

    }
    ref() {
        console.log('aaaa');
    }

}