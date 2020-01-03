angular.module('MetronicApp').controller('AssociateVendorCatalogController', function ($translate, $translatePartialLoader, $rootScope, $log, $scope,
    settings, $filter, $location, ThirdPartyCatalogService) {
    $scope.items = $rootScope.items; $scope.boolValue = true;
    $translatePartialLoader.addPart('ThirdPartyCatalog');
    $translate.refresh();
    $scope.pagesize = $rootScope.pagesize;
    $scope.Catalogpagesize = 10;
    $scope.ErrorMessage = "";
    $scope.InventoryList = [];
    $scope.FilteredInventoryList = [];
    $scope.catalogsList = [];
    $scope.CategoryList = [];
    $scope.ItemFilter = "ALL";
    $scope.search = "";
    $scope.showNewCatalog = false;
    $scope.IsEdit = false;
    $scope.catalogItemsList = [];
    $scope.CatalogDetails = {
        "catalogName": "",
        "expirationDate": "",
        "startDate": "",
        "submitDate": "",
        "status": {
            "id": 1
        }
    };
    function init() {
        //Get Inventory List
        $scope.IsEdit = false;
        var VendorIdParam = {
            "vendorId": sessionStorage.getItem("UserId")
        };
        
        if (sessionStorage.getItem("IsEdit") == "Edit") {
            $scope.IsEdit = true;
            $scope.showNewCatalog = true;
            $scope.CatalogDetails = {
                "id": sessionStorage.getItem("catalogId"),
                "catalogName": "",
                "expirationDate": "",
                "startDate": "",
                "submitDate": "",
                "status": {
                    "id": 2
                }


            };
            EditCatalog($scope.CatalogDetails);
        }

        GetCatalogList();
        //var param = {
        //    "vendorId": sessionStorage.getItem("VendorId")
        //};
        //var GetCatalogList = ThirdPartyCatalogService.GetCatalogs(param);
        //GetCatalogList.then(function (success) { $scope.catalogsList = success.data.data; },
        //    function (error)
        //    { $scope.ErrorMessage = error.data.errorMessage; })

    }
    init();

    $scope.GetCatalogList = GetCatalogList;
    function GetCatalogList() {

        var param = {
            "vendorId": sessionStorage.getItem("VendorId")
        };
        
        var GetCatalogList = ThirdPartyCatalogService.GetCatalogs(param);
        GetCatalogList.then(function (success) {
          
            $scope.catalogsList = success.data.data;
            
        },
            function (error)
            { $scope.ErrorMessage = error.data.errorMessage; })
    }

    //Filter list on category
    $scope.FilterInventoryItems = FilterInventoryItems;
    function FilterInventoryItems() {
        if ($scope.ItemFilter === "ALL") {
            $scope.FilteredInventoryList = angular.copy($scope.InventoryList);
        }
        else {
            $scope.FilteredInventoryList = $filter('filter')($scope.InventoryList, { itemType: { name: $scope.ItemFilter } });
        }
    } EditCatalog

    $scope.EditCatalog = EditCatalog
    function EditCatalog(item) {
        sessionStorage.setItem("catalogId", item.id)
        sessionStorage.setItem("item", item)

        var catalogStatusList = ThirdPartyCatalogService.GetCatalogSatusList();
        catalogStatusList.then(function (success) { $scope.catalogStatusList = success.data.data; },
            function (error)
            { $scope.ErrorMessage = error.data.errorMessage; })

        var param = {
            "id": item.id
        };
        var GetInventoryList = ThirdPartyCatalogService.GetCatalogItemList(param);
        GetInventoryList.then(function (success) { $scope.catalogItemsList = success.data.data; $scope.FilteredInventoryList = success.data.data; }, function (error) { $scope.ErrorMessage = error.data.errorMessage; })

        $scope.IsEdit = true;
        $scope.showNewCatalog = true;
        $scope.CatalogDetails = {
            "id": item.id,
            "catalogName": item.catalogName,
            "expirationDate": $filter('DateFormatMMddyyyy')(item.expirationDate),
            "startDate": $filter('DateFormatMMddyyyy')(item.startDate),
            "submitDate": item.submitDate,
            "status": {
                "id": item.status.id
            }


        };
    }


    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

    $scope.sortCatalog = function (keyname) {
        $scope.CatalogsortKey = keyname;   //set the sortKey to the param passed
        $scope.Catalogreverse = !$scope.Catalogreverse; //if true make it false and vice versa
    }
    //Edit Items
    $scope.EditItem = EditItem;
    function EditItem(itemId) {

        sessionStorage.setItem("ThirdPartyCatalogItemId", itemId)
        $location.url('ThirdPartyAddItemToCatalog');
    }

    //Uload excel file for catalog
    $scope.uploadExcelCatalog = uploadExcelCatalog;
    function uploadExcelCatalog(event) {
        var listExtension = [".xlsx", ".xls", ".ods"];
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
        if (Index > 0) {
            reader.onload = $scope.FileIsLoaded;
            reader.readAsDataURL(files[0]);
        }
        else {
            toastr.remove();
            toastr.warning("Please select xls, xlsx Or csv file..", "File type");
        }
    }
    $scope.FileIsLoaded = function (e) {
        var ParamFile = new FormData();
        ParamFile.append("file", e.target.file);
        var UploadCatalofFile = ThirdPartyCatalogService.UploadCatalofFile(ParamFile);
        UploadCatalofFile.then(function (success) {
            toastr.remove();
            toastr.success(success.data.message, "Confirmation");
        }, function (error) {
            if (error.data !== null) {
                toastr.remove();
                toastr.error(error.data.errorMessage, "Error");
            }
            else {
                toastr.remove();
                toastr.error(error.data.errorMessage, "Error");
            }
        });
    }

    $scope.NewCatalog = NewCatalog
    function NewCatalog() {
        sessionStorage.setItem("catalogId", null)
        $scope.CatalogDetails = {
            "catalogName": "",
            "expirationDate": "",
            "startDate": "",
            "submitDate": "",
            "status": {
                "id": 1
            }
        };
        sessionStorage.setItem("IsEdit", null)
        $scope.IsEdit = false;
        $scope.showNewCatalog = true;
    }
    $scope.SaveCatalog = SaveCatalog
    function SaveCatalog() {

        $scope.CatalogDetails.submitDate = new Date();
        $scope.CatalogDetails.submitDate = $filter('date')($scope.CatalogDetails.submitDate, "MM/dd/yyyy");
        if (sessionStorage.getItem("catalogId") != null) {

            var param = {
                "catalogName": $scope.CatalogDetails.catalogName,
                "catalogNumber": null,
                "expirationDate": $filter('DatabaseDateFormatMMddyyyy')($scope.CatalogDetails.expirationDate),
                "id": sessionStorage.getItem("catalogId"),
                "startDate": $filter('DatabaseDateFormatMMddyyyy')($scope.CatalogDetails.startDate),
                "status": {
                    "id": $scope.CatalogDetails.status.id,
                    "name": null
                },
                "submitDate": $filter('DatabaseDateFormatMMddyyyy')($scope.CatalogDetails.submitDate)
            };




        }
        else {
            var param = {
                "catalogName": $scope.CatalogDetails.catalogName,
                "catalogNumber": null,
                "expirationDate": $filter('DatabaseDateFormatMMddyyyy')($scope.CatalogDetails.expirationDate),
                "id": null,
                "startDate": $filter('DatabaseDateFormatMMddyyyy')($scope.CatalogDetails.startDate),
                "status": {
                    "id": 2,
                    "name": null
                },
                "submitDate": $filter('DatabaseDateFormatMMddyyyy')($scope.CatalogDetails.submitDate)
            };


        }

        var SaveRequest = ThirdPartyCatalogService.addNewCatalog(param);
        SaveRequest.then(function (success) {

            if (sessionStorage.getItem("catalogId") !== "null") {
                var statusParam = {
                    "id": sessionStorage.getItem("catalogId"),
                    "status": {
                        "id": $scope.CatalogDetails.status.id,
                        "name": null
                    }
                };


                var ChangeCatalogStatus = ThirdPartyCatalogService.ChangeCatalogStatus(statusParam);
                ChangeCatalogStatus.then(function (success) {
                    $scope.GetCatalogList();//refersh catalog list
                    //update status for catalog
                }, function (error) {
                    toastr.remove();
                    toastr.error(error.data.errorMessage, "Error");
                });
            }
            $scope.Status = success.data.status;
            if ($scope.Status === 200) {
                sessionStorage.setItem("IsEdit", null);
                if (sessionStorage.getItem("catalogId") != null)
                    toastr.success("Catalog details updated successfully", "Confirmation");
                else
                    toastr.success("Catalog details added successfully", "Confirmation");
                $scope.CatalogDetails = {
                    "catalogName": "",
                    "expirationDate": "",
                    "startDate": "",
                    "submitDate": "",
                    "status": {
                        "id": 1
                    }
                };
                $scope.showNewCatalog = false;
            }
            else if ($scope.Status == 400) {

            }
        }, function (error) {
            toastr.error('Failed to update details. Please try again..', "Error");
            // $scope.ErrorMessage = error.data.errorMessage
        });
    }

    $scope.PublishCatalog = PublishCatalog
    function PublishCatalog(CatalogId) {

        var statusParam = {
            "id": CatalogId,
            "status": {
                "id": 2,
                "name": "PUBLISHED"
            }
        };


        var ChangeCatalogStatus = ThirdPartyCatalogService.ChangeCatalogStatus(statusParam);
        ChangeCatalogStatus.then(function (success) {
            init();
            toastr.remove();
            toastr.success(success.data.message, "Confirmation");

            //update status for catalog
        }, function (error) {
            toastr.remove();
            toastr.error(error.data.errorMessage, "Error");
        });
    }
    $scope.back = back
    function back() {
        $scope.CatalogDetails = {
            "catalogName": "",
            "expirationDate": "",
            "startDate": "",
            "submitDate": "",
            "status": {
                "id": 1
            }
        };
        sessionStorage.setItem("IsEdit", null);
        sessionStorage.setItem("catalogId", null);
        $scope.showNewCatalog = false;
        $scope.catalogItemsList = [];
        init();
    }

    $scope.OpenFileUpload = OpenFileUpload;
    function OpenFileUpload() {
        angular.element('#FileUpload').trigger('click');
    };

    $scope.UploadCatalogItems = UploadCatalogItems;
    function UploadCatalogItems() {
        $location.url("UploadCatalogItem");
    };
    $scope.GoToHome = function () {
        $location.url(sessionStorage.getItem('HomeScreen'));
    };

});