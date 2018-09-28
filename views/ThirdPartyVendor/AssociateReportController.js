angular.module('MetronicApp').controller('AssociateReportController', function ($rootScope, $translate, AssociateReportService, $translatePartialLoader, $scope, settings,
    $timeout, $location, $filter) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    $translatePartialLoader.addPart('AssociateReport');
    $translate.refresh();

    $scope.PageLength = $rootScope.settings.pagesize;
    $scope.CompanyList = [];
    $scope.SelectedCompany = "0";
    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

    $scope.sortAssociate = function (keyname) {
        $scope.AssociatesortKey = keyname;   //set the sortKey to the param passed
        $scope.Associatereverse = !$scope.Associatereverse; //if true make it false and vice versa
    }

    $scope.sortInsurance = function (keyname) {
        $scope.InsurancesortKey = keyname;   //set the sortKey to the param passed
        $scope.Insurancereverse = !$scope.Insurancereverse; //if true make it false and vice versa
    }
   
    function init()
        {

        var GetCompanyList = AssociateReportService.getCompanyList();
        GetCompanyList.then(function (success) {
            $scope.CompanyList = success.data.data;
        }, function (error) {
            toastr.remove();
            toastr.error(error.data.errorMessage, "Error");
        });
        };
    init();
  
    $scope.ShowInsuranceReportsDiv = false;
    $scope.ShowInsuranceReport =ShowInsuranceReport;
    function ShowInsuranceReport() {
        if( $scope.ShowInsuranceReportsDiv == true)
        { 
            $scope.ShowInsuranceReportsDiv = false;
        }
      else{
            $scope.ShowInsuranceReportsDiv = true;
            $scope.getAssociateReport();
    }
    }
    $scope.Back =Back;
    function Back() {
        if ($scope.ShowInsuranceReportsDiv == true) {
            $scope.ShowInsuranceReportsDiv = false;
        }
        else {
            $scope.ShowInsuranceReportsDiv = true;
        }
    }
        
    $scope.CurrentClaimTab = 'AssociatesReport';
    $scope.ShowInsurance = function () {

        $scope.CurrentClaimTab = 'InsuranceCompaniesReport';

    }
    $scope.startDate;
    $scope.endDate;
    $scope.getAssociateReport = getAssociateReport;
    function getAssociateReport() {
      
        if ($scope.startDate !== null)
        {
            var d = new Date(Date.apply(null, arguments));
            d.setDate(1);
            $scope.startDate = $filter('date')(d, "MM-dd-yyyy");
            

        }
        if ($scope.endDate !== null)
        {
            var d = new Date(Date.apply(null, arguments));
            d.setMonth(d.getMonth() + 1);
            d.setDate(0);
            $scope.endDate = $filter('date')(d, "MM-dd-yyyy");
        }

        var param = {
            "vendorId": sessionStorage.getItem("VendorId"),
            "startDate": $filter('DatabaseDateFormatMMddyyyy')($scope.startDate),
            "endDate": $filter('DatabaseDateFormatMMddyyyy')($scope.endDate)
        };
      
        var GetCompanyClaim = AssociateReportService.getCompanyClaim(param);
        GetCompanyClaim.then(function (success) {
            $scope.CompanyClaimList = success.data.data;
        }, function (error) {
            toastr.remove();
            toastr.error(error.data.errorMessage, "Error");
        });
    }

    $scope.GetAssociateInvocies = GetAssociateInvocies;
    function GetAssociateInvocies()
    {
        var GetCompanyClaim = AssociateReportService.getCompanyClaim(param);
        GetCompanyClaim.then(function (success) {
            $scope.CompanyClaimList = success.data.data;
        }, function (error) {
            toastr.remove();
            toastr.error(error.data.errorMessage, "Error");
        });
    }

});