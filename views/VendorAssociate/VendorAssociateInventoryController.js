angular.module('MetronicApp').controller('VendorAssociateInventoryController', function ($translate, $translatePartialLoader, $rootScope, $log, $scope,
    settings, $filter, $location, VendorAssociateInventoryService) {
    $scope.items = $rootScope.items; $scope.boolValue = true;
    $translatePartialLoader.addPart('VendorAssociateInventory');
    $translate.refresh();
    $scope.pagesize = $rootScope.pagesize;
    $scope.ErrorMessage = "";
    $scope.InventoryList = [];
    $scope.FilteredInventoryList = [];
    $scope.CategoryList = [];
    $scope.ItemFilter = "ALL";
    $scope.search = "";
    function init() {
        //Get Inventory List
        var VendorIdParam = {        
           "vendorId": sessionStorage.getItem("UsedId")
        };
        var GetInventoryList = VendorAssociateInventoryService.GetInventoryList(VendorIdParam);
        GetInventoryList.then(function (success) { $scope.InventoryList = success.data.data; $scope.FilteredInventoryList = success.data.data; }, function (error) { $scope.ErrorMessage = error.data.errorMessage; })

        // Get category list (Confirm about ItemType)
        var GetCategoryList = VendorAssociateInventoryService.GetCategoryList();
        GetCategoryList.then(function (success) { $scope.CategoryList = success.data.data; }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });
    }
    init();

    ////Filter list on category
    $scope.FilterInventoryItems = FilterInventoryItems;
    function FilterInventoryItems() {
        if ($scope.ItemFilter === "ALL") {
            $scope.FilteredInventoryList = angular.copy($scope.InventoryList);
        }
        else {
            $scope.FilteredInventoryList = $filter('filter')($scope.InventoryList, { itemType: { name: $scope.ItemFilter } });
        }
    }

    $scope.sort = sort;
    function sort(keyname) {
        $scope.sortKey = keyname;   //set the sortkey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }
    ////Edit Items
    $scope.EditItem = EditItem;
    function EditItem(itemId) {
        sessionStorage.setItem("VendorAssociateCatalogItemId", itemId)
        $location.url('VendorAssociateEditInventory');
    }

    ////Uload excel file for catalog
    //$scope.uploadExcelCatalog = uploadExcelCatalog;
    //function uploadExcelCatalog(event) {
    //    var listExtension = [".xlsx", ".xls", ".ods"];
    //    var Index = 0;
    //    var files = event.target.files;
    //    var reader = new FileReader();
    //    reader.file = files[0];
    //    var Extension = files[0].name.substr(files[0].name.lastIndexOf('.'));
    //    for (var i = 0; i < listExtension.length; i++) {
    //        if (listExtension[i] === Extension) {
    //            Index++;
    //        }
    //    }
    //    if (Index > 0) {
    //        reader.onload = $scope.FileIsLoaded;
    //        reader.readAsDataURL(files[0]);
    //    }
    //    else {
    //        bootbox.alert({
    //            size: "", closeButton: false,
    //            title: $translate.instant('FileUpload.Title'),
    //            message: $translate.instant('FileUpload.InvalidTypeMessage'),
    //            className: "modalcustom",
    //            callback: function () { /* your callback code */ }
    //        });
    //    }
    //}
    //$scope.FileIsLoaded = function (e) {
    //    var ParamFile = new FormData();
    //    ParamFile.append("file", e.target.file);
    //    var UploadCatalofFile = ThirdPartyVendorInventoryService.UploadCatalofFile(ParamFile);
    //    UploadCatalofFile.then(function (success) {
    //        bootbox.alert({
    //            size: "", closeButton: false,
    //            title: $translate.instant('FileUpload.Title'),
    //            message: $translate.instant('FileUpload.Message'),
    //            className: "modalcustom",
    //            callback: function () { /* your callback code */ }
    //        });
    //    }, function (error) {
    //        if (error.data !== null) {
    //            bootbox.alert({
    //                size: "", closeButton: false,
    //                title: $translate.instant('FileUpload.Title'),
    //                message: error.data.message,
    //                className: "modalcustom",
    //                callback: function () { /* your callback code */ }
    //            });
    //        }
    //        else {
    //            bootbox.alert({
    //                size: "", closeButton: false,
    //                title: $translate.instant('FileUpload.Title'),
    //                message: $translate.instant('FileUpload.ErroMessage'),
    //                className: "modalcustom",
    //                callback: function () { /* your callback code */ }
    //            });
    //        }
    //    });
    //}

    $scope.OpenFileUpload = OpenFileUpload;
    function OpenFileUpload() {
        angular.element('#FileUpload').trigger('click');
    }

    $scope.goToDashboard = function () {
        $location.url('VendorAssociateDashboard');
    }
});