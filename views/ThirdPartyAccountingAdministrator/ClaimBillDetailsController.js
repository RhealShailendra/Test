angular.module('MetronicApp').controller('ClaimBillDetailsController', function ($rootScope, $scope, $translate, $translatePartialLoader, $location, ClaimBillsService, AuthHeaderService) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    $translatePartialLoader.addPart('ClaimBillDetails');
    $translate.refresh();
    $scope.CurrentClaimTab = "InvoiceDetails";
    $scope.Details = JSON.parse(sessionStorage.getItem("Details"));
    $scope.DisplayPayment = false;
    $scope.VendorDetails = {};
    $scope.init = init;
    function init() {
        $scope.CommomObj={
            InvoiceNo:$scope.Details.InvoiceNo
        }
        GetInvoiceDetails();
    }
    init();
    $scope.GetInvoiceDetails = GetInvoiceDetails;
    function GetInvoiceDetails() {
        $(".page-spinner-bar").removeClass("hide");
        param = {
            "invoiceNumber": $scope.CommomObj.InvoiceNo
        };
        $scope.TotalPayable = 0.00
        //Get Claims list for my claims API #10

        var promisePost = ClaimBillsService.getInviceDetails(param);
        promisePost.then(function (success) {
            $scope.VendorInvoiceDetails = [];
            $scope.VendorInvoiceDetails = success.data.data;
            $scope.TotalPayable = 0.00
            angular.isDefined($scope.VendorInvoiceDetails.invoiceDetails && $scope.VendorInvoiceDetails.invoiceDetails != null)
            {
                $scope.TotalPayable += parseFloat($scope.VendorInvoiceDetails.invoiceDetails.amount);
                $scope.TotalPayable -= parseFloat($scope.VendorInvoiceDetails.invoiceDetails.advancePayment)
                $scope.TotalPayable -= parseFloat($scope.VendorInvoiceDetails.invoiceDetails.deductible);
                if ($scope.VendorInvoiceDetails.invoiceDetails.status.status == "APPROVED") {
                    $scope.PayInvoice = true;
                }
                else if ($scope.VendorInvoiceDetails.invoiceDetails.status.status == "PAID") {
                    $scope.PayInvoice = true;
                }
                else {
                    $scope.PayInvoice = false;
                }
            }

            if (angular.isDefined($scope.VendorInvoiceDetails.additionalCharges)) {
                $scope.MaterialCharges = [];
                $scope.LabourCharges = [];
                angular.forEach($scope.VendorInvoiceDetails.additionalCharges, function (charge) {

                    if (charge.type == "MATERIAL") {
                        $scope.MaterialCharges.push(charge)
                    }
                    else if (charge.type == "LABOR") {
                        $scope.LabourCharges.push(charge)
                    }
                })
            }
            else {
                $scope.SelectItemsAndValues();
            }
            $(".page-spinner-bar").addClass("hide");
        });
    }
    $scope.SelectItemsAndValues = SelectItemsAndValues;
    function SelectItemsAndValues() {
        $scope.SelectedItems = [];
        $scope.GrandTotal = null;
        $scope.InvoiceNo = null;
        $scope.InvoicesLeftToPay = null;
        $scope.SubTotal = null;
        $scope.GrandTotal = null;
        $scope.Tax = null;

        if ($scope.VendorInvoiceDetails != null || angular.isDefined($scope.VendorInvoiceDetails)) {
            $scope.InvoiceNo = $scope.VendorInvoiceDetails.invoiceDetails.invoiceNumber;
            $scope.InvoicesLeftToPay = $scope.CommomObj.InvociesToBePaid;

            angular.forEach($scope.VendorInvoiceDetails.invoiceItems, function (invoices) {
                $scope.SelectedItems.push({ itemId: invoices.id });
                var quantity = 0; var price = 0;
                quantity = (angular.isDefined(invoices.units) && invoices.units !== null) ? invoices.units : 0
                price = (angular.isDefined(invoices.unitPrice) && invoices.unitPrice !== null) ? parseFloat(invoices.unitPrice) : 0;
                $scope.SubTotal += parseFloat(quantity) * parseFloat(price)

                $scope.Tax += ((angular.isDefined(invoices.tax) && invoices.tax !== null) ? invoices.tax : 0);
                $scope.GrandTotal += parseFloat(invoices.amount);

                angular.forEach(invoices.services, function (service) {

                    var quantity = 0; var price = 0;
                    quantity = (angular.isDefined(service.quantity) && service.quantity !== null) ? service.quantity : 0
                    price = (angular.isDefined(service.rate) && service.rate !== null) ? parseFloat(service.rate) : 0;
                    $scope.SubTotal += parseFloat(quantity) * parseFloat(price)

                    $scope.Tax += ((angular.isDefined(service.tax) && service.tax !== null) ? service.tax : 0);
                    $scope.GrandTotal += parseFloat(service.amount);
                })
            })

        }
    }

    $scope.GoBack = function () {
        sessionStorage.setItem("Details", " ");
        $location.url($scope.Details.PageName);
    };
    $scope.MarkAsPaid = MarkAsPaid;
    function MarkAsPaid() {
        $(".page-spinner-bar").removeClass("hide");
        var param = {
            "invoiceDetails": {
                "id": $scope.VendorInvoiceDetails.invoiceDetails.id
            },
            "paymentVerified": true
        }
        var promisePost = ClaimBillsService.markInvoiceAsPaid(param);
        promisePost.then(function (success) {
            toastr.remove();
            toastr.success(success.data.message, "Confirmation");
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            $(".page-spinner-bar").addClass("hide");
            toastr.remove();
            toastr.error(error.data.errorMessage, "Error");
        });
    };
    $scope.goToDashboard = function () {
        sessionStorage.setItem("Details", "");   
        $location.url(sessionStorage.getItem('HomeScreen'));
    }
})