angular.module('MetronicApp').service('PerformanceService', ['$http', '$rootScope', 'AuthHeaderService', function ($http, $rootScope, AuthHeaderService) {
    
    //Get Status List
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
            url: AuthHeaderService.getApiURL() + "web/associate/claims/assignments",
            headers: AuthHeaderService.getHeader(),
            data: param
        });
        return resp;
    };
}]);