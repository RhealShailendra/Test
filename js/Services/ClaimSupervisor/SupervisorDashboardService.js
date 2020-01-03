angular.module('MetronicApp').service('SupervisorDashboardService', ['$http', '$rootScope', 'AuthHeaderService', function ($http, $rootScope, AuthHeaderService) {
    //get  list of claims API #72- New #12
    this.getClaimsInProgress = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/claims",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }

    //get  notifications API #103- New -#43
    this.getNotification = function () {
        var response = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/get/claimfornotification",
            headers: AuthHeaderService.getHeader()
        })
        return response;
    }
    //get  getClaimStatusList API #124
    this.getClaimStatusList = function () {
        var response = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/claim/statuslist",
            headers: AuthHeaderService.getHeader()
        })
        return response;
    }

    //get result for global search from dashboard
    this.getSearchClaims = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/search/claims",
            data: param,
            headers: AuthHeaderService.getHeader()
        })
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

    //get alert ,notifications ,reminder
    this.getAlertList = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/notifications",
            data: param,
            headers: AuthHeaderService.getHeader()
        })
        return response;
    }

    //get vendor invoice list API# 237
    this.getVendorInvoiceList = function (param) {
        var response = $http({
            method: "Post",
            //url: AuthHeaderService.getApiURL() + "web/invoices/underreview",
            url: AuthHeaderService.getApiURL() + "web/item/invoices/underreview",
            data: param,
            headers: AuthHeaderService.getHeader()
        })
        return response;
    }

    //Chnage notification status as read
    this.readNotification = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/read/notification",
            data: param,
            headers: AuthHeaderService.getHeader()
        })
        return response;
    }

}]);