angular.module('MetronicApp').controller('ClaimBillsController', function ($rootScope, $scope, $translate, $translatePartialLoader, $location, ClaimBillsService, $filter, AuthHeaderService) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    //set language
    $translatePartialLoader.addPart('ClaimBills');
    $translate.refresh();
    $scope.CurrentClaimTab = "Receivable";
    $scope.CurrentEventTab = 'Alert';
    $scope.receivable = null;
    $scope.init = function () {
      GetrecivableClaim();
      GetAlertsList();
    };
    $scope.init();
    $scope.GetAlertsList = GetAlertsList;
    function GetAlertsList() {
        $(".page-spinner-bar").removeClass("hide");
        //Get Alert List
        var param = {
            "id": sessionStorage.getItem("UserId").toString()
            // "id":"252"
        };
        var GetAlertList = ClaimBillsService.getAlertList(param);
        GetAlertList.then(function (success) {
            $scope.AlertList = success.data.data;
            var UnreadAlert = $filter('filter')($scope.AlertList, { isRead: false });
            $scope.AlertList = UnreadAlert;
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            $(".page-spinner-bar").addClass("hide");
            toastr.remove();
            toastr.error((angular.isDefined(error.data) && angular.isDefined(error.data.errorMessage) ? error.data.errorMessage : AuthHeaderService.genericErrorMessage()), "Error")
        });
    };
    $scope.GotoClaimBillDetails = function (item) {
        if (item.invoiceNumber !== null && angular.isDefined(item.invoiceNumber)) {
            var ObjDetails = {
                "InvoiceNo": item.invoiceNumber,
                //"ClaimNo": "",
                //"InvoicesToBePaid": $scope.TotalInvoicesToBePaid,
                "isServiceRequestInvoice": item.isServiceRequestInvoice,
                "PageName": "ClaimBills"
            };
            sessionStorage.setItem("Details", JSON.stringify(ObjDetails))
            $location.url('ClaimBillDetails');
        }
    };

    $scope.GetrecivableClaim = GetrecivableClaim;
    function GetrecivableClaim() {
        $(".page-spinner-bar").removeClass("hide");
        var param = {
            "invoiceStatusList": ["PENDING APPROVAL", "PROCESSING", "APPROVED"]
        }
        var recivableClaim = ClaimBillsService.pendingReceivable(param)
        recivableClaim.then(function (success) {
            if (success.data.data != null)
                $scope.receivable = success.data.data.invoices;
            else
                $scope.receivable = null;
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            $(".page-spinner-bar").addClass("hide");
            $scope.ErrorMessage = error.data.errorMessage;
        });
    }
});