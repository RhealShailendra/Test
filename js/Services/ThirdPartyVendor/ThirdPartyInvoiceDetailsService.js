angular.module('MetronicApp').service('ThirdPartyInvoiceDetailsService', ['$http', '$rootScope', 'AuthHeaderService', function ($http, $rootScope, AuthHeaderService) {

    this.getInviceDetails = function (param) {
     
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/vendor/invoice/details",
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
            url: AuthHeaderService.getApiURL() +"web/replacement/items",                //ALL Assigned items--> "web/claim/vendor/assigneditems",       
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
    }
    //Get Vendor Details
    this.getPaymentTerms = function () {
        var response = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/paymentterms",
           // data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
    //Get markup percenatge file data
    
    this.GetmarkUpPercentage = function () {
        return $http.get(AuthHeaderService.getMarkUpPercentageFileName());
    }


    this.GetClaimDetails = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/get/claim/insuracecompany/detail",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
    this.GetVendorDetails = function () {
        var response = $http({
            method: "Get",
            //data:param,
            url: AuthHeaderService.getApiURL() + "web/vendor/company/details",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
    
        this.GetServiceTypes = function () {
            var response = $http({
                method: "Get",              
                url: AuthHeaderService.getApiURL() + "web/get/lineitem/service",
                headers: AuthHeaderService.getHeader()
            });
            return response;
        };

        this.getClaimContents = function (param) {
            var response = $http({
                method: "Post",
                url: AuthHeaderService.getApiURL() + "web/vendor/claim/content",
                data: param,
                headers: AuthHeaderService.getHeader()
            });
            return response;
        };

        ////get purchase order details based on id
        //this.GetPurchaseOrderDetails = function (paramId) {
        //    var response = $http({
        //        method: "POST",
        //        data: paramId,
        //        url: AuthHeaderService.getApiURL() + "web/purchase/order",
        //        headers: AuthHeaderService.getHeader()
        //    });
        //    return response;
        //};

       //Get list of PO items against assignment
        this.GetAllPurchaseOrder = function (paramId) {
            var response = $http({
                method: "POST",
                data: paramId,
                url: AuthHeaderService.getApiURL() + "web/vendor/assignment/items",
                headers: AuthHeaderService.getHeader()
            });
            return response;
        };
}]);