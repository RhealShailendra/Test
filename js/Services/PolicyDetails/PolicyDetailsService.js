angular.module('MetronicApp').service('PolicyDetailsService', ['$http', 'AuthHeaderService', function ($http, AuthHeaderService) {
   
    this.GetPolicyHolderDetails = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/policy/info",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
}]);