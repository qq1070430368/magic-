class XhrFactory {
    static get $inject() { return ['$state', '$http', '$q'] }
    constructor($state, $http, $q) {
        this.http = $http;
        this.$q = $q;
        this.$state = $state;
    }
    getData() {
        let defer = this.$q.defer();
        let configData = {
            method: 'POST',
            // url: 'https://www.fmbiz.com.cn/api/archive/product?code=' + code,
            url: 'https://www.fmbiz.com.cn/file/datefile',
            data: {
                dateFileType: 'qrcodescan',
                code: this.$state.current.code,
                env: window._FMBIZENV
            }
        };
        this.http(configData)
            .then(_success, _error);

        function _success(response) {
            if (response) {
                defer.resolve(response.data);
            }
        }

        function _error(err) {
            defer.reject(err);
        }

        return defer.promise;

    }
}



export default angular

    .module('appService', [])
    .factory('dashboardServive', ['$state', '$http', '$q', ($state, $http, $q) => new XhrFactory($state, $http, $q)])

    .name;