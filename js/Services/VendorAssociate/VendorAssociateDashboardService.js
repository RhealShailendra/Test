angular.module('MetronicApp').service('VendorAssociateDashboardService', ['$http', '$rootScope', 'AuthHeaderService', function ($http, $rootScope, AuthHeaderService) {

    //API #12
    this.getClaimsAssigned = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/vendor/associate/claims",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }
    this.getSerchedClaim = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/vendor/associate/search/claims",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }
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
    };

    //Chnage notification status as read
    this.readNotification = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/read/notification",
            data: param,
            headers: AuthHeaderService.getHeader()
        })
        return response;
    };

    this.getServiceRequest = function (param) {
        var responce = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/servicerequests",
            data: param,
            headers: AuthHeaderService.getHeader()
        })
        return responce;
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

    this.GetInsuranceDetails = function (param) {
        var response = $http({
            method: "POST",
            url: AuthHeaderService.getApiURL() + "web/get/claim/insuracecompany/detail",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    this.GetContentDetails = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/vendor/claim/content",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    //Reject service request
    this.RejectServiceRequest = function (param) {
        var servicerequest = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/reject/servicerequest",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return servicerequest;
    };
}]);