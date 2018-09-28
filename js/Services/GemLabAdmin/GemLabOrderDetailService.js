angular.module('MetronicApp').service('GemLabOrderDetailService', ['$http', '$rootScope', 'AuthHeaderService', function ($http, $rootScope, AuthHeaderService) {


    this.GetPurchaseOrder = function (param) {
        var response = $http({
            method: "POSt",
            url: AuthHeaderService.getApiURL() + "web/gemlab/purchase/order/details",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }

    this.SaveGemlabRequest = function (param) {
        var response = $http({
            method: "POST",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/save/gemlab/purchase/order",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    this.GetPolicyHolderDetails = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/policy/info",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    //Get status list 
    this.getStatusList = function (param) {
        var response = $http({
            method: "post",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/purchase/order/statuslist",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
}]);