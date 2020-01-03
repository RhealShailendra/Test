angular.module('MetronicApp').controller('ThirdPartyVendorAdministrationController', function ($rootScope, $scope, $filter, $location, ThirdPartyVendorAdministrationService,
    $translate, $translatePartialLoader) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });

    //set language
    $translatePartialLoader.addPart('ThirdPartyVendorAdministration');
    $translate.refresh();
    $scope.PageSize = $rootScope.settings.pagesize;

    $scope.VendorDetails;
    $scope.VendorContact;
    $scope.RemittanceDetails;
    $scope.RemitInfo;
    $scope.ddlStateList = [];
    function init() {
        $(".page-spinner-bar").addClass("hide");
        $scope.CommonObject = {
            "VendorId": sessionStorage.getItem("VendorId")
        };
        var stateparam =
           {
               "isTaxRate": false,
               "isTimeZone": false
           };

        var getState = ThirdPartyVendorAdministrationService.GetState(stateparam);
        getState.then(function (success) { $scope.ddlStateList = success.data.data; }, function (error) { });

        
        GetVendorDetails();
    }
    init();


    $scope.GetVendorDetails = GetVendorDetails;
    function GetVendorDetails()
    {
            //Get vendor details
            var GetDetails = ThirdPartyVendorAdministrationService.GetVendorDetails();
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
                $(".page-spinner-bar").addClass("hide");
            }, function (error) {                 
                toastr.remove()
                toastr.error(error.data.errorMessage, "Error");
            });
        }
    $scope.SaveVendorDetails = SaveVendorDetails;
    function SaveVendorDetails() {
        $(".page-spinner-bar").removeClass("hide");
        if (angular.isDefined($scope.VendorDetails.dayTimePhone) && $scope.VendorDetails.dayTimePhone != null)
        {
            $scope.VendorDetails.dayTimePhone = $scope.VendorDetails.dayTimePhone.replace(/[^0-9]/g, '');
        }
        if ($scope.VendorDetails.contactPersons.length>0)
        {
            $scope.VendorDetails.contactPersons[0].mobilePhoneNumber = $scope.VendorDetails.contactPersons[0].mobilePhoneNumber.replace(/[^0-9]/g, '');
            $scope.VendorDetails.contactPersons[0].workPhoneNumber = $scope.VendorDetails.contactPersons[0].workPhoneNumber.replace(/[^0-9]/g, '');
        }      
        if (angular.isDefined($scope.VendorDetails.additionalInfo) && $scope.VendorDetails.additionalInfo != null) {
            if (angular.isDefined($scope.VendorDetails.additionalInfo.bankDetails) && $scope.VendorDetails.additionalInfo.bankDetails != null) {
                $scope.VendorDetails.additionalInfo.bankDetails.phoneNumber = $scope.VendorDetails.additionalInfo.bankDetails.phoneNumber.replace(/[^0-9]/g, '');
            }
        }
         
        var param = {
            "vendorId": $scope.VendorDetails.vendorId,
            "vendorName": $scope.VendorDetails.vendorName,
            "address": (($scope.VendorDetails.address !== null) ? $scope.VendorDetails.address : null),          
            "billingAddress": (($scope.VendorDetails.billingAddress !== null) ? $scope.VendorDetails.billingAddress : null),           
            "shippingAddress": (($scope.VendorDetails.billingAddress !== null) ? $scope.VendorDetails.billingAddress : null),         
            "contactPersons": (($scope.VendorDetails.contactPersons !== null) ? $scope.VendorDetails.contactPersons : null),
            "additionalInfo": (($scope.VendorDetails.additionalInfo !== null) ? $scope.VendorDetails.additionalInfo : null),
            //"bankDetails": $scope.VendorDetails.additionalInfo.bankDetails,
            "dayTimePhone": $scope.VendorDetails.dayTimePhone.replace(/[^0-9]/g, ''),
            "faxNumber": $scope.VendorDetails.faxNumber.replace(/[^0-9]/g, ''),
            "isActive": $scope.VendorDetails.active,
            "isTemporary": $scope.VendorDetails.temporary,
            "website": $scope.VendorDetails.website
        };
         
        var SaveDetails = ThirdPartyVendorAdministrationService.SaveVendorDetails(param);
        SaveDetails.then(function (success) {
            toastr.remove()
            toastr.success(success.data.message, "Confirmation");
            $scope.GetVendorDetails();
        }, function (error) {
            toastr.remove()
            toastr.error(error.data.errorMessage, "Error");
        });
    };

    $scope.GoToHome = function () {
        $location.url(sessionStorage.getItem('HomeScreen'));
    };
});