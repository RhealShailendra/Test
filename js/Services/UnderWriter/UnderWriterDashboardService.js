angular.module('MetronicApp').service('UnderWriterDashboardService', ['$http', '$rootScope', 'AuthHeaderService', function ($http, $rootScope, AuthHeaderService) {
    //get   New #268
    this.getNewAssignments = function () {
        var response = $http({
            method: "GET",
            url: AuthHeaderService.getApiURL() + "web/underwriter/assigned/items",        
            headers: AuthHeaderService.getHeader()
        });
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

    //get alert ,notifications ,reminder
    this.getAlertList = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/notifications",
            data: param,
            headers: AuthHeaderService.getHeader()
        })
        return response;
    }


   

}]);