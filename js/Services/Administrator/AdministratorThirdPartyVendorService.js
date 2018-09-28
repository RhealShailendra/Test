angular.module('MetronicApp').service('AdministratorThirdPartyVendorService', ['$http', '$rootScope', 'AuthHeaderService', function ($http, $rootScope, AuthHeaderService) {

    //get all vendors list API #186
    this.getVendorsList = function () {
        var response = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/vendors",
            //data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }
}]);