angular.module('MetronicApp').controller('ReportController', function ($rootScope, $scope,  $location, $translate, $translatePartialLoader, ReportService,AuthHeaderService) {
    //set language
    $translatePartialLoader.addPart('Report');
    $translate.refresh();
    $scope.pagesize = $rootScope.settings.pagesize;
    //Serch models

    $scope.ReportDetails;
    $scope.PaymentSummary;
    $scope.ItemsReplacedOrPaid;
    $scope.ItemsAboveLimit;
    $scope.TotalAmountPaid = 0;
    $scope.TotalReplacementCost = 0;
    $scope.TotalDepreciationAmount = 0;
    $scope.TotalActualCashValue=0
    $scope.Category = [];
    $scope.ErrorMesage = "";
   
    $scope.CurrentTab = 'ItemSummary';
    function init() {
        $scope.CommomObj = {
            ClaimNo:sessionStorage.getItem("ClaimNo")
        };
         
        if ($scope.CommomObj.ClaimNo !== null && angular.isDefined($scope.CommomObj.ClaimNo)) {
            var param = {
                "claimNumber": $scope.CommomObj.ClaimNo
            };
            var getDetails = ReportService.GetDetails(param);
            getDetails.then(function (success) {
                $scope.ReportDetails = success.data.data;
                
                GetAllTotal();
            }, function (error) {
                toastr.remove();
                toastr.error(error.data.errorMessage, "Error");
            });

            var GetPaymentSummary = ReportService.GetPaymentSummary(param);
            GetPaymentSummary.then(function (success) {

                $scope.PaymentSummary = success.data.data;
                GetTotalPaidAmount();
            }, function (error) {
                toastr.remove();
                toastr.error(error.data.errorMessage, "Error");
            });

            var GetPaidOrReplacedItems = ReportService.GetItemsReplacedOrPaid(param);
            GetPaidOrReplacedItems.then(function (success) {
                $scope.ItemsReplacedOrPaid = success.data.data;
            }, function (error) {
                toastr.remove();
                toastr.error(error.data.errorMessage, "Error");
            });

            var GetAboveLimitItems = ReportService.GetAboveLimitItems(param);
            GetAboveLimitItems.then(function (success) {
                $scope.ItemsAboveLimit = success.data.data;
            }, function (error) {
                toastr.remove();
                toastr.error(error.data.errorMessage, "Error");
            });
        }
        else
        {
            Back();
        }
           
    };

    init();
    //GoBack
    $scope.Back = Back;
    function Back() {
        sessionStorage.setItem("ReportClaimNo", null);
        window.history.back();
    };
    //Go to Home
    $scope.GoToHome = function () {
        $location.url(sessionStorage.getItem('HomeScreen'));
    };

    function GetTotalPaidAmount() {
        $scope.TotalAmountPaid = 0;
        angular.forEach($scope.PaymentSummary.paymentSummaryDetails, function (item) {
            $scope.TotalAmountPaid += item.amountPaid;
        });

    };

    function GetAllTotal()
    {
        $scope.TotalReplacementCost = 0;
        $scope.TotalDepreciationAmount = 0;
        $scope.TotalActualCashValue = 0;

        angular.forEach($scope.ReportDetails.claimItemsDetails, function (item) {
           
            $scope.TotalReplacementCost += item.replacementCost;
            $scope.TotalDepreciationAmount += item.depreciationAmount;
            $scope.TotalActualCashValue += item.actualCashValue;
        });
    }

    // Get PDF of item
    $scope.ExportItemDetails = ExportItemDetails;
    function ExportItemDetails()
    {
        var ClaimDetails = {
            "claimNumber": $scope.CommomObj.ClaimNo
        };       
        var pdfDetails = ReportService.GetRepotItemPDF(ClaimDetails);
        pdfDetails.then(function (success) {         
            if (success.data.data !== null && angular.isDefined(success.data.data)) {
                if (success.data.data.pathUrl !== null && angular.isDefined(success.data.data.pathUrl)) {
                    var PdfUrl = AuthHeaderService.getExportUrl() + success.data.data.pathUrl;                
                    var downloadLink = angular.element('<a></a>');
                    downloadLink.attr('href', PdfUrl);
                    downloadLink.attr('target', '_self');
                    downloadLink.attr('download', success.data.data.name);                  
                    downloadLink[0].click();
                }
            }
        }, function (error) {
            toastr.remove()
            if (angular.isDefined(error.data) && error.data !== null)
                toastr.error(error.data.errorMessage, "Error");
            else
                toastr.error("Failed to export the details. Please try again..", "Error");
        });
    }
    // Get Category pdf
    $scope.ExportCategoryDetails = ExportCategoryDetails;
    function ExportCategoryDetails() {
        var ClaimDetails = {
            "claimNumber": $scope.CommomObj.ClaimNo
        };
        var pdfDetails = ReportService.GetRepotCategoryPDF(ClaimDetails);
        pdfDetails.then(function (success) {
            if (success.data.data !== null && angular.isDefined(success.data.data)) {
                if (success.data.data.pathUrl !== null && angular.isDefined(success.data.data.pathUrl)) {
                    var PdfUrl = AuthHeaderService.getExportUrl() + success.data.data.pathUrl;
                    var downloadLink = angular.element('<a></a>');
                    downloadLink.attr('href', PdfUrl);
                    downloadLink.attr('target', '_self');
                    downloadLink.attr('download', success.data.data.name);
                    downloadLink[0].click();
                }
            }
        }, function (error) {
            toastr.remove()
            if (angular.isDefined(error.data) && error.data !== null)
                toastr.error(error.data.errorMessage, "Error");
            else
                toastr.error("Failed to export the details. Please try again..", "Error");
        });
    }
    // Get PDF replacement
    $scope.ExportReplacementDetails = ExportReplacementDetails;
    function ExportReplacementDetails() {
        var ClaimDetails = {
            "claimNumber": $scope.CommomObj.ClaimNo
        };
        var pdfDetails = ReportService.GetRepotReplacementPDF(ClaimDetails);
        pdfDetails.then(function (success) {
            if (success.data.data !== null && angular.isDefined(success.data.data)) {
                if (success.data.data.pathUrl !== null && angular.isDefined(success.data.data.pathUrl)) {
                    var PdfUrl = AuthHeaderService.getExportUrl() + success.data.data.pathUrl;
                    var downloadLink = angular.element('<a></a>');
                    downloadLink.attr('href', PdfUrl);
                    downloadLink.attr('target', '_self');
                    downloadLink.attr('download', success.data.data.name);
                    downloadLink[0].click();
                }
            }
        }, function (error) {
            toastr.remove()
            if (angular.isDefined(error.data) && error.data !== null)
                toastr.error(error.data.errorMessage, "Error");
            else
                toastr.error("Failed to export the details. Please try again..", "Error");
        });
    }
    // Get PDF of payment
    $scope.ExportPaymentDetails = ExportPaymentDetails;
    function ExportPaymentDetails() {
        var ClaimDetails = {
            "claimNumber": $scope.CommomObj.ClaimNo
        };
        var pdfDetails = ReportService.GetRepotPaymentPDF(ClaimDetails);
        pdfDetails.then(function (success) {
            if (success.data.data !== null && angular.isDefined(success.data.data)) {
                if (success.data.data.pathUrl !== null && angular.isDefined(success.data.data.pathUrl)) {
                    var PdfUrl = AuthHeaderService.getExportUrl() + success.data.data.pathUrl;
                    var downloadLink = angular.element('<a></a>');
                    downloadLink.attr('href', PdfUrl);
                    downloadLink.attr('target', '_self');
                    downloadLink.attr('download', success.data.data.name);
                    downloadLink[0].click();
                }
            }
        }, function (error) {
            toastr.remove()
            if (angular.isDefined(error.data) && error.data !== null)
                toastr.error(error.data.errorMessage, "Error");
            else
                toastr.error("Failed to export the details. Please try again..", "Error");
        });
    }


    //Sorting
    $scope.sortReport = function (keyname) {
        $scope.sortReportKey = keyname;   //set the sortKey to the param passed
        $scope.reverseReport = !$scope.reverseReport; //if true make it false and vice versa
    };

    //Sort Payment Summary
    $scope.sortPaymentSummary = function (keyname) {
        $scope.sortPaymenySummaryKey = keyname;   //set the sortKey to the param passed
        $scope.reversePaymentSummary = !$scope.reversePaymentSummary; //if true make it false and vice versa
    };

    //Sort Above Limit
    $scope.sortAboveLimit = function (keyname) {
        $scope.sortAboveLimitKey = keyname;   //set the sortKey to the param passed
        $scope.reverseAboveLimit = !$scope.reverseAboveLimit; //if true make it false and vice versa
    };
});