
    angular.module('MetronicApp').service('AppraisalService', ['$http', '$rootScope', 'AuthHeaderService', function ($http, $rootScope, AuthHeaderService) {
    
    //Get Dropdown List
    this.getAppraisalDropdowns = function () {
        var response = $http({
            method: "GET",
            url: AuthHeaderService.getApiURL() + "web/get/appraisal/dropdowns",
            data:'',
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    //getSpeedcheMapping 
    this.getSpeedcheMapping = function(){
        //var data={};
        var response =  $http.get('views/SpeedCheckContact/Dashboard/Appraisals/SpeedCheckMapping.json')
                .success(function (data) {
                   data = data;// console.log(data);
                })
                .error(function (data) {
                    //console.log("Error getting data from " + thisCtrl.route);
                });
                return response;
            }
    
    //Get Save Appraisal
    this.SaveAppraisal = function (param) {
        var response = $http({
            method: "POST",
            url: AuthHeaderService.getApiURL() +"web/appraisal/save",
            data:param,
            headers: AuthHeaderService.getFileHeader()
        });
        return response;
    };

    // UpdateAppraisal
    this.UpdateAppraisal = function (param){
        var response = $http({
            method: "POST",
            url: AuthHeaderService.getApiURL() +"web/appraisal/update",
            data:param,
            headers: AuthHeaderService.getFileHeader()
        });
        return response;
    }
    
    this.getSpeedcheValues = function(param){

        var response = $http({
            method: "POST",
            url: "http://69.164.195.59:8080/SpeedCheck_App/api/web/get/speedcheck/values",
            data:param,
            headers: {
                "Content-Type":"application/json"
            }
        });
        return response;
    }
    // getAppraisal
    this.getAppraisal = function (param) {
        var response = $http({
            method: "GET",
            url: AuthHeaderService.getApiURL() +"web/get/appraisal/"+param.appraisalId+"?reviewerId="+param.user+"&role="+param.role,
            headers: AuthHeaderService.getFileHeader()
        });
        return response;
    };

    ///delete/appraisal/
    this.deleteAppraisal = function (appraisalId) {
        var response = $http({
            method: "DELETE",
            url: AuthHeaderService.getApiURL() +"web/delete/appraisal/"+appraisalId,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

     //email appraisal
     this.EmailAppraisal = function(param){
        var response = $http({
            method: "post",
            url: AuthHeaderService.getApiURL() + "web/email/appraisal",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
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
            url: AuthHeaderService.getApiURL() + "web/appraisal/associate/"+data.appraisalId+"?assigneeId="+data.associate.employeeNumber+"&role="+data.associate.roleName,
            data:'',
            headers: AuthHeaderService.getHeader()
        }); 
        return responseSave;
    }

}]);
