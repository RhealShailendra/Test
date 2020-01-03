angular.module('MetronicApp').service('UploadCatalogItemService', ['$http', '$rootScope', 'AuthHeaderService', function ($http, $rootScope, AuthHeaderService) {
    //Get items form post loss
    this.UploadItemExcelFile = function (param) {
        var saveDetails = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/read/postloss/items",
            data: param,
            headers: AuthHeaderService.getFileHeader()
        });
        return saveDetails;
    }
    //Api #250
    this.UploadItemList = function (param) {
        var saveDetails = $http({
            method: "POST",
            url: AuthHeaderService.getApiURL() + "web/import/postloss/items",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return saveDetails;
    };

    //Api #257
    this.UploadCatalogExcelFile = function (param) {
        var saveDetails = $http({
            method: "POST",
            url: AuthHeaderService.getApiURL() + "web/read/vendorcatalog/items",
            data: param,
            headers: AuthHeaderService.getFileHeader()
        });
        return saveDetails;
    };

    //Api #257
    this.UploadCatalogItemList = function (param) {

        var saveDetails = $http({
            method: "POST",
            url: AuthHeaderService.getApiURL() + "web/import/vendorcatalog/items",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return saveDetails;
    };


}]);