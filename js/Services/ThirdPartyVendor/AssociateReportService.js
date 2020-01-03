angular.module('MetronicApp').service('AssociateReportService', ['$http', '$rootScope', 'AuthHeaderService', function ($http, $rootScope, AuthHeaderService) {
    this.getCompanyClaim = function (param) {
        var resp = $http({
            method: "Post",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/vendor/assignedclaim/companylist",
            headers: AuthHeaderService.getHeader()
        });
        return resp;
    };

    this.getCompanyList = function () {
        var resp = $http({
            method: "Get",
            //data: param,
            url: AuthHeaderService.getApiURL() + "web/companylist",
            headers: AuthHeaderService.getHeader()
        });
        return resp;
    }
}]);