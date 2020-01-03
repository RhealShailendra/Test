angular.module('MetronicApp').service('ClaimAssociatesService', ['$http', '$rootScope', 'AuthHeaderService', function ($http, $rootScope, AuthHeaderService) {
   // GetAssociate List
    this.GetAssociateList = function () {
        var AsscociateList = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/vendor/associates",
            headers: AuthHeaderService.getHeader()
        });
        return AsscociateList;
    }

    this.GetEmployeeList = function () {       
        var data = $http({
            method: "Get",           
            url: AuthHeaderService.getApiURL()+"web/vendor/employees",
            headers:AuthHeaderService.getHeader()
        });
        return data;
    }
}]);
