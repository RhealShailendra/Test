angular.module('MetronicApp').service('VendorAssociateInventoryService', ['$http', '$rootScope', 'AuthHeaderService', function ($http, $rootScope, AuthHeaderService) {

    //API #137
    this.GetInventoryList = function (param) {
        var response = $http({

            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/vendor/catalogitems",
            data: param,
            headers: AuthHeaderService.getHeader()

        });
        return response;
    }
    //API #29
    this.GetCategoryList = function () {
        var response = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/vendor/catalogitemtypes",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }
    //APi # 49
    this.UploadCatalofFile = function (param) {
        var fileUpload = $http({
            method: "Post",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/upload/itemtocatalog",
            headers: AuthHeaderService.getFileHeader()
        });
        return fileUpload;
    }

    this.GetItemTypeList = function () {
        var response = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/vendor/catalogitemtypes",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }
    this.GetItemDetails = function (param) {
        var details = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/vendor/catalogitem/detail",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return details;
    }
    this.SaveItem = function (param) {
        var saveDetails = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/add/vendor/catalogitem",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return saveDetails;
    }
}]);