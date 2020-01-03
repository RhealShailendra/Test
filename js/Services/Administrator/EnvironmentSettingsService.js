angular.module('MetronicApp').service('EnvironmentSettingsService', ['$http', '$rootScope', 'AuthHeaderService', function ($http, $rootScope, AuthHeaderService) {

    
    this.GetServiceRequestCategories = function (param) {
        var State = $http({
            method: "POST",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/service/category/list",
            headers: AuthHeaderService.getHeader()
        });
        return State;
    };

    this.AddServiceRequestCategories = function (param) {
        var State = $http({
            method: "POST",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/service/category",
            headers: AuthHeaderService.getHeader()
        });
        return State;
    };

    this.UpdateServiceRequestCategories = function (param) {
        var State = $http({
            method: "Put",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/service/category",
            headers: AuthHeaderService.getHeader()
        });
        return State;
    };

    this.DeleteServiceRequestCategories = function (param) {
        var State = $http({
            method: "Delete",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/service/category",
            headers: AuthHeaderService.getHeader()
        });
        return State;
    };


    this.GetContentService = function () {
        var State = $http({
            method: "Get",
            //data: param,
            url: AuthHeaderService.getApiURL() + "web/contentservices", 
            headers: AuthHeaderService.getHeader()
        });
        return State;
    };

    this.AddContentService = function (param) {
        var State = $http({
            method: "POST",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/admin/add/contentservice",
            headers: AuthHeaderService.getHeader()
        });
        return State;
    };

    this.UpdateContentService = function (param) {
        var State = $http({
            method: "Post",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/admin/update/contentservice",
            headers: AuthHeaderService.getHeader()
        });
        return State;
    };

    this.DeleteContentService = function (param) {
        var State = $http({
            method: "Delete",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/admin/delete/contentservice",
            headers: AuthHeaderService.getHeader()
        });
        return State;
    }
}]);