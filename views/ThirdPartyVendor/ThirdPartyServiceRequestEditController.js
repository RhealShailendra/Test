angular.module('MetronicApp').controller('ThirdPartyServiceRequestEditController', function ($rootScope, ThirdPartyServiceRequestEditService, $uibModal, $scope, settings,
    $filter, $window, $location, $translate, $translatePartialLoader) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });

    //set language 
    $translatePartialLoader.addPart('ServiceRequestEdit');
    $translate.refresh();
    $scope.pagesize = $rootScope.settings.pagesize;
    $scope.UploadedFiles = [];
    $scope.SelectedFileNames = [];
    $scope.NoteListForService = [];
    $scope.PraticipantIdList = [];
    $scope.serviceRequestDetails = {};
    //$scope.ClaimNo = sessionStorage.getItem("ThirdPartyClaimNo"),
    //$scope.ClaimId = sessionStorage.getItem("ClaimId");
    $scope.UserId = sessionStorage.getItem("UserId");
    $scope.init = function () {
        $(".page-spinner-bar").removeClass("hide");
        $scope.ServiceRequestId = sessionStorage.getItem("ServiceRequestId");
        if ($scope.ServiceRequestId === null || angular.isUndefined($scope.ServiceRequestId)) {
            sessionStorage.setItem("ServiceRequestId", null);
            $location.url("ThirdPartyClaimDetails");
        }
        else {
            //Get statusList
            var GetStatusList = ThirdPartyServiceRequestEditService.GetStatusList();
            GetStatusList.then(function (success) {
                $scope.StatusList = success.data.data;
            }, function (error) {
                $scope.ErrorMessage = error.errorMessage;
            });

            //Get Service details
            var paramRequestId = { "serviceRequestId": $scope.ServiceRequestId }
            var GetServiceDetails = ThirdPartyServiceRequestEditService.GetServiceDetails(paramRequestId);
            GetServiceDetails.then(function (success) {
                $scope.serviceRequestDetails = success.data.data;
                 getParticipants();
            }, function (error) { });
            //var param = {
            //    "companyId": sessionStorage.getItem("CompanyId")
            //}
            //var NewServiceRequest = ThirdPartyServiceRequestEditService.getCategoriesList(param);
            //NewServiceRequest.then(function (success) {
            //    $scope.ServiceCategoryList = success.data.data;
            //}, function (error) { $scope.ErrorMessage = error.errorMessage });
            //Get Notes
            var Param = {
                "serviceRequestId": $scope.ServiceRequestId
            };
            
            var GetNoteList = ThirdPartyServiceRequestEditService.GetNoteList(Param);
            GetNoteList.then(function (success) {
                $scope.NoteListForService = success.data.data;
                $(".page-spinner-bar").addClass("hide");
            }, function (error) {
                $scope.ErrorMessage = error.data.errorMessage;
                $(".page-spinner-bar").addClass("hide");
            });
        }
      
    }
    $scope.init();

    $scope.AddNote = function (e) {
        var data = new FormData();
        data.append("mediaFilesDetail", JSON.stringify(
            [{ "fileName": $scope.fileName, "fileType": "IMAGE", "extension": $scope.FileExtension, "filePurpose": "NOTE", "latitude": null, "longitude": null }]));
        var NoteUser = [];
        var internal = true;
        var registration = null;
        angular.forEach($scope.PraticipantIdList, function (participant) {
            angular.forEach($scope.ClaimParticipantsList, function (item) {
                if (participant === item.participantId) {
                    if (item.participantType.participantType == 'EXISTING VENDOR') {
                        NoteUser.push({
                            "participantId": participant, "participantType": { "id": item.participantType.id, "participantType": item.participantType.participantType }, "vendorRegistration": angular.isDefined(item) ? item.vendorRegistration : null
                        });
                    }
                    else if (item.participantType.participantType == 'INTERNAL') {
                        NoteUser.push({
                            "participantId": participant, "email": item.email, "participantType": { "id": item.participantType.id, "participantType": item.participantType.participantType },
                            "vendorRegistration": sessionStorage.getItem("CompanyCRN")
                        });
                    }
                    else {
                        NoteUser.push({
                            "participantId": participant, "email": item.email, "participantType": { "id": item.participantType.id, "participantType": item.participantType.participantType }
                        });
                    }
                    if (item.participantType.participantType.toUpperCase() == 'EXTERNAL' || item.participantType.participantType.toUpperCase() == 'POLICY HOLDER' || item.participantType.participantType.toUpperCase() == 'SUPERVISOR' ||
                  item.participantType.participantType.toUpperCase() == 'INTERNAL') {
                        internal = false;
                    }
                    //registration = angular.isDefined(item) ? item.vendorRegistration : null;
                    if (item.participantType.participantType == 'INTERNAL' || item.participantType.participantType.toUpperCase() == 'POLICY HOLDER' || item.participantType.participantType.toUpperCase() == 'SUPERVISOR') {
                        registration = sessionStorage.getItem("CompanyCRN");
                    }
                }
            });
        });
        if (internal == true) {
            registration = sessionStorage.getItem("RegistrationNumber");
        }
         
        data.append("noteDetail", JSON.stringify({
            "claimId": $scope.serviceRequestDetails.claimDetails.id,
            "claimNumber": $scope.serviceRequestDetails.claimDetails.claimNumber,
            "itemUID": null,
            "sender": sessionStorage.getItem("RegistrationNumber"),
            "serviceRequestNumber": $scope.serviceRequestDetails.serviceNumber,
            "isPublicNote": false,
            "message": $scope.CommonObj.ItemNote,
            "isInternal": internal,
            "registrationNumber": registration,
            "groupDetails": {
                "groupId": null,
                "groupTitle": $scope.CommonObj.subject,
                "participants": NoteUser
            }
        }));
         
        data.append("file", $scope.files);
        var getpromise = ThirdPartyServiceRequestEditService.addNoteWithOptionalAttachment(data);
        getpromise.then(function (success) {
            //after adding new note updating note list
            var Param = {
                "serviceRequestId": $scope.serviceRequestDetails.serviceRequestId,
            }
            var GetNoteList = ThirdPartyServiceRequestEditService.GetNoteList(Param);
            GetNoteList.then(function (success1) { $scope.NoteListForService = success1.data.data; }, function (error1) { $scope.ErrorMessage = error1.data.errorMessage; });
            $scope.Status = success.data.status;
            if ($scope.Status == 200) {
                toastr.remove();
                toastr.success(success.data.message, "Confirmation");
                $scope.CommonObj.subject = "";
                $scope.CommonObj.ItemNote = "";
                $scope.PraticipantIdList = [];
                $("#select2insidemodal").empty();
                //cope.CommonObj.claimNote = "";
                $scope.CreateNoteForm.$setUntouched();
                angular.element("input[type='file']").val(null);
                $scope.fileName = '';
                $scope.FileType = '';
                $scope.FileExtension = '';
               
            }
        }, function (error) {

            toastr.remove();
            toastr.error(error.data.errorMessage, "Error"); $scope.ErrorMessage = error.data.errorMessage;
        });
    }

    $scope.GotoAssign = function (item) {
        sessionStorage.setItem("ServiceRequestId", $scope.ServiceRequestId)
        $location.url('ThirdPartyAssignServiceRequest')
    }
    $scope.GotoBack = function () {
        $location.url(sessionStorage.getItem('HomeScreen'))
    }
    $scope.GotoAssign = function (item) {
        sessionStorage.setItem("ServiceRequestId", $scope.ServiceRequestId)
        $location.url('ThirdPartyAssignServiceRequest')
    }
    $scope.GotoDashboard = function () {
        $location.url(sessionStorage.getItem('HomeScreen'));
    }
    
    $scope.SelectFile = function () {
        angular.element('#FileUpload').trigger('click');
    }


    $scope.SelectNoteFile = function () {
        angular.element('#NoteFileUpload').trigger('click');
    };
    //Get note attachment details
    $scope.getNoteFileDetails = function (e) {
       
        $scope.$apply(function () {
            $scope.fileName = e.files[0].name;
            $scope.FileType = e.files[0].type;
            $scope.FileExtension = $scope.fileName.substr($scope.fileName.lastIndexOf('.'));
            $scope.files = (e.files[0]);
            fr = new FileReader();
            fr.readAsDataURL(e.files[0]);
        });
    };

    $scope.AttachmentDetails = []; $scope.FileList = [];
    //getFiles
    $scope.getFileDetails = function (e) {
        $scope.SelectedFileList =" ";
        $scope.$apply(function () {
            var files = event.target.files;
            $scope.UploadedFiles = e.files;
            $scope.SelectedFileNames.push(e.files[0].name);
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                $scope.SelectedFileList+= file.name;
                if (i != files.length - 1)
                {
                    $scope.SelectedFileList += ",";
                }
                var reader = new FileReader();
                $scope.AttachmentDetails.push({
                    "fileName": file.name,
                    "fileType": file.type,
                    "extension": file.name.substr(file.name.lastIndexOf('.')),
                    "filePurpose": "SERVICE_REQUEST",
                    "latitude": null,
                    "longitude": null
                });
                $scope.FileList.push({ "file": file })
                reader.readAsDataURL(file);
            }
        });
    };


    $scope.UpdateServiceRequest = UpdateServiceRequest;
    function UpdateServiceRequest() {
        $(".page-spinner-bar").removeClass("hide");
        var ParamServiceDetails = new FormData();
        ParamServiceDetails.append("serviceRequestDetails", JSON.stringify({
            "serviceNumber": $scope.serviceRequestDetails.serviceNumber,
            "claimNumber": $scope.serviceRequestDetails.claimDetails.claimNumber,
            "description": $scope.serviceRequestDetails.description,
            //"assignDate": $scope.serviceRequestDetails.assignedDate,
            //"dateOfCompletion": $scope.serviceRequestDetails.completionDate,
            "targateDate": $scope.serviceRequestDetails.targetDate,
            "registrationNumber": ($scope.serviceRequestDetails.assignTo.registrationNumber == null) ? sessionStorage.getItem("CompanyCRN") : $scope.serviceRequestDetails.assignTo.registrationNumber,
            "serviceCost": $scope.serviceRequestDetails.serviceCost,
            "assignTo": {
                "vendorId": (($scope.serviceRequestDetails.assignTo!==null && angular.isDefined($scope.serviceRequestDetails.assignTo))?$scope.serviceRequestDetails.assignTo.vendorId:null),
            },
            "serviceCategory": {
                "id": ($scope.serviceRequestDetails.category != null) ? $scope.serviceRequestDetails.category.id : null,
                "name": ($scope.serviceRequestDetails.category != null) ? $scope.serviceRequestDetails.category.name : null,
            },
            "status": {
                "statusId": $scope.serviceRequestDetails.status.statusId
        }
        }));
        if ($scope.FileList.length > 0) {
            angular.forEach($scope.FileList, function (item) {
                ParamServiceDetails.append("file", item.file);
            });
            ParamServiceDetails.append("filesDetails", JSON.stringify($scope.AttachmentDetails));
        }

        var UpdateServiceRequest = ThirdPartyServiceRequestEditService.UpdateServiceRequest(ParamServiceDetails);
        UpdateServiceRequest.then(function (success) {
            $scope.Status = success.data.status;
            if ($scope.Status == 200) {
                $scope.GotoBack();
                toastr.remove();
                toastr.success(success.data.message, "Confirmation");
                $(".page-spinner-bar").addClass("hide");
            };
        }, function (error) {
            toastr.remove();
            toastr.error(error.data.errorMessage, "Error");
            $(".page-spinner-bar").addClass("hide");
        });
    }
    //Reject service request
    $scope.Rejectservicerequest = Rejectservicerequest;
    function Rejectservicerequest() {
        bootbox.confirm({
            title: $translate.instant("AlertMessage.RejectService"),
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
                        "serviceId": $scope.serviceRequestDetails.serviceRequestId,
                        "status": {
                            "statusId": 3
                        }
                    };
                    var Rejectservice = ThirdPartyServiceRequestEditService.RejectServiceRequest(paramReject);
                    Rejectservice.then(function (success) {
                        if (success.data.status === 200) {
                            toastr.remove();
                            toastr.success(success.data.message, "Confirmation");
                            $scope.GotoBack();
                        }
                    }, function (error) {
                        toastr.remove();
                        toastr.error(error.data.errorMessage, "Error");
                    });
                }
            }
        });
    }

    $scope.GoToRaiseInvoice = function () {
        var Info = {
            ClaimNo: $scope.ClaimNo,
            PageName: 'ThirdPartyServiceRequestEdit',
            ServiceRequestId: $scope.serviceRequestDetails.serviceRequestId
        };       
        //sessionStorage.setItem("ClaimDetailsForInvoice", JSON.stringify(Info));
        sessionStorage.setItem("DetailsPageURL","ThirdParty");     
        $location.url('CreateServiceInvoice');
    }

    $scope.getParticipants = getParticipants ;
    function getParticipants() {
        var param = { "claimNumber": $scope.serviceRequestDetails.claimDetails.claimNumber }
        var getpromise = ThirdPartyServiceRequestEditService.getVendorsListAgainstClaim(param);
        getpromise.then(function (success) {
             
            $scope.ClaimParticipantsList = success.data.data;
        }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });
    }

    $scope.RemoveAttachment = RemoveAttachment;
    function RemoveAttachment(file) {
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
                        id: angular.isUndefined(file.id) ? null : file.id

                    }]
                    var promis = ThirdPartyServiceRequestEditService.deleteMediaFile(param);
                    promis.then(function (success) {
                        if (angular.isDefined(file.id)) {
                            //Get Service details
                            var paramRequestId = { "serviceRequestId": $scope.ServiceRequestId }
                            var GetServiceDetails = ThirdPartyServiceRequestEditService.GetServiceDetails(paramRequestId);
                            GetServiceDetails.then(function (success) {
                                $scope.serviceRequestDetails = success.data.data;
                                getParticipants();
                                toastr.remove()
                                toastr.success(success.data.message, $translate.instant("SuccessHeading"));
                            }, function (error) { });

                        }
                      
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
    $scope.DeleteNotes = DeleteNotes;
    function DeleteNotes(item, participants) {
        bootbox.confirm({
            size: "",
            title: "Delete Note",
            message: "Are you sure want to delete the note?", closeButton: false,
            className: "modalcustom", buttons: {
                confirm: {
                    label: "Yes",
                    className: 'btn-success'
                },
                cancel: {
                    label: "No", //$translate.instant('ClaimDetails_Delete.BtnNo'),
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                if (result) {
                    if (angular.isDefined(item.noteUID) && item.noteUID !== null) {
                        $(".page-spinner-bar").removeClass("hide");
                        var registrationNumber = null;
                        angular.forEach(participants, function (participants) {
                            if (participants.crn != null) {
                                registrationNumber = participants.crn;
                            }
                        });
                        var param = {
                            "noteUID": item.noteUID, "registrationNumber": registrationNumber
                        };

                        var promis = ThirdPartyServiceRequestEditService.DeleteNote(param);
                        promis.then(function (success) {
                            var Param = {
                                "serviceRequestId": $scope.ServiceRequestId
                            };
                            var GetNoteList = ThirdPartyServiceRequestEditService.GetNoteList(Param);
                            GetNoteList.then(function (success) {
                                $scope.NoteListForService = success.data.data;
                                $(".page-spinner-bar").addClass("hide");
                            }, function (error) {
                                $scope.ErrorMessage = error.data.errorMessage;
                            });
                            toastr.remove();
                            toastr.success(success.data.message, "Confirmation");
                          
                        },
                        function (error) {
                            toastr.remove();
                            if (error.data.errorMessage != null && angular.isDefined(error.data.errorMessage)) {
                                toastr.error(error.data.errorMessage, "Error")
                            }
                            else {
                                toastr.error(AuthHeaderService.genericErrorMessage(), "Error")
                            }
                            $(".page-spinner-bar").addClass("hide");
                        });

                    };
                }
            }
        });
    };
});