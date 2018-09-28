angular.module('MetronicApp').controller("salvageDashboardController", function ($scope, $filter, $location, $translate, $translatePartialLoader, salvageDashboardService) {

    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    $translatePartialLoader.addPart('salvageDashboard');
    $translate.refresh();
    //   $scope.searchClaim = {};
    $scope.CurrentClaimTab = 'SalvageClaims';
    $scope.AlertTab = 'Alert';
    $scope.purchaseOrderList = [];
    function init() {             
        GetAssignedClaims();
    }
    init();

    //get list of all Claims
    $scope.GetAssignedClaims = GetAssignedClaims;
    function GetAssignedClaims() {
        $(".page-spinner-bar").removeClass("hide");
        var getNewClaims = salvageDashboardService.getNewClaims();
        getNewClaims.then(function (success) {
            $scope.NewClaims = success.data.data;
          
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            toastr.remove();
            toastr.error(error.data.errorMessage, "Error");
            $scope.ErrorMessage = error.data.errorMessage;
        });
    };

    //Sorting of Claim
    $scope.sortNewClaimKey = "ClaimDetails.createDate";
    $scope.reverseNewClaim = false;
    $scope.sort = function (keyname) {

        $scope.sortNewClaimKey = keyname;   //set the sortKey to the param passed
        $scope.CustomObject = $filter('orderBy')($scope.CustomObject, $scope.sortNewClaimKey);
        $scope.reverseNewClaim = !$scope.reverseNewClaim; //if true make it false and vice versa
    }


    //Goto ClaimDetails
    $scope.GotToClaimDetailsScreen = GotToClaimDetailsScreen;
    function GotToClaimDetailsScreen(claim) {
        if (claim.gemlabLineItem.claimNumber != null && claim.gemlabLineItem.assignmentNumber != null && claim.gemlabLineItem.id!=null) {
            //  sessionStorage.setItem("ThirdPartyClaimId", claim.gemlabLineItem.claimId);
            // sessionStorage.setItem("AssignmentId", claim.gemlabLineItem.id);
            sessionStorage.setItem("ThirdPartyClaimNo", claim.gemlabLineItem.claimNumber);
            sessionStorage.setItem("AssignmentNumber", claim.gemlabLineItem.assignmentNumber);
            sessionStorage.setItem("ThirdPartyPostLostItemId", claim.gemlabLineItem.id);
            $location.url('ThirdPartyLineItemDetails')
        }
    };

});