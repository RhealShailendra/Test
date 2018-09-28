angular.module('MetronicApp').service('ClaimBillsService', ['$http', '$rootScope', 'AuthHeaderService', function ($http, $rootScope, AuthHeaderService) {

    //API #141  Getting all the invoices based on status, here all the vendor associated with the logged-in user company will be displayed with their added invoices
    this.pendingReceivable = function (param) {
        var response = $http({
            method: "Post",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/vendor/invoicelist", 
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
    //get alert ,notifications ,reminder
    this.getAlertList = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/notifications",
            data: param,
            headers: AuthHeaderService.getHeader()
        })
        return response;
    };
    //get event list
    this.getEventList = function () {
        var response = $http({
            method: "GET",
            url: AuthHeaderService.getApiURL() + "web/myevents",
            headers: AuthHeaderService.getHeader()
        })
        return response;
    }

    this.getInviceDetails = function (param) {

        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/vendor/invoice/details",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }
    this.markInvoiceAsPaid = function (param) {

        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/verify/invoice/payment",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }


    //ThirdPartyAccountingAdministrator
    //API #141  Getting all the invoices based on status, here all the vendor associated with the logged-in user company will be displayed with their added invoices
    this.getAllInvoices = function (param) {
        var response = $http({
            method: "Post",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/vendor/invoicelist",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };  
    //API#91 gteCompanyListhttp://localhost:8080/ArtigemRS-FI/api/web/companylist
   
        this.getInsuranceCompanies = function (param) {
            var response = $http({
                method: "GET",
               url: AuthHeaderService.getApiURL() + "web/companylist",
                headers: AuthHeaderService.getHeader()
            });
            return response;
        };
}]);