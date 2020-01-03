angular.module('MetronicApp').controller('BillsAndPaymentController', function ($rootScope, $uibModal, $scope, $filter, settings, $http, $timeout, $location,
    $translate, $translatePartialLoader, BillsAndPaymentService) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });

    //set language
    $translatePartialLoader.addPart('BillsAndPayment');
    $translate.refresh();
    $scope.PageSize = $rootScope.settings.pagesize;;
    $scope.SearchResultShow = null;
    $scope.SearchResultHide = null;
    $scope.GlobalSearchTextResult = "";
    $scope.ErrorMessage = '';
    $scope.VendorId=sessionStorage.getItem("VendorId");
    $scope.InvoicesApprovedByClaim = [];
    $scope.InvoicesApprovedByCompany = [];
    $scope.InvoicesSubmittedByClaim = [];
    $scope.companyInvoices = [];
    $scope.CurrentClaimTab = 'InvoicesSubmitted';
    function init() {
        $(".page-spinner-bar").removeClass("hide");
        $scope.SearchResultShow = false;
        $scope.SearchResultHide = true;
        $scope.SubmittedFlag = true;
        $scope.ApprovedFlag = true;

        GetSubmittedInvoicesGroupedByClaim();      
        GetSubmittedInvoicesGroupedByCompany();     
        GetApprovedInvoicesGroupedByClaim();
        GetApprovedInvoicesGroupedByCompany();
       

    }
    init();

    $scope.ViewSubmmittedByClaims = function () {
        $scope.SubmittedFlag = true;
        GetSubmittedInvoicesGroupedByClaim();
    };

    $scope.ViewSubmmittedByCompany = function () {
        $scope.SubmittedFlag = false;
       GetSubmittedInvoicesGroupedByCompany();
    };

    $scope.ViewApprovedByClaims = function () {
        $scope.ApprovedFlag = true;
        GetApprovedInvoicesGroupedByClaim();
    };

    $scope.ViewApprovedByCompany = function () {

        $scope.ApprovedFlag = false;
        GetApprovedInvoicesGroupedByCompany();
    };

    $scope.GetSubmittedInvoicesGroupedByClaim = GetSubmittedInvoicesGroupedByClaim();
    function GetSubmittedInvoicesGroupedByClaim() {     
        paramSubmitted =
         {
             "vendorId": $scope.VendorId,
             "isClaimWise":true   
         };
        var InvoicesSubmitted = BillsAndPaymentService.GetVendorInvoiceListForVendor(paramSubmitted)
        InvoicesSubmitted.then(function (success) {
            $scope.InvoicesSubmittedByClaim = success.data.data;           
            angular.forEach($scope.InvoicesSubmittedByClaim.claims, function (Claim) {
                Claim.totalAmount = 0;
                angular.forEach(Claim.invoices, function (invoice) {
                    Claim.totalAmount += parseFloat(invoice.amount == null ? invoice.amount = 0 : invoice.amount);
                });

            });

        }, function (error) {
            $scope.ErrorMessage = error.data.errorMessage;
        });
    };

    $scope.GetSubmittedInvoicesGroupedByCompany = GetSubmittedInvoicesGroupedByCompany();
    function GetSubmittedInvoicesGroupedByCompany() {
        var paramVendorId =
               {
                   "vendorId": $scope.VendorId,
                   "isCompanyWise": true
               };
        var InvoicesSubmittedCompany = BillsAndPaymentService.GetVendorInvoiceListForVendor(paramVendorId)
        InvoicesSubmittedCompany.then(function (success) {

            $scope.InvoicesSubmittedByCompany = success.data.data;
            
            angular.forEach($scope.InvoicesSubmittedByCompany.companyInvoices, function (company) {
                company.totalAmount = 0;
                angular.forEach(company.invoices, function (invoice) {
                    company.totalAmount += parseFloat(invoice.amount == null ? invoice.amount = 0 : invoice.amount);
                });
            });
            debugger;
        }, function (error) {
            $scope.ErrorMessage = error.data.errorMessage;
        });
    };

    $scope.GetApprovedInvoicesGroupedByClaim = GetApprovedInvoicesGroupedByClaim();
    function GetApprovedInvoicesGroupedByClaim() {
        //Get Approved Invoices with claim list
        paramApproved =
        {
            "vendorId": $scope.VendorId,
            "isClaimWise":true,
            "invoiceStatus": "APPROVED"
        }
        var InvoicesApproved = BillsAndPaymentService.GetVendorInvoiceListForVendor(paramApproved)
        InvoicesApproved.then(function (success) {
            $scope.InvoicesApprovedByClaim = success.data.data;
            angular.forEach($scope.InvoicesApprovedByClaim.claims, function (Claim) {
                Claim.totalAmount = 0;
                angular.forEach(Claim.invoices, function (invoice) {
                    Claim.totalAmount += parseFloat(invoice.amount == null ? invoice.amount = 0 : invoice.amount);
                });
            });
        }, function (error) {
            $scope.ErrorMessage = error.data.errorMessage;
        });
    };


    $scope.GetApprovedInvoicesGroupedByCompany = GetApprovedInvoicesGroupedByCompany();
    function GetApprovedInvoicesGroupedByCompany()
    {

        var paramVendorId =
               {
                   "vendorId": $scope.VendorId,
                   "isCompanyWise": true,
                   "invoiceStatus": "APPROVED"
               };
        var InvoicesSubmittedCompany = BillsAndPaymentService.GetVendorInvoiceListForVendor(paramVendorId)
        InvoicesSubmittedCompany.then(function (success) {

            $scope.InvoicesApprovedByCompany = success.data.data;
            
            angular.forEach($scope.InvoicesApprovedByCompany.companyInvoices, function (company) {
                company.totalAmount = 0;
                angular.forEach(company.invoices, function (invoice) {
                        company.totalAmount += parseFloat(invoice.amount == null ? invoice.amount = 0 : invoice.amount);                 
                });
            });
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            $scope.ErrorMessage = error.data.errorMessage;
            $(".page-spinner-bar").addClass("hide");
        });
    }
    $scope.GotoGlobalSearch = GotoGlobalSearch;
    function GotoGlobalSearch() {
        if ($scope.GlobalSearchText !== "") {
            $scope.InvoicesSearchResult = [];
            sessionStorage.setItem("GlobalSearchText", $scope.GlobalSearchText);
            param =
             {
                 "searchString": $scope.GlobalSearchText,
                 "vendorId": sessionStorage.getItem("UserId")
             };
            var InvoicesSubmitted = BillsAndPaymentService.GetSearchInvoiceList(param)
            InvoicesSubmitted.then(function (success) {
                $scope.SearchResultShow = true;
                $scope.SearchResultHide = false;
                $scope.GlobalSearchTextResult = $scope.GlobalSearchText;
                $scope.InvoicesSearchResult = success.data.data;
                angular.forEach($scope.InvoicesSearchResult, function (value, key) {
                    value.Services = "";
                    angular.forEach(value.serviceRequested, function (value1, key1) {
                        value.Services += value1.name + ", ";
                    });


                });
            }, function (error) {
                $scope.ErrorMessage = error.data.errorMessage;
            });
        }
    }

    $scope.SortSumbitClaim = function (key) {
        $scope.SubmitsortsorClaimtKey = key;
        $scope.SubmitsortClaimreverse = !$scope.SubmitsortClaimreverse;
    }
    $scope.SortSumbitCompany = function (key) {
        $scope.SubmitsortCompanyKey = key;
        $scope.SubmitsortCompanyreverse = !$scope.SubmitsortCompanyreverse;
    };

    $scope.SortApprovalClaim = function (key) {
        $scope.ApprovalSortClaimKey = key;
        $scope.ApprovalClaimsortreverse = !$scope.ApprovalClaimsortreverse;
    }
    $scope.ApprovalSortVendor = function (key) {
        $scope.ApprovalsortVendorKey = key;
        $scope.ApprovalsortVendorreverse = !$scope.ApprovalsortVendorreverse;
    }

    $scope.GotoInvoiceDetails = function (invoice) {
        if (invoice.invoiceNumber !== null && angular.isDefined(invoice.invoiceNumber)) {
            debugger;
            var ObjDetails = {
                "InvoiceNo": invoice.invoiceNumber,
                "ClaimNo": "",
                "InvoicesToBePaid": $scope.TotalInvoicesToBePaid,
                "isServiceRequestInvoice":invoice.isServiceRequestInvoice,
                "PageName": "BillsAndPayments"
            };
            sessionStorage.setItem("Details", JSON.stringify(ObjDetails))
            $location.url('ThirdPartyInvoiceDetails');
        }
               
    };

    $scope.CancelSearch = CancelSearch;
    function CancelSearch() {
        $scope.GlobalSearchTextResult = "";
        $scope.InvoicesSearchResult = [];
        $scope.SearchResultShow = false;
        $scope.SearchResultHide = true;
    }
    //Sorting
    $scope.Submitsort = function (keyname) {
        $scope.SubmitsortsortKey = keyname;   //set the sortKey to the param passed
        $scope.Submitsortreverse = !$scope.Submitsortreverse; //if true make it false and vice versa
    }
    $scope.Allsort = function (keyname) {
        $scope.AllsortKey = keyname;   //set the sortKey to the param passed
        $scope.Allsortreverse = !$scope.Allsortreverse; //if true make it false and vice versa
    }
    $scope.Searchsort = function (keyname) {
        $scope.SearchsortKey = keyname;   //set the sortKey to the param passed
        $scope.Searchsortreverse = !$scope.Searchsortreverse; //if true make it false and vice versa
    }
    $scope.goToDashboard = goToDashboard;
    function goToDashboard() {
        $location.url(sessionStorage.getItem('HomeScreen'));
    };

    $scope.GotoInvoiceDetailsDummy = function (invoice) {
            debugger;
            var ObjDetails = {
                "InvoiceNo": 1,
                "ClaimNo": "",
                "InvoicesToBePaid": 1,
                "PageName": "BillsAndPayment"
            };
            sessionStorage.setItem("Details", JSON.stringify(ObjDetails))
            $location.url('ThirdPartyInvoiceDetails');
      

    };
});

