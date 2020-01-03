angular.module('MetronicApp').service('SpeedCheckContactService', ['$http', '$rootScope', 'AuthHeaderService', function ($http, $rootScope, AuthHeaderService) {
    
//Get Notifications => Get all Updates on appraisals.
    this.getNotifications = function (param) {
        var response = $http({
            method: "GET",
            url: AuthHeaderService.getApiURL() + "web/get/appraisal/notifications/"+param.limit+
                                 "?VendorId="+param.VendorId+"&Company="+param.Company+"&Role="+param.Role,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    //getAppraisalList
    this.getAppraisalList = function (role) {
        var responseSave = $http({
            method: "GET",
            url: AuthHeaderService.getApiURL() + "web/get/appraisal/list/for/speedcheck/user?role="+role,
            headers: AuthHeaderService.getHeader()
        }); 
        return responseSave;
    }


    // getAllOpenAssignmentsList
    this.getAllOpenAssignmentsList = function () {
        var responseSave = $http({
            method: "GET",
            url: AuthHeaderService.getApiURL() + "web/vendor/openassignment/tabs",
            data:'',
            headers: AuthHeaderService.getHeader()
        }); 
        return responseSave;
    }


this.getAppraisalsUnderCategory = function(param)
{
  var responseSave = $http({
            method: "GET",
            url: AuthHeaderService.getApiURL() + "web/vendor/openassignment/appraisal/"+param.itemCategoryId+"?searchString="+param.searchString+"&startPos="+param.startPos+"&maxCount="+param.maxResult,
            data:'',
            headers: AuthHeaderService.getHeader()
        }); 
        return responseSave;   
}
}]);