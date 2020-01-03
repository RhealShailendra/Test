angular.module('MetronicApp').controller('VendorSupplierController', function ($rootScope, $scope,
    $location, $state, $translate, $translatePartialLoader, VendorSupplierService) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    //set language
    $translatePartialLoader.addPart('VendorSupplier');
    $translate.refresh();
    $scope.pagesize = $rootScope.settings.pagesize;

    $scope.SupplierList = [];

    function init()
    {
        var SupplierGet = VendorSupplierService.GetSupplier();
        SupplierGet.then(function (success) { $scope.SupplierList = success.data.data; }, function (error) { });
    }
    init();
    //Sorting of datatbale
    $scope.sortKey = "id";
    $scope.sort = true;
    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed      
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

    $scope.AddEditSupplier = AddEditSupplier;
    function AddEditSupplier(id)
    {
        if (angular.isDefined(id) && id !== null)
        {
            sessionStorage.setItem("SupplierId", id);
            $location.url('NewVendorSupplier');
        }
        else
        {
            sessionStorage.setItem("SupplierId", null);
            $location.url('NewVendorSupplier');

        }
    }

    $scope.ChangeStatus=ChangeStatus;
    function ChangeStatus(id, status) {
        var paramStatus = {
            "id": id,
            "active": status
        }
        var ChangeStatusSp = VendorSupplierService.ChangeSupplierStatus(paramStatus);
        ChangeStatusSp.then(function (success) {
            init();
            toastr.remove();
            toastr.success((success !== null) ? success.data.message : "Your request has been updated successfully.", "Confirmation");

        }, function (error) {
            toastr.remove();
            toastr.error((error !== null) ? error.data.errorMessage : "Something went wrong. please try again.", "Error");
        });
    }
    $scope.LoadFromFile = LoadFromFile;
    function LoadFromFile() {
        $location.url('UploadVendorSupplier');
    }
});