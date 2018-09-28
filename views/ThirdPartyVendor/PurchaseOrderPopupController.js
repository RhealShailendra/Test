angular.module('MetronicApp').controller('PurchaseOrderPopupController', function ($translate, $translatePartialLoader, $rootScope, $log, $scope, $window, settings, $http, $timeout, $uibModal, $location, $filter, ItemObj) {
    //Cancel
     
    $scope.cancelPopup = function () {
        $scope.$close();
    };
    var itemID = 1;
    $scope.PostLossItemList = ItemObj
    $scope.PurchaseOrderAddEdit = false;
    $scope.GetPurchaseOrder = function (itemID, description,itemNumber) {
        var item =
            {
                id: itemID,
                description: description,
                itemNumber: itemNumber
            }
        $scope.$close(item);
    };


    


});