angular.module('MetronicApp').service('supervisorDashboardService', ['$http', '$rootScope', 'AuthHeaderService', function ($http, $rootScope, AuthHeaderService) {
    //get alert ,notifications ,reminder
    this.getAlertList = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/notifications",
            data: param,
            headers: AuthHeaderService.getHeader()
        })
        return response;
    };
   
    //get event list
    this.assignmenstoreview = function (param) {
            var response = $http({
                method: "Post",
                data: param,
                url: AuthHeaderService.getApiURL() + "web/vendor/claims",
                headers: AuthHeaderService.getHeader()
            })
            return response;
        }

    //get event list
    this.getEventList = function () {
        var response = $http({
            method: "GET",
            url: AuthHeaderService.getApiURL() + "web/myevents",
            headers: AuthHeaderService.getHeader()
        })
        return response;
    }
    //get Vendor Associate list
    this.getAssociateDetails = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/supervisor/vendor/associates",
            data: param,
            headers: AuthHeaderService.getHeader()
        })
        return response;
    };
}]);