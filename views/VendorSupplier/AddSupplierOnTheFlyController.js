angular.module('MetronicApp').controller('AddSupplierOnTheFlyController', function ($rootScope, $scope, settings, $location, $translate, $translatePartialLoader, $uibModal,
$filter, AuthHeaderService, NewVendorSupplierService, objState) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });

    //set language
    $translatePartialLoader.addPart('NewVendorSupplier');
    $translate.refresh();
    $scope.SupplierDetails;
    $scope.ddlStateList = objState;
    debugger;
    $scope.ok = function (e) 
    {

        //Add supplier
        var newParam = {
            "supplierName": $scope.SupplierDetails.supplierName,
            "firstName": $scope.SupplierDetails.firstName,
            "lastName": $scope.SupplierDetails.lastName,
            "website":(angular.isDefined($scope.SupplierDetails.website) ? $scope.SupplierDetails.website : null), 
            "phone": $scope.SupplierDetails.phone.replace(/[^0-9]/g, ''),
            "email": $scope.SupplierDetails.email,
            "address": {
                "streetAddressOne": $scope.SupplierDetails.address.streetAddressOne,
                "streetAddressTwo": $scope.SupplierDetails.address.streetAddressTwo,
                "city": $scope.SupplierDetails.address.city,
                "zipCode": (angular.isDefined($scope.SupplierDetails.address.zipcode) ? $scope.SupplierDetails.address.zipcode : null),
                "state": {
                    "id": (angular.isDefined($scope.SupplierDetails.address.state.id) ? $scope.SupplierDetails.address.state.id : null),
                }
            },
            "active": true
        };
        debugger;
        var newSupplier = NewVendorSupplierService.NewSupplierDetails(newParam);
        newSupplier.then(function (success) {
            $scope.$close("Success");
            toastr.remove();
            toastr.success((success !== null) ? success.data.message : "Details saved successfully.", "Confirmation");           
        }, function (error) {
            toastr.remove();
            toastr.error((error !== null) ? error.data.errorMessage : "Something is wrong. please try again..", "Error");
        });
    }

    $scope.cancel = cancel;
    function cancel()
    {
        $scope.$close();
    };
});