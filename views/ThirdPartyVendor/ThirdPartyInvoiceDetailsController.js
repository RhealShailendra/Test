angular.module('MetronicApp').controller('ThirdPartyInvoiceDetailsController', function ($rootScope, $filter, $uibModal,
    $scope, $location, $translate, $translatePartialLoader, ThirdPartyInvoiceDetailsService) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    //set language
    $translatePartialLoader.addPart('ThirdPartyCreateInvoice');
    $translate.refresh();
    $scope.ClaimNumber =
    $scope.StateList = [];

    $scope.SelectedItems = [];
    $scope.pagesize = 5;
    $scope.SubTotal = null;
    $scope.Tax = null;
    $scope.GrandTotal = null;
    $scope.InvoiceNo = null;
    $scope.InvoicesLeftToPay = null;
    $scope.CheckPayment = {};
    $scope.EFTPayment = {};
    $scope.VendorDetails = {};
    $scope.VendorState = "";
    $scope.DisplayPayment = false;
    $scope.ShowPayment = false;
    $scope.CheckSection = true;
    $scope.MaterialCharges = [];
    $scope.LabourCharges = [];
    $scope.PayInvoice;
    $scope.Details = JSON.parse(sessionStorage.getItem("Details"));
    $scope.CommomObj = {
        ClaimNumber: $scope.Details.ClaimNo,
        InvoiceNo: $scope.Details.InvoiceNo,
        InvociesToBePaid: $scope.Details.InvoicesToBePaid,
        PageName: $scope.Details.PageName,
        IsServiceRequestInvoice: $scope.Details.isServiceRequestInvoice
    };
 
    function init() {
        $scope.PayInvoice = false;
        GetStateList();      
        GetInvoiceDetails();
        //Format date
        if ($scope.VendorInvoiceDetails) {
            $scope.VendorInvoiceDetails.invoiceDetails.dueDate = $filter('date')(newValue, 'MM/dd/yyyy');
        }
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

        var promisePost = ThirdPartyInvoiceDetailsService.getInviceDetails(param);
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
        }, function (error) {
            $(".page-spinner-bar").addClass("hide");
            toastr.remove();
            if (error.data.errorMessage != null && angular.isDefined(error.data.errorMessage)) {
                toastr.error(error.data.errorMessage, "Error");
            }
            else {
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error");
            }

        });
    };

    $scope.GetStateList = GetStateList;
    function GetStateList() {
        var param =
            {
                "isTaxRate": false,
                "isTimeZone": false
            }
        var GetStates = ThirdPartyInvoiceDetailsService.getStates(param);
        GetStates.then(function (success) {
            $scope.StateList = success.data.data;
        }, function (error) {
            $scope.ErrorMessage = error.data.errorMessage;
        });

    };

    $scope.GoBack = GoBack;
    function GoBack() {
        $location.url('BillsAndPayment');
    };

    $scope.goToDashboard = goToDashboard;
    function goToDashboard() {
        $location.url('ThirdPartyVendorDashboard');
    };
        
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

            angular.forEach($scope.VendorInvoiceDetails.invoiceDetails.invoiceItems, function (invoices) {
                $scope.SelectedItems.push({ itemId: invoices.id });
                var quantity = 0; var price = 0;
                quantity = (angular.isDefined(invoices.quantity && invoices.quantity !== null) )? invoices.quantity : 0;
                price = (angular.isDefined(invoices.amount) && invoices.amount !== null) ? parseFloat(invoices.amount) : 0;
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
    };

});