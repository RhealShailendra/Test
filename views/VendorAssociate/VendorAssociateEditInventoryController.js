angular.module('MetronicApp').controller('VendorAssociateEditInventoryController', function ($translate, $translatePartialLoader, $scope, $state, settings, $location, VendorAssociateInventoryService) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    $translatePartialLoader.addPart('VendorAssociateEditInventory');
    $translate.refresh();
    $scope.ErrorMessage = "";
    $scope.ItemDetails;
    $scope.ItemTypeList = [];

    $scope.date = new Date();
    function init() {
        var GetItemTypeList = VendorAssociateInventoryService.GetItemTypeList();
        GetItemTypeList.then(function (success) { $scope.ItemTypeList = success.data.data; }, function (error) { $scope.ErrorMessage = error.data.errorMessage; })
        var ItemId = sessionStorage.getItem("VendorAssociateCatalogItemId");
        
        if (ItemId !== null && angular.isDefined(ItemId) && ItemId !== "undefined") {
            var ParamItemId = { "id": ItemId };
            var GetItemDetails = VendorAssociateInventoryService.GetItemDetails(ParamItemId);
            GetItemDetails.then(function (success) {  $scope.ItemDetails = success.data.data; }, function (error) {  $scope.ErrorMessage = error.data.errorMessage; });
        }
    }

    init();


    //Save item details for add and edit too 
    $scope.SaveCatalogToInventory = SaveCatalogToInventory;
    function SaveCatalogToInventory(ev) {
        var ParamItemDetails = {
            "id": $scope.ItemDetails.id,
            "itemName": $scope.ItemDetails.itemName,
            "model": $scope.ItemDetails.model,
            "itemType": {
                "id": $scope.ItemDetails.itemType.id
            },
            "description": $scope.ItemDetails.description,
            "vendorId": 27653,  //sessionStorage.getItem("UserId"),
            "unitPrice": $scope.ItemDetails.unitPrice,
            "discountPercent": $scope.ItemDetails.discountPercent,
            "taxRate": $scope.ItemDetails.taxRate,
            "stockUnit": $scope.ItemDetails.stockUnit,
            "isAvailable": $scope.ItemDetails.isAvailable,
            "supplierName": $scope.ItemDetails.supplierName
        };
        
        var msg = "";
        var SaveItem = VendorAssociateInventoryService.SaveItem(ParamItemDetails);
        SaveItem.then(function (success) {
            toastr.remove();
            toastr.success(success.data.message, "Confirmation");

        }, function (error) {           
            toastr.remove();
            toastr.error(error.data.errorMessage, "Error");
        })
    }
    //Go back to inventory
    $scope.GotoInventoryItem = GotoInventoryItem;
    function GotoInventoryItem() {
        $location.url('VendorAssociateInventory');
    }
    $scope.goToDashboard = function () {
        $location.url('VendorAssociateDashboard');
    }
    //init();
});