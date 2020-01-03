angular.module('MetronicApp').service('VendorSupplierService', ['$http', '$rootScope', 'AuthHeaderService',
    function ($http, $rootScope, AuthHeaderService) {
    this.GetSupplier = function () {
        var response = $http({
            method: "GET",
            url: AuthHeaderService.getApiURL() + "web/all/vendor/suppliers",
            headers: AuthHeaderService.getHeader()
        });

        return response;
    }

    this.ChangeSupplierStatus = function (param) {
        var response = $http({
            method: "PUT",
            data:param,
            url: AuthHeaderService.getApiURL() + "web/update/vendor/supplier/status",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }

    this.UploadSupplierExcelFile = function (param) {
        var response = $http({
            method: "Post",
            data:param,
            url: AuthHeaderService.getApiURL() + "web/read/vendor/suppliers",
            headers: AuthHeaderService.getFileHeader()
        });
        return response;
    }
    this.UploadSupplier = function (param) {
        var response = $http({
            method: "Post",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/add/vendor/suppliers",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }
}]);