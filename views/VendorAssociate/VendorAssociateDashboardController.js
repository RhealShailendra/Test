angular.module('MetronicApp').controller('VendorAssociateDashboardController', function ($rootScope, $scope, $filter, settings, $location, $translate, $translatePartialLoader,
    VendorAssociateDashboardService, AuthHeaderService) {
    //set language
    $translatePartialLoader.addPart('VendorAssociateDashboard');
    $translate.refresh();
    $scope.pagesize = $rootScope.settings.pagesize;
    $scope.Notifications = "";
    $scope.ErrorMessage = "";
    $scope.GlobalSearchText = "";
    $scope.EventList = [];
    $scope.AlertList = [];

    $scope.ClaimsTobeAssigned = [];
    $scope.ClaimsInWork = [];
    $scope.ClaimsWaitingForInsurancyCompany = [];
    $scope.ClaimsWaitingForPolicyHolder = [];
    $scope.CurrentClaimTab = 'OpenClaims';// → Show current active tab
    function init() 
    {
        $(".page-spinner-bar").removeClass("hide");
        sessionStorage.setItem("VendorAssociateClaimNo", "");
        sessionStorage.setItem("VendorAssociateClaimId", "");
        sessionStorage.setItem("VendorAssociatedGlobalSearchText", "");
        sessionStorage.setItem("VendorAssociatedGlobalSearchText", "");       
        GetClosedClaims();
        GetAlertList();
        GetUpcomingEvents();
        GetServiceRequestList();
        GetAssingedClaims();
    }
    init();
  
    //$scope.sortNewClaimKey = "lastUpdateDate";
    $scope.reverseNewClaim = true;
    $scope.sortNewClaim  = function (keyname) {
        $scope.sortNewClaimKey = keyname;
        $scope.reverseNewClaim = !$scope.reverseNewClaim;
    };

    $scope.ClosedsortKey = "lastUpdateDate";
    $scope.Closedsortreverse = true;
    $scope.Closedsort = function (keyname) {
        $scope.ClosedsortKey = keyname;  
        $scope.Closedsortreverse = !$scope.Closedsortreverse;
    };

    $scope.Globalsearch = Globalsearch;
    function Globalsearch() {
        if ($scope.GlobalSearchText !== "") {
            sessionStorage.setItem("VendorAssociateGlobalSearchText", $scope.GlobalSearchText);
            $location.url('GlobalSearchAssociate');
        }
    };

    $scope.GetAssingedClaims=GetAssingedClaims;
    function GetAssingedClaims(){
        var param = {
            "userId": sessionStorage.getItem("UserId")
        };
        var promisePost = VendorAssociateDashboardService.getClaimsAssigned(param);
        promisePost.then(function (success) {
            if (angular.isDefined(success.data.data) && success.data.data != null)
            {
                $scope.ClaimsTobeAssigned = success.data.data.vendorClaims;
                $scope.CustomObject = [];
                angular.forEach($scope.ClaimsTobeAssigned, function (NewClaims) {
                    angular.forEach(NewClaims.assignments, function (assignment, key) {
                        $scope.CustomObject.push({ "assignmentDetails": assignment, "ClaimDetails": NewClaims });
                    });
                });
            }
            $scope.CustomObject = $filter('orderBy')($scope.CustomObject, 'assignmentDetails.startDate');
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            $(".page-spinner-bar").addClass("hide");
            toastr.remove();
            toastr.error((angular.isDefined(error.data) && angular.isDefined(error.data.errorMessage) ? error.data.errorMessage : AuthHeaderService.genericErrorMessage()), "Error");
        });
    };

    $scope.GetClosedClaims=GetClosedClaims;
    function GetClosedClaims()
    {
        var param = {
            "claimStatus": "SETTLED",
            "userId": sessionStorage.getItem("UserId")
        };
        var promisePost = VendorAssociateDashboardService.getClaimsAssigned(param);
        promisePost.then(function (success) {
            $scope.ClosedClaims = success.data.data;
            angular.forEach($scope.ClosedClaims, function (NewClaims) {
                angular.forEach(NewClaims.assignments, function (assignment, key) {
                    $scope.CustomObject.push({ "assignmentDetails": assignment, "ClaimDetails": NewClaims });

                });

            });
        }, function (error) {
            $(".page-spinner-bar").addClass("hide");
            toastr.remove();
            toastr.error((angular.isDefined(error.data) && angular.isDefined(error.data.errorMessage) ? error.data.errorMessage : AuthHeaderService.genericErrorMessage()), "Error");
        });

    };

    $scope.GetAlertList=GetAlertList;
    function GetAlertList()
    {
        $(".page-spinner-bar").removeClass("hide");
        var param = {
            "id": sessionStorage.getItem("UserId").toString()           
        };
        var GetAlertList = VendorAssociateDashboardService.getAlertList(param);
        GetAlertList.then(function (success) {
            $scope.AlertList = success.data.data;
            var UnreadAlert = $filter('filter')($scope.AlertList, { isRead: false });
            $scope.AlertList = UnreadAlert;
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            $(".page-spinner-bar").addClass("hide");
            toastr.remove();
            toastr.error((angular.isDefined(error.data) && angular.isDefined(error.data.errorMessage) ? error.data.errorMessage : AuthHeaderService.genericErrorMessage()), "Error");
        });
    };   
        
    $scope.GetUpcomingEvents=GetUpcomingEvents;
    function GetUpcomingEvents()
    {
        var GetEventList = VendorAssociateDashboardService.getEventList();
        GetEventList.then(function (success) {
            $scope.EventList = success.data.data;            
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
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            $(".page-spinner-bar").addClass("hide");
            toastr.remove();
            toastr.error((angular.isDefined(error.data) && angular.isDefined(error.data.errorMessage) ? error.data.errorMessage : AuthHeaderService.genericErrorMessage()), "Error");
        });

    };

    //Go to claim details
    $scope.GoToClaimDetails = GoToClaimDetails;
    function GoToClaimDetails(claim) {
        if (claim.claimId != null && claim.claimNumber != null) {
            sessionStorage.setItem("VendorAssociateClaimNo", claim.claimNumber);
            sessionStorage.setItem("VendorAssociateClaimId", claim.claimId);
            sessionStorage.setItem("ShowNoteActive", "");
            sessionStorage.setItem("ShowEventActive", "");
            $location.url('VendorAssociateClaimDetails');
        }
    }

    //Goto Alert Details
    $scope.GoToAlertDetails = function (alert) {
        if (alert.notificationParams.claimId != null && alert.notificationParams.claimNumber != null) {
            $scope.ReadNotification(alert.id);
            sessionStorage.setItem("VendorAssociateClaimNo", alert.notificationParams.claimNumber);
            sessionStorage.setItem("VendorAssociateClaimId", alert.notificationParams.claimId);
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
            $location.url('VendorAssociateClaimDetails');
        }
    };

    //goto to Event Details
    $scope.GetEventDetails = GetEventDetails;
    function GetEventDetails(claim) {

        if (claim.id != null && claim.claimNumber != null) {
            sessionStorage.setItem("VendorAssociateClaimId", claim.id);
            sessionStorage.setItem("VendorAssociateClaimNo", claim.claimNumber);
            sessionStorage.setItem("ShowEventActive", true);
            sessionStorage.setItem("ShowNoteActive", false);
            $location.url('VendorAssociateClaimDetails')
        }
    };

    //Goto ClaimDetails
    $scope.GotToClaimDetailsScreen = GotToClaimDetailsScreen;
    function GotToClaimDetailsScreen(claim) {
         
        if (claim.ClaimDetails.claimId != null && claim.ClaimDetails.claimNumber != null && claim.assignmentDetails.assignmentNumber != null && claim.assignmentDetails.id != null) {
            sessionStorage.setItem("ThirdPartyClaimId", claim.ClaimDetails.claimId);
            sessionStorage.setItem("ThirdPartyClaimNo", claim.ClaimDetails.claimNumber);
            sessionStorage.setItem("AssignmentNumber", claim.assignmentDetails.assignmentNumber);
            sessionStorage.setItem("AssignmentId", claim.assignmentDetails.id);
            sessionStorage.setItem("ShowEventActive", "");
            sessionStorage.setItem("VendorAssociateClaimStatus", claim.ClaimDetails.status.status);
            sessionStorage.setItem("ShowNoteActive", "");
            $location.url('VendorAssociateClaimDetails')
        }
    };

    //Make Notification as read
    $scope.ReadNotification = ReadNotification;
    function ReadNotification(id) {

        //Get Alert List
        var paramId = {
            "id": id
        };
        var GetAlertList = VendorAssociateDashboardService.readNotification(paramId);
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
        sessionStorage.setItem("VendorAssociateClaimNo", "123")
        sessionStorage.setItem("VendorAssociateClaimId", "123")
        sessionStorage.setItem("AssociatePostLostItemId", "3")
        sessionStorage.setItem("Policyholder", "Test" + " " + "Test")
        $location.url('VendorAssociateItemDetails');
    };


    //This is dummy method have to delete used for demo 
    $scope.GoToClaimDetailsDummy = GoToClaimDetailsDummy;
    function GoToClaimDetailsDummy() {
        sessionStorage.setItem("VendorAssociateClaimNo", "123")
        sessionStorage.setItem("VendorAssociateClaimId", "123")
        //sessionStorage.setItem("ThirdPartyPostLostItemId", "3")
        sessionStorage.setItem("Policyholder", "Test" + " " + "Test")
        $location.url('VendorAssociateClaimDetails');
    };

    $scope.GetServiceRequestList = GetServiceRequestList;
    function GetServiceRequestList() {
        var param = {
            "vendorAssociateId": sessionStorage.getItem("UserId")
        }
        var getServiceRequest = VendorAssociateDashboardService.getServiceRequest(param);
        getServiceRequest.then(function (success) {
            $scope.ServiceRequestList = success.data.data;
        }, function (error) {
            toastr.remove();
            toastr.error(error.data.errorMessage, "Error");
            $scope.ErrorMessage = error.data.errorMessage;
        });
    };
    $scope.GoToServiceRequestEdit = function (item) {
        $scope.GetClaimInsuranceDetails(item.claimNumber);
        $scope.GetPolicyHolderDetails(item.claimNumber);
        $scope.GetContentDetails(item);

    };

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
        sessionStorage.setItem("serviceNumber", item.serviceNumber);
        //sessionStorage.setItem("ClaimId", $scope.CommonObj.ClaimId);
        $location.url('AssociateServiceRequestEdit');
    };

    $scope.GetClaimInsuranceDetails = GetClaimInsuranceDetails;
    function GetClaimInsuranceDetails(ClaimNumber) {
        var param = {
            "claimNumber": ClaimNumber
        }
        var GetInsurancDetails = VendorAssociateDashboardService.GetInsuranceDetails(param);
        GetInsurancDetails.then(function (success) {

            $scope.GetInsurancDetails = success.data.data;
            sessionStorage.setItem("CompanyCRN", $scope.GetInsurancDetails.company.companyCrn);
        }, function (error) {
            $scope.ErrorMessage = error.data.errorMessage;
        });
    };

    $scope.GetPolicyHolderDetails = GetPolicyHolderDetails;
    function GetPolicyHolderDetails(ClaimNumber) {
        ////Get Policy Details
        var param = {
            "policyNumber": null,
            "claimNumber": ClaimNumber
        };
        var getPolicyHolderDetails = VendorAssociateDashboardService.GetPolicyHolderDetails(param);
        getPolicyHolderDetails.then(function (success) {
            $scope.PolicyHolderDetails = success.data.data;

        }, function (error) {
            $scope.ErrorMessage = error.data.errorMessage;
        });
    };

    $scope.GetContentDetails = GetContentDetails;
    function GetContentDetails(item) {
        //get claim contents
        var param = {
            "claimNumber": item.claimNumber
        }
        var getContentDetails = VendorAssociateDashboardService.GetContentDetails(param);
        getContentDetails.then(function (success) {
            $scope.ConentDetails = success.data.data;
            sessionStorage.setItem("ThirdPartyTaxRate", $scope.ConentDetails.policyDetails.taxRates);
            GoToServiceRequest(item);
        }, function (error) {
            $scope.ErrorMessage = error.data.errorMessage;
        });
    };

    $scope.GotoAssign = function (item) {
        sessionStorage.setItem("ServiceRequestId", item.serviceRequestId);
        $location.url('AssociateServiceRequestEdit')
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
                    var Rejectservice = VendorAssociateDashboardService.RejectServiceRequest(paramReject);
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
                                        "vendorAssociateId": sessionStorage.getItem("UserId") //"claimId": $scope.CommonObj.ClaimId
                                    }

                                    var getServiceRequestList = VendorAssociateDashboardService.getServiceRequest(param);
                                    getServiceRequestList.then(function (success) { $scope.ServiceRequestList = success.data.data; }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });
                                }
                            });
                        }
                    }, function (error) {
                        $(".page-spinner-bar").addClass("hide");
                        toastr.remove();
                        toastr.error((angular.isDefined(error.data) && angular.isDefined(error.data.errorMessage) ? error.data.errorMessage : AuthHeaderService.genericErrorMessage()), "Error");
                    });
                }
            }
        });
    }
});