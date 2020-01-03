angular.module('MetronicApp').controller('EmailPopupController', function ($rootScope,$filter, AdjusterPropertyClaimDetailsService, $uibModal, $scope, AppraisalService, $translate, $translatePartialLoader, AuthHeaderService) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    //set language 
    $translatePartialLoader.addPart('EmailPopup');
    $translate.refresh();
    $scope.fileName = null;
    $scope.FileType = null;
    $scope.FileExtension = null;
    $scope.files = [];
    //for note attachment

    $scope.Email={};
    $scope.Email.emailList = [
    ];

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
    //$scope.ClaimParticipantsList = objClaim.ParticipantList;    
    $scope.PraticipantIdList = [];

    $scope.Email.emailTo = [];
    //Add note function
    $scope.ok = function (e) {       
        $(".page-spinner-bar").removeClass("hide");
        $scope.Email.appraisalId = sessionStorage.getItem("id");
        angular.forEach($scope.Email.emailList, function (item) {
            
            $scope.Email.emailTo.push(item.text);
            
        });//$scope.Email.emailList

        $scope.Email.role="INSURANCE_AGENT";

        var promis = AppraisalService.EmailAppraisal($scope.Email);
        promis.then(function (success) {
            // After Save / Updated data, send for Artigem Review
            
                toastr.remove();
                toastr.success("Email sent", "Success");
                $(".page-spinner-bar").addClass("hide");
                //$location.path('/InsuranceAgent');
            
        }, function (error) {
            toastr.remove();
            $(".page-spinner-bar").addClass("hide");
            if (error.data.errorMessage != null && angular.isDefined(error.data.errorMessage)) {
                toastr.error(error.data.errorMessage, "Error")
            }
            else {
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error")
            }
        });
        $scope.$close();
            
         
       
    }
    //Cancel
    $scope.cancel = function () {
        $scope.$close();
    };
});