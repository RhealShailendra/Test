angular.module('MetronicApp').service('SpeedCheckSupervisorService', ['$http', '$rootScope', 'AuthHeaderService', function ($http, $rootScope, AuthHeaderService) {
    
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
    this.getAppraisalList = function (param) {
        var responseSave = $http({
            method: "GET",
            url: AuthHeaderService.getApiURL() + "web/get/appraisal/list/for/speedcheck/user?userId="+param.userId+"&role="+param.role,
            headers: AuthHeaderService.getHeader()
        }); 
        return responseSave;
    }

    //get Associates List
    this.getAssociatesList = function () {
        var responseSave = $http({
            method: "GET",
            url: AuthHeaderService.getApiURL() + "web/get/speedcheck/associates",
            data:'',
            headers: AuthHeaderService.getHeader()
        }); 
        return responseSave;
    }
    
    //getAppraisalList
    this.assignAppraisalToAssociate = function (data) {
        var responseSave = $http({
            method: "GET",
            url: AuthHeaderService.getApiURL() + "web/appraisal/associate/"+data.appraisalId+"?associateId="+data.associate.employeeNumber,
            data:'',
            headers: AuthHeaderService.getHeader()
        }); 
        return responseSave;
    }


}]);
