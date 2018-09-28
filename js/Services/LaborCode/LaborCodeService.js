angular.module('MetronicApp').service('LaborCodeService', ['$http', '$rootScope', 'AuthHeaderService', function ($http,
    $rootScope, AuthHeaderService) {
    //Get Department
    this.GetLaborCodes = function () {
        var response = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/get/vendor/laborcodes",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    //Add LaborCodes
    this.AddLaborCode = function (param) {
        var response = $http({
            method: "Post",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/add/vendor/laborcode",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    //Update LaborCodes
    this.UpdateLaborCode = function (param) {
        var response = $http({
            method: "PUT",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/update/vendor/laborcode",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    //Update LaborCode status
    this.UpdateLaborCodeStatus = function (param) {
        var response = $http({
            method: "PUT",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/update/vendor/laborcode/status",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
}]);