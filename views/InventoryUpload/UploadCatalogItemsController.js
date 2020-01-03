angular.module('MetronicApp').controller('UploadCatalogItemController', function ($translate, $window, $timeout, $interval, $translatePartialLoader, $rootScope, $log, $scope,
    settings, UploadCatalogItemService, $filter) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    $scope.fileControl;
    $translatePartialLoader.addPart('UploadCatalogItems');
    $translate.refresh();
    $scope.ErrorMessage = "";
    $scope.FileDetails = {
        FileName: null,
        FileType: null,
        FileExtension: null,
        Files: []
    };
    $scope.showProgress = true;
    $scope.stepScreen = false;
    $scope.VerifyScreen = false;
    //$scope.StatusScreen = false;
    $scope.FinishScreen = false;
    $scope.uploader = {
        "progress": 5
    }
    $scope.UploadedFile = [];
    var type = "success";
    $scope.Itemlist = [];
    $scope.isError = true;
    $scope.init = init;
    function init() {
        $scope.ClaimNumber = 123;//sessionStorage.getItem("UploadClaimNo");
        if (angular.isDefined($scope.ClaimNumber) && $scope.ClaimNumber !== null) {
            $scope.stepScreen = true;
            $scope.VerifyScreen = false;
            //$scope.StatusScreen = false;
            $scope.FinishScreen = false;
        }
        else
            $window.history.back();
    }
    $scope.init();

    //Upload file form here
    $scope.StartUpload = StartUpload;
    function StartUpload() {
        //Hide show div
        $scope.stepScreen = false;
        $scope.VerifyScreen = true
        //$scope.StatusScreen = false;
        $scope.FinishScreen = false;

        $scope.Itemlist = [];

        //show progress bar
        $scope.showProgress = true;
        $scope.uploader = { "progress": 20 }
        $scope.timer = $interval(function () {
            if (parseInt($scope.uploader.progress) < 90) {
                $scope.uploader.progress = parseInt($scope.uploader.progress) + 10;
            }
        }, 600);

        //var data = new FormData();
        //data.append("file", $scope.FileDetails.Files[0]);
        //var UploadFile = UploadItemsFromCSVService.UploadItemExcelFile(data);
        //UploadFile.then(function (success) {
        //    $scope.uploader.progress = 100;
        //    $interval.cancel($scope.timer);
        //    HideProgressBar();
        //    $scope.stepScreen = false;
        //    $scope.VerifyScreen = true
        //    $scope.StatusScreen = false;
        //    $scope.FinishScreen = false;
        //    $scope.Itemlist = success.data.data;
        //},
        //    function (error) {
        //        toastr.remove();
        //        toastr.error(error.data.errorMessage, "Error");
        //        $scope.ErrorMessage = error.data.errorMessage;
        //    });
        $scope.stepScreen = false;
        $scope.VerifyScreen = true
        $scope.StatusScreen = false;
        $scope.FinishScreen = false;
    }

    //Cancel verify 
    $scope.CancelVerify = CancelVerify;
    function CancelVerify() {
        $scope.stepScreen = true;
        $scope.VerifyScreen = false
        $scope.StatusScreen = false;
        $scope.FinishScreen = false;
        CancelFileUpload();
    }

    //Grid display of items
    $scope.Verify = Verify;
    function Verify() {
        $scope.showProgress = true;
        $scope.stepScreen = false
        $scope.VerifyScreen = false
        //$scope.StatusScreen = true;
        $scope.FinishScreen = true;
        $scope.uploader = { "progress": 20 }
        $scope.timer = $interval(function () {
            if (parseInt($scope.uploader.progress) < 80) {
                $scope.uploader.progress = parseInt($scope.uploader.progress) + 10;
            }
        }, 600);

        //Call API to upload item list
        //var postlossItems = angular.copy($scope.Itemlist);
        //angular.forEach(postlossItems, function (item) {
        //    item.claimNumber = $scope.ClaimNumber
        //});
        //var paramList = {
        //    "claimNumber": $scope.ClaimNumber,
        //    "postlossItems": postlossItems
        //};
        //var UploadItem = UploadItemsFromCSVService.UploadItemList(paramList);
        //UploadItem.then(function (success) {
        //    StopProgressBarShowFinal();
        //    HideProgressBar();
        //    $scope.RowCount = success.data.data.rowProcessed;
        //    $scope.newRecoredInsertedCount = success.data.data.newCreated;
        //    $scope.UpdateCount = success.data.data.updated;
        //    $scope.FialedItem = success.data.data.failedRecordsItems;
        //}, function (error) {
        //    StopProgressBarShowFinal();
        //    HideProgressBar();
        //    if (angular.isDefined(error.data)) {
        //        toastr.remove();
        //        toastr.error(error.data.errorMessage, "Error");
        //        $scope.RowCount = 0;
        //        $scope.newRecoredInsertedCount = 0;
        //        $scope.UpdateCount = 0;
        //        $scope.FialedItem = 0;
        //    } else {
        //        toastr.remove();
        //        toastr.error(error.data.errorMessage, "Error");
        //        $scope.RowCount = 0;
        //        $scope.newRecoredInsertedCount = 0;
        //        $scope.UpdateCount = 0;
        //        $scope.FialedItem = 0;
        //    }
        //});
        StopProgressBarShowFinal();
           HideProgressBar();

    }
    function StopProgressBarShowFinal() {
        $interval.cancel($scope.timer);
        $scope.uploader.progress = 100;
        $scope.stepScreen = false;
        $scope.VerifyScreen = false
        //$scope.StatusScreen = false;
        $scope.FinishScreen = true;
    }

    function HideProgressBar() {
        $timeout(function () { $scope.showProgress = false; }, 700);

    }
    //Last step of file upload
    $scope.Done = Done;
    function Done() {
        toastr.remove();
        $scope.stepScreen = true;
        $scope.VerifyScreen = false
        //$scope.StatusScreen = false;
        $scope.FinishScreen = false;
        CancelFileUpload();
    }

    //Sorting for table   
    $scope.reverse = true
    $scope.sort = function (colname) {
        $scope.reverse = !($scope.reverse);
        $scope.Itemlist = $filter('orderBy')($scope.Itemlist, colname, $scope.reverse)
    }

    //trigger fileupload
    $scope.FileUploadEvent = FileUploadEvent;
    function FileUploadEvent() {
        $scope.Itemlist = [];
        angular.element('#FileUpload').trigger('click');
    }
    //Get attached file details
    $scope.FileSupported = [".xls", ".xlsx", ".csv"];
    $scope.getFileDetails = function (e) {
        $scope.$apply(function () {
            $scope.ErrorMessage = "";
            $scope.isError = true;
            $scope.FileDetails.FileName = e.files[0].name;
            $scope.FileDetails.FileType = e.files[0].type;
            $scope.FileDetails.FileExtension = $scope.FileDetails.FileName.substr($scope.FileDetails.FileName.lastIndexOf('.'));
            $scope.FileDetails.Files.push(e.files[0]);
            fr = new FileReader();
            //fr.onload = receivedText;
            fr.readAsDataURL(e.files[0]);
            if ($scope.FileSupported.indexOf(($scope.FileDetails.FileExtension).toLowerCase()) === -1) {
                $scope.isError = true;
                $scope.FileDetails = {
                    FileName: null,
                    FileType: null,
                    FileExtension: null,
                    Files: []
                };
                fr = null;
                toastr.remove();
                toastr.warning("Please select xls, xlsx Or csv file..", "File type");
                //$scope.ErrorMessage = "Please select xls, xlsx Or csv file.."
            }
            else {
                $scope.isError = false;
            }
        });
    };
    //Reomve file details from object
    function CancelFileUpload() {
        $scope.FileDetails = {
            FileName: null,
            FileType: null,
            FileExtension: null,
            Files: []
        };
    }
    //Go to claim details page form wher it redirect to this page
    $scope.GoBack = function () {
        
        $scope.FileDetails = {
            FileName: null,
            FileType: null,
            FileExtension: null,
            Files: []
        };
        $window.history.back();
    }
});
