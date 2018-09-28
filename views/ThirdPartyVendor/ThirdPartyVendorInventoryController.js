angular.module('MetronicApp').controller('ThirdPartyVendorInventoryController', function ($translate, $translatePartialLoader, $rootScope, $log, $scope,
    settings, $filter, ThirdPartyVendorInventoryService, $location) {
    $scope.items = $rootScope.items; $scope.boolValue = true;
    $translatePartialLoader.addPart('ThirdPartyInventory');
    $translate.refresh();   
    $scope.pagesize = $rootScope.pagesize;
    $scope.ErrorMessage = "";
    $scope.InventoryList = [];
    $scope.FilteredInventoryList = [];
    $scope.CategoryList = [];
    $scope.ItemFilter ="ALL" ;
    $scope.search = "";
    function init()
    {
        //Get Inventory List
        var VendorIdParam = {
            "vendorId": sessionStorage.getItem("UserId")
        };
        var GetInventoryList = ThirdPartyVendorInventoryService.GetInventoryList(VendorIdParam);
        GetInventoryList.then(function (success) {$scope.InventoryList = success.data.data; $scope.FilteredInventoryList = success.data.data;}, function (error) { $scope.ErrorMessage = error.data.errorMessage; })

       // Get category list (Confirm about ItemType)
        var GetCategoryList = ThirdPartyVendorInventoryService.GetCategoryList();
        GetCategoryList.then(function (success) { $scope.CategoryList = success.data.data; }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });
    }
    init();

    //Filter list on category
    $scope.FilterInventoryItems = FilterInventoryItems;
    function FilterInventoryItems()
    {
        if ($scope.ItemFilter === "ALL")
        {
            $scope.FilteredInventoryList = angular.copy($scope.InventoryList);
        }
        else
        {
            $scope.FilteredInventoryList = $filter('filter')($scope.InventoryList, { itemType: {name: $scope.ItemFilter}});           
        }
    }
    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }
    //Edit Items
    $scope.EditItem = EditItem;
    function EditItem(itemId)
    {
        sessionStorage.setItem("ThirdPartyCatalogItemId", itemId)
        $location.url('ThirdPartyAddItemToInventory');
    }

    //Uload excel file for catalog
    $scope.uploadExcelCatalog = uploadExcelCatalog;
    function uploadExcelCatalog(event)
    {
        var listExtension = [".xlsx", ".xls",".ods"];
        var Index = 0;
        var files = event.target.files;
        var reader = new FileReader();
        reader.file = files[0];
        var Extension = files[0].name.substr(files[0].name.lastIndexOf('.'));
        for (var i = 0; i < listExtension.length; i++) {
            if (listExtension[i] === Extension) {
                Index++;
            }
        }
        if (Index > 0)
        {
            reader.onload = $scope.FileIsLoaded;
            reader.readAsDataURL(files[0]);
        }
        else
        {
            toastr.remove();
            toastr.warning("Please selete .xlsx or .xls or .ods ", "File type");
        }
    }
    $scope.FileIsLoaded = function (e)
    {
            var ParamFile = new FormData();
            ParamFile.append("file",e.target.file);
            var UploadCatalofFile = ThirdPartyVendorInventoryService.UploadCatalofFile(ParamFile);
            UploadCatalofFile.then(function (success) {   
                toastr.remove();
                toastr.success(success.data.message, "Confirmation");
            }, function (error) {
                toastr.remove();
                toastr.error(error.data.errorMessage, "Error");
            });
    }
    $scope.OpenFileUpload = OpenFileUpload;

    function OpenFileUpload()
    {
        angular.element('#FileUpload').trigger('click');
    }

});