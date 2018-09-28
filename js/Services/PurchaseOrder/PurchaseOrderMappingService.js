angular.module('MetronicApp').service('PurchaseOrderMappingService', ['$http', '$rootScope', 'AuthHeaderService', function ($http,
    $rootScope, AuthHeaderService) {
    //Get Purchase order type
    this.GetPurchaseOrders = function () {
        var response = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/orderstype",
            headers: AuthHeaderService.getHeader()
        });
        return response;


    };

    //Get Department
    this.GetDepartments = function () {
        var response = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/get/vendor/departments",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
  

    //Get Purchase department  mapping by purchse order
    this.GetPurchaseOrderMapping = function (param) {
            var response = $http({
                method: "Post",
                data:param,
                url: AuthHeaderService.getApiURL() + "web/purchase/order/department",
                headers: AuthHeaderService.getHeader()
            });
            return response;
    };

    //Save purchse order mapping
    this.SavePurchaseOrderMapping = function (param) {
        var response = $http({
            method: "Post",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/map/purchase/order/department",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
}]);