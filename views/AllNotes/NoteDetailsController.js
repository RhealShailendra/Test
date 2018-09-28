angular.module('MetronicApp').controller('NoteDetailsController', function ($rootScope, $scope,$uibModal,$translate,
    $translatePartialLoader, AllNotesService, NoteObj, AuthHeaderService) {
    
    $translatePartialLoader.addPart('AllNotes');
    $translate.refresh();

    $scope.NoteDetails = NoteObj.Note;   
    //Cancel / close popup
    $scope.cancel = function () {
        $scope.$close();
    };

    $scope.UserId = sessionStorage.getItem("UserId");
    $scope.RoleList = sessionStorage.getItem("RoleList");
    $scope.DeleteNotes = DeleteNotes;
    function DeleteNotes(item,participantList) {

        var registrationNumber =null;
        angular.forEach(participantList, function (participants) {
            if (participants.crn != null) {
                registrationNumber = participants.crn;
            }
        });
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
                        var param = {
                            "noteUID": item.noteUID, "registrationNumber": registrationNumber
                        };                      
                        var promis = AllNotesService.DeleteNote(param);
                        promis.then(function (success) {                            
                            $scope.$close();                         
                            $(".page-spinner-bar").addClass("hide");
                            toastr.remove();
                            toastr.success(success.data.message, "Confirmation");
                        },
                        function (error) {
                            $(".page-spinner-bar").addClass("hide");
                            toastr.remove();
                            toastr.error((angular.isDefined(error.data) && angular.isDefined(error.data.errorMessage) ? error.data.errorMessage : AuthHeaderService.genericErrorMessage()), "Error");
                        });

                    };
                }
            }
        });
    };
});