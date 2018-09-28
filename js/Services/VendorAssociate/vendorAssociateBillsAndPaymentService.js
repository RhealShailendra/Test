angular.module('MetronicApp').service('vendorAssociateBillsAndPaymentService', function ($http, $rootScope, AuthHeaderService) {

    //API #210
    this.GetInvoiceList = function (param) {
        var response = $http({
            method: "Post",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/associate/invoiceinfo",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }
    //API #208 for search Result
    this.GetSearchInvoiceList = function (param) {
        var response = $http({
            method: "Post",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/vendor/associate/search/invoices",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }


});