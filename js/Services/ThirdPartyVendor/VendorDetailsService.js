angular.module('MetronicApp').service('VendorDetailsService', ['$http', '$rootScope', 'AuthHeaderService', function ($http, $rootScope, AuthHeaderService) {

    this.GetVendorDetails = function (param) {
        var details = $http({
            method: "Post",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/vendor/details",
            headers: AuthHeaderService.getHeader()
        });
        return details;
    }
    this.GetState = function () {
        var State = $http({
            method: "GET",
            url: AuthHeaderService.getApiURL() + "web/states",
            headers: AuthHeaderService.getHeader()
        });
        return State;
    }
    this.SaveVendorDetails = function (param) {
        var State = $http({
            method: "POST",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/update/vendor",
            headers: AuthHeaderService.getHeader()
        });
        return State;
    }
}]);