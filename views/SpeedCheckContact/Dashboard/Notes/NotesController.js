angular.module('MetronicApp').controller('NotesController', function ($rootScope, $scope, $location, $translate, $translatePartialLoader,$uibModal, $filter, AdjusterPropertyClaimDetailsService, AdjusterLineItemDetailsService) {
    //set language
    $translatePartialLoader.addPart('AllNotes');
    $translate.refresh();

    $scope.Notes = [];
    $scope.NoteDetails;
    $scope.NoteIndex;
    $scope.ItemDetails = {};
    $scope.ClaimParticipantsList = [];
    $scope.ParticipantName = "";

    $scope.UserType = sessionStorage.getItem('RoleList');
    sessionStorage.setItem("comparableReport",false);

    function init() {
        $scope.CommonObj = {
            ClaimNumber: "Claim06062018",
            ClaimId: 3,
            ItemId: "217"
        };   
        //GetNotes();                              
    }
    init();
    // claim071070  Claim06062018
    //get item details on itemId
    
    /*var param = {
        "itemId": $scope.CommonObj.ItemId
    };
    var getItemDetailsOnId = AdjusterLineItemDetailsService.gteItemDetails(param);
    getItemDetailsOnId.then(function (success) {       
        $scope.ItemDetails = success.data.data;
    }, function (error) {
        toastr.remove();
        toastr.error(error.data.errorMessage, "Error");
    });*/

    //Get Note    
    function GetNotes() {
        $(".page-spinner-bar").removeClass("hide");
        var param = {
            "itemId": $scope.CommonObj.ItemId
        };
        var getpromise = AdjusterLineItemDetailsService.getItemNotes(param);
        getpromise.then(function (success) {
            //$scope.Notes = success.data.data;
            //console.log(success.data.data);
            $scope.Notes = $filter('orderBy')(success.data.data, 'createDate', true);
            if ($scope.Notes!==null && $scope.Notes.length > 0) {
                $scope.NoteDetails = $scope.Notes[0];
                $scope.NoteIndex = 0;
            }
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            $scope.ErrorMessage = error.data.errorMessage;
            $(".page-spinner-bar").addClass("hide");
        });
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
    
    // get active vendors against apprasial for autocomplete textbox
    var paramclaimNo = { "claimNumber": $scope.CommonObj.ClaimNumber };
    var getpromise = AdjusterLineItemDetailsService.getVendorsListAgainstClaim(paramclaimNo);
    getpromise.then(function (success) {
        $scope.ClaimParticipantsList = success.data.data;
        angular.forEach($scope.ClaimParticipantsList, function (participant) {
            if (participant.firstName == null) {
                participant.firstName = " ";
            }
            if (participant.lastName == null) {
                participant.lastName = " ";
            }
        });
    }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });

    $scope.PraticipantIdList = [];
    
    var NoteUser = [];
    var internal = true;
    var registration = null;
    if ($scope.PraticipantIdList.length > 0) {
        angular.forEach($scope.PraticipantIdList, function (participant) {
            angular.forEach($scope.ClaimParticipantsList, function (item) {
                if (participant === item.participantId) {
                    if (item.participantType.participantType == 'VENDOR ASSOCIATE') {

                        angular.forEach($scope.ClaimParticipantsList, function (participant) {

                            if (participant.participantType.participantType == 'EXISTING VENDOR') {
                                registration = angular.isDefined(participant) ? participant.vendorRegistration : null;
                            }
                                
                        });
                    }

                    if (item.participantType.participantType == 'EXISTING VENDOR') {
                        NoteUser.push({
                            "participantId": participant, "participantType": { "id": item.participantType.id, "participantType": item.participantType.participantType }, "vendorRegistration": angular.isDefined(item) ? item.vendorRegistration : null
                        });
                        registration = angular.isDefined(item) ? item.vendorRegistration : null;
                    }
                    else {
                        NoteUser.push({
                            "participantId": participant, "email": item.emailId, "participantType": { "id": item.participantType.id, "participantType": item.participantType.participantType }
                        });
                    }
                    if (item.participantType.participantType.toUpperCase() == 'EXTERNAL' || item.participantType.participantType.toUpperCase() == 'EXISTING VENDOR' || item.participantType.participantType.toUpperCase() == 'NEW VENDOR' ||
                        item.participantType.participantType.toUpperCase() == 'VENDOR ASSOCIATE') {
                        internal = false;
                    }

                }
            });
        });

    }


    //New Note
    $scope.AddNotePopup = AddNotePopup;
    function AddNotePopup(ev) {
        var obj = {
            "ClaimId": $scope.CommonObj.ClaimId,
            "ClaimNumber": $scope.CommonObj.ClaimNumber,
            "ItemId": $scope.CommonObj.ItemId,
            "ItemUID": $scope.ItemDetails.itemUID,
            "ParticipantList": $scope.ClaimParticipantsList

        };
        $scope.animationsEnabled = true;
        var out = $uibModal.open(
        {
            animation: $scope.animationsEnabled,
            templateUrl: "views/InsuranceAgent/Notes/AddNotePopup.html",
            controller: "AddItemNotePopupController",
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

    $scope.ReplyToNote = function (e) {
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
            data.append("mediaFilesDetail", JSON.stringify(null));
            data.append("file", JSON.stringify(null));
        }
       /*
        data.append("groupDetails", JSON.stringify({
            //"groupId": $scope.NoteDetails.groupId,
            //"addedBy": "VENDOR",
            "message": $scope.claimNote
            }));
        */

       /* Reply Note Data*/
       /*console.log("Reply Note Request Data: ");
       console.log("ItemUID: "+ $scope.ItemDetails.itemUID);
       console.log("isPublicNote: "+ false);
       console.log("registrationNumber: "+ registration);    
       console.log("sender: "+ sessionStorage.getItem("CRN") );
       console.log("isInternal: "+ internal);       
       console.log("groupDetails:");
       console.log("groupId: "+ $scope.NoteDetails.groupId);
       console.log("groupNumber: "+$scope.NoteDetails.groupNumber);
       console.log("groupTitle:" + $scope.NoteDetails.groupTitle);
       console.log("createDate:" + $scope.NoteDetails.createDate); 
       console.log("noteParticipants: ");
       console.log($scope.ClaimParticipantsList);*/
       
       data.append("groupDetails", JSON.stringify(
            {
                "itemUID": $scope.ItemDetails.itemUID,
                "isPublicNote": false,
                "registrationNumber": registration,
                "sender": sessionStorage.getItem("CRN"),
                "isInternal": internal,
                //"claimNumber": $scope.CommonObj.ClaimNumber,
                //"claimId": $scope.CommonObj.ClaimId,
                "message": $scope.claimNote,
                "groupDetails":{ 
                                "groupId": $scope.NoteDetails.groupId,
                                "groupNumber": $scope.NoteDetails.groupNumber,
                                "groupTitle": $scope.NoteDetails.groupTitle,
                                "createDate": $scope.NoteDetails.createDate,
                                "noteParticipants": NoteUser
                               }
            }
        ))

        var getpromise = AdjusterPropertyClaimDetailsService.ReplyClaimNote(data);
        getpromise.then(function (success) {
            $scope.Status = success.data.status;
            if ($scope.Status == 200) {
                //$scope.$close("Success");
                toastr.remove();
                toastr.success(success.data.message, "Confirmation");
            }
        }, function (error) {
            toastr.remove();
            toastr.error(error.data.errorMessage, "Error");
            $scope.ErrorMessage = error.data.errorMessage;
        });
    }

    $scope.DeletNote = DeletNote;
    function DeletNote()
    {
        // Yet to TODO
    }

});