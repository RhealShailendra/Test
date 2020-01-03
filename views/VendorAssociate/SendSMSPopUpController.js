angular.module('MetronicApp').controller('SendSMSPopupController', function ($rootScope, $http, $filter, $uibModal, $scope, $translate, $translatePartialLoader, VendorAssociateItemDetailsService, objClaim) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    //$translatePartialLoader.addPart('AdjusterPropertyClaimDetails');
    //$translate.refresh();

    function init() {
        $scope.AllData = objClaim;
        $scope.PolicyholderAppList = [];
        $scope.PolicyholderUrl = null;
        $scope.SMSURL = null;
        $scope.URLDetails;
        $scope.PoDetails ={
            Id: $scope.AllData.policyholderDetails.policyHolder.policyHolderId,
            Name: (angular.isDefined($scope.AllData.policyholderDetails.policyHolder.lastName) ? $scope.AllData.policyholderDetails.policyHolder.lastName : "") + ", " + (angular.isDefined($scope.AllData.policyholderDetails.policyHolder.firstName) ? $scope.AllData.policyholderDetails.policyHolder.firstName : ""),
            CellPhone: $scope.AllData.policyholderDetails.policyHolder.cellPhone,
                Description: "",
                RegNo: $scope.AllData.RegNumber
            };
      
        if (angular.isDefined(sessionStorage.getItem("PolicyholderAppListURL"))) {
            var _appList = GetAppList();
            _appList.then(function (success) {
                $scope.PolicyholderAppList = success.data;
                angular.forEach($scope.PolicyholderAppList, function (app) {
                    if (app.KEY.toUpperCase() === $scope.PoDetails.RegNo.toUpperCase())
                    {
                        $scope.PolicyholderUrl = app.POLICYHOLDERURL;                        
                    }                    
                });   
            }, function (error) {
                $scope.PolicyholderAppList = [];
            });

        };
    };
    init();    

    function GetAppList() {
        var _URL = sessionStorage.getItem("PolicyholderAppListURL");
        //var _URL = "Config/PolicyholderAppList.json";
        return result = $http.get(_URL);       
    };

    $scope.ok = ok;
    function ok() {
        if ($scope.PolicyholderUrl!==null)
        {
            $(".page-spinner-bar").removeClass("hide");
        var param = {
            "claim": {
                "id": $scope.AllData.claim.id
            },
            "item": {
                "id": $scope.AllData.item.id
            },
            "vendorAssociate": {
                "id": sessionStorage.getItem("UserId")
            },
            "policyHolderUrl": $scope.PolicyholderUrl + "#/PolicyholderView"
        };
        var sendData = VendorAssociateItemDetailsService.sendDataToPolicyholder(param);
        sendData.then(function (success) {
            $scope.URLDetails = success.data.data;         
            $scope.SendSMSToPH()
        }, function (error) {
            toastr.remove()
            toastr.error(error.data.errorMessage, $translate.instant("ErrorHeading"));
            $(".page-spinner-bar").addClass("hide");
        });
        }
        
    };


    $scope.SendSMSToPH = SendSMSToPH;
    function SendSMSToPH() {
        $(".page-spinner-bar").removeClass("hide");
        var param = {
            "mobileNumber": $scope.PoDetails.CellPhone,
            "messageContents": $scope.PoDetails.Description + " " + $scope.URLDetails.url,
            "claim": {
                "id": $scope.AllData.claim.id
            },
            "item": {
                "id": $scope.AllData.item.id
            },
            "policyHolder": {
                "id": $scope.PoDetails.Id
            },
            "vendorAssociate": {
                "id": sessionStorage.getItem("UserId")
            }
        };
        var sendSMS = VendorAssociateItemDetailsService.sendSMSToPolicyholder(param);
        sendSMS.then(function (success) {
            $(".page-spinner-bar").addClass("hide");
            toastr.remove()
            toastr.success(success.data.message, "Confirmation");
            $scope.$close();
        }, function (error) {
            toastr.remove()
            toastr.error(error.data.errorMessage, "Error");
            $(".page-spinner-bar").addClass("hide");
        });
    };

    $scope.cancel = function () {
        $scope.$close();
    }
});
