angular.module('MetronicApp').controller('VendorInfoController', function ($rootScope, $scope, $filter, $location, AdjusterDashboardService,
    $translate, $translatePartialLoader) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });

    //set language
    $translatePartialLoader.addPart('ThirdPartyVendorAdministration');
    $translate.refresh();

    $scope.VendorDetails;
    $scope.VendorContact;

    $scope.ddlStateList = [];
    function init() {
        $scope.CommonObject = {
            "vendorId": parseInt(sessionStorage.getItem("VendorId"))
        };
        //Get vendor details
        var GetDetails = AdjusterDashboardService.GetVendorDetails($scope.CommonObject);
        GetDetails.then(function (success) {
            $scope.VendorDetails = success.data.data;
            if ($scope.VendorDetails.additionalInfo !== null && angular.isDefined($scope.VendorDetails.additionalInfo)) {
                if ($scope.VendorDetails.additionalInfo.bankDetails) {
                    $scope.VendorDetails.additionalInfo.bankDetails.phoneNumber = $filter('tel')($scope.VendorDetails.additionalInfo.bankDetails.phoneNumber);
                }
            }
            $scope.VendorDetails.faxNumber = $filter('tel')($scope.VendorDetails.faxNumber);
            $scope.VendorDetails.dayTimePhone = $filter('tel')($scope.VendorDetails.dayTimePhone);
            angular.forEach($scope.VendorDetails.contactPersons, function (item) {
                item.faxNumber = $filter('tel')(item.faxNumber);
                item.workPhoneNumber = $filter('tel')(item.workPhoneNumber);
                item.mobilePhoneNumber = $filter('tel')(item.mobilePhoneNumber);

            });
        }, function (error) {
            toastr.remove()
            toastr.error(error.data.errorMessage, "Error");
        });
    }
    init();
    


    $scope.GoToHome = function () {
        $location.url(sessionStorage.getItem('HomeScreen'));
    }
});