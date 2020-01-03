angular.module('MetronicApp').controller('AddNotePopupController', function ($rootScope,$filter, VendorAssociateClaimDetailsService, $uibModal, $scope, $translate, $translatePartialLoader, objClaim) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });

    //set language 
    $translatePartialLoader.addPart('AdjusterPropertyClaimDetails');
    $translate.refresh();
    $scope.CommonObj = { "claimNote": null, "ClaimId": objClaim.claimId, "claimNumber": objClaim.ClaimNumber, "itemUID": angular.isDefined(objClaim.itemUID) ? objClaim.itemUID : null };


    $scope.fileName = null;
    $scope.FileType = null;
    $scope.FileExtension = null;
    $scope.files = [];
    //for note attachment
    $scope.SelectNoteFile = SelectNoteFile;
    function SelectNoteFile() {
        angular.element('#NoteFileUpload').trigger('click');
    }

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

    //clear  attachments
    $scope.ClearAttachments = function () {
        $scope.fileName = null;
        $scope.FileType = null;
        $scope.FileExtension = null;
        $scope.files = [];
        angular.element("input[type='file']").val(null);
    }
    //clear  attachments
    $scope.ChangeAttachments = function () {
        $scope.fileName = null;
        $scope.FileType = null;
        $scope.FileExtension = null;
        $scope.files = [];
        angular.element("input[type='file']").val(null);
        $scope.SelectNoteFile();
    }

    $scope.ClaimParticipantsList = objClaim.ParticipantList;
    // search function to match full text 
    $scope.localSearch = function (str) {

        var matches = [];
        $scope.ClaimParticipantsList.forEach(function (person) {

            var fullName = ((person.firstName === null) ? "" : person.firstName.toLowerCase()) + ' ' + ((person.lastName === null) ? "" : person.lastName.toLowerCase());


            if (fullName.indexOf(str.toString().toLowerCase()) >= 0) {
                matches.push(person);
            }
        });
        return matches;
    };

    //Add note participant  
    //Add note participant  
    $scope.participantsForNote = [];
    $scope.CommonObject = { "SeletedId": null };
    //After select particiapnt
    $scope.afterSelectedParticipant = function () {
        var list = [];
        list = $filter('filter')($scope.ClaimParticipantsList, { participantId: $scope.CommonObject.SeletedId });

        if (list !== null) {
            var seleted = [];
            seleted = $filter('filter')($scope.participantsForNote, { ParticipantId: $scope.CommonObject.SeletedId });
            if (seleted.length == 0 || angular.isUndefined(seleted)) {
                $scope.participantsForNote.push({
                    "ParticipantId": list[0].participantId,
                    "ParticipantName": list[0].firstName + " " + ((list[0].lastName !== null) ? list[0].lastName : ''),
                    "designation": list[0].designation,
                    "participantType": list[0].participantType
                });
            }
        }

    };
    //Add note function
    $scope.ok = function (e) {
        var data = new FormData();
        if ($scope.files.length > 0) {
            data.append("mediaFilesDetail", JSON.stringify([{ "fileName": $scope.fileName, "fileType": $scope.FileType, "extension": $scope.FileExtension, "filePurpose": "NOTE", "latitude": null, "longitude": null }]))

        }
        else {
            data.append("mediaFilesDetail", null)
        }

        if ($scope.files.length > 0) {
            data.append("file", $scope.files[0]);
        }
        else {
            data.append("file", null);
        }

        //check wheatger participant exist or not
        if ($scope.PraticipantIdList.length > 0) {
            angular.forEach($scope.PraticipantIdList, function (participant) {
                angular.forEach($scope.ClaimParticipantsList, function (item) {
                    if (participant === item.participantId) {
                        if (item.participantType.participantType == 'EXISTING VENDOR') {
                            NoteUser.push({
                                "participantId": participant, "participantType": { "id": item.participantType.id, "participantType": item.participantType.participantType }, "vendorRegistration": angular.isDefined(item) ? item.vendorRegistration : null
                            });
                        }
                        else if(item.participantType.participantType == 'INTERNAL')
                        {
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
            data.append("noteDetail", JSON.stringify({
                "claimId": $scope.CommonObj.ClaimId.toString(),
                "claimNumber": $scope.CommonObj.claimNumber.toString(),
                "itemUID": angular.isDefined($scope.CommonObj.itemUID) ? $scope.CommonObj.itemUID : null,
                "sender": sessionStorage.getItem("RegistrationNumber"),
                "serviceRequestNumber": null,
                "isPublicNote": false,
                "message": $scope.CommonObj.claimNote,
                "internal": internal,
                "registrationNumber": registration,
                "groupDetails": {
                    "groupId": null,
                    "groupTitle": $scope.CommonObj.subject,
                    "participants": NoteUser
                }
            }));
        }
        else {
            data.append("noteDetail", JSON.stringify({
                "claimId": $scope.CommonObj.ClaimId.toString(),
                "claimNumber": $scope.CommonObj.claimNumber.toString(),
                "itemUID": angular.isDefined($scope.CommonObj.itemId) ? $scope.CommonObj.itemId : null,
                "sender": sessionStorage.getItem("RegistrationNumber"),
                "serviceId": null,
                "isPublicNote": true,
                "message": $scope.CommonObj.claimNote,
                "internal": false,  // if we want add note internally then it will be true otherwise false
                "registrationNumber": null, // if we are adding note from company to vendor then it will be vendor registration number or vice versa
                "groupDetails": null
            }));
        }
            var getpromise = VendorAssociateClaimDetailsService.addClaimNoteWithParticipant(data);//API#231
            getpromise.then(function (success) {
                $scope.Status = success.data.status;
                if ($scope.Status == 200) {
                    $scope.$close("Success");
                    toastr.remove();
                    toastr.success(success.data.message, "Confirmation");
                }
            }, function (error) {
                toastr.remove();
                toastr.error(error.data.errorMessage, "Error");
            });
        }
    //Cancel
    $scope.cancel = function () {
        $scope.$close();
    };
});