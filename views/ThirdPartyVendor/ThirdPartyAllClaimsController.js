angular.module('MetronicApp').controller('ThirdPartyAllClaimsController', function ($rootScope, $translate, ThirdPartyAllClaimsService, $translatePartialLoader, $scope, settings,
     $location, $filter) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    $translatePartialLoader.addPart('ThirdPartAllClaims');
    $translate.refresh();
    //Claims to be assigned section
    $scope.pagesize = $rootScope.settings.pagesize;
    $scope.FilteredAllClaims = [];
    $scope.PageLength = $rootScope.settings.pagesize;
    $scope.ClaimFilter = "ALL";
    $scope.StatusList = [];
    $scope.claimsList = [];
    $scope.DuplicateStatusList = [];
    $scope.CheckedStatus = {
        status: []
    };
    $scope.status = [{ Selected: null }];

    function init() {
        GetClaimStatus();
        GetAllClaim("");
    }
    init();
    $scope.GetClaimStatus=GetClaimStatus;
    function GetClaimStatus() {
        $(".page-spinner-bar").removeClass("hide");
        var GetClaimStatusList = ThirdPartyAllClaimsService.getClaimStatus();
        GetClaimStatusList.then(function (success) {
            $scope.StatusList = success.data.data;
           // $(".page-spinner-bar").addClass("hide");
            angular.forEach($scope.StatusList, function (Item) {
                $scope.DuplicateStatusList.push({ "id": Item.id, status: Item.status, Selected: false });
            });

        }, function (error) {
            if (error != null) {
                toastr.remove();
                toastr.error(error.data.errorMessage, "Error");
            }
            else {
                toastr.remove();
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error");
            }
            $(".page-spinner-bar").addClass("hide");
        });
    };

    $scope.GetAllClaim = GetAllClaim;
    function GetAllClaim(Parameters) {
        $(".page-spinner-bar").removeClass("hide");
        var Param;

        if (Parameters == null || Parameters == "") {
            Param = {
                "filter": {
                    "status": null,
                    "startDate": angular.isUndefined($scope.fromDate) ? null : $filter('DatabaseDateFormatMMddyyyy')($scope.fromDate),
                    "endDate": angular.isUndefined($scope.toDate) ? null : $filter('DatabaseDateFormatMMddyyyy')($scope.toDate),
                }

            }
        }
        else if (Parameters != null || Parameters != "") {
            Param = {
                "filter": {
                    "status": Parameters,
                    "startDate": angular.isUndefined($scope.fromDate) ? null : $filter('DatabaseDateFormatMMddyyyy')($scope.fromDate),
                    "endDate": angular.isUndefined($scope.toDate) ? null : $filter('DatabaseDateFormatMMddyyyy')($scope.toDate),
                }
            };
        }

        var GetAllClaims = ThirdPartyAllClaimsService.getAllClaims(Param);
        GetAllClaims.then(function (success) {
            if (success.data.data != null) {
                $scope.claimsList = success.data.data;
            }
            else {
                $scope.claimsList = null;
            }

            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            if (error != null) {
                toastr.remove();
                toastr.error(error.data.errorMessage, "Error");
            }
            else {
                toastr.remove();
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error");
            }
            $(".page-spinner-bar").addClass("hide");
        });

    };

    $scope.searchByDate = searchByDate;
    function searchByDate(param) {
        var dt = new Date();
        var month = dt.getMonth(), year = dt.getFullYear();

        if (param == 'ThisMonth') {
            $scope.fromDate = new Date(year, month, 1).toLocaleDateString();
            $scope.toDate = new Date(year, month, dt.getDate()).toLocaleDateString();
        }
        else if (param == 'Last3Month') {
            $scope.fromDate = new Date(year, month - 3, 1).toLocaleDateString();
            $scope.toDate = new Date(year, month, dt.getDate()).toLocaleDateString();
        } else if (param == "All") {
            $scope.fromDate = "";
            $scope.toDate = "";
        }

        CheckBoxChecked();
    };

    $scope.CheckBoxChecked = CheckBoxChecked;
    function CheckBoxChecked(status) {

        var filter = [];
        //var message = "";
        for (var i = 0; i < $scope.DuplicateStatusList.length; i++) {
            if ($scope.DuplicateStatusList[i].Selected) {
                filter.push({ "status": $scope.DuplicateStatusList[i].status });
            }
        }
        if (filter == "" || filter == null) {
            var Param = null
        }
        else {
            var Param = filter
        }

        GetAllClaim(Param);
    };
    //Global serch
    $scope.GlobalSearchText = "";
    $scope.GotoGlobalSearch = GotoGlobalSearch;
    function GotoGlobalSearch()
    {
        if ($scope.GlobalSearchText !== "") {
            sessionStorage.setItem("ThirdPartyGlobalSearchText", $scope.GlobalSearchText);
            $location.url('ThirdPartyGlobalSearch');
        }
    }
    //Go to Claim details
    $scope.GoToHome = function () {
        $location.url(sessionStorage.getItem('HomeScreen'));
    };
    //Goto ClaimDetails
    $scope.GotToClaimDetailsScreen = GotToClaimDetailsScreen;
    function GotToClaimDetailsScreen(claim) {
        if (claim.claimId != null && claim.claimNumber != null && claim.vendorAssignmentDTOs[0].assignmentNumber != null && claim.vendorAssignmentDTOs[0].id != null) {

            sessionStorage.setItem("ThirdPartyClaimId", claim.id);
            sessionStorage.setItem("ThirdPartyClaimNo", claim.claimNumber);
            sessionStorage.setItem("AssignmentNumber", claim.vendorAssignmentDTOs[0].assignmentNumber);
            sessionStorage.setItem("AssignmentId", claim.vendorAssignmentDTOs[0].id);
            sessionStorage.setItem("ShowEventActive", "");
            sessionStorage.setItem("ShowNoteActive", "");
            var role = sessionStorage.getItem("RoleList");
            if (angular.isDefined(role) && role !== null) {
                if (role.trim().toUpperCase() == "VENDOR ASSOCIATE") {
                    sessionStorage.setItem("VendorAssociateClaimStatus", claim.status.status);
                    $location.url('VendorAssociateClaimDetails');
                }
                else if (role.trim().toUpperCase() == "VENDOR CONTACT") {
                    sessionStorage.setItem("ThirdPartyClaimStatus", claim.status.status);
                    $location.url('ThirdPartyClaimDetails');
                }
            }
        }
    };
});