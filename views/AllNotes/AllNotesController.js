angular.module('MetronicApp').controller('AllNotesController', function ($rootScope, $scope, $location, $translate, $translatePartialLoader,AuthHeaderService,
    $uibModal, $filter, AllNotesService,AdjusterPropertyClaimDetailsService) {
    //set language
    $translatePartialLoader.addPart('AllNotes');
    $translate.refresh();
    $scope.sortNotereverse = true;
    $scope.sortNote = 'createDate';
    $scope.UserId = sessionStorage.getItem("UserId");
    $scope.RoleList = sessionStorage.getItem("RoleList");
    function init() {
        $scope.CommonObj = {
            "ClaimNumber": sessionStorage.getItem("AllNoteClaimNumber"),
            "ClaimId": sessionStorage.getItem("AllNoteClaimId")         
        };       
        if (($scope.CommonObj.ClaimId !== null && angular.isDefined($scope.CommonObj.ClaimId)) && ($scope.CommonObj.ClaimNumber !== null && angular.isDefined($scope.CommonObj.ClaimNumber))) {
            GetNotes();
        } else {
            $scope.GoBack();
        }
    }
    init();
    //Get Note
    function GetNotes()
    {
        $(".page-spinner-bar").removeClass("hide");
        $scope.NoteList = [];
        var param = {
            "claimId": $scope.CommonObj.ClaimId
        };
        var GetNotes = AdjusterPropertyClaimDetailsService.getClaimNotes(param);
        GetNotes.then(function (success) {
            $scope.NoteList = $filter('orderBy')(success.data.data, 'createDate',true);
            if($scope.NoteList.length>0)
            {
                $scope.NoteDetails = $scope.NoteList[0];
                $scope.NoteIndex = 0;
            }
            $(".page-spinner-bar").addClass("hide");
        }, function (error) { $(".page-spinner-bar").addClass("hide"); });
    }
    $scope.GoBack=GoBack;
    function GoBack()
    {
        sessionStorage.setItem("AllNoteClaimId", null);
        sessionStorage.setItem("AllNoteClaimNumber", null);
        window.history.back();
    }
    $scope.NoteDetails;
    //Get note Details
    $scope.GetNoteDetails = GetNoteDetails;
    function GetNoteDetails(item,ind)
    {
       $scope.NoteIndex = ind;
       // var FilterNoteList=[];
       // FilterNoteList = $filter('filter')($scope.NoteList, { messageId: item.messageId });
        // if (FilterNoteList.length > 0)\
        
            $scope.NoteDetails = item;
    }
    $scope.ClaimParticipantsList = [];
    var param = { "claimNumber": $scope.CommonObj.ClaimNumber }
    var getpromise = AdjusterPropertyClaimDetailsService.getVendorsListAgainstClaim(param);
    getpromise.then(function (success) { $scope.ClaimParticipantsList = success.data.data; }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });

    //New Note
    $scope.AddNotePopup = AddNotePopup;
    function AddNotePopup(ev) {
        var obj = {
            "claimId": $scope.CommonObj.ClaimId,
            "ParticipantList": $scope.ClaimParticipantsList

        };
        $scope.animationsEnabled = true;
        var out = $uibModal.open(
        {
            animation: $scope.animationsEnabled,
            templateUrl: "views/ThirdPartyVendor/AddNotePopup.html",
            controller: "AddNotePopupController",
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
                GetNotes();
            }

        }, function (res) {
            //Call Back Function close
        });
        return {
            open: open
        };

    };
    $scope.GoToHome=function()
    {
        $location.url(sessionStorage.getItem("HomeScreen"));
    }
    

   
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
    $scope.ReplyToNote = function (NoteDetails) {
        $(".page-spinner-bar").removeClass("hide");
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
        var registrationNumber="";
        angular.forEach(NoteDetails.participants, function (participants) {
            if (participants.crn != null)
            {
                registrationNumber = participants.crn;
            }
        });
        data.append("noteDetail", JSON.stringify(
             {
                 "isPublicNote": NoteDetails.isPublicNote,
                 "registrationNumber": registrationNumber,
                 "sender": sessionStorage.getItem("RegistrationNumber"),
                 "isInternal": angular.isDefined(registrationNumber) && registrationNumber!=""?false:true,
                 "claimNumber": $scope.CommonObj.ClaimNumber,
                 "itemUID" : null,            // if it is item level note
                 "serviceRequestNumber" : null, 
                 "message": $scope.claimNote,
                 "groupDetails":
                 { "groupId": NoteDetails.groupId, "groupNumber": NoteDetails.groupNumber }
             }))

        var getpromise = AdjusterPropertyClaimDetailsService.ReplyClaimNote(data);
        getpromise.then(function (success) {
            $scope.Status = success.data.status;
            if ($scope.Status == 200) {
                toastr.remove();
                toastr.success(success.data.message, "Confirmation");
                GetNotes();
                $scope.claimNote = "";
                $scope.files = [];
                $scope.ReplyNoteForm.$setUntouched();
            }
        }, function (error) {
            toastr.remove();
            toastr.error(error.data.errorMessage, "Error");
            $scope.ErrorMessage = error.data.errorMessage;
            $(".page-spinner-bar").removeClass("hide");
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
                       
                        var promis = AllNotesService.DeleteNote(param);
                        promis.then(function (success) {
                            $(".page-spinner-bar").addClass("hide");
                            GetNotes();
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