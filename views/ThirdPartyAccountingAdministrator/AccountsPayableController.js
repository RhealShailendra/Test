angular.module('MetronicApp').controller('AccountsPayableController', function ($rootScope, $scope, $translate, $translatePartialLoader, $location, ClaimBillsService, $filter) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    //set language
    $translatePartialLoader.addPart('ClaimBills');
    $translate.refresh();
    $scope.CurrentClaimTab = "Receivable";
    $scope.CurrentEventTab = 'Alert';

    $scope.init = function () {
        $(".page-spinner-bar").removeClass("hide");
        var param = {
            "invoiceStatus": "PAID"
        }
        var payableClaim = ClaimBillsService.pendingReceivable(param)
        payableClaim.then(function (success) {
            $scope.Payable = (angular.isDefined(success.data.data) && success.data.data!=null)?success.data.data.invoices:null;
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            $(".page-spinner-bar").addClass("hide");
            $scope.ErrorMessage = error.data.errorMessage;

        });
        GetAlertsList();
        GetUpcomingEventList();
    };

    $scope.init();
    $scope.GetAlertsList = GetAlertsList;
    function GetAlertsList() {
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

        }, function (error) {
            toastr.remove();
            toastr.error(error.data.errorMessage, "Error");
            $scope.ErrorMessage = error.data.errorMessage;
        });
    };


    $scope.GetUpcomingEventList = GetUpcomingEventList;
    function GetUpcomingEventList() {
        var GetEventList = ClaimBillsService.getEventList();
        GetEventList.then(function (success) {
            $scope.EventList = success.data.data;
            // $scope.CheckStatus(); //to remove finished event from list
            angular.forEach($scope.EventList, function (event) {
                event.PrticipantString = "";
                angular.forEach(event.participants, function (participant, key) {
                    event.PrticipantString += participant.lastName == null ? "" : participant.lastName;
                    event.PrticipantString += " ";
                    event.PrticipantString += participant.firstName == null ? "" : participant.firstName;
                    if (key != event.participants.length - 1) {
                        event.PrticipantString += ",";
                    }
                });

            });
        }, function (error) {
            toastr.remove();
            toastr.error(error.data.errorMessage, "Error");
            $scope.ErrorMessage = error.data.errorMessage;
        });

    }
    $scope.GotoClaimBillDetails = function (item) {
        if (item.invoiceNumber !== null && angular.isDefined(item.invoiceNumber)) {
                var ObjDetails = {
                    "InvoiceNo": item.invoiceNumber,
                    //"ClaimNo": "",
                    //"InvoicesToBePaid": $scope.TotalInvoicesToBePaid,
                    "isServiceRequestInvoice": item.isServiceRequestInvoice,
                    "PageName": "AccountsPayable"
                };
                sessionStorage.setItem("Details", JSON.stringify(ObjDetails))
                $location.url('ClaimBillDetails');
            }
    };
});