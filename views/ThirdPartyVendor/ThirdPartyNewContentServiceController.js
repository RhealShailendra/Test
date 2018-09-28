angular.module('MetronicApp').controller('ThirdPartyNewContentServiceController', function ($translate, $translatePartialLoader, $rootScope, $scope,
    ThirdPartyContentService, $location, $filter, $timeout, $q) {
    $translatePartialLoader.addPart('ThirdPartyContentService');
    $translate.refresh();

    $scope.GoToHome = function () {
        $location.url(sessionStorage.getItem('HomeScreen'));
    }
    $scope.Back = function () {
        $location.url("ThirdPartyContentService");
    }
    //

    $scope.categoryList = [];
    $scope.ContentServiceList = [];
    $scope.CategoryServiceList = [];
    $scope.OrigionalList = [];
    $scope.ContentService = {
        "category": {
            "categoryId": parseInt(sessionStorage.getItem("ContentServiceCategoryID"))
        },
        "contentServiceIds": [],
        "contentService": []
    };
    $scope.count = 0;
    $scope.IsEdit = sessionStorage.getItem("IsEdit");
    function init() {
        if (angular.isDefined($scope.ContentService.category.categoryId) && $scope.ContentService.category.categoryId !== null && $scope.ContentService.category.categoryId !== "") {
            $(".page-spinner-bar").removeClass("hide");
            //Get genaral Category
            var GetCategory = ThirdPartyContentService.GetCategory();
            GetCategory.then(function (success) {
                $scope.categoryList = success.data.data;
                angular.element('#multi').val(null);
                angular.element('#multi').select2();

                if ($scope.ContentService.category.categoryId != 0 && $scope.IsEdit=="true")
                {
                    GetContentServicesOnCategory();
                }
                else
                {
                    $(".page-spinner-bar").addClass("hide");
                }
               
            }, function (error) { });
        }
        else {
            $location.url('ThirdPartyContentService');
        }
    }
    init();

    $scope.OrigionalContentList=[];
    $scope.GetContentsServciesList = GetContentsServciesList;
    function GetContentsServciesList() {
        var GetContentService = ThirdPartyContentService.GetAllContentService();
        GetContentService.then(function (success) {
            $scope.OrigionalList[0] = { contentServices :[]};
            $scope.OrigionalList[0].contentServices = success.data.data;
            $scope.ContentServiceList = [];
            $scope.ContentService.contentServiceIds = [];
            var loopPromises = [];
            angular.forEach($scope.OrigionalList[0].contentServices, function (item) {
                var deferred = $q.defer();
                $scope.ContentService.contentServiceIds.push(item.id);                
                $scope.ContentServiceList.push(item);
                // Dropdown to refreshed
                loopPromises.push(deferred.promise);
                $timeout(function () {
                    deferred.resolve();
                    $(".page-spinner-bar").addClass("hide");
                }, 10);
                // Dropdown to refreshed end
            });
            // Dropdown to refreshed
            $q.all(loopPromises).then(function () {
                angular.element('#multi').select2({});
            });           
            $scope.GetSubServices();
        }, function (error) {

        });
      
    };

    $scope.GetSubServices = GetSubServices;
    function GetSubServices() {
        var GetSubServiceList = ThirdPartyContentService.GetSubServiceList();
        GetSubServiceList.then(function (success) {
            $scope.CategoryServiceList.contentService = [];
            $scope.SubServiceList = success.data.data;
            angular.forEach($scope.SubServiceList, function (subService) {
                subService.isAvailable = false;
                subService.serviceCharge = 0.00;
            });
            angular.forEach($scope.OrigionalList[0].contentServices, function (ContentService) {
                ContentService.subServices = angular.copy($scope.SubServiceList);
            });
            $scope.CategoryServiceList.contentService = angular.copy($scope.OrigionalList[0].contentServices);
        }, function (error) {
            angular.element('#multi').val(null);
            angular.element('#multi').select2();
        });
    }
    $scope.GetSubServicesForEdit = GetSubServicesForEdit;
    function GetSubServicesForEdit() {
        var GetSubServiceList = ThirdPartyContentService.GetSubServiceList();
        GetSubServiceList.then(function (success) {
            $scope.SubServiceList = success.data.data;
            angular.forEach($scope.SubServiceList, function (subService) {
                subService.isAvailable = false;
                subService.serviceCharge = 0.00;
            });

            angular.forEach($scope.OrigionalList[0].contentServices, function (ContentService) {
                if (angular.isUndefined(ContentService.subServices))
                {
                    ContentService.subServices = angular.copy($scope.SubServiceList);
                }                
            });
            $scope.CategoryServiceList.contentService = angular.copy($scope.OrigionalList[0].contentServices);
        }, function (error) {
            angular.element('#multi').val(null);
            angular.element('#multi').select2();
        });
    }

    $scope.GetContentServicesOnCategory = GetContentServicesOnCategory;
    function GetContentServicesOnCategory() {
        if ($scope.IsEdit == "true") {
            if (angular.isDefined($scope.ContentService.category.categoryId)) {
                if ($scope.ContentService.category.categoryId != 0) {
                    $(".page-spinner-bar").removeClass("hide");
                    angular.element('#multi').val(null);
                    angular.element('#multi').select2();
                    var param = {
                        "categoryId": $scope.ContentService.category.categoryId
                    };
                    var GetVendorContentService = ThirdPartyContentService.GetAllContentServiceofVendor(param);
                    GetVendorContentService.then(function (success) {
                        $scope.CategoryServiceList = success.data.data.categoriesAndServices[0];
                        $scope.OrigionalList = success.data.data.categoriesAndServices;
                        $scope.ContentServiceList = [];
                        $scope.ContentService.contentServiceIds = [];
                        var loopPromises = [];
                        angular.forEach($scope.CategoryServiceList.contentServices, function (item) {
                            var deferred = $q.defer();
                            if ($scope.ContentService.category.categoryId > 0) {
                                $scope.ContentService.contentServiceIds.push(item.id);
                            }
                            $scope.ContentServiceList.push(item);
                            // Dropdown to refreshed
                            loopPromises.push(deferred.promise);
                            $timeout(function () {
                                deferred.resolve();
                                $(".page-spinner-bar").addClass("hide");
                            }, 10);
                            // Dropdown to refreshed end
                        });
                        GetSubServicesForEdit();
                        // Dropdown to refreshed
                        $q.all(loopPromises).then(function () {
                            angular.element('#multi').select2({});
                        });
                        if ($scope.ContentService.category.categoryId > 0) {
                            $scope.AddEditContentServiceFromList();
                        }
                    }, function (error) {
                        $(".page-spinner-bar").addClass("hide");
                        angular.element('#multi').val(null);
                        angular.element('#multi').select2();
                    });
                }
            }
            else {
                $scope.ContentService.contentServiceIds = [];
                $scope.CategoryServiceList = [];
                $scope.ContentServiceList = [];
                angular.element('#multi').val(null);
                angular.element('#multi').select2();
            }
        }
        else if ($scope.IsEdit == "false") {

            if (angular.isDefined($scope.ContentService.category.categoryId))
            {
                $scope.GetContentsServciesList();
            }
        else{
                $scope.ContentService.contentServiceIds = [];
                $scope.CategoryServiceList = [];
                $scope.ContentServiceList = [];
                angular.element('#multi').val(null);
                angular.element('#multi').select2();
            }
           
        }
    };

    $scope.AddEditContentServiceFromList = function () {

        if ($scope.ContentService.category.categoryId != 0)
        {
            if ($scope.ContentService.contentServiceIds.length > 0) {
                var Templist = [];
                angular.forEach($scope.ContentService.contentServiceIds, function (serviceId) {
                    angular.forEach($scope.OrigionalList[0].contentServices, function (origionalList) {
                        if (origionalList.id == serviceId) {
                            Templist.push(origionalList);
                        }
                    });
                });
                $scope.CategoryServiceList.contentService = angular.copy(Templist);
            }
            else {
                $scope.CategoryServiceList.contentService = [];
            }
        }
      

    };

    $scope.SaveContentService = function () {
        var ContentServices = [];
        var subServiceList;
        angular.forEach($scope.CategoryServiceList.contentService, function (item) {
            subServiceList = [];
            angular.forEach(item.subServices, function (subServices) {
                subServiceList.push({
                    "id": subServices.id,
                    "isAvailable": subServices.isAvailable,
                    "serviceCharge": subServices.serviceCharge
                });
            });

            ContentServices.push({
                "id": item.id,
                "isAvailable": true,
                "vendorServiceId":null,
                "subServices": subServiceList
            });
        });

        var obj = {
            "category": {
                "id": $scope.ContentService.category.categoryId
            },
            "contentServices": ContentServices
        };
        var SaveContentService = ThirdPartyContentService.SaveContentService(obj);
        SaveContentService.then(function (success) {
            toastr.remove();
            toastr.success((success.data.message !== null) ? success.data.message : $translate.instant('Content service saved successfully.'), "Confirmation"); $scope.Back();
        }, function (error) {
            toastr.remove()
            toastr.error((error !== null) ? error.data.errorMessage : $translate.instant('Failed to save the content service'), "Error");
        });
    };
});