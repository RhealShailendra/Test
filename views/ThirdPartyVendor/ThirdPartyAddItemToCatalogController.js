angular.module('MetronicApp').controller('ThirdPartyAddItemToCatalogController', function ($translate, $translatePartialLoader, $scope, $state, settings, $location, ThirdPartyCatalogService) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    $translatePartialLoader.addPart('AddNewItemToCatalog');
    $translate.refresh();
    $scope.ErrorMessage = "";
    $scope.ItemDetails = {};
    $scope.ItemTypeList = [];
    $scope.IncidentImages = [];
    $scope.InventoryStatusList=[{id:2,status:"Available"}]
    $scope.date = new Date();
    function init() {
        
        var GetItemTypeList = ThirdPartyCatalogService.GetItemTypeList();
        GetItemTypeList.then(function (success) { $scope.ItemTypeList = success.data.data; }, function (error) { $scope.ErrorMessage = error.data.errorMessage; })
        var ItemId = sessionStorage.getItem("ThirdPartyCatalogItemId");

        if (ItemId !== null && angular.isDefined(ItemId) && ItemId !== "undefined") {
            var ParamItemId = { "id": ItemId };
            // var ParamItemId = { "id": 8 };
            var GetItemDetails = ThirdPartyCatalogService.GetItemDetails(ParamItemId);
            GetItemDetails.then(function (success) {

                $scope.ItemDetails = success.data.data;
                angular.forEach($scope.ItemDetails.itemImages, function (value, key) {
                    $scope.IncidentImages.push({ "FileName": value.name, "extension": null, "fileType": null, "Image": value.url, "File": value.url })
                });

            }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });
        }
        else {

            $scope.ItemDetails.createBy =
                {
                    firstName: sessionStorage.getItem("UserFirstName"),
                    lastName: sessionStorage.getItem("UserLastName")
                };
        }
    }


    
    //Save item details for add and edit too 
    $scope.SaveCatalogToCatalog = SaveCatalogToCatalog;
    function SaveCatalogToCatalog(ev) {

        if (sessionStorage.getItem("ThirdPartyCatalogItemId") !== null && sessionStorage.getItem("ThirdPartyCatalogItemId") !== "undefined") {

            $scope.vendorCatalogItemDetails = {
                "auxiliaryPartNumber": $scope.ItemDetails.auxiliaryPartNumber,
                "brand": $scope.ItemDetails.brand,
                "catalogItemType": {
                    "id": $scope.ItemDetails.category.id
                },
                "id": sessionStorage.getItem("ThirdPartyCatalogItemId"),
                "contract": $scope.ItemDetails.contract,           
                "currency": $scope.ItemDetails.currency,
                "description": $scope.ItemDetails.description,                
                "itemName": $scope.ItemDetails.itemName,
                "itemNumber": $scope.ItemDetails.itemNumber,
                "leadTime": (angular.isDefined($scope.ItemDetails.leadTime) && $scope.ItemDetails.leadTime !== null) ? $scope.ItemDetails.leadTime : null,
                "model": $scope.ItemDetails.model,
                "partNumber": $scope.ItemDetails.partNumber,
                "price": $scope.ItemDetails.price,
                "pricingType": "FIXED",
                "savingsPercent": $scope.ItemDetails.savingsPercent,
                "vendorCatalog": {
                    "id": sessionStorage.getItem("catalogId")
                },
                "quantity": $scope.ItemDetails.quantity,
                "inventryStatus": {
                    "id": (angular.isDefined($scope.ItemDetails.inventryStatus) && $scope.ItemDetails.inventryStatus !== null) ? $scope.ItemDetails.inventryStatus.id :2,
                    "status": (angular.isDefined($scope.ItemDetails.inventryStatus) && $scope.ItemDetails.inventryStatus !== null) ? $scope.ItemDetails.inventryStatus.status : "Available",
                }
            }
            var filesDetails = [];

            var param = new FormData();
            param.append("vendorCatalogItemDetails", JSON.stringify($scope.vendorCatalogItemDetails));
            for (var i = 0; i < $scope.IncidentImages.length; i++) {
                if ($scope.IncidentImages[i].extension != null && angular.isDefined($scope.IncidentImages[i].extension)) {
                    filesDetails.push({
                        "fileName": $scope.IncidentImages[i].FileName,
                        "fileType": $scope.IncidentImages[i].fileType,
                        "extension": $scope.IncidentImages[i].extension,
                        "filePurpose": "VENDOR CATALOG ITEM"
                    })
                    param.append('file', $scope.IncidentImages[i].File);
                }

            }
            param.append("filesDetails", JSON.stringify(filesDetails));
            var msg = "";
            var SaveItem = ThirdPartyCatalogService.SaveItem(param);
            SaveItem.then(function (success) {
                toastr.remove();
                toastr.success("Catalog item added successfully.", "Confirmation"); sessionStorage.setItem("IsEdit", "Edit");
                $location.url('ThirdPartyVendorCatalog');

            }, function (error) {
                toastr.remove();
                toastr.error('Failed to add details. Please try again..', "Error"); sessionStorage.setItem("IsEdit", "Edit");
                $location.url('ThirdPartyVendorCatalog');
            })
        }
        else {
            $scope.vendorCatalogItemDetails = {
                "auxiliaryPartNumber": $scope.ItemDetails.auxiliaryPartNumber,
                "brand": $scope.ItemDetails.brand,
                "catalogItemType": {
                    "id": $scope.ItemDetails.category.id
                },
                "id": null,
                "contract": $scope.ItemDetails.contract,               
                "currency": $scope.ItemDetails.currency,
                "description": $scope.ItemDetails.description,              
                "itemName": $scope.ItemDetails.itemName,
                "itemNumber": $scope.ItemDetails.itemNumber,
                "leadTime": (angular.isDefined($scope.ItemDetails.leadTime) && $scope.ItemDetails.leadTime!==null)?$scope.ItemDetails.leadTime:null,
                "model": $scope.ItemDetails.model,
                "partNumber": $scope.ItemDetails.partNumber,
                "price": $scope.ItemDetails.price,
                "pricingType": "FIXED",
                "savingsPercent": $scope.ItemDetails.savingsPercent,
                "vendorCatalog": {
                    "id": sessionStorage.getItem("catalogId")
                },
                "quantity": $scope.ItemDetails.quantity,
                "inventryStatus":{
                    "id": 2,
                    "status": "Available"
                }
            }
            var filesDetails = [];

            var param = new FormData();
            param.append("vendorCatalogItemDetails", JSON.stringify($scope.vendorCatalogItemDetails));
            for (var i = 0; i < $scope.IncidentImages.length; i++) {
                filesDetails.push({
                    "fileName": $scope.IncidentImages[i].FileName,
                    "fileType": $scope.IncidentImages[i].fileType,
                    "extension": $scope.IncidentImages[i].extension,
                    "filePurpose": "VENDOR CATALOG ITEM"
                })
                param.append('file', $scope.IncidentImages[i].File);
            }
            param.append("filesDetails", JSON.stringify(filesDetails));
            var msg = "";
            var SaveItem = ThirdPartyCatalogService.SaveItem(param);
            SaveItem.then(function (success) {
                sessionStorage.setItem("ThirdPartyCatalogItemId", null)
                toastr.remove();
                toastr.success("Catalog item updated successfully.", "Confirmation");
                sessionStorage.setItem("IsEdit", "Edit");
                $location.url('ThirdPartyVendorCatalog');
            }, function (error) {

                toastr.remove();
                toastr.error('Failed to update details. Please try again..', "Error");
                sessionStorage.setItem("IsEdit", "Edit");
                $location.url('ThirdPartyVendorCatalog');
            })
        }
    }

    //Update item details
    $scope.UpdateItemDetails = UpdateItemDetails;
    function UpdateItemDetails() {
        var SaveItem = ThirdPartyCatalogService.UpdateItem(ParamItemDetails);
    }

    $scope.uploadImage = uploadImage;
    function uploadImage(event) {
        var files = event.target.files;
        $scope.filed = event.target.files;
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var reader = new FileReader();
            reader.file = file;
            reader.fileName = files[i].name;
            reader.fileType = files[i].type;
            reader.fileExtension = files[i].name.substr(files[i].name.lastIndexOf('.'));
            reader.onload = $scope.imageIsLoaded;
            reader.readAsDataURL(file);
        }
    }
    $scope.imageIsLoaded = function (e) {
        $scope.$apply(function () {
            $scope.IncidentImages.push({ "FileName": e.target.fileName, "extension": e.target.fileExtension, "fileType": e.target.fileType, "Image": e.target.result, "File": e.target.file })
        });
    }

    $scope.RemoveImage = RemoveImage;
    function RemoveImage(item) {

        var index = $scope.IncidentImages.indexOf(item);

        if (index > -1) {

            $scope.IncidentImages.splice(index, 1);
        }
    }

    //Open file upload control
    $scope.FireUploadEvent = FireUploadEvent;
    function FireUploadEvent() {
        angular.element('#FileUpload').trigger('click');
    }

    //Go back to inventory
    $scope.GotoBack = GotoBack;
    function GotoBack() {
        sessionStorage.setItem("ThirdPartyCatalogItemId", null)
        sessionStorage.setItem("IsEdit", "Edit");
        $location.url('ThirdPartyVendorCatalog');
    }
    init();

    $scope.GoToHome=function()
    {
        $location.url(sessionStorage.getItem('HomeScreen'));
    }

  
});