angular.module('MetronicApp').controller('NewVendorSupplierController', function ($rootScope, $scope,
    $location, $state, $translate, $translatePartialLoader, NewVendorSupplierService, $filter) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    //set language
    $translatePartialLoader.addPart('NewVendorSupplier');
    $translate.refresh();
    $scope.pagesize = $rootScope.settings.pagesize;
    $scope.SupplierDetails;
    $scope.ddlStatusList = [{ "id": true, "status": "Active" }, { "id": false, "status": "In-Active" }]
    init();
    function init() {
        $scope.CommomObj = {
            id: sessionStorage.getItem("SupplierId")
        };
        if (angular.isDefined(sessionStorage.getItem("SupplierId")) && sessionStorage.getItem("SupplierId") !== null && sessionStorage.getItem("SupplierId") !== "null") {
            var param = {
                "id": $scope.CommomObj.id
            };
            var GetSupplierDetails = NewVendorSupplierService.GetSupplierDetails(param);
            GetSupplierDetails.then(function (success) {
                $scope.SupplierDetails = success.data.data;
                $scope.SupplierDetails.phone = $filter('tel')($scope.SupplierDetails.phone);
            }, function (error) {
                toastr.remove();
                toastr.error((error !== null) ? error.data.errorMessage : "No details found..", "Error");
            });
        }

        var paramState = {
            "isTaxRate": false,
            "isTimeZone": false
        };
        var getstate = NewVendorSupplierService.GetState(paramState);
        getstate.then(function (success) { $scope.ddlStateList = success.data.data; }, function (error) { });
    }

    $scope.SaveSupplier = SaveSupplier;
    function SaveSupplier() {
        if ($scope.SupplierDetails.id) {
            //Update supplier
            var UpdatepAram = {
                "id": $scope.SupplierDetails.id,
                "supplierName": $scope.SupplierDetails.supplierName,
                "firstName": $scope.SupplierDetails.firstName,
                "lastName": $scope.SupplierDetails.lastName,
                "website": $scope.SupplierDetails.website,
                "phone": $scope.SupplierDetails.phone.replace(/[^0-9]/g, ''),
                "email": $scope.SupplierDetails.email,
                "address": {
                    "streetAddressOne": $scope.SupplierDetails.address.streetAddressOne,
                    "streetAddressTwo": $scope.SupplierDetails.address.streetAddressTwo,
                    "city": $scope.SupplierDetails.address.city,
                    "zipcode": $scope.SupplierDetails.address.zipcode,
                    "state": {
                        "id": $scope.SupplierDetails.address.state.id,
                    }
                },
                "active": $scope.SupplierDetails.active
            };
            var UpdateSupplier = NewVendorSupplierService.UpdateSupplierDetails(UpdatepAram);
            UpdateSupplier.then(function (success) {
                toastr.remove();
                toastr.success((success !== null) ? success.data.message : "Details saved successfully.", "Confirmation");
                $location.url('VendorSupplier');
            }, function (error) {
                toastr.remove();
                toastr.error((error !== null) ? error.data.errorMessage : "Something is wrong. please try again..", "Error");

            });
        }
        else {
            //Add supplier
            var newParam = {
                "supplierName": $scope.SupplierDetails.supplierName,
                "firstName": $scope.SupplierDetails.firstName,
                "lastName": $scope.SupplierDetails.lastName,
                "website": $scope.SupplierDetails.website,
                "phone": $scope.SupplierDetails.phone.replace(/[^0-9]/g, ''),
                "email": $scope.SupplierDetails.email,
                "address": {
                    "streetAddressOne": $scope.SupplierDetails.address.streetAddressOne,
                    "streetAddressTwo": $scope.SupplierDetails.address.streetAddressTwo,
                    "city": $scope.SupplierDetails.address.city,
                    "zipcode":$scope.SupplierDetails.address.zipcode,
                    "state": {
                        "id": $scope.SupplierDetails.address.state.id,
                    }
                },
                "active": true
            };
            var newSupplier = NewVendorSupplierService.NewSupplierDetails(newParam);
            newSupplier.then(function (success) {
                toastr.remove();
                toastr.success((success !== null) ? success.data.message : "Details saved successfully.", "Confirmation");
                $location.url('VendorSupplier');
            }, function (error) {
                toastr.remove();
                toastr.error((error !== null) ? error.data.errorMessage : "Something is wrong. please try again..", "Error");
            });

        }
    }
    $scope.GotoSuppplier = function () {
        $location.url('VendorSupplier')
    }
    $scope.GoToHome = function () {
        $location.url(sessionStorage.getItem("HomeScreen"));
    }
});