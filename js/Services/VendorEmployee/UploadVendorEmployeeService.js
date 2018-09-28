angular.module('MetronicApp').service('UploadVendorEmployeeService', ['$http', '$rootScope', 'AuthHeaderService', function ($http, $rootScope, AuthHeaderService) {

    this.UploadVendorDetailsFile = function (param) {
        var resp = $http({
            method: "POST",
            url: AuthHeaderService.getApiURL() + "web/read/user/profile",
            data: param,
            headers: AuthHeaderService.getFileHeader()
        });
        return resp;
    }

    this.SaveVendorDetails = function (param) {
        var resp = $http({
            method: "POST",
            url: AuthHeaderService.getApiURL() + "web/import/user/profile",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return resp;
    }
}]);