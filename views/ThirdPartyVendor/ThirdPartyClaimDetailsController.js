angular.module('MetronicApp').controller('ThirdPartyClaimDetailsController', function ($translate, $translatePartialLoader, $rootScope, $log, $scope,
    settings, $http, $timeout, $location, $uibModal, $filter, AuthHeaderService, ThirdPartyClaimDetailsService, ItemValueService) {

    $scope.items = $rootScope.items; $scope.boolValue = true;
    $translatePartialLoader.addPart('ThirdPartyClaimDetails');
    $translate.refresh();

    $scope.indextab = 0;
    $scope.pagesize = $rootScope.settings.itemPagesize;
    $scope.CurrentClaimDetailsTab = 'ContentList';
    $scope.currentAttchment = null;
    $scope.ClaimStatusInvoiceDetails = [];
    $scope.ClaimStatusContent = [];
    $scope.ClaimAttachments = [];
    $scope.ClaimParticipantsList = [];
    $scope.ParticipantId = null;
    $scope.ParticipantName = "";
    $scope.ErrorMessage = "";
    $scope.FiletrLostDamageList = [];
    $scope.OriginalPostLossItem = [];
    $scope.DdlSourceCategoryList = [];
    $scope.LostDamagedContentByCategory = [];
    $scope.SubCategory = [];
    $scope.PolicyHolderDetails = {};
    $scope.VendorsAgainstClaim = [];
    $scope.ClaimNotes = [];
    $scope.SelectedPostLostItems = [];
    $scope.EventList = [];
    $scope.PolicyDetails = [];
    $scope.ServiceRequestList = [];
    $scope.AssginmentDetails = [];
    $scope.PendingTaskList = [];
    $scope.displayClaimFileName = false;
    $scope.displayAddAttachmentbtn = false;
    $scope.displayAddImageButton = false;
    $scope.attachmentList = [];
    $scope.claimStatus = "";
    $scope.OrigionalTaxRate = null;
    $scope.displayEvent = true;
    $scope.displayNotes = false;
    $scope.displayParticipant = false;
    $scope.displayOrigionalItems = true;
    $scope.displayContentList = false;
    $scope.reverseIcon = true;
    $scope.displayClaimDetails = false;
    $rootScope.CreateInvoice = false;
    $scope.ContentTab = 'Contents';
    $scope.EventsTab = 'Event';
    $scope.editInsuranceCompany = false;
    $scope.editPolicyHolder = null;
    $scope.sortNotereverse = true;
    $scope.sortNote = 'createDate';
    $scope.ShowEvent = function () {
        $scope.displayEvent = true;
        $scope.displayNotes = false;
        $scope.displayAttachment = false;
        $scope.displayParticipant = false;
    }
    $scope.ShowNotes = function () {
        $scope.displayEvent = false;
        $scope.displayNotes = true;
        $scope.displayAttachment = false;
        $scope.displayParticipant = false;
    }
    $scope.ShowParticipant = function () {
        $scope.displayEvent = false;
        $scope.displayNotes = false;
        $scope.displayAttachment = false;
        $scope.displayParticipant = true;
    }
    $scope.ShowAttachments = function () {
        $scope.displayEvent = false;
        $scope.displayNotes = false;
        $scope.displayParticipant = false;
        $scope.displayAttachment = true;
    }

    $scope.showOriginalItems = function () {
        $scope.displayOrigionalItems = true;
        $scope.displayContentList = false;
    }
    $scope.showContentList = function () {
        $scope.displayOrigionalItems = false;
        $scope.displayContentList = true;
    }
    $scope.showDetails = function () {
        $scope.displayClaimDetails = !$scope.displayClaimDetails;

        $scope.reverseIcon = !$scope.reverseIcon;
    }

    $scope.sortpostlostitem = function (keyname) {
        $scope.sortKey = keyname;
        $scope.reverse = !$scope.reverse;
    }

    $scope.sortServiceRequest = function (keyname) {
        $scope.sortServiceRequestKey = keyname;
        $scope.sortServiceRequestreverse = !$scope.sortServiceRequestreverse;
    }

    $scope.sortVendor = function (keyname) {
        $scope.sortVendorKey = keyname;
        $scope.reverseVendor = !$scope.reverseVendor;
    }

    $scope.sortClaimDetails = function (keyname) {
        $scope.sortClaimDetailsKey = keyname;
        $scope.reverseClaimDetails = !$scope.reverseClaimDetails;
    }

    function init() {
        $scope.CommonObj = {
            ClaimProfile: sessionStorage.getItem("claimProfile"),
            ClaimNumber: sessionStorage.getItem("ThirdPartyClaimNo"),
            ClaimId: sessionStorage.getItem("ThirdPartyClaimId"),
            AssignmentNumber: sessionStorage.getItem("AssignmentNumber"),
            AssignmentId: sessionStorage.getItem("AssignmentId"),
            UserId: sessionStorage.getItem("UserId"),
            claimNote: "",
            eventNote: "",
            Categories: "ALL",
            Attachment: '',
            EventTitle: "",
            ItemDescription: "",
            OrigionalItemDescription: "",
            EventDate: $filter('date')(new Date(), "dd/MM/yyyy"),
            EventActive: sessionStorage.getItem("ShowEventActive"),
            NoteActive: sessionStorage.getItem("ShowNoteActive"),
            PurchaseClaimNumber: sessionStorage.getItem("ThirdPartyClaimNo"),
            PurchaseClaimId: sessionStorage.getItem("ThirdPartyClaimId"),
            PurchaseItemId: null,
            PurchaseItemNumber: null,
            ThisPage: "ClaimDetails"
        };
        $scope.CreateEventObject = {
            "EventDate": null,
            "EventTitle": null,
            "StartTime": null,
            "Endtime": null,
            "EventNote": null
        };
        sessionStorage.setItem("ClaimNoForInvice", "");
        if ($scope.CommonObj.ClaimId != null || $scope.CommonObj.ClaimNumber != null) {
            sessionStorage.setItem("SelectedItemList", $scope.SelectedPostLostItems);
            sessionStorage.setItem("ClaimNo", sessionStorage.getItem("ThirdPartyClaimNo"));
            $scope.claimStatus = sessionStorage.getItem("ThirdPartyClaimStatus");
            $scope.ClaimStatusList = [];
            $scope.ParticipantsTypeList = [];
            $(".page-spinner-bar").removeClass("hide");
            GetPostLostItems();
            GetParticipantsList();//Get participants for Events/Notes
            GetClaimStatusList();
            GetParticipantTypeList();
            GetNotes();
            GetServiceRequestList();
            GetStatusInvoiceDetails();
            GetCategory();
            GetClaimInsuranceDetails();
            GetEventList();
            GetAssignMentDetails();           
            //By default showing notes or events tab opened if redirected from alert tab to this page
            if ($scope.CommonObj.EventActive !== "" || $scope.CommonObj.NoteActive !== "") {
                if ($scope.CommonObj.EventActive === "true" && $scope.CommonObj.NoteActive === "false") {
                    $scope.EventsTab = 'Event';
                    $scope.tab = 'Contents';
                }
                else if ($scope.CommonObj.EventActive === "false" && $scope.CommonObj.NoteActive === "true") {
                    $scope.EventsTab = 'Notes';
                    GetNotes();
                    $scope.tab = 'Contents';
                }
            }
            else {
                $scope.EventsTab = 'Event';
                $scope.tab = 'Contents';
            }
        }
        else {
            $location.url('ThirdPartyVendorDashboard'); //if session data is lost then redirect to previous page
        }
    }

    init();
    $scope.ShowInvoicesTab = ShowInvoicesTab;
    function ShowInvoicesTab() {
        $scope.ContentTab = 'Invoices';
        $scope.GetInvoicesAgainstAssignment();
    };

    $scope.ShowPurchaseOrdersTab = ShowPurchaseOrdersTab;
    function ShowPurchaseOrdersTab() {
        $scope.ContentTab = 'PurchaseOrders';
        sessionStorage.setItem("isLineItem", false);
    };

    $scope.ShowAttachmentsTab = ShowAttachmentsTab;
    function ShowAttachmentsTab() {
        $scope.EventsTab = 'Attachments';
        $scope.GetClaimAttachment();
    };

    $scope.ShowParticipantsTab = ShowParticipantsTab;
    function ShowParticipantsTab() {
        $scope.EventsTab = 'Participant';
    };

    $scope.AssginmentInvoices = [];
    $scope.GetInvoicesAgainstAssignment = GetInvoicesAgainstAssignment;
    function GetInvoicesAgainstAssignment() {
        $(".page-spinner-bar").removeClass("hide");
        var param =
           {
               "assignmentNumber": $scope.CommonObj.AssignmentNumber
           };
        var GetAssingmentInvoices = ThirdPartyClaimDetailsService.GetAssignmentInvoices(param);
        GetAssingmentInvoices.then(function (success) {
            $scope.AssginmentInvoices = success.data.data;
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

    $scope.GetAssignMentDetails = GetAssignMentDetails;
    function GetAssignMentDetails() {
        $(".page-spinner-bar").removeClass("hide");
        var param ={
               "assignmentNumber": $scope.CommonObj.AssignmentNumber
           };
        var GetAssingmentDetails = ThirdPartyClaimDetailsService.GetVendorassignmentDetails(param);
        GetAssingmentDetails.then(function (success) {
            $scope.AssginmentDetails = success.data.data;
            $scope.newTaxRate = $scope.AssginmentDetails.taxRate;
            $scope.AssginmentDetails.totalPolicyCoverage = $scope.AssginmentDetails.totalPolicyCoverage == null ? 0 : $scope.AssginmentDetails.totalPolicyCoverage;
            $scope.AssginmentDetails.totalAcv = $scope.AssginmentDetails.totalAcv == null ? 0 : $scope.AssginmentDetails.totalAcv;
            $scope.AssginmentDetails.totalRcv = $scope.AssginmentDetails.totalRcv == null ? 0 : $scope.AssginmentDetails.totalRcv;
            $scope.AssginmentDetails.ideminitySaving = $scope.AssginmentDetails.ideminitySaving == null ? 0 : $scope.AssginmentDetails.ideminitySaving;
        }, function (error) {
            $(".page-spinner-bar").addClass("hide");
            toastr.remove();
            toastr.error((angular.isDefined(error.data) && angular.isDefined(error.data.errorMessage) ? error.data.errorMessage : AuthHeaderService.genericErrorMessage()), "Error")
        });
    };

    $scope.SetCurrentStageID = function () {
        $scope.ClaimStatusList = $filter('orderBy')($scope.ClaimStatusList, 'stageNumber');
        angular.forEach($scope.ClaimStatusList, function (item) {
            if (angular.isDefined($scope.ClaimStatusContent.claimStatus)) {
                if ($scope.ClaimStatusContent.claimStatus.id == item.id) {
                    $scope.CurrentStageNumber = item.stageNumber;
                    $scope.ClaimStatusContent.claimStatus.status = item.status;
                }
            }
        });
    };

    $scope.GetNotes = GetNotes;
    function GetNotes() {
        $(".page-spinner-bar").removeClass("hide");
        var param = { "claimId": $scope.CommonObj.ClaimId.toString() }
        var getpromise = ThirdPartyClaimDetailsService.getClaimNotes(param);
        getpromise.then(function (success) {
            $scope.ClaimNotes = [];
            $scope.ClaimNotes = $filter('orderBy')(success.data.data, 'createDate', true);
            angular.forEach($scope.ClaimNotes, function (note) {
                note.ParticipantList = "";
                angular.forEach(note.participants, function (participant, key) {
                    note.ParticipantList += participant.name ? participant.name : '';
                    if (key != note.participants.length - 1) {
                        note.ParticipantList += ' , ';
                    }
                });
            });
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            $(".page-spinner-bar").addClass("hide");
            toastr.remove();
            toastr.error((angular.isDefined(error.data) && angular.isDefined(error.data.errorMessage) ? error.data.errorMessage : AuthHeaderService.genericErrorMessage()), "Error")
        });
    }

    $scope.GetStatusInvoiceDetails = GetStatusInvoiceDetails;
    function GetStatusInvoiceDetails() {
        $(".page-spinner-bar").removeClass("hide");
        var param = { "id": $scope.CommonObj.ClaimId };
        var getpromise = ThirdPartyClaimDetailsService.getClaimsStatusInvoiceDetails(param);
        getpromise.then(function (success) {
            $scope.ClaimStatusInvoiceDetails = success.data.data;
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            $(".page-spinner-bar").addClass("hide");
            toastr.remove();
            toastr.error((angular.isDefined(error.data) && angular.isDefined(error.data.errorMessage) ? error.data.errorMessage : AuthHeaderService.genericErrorMessage()), "Error")
        });
    };

    $scope.GetClaimStatusList = GetClaimStatusList;
    function GetClaimStatusList() {
        $(".page-spinner-bar").removeClass("hide");
        var claimStatusList = ThirdPartyClaimDetailsService.GetClaimStatusList();
        claimStatusList.then(function (success) {
            $scope.ClaimStatusList = success.data.data; $scope.SetCurrentStageID();
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            $(".page-spinner-bar").addClass("hide");
            toastr.remove();
            toastr.error((angular.isDefined(error.data) && angular.isDefined(error.data.errorMessage) ? error.data.errorMessage : AuthHeaderService.genericErrorMessage()), "Error")
        });

    };

    $scope.GetParticipantsList = GetParticipantsList;
    function GetParticipantsList() {
        $(".page-spinner-bar").removeClass("hide");
        var param = { "claimNumber": $scope.CommonObj.ClaimNumber }
        var getpromise = ThirdPartyClaimDetailsService.getVendorsListAgainstClaim(param);
        getpromise.then(function (success) {
            $scope.ClaimParticipantsList = success.data.data;
            $(".page-spinner-bar").addClass("hide");
        },
            function (error) {
                $(".page-spinner-bar").addClass("hide");
                toastr.remove();
                toastr.error((angular.isDefined(error.data) && angular.isDefined(error.data.errorMessage) ? error.data.errorMessage : AuthHeaderService.genericErrorMessage()), "Error")
            });
    };

    $scope.GetParticipantTypeList = GetParticipantTypeList;
    function GetParticipantTypeList() {
        $(".page-spinner-bar").removeClass("hide");
        var getpromise = ThirdPartyClaimDetailsService.getParticipantType();
        getpromise.then(function (success) {
            $scope.ParticipantsTypeList = success.data.data;
            $(".page-spinner-bar").addClass("hide");
        },
            function (error) {
                $(".page-spinner-bar").addClass("hide");
                toastr.remove();
                toastr.error((angular.isDefined(error.data) && angular.isDefined(error.data.errorMessage) ? error.data.errorMessage : AuthHeaderService.genericErrorMessage()), "Error")
            });
    };

    $scope.GetClaimAttachment = GetClaimAttachment
    function GetClaimAttachment() {
        $(".page-spinner-bar").removeClass("hide");
        var param = { "claimNumber": $scope.CommonObj.ClaimNumber.toString() }
        var getpromise = ThirdPartyClaimDetailsService.getClaimAttachments(param);
        getpromise.then(function (success) {
            $scope.ClaimAttachments = [];
            $scope.ClaimAttachments = success.data.data;
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            $(".page-spinner-bar").addClass("hide");
            toastr.remove();
            toastr.error((angular.isDefined(error.data) && angular.isDefined(error.data.errorMessage) ? error.data.errorMessage : AuthHeaderService.genericErrorMessage()), "Error")
        });

    };

    $scope.GetPostLostItems = GetPostLostItems;
    function GetPostLostItems() {
        $(".page-spinner-bar").removeClass("hide");
        var param = {
            "claimNumber": $scope.CommonObj.ClaimNumber.toString(),
            "assignmentNumber": $scope.CommonObj.AssignmentNumber,
            "pageNumber": 1
        };
        var getpromise = ThirdPartyClaimDetailsService.getPostLostItemsForVendor(param);
        getpromise.then(function (success) {
            $scope.FiletrLostDamageList = [];
            if (success.data.data == null) {
                /* CTB-969 cheyenne reported issue→As a vendor contact when I assign all line items within a claim I should not be brought back to an empty claim contents page,
                I should be brought directly back to my dashboard. */
                $location.url(sessionStorage.getItem('HomeScreen'));
            } else {
                $scope.FiletrLostDamageList = success.data.data.itemReplacement;
                $scope.FilteredItemByAssignment = [];
                var TempList = [];
                angular.forEach($scope.FiletrLostDamageList, function (item) {
                    if (item.claimItem.isActive) {
                        TempList.push(item)
                    }
                });
                $scope.FiletrLostDamageList = angular.copy(TempList);
            }
            
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            $(".page-spinner-bar").addClass("hide");
            toastr.remove();
            toastr.error((angular.isDefined(error.data) && angular.isDefined(error.data.errorMessage) ? error.data.errorMessage : AuthHeaderService.genericErrorMessage()), "Error")
        });
    };

    $scope.GetServiceRequestList = GetServiceRequestList;
    function GetServiceRequestList() {
        $(".page-spinner-bar").removeClass("hide");
        var paramServoceRequest = {
            "vendorId": sessionStorage.getItem("VendorId"), "claimId": $scope.CommonObj.ClaimId
        }
        var getServiceRequestList = ThirdPartyClaimDetailsService.getServiceRequestedList(paramServoceRequest);
        getServiceRequestList.then(function (success) {
            $scope.ServiceRequestList = success.data.data;
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            $(".page-spinner-bar").addClass("hide");
            toastr.remove();
            toastr.error((angular.isDefined(error.data) && angular.isDefined(error.data.errorMessage) ? error.data.errorMessage : AuthHeaderService.genericErrorMessage()), "Error")
        });

    }

    $scope.GetEventList = GetEventList;
    function GetEventList() {
        $(".page-spinner-bar").removeClass("hide");
        var paramClaimId = { "id": $scope.CommonObj.ClaimId }
        var EventListPromise = ThirdPartyClaimDetailsService.GetEventList(paramClaimId);
        EventListPromise.then(function (success) {
            // $scope.EventList = $filter('filter')(success.data.data, { claim: {id: $scope.CommonObj.ClaimId}});
            $scope.EventList = success.data.data;
            //Getting participant list as string 
            angular.forEach($scope.EventList, function (event) {
                event.particiapntsTstring = '';
                angular.forEach(event.participants, function (participant, key) {
                    participant.firstName = ((participant.firstName == null) ? participant.firstName = "" : participant.firstName);
                    participant.lastName = ((participant.lastName == null) ? participant.lastName = "" : participant.lastName);
                    event.particiapntsTstring += participant.firstName + " " + participant.lastName
                    if (key != event.participants.length - 1) {
                        event.particiapntsTstring += ' , ';
                    }
                });
            });
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            $(".page-spinner-bar").addClass("hide");
            toastr.remove();
            toastr.error((angular.isDefined(error.data) && angular.isDefined(error.data.errorMessage) ? error.data.errorMessage : AuthHeaderService.genericErrorMessage()), "Error")
        });
    };

    $scope.getClaimParticipant = getClaimParticipant;
    function getClaimParticipant() {
        $(".page-spinner-bar").removeClass("hide");
        // get active vendors against claim with all details for binding to grid        
        var param = { "claimNumber": $scope.CommonObj.ClaimNumber }
        var getpromise = ThirdPartyClaimDetailsService.getVendorsAgainstClaimDetails(param);
        getpromise.then(function (success) {
            $scope.VendorsAgainstClaim = success.data.data;
            angular.forEach($scope.VendorsAgainstClaim, function (vendor) {
                vendor.RoleString = '';
                angular.forEach(vendor.roles, function (role, key) {
                    vendor.RoleString += role.roleName ? role.roleName : '';
                    if (key != vendor.roles.length - 1) {
                        vendor.RoleString += ' , ';
                    }
                });
            });
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            $(".page-spinner-bar").addClass("hide");
            toastr.remove();
            toastr.error((angular.isDefined(error.data) && angular.isDefined(error.data.errorMessage) ? error.data.errorMessage : AuthHeaderService.genericErrorMessage()), "Error")
        });
    };

    //get Insurance details for vendor
    $scope.GetClaimInsuranceDetails = GetClaimInsuranceDetails;
    function GetClaimInsuranceDetails() {
        $(".page-spinner-bar").removeClass("hide");
        GetStateList();
        var param = {
            "claimNumber": $scope.CommonObj.ClaimNumber
        }
        var GetInsurancDetails = ThirdPartyClaimDetailsService.GetInsuranceDetails(param);
        GetInsurancDetails.then(function (success) {
            $scope.GetInsurancDetails = success.data.data;
            sessionStorage.setItem("CompanyCRN", $scope.GetInsurancDetails.company.companyCrn);
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            $(".page-spinner-bar").addClass("hide");
            toastr.remove();
            toastr.error((angular.isDefined(error.data) && angular.isDefined(error.data.errorMessage) ? error.data.errorMessage : AuthHeaderService.genericErrorMessage()), "Error")

        });
    };

    function returnDateForEvent(dt, time) {
        //EventDate
        var eventdate = new Date(dt);
        eventdate = new Date(eventdate.toISOString());
        var date = eventdate.getDate();
        var month = eventdate.getMonth();
        var year = eventdate.getFullYear();
        time = new Date(time);
        time.setDate(date);
        time.setMonth(month);
        time.setYear(year);
        time = time.toISOString().split('.')[0];
        time = time + 'Z';
        return time;
    }

    //Showing claim attachment details 
    $scope.ClaimAttachmentDetails = function (attachment) {
        $scope.animationsEnabled = true;
        var vm = this;
        var out = $uibModal.open(
            {
                animation: $scope.animationsEnabled,
                size: "md",
                templateUrl: "views/ThirdPartyVendor/ShowClaimAttachmentDetails.html",
                controller: "ShowClaimAttachmentController",
                resolve:
                {
                    /**
                     * @return {?}
                     */

                    items: function () {

                        return attachment
                    }
                }

            });
        out.result.then(function (value) {

            //Call Back Function success
        }, function () {

        });
        return {
            open: open
        };
    }

    //Showing notes attachment details 
    $scope.NotesAttachmentDetails = function (attachment) {
        $scope.animationsEnabled = true;
        var vm = this;
        var out = $uibModal.open(
            {
                animation: $scope.animationsEnabled,
                size: "md",
                templateUrl: "views/ThirdPartyVendor/ShowNoteAttachmentDetails.html",
                controller: "ShowNotesAttachmentController",

                resolve:
                {
                    /**
                     * @return {?}
                     */

                    items: function () {

                        return attachment;
                    }
                }

            });
        out.result.then(function (value) {

            //Call Back Function success
        }, function () {

        });
        return {
            open: open
        };
    }

    //Get post lost items by category
    $scope.GetItemsByCategory = function (e) {
        if (e == "ALL") {
            $scope.searchDamagedContent.claimItem.category.name = "";
        }
    };

    //Delete Items Form Damage Lost
    $scope.FiletrLostDamageList;
    $scope.DeleteListLostDamageItem = [];
    $scope.DeleteAllItems = function () {
        $scope.DeleteListLostDamageItem = [];
        if ($scope.DeleteAll) {
            angular.forEach($scope.FiletrLostDamageList, function (item) {
                $scope.DeleteListLostDamageItem.push(item.itemId)
            });
        }
    }

    $scope.exists = function (item, list) {
        return list.indexOf(item) > -1;
    };

    $scope.AddToDeleteList = function (item) {
        var idx = $scope.DeleteListLostDamageItem.indexOf(item);
        if (idx > -1) {
            $scope.DeleteAll = false;
            $scope.DeleteListLostDamageItem.splice(idx, 1);
        }
        else {
            $scope.DeleteListLostDamageItem.push(item);
        }
    };

    $scope.ModalAssignAdjustor = function () {
        $scope.animationsEnabled = true;
        $scope.items = "Testing Pas Value";
        var vm = this;
        var out = $uibModal.open(
            {
                animation: $scope.animationsEnabled,
                templateUrl: "views/ThirdPartyVendor/AdjusterList.html",
                controller: "AdjustorListController",

                resolve:
                {
                    /**
                     * @return {?}
                     */

                    items: function () {
                        return "Testing Pas Value";
                    }
                }

            });
        out.result.then(function (value) {

            //Call Back Function success
        }, function () {

        });
        return {
            open: open
        };
    };

    $scope.AssignPostLostItem = function () {
        sessionStorage.setItem("FiletrLostDamageListLength", $scope.FiletrLostDamageList.length);
        sessionStorage.setItem("ThirdPartySelectedItemList", $scope.SelectedPostLostItems);
        $location.url('ThirdPartyAssignPostLoss');
    };

    $scope.UploadPostLossItem = function () {
        if ($scope.CommonObj.ClaimNumber !== null && angular.isDefined($scope.CommonObj.ClaimNumber)) {
            sessionStorage.setItem("UploadClaimNo", $scope.CommonObj.ClaimNumber);
            $location.url('UploadItemsFromCSV')
        }
    };

    $scope.OpenAddNewVendorModel = function (e) {
        $scope.animationsEnabled = true;
        var ClaimObj = [];
        ClaimObj.push({
            ClaimId: sessionStorage.getItem("ThirdPartyClaimId"),
            ClaimNumber: sessionStorage.getItem("ThirdPartyClaimNo"),
            Participants: $scope.ParticipantsTypeList
        });
        var out = $uibModal.open(
            {
                animation: $scope.animationsEnabled,
                size: "lg",
                templateUrl: "views/ThirdPartyVendor/AddNewVendor.html",
                controller: "AddNewVendorController",
                backdrop: 'static',
                keyboard: false,
                resolve:
                {
                    ClaimObj: function () {
                        return ClaimObj;
                    }
                }

            });
        out.result.then(function (value) {
            $scope.GetParticipantsList();
        }, function () {

        });
        return {
            open: open
        };
    };

    $scope.openValueModel = function openValueModel() {

        $scope.animationsEnabled = true;
        $scope.items = "Testing Pas Value";
        var vm = this;
        var out = $uibModal.open(
            {
                animation: $scope.animationsEnabled,
                templateUrl: "views/ThirdPartyVendor/ItemValue.html",
                controller: "ItemValueController",

                resolve:
                {
                    /**
                     * @return {?}
                     */

                    items: function () {
                        $rootScope.items = "Root";
                        return "Testing Pas Value";
                    }
                }

            });
        out.result.then(function (value) {

            //Call Back Function success
        }, function () {

        });
        return {
            open: open
        };
    };

    $scope.GoToServiceRequestEdit = function (item) {
        var AdjName = "";
        if (angular.isDefined($scope.GetInsurancDetails)) {
            if ($scope.GetInsurancDetails.adjusterDetails) {

                AdjName = (($scope.GetInsurancDetails.adjusterDetails.firstName) ? $scope.GetInsurancDetails.adjusterDetails.firstName : "")
                     + " " + (($scope.GetInsurancDetails.adjusterDetails.lastName) ? $scope.GetInsurancDetails.adjusterDetails.lastName : "")
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
            "ClaimNoForInvice": $scope.CommonObj.ClaimNumber,
            "AdjusterName": AdjName,
            "InsuredName": PolicyHolder,
            "taxRate": $scope.ConentDetails.policyDetails.taxRates
        };
        sessionStorage.setItem("ClaimDetailsForInvoice", JSON.stringify(UserDetails));
        sessionStorage.setItem("ServiceRequestId", item.serviceRequestId);
        sessionStorage.setItem("ClaimId", $scope.CommonObj.ClaimId);

        $location.url('ThirdPartyServiceRequestEdit');
    }

    $scope.GotoItemStteled = function () {
        $location.url('ItemsSetteled');
    };

    $scope.GotoItemToBeStteled = function () {
        $location.url('ItemsToBeSetteled');
    };

    $scope.HoldoverDetails = function () {
        $location.url('ItemsHoldover');
    };

    $scope.GotoVendorInvoices = function () {
        $location.url('VendorInvoices');
    };

    $scope.GoToDetails = function (item) {
        sessionStorage.setItem("ThirdPartyPostLostItemId", item.claimItem.id)
        sessionStorage.setItem("Policyholder", "" + " " + "")
        $location.url('ThirdPartyLineItemDetails');
    };

    $scope.CreateQuote = function () {
        sessionStorage.setItem("ClaimNumber", $scope.CommonObj.ClaimNumber);
        sessionStorage.setItem("ClaimId", $scope.CommonObj.ClaimId);
        sessionStorage.setItem("ItemNumber", $scope.FiletrLostDamageList[0].claimItem.itemNumber)
        sessionStorage.setItem("ItemId", $scope.FiletrLostDamageList[0].claimItem.id)
        sessionStorage.setItem("Items", JSON.stringify($scope.SelectedPostLostItems))
        sessionStorage.setItem("AssignmentNumber", $scope.CommonObj.AssignmentNumber)
        sessionStorage.setItem("AssignmentId", $scope.CommonObj.AssignmentId)
        sessionStorage.setItem("BackPage", "ThirdPartyClaimDetails");
        sessionStorage.setItem("ClaimDetailsPage", "ThirdPartyClaimDetails");
        sessionStorage.setItem("LineDetailsPage", "ThirdPartyLineItemDetails");
        $location.url('ViewQuote');
    };

    $scope.back = function () {
        sessionStorage.setItem("ThirdPartyClaimNo", "");
        sessionStorage.setItem("ThirdPartyClaimId", "");
        sessionStorage.setItem("SelectedItemList", "");
        sessionStorage.setItem("ShowEventActive", ""),
       sessionStorage.setItem("ShowNoteActive", "")
        //$window.history.back();
        $location.url(sessionStorage.getItem('HomeScreen'));
    };

    $scope.ItemsToBeSetteled = function () {
        $location.url('ItemsToBeSetteled');
    };

    $scope.participantsForEvent = [];
    //select particiapnt
    $scope.afterSelectedParticipant = function (selected) {
        if (selected) {
            $scope.participantsForEvent.push({
                "ParticipantId": selected.originalObject.id,
                "ParticipantName": selected.originalObject.firstName + " " + selected.originalObject.lastName
            });
        }
    };

    $scope.ParticipantName = "";    //select particiapnt
    $scope.GetNoteParticipant = function (selected) {
        if (selected) {
            $scope.ParticipantName = selected.originalObject.firstName + " " + selected.originalObject.lastName
        }
    };

    $scope.NotesAttachmentDetails = function (note) {
        $scope.animationsEnabled = true;
        var vm = this;
        var out = $uibModal.open(
            {
                animation: $scope.animationsEnabled,
                size: "md",
                templateUrl: "views/ThirdPartyVendor/ShowNoteAttachmentDetails.html",
                controller: "ShowNotesAttachmentController",

                resolve:
                {
                    items: function () {

                        return note;
                    }
                }

            });
        out.result.then(function (value) {

            //Call Back Function success
        }, function () {

        });
        return {
            open: open
        };
    }
    // search function to match full text 
    $scope.localSearch = function (str) {
        var matches = [];
        $scope.ClaimParticipantsList.forEach(function (person) {
            var fullName = person.firstName + ' ' + person.lastName;
            if ((person.firstName.toLowerCase().indexOf(str.toString().toLowerCase()) >= 0) ||
                (person.lastName.toLowerCase().indexOf(str.toString().toLowerCase()) >= 0) ||
                (fullName.toLowerCase().indexOf(str.toString().toLowerCase()) >= 0)) {
                matches.push(person);
            }
        });
        return matches;
    };

    // Variables for file upload
    $scope.fileName = '';
    $scope.FileExtension = '';
    $scope.FileType = '';
    $scope.files = [];
    $scope.ClaimfileName = '';
    $scope.ClaimFileExtension = '';
    $scope.ClaimFileType = '';
    $scope.Claimfiles = [];

    //for note attachment
    $scope.SelectNoteFile = function () {
        angular.element('#NoteFileUpload').trigger('click');
    };

    //for claim attachment
    $scope.SelectClaimFile = function () {
        angular.element('#ClaimFileUpload').trigger('click');
    };

    //Get note attachment details
    $scope.getNoteFileDetails = function (e) {
        $scope.$apply(function () {
            $scope.fileName = e.files[0].name;
            $scope.FileType = e.files[0].type
            $scope.FileExtension = $scope.fileName.substr($scope.fileName.lastIndexOf('.'))
            $scope.files.push(e.files[0]);
            fr = new FileReader();
            //fr.onload = receivedText;
            fr.readAsDataURL(e.files[0]);
        });

    };

    //Add note with attachment against claim
    $scope.NoteParticipantName = "";
    $scope.AddNote = function (e) {
        var data = new FormData();
        data.append("mediaFilesDetail", JSON.stringify([{ "fileName": $scope.fileName, "fileType": $scope.FileType, "extension": $scope.FileExtension, "filePurpose": "NOTE", "latitude": null, "longitude": null }]))
        data.append("noteDetail", JSON.stringify({ "claimId": $scope.CommonObj.ClaimId.toString(), "senderName": $scope.ParticipantName, "addedBy": sessionStorage.getItem("Name"), "addedById": sessionStorage.getItem("UserId"), "message": $scope.CommonObj.claimNote }))
        data.append("file", $scope.files[0]);

        var getpromise = ThirdPartyClaimDetailsService.addClaimNoteWithOptionalAttachment(data);
        getpromise.then(function (success) {
            $scope.Status = success.data.status;
            if ($scope.Status == 200) {

                toastr.remove();
                toastr.success(success.data.message, $translate.instant("SuccessHeading"));

                $scope.CommonObj.claimNote = "";
                angular.element("input[type='file']").val(null);
                $scope.fileName = '';
                $scope.FileType = '';
                $scope.FileExtension = '';
                //after adding new note updating note list
                GetNotes();
            }
        }, function (error) {
            toastr.remove();
            toastr.error(error.data.errorMessage, $translate.instant("ErrorHeading"));
            $scope.ErrorMessage = error.data.errorMessage;
        });
    };

    //get claim attachment details
    $scope.getClaimFileDetails = function (e) {
        $scope.displayAddImageButton = true;
        var files = event.target.files;
        $scope.$apply(function () {
            $scope.ClaimfileName = e.files[0].name;
            $scope.ClaimFileType = e.files[0].type
            $scope.ClaimFileExtension = $scope.ClaimfileName.substr($scope.ClaimfileName.lastIndexOf('.'))
            $scope.Claimfiles.push(e.files[0]);
            var file = files[0];
            fr = new FileReader();
            fr.file = file;
            fr.fileName = files[0].name;
            fr.fileType = files[0].type;
            fr.fileExtension = files[0].name.substr(files[0].name.lastIndexOf('.'));
            fr.onload = $scope.LoadFileInList;
            fr.readAsDataURL(e.files[0]);
        });
        //if ($scope.Claimfiles.length > 0)
        //    $scope.AddClaimAttachment();
    };

    $scope.getAttachmentDetails = function (e) {
        $scope.displayAddImageButton = true;
        $scope.$apply(function () {
            var files = event.target.files;
            $scope.filed = event.target.files;
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var reader = new FileReader();
                reader.file = file;
                reader.fileName = files[i].name;
                reader.fileType = files[i].type;
                reader.fileExtension = files[i].name.substr(files[i].name.lastIndexOf('.'));
                reader.onload = $scope.LoadFileInList;
                reader.readAsDataURL(file);
            }
        });
        // $scope.saveAttachment();
    };

    $scope.LoadFileInList = function (e) {
        $scope.$apply(function () {
            $scope.attachmentList.push(
                {
                    "FileName": e.target.fileName, "FileExtension": e.target.fileExtension, "FileType": e.target.fileType,
                    "Image": e.target.result, "File": e.target.file
                })
        });
    };

    //cancel claim attachment
    $scope.cancelAttachment = cancelAttachment;
    function cancelAttachment() {
        $scope.displayAddImageButton = false;
        $scope.attachmentList = [];
        angular.element("input[type='file']").val(null);
    };

    $scope.RemoveAttachment = RemoveAttachment;
    function RemoveAttachment(index) {
        if ($scope.attachmentList.length > 0) {
            $scope.attachmentList.splice(index, 1);
        }
    };

    //Add claim attachment
    $scope.AddClaimAttachment = function () {
        $(".page-spinner-bar").removeClass("hide");
        var data = new FormData();
        data.append("claimDetail", JSON.stringify({ "claimNumber": $scope.CommonObj.ClaimNumber.toString() }))

        angular.forEach($scope.attachmentList, function (ItemFile) {
            data.append('filesDetails', JSON.stringify([{
                "fileName": ItemFile.FileName, "fileType": ItemFile.FileType, "extension": ItemFile.FileExtension, "filePurpose": "CLAIM", "latitude": null, "longitude": null, "footNote": null
            }]));
            data.append('file', ItemFile.File);
        });
        if ($scope.attachmentList.length == 0 || $scope.attachmentList == null) {
            data.append('filesDetails', null);
            data.append('file', null);
        };
        var getpromise = ThirdPartyClaimDetailsService.addClaimAttachment(data);
        getpromise.then(function (success) {
            $scope.Status = success.data.status;
            if ($scope.Status == 200) {
                toastr.remove();
                toastr.success(success.data.message, $translate.instant("SuccessHeading"));
                $scope.CommonObj.claimNote = "";
                $scope.ClaimfileName = '';
                $scope.attachmentList = [];
                angular.element("input[type='file']").val(null);
                $scope.cancelAttachment();
                GetClaimAttachment();//refresh claim attachment list
            }
            $(".page-spinner-bar").addClass("hide");

        }, function (error) {
            $(".page-spinner-bar").addClass("hide");
            toastr.remove();
            toastr.error((angular.isDefined(error.data) && angular.isDefined(error.data.errorMessage) ? error.data.errorMessage : AuthHeaderService.genericErrorMessage()), "Error")
        });
    };

    //clear  attachments
    $scope.ClearAttachments = function () {
        angular.element("input[type='file']").val(null);

        $scope.displayClaimFileName = false;
        $scope.displayAddAttachmentbtn = true;
    };

    $scope.selected = { isScheduledItem: false };
    $scope.AddNewItem = false;
    $scope.EditItem = false;
    $scope.GetSubCategory = GetSubCategory;
    function GetSubCategory() {
        if ($scope.selected.category !== null && angular.isDefined($scope.selected.category)) {
            var param = {
                "categoryId": $scope.selected.category.id
            };
            var respGetSubCategory = ThirdPartyClaimDetailsService.getSubCategory(param);
            respGetSubCategory.then(function (success) { $scope.SubCategory = success.data.data; }, function (error) { $scope.SubCategory = null; $scope.ErrorMessage = error.data.errorMessage });
        }
    };

    $scope.GetCategory = GetCategory;
    function GetCategory() {
        $(".page-spinner-bar").removeClass("hide");
        var getpromise = ThirdPartyClaimDetailsService.getCategories();
        getpromise.then(function (success) {
            $scope.DdlSourceCategoryList = success.data.data;
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            $(".page-spinner-bar").addClass("hide");
            toastr.remove();
            toastr.error((angular.isDefined(error.data) && angular.isDefined(error.data.errorMessage) ? error.data.errorMessage : AuthHeaderService.genericErrorMessage()), "Error");
        });
    };

    $scope.CancelAddNewItem = CancelAddNewItem;
    function CancelAddNewItem() {
        $scope.AddNewItem = false;
    };


    $scope.getTemplate = function (item) {
        if (!angular.isUndefined(item)) {
            if (item.claimItem.id === $scope.selected.id) return 'edit';
            else
                return 'display';
        }
        else
            return 'display';
    };

    $scope.reset = function () {
        $scope.AddNewItem = false;
        $scope.EditItem = false;
        $scope.selected = {};
    };

    $scope.EditItemDetails = function (item) {
        $scope.AddNewItem = false;
        $scope.EditItem = true;
        $scope.selected = {};
        $scope.selected = angular.copy(item.claimItem);
    };

    $scope.OriginalPostLossIndex = 0;
    $scope.EditItemDetails = function (item) {
        $scope.AddNewItem = false;
        $scope.EditItem = true;
        $scope.selected = {};
        $scope.selected = angular.copy(item.claimItem);
        $scope.OriginalPostLossIndex = $scope.FiletrLostDamageList.indexOf(item);
        $scope.OriginalPostLossItem = angular.copy(item);
        $scope.GetCategory();
        $scope.GetSubCategory();
    };

    $scope.SaveItemDetails = function (itemid) {
        if (!angular.isUndefined(itemid)) {
            var param = new FormData();
            param.append('filesDetails', null);
            param.append("itemDetails",
                JSON.stringify(
                 {
                     "id": $scope.selected.id,
                     "acv": $scope.selected.acv, "adjusterDescription": $scope.selected.adjusterDescription, "brand": $scope.selected.brand,
                     "category": { "id": (($scope.selected.category !== null && angular.isDefined($scope.selected.category)) ? $scope.selected.category.id : null) },
                     "dateOfPurchase": (($scope.selected.dateOfPurchase !== null && angular.isDefined($scope.selected.dateOfPurchase)) ? $scope.selected.dateOfPurchase : null), "depriciationRate": $scope.selected.depriciationRate, "description": $scope.selected.description, "insuredPrice": $scope.selected.insuredPrice,
                     "holdOverValue": $scope.selected.holdOverValue, "itemName": $scope.selected.itemName, "model": $scope.selected.model, "isReplaced": $scope.selected.IsReplaced, "quantity": $scope.selected.quantity,
                     "quotedPrice": $scope.selected.quotedPrice, "rcv": $scope.selected.rcv,
                     "subCategory": { "id": (($scope.selected.subCategory !== null && angular.isDefined($scope.subCategory.category)) ? $scope.selected.subCategory.id : null) },
                     "taxRate": $scope.selected.taxRate, "valueOfItem": $scope.selected.valueOfItem, "yearOfManufecturing": $scope.selected.yearOfManufecturing, "status": { "id": $scope.selected.status.id },
                     "isScheduledItem": $scope.selected.isScheduledItem, "age": $scope.selected.age
                 }
                ));
            param.append('file', null);

            var UpdatePostLoss = ThirdPartyClaimDetailsService.UpdatePostLoss(param);
            UpdatePostLoss.then(function (success) {
                var obj = MakeObjectToAddInList(success);
                obj.status.status = $scope.OriginalPostLossItem.claimItem.status.status;
                obj.isReplaced = $scope.OriginalPostLossItem.claimItem.isReplaced;
                $scope.FiletrLostDamageList[$scope.OriginalPostLossIndex].claimItem = angular.copy(obj);

                toastr.remove()
                toastr.success($translate.instant("ItemEditSuccess"), $translate.instant("CommonConfirmationHeading"));

                $scope.reset();
            },
            function (error) {
                toastr.remove()
                toastr.error($translate.instant("CommonErrorMessage"), $translate.instant("CommonErrorHeading"));
                $scope.ErrorMessage = error.data.errorMessage;
            });
        }
        else {//Call Api save And get its id then assign id and pass 
            var param = new FormData();
            param.append('filesDetails', null);
            param.append("itemDetails",
                JSON.stringify({
                    "acv": null,
                    "adjusterDescription": null,
                    "assignedTo": {
                        "id": null
                    },
                    "brand": null,
                    "category": {
                        "id": (($scope.selected.category !== null && angular.isDefined($scope.selected.category)) ? $scope.selected.category.id : null)
                    },
                    "dateOfPurchase": (($scope.selected.dateOfPurchase !== null && angular.isDefined($scope.selected.dateOfPurchase)) ? $scope.selected.dateOfPurchase : null), "depriciationRate": null,
                    "description": $scope.selected.description,
                    "holdOverValue": null,
                    "claimId": sessionStorage.getItem("AdjusterClaimId").toString(),//Need to pass the claimId
                    "itemName": $scope.selected.itemName,
                    "model": null,
                    "paymentDetails": null,
                    "quotedPrice": null,
                    "rcv": null,
                    "subCategory": {
                        "id": (($scope.selected.subCategory !== null && angular.isDefined($scope.selected.subCategory)) ? $scope.selected.subCategory.id : null)
                    },
                    "taxRate": null,
                    "totalTax": null,
                    "valueOfItem": null,
                    "yearOfManufecturing": null,
                    "status": {
                        "id": null,
                        "status": null
                    },
                    "isScheduledItem": $scope.selected.isScheduledItem,
                    "age": $scope.selected.age
                }
                ));
            param.append('file', null);
            var SavePostLossItem = ThirdPartyClaimDetailsService.AddPostLossItem(param);
            SavePostLossItem.then(function (success) {
                //Need to pass the ItemId which will generate after inserting item       
                if ($scope.FiletrLostDamageList !== null)
                    var obj = MakeObjectToAddInList(success);
                obj.status.status = "CREATED";
                //obj.isScheduledItem = $scope.selected.isScheduledItem;
                var objnew = MakeComparablesObj();
                var pushObject = {
                    "claimItem": obj,
                    "comparableItems": objnew
                }
                $scope.FiletrLostDamageList.splice(0, 0, pushObject);

                toastr.remove()
                toastr.success($translate.instant("ItemAddedSuccess"), $translate.instant("CommonConfirmationHeading"));
                $scope.reset();
            }, function (error) {
                toastr.remove()
                toastr.error($translate.instant("CommonErrorMessage"), $translate.instant("CommonErrorHeading"));
                $scope.ErrorMessage = error.data.errorMessage;
            });
        }

    };

    //making comparables list object to add after save new item
    function MakeComparablesObj() {
        return {
            "id": null,
            "originalItemId": null,
            "isvendorItem": null,
            "description": null,
            "itemName": null,
            "unitPrice": null,
            "taxRate": null,
            "brand": null,
            "model": null,
            "supplier": null,
            "itemType": null,
            "isReplacementItem": null
        }
    };

    //Make object to be add or replace after save or edit item details
    function MakeObjectToAddInList(success) {
        return {
            "id": success.data.data.id,
            "acv": success.data.data.acv,
            "adjusterDescription": success.data.data.adjusterDescription,
            "age": success.data.data.age,
            "assignedTo": success.data.data.assignedTo,
            "brand": success.data.data.brand,
            "category": {
                "id": success.data.data.category.id,
                "name": GetCategoryOrSubCategoryOnId(true, success.data.data.category.id),
                "annualDepreciation": null,
                "usefulYears": null
            },
            "claimId": success.data.data.claimId,
            "claimNumber": success.data.data.claimNumber,
            "dateOfPurchase": success.data.data.dateOfPurchase,
            "depriciationRate": success.data.data.depriciationRate,
            "description": success.data.data.description,
            "holdOverValue": success.data.data.holdOverValue,
            "insuredPrice": success.data.data.insuredPrice,
            "isReplaced": success.data.data.isReplaced,
            "isScheduledItem": success.data.data.isScheduledItem == true ? true : false,
            "itemName": success.data.data.itemName,
            "itemType": success.data.data.itemType,
            "model": success.data.data.model,
            "paymentDetails": success.data.data.paymentDetails,
            "quantity": success.data.data.quantity,
            "quotedPrice": success.data.data.quotedPrice,
            "rcv": success.data.data.rcv,
            "status": {
                "id": success.data.data.status.id,
                "status": ""
            },
            "subCategory": {
                "id": success.data.data.subCategory.id,
                "name": GetCategoryOrSubCategoryOnId(false, success.data.data.subCategory.id),
                "annualDepreciation": null,
                "usefulYears": null
            },

            "taxRate": success.data.data.taxRate,
            "totalTax": success.data.data.totalTax,
            "valueOfItem": success.data.data.valueOfItem,
            "vendorDetails": success.data.data.vendorDetails,
            "yearOfManufecturing": success.data.data.yearOfManufecturing
        }
    };

    //get Category name on category id for showing in grid of post loss itemd
    function GetCategoryOrSubCategoryOnId(OpertionFlag, id) {
        if (OpertionFlag) {
            var list = $filter('filter')($scope.DdlSourceCategoryList, { categoryId: id });
            return list[0].categoryName;
        }
        else {
            var list = $filter('filter')($scope.SubCategory, { id: id });
            if (list.length > 0)
                return list[0].name;
            else
                return null;
        }
    };

    $scope.DeletItem = DeletItem;
    function DeletItem(obj) {
        var DeleteItemMessage = "Are you sure you want to delete <b>item # " + obj.claimItem.itemUID + "</b> (" + obj.claimItem.description + ")";
        bootbox.confirm({
            size: "",
            title: $translate.instant('Confirm.DeleteItemTitle'),
            message: $translate.instant(DeleteItemMessage), closeButton: false,
            className: "modalcustom", buttons: {
                confirm: {
                    label: $translate.instant('Confirm.BtnYes'),
                    className: 'btn-success'
                },
                cancel: {
                    label: $translate.instant('Confirm.BtnNo'),
                    className: 'btn-danger'
                }
            },
            callback: function (result) {

                if (result) {
                    $(".page-spinner-bar").removeClass("hide");
                    var paramId = {
                        "registrationNumber": sessionStorage.getItem("CompanyCRN"),
                        "itemUID": obj.claimItem.itemUID
                    };
                    var response = ThirdPartyClaimDetailsService.DeleteLostDamageItem(paramId);
                    response.then(function (success) { //Filter list and remove item   
                        toastr.remove();
                        toastr.success(success.data.message, "Confirmation");
                        GetPostLostItems();
                        $(".page-spinner-bar").addClass("hide");
                    }, function (error) {
                        toastr.remove();
                        toastr.error(error.data.errorMessage, "Error");
                        $(".page-spinner-bar").addClass("hide");
                    });
                }
            }
        });
    };

    $scope.SelectPostLostItem = function (item) {
        var flag = 0;
        angular.forEach($scope.FiletrLostDamageList, function (item) {
            if (item.Selected) {
                flag++;
            }
        });
        var flagNew = 0;
        angular.forEach($scope.FiletrLostDamageList, function (item) {
            if (angular.isDefined(item.claimItem.status) && item.claimItem.status !== null) {
                if ((item.claimItem.status.id != 3 || item.claimItem.status.status != 'UNDER REVIEW') && ((item.claimItem.status.id != 2 || item.claimItem.status.status != 'ASSIGNED'))) {
                    flagNew++;
                }
            }
        });
        if (flag != flagNew) {
            $scope.selectedAll = false;
        }
        else if (flag == flagNew) {
            $scope.selectedAll = true;
        }
        var index = $scope.SelectedPostLostItems.indexOf(item.claimItem.id);
        if (index > -1) {
            $scope.SelectedPostLostItems.splice(index, 1);
        }
        else {
            $scope.SelectedPostLostItems.push(item.claimItem.id);
        }
    };

    $scope.checkAll = function () {
        $scope.SelectedPostLostItems = [];
        if ($scope.selectedAll) {
            $scope.selectedAll = true;
            angular.forEach($scope.FiletrLostDamageList, function (item) {
                if (item.claimItem.status.id === 2 || item.claimItem.status.status === 'ASSIGNED') {
                    $scope.SelectedPostLostItems.push(item.claimItem.id);
                }
            });

        } else {
            $scope.selectedAll = false;
            $scope.SelectedPostLostItems = [];
        }
        angular.forEach($scope.FiletrLostDamageList, function (item) {
            if (item.claimItem.status.id === 2 || item.claimItem.status.status === 'ASSIGNED') {
                item.Selected = $scope.selectedAll;
            }
        });
    };

    //Claim Form functionlity
    // Create task list to cretae pending task
    $scope.dynamicPopover = {
        isOpen: false,
        html: true,
        templateUrl: "myPopoverTemplate.html",
        open: function open() {
            $scope.dynamicPopover.isOpen = true;
            // $("[data-toggle=popover]").popover();
        },
        close: function close() {
            $scope.dynamicPopover.isOpen = false;

        }
    };

    $scope.CreatePendingTasksObjList = [];
    $scope.StoreTaskObject = StoreTaskObject;
    function StoreTaskObject(taskSet) {
        $scope.CreatePendingTasksObjList = [];
        $scope.CreatePendingTasksObjList.push({
            "taskId": taskSet.taskId,
            "comment": taskSet.comment
        });
    };

    //Create Pending task against claim
    $scope.CreatePendingtask = CreatePendingtask;
    function CreatePendingtask() {
        var param = {
            "claimId": $scope.CommonObj.ClaimId.toString(),
            claimPendingTasks: $scope.CreatePendingTasksObjList
        };
        // $scope.dynamicPopover.close();
        var CreateTask = ThirdPartyClaimDetailsService.CreatePendingtask(param);
        CreateTask.then(function (success) {
            $scope.dynamicPopover.close();
        }, function (error) {
            $scope.ErrorMessage = error.data.errorMessage;
        });
    };
    //End Task 

    $scope.openLineItemdetails = function () {
        $location.url('ThirdPartyLineItemDetails');
    };

    //Add Note popup
    $scope.AddNotePopup = AddNotePopup;
    function AddNotePopup(ev) {
        //if ($scope.ClaimParticipantsList.length > 0) {
        var obj = {
            "claimId": $scope.CommonObj.ClaimId,
            "ClaimNumber": $scope.CommonObj.ClaimNumber,
            "ParticipantList": $scope.ClaimParticipantsList
        };
        $scope.animationsEnabled = true;
        var paramCompanyId = {
            "companyId": sessionStorage.getItem("CompanyId")
        };
        var out = $uibModal.open(
        {
            animation: $scope.animationsEnabled,
            templateUrl: "views/ThirdPartyVendor/AddNotePopup.html",
            controller: "AddNotePopupController",
            backdrop: 'static',
            keyboard: false,
            resolve:
            {
                objClaim: function () {
                    objClaim = obj;
                    return objClaim;
                }
            }

        });
        out.result.then(function (value) {
            //Call Back Function success
            if (value === "Success") {
                $scope.GetNotes();
            }

        }, function (res) {
            //Call Back Function close
        });
        return {
            open: open
        };
        //}
    };

    $scope.AddEventPopup = AddEventPopup;
    function AddEventPopup(ev) {
        //if ($scope.ClaimParticipantsList.length > 0) {
        var obj = {
            "claimId": $scope.CommonObj.ClaimId,
            "ParticipantList": $scope.ClaimParticipantsList
        };
        $scope.animationsEnabled = true;
        var paramCompanyId = {
            "companyId": sessionStorage.getItem("CompanyId")
        };
        var out = $uibModal.open(
        {
            animation: $scope.animationsEnabled,
            templateUrl: "views/ThirdPartyVendor/AddEventPopup.html",
            controller: "AddEventPopupController",
            backdrop: 'static',
            keyboard: false,
            resolve:
            {
                objClaim: function () {
                    objClaim = obj;
                    return objClaim;
                }
            }

        });
        out.result.then(function (value) {
            //Call Back Function success
            if (value === "Success") {
                $scope.GetEventList();
            }

        }, function (res) {
            //Call Back Function close
        });
        return {
            open: open
        };
    };

    $scope.RaiseInvoice = RaiseInvoice;
    function RaiseInvoice() {
        var AdjName = "";
        if (angular.isDefined($scope.GetInsurancDetails)) {
            if ($scope.GetInsurancDetails.adjusterDetails) {
                AdjName = (($scope.GetInsurancDetails.adjusterDetails.firstName) ? $scope.GetInsurancDetails.adjusterDetails.firstName : "")
                     + (($scope.GetInsurancDetails.adjusterDetails.lastName) ? $scope.GetInsurancDetails.adjusterDetails.lastName : "")
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
            "ClaimNoForInvice": $scope.CommonObj.ClaimNumber,
            "AdjusterName": AdjName,
            "InsuredName": PolicyHolder,
            "taxRate": $scope.ConentDetails.policyDetails.taxRates
        };
        sessionStorage.setItem("ClaimDetailsForInvoice", JSON.stringify(UserDetails));
        $location.url('ThirdPartyCreateInvoice');
    };

    $scope.GotoAssign = function (item) {
        sessionStorage.setItem("ServiceRequestId", item.serviceRequestId);
        $location.url('ThirdPartyAssignServiceRequest')
    };

    //Get event details
    $scope.GetEventDetails = function (event) {
        var obj = {
            "claimId": $scope.CommonObj.ClaimId,
            "ParticipantList": $scope.ClaimParticipantsList,
            "event": angular.copy(event)
        };
        $scope.animationsEnabled = true;
        var paramCompanyId = {
            "companyId": sessionStorage.getItem("CompanyId")
        };
        var out = $uibModal.open(
        {
            animation: $scope.animationsEnabled,
            templateUrl: "views/ThirdPartyVendor/EventDetails.html",
            controller: "EventDetailsController",
            resolve:
            {
                objClaim: function () {
                    objClaim = obj;
                    return objClaim;
                }
            }

        });
        out.result.then(function (value) {
            //Call Back Function success
            if (value === "Success") {
                $scope.GetEventList();
            }

        }, function (res) {
            //Call Back Function close
        });
        return {
            open: open
        };
    };

    $scope.GotoAllEvents = GotoAllEvents;
    function GotoAllEvents() {
        var ClaimObj = {
            "IsClaimEvent": true,
            "ClaimNumber": $scope.CommonObj.ClaimNumber,
            "ClaimId": $scope.CommonObj.ClaimId
        }
        sessionStorage.setItem("ClaimObj", JSON.stringify(ClaimObj));
        $location.url("AllEvents");
    };

    $scope.GotoAllNotes = GotoAllNotes;
    function GotoAllNotes() {
        if (($scope.CommonObj.ClaimId !== null && angular.isDefined($scope.CommonObj.ClaimId)) && ($scope.CommonObj.ClaimNumber !== null && angular.isDefined($scope.CommonObj.ClaimNumber))) {
            sessionStorage.setItem("AllNoteClaimId", $scope.CommonObj.ClaimId);
            sessionStorage.setItem("AllNoteClaimNumber", $scope.CommonObj.ClaimNumber);
            $location.url('AllNotes');
        }
    };

    //Goto Report
    $scope.GoToReport = GoToReport;
    function GoToReport() {
        sessionStorage.setItem("ReportClaimNo", $scope.CommonObj.ClaimNumber);
        $location.url('Report');
    };

    //For note details
    $scope.GetNoteDetails = function (item) {
        var obj = {
            "Note": angular.copy(item),
            "ParticipantList": $scope.ClaimParticipantsList,
        };
        $scope.animationsEnabled = true;
        var out = $uibModal.open(
        {
            animation: $scope.animationsEnabled,
            templateUrl: "views/AllNotes/NoteDetails.html",
            controller: "NoteDetailsController",
            resolve:
            {
                NoteObj: function () {
                    NoteObj = obj;
                    return NoteObj;
                }
            }

        });
        out.result.then(function (value) {
            $scope.GetNotes();
        }, function (res) {
        });
        return {
            open: open
        };
    };

    $scope.IsEditInvoice = false;
    $scope.IsVendorContact = true
    $scope.InvoiceDetails = [];
    $scope.CreateNewInvoice = CreateNewInvoice;
    function CreateNewInvoice() {
        $scope.IsEditInvoice = false;
        $rootScope.CreateInvoice = true;
        $scope.IsVendorContact = true
    };

    $scope.GoToInvoiceDetails = GoToInvoiceDetails;
    function GoToInvoiceDetails(invoice) {
        $(".page-spinner-bar").removeClass("hide");
        if (invoice.invoiceNumber != null && angular.isDefined(invoice.invoiceNumber)) {
            var param = {
                "invoiceNumber": invoice.invoiceNumber
            }

            var getpromise = ThirdPartyClaimDetailsService.getInvoiceDetails(param);
            getpromise.then(function (success) {
                $scope.InvoiceDetails = success.data.data;
                $scope.InvoiceDetails.InvoiceItems = $scope.InvoiceDetails.invoiceItems;
                angular.forEach($scope.InvoiceDetails.invoiceItems, function (item) {


                })
                $scope.IsEditInvoice = true;
                $rootScope.CreateInvoice = true;
                $(".page-spinner-bar").addClass("hide");
            }, function (error) {
                toastr.remove();
                toastr.error(error.data.errorMessage, $translate.instant("Error"));
                $scope.ErrorMessage = error.data.errorMessage;
            });
        }

    };

    $scope.GotoServiceRequestDummy = function () {
        var AdjName = "abc";
        var PolicyHolder = "abc";
        var UserDetails = {
            "ClaimNoForInvice": 123,
            "AdjusterName": AdjName,
            "InsuredName": PolicyHolder,
            "taxRate": 12
        };
        sessionStorage.setItem("ClaimDetailsForInvoice", JSON.stringify(UserDetails));
        sessionStorage.setItem("ServiceRequestId", 1);
        sessionStorage.setItem("ClaimId", 12);
        $location.url('ThirdPartyServiceRequestEdit');
    };

    $scope.showInsuranceCompany = showInsuranceCompany;
    function showInsuranceCompany() {
        $(".page-spinner-bar").removeClass("hide");
        GetClaimInsuranceDetails();
        $scope.ContentTab = 'InsuranceCompany';
        $(".page-spinner-bar").addClass("hide");
    };

    // -------Time picker--------------------------------

    /** @type {Date} */
    $scope.EventTime = new Date;
    /** @type {number} */
    $scope.hstep = 1;
    /** @type {number} */
    $scope.mstep = 15;
    $scope.options = {
        hstep: [1, 2, 3],
        mstep: [1, 5, 10, 15, 25, 30]
    };
    /** @type {boolean} */
    $scope.ismeridian = true;
    /**
     * @return {undefined}
     */
    $scope.toggleMode = function () {
        /** @type {boolean} */
        $scope.ismeridian = !$scope.ismeridian;
    };
    /**
     * @return {undefined}
     */
    $scope.update = function () {
        /** @type {Date} */

        var d = new Date;
        d.setHours(14);
        d.setMinutes(0);
        /** @type {Date} */
        $scope.EventTime = d;
    };
    /**
     * @return {undefined}
     */
    $scope.changed = function () {

        //$log.log("Time changed to: " + $scope.EventTime);
    };
    $scope.changed1 = function () {

        //$log.log("Time changed to: " + $scope.EventTime);
    };
    /**
     * @return {undefined}
     */
    $scope.clear = function () {
        /** @type {null} */
        $scope.EventTime = null;
    };

    //--------End Time Picker-------------------------------------------------------------

    $scope.SuperVisorReview = SuperVisorReview;
    function SuperVisorReview() {
        $(".page-spinner-bar").removeClass("hide");
        var param = {
            "claimNumber": $scope.CommonObj.ClaimNumber
        }
        var addSuperVisorReview = ThirdPartyClaimDetailsService.SendClaimForSupervisorReview(param);
        addSuperVisorReview.then(function (success) {
            toastr.remove()
            toastr.success(success.data.message, $translate.instant("SuccessHeading"));
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            toastr.remove()
            toastr.error(error.data.errorMessage, $translate.instant("ErrorHeading"));
            $(".page-spinner-bar").addClass("hide");
        });
    };

    $scope.printDiv = function (divName) {
        //var printContents = document.getElementById(divName).innerHTML;
        //var popupWin = window.open('', '_blank', 'width=300,height=300');
        //popupWin.document.open();
        //popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
        //popupWin.document.close();
        window.print();
    };

    $scope.GoToMapping = GoToMapping;
    function GoToMapping(attachment) {
        var obj = {
            "ClaimNumber": $scope.CommonObj.ClaimNumber,
            "ParticipantList": $scope.ClaimParticipantsList,
            "Attachment": angular.copy(attachment)
        }
        sessionStorage.setItem("claimDetails", JSON.stringify(obj))
        $location.url('AttachmentMapping');
    };

    $scope.deteteClaimAttachment = deteteClaimAttachment;
    function deteteClaimAttachment(document) {
        bootbox.confirm({
            size: "",
            closeButton: false,
            title: "Delet media file",
            message: "Are you sure you want to delete this Media File?  <b>Please Confirm!",
            className: "modalcustom", buttons: {
                confirm: {
                    label: 'Yes',
                    className: 'btn-success'
                },
                cancel: {
                    label: 'No',
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                //if (result)  call delet function
                if (result) {
                    $(".page-spinner-bar").removeClass("hide");
                    var param = [{
                        id: document.id
                    }]
                    var promis = ThirdPartyClaimDetailsService.deleteMediaFile(param);
                    promis.then(function (success) {
                        GetClaimAttachment();
                        toastr.remove()
                        toastr.success(success.data.message, $translate.instant("SuccessHeading"));
                        $(".page-spinner-bar").addClass("hide");
                    }, function (error) {
                        toastr.remove()
                        toastr.error(error.data.errorMessage, $translate.instant("ErrorHeading"));
                        $(".page-spinner-bar").addClass("hide");
                    });
                }
            }
        });
    }
    $scope.editTaxRate = editTaxRate;
    function editTaxRate(value) {
        if (value == '1') {
            $scope.isEditTaxRate = true;
            $scope.OrigionalTaxRate = $scope.AssginmentDetails.taxRate;
        }
        else if (value = '0') {
            $scope.isEditTaxRate = false;
            $scope.AssginmentDetails.taxRate = $scope.OrigionalTaxRate;
        }
    };

    $scope.changeTaxRate = changeTaxRate;
    function changeTaxRate() {
        $(".page-spinner-bar").removeClass("hide");
        var params = {
            "claimId": $scope.CommonObj.ClaimId.toString(),
            "taxrate": $scope.AssginmentDetails.taxRate
        }
        var taxRatePromis = ThirdPartyClaimDetailsService.changeTaxRate(params);
        taxRatePromis.then(function (success) {
            $scope.isEditTaxRate = false;
            var param ={
            "assignmentNumber": $scope.CommonObj.AssignmentNumber
        };
            var GetAssingmentDetails = ThirdPartyClaimDetailsService.GetVendorassignmentDetails(param);
            GetAssingmentDetails.then(function (success) {
                $scope.AssginmentDetails = success.data.data;
                toastr.remove();
                toastr.success(success.data.message, "Confirmation");
                $(".page-spinner-bar").addClass("hide");
            }, function (error) {
                toastr.remove();
                if (error.data.errorMessage != null && angular.isDefined(error.data.errorMessage)) {
                    toastr.error(error.data.errorMessage, "Error")
                    $(".page-spinner-bar").addClass("hide");
                }
                else {
                    toastr.error(AuthHeaderService.genericErrorMessage(), "Error")
                    $(".page-spinner-bar").addClass("hide");
                }
            });
        }, function (error) {
            $(".page-spinner-bar").addClass("hide");
            toastr.remove();
            toastr.error((angular.isDefined(error.data) && angular.isDefined(error.data.errorMessage) ? error.data.errorMessage : AuthHeaderService.genericErrorMessage()), "Error")
        })
    };

    $scope.insuranceCompanyEdit = insuranceCompanyEdit;
    function insuranceCompanyEdit() {
        $scope.editInsuranceCompany = true;
        $scope.editPolicyHolder = angular.copy($scope.GetInsurancDetails.policyHolder);

        var state = $filter('filter')($scope.StateList, { "state": $scope.GetInsurancDetails.policyHolder.address.state.state });
        $scope.editPolicyHolder.address.state.id = state[0].id;
    };

    $scope.GetStateList = GetStateList;
    function GetStateList() {
        var param =
          {
              "isTaxRate": true,
              "isTimeZone": true
          };
        var GetStates = ThirdPartyClaimDetailsService.getStates(param);
        GetStates.then(function (success) {
            $scope.StateList = success.data.data;
        },
        function (error) {
        });
    };

    $scope.cancleEdit = cancleEdit;
    function cancleEdit() {
        $scope.editInsuranceCompany = false;
        $scope.editPolicyHolder = null;
    };

    $scope.UpdateCompanyDetails = UpdateCompanyDetails;
    function UpdateCompanyDetails() {
        $(".page-spinner-bar").removeClass("hide");
        if (angular.isDefined($scope.editPolicyHolder.email) && $scope.editPolicyHolder.email != null) {
            var param =
           {
               "id": $scope.AssginmentDetails.insuredBaseDetails.policyHolderId,
               "claimNumber": $scope.CommonObj.ClaimNumber,
               "email": $scope.editPolicyHolder.email,
               "eveningTimePhone": angular.isUndefined($scope.editPolicyHolder.eveningTimePhone) ? null : $scope.editPolicyHolder.eveningTimePhone,
               "dayTimePhone": angular.isUndefined($scope.editPolicyHolder.dayTimePhone) ? null : $scope.editPolicyHolder.dayTimePhone,
               "cellPhone": angular.isUndefined($scope.editPolicyHolder.cellPhone) ? null : $scope.editPolicyHolder.cellPhone,
               "firstName": angular.isUndefined($scope.editPolicyHolder.firstName) ? null : $scope.editPolicyHolder.firstName,
               "lastName": angular.isUndefined($scope.editPolicyHolder.lastName) ? null : $scope.editPolicyHolder.lastName,
               "address": {
                   "city": angular.isUndefined($scope.editPolicyHolder.address.city) ? null : $scope.editPolicyHolder.address.city,
                   "streetAddressOne": angular.isUndefined($scope.editPolicyHolder.address.streetAddressOne) ? null : $scope.editPolicyHolder.address.streetAddressOne,
                   "streetAddressTwo": angular.isUndefined($scope.editPolicyHolder.address.streetAddressTwo) ? null : $scope.editPolicyHolder.address.streetAddressTwo,
                   "zipcode": angular.isUndefined($scope.editPolicyHolder.address.zipcode) ? null : $scope.editPolicyHolder.address.zipcode,
                   "state": {
                       "id": angular.isUndefined($scope.editPolicyHolder.address.state) ? null : $scope.editPolicyHolder.address.state.id
                   }
               },
               "registrationNumber": $scope.GetInsurancDetails.company.companyCrn
           };
        };
        var updatePolicyHolder = ThirdPartyClaimDetailsService.updatePolicyHolder(param);
        updatePolicyHolder.then(function (success) {
            GetClaimInsuranceDetails();
            toastr.remove()
            toastr.success(success.data.message, $translate.instant("SuccessHeading"));
            $(".page-spinner-bar").addClass("hide");
            $scope.editInsuranceCompany = false;
            $scope.editPolicyHolder = null;
        },
        function (error) {
            $(".page-spinner-bar").addClass("hide");
            toastr.remove();
            toastr.error((angular.isDefined(error.data) && angular.isDefined(error.data.errorMessage) ? error.data.errorMessage : AuthHeaderService.genericErrorMessage()), "Error")
        });
    }

    $scope.reOpenClaim = reOpenClaim;
    function reOpenClaim() {
        $(".page-spinner-bar").removeClass("hide");
        var param = {
            "claimId": $scope.CommonObj.ClaimId
        }
        var promis = ThirdPartyClaimDetailsService.reOpenClaim(param);
        promis.then(function (success) {
            $location.url('VendorAssociateClaimDetails');
            $(".page-spinner-bar").removeClass("hide");
        }, function (error) {
            toastr.remove()
            toastr.error(error.data.errorMessage, $translate.instant("ErrorHeading"));
            $(".page-spinner-bar").addClass("hide");
        })
    };

    $scope.AddNewItemToList = AddNewItemToList;
    function AddNewItemToList() {
        $location.url('AddItem');
    };
});
