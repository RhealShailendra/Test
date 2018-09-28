angular.module('MetronicApp').controller('SetVendorContactController', function ($rootScope, $scope, $location, $translate, $translatePartialLoader,AuthHeaderService,SetVendorContactService) {
    //set language
    $translatePartialLoader.addPart('SetVendorContact');
    $translate.refresh();


 
    $scope.ClaimAssociatesList = [];
    $scope.EmployeeId;
    $scope.EmplyeeDetails = {};
    $scope.RoleList = [];
     function init() {
         GetVendorContactList();
         //GetRoleList();
    };
    init();

    $scope.GetRoleList = GetRoleList;
    function GetRoleList() {
        $(".page-spinner-bar").removeClass("hide");
        var RoleList = SetVendorContactService.GetRoles();
        RoleList.then(function (success) {
            $scope.RoleList = success.data.data;
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            toastr.remove();
            if (error.data.errorMessage != null && angular.isDefined(error.data.errorMessage)) {
                toastr.error(error.data.errorMessage, "Error")
            }
            else {
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error")
            }
            $(".page-spinner-bar").addClass("hide");
        });

    }

    $scope.GetVendorContactList = GetVendorContactList;
    function GetVendorContactList()
    {
        param = {
            "roleId": 1006
        };
        $(".page-spinner-bar").removeClass("hide");
        var AssociateList = SetVendorContactService.GetVendorContactList(param);
        AssociateList.then(function (success) {
            $scope.ClaimAssociatesList = success.data.data;
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {           
            toastr.remove();
            if (error.data.errorMessage != null && angular.isDefined(error.data.errorMessage)) {
                toastr.error(error.data.errorMessage, "Error")
            }
            else {
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error")
            }
            $(".page-spinner-bar").addClass("hide");
        });
    }

    $scope.GetDetails = GetDetails;
    function GetDetails() {
            //$scope.GetEmployeeDetails();
            angular.forEach($scope.ClaimAssociatesList, function (item) {
                if (item.userId == $scope.EmployeeId) {
                    $scope.EmplyeeDetails = item;
                }
            })
    };

    $scope.GetEmployeeDetails = GetEmployeeDetails;
    function GetEmployeeDetails()
    {
        $(".page-spinner-bar").removeClass("hide");
        var param =
            {
                id: $scope.EmployeeId
            };
        var AssociateList = SetVendorContactService.GetEmployeeDetails(param);
        AssociateList.then(function (success) {          
            $scope.EmplyeeDetails = success.data.data;
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            toastr.remove();
            if (error.data.errorMessage != null && angular.isDefined(error.data.errorMessage)) {
                toastr.error(error.data.errorMessage, "Error")
            }
            else {
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error")
            }
            $(".page-spinner-bar").addClass("hide");
        });
    }

});