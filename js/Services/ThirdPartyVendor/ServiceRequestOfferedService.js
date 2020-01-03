angular.module('MetronicApp').service('ServiceRequestOfferedService', ['$http', '$rootScope', 'AuthHeaderService', function ($http, $rootScope, AuthHeaderService) {

    //API#352
    this.getVendorServices = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/vendor/contentservice",
            data: param,
            headers: AuthHeaderService.getHeader()

        });
        return response;
    }
    //API #358   
    this.getServiceCategoryForVendor = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/vendor/servicecategory/list",
            data: param,
            headers: AuthHeaderService.getHeader()

        });
        return response;
    }
    this.DeleteServiceCategoryForVendor = function (param) {
        var response = $http({
            method: "DELETE",
            url: AuthHeaderService.getApiURL() + "web/vendor/servicecategory",
            data: param,
            headers: AuthHeaderService.getHeader()

        });
        return response;
    }
    this.RemoveServiceCategoryForVendor = function (param) {
        var response = $http({
            method: "PUT",
            url: AuthHeaderService.getApiURL() + "web/vendor/servicecategory",
            data: param,
            headers: AuthHeaderService.getHeader()

        });
        return response;
    }
    this.NewServiceCategoryForVendor = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/vendor/servicecategory",
            data: param,
            headers: AuthHeaderService.getHeader()

        });
        return response;
    }
    this.GetServiceCategory = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/service/category/list",
            data: param,
            headers: AuthHeaderService.getHeader()

        });
        return response;
    }

}]);