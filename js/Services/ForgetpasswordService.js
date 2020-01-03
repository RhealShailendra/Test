angular.module('MetronicApp').service('ForgotpasswordService', ['$http', '$rootScope', 'AuthHeaderService', function ($http, $rootScope, AuthHeaderService) {
    this.ForgotPassword = function (param) {
        
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "customer/forgetpassword",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        
        return response;
    }
}]);