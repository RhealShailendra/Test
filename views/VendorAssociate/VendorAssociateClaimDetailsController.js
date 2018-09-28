angular.module('MetronicApp').controller('VendorAssociateClaimDetailsController', function ($translate, $translatePartialLoader, $rootScope, $log, $scope,
    settings, $http, $timeout, $location, $uibModal, $filter, VendorAssociateClaimDetailsService, ItemValueService,AuthHeaderService) {

    $translatePartialLoader.addPart('VendorAssociateClaimDetails');
    $translate.refresh();
    
    function init() {
        $scope.claimStatus = sessionStorage.getItem("VendorAssociateClaimStatus");
        sessionStorage.setItem("ClaimNo", sessionStorage.getItem("ThirdPartyClaimNo"));
        sessionStorage.setItem("ClaimNoForInvice", "");
        $scope.pagesize = $rootScope.settings.itemPagesize;
        $scope.CurrentClaimDetailsTab = 'ContentList';
        $scope.currentAttchment = null;
        $scope.indextab = 0;
        $scope.ClaimStatusInvoiceDetails = [];
        $scope.ClaimStatusContent = [];
        $scope.ClaimAttachments = [];
        $scope.ClaimParticipantsList = []; //We are adding vendor list to this object which is used for autocomplete extender
        $scope.ParticipantId = null;
        $scope.ParticipantName = "";
        $scope.ErrorMessage = "";
        $scope.FiletrLostDamageList = [];
        $scope.OriginalPostLossItem = [];
        $scope.DdlSourceCategoryList = [];
        $scope.LostDamagedContentByCategory = [];
        $scope.SubCategory = [];
        $scope.VendorsAgainstClaim = [];
        $scope.ClaimNotes = [];
        $scope.SelectedPostLostItems = [];
        $scope.EventList = [];
        $scope.PolicyDetails = [];
        $scope.ServiceRequestList = [];
        $scope.ContentTab = 'Contents';//For displaying active tab at the page load
        $scope.EventsTab = 'Event';//For displaying active tab at the page load
        $scope.PendingTaskList = [];
        $scope.displayEvent = true;
        $scope.displayNotes = false;
        $scope.displayParticipant = false;
        $scope.displayOrigionalItems = true;
        $scope.displayContentList = false;
        $scope.reverseIcon = true;
        $scope.displayClaimDetails = false;
        $scope.displayAddAttachmentbtn = true;
        $scope.displayClaimFileName = false;
        $rootScope.CreateInvoice = false;
        $scope.AssginmentDetails = {};
        $scope.displayAddImageButton = false;
        $scope.attachmentList = [];
        $scope.claimStatus = "";
        $scope.isEditTaxRate = false;
        $scope.newTaxRate = null;
        $scope.OrigionalTaxRate = null;
        $scope.sortNotereverse = true;
        $scope.sortNote = 'createDate';

        $scope.CommonObj = {
            ClaimProfile: "Jewelry",
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
            EventDate: $filter('date')(new Date(), "dd/MM/yyyy"),
            EventActive: sessionStorage.getItem("ShowEventActive"),
            NoteActive: sessionStorage.getItem("ShowNoteActive"),
            PurchaseClaimNumber: sessionStorage.getItem("ThirdPartyClaimNo"),
            PurchaseClaimId: sessionStorage.getItem("ThirdPartyClaimId"),
            PurchaseItemId: null,
            PurchaseItemNumber: null,
            ItemDescription: "",
            OrigionalItemDescription: "",
            ThisPage: "ClaimDetails"
        };

        if ($scope.CommonObj.ClaimId != null || $scope.CommonObj.ClaimNumber != null) {
            $(".page-spinner-bar").removeClass("hide");
            GetStateList();
            GetPostLostItems();
            GetNotes();
            GetClaimStatusList();
            GetCategory();
            GetParticipantsList();//participants for notes, claim
            GetClaimInsuranceDetails();
            GetEventList();
            GetAssignMentDetails();
            GetClaimStatusInvoiceDetails();
            //By default showing notes or events tab opened if redirected from alert tab to this page
            if ($scope.CommonObj.EventActive !== "" || $scope.CommonObj.NoteActive !== "") {
                if ($scope.CommonObj.EventActive === "true" && $scope.CommonObj.NoteActive === "false") {
                    $scope.EventsTab = 'Event';
                    $scope.ContentTab = 'Contents';
                }
                else if ($scope.CommonObj.EventActive === "false" && $scope.CommonObj.NoteActive === "true") {
                    $scope.EventsTab = 'Notes';
                    $scope.ContentTab = 'Contents';
                }
            }
            else {
                $scope.EventsTab = 'Event';
                $scope.ContentTab = 'Contents';
            }
        }
        else {
            //if session data is lost then redirect to previous page
            sessionStorage.setItem("VendorAssociateClaimNo", "");
            sessionStorage.setItem("VendorAssociateClaimId", "");
            $location.url('VendorAssociateDashboard');           
        }
    };
    init();

    $scope.ShowEvent = function () {
        $scope.displayEvent = true;
        $scope.displayNotes = false;
        $scope.displayAttachment = false;
        $scope.displayParticipant = false;
    };
    $scope.ShowNotes = function () {
        $scope.displayEvent = false;
        $scope.displayNotes = true;
        $scope.displayAttachment = false;
        $scope.displayParticipant = false;
    };
    $scope.ShowParticipant = function () {
        $scope.displayEvent = false;
        $scope.displayNotes = false;
        $scope.displayAttachment = false;
        $scope.displayParticipant = true;
    };
    $scope.ShowAttachments = function () {
        $scope.displayEvent = false;
        $scope.displayNotes = false;
        $scope.displayParticipant = false;
        $scope.displayAttachment = true;
    };
    $scope.showOriginalItems = function () {
        $scope.displayOrigionalItems = true;
        $scope.displayContentList = false;
    };
    $scope.showContentList = function () {
        $scope.displayOrigionalItems = false;
        $scope.displayContentList = true;
    };
    $scope.showDetails = function () {
        $scope.displayClaimDetails = !$scope.displayClaimDetails;

        $scope.reverseIcon = !$scope.reverseIcon;
    };
    $scope.sortpostlostitem = function (keyname) {
        $scope.sortKey = keyname;
        $scope.reverse = !$scope.reverse;
    };
    $scope.sortServiceRequest = function (keyname) {
        $scope.sortServiceRequestKey = keyname;
        $scope.sortServiceRequestreverse = !$scope.sortServiceRequestreverse;
    };
    $scope.sortVendor = function (keyname) {
        $scope.sortVendorKey = keyname;
        $scope.reverseVendor = !$scope.reverseVendor;
    };
    $scope.sortClaimDetails = function (keyname) {
        $scope.sortClaimDetailsKey = keyname;
        $scope.reverseClaimDetails = !$scope.reverseClaimDetails;
    };
    $scope.ShowInvoicesTab = ShowInvoicesTab;
    function ShowInvoicesTab() {
        $scope.ContentTab = 'Invoices';
        $scope.GetInvoicesAgainstAssignment();
    };
    $scope.ShowAttachmentsTab = ShowAttachmentsTab;
    function ShowAttachmentsTab() {
        $scope.EventsTab = 'Attachments';
        $scope.GetClaimAttachment();
    };
    $scope.ShowParticipantsTab = ShowParticipantsTab;
    function ShowParticipantsTab() {       
        $scope.EventsTab = 'Participant';
        $scope.GetParticipantsList();
       
    };
    $scope.AssginmentInvoices = [];
    $scope.GetInvoicesAgainstAssignment = GetInvoicesAgainstAssignment;
    function GetInvoicesAgainstAssignment() {
        $(".page-spinner-bar").removeClass("hide");
        var param =
           {
               "assignmentNumber": $scope.CommonObj.AssignmentNumber
           };
        var GetAssingmentInvoices = VendorAssociateClaimDetailsService.GetAssignmentInvoices(param);
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

    $scope.GetNotes = GetNotes;
    function GetNotes() {
        $(".page-spinner-bar").removeClass("hide");
        var param = { "claimId": $scope.CommonObj.ClaimId.toString() }
        var getpromise = VendorAssociateClaimDetailsService.getClaimNotes(param);
        getpromise.then(function (success) {
            $scope.ClaimNotes = [];
            $scope.ClaimNotes = $filter('orderBy')(success.data.data, 'createDate');//success.data.data;
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
        },
            function (error) {
                $(".page-spinner-bar").addClass("hide");
                toastr.remove();
                toastr.error((angular.isDefined(error.data) && angular.isDefined(error.data.errorMessage) ? error.data.errorMessage : AuthHeaderService.genericErrorMessage()), "Error");
            });
    };
    $scope.GetClaimAttachment = GetClaimAttachment
    function GetClaimAttachment() {
        $(".page-spinner-bar").removeClass("hide");
        var param = { "claimNumber": $scope.CommonObj.ClaimNumber.toString() }
        var getpromise = VendorAssociateClaimDetailsService.getClaimAttachments(param);
        getpromise.then(function (success) {
            $scope.ClaimAttachments = [];
            $scope.ClaimAttachments = success.data.data;
            var list = [];
            $(".page-spinner-bar").addClass("hide");

        },
            function (error) {
                $scope.ErrorMessage = error.data.errorMessage;
                $(".page-spinner-bar").addClass("hide");
            });
    };
    $scope.GetPostLostItems = GetPostLostItems;
    function GetPostLostItems() {
        $(".page-spinner-bar").removeClass("hide");
        var param = {
            "claimNumber": $scope.CommonObj.ClaimNumber,
            "assignmentNumber": $scope.CommonObj.AssignmentNumber         
        };
        var getpromise = VendorAssociateClaimDetailsService.getPostLostItemsForVendor(param);
        getpromise.then(function (success) {
            $scope.FiletrLostDamageList = [];           
                /* CTB-969 cheyenne reported issue→As a vendor contact when I assign all line items within a claim I should not be brought back to an empty claim contents page,
                I should be brought directly back to my dashboard. */
            if (success.data.data == null) {
                toastr.remove();
                toastr.error("0 items avaibale against this assignment","Error");
                $location.url(sessionStorage.getItem('HomeScreen'));
            } else {
                $scope.FiletrLostDamageList = success.data.data.itemReplacement;
                var TempList = [];
                angular.forEach($scope.FiletrLostDamageList, function (item) {
                    if (item.claimItem.isActive) {
                        TempList.push(item)
                    }
                });
                $scope.FiletrLostDamageList = angular.copy(TempList);
                $scope.OriginalPostLossItem = angular.copy(TempList);
                $scope.LostDamagedContentByCategory = angular.copy(TempList);
            }
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            $(".page-spinner-bar").addClass("hide");
            toastr.remove();
            toastr.error((angular.isDefined(error.data) && angular.isDefined(error.data.errorMessage) ? error.data.errorMessage : AuthHeaderService.genericErrorMessage()), "Error");
        });
    };

    $scope.GetEventList = GetEventList;
    function GetEventList() {
        $(".page-spinner-bar").removeClass("hide");
        var paramClaimId = { "id": $scope.CommonObj.ClaimId };
        var EventListPromise = VendorAssociateClaimDetailsService.GetEventList(paramClaimId);
        EventListPromise.then(function (success) {
            $scope.EventList = success.data.data;
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
            toastr.error((angular.isDefined(error.data) && angular.isDefined(error.data.errorMessage) ? error.data.errorMessage : AuthHeaderService.genericErrorMessage()), "Error");
        })
    };    

    $scope.GetParticipantsList = GetParticipantsList;
    function GetParticipantsList() {
        $(".page-spinner-bar").removeClass("hide");
        var param = { "claimNumber": $scope.CommonObj.ClaimNumber }
        var getpromise = VendorAssociateClaimDetailsService.getVendorsListAgainstClaim(param);
        getpromise.then(function (success) {
            $scope.ClaimParticipantsList = success.data.data;
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            $(".page-spinner-bar").addClass("hide");
            toastr.remove();
            toastr.error((angular.isDefined(error.data) && angular.isDefined(error.data.errorMessage) ? error.data.errorMessage : AuthHeaderService.genericErrorMessage()), "Error");
        });
    };

    $scope.GetClaimStatusInvoiceDetails = GetClaimStatusInvoiceDetails
    function GetClaimStatusInvoiceDetails()
    {
        $(".page-spinner-bar").removeClass("hide");
        var param = { "id": $scope.CommonObj.ClaimId };         
        var getpromise = VendorAssociateClaimDetailsService.getClaimsStatusInvoiceDetails(param);
        getpromise.then(function (success) {
            $scope.ClaimStatusInvoiceDetails = success.data.data;
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            $(".page-spinner-bar").addClass("hide");
            toastr.remove();
            toastr.error((angular.isDefined(error.data) && angular.isDefined(error.data.errorMessage) ? error.data.errorMessage : AuthHeaderService.genericErrorMessage()), "Error");
        });
    }

    $scope.GetClaimStatusList =GetClaimStatusList
    function GetClaimStatusList() {
        $(".page-spinner-bar").removeClass("hide");
        $scope.ClaimStatusList = [];
        var claimStatusList = VendorAssociateClaimDetailsService.GetClaimStatusList();
        claimStatusList.then(function (success) {
            $scope.ClaimStatusList = success.data.data;
            $(".page-spinner-bar").removeClass("hide");
        }, function (error) {
            $(".page-spinner-bar").addClass("hide");
            toastr.remove();
            toastr.error((angular.isDefined(error.data) && angular.isDefined(error.data.errorMessage) ? error.data.errorMessage : AuthHeaderService.genericErrorMessage()), "Error");
        })
    };
   
    $scope.GetClaimInsuranceDetails = GetClaimInsuranceDetails;
    function GetClaimInsuranceDetails() {
        $(".page-spinner-bar").removeClass("hide");
        var param = {
            "claimNumber": $scope.CommonObj.ClaimNumber
        }
        var GetInsurancDetails = VendorAssociateClaimDetailsService.GetInsuranceDetails(param);
        GetInsurancDetails.then(function (success) {
            $scope.GetInsurancDetails = success.data.data;
            sessionStorage.setItem("CompanyCRN", $scope.GetInsurancDetails.company.companyCrn);
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            $(".page-spinner-bar").addClass("hide");
            toastr.remove();
            toastr.error((angular.isDefined(error.data) && angular.isDefined(error.data.errorMessage) ? error.data.errorMessage : AuthHeaderService.genericErrorMessage()), "Error");
        });
    }

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
        var out = $uibModal.open(            {
                animation: $scope.animationsEnabled,
                size: "md",
                templateUrl: "views/ThirdPartyVendor/ShowClaimAttachmentDetails.html",
                controller: "ShowClaimAttachmentController",
                backdrop: 'static',
                keyboard: false,
                resolve:
                {
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
        var out = $uibModal.open(            {
                animation: $scope.animationsEnabled,
                size: "md",
                templateUrl: "views/ThirdPartyVendor/ShowNoteAttachmentDetails.html",
                controller: "ShowNotesAttachmentController",
                backdrop: 'static',
                keyboard: false,
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
    }
    $scope.DeletItem = function (ev) {
        bootbox.confirm({
            size: "",
            title: $translate.instant('ClaimDetails_Delete.Title'),
            message: $translate.instant('ClaimDetails_Delete.Message'), closeButton: false,
            className: "modalcustom", buttons: {
                confirm: {
                    label: $translate.instant('ClaimDetails_Delete.BtnYes'),
                    className: 'btn-success'
                },
                cancel: {
                    label: $translate.instant('ClaimDetails_Delete.BtnNo'),
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                if (result) {
                    var paramIdList = [];
                    angular.forEach($scope.DeleteListLostDamageItem, function (item) {
                        paramIdList.push({ "itemId": item })
                    });
                    var response = VendorAssociateClaimDetailsService.removePostLostItem(paramIdList);
                    response.then(function (success) { //Filter list and remove item     
                        $scope.DeleteListLostDamageItem = [];
                        var paramLostDamageList = {
                            "claimId": $scope.CommonObj.claimId
                        };
                        var response = VendorAssociateClaimDetailsService.getFiletrLostDamageList(paramLostDamageList);
                        response.then(function (success) { $scope.FiletrLostDamageList = success.data.data; }, function (error) { });
                    }, function (error) { });
                }
            }
        });
    };   
    $scope.OpenAddNewVendorModel = function (e) {
        $scope.animationsEnabled = true;
        var particiapntType = VendorAssociateClaimDetailsService.getParticipantType()
        particiapntType.then(function (success) {
            $scope.ddlParticipantTypeList = success.data.data;
            sessionStorage.setItem("VendorAssociateClaimNo", $scope.CommonObj.ClaimNumber),
            sessionStorage.setItem("VendorAssociateClaimId", $scope.CommonObj.ClaimId)
            var out = $uibModal.open(
           {
               animation: $scope.animationsEnabled,
               size: "lg",
               templateUrl: "views/VendorAssociate/AddNewVendor.html",
               controller: "AddNewVendorController",
               backdrop: 'static',
               keyboard: false,
               resolve:
               {
                   ddlParticipantTypeList: function () {
                       return $scope.ddlParticipantTypeList;
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
        }, function (error) {

            //$scope.ErrorMessage = error.data.errorMessage;
        });

    };    
    $scope.back = function () {
        sessionStorage.setItem("VendorAssociateClaimNo", "");
        sessionStorage.setItem("VendorAssociateClaimId", "");
        sessionStorage.setItem("ShowEventActive", ""),
       sessionStorage.setItem("ShowNoteActive", "")
        $location.url(sessionStorage.getItem('HomeScreen'));
    };
    $scope.GoToServiceRequestEdit = function (service) {
        //need this details while creating new  service request
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
        sessionStorage.setItem("ServiceId", service.serviceRequestId);
        sessionStorage.setItem("AssociateClaimID", $scope.CommonObj.ClaimId);
        $location.url('AssociateServiceRequestEdit');
    };    
    //for claim attachment
    $scope.SelectClaimFile = function () {
        angular.element('#ClaimFileUpload').trigger('click');
    };
    //get claim attachment details
    $scope.getClaimFileDetails = function (e) {
        $scope.displayClaimFileName = true;
        $scope.displayAddAttachmentbtn = false;
        $scope.$apply(function () {
            $scope.ClaimfileName = e.files[0].name;
            $scope.ClaimFileType = e.files[0].type
            $scope.ClaimFileExtension = $scope.ClaimfileName.substr($scope.ClaimfileName.lastIndexOf('.'))
            $scope.Claimfiles.push(e.files[0]);
            fr = new FileReader();
            //fr.onload = receivedText;
            fr.readAsDataURL(e.files[0]);
        });
        if ($scope.Claimfiles.length > 0)
            $scope.AddClaimAttachment();
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
        var getpromise = VendorAssociateClaimDetailsService.addClaimAttachment(data);
        getpromise.then(function (success) {
            $scope.Status = success.data.status;
            if ($scope.Status == 200) {
                toastr.remove();
                toastr.success(success.data.message, "Confirmation");
                $scope.CommonObj.claimNote = "";
                $scope.ClaimfileName = '';
                $scope.attachmentList = [];
                angular.element("input[type='file']").val(null);
                $scope.displayClaimFileName = false;
                $scope.displayAddImageButton = false;
                GetClaimAttachment();//refresh claim attachment list
                $(".page-spinner-bar").addClass("hide");
            }
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
        $(".page-spinner-bar").removeClass("hide");
        if ($scope.selected.category != null && angular.isDefined($scope.selected.category)) {
            var param = {
                "categoryId": $scope.selected.category.id
            };
            var respGetSubCategory = VendorAssociateClaimDetailsService.getSubCategory(param);
            respGetSubCategory.then(function (success) {
                $scope.SubCategory = success.data.data;
                $(".page-spinner-bar").addClass("hide");
            }, function (error) {
                $scope.SubCategory = null;
                $(".page-spinner-bar").addClass("hide");
                toastr.remove();
                toastr.error((angular.isDefined(error.data) && angular.isDefined(error.data.errorMessage) ? error.data.errorMessage : AuthHeaderService.genericErrorMessage()), "Error");
            });
        }
    };
    $scope.GetCategory = GetCategory;
    function GetCategory() {
        $(".page-spinner-bar").removeClass("hide");
        var getpromise = VendorAssociateClaimDetailsService.getCategories();
        getpromise.then(function (success) {
            $scope.DdlSourceCategoryList = success.data.data;
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            $(".page-spinner-bar").addClass("hide");
            toastr.remove();
            toastr.error((angular.isDefined(error.data) && angular.isDefined(error.data.errorMessage) ? error.data.errorMessage : AuthHeaderService.genericErrorMessage()), "Error");
        });
    }

    $scope.CancelAddNewItem = CancelAddNewItem;
    function CancelAddNewItem() {
        $scope.AddNewItem = false;
    };

    //Lost Damage Items   
    $scope.SelectPostLostItem = function (item) {
        var flag = 0;
        angular.forEach($scope.FiletrLostDamageList, function (item) {
            if (item.Selected) {
                flag++;
            }

        });
        if (flag != $scope.FiletrLostDamageList.length) {
            $scope.selectedAll = false;
        }
        else if (flag == $scope.FiletrLostDamageList.length) {
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
                if (item.claimItem.status.id != 3 || item.claimItem.status.status != 'UNDER REVIEW') {
                    $scope.SelectedPostLostItems.push(item.claimItem.id);
                }
            });

        } else {
            $scope.selectedAll = false;
            $scope.SelectedPostLostItems = [];

        }
        angular.forEach($scope.FiletrLostDamageList, function (item) {
            if (item.claimItem.status.id != 3 || item.claimItem.status.status != 'UNDER REVIEW') {
                item.Selected = $scope.selectedAll;
            }
        });

    };

    // Create task list to cretae pending task
    $scope.dynamicPopover = {
        isOpen: false,
        html: true,
        templateUrl: "myPopoverTemplate.html",
        open: function open() {
            $scope.dynamicPopover.isOpen = true;          
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
        var CreateTask = VendorAssociateClaimDetailsService.CreatePendingtask(param);
        CreateTask.then(function (success) {
            $scope.dynamicPopover.close();
        }, function (error) {
            $scope.ErrorMessage = error.data.errorMessage;
        });
    };
   
    $scope.GoToDetails = function (item) {
        if (item.claimItem.id != null) {
            sessionStorage.setItem("AssociatePostLostItemId", item.claimItem.id);
            sessionStorage.setItem("VendorAssociateClaimNo", $scope.CommonObj.ClaimNumber);
            sessionStorage.setItem("VendorAssociateClaimId", $scope.CommonObj.ClaimId);
            sessionStorage.setItem("AssignmentNumber", $scope.CommonObj.AssignmentNumber)
            sessionStorage.setItem("AssignmentId", $scope.CommonObj.AssignmentId)
            sessionStorage.setItem("Policyholder", "")
            //$scope.PolicyHolderDetails.policyHolder.firstName + " " + $scope.PolicyHolderDetails.policyHolder.lastName)
            $location.url('VendorAssociateItemDetails');
        }

    };

    //Add Note popup
    $scope.AddNotePopup = AddNotePopup;
    function AddNotePopup(ev) {
        //if ($scope.ClaimParticipantsList.length > 0) {
        var obj = {
            "claimId": $scope.CommonObj.ClaimId,
            "ParticipantList": $scope.ClaimParticipantsList,
            "ClaimNumber": $scope.CommonObj.ClaimNumber
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
        // }
    };
    
    $scope.AddEventPopup = AddEventPopup;
    function AddEventPopup(ev) {
        // if ($scope.ClaimParticipantsList.length > 0) {
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
        $location.url('VendorAssociateCreateInvoice');
    };

    //Reject service request
    $scope.Rejectservicerequest = Rejectservicerequest;
    function Rejectservicerequest(ServiceRequest) {
        bootbox.confirm({
            title: $translate.instant("AlertMessage.RejectServiceTitle"),
            closeButton: false,
            className: "modalcustom",
            message: $translate.instant("AlertMessage.RejectServiceMessage"),
            buttons: {
                confirm: {
                    label: $translate.instant("AlertMessage.BtnYes"),
                    className: 'btn-success'
                },
                cancel: {
                    label: $translate.instant("AlertMessage.BtnNo"),
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
                    var Rejectservice = VendorAssociateClaimDetailsService.RejectServiceRequest(paramReject);
                    Rejectservice.then(function (success) {
                        toastr.remove();
                        toastr.success(success.data.message, "Confirmation");
                        if (success.data.status === 200) {
                            var parmAssignUserId = {
                                "vendorAssociateId": sessionStorage.getItem("UserId"),
                                "claimId": $scope.CommonObj.ClaimId
                            };
                            var GetServiceRequested = VendorAssociateClaimDetailsService.GetServiceRequested(parmAssignUserId);
                            GetServiceRequested.then(function (success) {
                                $scope.ServiceRequestList = success.data.data;

                            }, function (error) {
                                $scope.ServiceRequestList = [];
                                $scope.ErrorMessage = error.data.errorMessage;
                                toastr.remove();
                                toastr.error(error.data.errorMessage, "Error");
                            });

                        }
                    }, function (error) {
                        toastr.remove();
                        toastr.error(error.data.errorMessage, "Error");
                    });
                }
            }
        });


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
            backdrop: 'static',
            keyboard: false,
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
            debugger;
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
        $scope.IsVendorContact = false
    };

    $scope.ShowInvoiceDetails = ShowInvoiceDetails;
    function ShowInvoiceDetails() {
        $rootScope.CreateInvoice = true;
    };

    $scope.GoToServiceRequestEditDummy = function () {
        //need this details while creating new  service request
        var AdjName = "Test";

        var PolicyHolder = "Test";

        var UserDetails = {
            "ClaimNoForInvice": 1,
            "AdjusterName": AdjName,
            "InsuredName": PolicyHolder,
            "taxRate": 11
        };
        sessionStorage.setItem("ClaimDetailsForInvoice", JSON.stringify(UserDetails));
        sessionStorage.setItem("ServiceId", 1);
        sessionStorage.setItem("AssociateClaimID", 1);
        $location.url('AssociateServiceRequestEdit');
    };

    $scope.IsEditOrder = false;
    $scope.IsCompleted = false;
    $scope.GotoOrderDetails = GotoOrderDetails;
    function GotoOrderDetails(order) {
        $scope.IsEditOrder = true;
        $scope.PurchaseOrderAddEdit = true;
        if (order.status == 'Completed') {
            $scope.IsCompleted = true;
        }
        else {
            $scope.IsCompleted = false;
        }
    };
    $scope.IsEditInvoice = false;
    $scope.IsVendorContact = true
    $scope.InvoiceDetails = [];
    $scope.CreateNewInvoice = CreateNewInvoice;
    function CreateNewInvoice() {
        $scope.IsEditInvoice = false;
        $rootScope.CreateInvoice = true;
        $scope.IsVendorContact = false;
    };
    $scope.GoToInvoiceDetails = GoToInvoiceDetails;
    function GoToInvoiceDetails(invoice) {
        $(".page-spinner-bar").removeClass("hide");
        if (invoice.invoiceNumber != null && angular.isDefined(invoice.invoiceNumber)) {
            var param = {
                "invoiceNumber": invoice.invoiceNumber
            };

            var getpromise = VendorAssociateClaimDetailsService.getInvoiceDetails(param);
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
    $scope.CreateQuote = function () {
        sessionStorage.setItem("ClaimNumber", $scope.CommonObj.ClaimNumber);
        sessionStorage.setItem("ClaimId", $scope.CommonObj.ClaimId);
        sessionStorage.setItem("ItemNumber", $scope.FiletrLostDamageList[0].claimItem.itemNumber)
        sessionStorage.setItem("ItemId", $scope.FiletrLostDamageList[0].claimItem.id)
        sessionStorage.setItem("Items", JSON.stringify($scope.SelectedPostLostItems))
        sessionStorage.setItem("AssignmentNumber", $scope.CommonObj.AssignmentNumber)
        sessionStorage.setItem("AssignmentId", $scope.CommonObj.AssignmentId)
        sessionStorage.setItem("BackPage", "VendorAssociateClaimDetails");
        sessionStorage.setItem("ClaimDetailsPage", "VendorAssociateClaimDetails");
        sessionStorage.setItem("LineDetailsPage", "VendorAssociateItemDetails");
        $location.url('ViewQuote');
    };
    $scope.GetAssignMentDetails = GetAssignMentDetails;
    function GetAssignMentDetails() {
        $(".page-spinner-bar").removeClass("hide");
        var param =
           {
               "assignmentNumber": $scope.CommonObj.AssignmentNumber
           };
        var GetAssingmentDetails = VendorAssociateClaimDetailsService.GetVendorassignmentDetails(param);
        GetAssingmentDetails.then(function (success) {
            $scope.AssginmentDetails = success.data.data;
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            $(".page-spinner-bar").addClass("hide");
            toastr.remove();
            toastr.error((angular.isDefined(error.data) && angular.isDefined(error.data.errorMessage) ? error.data.errorMessage : AuthHeaderService.genericErrorMessage()), "Error");
        });
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
    $scope.SendClaimToSupervisor = SendClaimToSupervisor;
    function SendClaimToSupervisor() {
        $(".page-spinner-bar").removeClass("hide");
        var param =
           {
               "claimNumber": $scope.CommonObj.ClaimNumber
              
           };
        var SendClaimToSupervisor = VendorAssociateClaimDetailsService.SendClaimForSupervisorReview(param);
        SendClaimToSupervisor.then(function (success) {
            toastr.remove();
            toastr.success(success.data.message, "Confirmation");
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            $(".page-spinner-bar").addClass("hide");
            toastr.remove();
            toastr.error((angular.isDefined(error.data) && angular.isDefined(error.data.errorMessage) ? error.data.errorMessage : AuthHeaderService.genericErrorMessage()), "Error");
        });
    };
    $scope.ShowPurchaseOrdersTab = ShowPurchaseOrdersTab;
    function ShowPurchaseOrdersTab() {
        $scope.ContentTab = 'PurchaseOrders';
        sessionStorage.setItem("isLineItem", false);
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
                    var promis = VendorAssociateClaimDetailsService.deleteMediaFile(param);
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
    };
    $scope.reOpenClaim = reOpenClaim;
    function reOpenClaim() {
        $(".page-spinner-bar").removeClass("hide");
        var param = {
            "claimId": $scope.CommonObj.ClaimId
        }
        var promis = VendorAssociateClaimDetailsService.reOpenClaim(param);
        promis.then(function (success) {
            $location.url('VendorAssociateClaimDetails');
            $(".page-spinner-bar").removeClass("hide");
        }, function (error) {
            toastr.remove()
            toastr.error(error.data.errorMessage, $translate.instant("ErrorHeading"));
            $(".page-spinner-bar").addClass("hide");
        })
    };
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
        var taxRatePromis = VendorAssociateClaimDetailsService.changeTaxRate(params);
        taxRatePromis.then(function (success) {
            $scope.isEditTaxRate = false;
            var param =
        {
            "assignmentNumber": $scope.CommonObj.AssignmentNumber
        };
            var GetAssingmentDetails = VendorAssociateClaimDetailsService.GetVendorassignmentDetails(param);
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
            toastr.error((angular.isDefined(error.data) && angular.isDefined(error.data.errorMessage) ? error.data.errorMessage : AuthHeaderService.genericErrorMessage()), "Error");
          
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
        var GetStates = VendorAssociateClaimDetailsService.getStates(param);
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
            var param = {
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

        var updatePolicyHolder = VendorAssociateClaimDetailsService.updatePolicyHolder(param);
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
            toastr.error((angular.isDefined(error.data) && angular.isDefined(error.data.errorMessage) ? error.data.errorMessage : AuthHeaderService.genericErrorMessage()), "Error");
        });
    }

    $scope.AddNewItemToList = AddNewItemToList;
    function AddNewItemToList() {
        $location.url('AddItem');
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
                    var response = VendorAssociateClaimDetailsService.DeleteLostDamageItem(paramId);
                    response.then(function (success) { //Filter list and remove item   
                        toastr.remove();
                        toastr.success(success.data.message, "Confirmation");
                        GetPostLostItems();
                        $(".page-spinner-bar").addClass("hide");
                    }, function (error) {
                        $(".page-spinner-bar").addClass("hide");
                        toastr.remove();
                        toastr.error((angular.isDefined(error.data) && angular.isDefined(error.data.errorMessage) ? error.data.errorMessage : AuthHeaderService.genericErrorMessage()), "Error");
                    });
                }
            }
        });
    };
});
