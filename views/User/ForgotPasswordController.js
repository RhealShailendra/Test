angular.module('MetronicApp').controller('ForgotPasswordController', function ($rootScope, settings, $scope, $http, $location, $state, $translate, $translatePartialLoader, ForgotpasswordService) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });


    //set language
    $translatePartialLoader.addPart('Login');
    $translate.refresh();
    $scope.email = "";
    $scope.errormessage = "";
    $scope.LoginPage = LoginPage;
    function LoginPage(event) {
        if (angular.isDefined(sessionStorage.getItem("IsVendorLogIn")) && (sessionStorage.getItem("IsVendorLogIn") === "True")) {
            sessionStorage.setItem("IsVendorLogIn", undefined);
            $location.path('/VendorLogin');
        }
        else {
            sessionStorage.setItem("IsVendorLogIn", undefined);
            $location.path('/');
        }
    }
    $scope.ResetPassword = ResetPassword;
    function ResetPassword(event) {
        $scope.errormessage = "";
        var param = { "email": $scope.email };
        
        var response = ForgotpasswordService.ForgotPassword(param); 
        response.then(function (success) {  $scope.errormessage = success.data.message; },
            function (error) {
                
                $scope.errormessage = error.errormessage;
                if (angular.isUndefined(error.errormessage) || error.errormessage === null) {
                    $scope.errormessage = error.message;
                }
                else
                    $scope.errormessage = error.errormessage;
            });
    }

    $scope.EmptyError = function () {
        $scope.errormsg = '';
    }
});