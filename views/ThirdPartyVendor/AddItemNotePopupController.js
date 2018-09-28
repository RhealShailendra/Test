angular.module('MetronicApp').controller('AddItemNotePopupController', function ($rootScope, $filter, AdjusterLineItemDetailsService, $uibModal, $scope, $translate, $translatePartialLoader, objClaim) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    //set language 
    $translatePartialLoader.addPart('AddEvent');
    $translate.refresh();
    //$scope.CommonObj = { "ItemNote": null, "ItemId": objClaim.ItemId, "ClaimId": objClaim.ClaimId };
    $scope.CommonObj = { "claimNote": null, "ClaimId": objClaim.ClaimId, "itemUID": angular.isDefined(objClaim.itemUID) ? objClaim.itemUID : null, "claimNumber": objClaim.ClaimNumber };
    $scope.fileName = null;
    $scope.FileType = null;
    $scope.FileExtension = null;
    $scope.files = [];
    //for note attachment
    $scope.SelectNoteFile = SelectNoteFile;
    function SelectNoteFile() {
        angular.element('#NoteFileUpload').trigger('click');
    }
    $scope.filed;
    $scope.getNoteFileDetails = getNoteFileDetails;
    function getNoteFileDetails(event) {
        var files = event.target.files;
        $scope.filed = event.target.files;
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var reader = new FileReader();
            reader.file = file;
            reader.fileName = files[i].name;
            reader.fileType = files[i].type;
            reader.fileExtension = files[i].name.substr(files[i].name.lastIndexOf('.'));
            reader.onload = $scope.imageIsLoaded;
            reader.readAsDataURL(file);
        }
    }
    $scope.imageIsLoaded = function (e) {
        $scope.$apply(function () {
            $scope.files.push({ "FileName": e.target.fileName, "FileExtension": e.target.fileExtension, "FileType": e.target.fileType, "Image": e.target.result, "File": e.target.file })
        });
    }
    $scope.RemoveImage = RemoveImage;
    function RemoveImage(item) {
        var index = $scope.files.indexOf(item);
        if (index > -1) {
            $scope.files.splice(index, 1);
        }
    }
    $scope.ClaimParticipantsList = objClaim.ParticipantList;
    $scope.PraticipantIdList = [];

    $scope.ok = function (e) {
        var data = new FormData();
        if ($scope.files.length > 0) {
            var FileDetails = [];
            angular.forEach($scope.files, function (item) {
                FileDetails.push({
                    "fileName": item.FileName, "fileType": item.FileType,
                    "extension": item.FileExtension,
                    "filePurpose": "NOTE", "latitude": null, "longitude": null
                });
                data.append("file", item.File);
            });
            data.append("mediaFilesDetail", JSON.stringify(FileDetails));
        }
        else {
            data.append("mediaFilesDetail", null);
            data.append("file", null);
        }
        var NoteUser = [];
        var internal = true;
        var registration = null;
        if ($scope.PraticipantIdList.length > 0) {
            angular.forEach($scope.PraticipantIdList, function (participant) {
                angular.forEach($scope.ClaimParticipantsList, function (item) {
                    if (participant === item.participantId) {
                        if (item.participantType.participantType == 'EXISTING VENDOR') {
                            NoteUser.push({
                                "participantId": participant, "participantType": { "id": item.participantType.id, "participantType": item.participantType.participantType }, "vendorRegistration": angular.isDefined(item) ? item.vendorRegistration : null
                            });
                        }
                        else {
                            NoteUser.push({
                                "participantId": participant, "email": item.email, "participantType": { "id": item.participantType.id, "participantType": item.participantType.participantType }
                            });
                        }


                        if (item.participantType.participantType == 'EXTERNAL' || item.participantType.participantType == 'POLICY HOLDER' || item.participantType.participantType == 'SUPERVISOR' ||
                      item.participantType.participantType == 'INTERNAL') {
                            internal = false;
                        }
                        //registration = angular.isDefined(item) ? item.vendorRegistration : null;
                        if (item.participantType.participantType == 'INTERNAL' || item.participantType.participantType == 'POLICY HOLDER' || item.participantType.participantType == 'SUPERVISOR') {
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
                "isInternal": internal,
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
                "itemUID": angular.isDefined($scope.CommonObj.itemUID) ? $scope.CommonObj.itemUID : null,
                "sender": sessionStorage.getItem("RegistrationNumber"),
                "serviceId": null,
                "isPublicNote": true,
                "message": $scope.CommonObj.claimNote,
                "isInternal": false,  // if we want add note internally then it will be true otherwise false
                "registrationNumber": null, // if we are adding note from company to vendor then it will be vendor registration number or vice versa
                "groupDetails": null
            }));
        }
        var getpromise = AdjusterLineItemDetailsService.addClaimNoteWithParticipant(data);
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
            $scope.ErrorMessage = error.data.errorMessage;
        });
    }
    //Cancel
    $scope.cancel = function () {
        $scope.$close();
    };
});