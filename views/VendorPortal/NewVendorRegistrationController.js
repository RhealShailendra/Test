angular.module('MetronicApp').controller('NewVendorRegistrationController', function ($rootScope, NewVendorRegistrationService, $uibModal, $scope, $translate, $translatePartialLoader) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    $translatePartialLoader.addPart('NewVendorRegistration');
    $translate.refresh();
    $scope.NewVendor = {};
    $scope.ContactDeatils = [{ id: null, email: '', firstName: '', lastName: '' }];
    $scope.counter = 0;
    $scope.PhoneNumbers = [{ Type: '', PhoneNo: '' }];
    $scope.phonecounter = 0;
    $scope.ddlStateList = [];
    $scope.commObj = { "BillingState": null, "ShippingState": null };
    $scope.NewVendor.vendorId = null;

    init();
    function init() {
        var getStateList = NewVendorRegistrationService.getStates();
        getStateList.then(function (success) {
            $scope.ddlStateList = success.data.data;
        }, function (error) {
            $scope.ErrorMessage = error.data.errorMessage;
        });
    }
    //Dynamically adding textboxes

    $scope.AddContactPerson = function (index, contact) {
        $scope.ContactDeatils.push({ id: null, email: '', firstName: '', lastName: '', phoneNumber: '' });
    };

    $scope.RemoveContactPerson = function (index, contact) {
        $scope.ContactDeatils.splice(index, 1);
    };


    $scope.RemovePhone = function (index) {
        $scope.PhoneNumbers.splice(index, 1)
    };

    $scope.AddPhone = function () {
        if ($scope.PhoneNumbers.length < 2)
            $scope.PhoneNumbers.push({ Type: '', PhoneNo: '' });
    }

    $scope.AddNewVendor = function () {
        $scope.DayTime = null;
        $scope.EveningTime = null;
        $scope.Cell = null;
        $scope.tempSpecialtyOfSpecialist = [];
        angular.forEach($scope.PhoneNumbers, function (phone) {
            if (phone.Type == "Work") {
                $scope.DayTime = phone.PhoneNo
            }
            else if (phone.Type == "Other") {
                $scope.Cell = phone.PhoneNo;
            }
        });
        var param = {
            "vendorName": $scope.NewVendor.SupplierName,
            "billingAddress": {
                "id": null,
                "streetAddressOne": $scope.NewVendor.BillingAddressLine1,
                "streetAddressTwo": $scope.NewVendor.BillingAddressLine2,
                "city": $scope.NewVendor.BillingCity,
                "state": {
                    "id": $scope.commObj.BillingState
                },
                "zipcode": $scope.NewVendor.BillingZipCode
            },
            "shippingAddress": {
                "id": null,
                "streetAddressOne": $scope.NewVendor.ShippingAddressLine1,
                "streetAddressTwo": $scope.NewVendor.ShippingAddressLine2,
                "city": $scope.NewVendor.ShippingCity,
                "state": {
                    "id": $scope.commObj.ShippingState
                },
                "zipcode": $scope.NewVendor.ShippingZipCode
            },
            "contactPersons": [
              {
                  "email": $scope.NewVendor.Email,
                  "firstName": $scope.NewVendor.FirstName,
                  "lastName": $scope.NewVendor.LastName,
                  "workPhoneNumber": $scope.NewVendor.Phone,
                  "mobilePhoneNumber": $scope.NewVendor.Mobile,
                  "faxNumber": (($scope.NewVendor.Fax !== null && angular.isDefined($scope.NewVendor.Fax)) ? $scope.NewVendor.Fax : null)
              }
            ],
            "dayTimePhone": $scope.DayTime,
            "faxNumber": $scope.Cell,
            "isActive": true,
            "isTemporary": false,
            "website": $scope.NewVendor.Website
        };
        var addNewVendor = NewVendorRegistrationService.addVendor(param);
        addNewVendor.then(function (success) {
            if (success.data !== null) {
                toastr.remove();
                toastr.success(success.data.message, "Confirmation");
            } else {
                toastr.remove();
                toastr.success("Vendor register successfully.", "Confirmation");
            }
        }, function (error) {
            if (error.data !== null) {
                toastr.remove();
                toastr.error(error.data.errorMessage, "Error");
            }
            else
            {
                toastr.remove();
                toastr.error("Failed to register vendor.", "Error");
            }
        });


    }
});