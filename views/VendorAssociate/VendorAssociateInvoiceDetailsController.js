angular.module('MetronicApp').controller('VendorAssociateInvoiceDetailsController', function ($rootScope, $filter, $uibModal, $scope, settings, $http, $timeout, $location, $translate, $translatePartialLoader, VendorAssociateInvoiceDetailsService) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });

    //set language
    $translatePartialLoader.addPart('ThirdPartyInvoiceDetails');
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
    $scope.VendorDetails = {};
    $scope.VendorState = "";
    $scope.DisplayPayment = false;
    $scope.ShowPayment = false;
    $scope.Details = JSON.parse(sessionStorage.getItem("Details"));
    function init() {
        $scope.CommomObj = {
                //ClaimNumber: $scope.Details.ClaimNo,
                InvoiceNo: $scope.Details.InvoiceNo,
                InvociesToBePaid: $scope.Details.InvoicesToBePaid,
                PageName: $scope.Details.PageName
        };
        if ($scope.CommomObj.InvoiceNo !== null && $scope.CommomObj.InvoiceNo !== "" && angular.isDefined($scope.CommomObj.InvoiceNo)) {
            //Get StateList
            var stateparam =
           {
               "isTaxRate": false,
               "isTimeZone": false
           };

            var GetStates = VendorAssociateInvoiceDetailsService.getStates(stateparam);
            GetStates.then(function (success) {
                $scope.StateList = success.data.data;
            }, function (error) {
                $scope.ErrorMessage = error.data.errorMessage;
            });

            //Get Payment terms list
            var GetPaymentTermsList = VendorAssociateInvoiceDetailsService.getPaymentTermsList();
            GetPaymentTermsList.then(function (success) {
                $scope.PaymentTermsList = success.data.data;
            }, function (error) {
                $scope.ErrorMessage = error.data.errorMessage;
            });
            //Format date
            GetInvoiceDetails();
        }
        else
            $scope.GoBack();
    }

    init();


    $scope.GetInvoiceDetails = GetInvoiceDetails;
    function GetInvoiceDetails() {

        param = {         
            "invoiceNumber": $scope.CommomObj.InvoiceNo
        };

        //Get Claims list for my claims API #10

        var promisePost = VendorAssociateInvoiceDetailsService.getInviceDetails(param);
        promisePost.then(function (success) {
            
            $scope.VendorInvoiceDetails = [];
            $scope.VendorInvoiceDetails = success.data.data;
            $scope.state = (($scope.VendorInvoiceDetails.vendorRemitAddress !== null && angular.isDefined($scope.VendorInvoiceDetails.vendorRemitAddress)) ? (($scope.VendorInvoiceDetails.vendorRemitAddress.state!==null && angular.isDefined($scope.VendorInvoiceDetails.vendorRemitAddress.state))?$scope.VendorInvoiceDetails.vendorRemitAddress.state.id:null): null);
            if ($scope.VendorInvoiceDetails.invoiceDetails.currencyDetails == null)
                $scope.VendorInvoiceDetails.invoiceDetails.currencyDetails = "USD";
           
            $scope.SelectItemsAndValues();//setting all the variable values 

        }, function (error) {
            $scope.ErrorMessage = error.data.errorMessage;
        });


    }
    $scope.hideShowPayment = hideShowPayment;
    function hideShowPayment() {
        if ($scope.CommomObj.IsThirdpartyVendor === "true") {
            $scope.ShowPayment = false;
        }
        else {
            $scope.ShowPayment = true;
        }
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
        if ($scope.VendorInvoiceDetails != null || $scope.VendorInvoiceDetails.length != 0) {
            $scope.InvoiceNo = $scope.VendorInvoiceDetails.invoiceDetails.invoiceNumber;
            $scope.InvoicesLeftToPay = $scope.CommomObj.InvociesToBePaid;
            if ($scope.VendorInvoiceDetails.invoiceDetails.currencyDetails == null)
                $scope.VendorInvoiceDetails.invoiceDetails.currencyDetails = "USD";
            angular.forEach($scope.VendorInvoiceDetails.invoiceItems, function (invoices) {
                $scope.SelectedItems.push({ itemId: invoices.id });
                $scope.GrandTotal += parseFloat(invoices.amount);
                angular.forEach(invoices.services, function (service) {
                    $scope.GrandTotal += parseFloat(service.amount);
                });
            });
        }
    }

    $scope.bindVendorData = bindVendorData;
    function bindVendorData() {
        $scope.VendorDetails.Name = $scope.VendorInvoiceDetails.vendor.name;
        $scope.VendorDetails.ShippingAddress1 = $scope.VendorInvoiceDetails.vendorRemitAddress.streetAddressOne;
        $scope.VendorDetails.ShippingAddress2 = $scope.VendorInvoiceDetails.vendorRemitAddress.streetAddressTwo;
        $scope.VendorDetails.City = $scope.VendorInvoiceDetails.vendorRemitAddress.city;
        $scope.VendorDetails.State = $scope.VendorInvoiceDetails.vendorRemitAddress.state.id;
        $scope.VendorDetails.ZipCode = $scope.VendorInvoiceDetails.vendorRemitAddress.zipcode;


    }

    $scope.GoBack = function () {
        sessionStorage.setItem("Details", "");
        $location.url($scope.CommomObj.PageName);

    }
    $scope.goToDashboard = function () {
        $location.url(sessionStorage.getItem('HomeScreen'));
    }
});