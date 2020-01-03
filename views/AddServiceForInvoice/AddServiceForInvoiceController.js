angular.module('MetronicApp').controller('AddServiceForInvoiceController', function ($rootScope,
    $scope, $uibModal, $translate, $translatePartialLoader,  objItemDetails) {
    $scope.Cancel = function () {
        $scope.$close();
    };
    function init() {       
        $scope.ReplacementItemList = objItemDetails.items;      
        $scope.selectedItem = {};
    }
    init();
    $scope.Ok = function () {
       
        $scope.$close($scope.selectedItem);
    };
    $scope.Cancel=function()
    {
        $scope.$close();
    }

    $scope.SelectItem = SelectItem;
    function SelectItem(item)
    {       
        $scope.selectedItem = angular.copy(item);
        $scope.$close($scope.selectedItem);
    }
});