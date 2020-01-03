angular.module('MetronicApp').controller('EditThirdPartyVendorController', function ($rootScope, $log, $scope,
    settings, $http, $timeout, $location, $translate, $translatePartialLoader) {

    //set language
    $translatePartialLoader.addPart('EditThirdPartyVendor');
    $translate.refresh();
    $scope.category1 = [{ Category: 'Catogery1' }, { Category: 'Catogery2' }, { Category: 'Catogery3' }, { Category: 'Catogery4' }, { Category: 'Catogery5' }];
    $scope.category2 = [{ Category: 'Catogery41' }, { Category: 'Catogery42' }, { Category: 'Catogery43' }];

    $scope.GoBack = GoBack;
    function GoBack()
    {
        $location.url('AdministratorThirdPartyVendor');
    }

    $scope.SaveRecord = SaveRecord;
    function SaveRecord()
    {
        bootbox.alert({
            size: "",
            title: "Supplier Information", closeButton: false,
            message: "Supplier Information Saved Successfully..!!!",
            className: "modalcustom",
            callback: function () { /* your callback code */ }
        });
    }
    $scope.UpdateRecord = UpdateRecord;
    function UpdateRecord() {
        bootbox.alert({
            size: "", closeButton: false,
            title: "Update Supplier Information",
            message: "Supplier Information Updated Successfully..!!!",
            className: "modalcustom",
            callback: function () { /* your callback code */ }
        });
    }


    //Dynamically adding textboxes

    $scope.ContactDeatils = [];
    $scope.counter = 0;

    $scope.PhoneNumbers = [];
    $scope.phonecounter = 0;
    $scope.AddRow = function (type) {
        if (type == 'contactdetails') {
            $scope.ContactDeatils.push($scope.counter)
            $scope.counter = parseInt($scope.counter) + 1;
        }
        else {
            $scope.PhoneNumbers.push($scope.phonecounter)
            $scope.phonecounter = parseInt($scope.phonecounter) + 1;
        }

    }

    $scope.RemoveRow = function (row, type) {
        if (type == 'contactdetails') {
            $scope.ContactDeatils.splice(row, 1)   //1 -removes item , 0- adds item
        }
        else {
            $scope.PhoneNumbers.splice(row, 1)
        }

    }
});