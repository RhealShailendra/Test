angular.module('MetronicApp').controller('PolicyDetailsController', function ($rootScope, PolicyDetailsService, $log, $scope,
    settings, $http, $timeout, $location, $translate, $translatePartialLoader) {

    //set language
    //$translatePartialLoader.addPart('PolicyDetails');
    $translatePartialLoader.addPart('AdjusterGlobalsearch');
    $translate.refresh();

    $scope.Details = [];
    $scope.policyHolder ;
    function init() {
        $scope.UserType = sessionStorage.getItem("UserType");
        PolicyHolderDetails();
    }
    init();
    
    $scope.GoToHome = function () {
        $location.url('AdjusterGlobalSearch');
    };


    $scope.PolicyHolderDetails = PolicyHolderDetails;
    function PolicyHolderDetails() {
        var paramPO = {
            "policyNumber": sessionStorage.getItem("policyNumber"),
            "claimNumber": null,
        };
        $(".page-spinner-bar").removeClass("hide");
        var GetPolicyHolderDetails = PolicyDetailsService.GetPolicyHolderDetails(paramPO);
        GetPolicyHolderDetails.then(function (success) {
            $(".page-spinner-bar").addClass("hide");
            $scope.PolicyHolderDetails = success.data.data;
        }, function (error) {
            toastr.remove();
            toastr.error((error.data) ? error.data.errorMessage : "Failed to get the policy holder details. please try again", "Error");
            $(".page-spinner-bar").addClass("hide");
        });
    }
});