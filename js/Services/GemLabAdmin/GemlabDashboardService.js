angular.module('MetronicApp').service('GemlabDashboardService', ['$http', '$rootScope', 'AuthHeaderService', function ($http, $rootScope, AuthHeaderService) {

    this.getPurchaseOrder = function (Param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/gemlab/purchase/order/list",
            data: Param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }
    //API#203 Service to get the claim from associate side base on user id
    this.getNewClaims = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/vendor/associate/claims",
            data: param,
            headers: AuthHeaderService.getHeader()

        });
        return response;
    }
    //get event list
    this.getEventList = function () {
        var response = $http({
            method: "GET",
            url: AuthHeaderService.getApiURL() + "web/myevents",
            headers: AuthHeaderService.getHeader()
        })
        return response;
    }

}]);