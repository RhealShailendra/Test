angular.module('MetronicApp').controller('ThirdPartyAssignServiceRequesttController', function ($rootScope, $uibModal, $scope, ThirdPartyServiceRequestEditService, settings, $filter, $window, $timeout, $location, $translate, $translatePartialLoader) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });

    //set language 
    $translatePartialLoader.addPart('ServiceRequestAssign');
    $translate.refresh();
    $scope.pagesize = $rootScope.settings.pagesize;

    $scope.serviceRequestDetails = {};
    $scope.AssociateList = [];
    //Service Details
    function init() {
        $(".page-spinner-bar").removeClass("hide");
        $scope.ServiceRequestId = sessionStorage.getItem("ServiceRequestId");
        if ($scope.ServiceRequestId === null || angular.isUndefined($scope.ServiceRequestId)) {
            sessionStorage.setItem("ServiceRequestId", null);
            $location.url("ThirdPartyServiceRequestEdit");
        }
        else {
            //Get statusList
            var GetStatusList = ThirdPartyServiceRequestEditService.GetStatusList();
            GetStatusList.then(function (success) {
                $scope.StatusList = success.data.data;
            }, function (error) {
                $scope.ErrorMessage = error.errorMessage;
            });
            //Get request details
            var paramRequestId = { "serviceRequestId": $scope.ServiceRequestId }
            var GetServiceDetails = ThirdPartyServiceRequestEditService.GetServiceDetails(paramRequestId);
            GetServiceDetails.then(function (success) {
                $scope.serviceRequestDetails = success.data.data;
            }, function (error) {

                toastr.remove();
                toastr.error(error.data.errorMessage, "Error");
            });


         
            var GetAssociatesList = ThirdPartyServiceRequestEditService.GetVendorAssociatesList();
            GetAssociatesList.then(function (success) {
                $scope.AssociateList = success.data.data;
                $(".page-spinner-bar").addClass("hide");
            }, function (error) { $(".page-spinner-bar").addClass("hide"); });
         
        }
    }
    init();
    //End service details
    //Assign functionality
    $scope.sortAssociate = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }
    $scope.SelectAssociate = function (Associate) {
        $scope.AssociateIdToAssignRequest = Associate.id;
    }
    //Assign service to vendor associate
    $scope.AssignServiceRequest = AssignServiceRequest;
    function AssignServiceRequest() {
        $scope.ErrorMessage = "";
        if ($scope.AssociateIdToAssignRequest !== null && angular.isDefined($scope.AssociateIdToAssignRequest)) {
            $(".page-spinner-bar").removeClass("hide");
            var paramAssignRequest = {
                "assignedUserId": $scope.AssociateIdToAssignRequest,
                "serviceRequestId": $scope.ServiceRequestId
            };
            
            var AssignServiceRequest = ThirdPartyServiceRequestEditService.AssignServiceRequest(paramAssignRequest);
            AssignServiceRequest.then(function (success) {
                toastr.remove();
                toastr.success(success.data.message, "Confirmation");
                $(".page-spinner-bar").addClass("hide");
            }, function (error) {
                toastr.remove();
                toastr.error(error.data.errorMessage, "Error");
                $(".page-spinner-bar").addClass("hide");
            });
        }
        else {
            $scope.ErrorMessage = "Please selete Associate from the list."
        }
    }

    $scope.GoBack = function () {
        $location.url('ThirdPartyServiceRequestEdit')
    }
    $scope.GotoClaimDetails = function () {
        sessionStorage.setItem("ServiceRequestId",null);
        $location.url('HomeScreen');
    }
    $scope.GotoDashboard = function () {
        sessionStorage.setItem("ThirdPartyClaimNo", "");
        sessionStorage.setItem("ThirdPartyClaimId", "");
        sessionStorage.setItem("ServiceRequestId", null);
        $location.url(sessionStorage.getItem('HomeScreen'));
    }

});