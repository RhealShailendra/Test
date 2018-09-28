angular.module('MetronicApp').controller("GemlabDashboardConroller", function ($scope, $filter, $location, $translate, $translatePartialLoader, GemlabDashboardService, AuthHeaderService) {

    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    $translatePartialLoader.addPart('GemlabDashboard');
    $translate.refresh();
    $scope.EventList;
 //   $scope.searchClaim = {};
    $scope.CurrentClaimTab = 'SalvageClaims';
    $scope.AlertTab = 'Alert';
    $scope.purchaseOrderList = [];
    function init() {

        getPurchaseOrderList();
        GetAssignedClaims();
        GetUpcomingEventList();
    }
    init();

    //get List of Events
    $scope.GetUpcomingEventList = GetUpcomingEventList;
    function GetUpcomingEventList() {
        var GetEventList = GemlabDashboardService.getEventList();
        GetEventList.then(function (success) {
            $scope.EventList = success.data.data;
            // $scope.CheckStatus(); //to remove finished event from list
            angular.forEach($scope.EventList, function (event) {
                event.PrticipantString = "";
                angular.forEach(event.participants, function (participant, key) {
                    event.PrticipantString += participant.lastName == null ? "" : participant.lastName;
                    event.PrticipantString += " ";
                    event.PrticipantString += participant.firstName == null ? "" : participant.firstName;
                    if (key != event.participants.length - 1) {
                        event.PrticipantString += ",";
                    }
                });
            });
        });
    };

    //get list of all Claims
    $scope.GetAssignedClaims = GetAssignedClaims;
    function GetAssignedClaims() {
        $(".page-spinner-bar").removeClass("hide");
        var param = {
            "userId": sessionStorage.getItem("UserId")
        }
        var getNewClaims = GemlabDashboardService.getNewClaims(param);
        getNewClaims.then(function (success) {
            $scope.NewClaims = success.data.data;
            $scope.CustomObject = [];
            if ($scope.NewClaims != null && angular.isDefined($scope.NewClaims))
            angular.forEach($scope.NewClaims.vendorClaims, function (NewClaims) {
                angular.forEach(NewClaims.assignments, function (assignment, key) {
                    $scope.CustomObject.push({ "assignmentDetails": assignment, "ClaimDetails": NewClaims });
                });
            });
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            toastr.remove();
            toastr.error(error.data.errorMessage, "Error");
            $scope.ErrorMessage = error.data.errorMessage;
        });
    };

    //get list of all purchase Orders
    $scope.getPurchaseOrderList = getPurchaseOrderList;
    function getPurchaseOrderList() {
        $(".page-spinner-bar").removeClass("hide");
        Param = {
            "pageNumber": "",
           // "status":"COMPLETED"
        };
        var getPurchaseOrders = GemlabDashboardService.getPurchaseOrder(Param);
        getPurchaseOrders.then(function (success) {
            $scope.purchaseOrderList = success.data.data.gemLabRequestPurchaseOrder;
             
            $(".page-spinner-bar").addClass("hide");
   
        }, function (error) {
            $(".page-spinner-bar").addClass("hide");
            toastr.remove();
            toastr.error((angular.isDefined(error.data) && angular.isDefined(error.data.errorMessage) ? error.data.errorMessage : AuthHeaderService.genericErrorMessage()), "Error")
        });
    };

    //Sorting of purchase order table
    $scope.purchaseOrderKey = "createDate";
    $scope.purchaseOrderReverse = true;
    $scope.PurchaseOrdersort = function (keyname) {
         
        $scope.purchaseOrderKey = keyname;   //set the sortKey to the param passed
        $scope.purchaseOrderList = $filter('orderBy')($scope.purchaseOrderList, $scope.purchaseOrderKey);
        $scope.purchaseOrderReverse = !$scope.purchaseOrderReverse; //if true make it false and vice versa
    }

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
        if (claim.ClaimDetails.claimId != null && claim.ClaimDetails.claimNumber != null && claim.assignmentDetails.assignmentNumber != null && claim.assignmentDetails.id != null) {
            sessionStorage.setItem("ThirdPartyClaimId", claim.ClaimDetails.claimId);
            sessionStorage.setItem("ThirdPartyClaimNo", claim.ClaimDetails.claimNumber);
            sessionStorage.setItem("AssignmentNumber", claim.assignmentDetails.assignmentNumber);
            sessionStorage.setItem("AssignmentId", claim.assignmentDetails.id);
            sessionStorage.setItem("ShowEventActive", "");
            sessionStorage.setItem("ShowNoteActive", "");
            $location.url('GemLabClaimDetails')
        }
    };

    $scope.GoToOrderDetails = GoToOrderDetails;
    function GoToOrderDetails(item) {
        sessionStorage.setItem("OrderId", item.id);
        $location.url('/OrderDetails');
    };

} );