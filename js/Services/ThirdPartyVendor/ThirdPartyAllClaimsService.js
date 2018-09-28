angular.module('MetronicApp').service('ThirdPartyAllClaimsService', ['$http', '$rootScope', 'AuthHeaderService', function ($http, $rootScope, AuthHeaderService) {

    //API #12
    this.getClaimsAssigned = function (param)
    {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/vendor/claims",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }
    this.getClaimStatus = function () {
        var response = $http({
            method: "GET",
            url: AuthHeaderService.getApiURL() + "web/claim/statuslist",
            headers: AuthHeaderService.getHeader()
        })
        return response;
    }

    //Get all claims against filer API#17b
    this.getAllClaims = function (param) {
        var resp = $http({
            method: "POST",
            url: AuthHeaderService.getApiURL() + "web/claims",
            headers: AuthHeaderService.getHeader(),
            data: param
        });
        return resp;
    };

}]);