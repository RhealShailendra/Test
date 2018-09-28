angular.module('MetronicApp').controller('ClaimAssociatesController', function ($rootScope, $translate, ClaimAssociatesService, $translatePartialLoader, $scope, settings,
    $timeout, $location, $filter,AuthHeaderService) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    $translatePartialLoader.addPart('ClaimAssociates');
    $translate.refresh();
    $scope.PageLength = $rootScope.settings.pagesize;
    $scope.ErrorMessage = "";
    $scope.ClaimAssociatesList = [];
    init();
    function init() {
        sessionStorage.setItem("ClaimAssociateId", "");       
        GetEmployeeList();
    }

    $scope.GetEmployeeList =GetEmployeeList;
    function GetEmployeeList() {
        $(".page-spinner-bar").removeClass("hide");
        var AssociateList = ClaimAssociatesService.GetEmployeeList();
        AssociateList.then(function (success) {
            $scope.ClaimAssociatesList = success.data.data;
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            $(".page-spinner-bar").addClass("hide");
            toastr.remove();
            toastr.error((angular.isDefined(error.data) && angular.isDefined(error.data.errorMessage) ? error.data.errorMessage : AuthHeaderService.genericErrorMessage()), "Error");
        });
    };
    $scope.AddNewAssociate = AddNewAssociate;
    function AddNewAssociate() {
        $location.url('NewClaimAssociate');
    }
    $scope.EditAssociate = EditAssociate;
    function EditAssociate(item) {
        //Get Id in session and nevigate
        sessionStorage.setItem("ClaimAssociateId", item.id);
        $location.url('NewClaimAssociate');
    }
    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }
    $scope.goToDashboard = goToDashboard;
    function goToDashboard()
    {
        $location.url(sessionStorage.getItem('HomeScreen'));
    }

    $scope.LoadFromFile=function()
    {
        $location.url("UploadVendorEmployee");
    }
});