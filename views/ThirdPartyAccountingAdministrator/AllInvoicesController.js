angular.module('MetronicApp').controller('AllInvoicesController', function ($rootScope, $translate, $translatePartialLoader, $scope, settings,ClaimBillsService,
     $location, $filter) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    $translatePartialLoader.addPart('AllInvoices');
    $translate.refresh();
    $scope.AllInvoices = [];
    $scope.Filter = {
        companyId: null,
        invoiceStatus: null,
        isCompanyWise: null,
        isClaimWise: null,
        vendorAssociateId: null,
        startDate: null,
        endDate: null
    };
    $scope.init = init;
    function init() {
        getCompanyList();
        getInvoices();
        
    }
    init();
    $scope.getInvoices = getInvoices;
    function getInvoices() {
        $(".page-spinner-bar").removeClass("hide");
        var param = {
          //  "status":"",
            "startDate":"", //  ( filter and optional ) the invoice create date greater or equal to start date
            "endDate": "" // ( filter and optional ) the invoice create date less or equal to end date
        }
        var invoiceList = ClaimBillsService.getAllInvoices(param);
        invoiceList.then(function (success) {
            $scope.AllInvoices = success.data.data.invoices;
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            toastr.remove();
            toastr.error(error.data.errorMessage, "Error");
            $scope.ErrorMessage = error.data.errorMessage;
            $(".page-spinner-bar").addClass("hide");
        });
    }
    $scope.getCompanyList = getCompanyList;
    function getCompanyList() {
         $(".page-spinner-bar").removeClass("hide");     
         var complany = ClaimBillsService.getInsuranceCompanies();
        complany.then(function (success) {
            $scope.companyList = success.data.data;
          //  $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            toastr.remove();
            toastr.error(error.data.errorMessage, "Error");
            $scope.ErrorMessage = error.data.errorMessage;
         //   $(".page-spinner-bar").addClass("hide");
        });
    }
    $scope.GotoInvoiceDetails = function (item) {
        if (item.invoiceNumber !== null && angular.isDefined(item.invoiceNumber)) {
            var ObjDetails = {
                "InvoiceNo": item.invoiceNumber,
                //"ClaimNo": "",
                //"InvoicesToBePaid": $scope.TotalInvoicesToBePaid,
                "isServiceRequestInvoice": item.isServiceRequestInvoice,
                "PageName": "AllInvoices"
            };
            sessionStorage.setItem("Details", JSON.stringify(ObjDetails))
            $location.url('ClaimBillDetails');
        }
    };

    $scope.filterInvoices = filterInvoices;
    function filterInvoices() {
       $(".page-spinner-bar").removeClass("hide");
        var param = {
            "companyId":null, // filter for this company related invoice get and only work for claim wise
            "invoiceStatus":null, // ( filter and optional ) get only invoices of this status type
            "isCompanyWise":null, // mandatory and optional to claim wise
            "isClaimWise":null, // mandatory and optional to company wise
            "vendorAssociateId":null, // ( filter and optional ) get invoice related to this item vendor associate
            "startDate": angular.isDefined($scope.Filter.startDate) && $scope.Filter.startDate != null ? $filter('DatabaseDateFormatMMddyyyy')($scope.Filter.startDate) : null,
            "endDate": angular.isDefined($scope.Filter.endDate) && $scope.Filter.endDate != null ? $filter('DatabaseDateFormatMMddyyyy')($scope.Filter.endDate) : null,
         }
        var invoiceList = ClaimBillsService.getAllInvoices(param);
        invoiceList.then(function (success) {
            $scope.AllInvoices = success.data.data.invoices;
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            toastr.remove();
            toastr.error(error.data.errorMessage, "Error");
            $scope.ErrorMessage = error.data.errorMessage;
            $(".page-spinner-bar").addClass("hide");
        });
    }

    $scope.searchByDate = searchByDate;
    function searchByDate(param) {
        var dt = new Date();
        var month = dt.getMonth(), year = dt.getFullYear();

        if (param == 'ThisMonth') {
            $scope.Filter.startDate = new Date(year, month, 1).toLocaleDateString();
            $scope.Filter.endDate = new Date(year, month, dt.getDate()).toLocaleDateString();
        }
        else if (param == 'Last3Month') {
            $scope.Filter.startDate = new Date(year, month - 3, 1).toLocaleDateString();
            $scope.Filter.endDate = new Date(year, month, dt.getDate()).toLocaleDateString();
        } else if (param == "All") {
            $scope.Filter.startDate = "";
            $scope.Filter.endDate = "";
        }

        filterInvoices();
    };
});