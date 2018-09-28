angular.module('MetronicApp').service('ThirdPartyGlobalSearchService', ['$http', '$rootScope', 'AuthHeaderService', function ($http, $rootScope, AuthHeaderService) {

    //API #12
    this.getSerchedClaim = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/vendor/search/claims",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }

}]);