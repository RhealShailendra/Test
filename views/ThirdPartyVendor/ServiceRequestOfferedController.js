angular.module('MetronicApp').controller('ServiceRequestOfferedController', function ($translate, $translatePartialLoader, $rootScope, $scope,
    ServiceRequestOfferedService, $location) {

    $translatePartialLoader.addPart('ServiceRequest');
    $translate.refresh();
    $scope.ServiceRequestList = [];
    $scope.newService = false;
    $scope.ServiceOfferedId = [];

    $scope.GoToHome = function () {

        $location.url(sessionStorage.getItem('HomeScreen'));
    }
    function init() {
        getServiceRequestForVendor();
        var param = {
            "id": sessionStorage.getItem("VendorId")
        };
        var ServiceRequestList = ServiceRequestOfferedService.GetServiceCategory(param);
        ServiceRequestList.then(function (success) { $scope.ServiceRequestListDDL = success.data.data; }, function (error)
        {

        });
    }
    init();
    //Add new 
    $scope.ShowNewService = function (flag) {
        $scope.newService = flag;
        $scope.ServiceOfferedId = [];
    };
    //Remove service request
    $scope.DeleteServiceRequest = function (item) {
        bootbox.confirm({
            size: "",
            title: $translate.instant('Delete Service Request'),
            message: $translate.instant('Are you sure you want to delete this service?'), closeButton: false,
            className: "modalcustom", buttons: {
                confirm: {
                    label: $translate.instant('Yes'),
                    className: 'btn-success'
                },
                cancel: {
                    label: $translate.instant('No'),
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                if (result) {
                    var param = {
                        "vendor": {
                            "vendorId": sessionStorage.getItem("VendorId")
                        },
                        "listVendorServiceCategory": [
                         {
                             "id": item.id,
                             "isAvailable": false
                         }
                        ]
                    };
                    var RemoveServiceRequestList = ServiceRequestOfferedService.DeleteServiceCategoryForVendor(param);
                    RemoveServiceRequestList.then(function (success) {
                        getServiceRequestForVendor();
                        toastr.remove();
                        toastr.success(((success !== null) ? success.data.message : $translate.instant('Service request removed successfully.')), "Confiramtion");
                    }, function (error) {
                        toastr.remove();
                        toastr.error(((error !== null) ? error.data.errorMessage : $translate.instant('Failed to remove the service request.')), "error");
                    });
                }
            }
        });
    }

    $scope.NewServiceCategory = function () {
        if ($scope.ServiceOfferedId.length > 0) {
            var ServiceIdObj = [];
            angular.forEach($scope.ServiceOfferedId, function (item) {
                ServiceIdObj.push({
                    "service": {
                        "id": item
                    },
                    "description": null
                });
            });

            var param = {
                "vendor": {
                    "vendorId": sessionStorage.getItem("VendorId")
                },
                "listVendorServiceCategory": ServiceIdObj
            };


            var AddnewService = ServiceRequestOfferedService.NewServiceCategoryForVendor(param)
            AddnewService.then(function (error) { getServiceRequestForVendor(); $scope.newService = false; }, function (error) {
                toastr.remove();
                toastr.error(((error !== null) ? error.data.errorMessage : $translate.instant('Something goes wrong, please try again.')), "Error");
            });
        }
        else {
            toastr.remove();
            toastr.warning("Please select service request category.", "Warning");

        }
    }

    function getServiceRequestForVendor() {
        var param = {
            "vendor": {
                "vendorId": sessionStorage.getItem("VendorId")
            }
        };
        var GetServiceRequestList = ServiceRequestOfferedService.getServiceCategoryForVendor(param);
        GetServiceRequestList.then(function (success) {  $scope.ServiceRequestList = success.data.data; }, function (error) {
            toastr.remove();
            toastr.error(((error !== null) ? error.data.errorMessage : $translate.instant('Something goes wrong, please try again.')), "Error");
        });
    }

    $scope.RemoveServiceRequest = function (item) {
        bootbox.confirm({
            size: "",
            title: $translate.instant('Remove Service Request'),
            message: $translate.instant('Are you sure you want to make this service un-available?'), closeButton: false,
            className: "modalcustom", buttons: {
                confirm: {
                    label: $translate.instant('Yes'),
                    className: 'btn-success'
                },
                cancel: {
                    label: $translate.instant('No'),
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                if (result) {
                    var param = {
                        "vendor": {
                            "vendorId": sessionStorage.getItem("VendorId")
                        },
                        "listVendorServiceCategory": [
                         {
                             "id": item.id,
                             "service": {
                                 "id": item.service.id
                             },
                             "isAvailable": false,
                             "description": null
                         }
                        ]
                    };
                    var RemoveServiceRequestList = ServiceRequestOfferedService.RemoveServiceCategoryForVendor(param);
                    RemoveServiceRequestList.then(function (success) {
                        getServiceRequestForVendor();
                        toastr.remove();
                        toastr.success(((success !== null) ? success.data.message : $translate.instant('Service request removed successfully.')), "Confiramtion");
                    }, function (error) {
                        toastr.remove();
                        toastr.error(((error !== null) ? error.data.errorMessage : $translate.instant('Failed to remove the service request.')), "error");
                    });
                }
            }
        });
    }
});
