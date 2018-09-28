angular.module('MetronicApp').service('ThirdPartyContentService', ['$http', '$rootScope', 'AuthHeaderService', function ($http, $rootScope, AuthHeaderService) {
    //API #358   
    this.GetCategory = function () {
        var response = $http({
            method: "GET",
            url: AuthHeaderService.getApiURL() + "web/claim/get/category",
            headers: AuthHeaderService.getHeader()

        });
        return response;
    }
    this.GetAllContentService = function () {
        var response = $http({
            method: "GET",
            url: AuthHeaderService.getApiURL() + "web/contentservices",
            headers: AuthHeaderService.getHeader()

        });
        return response;
    }
    this.GetSubServiceList = function () {
        var response = $http({
            method: "GET",
            url: AuthHeaderService.getApiURL() + "web/subcontentservices",
            headers: AuthHeaderService.getHeader()

        });
        return response;
    }
    this.GetContentServiceOfVendor = function (param) {
        var response = $http({
            method: "POST",
            data:param,
            url: AuthHeaderService.getApiURL() + "web/vendor/contentservice",
            headers: AuthHeaderService.getHeader()

        });
        return response;
    }
    
    this.SaveContentService = function (param) {
        var response = $http({
            method: "POST",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/vendor/add/contentservice",
            headers: AuthHeaderService.getHeader()

        });
        return response;
    }
    this.RemoveContentService = function (param) {
        var response = $http({
            method: "PUT",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/vendor/update/contentservice/status",
            headers: AuthHeaderService.getHeader()

        });
        return response;
    }
    
    this.GetAllContentServiceofVendor = function (param) {
        var response = $http({
            method: "POST",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/vendor/contentservice",
            headers: AuthHeaderService.getHeader()

        });
        return response;
    }
}]);