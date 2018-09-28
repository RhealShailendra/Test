﻿angular.module('MetronicApp').service('NewVendorRegistrationService', ['$http', '$rootScope', 'AuthHeaderService', function ($http, $rootScope, AuthHeaderService) {
        //API #116
    this.getStates = function () {
        var response = $http({
            method: "GET",
            url: AuthHeaderService.getApiURL() + "web/states",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }
    //API #116 getHeaderWithoutToken
    this.addVendor = function (param) {
        var response = $http({
             method: "Post",
             data: param,
             url: AuthHeaderService.getApiURL() + "web/admin/vendor/registration",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }
}]);