angular.module('MetronicApp').service('NewVendorSupplierService', ['$http', '$rootScope', 'AuthHeaderService',
    function ($http, $rootScope, AuthHeaderService) {
        this.GetSupplierDetails = function (param) {
            var response = $http({
                method: "Post",
                url: AuthHeaderService.getApiURL() + "web/get/vendor/supplier",
                data: param,
                headers: AuthHeaderService.getHeader()
            });

            return response;
        }

        this.UpdateSupplierDetails = function (paramUpdate) {
            var response = $http({
                method: "PUT",
                url: AuthHeaderService.getApiURL() + "web/update/vendor/supplier",
                data: paramUpdate,
                headers: AuthHeaderService.getHeader()
            });

            return response;
        }

        this.NewSupplierDetails = function (paramNew) {
            var response = $http({
                method: "Post",
                url: AuthHeaderService.getApiURL() + "web/add/vendor/supplier",
                data: paramNew,
                headers: AuthHeaderService.getHeader()
            });

            return response;
        }

        this.GetState= function (param) {
            var response = $http({
                method: "Post",
                url: AuthHeaderService.getApiURL() + "web/states",
                data: param,
                headers: AuthHeaderService.getHeader()
            });

            return response;
        }
    }]);