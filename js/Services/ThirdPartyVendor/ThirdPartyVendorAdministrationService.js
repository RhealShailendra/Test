angular.module('MetronicApp').service('ThirdPartyVendorAdministrationService', ['$http', '$rootScope', 'AuthHeaderService', function ($http, $rootScope, AuthHeaderService) {

    this.GetVendorDetails=function()
    {
         
        var details = $http({
            method: "Get",          
            url: AuthHeaderService.getApiURL() + "web/vendor/company/details", //"web/vendor/details",
            headers: AuthHeaderService.getHeader()
        });
        return details;
    }
    this.GetState = function (param) {
        var State = $http({
            method: "POST",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/states",
            headers: AuthHeaderService.getHeader()
        });
        return State;
    }
    this.SaveVendorDetails = function (param) {       
        var State = $http({
            method: "POST",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/update/vendor", //"web/update/vendor",         
            headers: AuthHeaderService.getHeader()
        });
        return State;
    }
}]);