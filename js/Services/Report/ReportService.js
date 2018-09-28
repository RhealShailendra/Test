angular.module('MetronicApp').service('ReportService', ['$http', '$rootScope', 'AuthHeaderService', function ($http, $rootScope, AuthHeaderService) {

    this.GetDetails = function (param) {     
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/report/claim/items/statistics",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
    
    this.GetPaymentSummary = function (param) {     
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/report/claim/item/payment/statistics",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
    this.GetItemsReplacedOrPaid = function (param) {     
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/report/claim/itemcost/statistics",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    this.GetAboveLimitItems = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/report/claim/category/statistics",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };


    this.GetRepotItemPDF = function (param) {
        var responsepdf = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/export/claim/items/statistics",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return responsepdf;
    };
    this.GetRepotPaymentPDF = function (param) {
        var responsepdf = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/export/claim/payment/statistics",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return responsepdf;
    };
    this.GetRepotCategoryPDF = function (param) {
        var responsepdf = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/export/claim/category/statistics",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return responsepdf;
    };
    this.GetRepotReplacementPDF = function (param) {
        var responsepdf = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/export/claim/itemcost/statistics",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return responsepdf;
    };
}]);