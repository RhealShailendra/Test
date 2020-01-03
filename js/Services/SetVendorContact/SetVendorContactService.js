angular.module('MetronicApp').service('SetVendorContactService', ['$http', '$rootScope', 'AuthHeaderService', function ($http, $rootScope, AuthHeaderService) {
    //GetAssociate List
    this.GetAssociateList = function () {
        var AsscociateList = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/vendor/associates",
            headers: AuthHeaderService.getHeader()
        });
        return AsscociateList;
    };

    this.GetRoles = function () {
        var AsscociateList = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/roles",
            headers: AuthHeaderService.getHeader()
        });
        return AsscociateList;
    };

    this.GetEmployeeDetails = function (param) {
        var Details = $http({
            method: "POST",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/associate/details",
            headers: AuthHeaderService.getHeader()
        });
        return Details;
    };

    this.GetVendorContactList = function (param) {
        var VendorList = $http({
            method: "Post",
            data:param,
            url: AuthHeaderService.getApiURL() + "web/role/user",
            headers: AuthHeaderService.getHeader()
        });
        return VendorList;
    };
}]);