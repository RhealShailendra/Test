angular.module('MetronicApp').service('salvageDashboardService', ['$http', '$rootScope', 'AuthHeaderService', function ($http, $rootScope, AuthHeaderService) {

    //API#203 Service to get the claim from associate side base on user id
    this.getNewClaims = function (param) {
        var response = $http({
            method: "GET",
            url: AuthHeaderService.getApiURL() + "web/gemlab/salvage/item",           
            headers: AuthHeaderService.getHeader()

        });
        return response;
    }
}]);