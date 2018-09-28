angular.module('MetronicApp').service('SupervisorAllClaimsService', ['$http', '$rootScope', 'AuthHeaderService', function ($http, $rootScope, AuthHeaderService) {

    //get  list of all claims
    this.getClaimsInProgress = function (param) {
       
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/claims",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        
        return response;
    }


}]);