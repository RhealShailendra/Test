angular.module('MetronicApp').service('SalesAdminOrdersService', ['$http', '$rootScope', 'AuthHeaderService', function ($http,
    $rootScope, AuthHeaderService) {
    this.GetOrder = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/dashboard/purchase/orders",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
}]);