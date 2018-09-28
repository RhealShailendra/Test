angular.module('MetronicApp').service('VendorAssociateInvoiceDetailsService', ['$http', '$rootScope', 'AuthHeaderService', function ($http, $rootScope, AuthHeaderService) {

    this.getInviceDetails = function (param) {

        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/invoice/details",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }

    this.makeItemPaymentByCheck = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/items/payment",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    //get all states #123
    this.getStates = function (param) {

        var response = $http({
            method: "post",
            url: AuthHeaderService.getApiURL() + "web/states",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }

    //Servicess for Add New Invoice
    //API # 50
    this.CreateInvoice = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/create/invoice",
            data: param,
            headers: AuthHeaderService.getFileHeader()
        });
        return response;
    }

    //Get item for invoices
    this.GetItemList = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/associate/assigned/lineitem",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;


    }
    //get payment terms list
    this.getPaymentTermsList = function () {

        var response = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/paymentterms",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
    //Get Vendor Details
    this.getVendorDetails = function (param) {

        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/vendor/details",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }

}]);