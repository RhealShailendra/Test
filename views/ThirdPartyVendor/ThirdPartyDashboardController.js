angular.module('MetronicApp').controller('ThirdPartyDashboardController', function ($translate, $translatePartialLoader, $rootScope, $log, $scope, $filter,
    settings, $http, $timeout, $location, ThirdPartyVendorDashboardService) {
    $scope.items = $rootScope.items; $scope.boolValue = true;
    $translatePartialLoader.addPart('ThirdPartyDashboard');
    $translate.refresh();
    $scope.GlobalSearchText = "";
    $scope.pagesize = $rootScope.settings.pagesize;
    $scope.NewClaims = [];
    $scope.Notifications = [];
    $scope.ErrorMessage = "";
    $scope.AlertList = [];
    $scope.EventList = [];
    $scope.ServiceRequestList = [];
    $scope.pagination ={current: 1}
    function init() {
        sessionStorage.setItem("ThirdPartyClaimNo", "");
        sessionStorage.setItem("ThirdPartyClaimId", "");
        sessionStorage.setItem("ThirdPartyGlobalSearchText", "");       
         
        GetAssignedClaims();
        GetUpcomingEventList();
        GetAlertsList();
        GetServiceRequestList()
    }
    init();


    //Sorting of datatbale  
    $scope.reverseNewClaim = true;
    $scope.sortNewClaim = function (keyname) {
        $scope.sortNewClaimKey = keyname;   //set the sortKey to the param passed
        $scope.NewClaims = $filter('orderBy')($scope.NewClaims, $scope.sortNewClaimKey);
        $scope.reverseNewClaim = !$scope.reverseNewClaim; //if true make it false and vice versa
    }

    $scope.GetAssignedClaims = GetAssignedClaims;
    function GetAssignedClaims() {
       $(".page-spinner-bar").removeClass("hide");
        var param = {
            "assignedUserId": sessionStorage.getItem("VendorId"),
            "pageNumber":  null
        }
        var getNewClaims = ThirdPartyVendorDashboardService.getNewClaims(param);
        getNewClaims.then(function (success) {
            $(".page-spinner-bar").removeClass("hide");
            if (success.data.data != null) {
                $scope.NewClaims = success.data.data.vendorClaims;
                $scope.openClaimsPageSize = success.data.data.totalPageSize;
                $scope.currentPageNo = success.data.data.currentPageNumber;
                $scope.CustomObject = [];
                angular.forEach($scope.NewClaims, function (NewClaims) {
                    angular.forEach(NewClaims.assignments, function (assignment, key) {
                        $scope.CustomObject.push({ "assignmentDetails": assignment, "ClaimDetails": NewClaims });
                    });
                });
            }
            $scope.CustomObject = $filter('orderBy')($scope.CustomObject, 'ClaimDetails.assignedDate');
          
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            toastr.remove();
            toastr.error(error.data.errorMessage, "Error");
            $scope.ErrorMessage = error.data.errorMessage;
            $(".page-spinner-bar").addClass("hide");
        });
    };

    $scope.GetUpcomingEventList = GetUpcomingEventList;
    function GetUpcomingEventList()
        {
            var GetEventList = ThirdPartyVendorDashboardService.getEventList();
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
            }, function (error) {
                toastr.remove();
                toastr.error(error.data.errorMessage, "Error");
                $scope.ErrorMessage = error.data.errorMessage;
            });

        }

    $scope.GetAlertsList = GetAlertsList;
    function GetAlertsList() {
        //Get Alert List
        var param = {
            "id": sessionStorage.getItem("UserId").toString()
            // "id":"252"
        };
        var GetAlertList = ThirdPartyVendorDashboardService.getAlertList(param);
        GetAlertList.then(function (success) {
            $scope.AlertList = success.data.data;
            var UnreadAlert = $filter('filter')($scope.AlertList, { isRead: false });
            $scope.AlertList = UnreadAlert;

        }, function (error) {
            toastr.remove();
            toastr.error(error.data.errorMessage, "Error");
            $scope.ErrorMessage = error.data.errorMessage;
        });
    };

    //Goto Alert Details
    $scope.GoToAlertDetails = function (alert) {

        if (alert.notificationParams.claimId != null && alert.notificationParams.claimNumber != null) {
            $scope.ReadNotification(alert.id);
            sessionStorage.setItem("ThirdPartyClaimNo", alert.notificationParams.claimNumber);
            sessionStorage.setItem("ThirdPartyClaimId", alert.notificationParams.claimId);

            if (alert.type.type === "ALERT") {

                sessionStorage.setItem("ShowNoteActive", true);
                sessionStorage.setItem("ShowEventActive", false);
            }
            else if (alert.type.type === "EVENT") {

                sessionStorage.setItem("ShowEventActive", true);
                sessionStorage.setItem("ShowNoteActive", false);
            }
            else {
                sessionStorage.setItem("ShowEventActive", "");
                sessionStorage.setItem("ShowNoteActive", "");
            }
            //URL for Claim details
            $location.url('ThirdPartyClaimDetails');
        }
    };

    //goto to Event Details
    $scope.GetEventDetails = GetEventDetails;
    function GetEventDetails(claim) {

        if (claim.id != null && claim.claimNumber != null) {
            sessionStorage.setItem("ThirdPartyClaimId", claim.id);
            sessionStorage.setItem("ThirdPartyClaimNo", claim.claimNumber);
            sessionStorage.setItem("ShowEventActive", true);
            sessionStorage.setItem("ShowNoteActive", false);
            $location.url('ThirdPartyClaimDetails')
        }
    };

    //Goto ClaimDetails
    $scope.GotToClaimDetailsScreen = GotToClaimDetailsScreen;
    function GotToClaimDetailsScreen(claim) {     
        if (claim.ClaimDetails.claimId != null && claim.ClaimDetails.claimNumber != null && claim.assignmentDetails.assignmentNumber != null && claim.assignmentDetails.id != null)
        {
            sessionStorage.setItem("ThirdPartyClaimId", claim.ClaimDetails.claimId);
            sessionStorage.setItem("ThirdPartyClaimNo", claim.ClaimDetails.claimNumber);
            sessionStorage.setItem("AssignmentNumber", claim.assignmentDetails.assignmentNumber);
            sessionStorage.setItem("AssignmentId", claim.assignmentDetails.id);
            sessionStorage.setItem("ThirdPartyClaimStatus", claim.ClaimDetails.status.status);
            sessionStorage.setItem("ShowEventActive", "");
            sessionStorage.setItem("ShowNoteActive", "");
            $location.url('ThirdPartyClaimDetails')
        }
    };

    $scope.GotoGlobalSearch = GotoGlobalSearch;
    function GotoGlobalSearch() {
        if ($scope.GlobalSearchText !== "") {
            sessionStorage.setItem("ThirdPartyGlobalSearchText", $scope.GlobalSearchText);
            $location.url('ThirdPartyGlobalSearch');
        }

    }

    //Make Notification as read
    $scope.ReadNotification = ReadNotification;
    function ReadNotification(id) {

        //Get Alert List
        var paramId = {
            "id": id
        };
        var GetAlertList = ThirdPartyVendorDashboardService.readNotification(paramId);
        GetAlertList.then(function (success) {


        }, function (error) {
            $scope.ErrorMessage = error.data.errorMessage;
        });
    };

    //Remove Finished event
    $scope.CheckStatus = CheckStatus;
    function CheckStatus() {
        var UpcomingEvent = [];
        var CurrentDate = $filter('date')(new Date(), "MM/dd/yyyy");
        var CurrentTime = $filter('date')(new Date(), "hh:mma");

        angular.forEach($scope.EventList, function (event) {
            var EndDate = "";
            var EndTime = "";
            EndDate = $filter('DateFormatMMddyyyy')(event.endTiming);
            EndTime = $filter('DateFormatTime')(event.endTiming);

            if (EndDate >= CurrentDate) {
                if (EndTime >= CurrentTime) {

                    event.IsActive = true
                    UpcomingEvent.push(event);
                }
                else {
                    event.IsActive = false
                }
            }
            else {

                event.IsActive = false
            }

        });

        $scope.EventList = UpcomingEvent;
    };

    //This is dummy method have to delete used for demo 
    $scope.GoToLineItemDetailsDummy = GoToLineItemDetailsDummy;
    function GoToLineItemDetailsDummy() {
        sessionStorage.setItem("ThirdPartyClaimNo", "123")
        sessionStorage.setItem("ThirdPartyClaimId", "123")
        sessionStorage.setItem("ThirdPartyPostLostItemId", "3")
        sessionStorage.setItem("Policyholder", "Test" + " " + "Test")
        $location.url('ThirdPartyLineItemDetails');
    }


    //This is dummy method have to delete used for demo 
    $scope.GoToClaimDetailsDummy = GoToClaimDetailsDummy;
    function GoToClaimDetailsDummy() {
        sessionStorage.setItem("ThirdPartyClaimNo", "123")
        sessionStorage.setItem("ThirdPartyClaimId", "123")
        sessionStorage.setItem("Policyholder", "Test" + " " + "Test")
        $location.url('ThirdPartyClaimDetails');
    }

    $scope.GetServiceRequestList = GetServiceRequestList;
    function GetServiceRequestList(){
        var param = {
            "vendorId": sessionStorage.getItem("VendorId")
        }
        var getServiceRequest = ThirdPartyVendorDashboardService.getServiceRequest(param);
        getServiceRequest.then(function (success) {
            $scope.ServiceRequestList = success.data.data;
        },function (error) {
            toastr.remove();
            toastr.error(error.data.errorMessage, "Error");
            $scope.ErrorMessage = error.data.errorMessage;
        });
    }

    $scope.GoToServiceRequestEdit = function (item) {
        $scope.GetClaimInsuranceDetails(item.claimNumber);
        $scope.GetPolicyHolderDetails(item.claimNumber);
        $scope.GetContentDetails(item);
       
    }

    $scope.GoToServiceRequest = $scope.GoToServiceRequest;
    function GoToServiceRequest(item) {
        var AdjName = "";
        GetClaimInsuranceDetails(item.claimNumber);
        GetPolicyHolderDetails(item.claimNumber);
        if (angular.isDefined($scope.GetInsurancDetails)) {

            if ($scope.GetInsurancDetails.adjuster) {

                AdjName = (($scope.GetInsurancDetails.adjuster.firstName) ? $scope.GetInsurancDetails.adjuster.firstName : "")
                     + " " + (($scope.GetInsurancDetails.adjuster.lastName) ? $scope.GetInsurancDetails.adjuster.lastName : "")
            }
        }
        var PolicyHolder = "";
        if (angular.isDefined($scope.PolicyHolderDetails)) {
            if ($scope.PolicyHolderDetails.policyHolder) {

                PolicyHolder = (($scope.PolicyHolderDetails.policyHolder.firstName) ? $scope.PolicyHolderDetails.policyHolder.firstName : "")
                    + " " + (($scope.PolicyHolderDetails.policyHolder.lastName) ? $scope.PolicyHolderDetails.policyHolder.lastName : "")
            }
        }
        var UserDetails = {
            "ClaimNoForInvice": item.claimNumber,
            "AdjusterName": AdjName,
            "InsuredName": PolicyHolder,
            "taxRate": $scope.ConentDetails.policyDetails.taxRates,
            "ServiceRequestId": item.serviceRequestId
        };
        sessionStorage.setItem("ClaimDetailsForInvoice", JSON.stringify(UserDetails));
        sessionStorage.setItem("ServiceRequestId", item.serviceRequestId);
        

        //sessionStorage.setItem("ClaimId", $scope.CommonObj.ClaimId);

        $location.url('ThirdPartyServiceRequestEdit');
    };

    $scope.GetClaimInsuranceDetails = GetClaimInsuranceDetails;
    function GetClaimInsuranceDetails(ClaimNumber) {

        var param = {
            "claimNumber": ClaimNumber
        }
        var GetInsurancDetails = ThirdPartyVendorDashboardService.GetInsuranceDetails(param);
        GetInsurancDetails.then(function (success) {
             
            $scope.GetInsurancDetails = success.data.data;
            sessionStorage.setItem("CompanyCRN", $scope.GetInsurancDetails.company.companyCrn);
        }, function (error) {
            $scope.ErrorMessage = error.data.errorMessage;
        });
    }

    $scope.GetPolicyHolderDetails = GetPolicyHolderDetails;
    function GetPolicyHolderDetails(ClaimNumber) {
        ////Get Policy Details
        var param = {
            "policyNumber": null,
            "claimNumber": ClaimNumber
        }

        var getPolicyHolderDetails = ThirdPartyVendorDashboardService.GetPolicyHolderDetails(param);
        getPolicyHolderDetails.then(function (success) {
           $scope.PolicyHolderDetails = success.data.data;
        }, function (error) {
            $scope.ErrorMessage = error.data.errorMessage;
        });
    }

    $scope.GetContentDetails = GetContentDetails;
    function GetContentDetails(item)
    {
        //get claim contents
        var param = {
            "claimNumber": item.claimNumber
        }
        var getContentDetails = ThirdPartyVendorDashboardService.GetContentDetails(param);
        getContentDetails.then(function (success) {
            $scope.ConentDetails = success.data.data;
            sessionStorage.setItem("ThirdPartyTaxRate", $scope.ConentDetails.policyDetails.taxRates);
            GoToServiceRequest(item);
        }, function (error) {
            $scope.ErrorMessage = error.data.errorMessage;
        });
    }
   
    $scope.GotoAssign = function (item) {
        sessionStorage.setItem("ServiceRequestId", item.serviceRequestId);
        $location.url('ThirdPartyAssignServiceRequest')
    };

    $scope.Rejectservicerequest = Rejectservicerequest;
    function Rejectservicerequest(ServiceRequest) {
        bootbox.confirm({
            title: $translate.instant("AlertMessage.Update"),
            closeButton: false,
            className: "modalcustom",
            message: $translate.instant("AlertMessage.ConfirmReject"),
            buttons: {
                confirm: {
                    label: $translate.instant("AlertMessage.YesBtn"),
                    className: 'btn-success'
                },
                cancel: {
                    label: $translate.instant("AlertMessage.NoBtn"),
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                if (result) {
                    var paramReject = {
                        "serviceId": ServiceRequest.serviceRequestId,
                        "status": {
                            "statusId": 3
                        }
                    };
                    var Rejectservice = ThirdPartyVendorDashboardService.RejectServiceRequest(paramReject);
                    Rejectservice.then(function (success) {
                        if (success.data.status === 200) {
                            bootbox.alert({
                                size: "",
                                title: $translate.instant("AlertMessage.Rejectservice"),
                                closeButton: false,
                                message: success.data.message,
                                className: "modalcustom",
                                callback: function () {
                                    var param = {
                                        "vendorId": sessionStorage.getItem("VendorId") 
                                    }
                                    var getServiceRequestList = ThirdPartyVendorDashboardService.getServiceRequest(param);
                                    getServiceRequestList.then(function (success) {
                                         
                                        $scope.ServiceRequestList = success.data.data;
                                    }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });
                                }
                            });
                        }
                    }, function (error) {
                        toastr.remove();
                        toastr.error(error.data.errorMessage, $translate.instant("ErrorHeading"));
                    });
                }
            }
        });
    }
});