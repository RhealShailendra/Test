angular.module('MetronicApp').service('ServiceRequestInvoicesVendorService', ['$http', '$rootScope', 'AuthHeaderService', function ($http, $rootScope, AuthHeaderService) {
    //Get Invoice list
    this.GetInvoiceList= function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/servicerequest/invoices",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }
    this.getVendorDetails = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/vendor/details",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }
    this.getStates = function (param) {

        var response = $http({
            method: "post",
            url: AuthHeaderService.getApiURL() + "web/states",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }

    this.MakePayment = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/invoice/payment",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }

}]);