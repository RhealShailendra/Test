angular.module('MetronicApp').controller('ServiceRequestInvoicesVendorController', function ($translate, $translatePartialLoader, $scope, $rootScope, $state, settings,
    $location, ServiceRequestInvoicesVendorService) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    $scope.PageSize = $rootScope.settings.pagesize;
    $translatePartialLoader.addPart('ServiceRequestInvoices');
    $translate.refresh();
    $scope.ErrorMessage = "";
    $scope.AllInvoiceList = [];
    InvoiceListToBePaid = [];
    $scope.SelectedInvoices = [];
    $scope.VendorDetails = {};
    $scope.Payment = {};
    $scope.StateList = [];
    $scope.selectedServiceRequestId = null;
   
    $scope.ShowPaymentDiv = false;
    $scope.CurrentClaimTab = 'InvoicesToBePaid';
    $scope.vendorid=null;
    function init() {
        sessionStorage.setItem("ServiceRequestBackURL", "");
        //get list of service request linvoices
        param = {
            "vendorId": sessionStorage.getItem("VendorId")
        }
        var getInvoiceList = ServiceRequestInvoicesVendorService.GetInvoiceList(param);
        getInvoiceList.then(function (success) {
            $scope.AllInvoiceList = success.data.data;
        }, function (error) {
            toastr.remove();
            toastr.error(error.data.errorMessage, "Error");
        });

        param = {
            "vendorId": sessionStorage.getItem("VendorId"),
            "invoiceStatus": "APPROVED",
        }
        var getInvoiceList = ServiceRequestInvoicesVendorService.GetInvoiceList(param);
        getInvoiceList.then(function (success) {
            $scope.InvoiceListToBePaid = success.data.data;
        }, function (error) {

            toastr.remove();
            toastr.error(error.data.errorMessage, "Error");

        });

        //get state list
        var stateparam =
           {
               "isTaxRate": false,
               "isTimeZone": false
           };

        var getStateList = ServiceRequestInvoicesVendorService.getStates(stateparam);
        getStateList.then(function (success) {
            $scope.StateList = success.data.data;
        }, function (error) { });
    }
    init();

    //Select all invoices for selected claim number
    $scope.SelectAllInvoices = SelectAllInvoices;
    function SelectAllInvoices(item)
    {
        $scope.SelectedInvoices = [];
        $scope.Payment.TotalAmount=null
        $scope.vendorid=null;
        angular.forEach($scope.AllInvoiceList,function (obj) {
            angular.forEach(obj.serviceRequest.serviceRequestInvoices, function (invoice) {
                invoice.IsSelected = false;               
            });
        });

        angular.forEach(item.serviceRequest.serviceRequestInvoices, function (obj) {
            obj.IsSelected = true;
            $scope.Payment.TotalAmount += obj.totalAmount;
            $scope.SelectedInvoices.push(obj.id);
        });

        $scope.selectedServiceRequestId = item.serviceRequest.serviceRequestId;
        $scope.vendorid = item.serviceRequest.vendorDetails.vendorId;
        $scope.GetVendorDetails($scope.vendorid);
    }

    //select single invoice for payment
    $scope.SelectSingleInvoice = SelectSingleInvoice;
    function SelectSingleInvoice(invoice,ServiceRequestId,selectedvendor)
    {        
        if ($scope.selectedServiceRequestId !== ServiceRequestId)
        {
            $scope.SelectedInvoices = [];
            $scope.Payment.TotalAmount = null;
            $scope.vendorid=null;
            angular.forEach($scope.AllInvoiceList, function (obj) {
                angular.forEach(obj.serviceRequest.serviceRequestInvoices, function (invoiceObj) {
                    if (invoiceObj.id !== invoice.id)
                    invoiceObj.IsSelected = false;
                });
            });
            $scope.GetVendorDetails(selectedvendor);
        }
        $scope.selectedServiceRequestId = ServiceRequestId;
        $scope.vendorid = selectedvendor;
        var index = $scope.SelectedInvoices.indexOf(invoice.id);
        
        if(index>-1)
        {
            $scope.SelectedInvoices.splice(index, 1);
            invoice.Isselected = false;
            $scope.Payment.TotalAmount -= invoice.totalAmount;
            
        }
        else {
            $scope.SelectedInvoices.push(invoice.id);
            invoice.Isselected =true;
            $scope.Payment.TotalAmount += invoice.totalAmount;
        }
        
    }

    //open payment details section
    $scope.showPayment = function () {
        $scope.ShowPaymentDiv = true;

        //$scope.GetVendorDetails($scope.vendorid);
    };

    //hide payment details section
    $scope.HidepaymentDiv = function () {
        $scope.ShowPaymentDiv = false;
    };

    //Get vendor details
    $scope.GetVendorDetails = GetVendorDetails;
    function GetVendorDetails(vendorid)
    {
        
       param = {
           "vendorId":vendorid 
       };
       
       getVendorDetailsOnID = ServiceRequestInvoicesVendorService.getVendorDetails(param);
       getVendorDetailsOnID.then(function (success) {
           
           $scope.VendorAllDetails = success.data.data;

           $scope.VendorDetails.Name = $scope.VendorAllDetails.vendorName;
           $scope.VendorDetails.ShippingAddress1 = $scope.VendorAllDetails.billingAddress.streetAddressOne;
           $scope.VendorDetails.ShippingAddress2 = $scope.VendorAllDetails.billingAddress.streetAddressTwo;
           $scope.VendorDetails.City = $scope.VendorAllDetails.billingAddress.city;
           $scope.VendorDetails.State = $scope.VendorAllDetails.billingAddress.state.id;
           $scope.VendorDetails.ZipCode = $scope.VendorAllDetails.billingAddress.zipcode;

       }, function (error) { });

   }
    
    $scope.MakePayment = function () {
        $scope.Invoices = [];
        angular.forEach($scope.SelectedInvoices, function (invoice) {

            $scope.Invoices.push({ id: invoice });
        });

        var Checkdate = new Date($scope.Payment.Date);
        Checkdate = Checkdate.toISOString().split('.')[0];
        Checkdate = Checkdate + 'Z';
        var param = {
            "checkNumber": $scope.Payment.CheckNumber,
            "payAmount": $scope.Payment.TotalAmount,
            "checkDate": Checkdate,
            "bankName": $scope.Payment.BankName,
            "check": true,
            "invoices": $scope.Invoices

        };
        
        var makePayment = ServiceRequestInvoicesVendorService.MakePayment(param);
        makePayment.then(function (success) {            
            $scope.status = success.status;
            $scope.ShowPaymentDiv = false;
            if ($scope.status === 200) {
                toastr.remove();
                toastr.success(success.data.message, "Confirmation..!!");
                $scope.Reset();
            }
        }, function (error) {
            toastr.remove();
            toastr.error(error.data.errorMessage, "Error..!!");


        });
    }

    $scope.Reset = Reset;
    function Reset()
    {
        $scope.VendorDetails = {};
    }

    $scope.GotoInvoiceDetails = GotoInvoiceDetails;
    function GotoInvoiceDetails(item, invoice) {
        sessionStorage.setItem("ServiceRequestBackURL", "ServiceRequestInvoicesVendor");
        sessionStorage.setItem("ServiceRequestInvoiceId", invoice.id);
        sessionStorage.setItem("ServiceRequestClaimNo", item.claimDetails.claimNumber);
        $location.url('ServiceRequestInvoiceDetails');
    };
    $scope.GoToHome = function () {
        $location.url(sessionStorage.getItem('HomeScreen'));
    }

});