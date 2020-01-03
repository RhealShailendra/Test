angular.module('MetronicApp').service('QuoteService', ['$http', '$rootScope', 'AuthHeaderService', function ($http, $rootScope, AuthHeaderService) {

    //get all states #123
    this.getStates = function (param) {

        var response = $http({
            method: "post",
            url: AuthHeaderService.getApiURL() + "web/states",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    //get claim status details for content section- API #158
    this.getClaimContents = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/adjuster/claim/contents",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }
}]);