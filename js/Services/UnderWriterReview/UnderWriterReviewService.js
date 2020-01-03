angular.module('MetronicApp').service('UnderWriterReviewService', ['$http', '$rootScope', 'AuthHeaderService', function ($http, $rootScope, AuthHeaderService) {
    
    //underwriter review
    this.UnderWriterReview = function(param){
        var response = $http({
            method: "GET",
            url: AuthHeaderService.getApiURL() + "web/review/appraisals/"+param.appraisalId+"?userType="+param.userType+"&ProductID="+param.userName,
            headers: AuthHeaderService.getHeader()
        })
        return response;
    } 

}]);