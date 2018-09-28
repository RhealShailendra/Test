angular.module('MetronicApp').service('AddNewItemToInventoryService', ['$http', '$rootScope', 'AuthHeaderService', function ($http, $rootScope, AuthHeaderService) {
    //Add new item to inventory for third party vendor i.e. supplier
    this.AddInventory = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }
}]);