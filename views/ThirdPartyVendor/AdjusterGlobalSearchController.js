angular.module('MetronicApp').controller('AdjusterGlobalSearchController', function ($rootScope, AdjusterDashboardService, $scope, $window, $filter, $location, $translate, $translatePartialLoader, $uibModal) {
    $translatePartialLoader.addPart('AdjusterGlobalsearch');
    $translate.refresh();

    $scope.GlobalsearchText = sessionStorage.getItem("GlobalSearchtext");
    $scope.DisplayRecordForText = sessionStorage.getItem("GlobalSearchtext");
    $scope.itemPageSize = $rootScope.settings.itemPagesize;
    $scope.SearchResult = {
        "Document": [],
        "Claim": [],
        "Policy": [],
        "User": [],
        "Vendors": []
    };

    function init() {
        $scope.Orderreverse = true;
        $scope.reverseAppraisals = true;
        $scope.sortKeyOrder = "orderDate";
        $scope.CurrentDiv = 'Claims';
        $scope.UserType = sessionStorage.getItem("UserType");
        getSearchResult();
    }
    init();

    $scope.ShowHideTab = function (tabname) {
        $scope.CurrentDiv = tabname;
    };

    function getSearchResult() {
        $(".page-spinner-bar").removeClass("hide");
        var param =
       {
           "searchString": sessionStorage.getItem("GlobalSearchtext"),
           //"companyId": sessionStorage.getItem("CompanyId")
       };

        var GlobalSearch = AdjusterDashboardService.GlobalSearch(param);
        GlobalSearch.then(function (success) {
            $scope.SearchResult.Document = success.data.data.documents;
            $scope.SearchResult.Claim = success.data.data.claims;
            $scope.SearchResult.Policy = success.data.data.policies;
            $scope.SearchResult.User = success.data.data.persons;
            $scope.SearchResult.Vendors = success.data.data.vendors;
            $scope.SearchResult.PurchaseOrders = success.data.data.purchaseOrders;
            $scope.SearchResult.Appraisals = success.data.data.appraisals;
           
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            $(".page-spinner-bar").addClass("hide");
            toastr.remove();
            toastr.error(error.data.errorMessage, "Error");
        });
    }

    $scope.Search = function () {
        $scope.DisplayRecordForText = $scope.GlobalsearchText;
        sessionStorage.setItem("GlobalSearchtext", $scope.GlobalsearchText)
        getSearchResult();
    }

    //Sorting  
    $scope.sortClaim = function (keyname) {
        $scope.sortKeyClaim = keyname;   //set the sortKey to the param passed
        $scope.Claimreverse = !$scope.Claimreverse; //if true make it false and vice versa
    }

    $scope.sortPolicy = function (keyname) {
        $scope.sortKeyPolicy = keyname;   //set the sortKey to the param passed
        $scope.Policyreverse = !$scope.Policyreverse; //if true make it false and vice versa
    }

    $scope.sortDocument = function (keyname) {
        $scope.sortKeyDocx = keyname;   //set the sortKey to the param passed
        $scope.Docxreverse = !$scope.Docxreverse; //if true make it false and vice versa
    }
    $scope.sortPurchaseOrders = function (keyname) {
        $scope.sortKeyOrder = keyname;   //set the sortKey to the param passed
        $scope.Orderreverse = !$scope.Orderreverse; //if true make it false and vice versa
       
    }
    $scope.sortApprisal = function (keyname) {
        $scope.sortKeyOrder = keyname;   //set the sortKey to the param passed
        $scope.reverseAppraisals = !$scope.reverseAppraisals; //if true make it false and vice versa

    }

    $scope.GotoDashboard = function () {
        $location.url(sessionStorage.getItem('HomeScreen'));
    }

    $scope.GotoPurchaseOrdersInfo = function (item) {
        sessionStorage.setItem("OrderId", item.orderType.id)
        $location.url('/PODetailsDepartment');
    }

    //$scope.GotoClaimDetails = GotoClaimDetails;
    //function GotoClaimDetails(claim) {
    //    var role = sessionStorage.getItem("RoleList");

    //    //For adjuster
    //    if (role === 'ADJUSTER') {
    //        sessionStorage.setItem("AdjusterClaimId", claim.claimId);
    //        sessionStorage.setItem("AdjusterClaimNo", claim.claimNumber);
    //        $location.url('\AdjusterPropertyClaimDetails', claim.policyNumber);
    //    }
    //        //For Third party vendor
    //    else if (role === 'VENDOR CONTACT PERSON' || role === "VENDOR") {
    //        sessionStorage.setItem("ThirdPartyClaimId", claim.claimId);
    //        sessionStorage.setItem("ThirdPartyClaimNo", claim.claimNumber);
    //        $location.url('\ThirdPartyClaimDetails');
    //    }
    //        //For policyholder
    //    else if (role === 'INSURED') {
    //        sessionStorage.setItem("PolicyHolderClaimId", claim.claimId);
    //        sessionStorage.setItem("PolicyHolderClaimNo", claim.claimNumber);
    //        $location.url('\PolicyHolderClaimDetails');
    //    }
    //        //For vendor associate
    //    else if (role === 'VENDOR ASSOCIATE') {
    //        sessionStorage.setItem("VendorAssociateClaimId", claim.claimId);
    //        sessionStorage.setItem("VendorAssociateClaimNo", claim.claimNumber);
    //        $location.url('\VendorAssociateClaimDetails');
    //    }
    //        //For Claim Supervisor
    //    else if (role === 'SUPERVISOR') {
    //        sessionStorage.setItem("SupervisorClaimId", claim.claimId);
    //        sessionStorage.setItem("SupervisorClaimNo", claim.claimNumber);
    //        $location.url('\SupervisorClaimDetails');
    //    }
    //    else if (role === "CLAIM MANAGER" || role === "CLAIM CENTER ADMIN" || role === "AGENT") {
    //        sessionStorage.setItem("ManagerScreenClaimId", claim.claimId);
    //        sessionStorage.setItem("ManagerScreenClaimNo", claim.claimNumber);
    //        sessionStorage.setItem("ManagerScreenpolicyNo", claim.claimNumber);

    //        $location.url('\ClaimCenter-ClaimDetails');
    //    }
    //}

    $scope.GoToPolicyDetails = GoToPolicyDetails
    function GoToPolicyDetails(item) {
            
        sessionStorage.setItem("policyNumber", item.policyNumber);
        $location.url('PolicyDetails');
    }

    $scope.GetDocxDetails = GetDocxDetails
    function GetDocxDetails(item) {
        $scope.animationsEnabled = true;
        var out = $uibModal.open(
        {

            animation: $scope.animationsEnabled,
            templateUrl: "views/GlobalSearch/DocumentDetails.html",
            controller: "DocumentDetailsController",
            resolve:
            {
                objDocx: function () {
                    objDocx = item;
                    return objDocx;
                }
            }

        });
        out.result.then(function (value) {

        }, function (res) {

        });
        return {
            open: open
        };
    }

    $scope.GotoPeopleDetails = GotoPeopleDetails;
    function GotoPeopleDetails(item) {
        if (item != null && angular.isDefined(item)) {
            sessionStorage.setItem("PeopleDetails", JSON.stringify(item));
            $location.url('\PeopleDetails');
        }
    }
    $scope.GotoVendorInfo = GotoVendorInfo;
    function GotoVendorInfo(item) {
        sessionStorage.setItem("VendorId", item.vendorId)
        $location.url('VendorInfo');       
    }
    
    //Goto ClaimDetails
    $scope.GotToClaimDetailsScreen = GotToClaimDetailsScreen;
    function GotToClaimDetailsScreen(claim) {
        if (claim.id != null && claim.claimNumber != null && claim.vendorAssignmentDTOs[0].assignmentNumber != null && claim.vendorAssignmentDTOs[0].id != null) {

            sessionStorage.setItem("ThirdPartyClaimId", claim.id);
            sessionStorage.setItem("ThirdPartyClaimNo", claim.claimNumber);
            sessionStorage.setItem("AssignmentNumber", claim.vendorAssignmentDTOs[0].assignmentNumber);
            sessionStorage.setItem("AssignmentId", claim.vendorAssignmentDTOs[0].id);   
            sessionStorage.setItem("ShowEventActive", "");
            sessionStorage.setItem("ShowNoteActive", "");
            var role=sessionStorage.getItem("RoleList");
            if (angular.isDefined(role) && role!==null)
            {
                if (role.trim().toUpperCase() === "VENDOR ASSOCIATE" || role.trim().toUpperCase() === 'VENDOR MANAGER') {
                    sessionStorage.setItem("VendorAssociateClaimStatus", claim.status.status);
                    $location.url('VendorAssociateClaimDetails');                   
                }
                else if (role.trim().toUpperCase() == "VENDOR CONTACT" || role.trim().toUpperCase() === "VENDOR") {
                    sessionStorage.setItem("ThirdPartyClaimStatus", claim.status.status);
                    $location.url('ThirdPartyClaimDetails');
                }
                else if (role.trim().toUpperCase() === 'INSURED') {
                    $location.url('\PolicyHolderClaimDetails');
                }
                else if (role.trim().toUpperCase() === 'SUPERVISOR') {
                    $location.url('\SupervisorClaimDetails');
                }
                else if (role === "CLAIM MANAGER" || role === "CLAIM CENTER ADMIN" || role === "AGENT") {
                    $location.url('\ClaimCenter-ClaimDetails');
                }
                else if (role.trim().toUpperCase() === 'GEMLAB ADMINISTRATOR') {
                    sessionStorage.setItem("ThirdPartyClaimStatus", claim.status.status);
                    $location.url('GemlabClaimDetails')
                }
            }
        }
    };

    $scope.GotoDetails = GotoDetails;
    function GotoDetails(Item) {
        sessionStorage.setItem("appraisalNumber", Item.appraisalNumber);
        $location.url('VendorApprisal');
    }
});