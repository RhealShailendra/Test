angular.module('MetronicApp').controller('ThirdPartyAssignPostLostItemController', function ($rootScope, $scope, settings, $translate, $translatePartialLoader, $location,
    ThirdPartyClaimDetailsService, $uibModal, $filter) {

    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    //set language
    $translatePartialLoader.addPart('AssignPostLostItem');
    $translate.refresh();

    $scope.PageSize = $rootScope.settings.pagesize;
    $scope.ErrorMessage = '';
    $scope.AdjusterList = [];
    $scope.PricingSpecialist = [];
    $scope.FiletrLostDamageList = [];
    $scope.ServiceList = [];
    $scope.CategoryList = [];
    $scope.SubCategory = [];
    $scope.Categories = "ALL";
    $scope.OriginalPostLossIndex = null;
    $scope.LostDamagedItemList = [];
    $scope.OriginalPostLossItem = [];
    $scope.SelectedCategories = [];
    $scope.SelectedServiceList = [];
    $scope.VendorWithServiceList = [];
    $scope.SelectedParticipant = null;
    $scope.MinServiceCost = 0;
    $scope.displayItemSelectError = false;
    $scope.ContactInsured;
    $scope.string = sessionStorage.getItem("ThirdPartySelectedItemList");
    if ($scope.string === null || $scope.string === "") {
        $scope.SelectedPostLostItems = [];
    }
    else {
        $scope.SelectedPostLostItems = $scope.string.split(',').map(function (item) { return parseInt(item, 10); });
    }
    function init() {

        $(".page-spinner-bar").removeClass("hide");
        $scope.CommanObj = {
            CompanyId: sessionStorage.getItem("CompanyId"),
            ClaimNumber: sessionStorage.getItem("ThirdPartyClaimNo"),
            ClaimId: sessionStorage.getItem("ThirdPartyClaimId"),
            SearchItemCategory: "ALL",
          
        };


        $scope.selected = {};
        $scope.AddNewItem = false;
        GetLostDamagedItem();//Get lost or damaged content  API #78
        GetCategory();
        GetSubCategory();

        //get Pricing Specialist list
        $(".page-spinner-bar").removeClass("hide");
        var getpromise = ThirdPartyClaimDetailsService.getVendorAssociateList();
        getpromise.then(function (success) {
            $scope.PricingSpecialist = $filter('orderBy')($scope.PricingSpecialist, 'isClaimedVendor');
            $scope.PricingSpecialist = success.data.data;
            $scope.OriginalPricingSpecialist = success.data.data;
            $(".page-spinner-bar").addClass("hide");
           
            $scope.getServiceProviedInString(); //get services in string to show in table
        }, function (error) {
            //$scope.ErrorMessage = error.data.errorMessage;
        });



        //----------------------------------------------------------------------------------------


        //get vendor service list
        //var getVendorService = ThirdPartyClaimDetailsService.getVendorServiceList();
        //getVendorService.then(function (success) {
        //    $scope.ServiceList = success.data.data;
        //}, function (error) {
        //    // $scope.ErrorMessage = error.data.errorMessage;
        //});


        //get claim content details for requested services

        //get claim contents
        var param = {
            "claimNumber": $scope.CommanObj.ClaimNumber
        }

        var GetContentDetails = ThirdPartyClaimDetailsService.GetContentDetails(param);
        GetContentDetails.then(function (success) {

            $scope.ServiceList = success.data.data.requestedServices;
         
        }, function (error) {
            $scope.ErrorMessage = error.data.errorMessage;
        });
    }

    init();

    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }



    $scope.sortVendor = function (key) {
        $scope.sortVendorsortKey = key;   //set the sortKey to the param passed
        $scope.sortVendorreverse = !$scope.sortVendorreverse; //if true make it false and vice versa
    }

    $scope.GetLostDamagedItem = GetLostDamagedItem;
    function GetLostDamagedItem() {
        var param = { "claimNumber": $scope.CommanObj.ClaimNumber }
        var getpromise = ThirdPartyClaimDetailsService.getPostLostItemsForVendor(param);
        getpromise.then(function (success) {

            $scope.LostDamagedItemList = success.data.data.itemReplacement;
            $scope.FiletrLostDamageList = success.data.data.itemReplacement;

            getChekced();
        }, function (error) {
            // $scope.ErrorMessage = error.data.errorMessage;
        });
    }

    $scope.ContactInsured;
    //Assign claim to adjuster/pricing specialist/vendor API #83
    $scope.AssignPostLostItem = function () {
        if ($scope.SelectedPostLostItems.length === 0 || $scope.SelectedPostLostItems === null || $scope.SelectedParticipant === null) {
            toastr.remove()
            toastr.warning($translate.instant("WarningMessage"), $translate.instant("WarningHeading"));
        }
        else {
            var ItemIds = [];
            angular.forEach($scope.SelectedPostLostItems, function (obj) {
                ItemIds.push({ "id": obj });
            });
            var serviceList = [];
            angular.forEach($scope.SelectedServiceList, function (item) { serviceList.push({ "id": item.id }) });
            var param =
            {
                "vendorId": parseInt(sessionStorage.getItem("VendorId")),
                "associateId": $scope.SelectedParticipant,
                "associateItems": ItemIds
            };
            var assignPostLostItem = ThirdPartyClaimDetailsService.assignPostLostItemToAssociate(param);
            assignPostLostItem.then(function (success) {
                
                $scope.status = success.data.status;
                if ($scope.status == 200) {
                    toastr.remove();
                    toastr.success($translate.instant("AssignPostLostSuccess"), $translate.instant("CommonConfirmationHeading"));

                    $scope.FiletrLostDamageListLength = sessionStorage.getItem("FiletrLostDamageListLength");
                    var goDashboard=false;

                    if($scope.SelectedPostLostItems.length == $scope.FiletrLostDamageListLength)
                        goDashboard=true;
                    //clear seesion value for selected item
                    sessionStorage.setItem("ThirdPartySelectedItemList", "");
                    $scope.SelectedParticipant = null;
                    $scope.SelectedPostLostItems = [];
                    $scope.SelectedCategories = [];
                    //$scope.GetLostDamagedItem();

                    if (goDashboard == true) {
                        $location.url(sessionStorage.getItem('HomeScreen'));
                    } else {
                        $location.url('ThirdPartyClaimDetails');
                    }
                    
                }
                else {

                }

            }, function (error) {
                $scope.ErrorMessage = error.data.errorMessage;
            });


        }


    };

    $scope.cancel = function () {
        sessionStorage.setItem("ThirdPartySelectedItemList", "");
        $location.url('ThirdPartyClaimDetails');
    };

    $scope.GoBack = function (e) {

        sessionStorage.setItem("ThirdPartySelectedItemList", "");
        $location.url('ThirdPartyClaimDetails');
    }

    $scope.GetCategory = GetCategory;
    function GetCategory() {
        //Get category
        var getpromise = ThirdPartyClaimDetailsService.getCategories();
        getpromise.then(function (success) {
            $scope.CategoryList = success.data.data;

        }, function (error) {
            // $scope.ErrorMessage = error.data.errorMessage;
        });
    }

    $scope.GetSubCategory = GetSubCategory;
    function GetSubCategory() {
        var param = {
            "categoryId": $scope.selected.categoryId
        };
        var respGetSubCategory = ThirdPartyClaimDetailsService.getSubCategory(param);
        respGetSubCategory.then(function (success) { $scope.SubCategory = success.data.data; }, function (error) { $scope.SubCategory = null; $scope.ErrorMessage = error.data.errorMessage });
    }


    //get only thise items which are selected from list
    $scope.getChekced = getChekced;
    function getChekced() {

        angular.forEach($scope.FiletrLostDamageList, function (item) {

            angular.forEach($scope.SelectedPostLostItems, function (value) {



                if (item.claimItem.id === parseInt(value)) {

                    item.Selected = true;

                    if (item.claimItem.category != null) {
                        var index = $scope.SelectedCategories.indexOf(item.claimItem.category.name);

                        if (index == -1) {


                            $scope.SelectedCategories.push(item.claimItem.category.name);
                        }
                    }

                }

            });

        });


        $scope.SortPostLossItem();
    //    $(".page-spinner-bar").addClass("hide");
    }

    $scope.SortPostLossItem = SortPostLossItem;
    function SortPostLossItem() {

        $scope.SelectedContainer = [];
        $scope.UnSelectedContainer = [];
        angular.forEach($scope.FiletrLostDamageList, function (item) {
            if (item.Selected === true) {
                $scope.SelectedContainer.push(item);
            }
            else {
                $scope.UnSelectedContainer.push(item);
            }
        });
        //$scope.FiletrLostDamageList = $scope.SelectedContainer.concat($scope.UnSelectedContainer);
        $scope.FiletrLostDamageList = $scope.SelectedContainer;
    }

    $scope.SelectPostLostItem = function (item) {

        var flag = 0;
        angular.forEach($scope.FiletrLostDamageList, function (item) {
            if (item.Selected) {
                flag++;
            }

        });

        var flagNew = 0;
        angular.forEach($scope.FiletrLostDamageList, function (item) {
            if (item.claimItem.status.status != 'UNDER REVIEW' || item.claimItem.status.id != 3) {
                flagNew++;
            }

        });
        if (flag != flagNew) {
            $scope.selectedAll = false;
        }
        else if (flag == flagNew) {
            $scope.selectedAll = true;
        }

        //for selected item id
        var index = $scope.SelectedPostLostItems.indexOf(item.claimItem.id);

        if (index > -1) {
            $scope.SelectCategory(item);
            $scope.SelectedPostLostItems.splice(index, 1);
            //$scope.sortforSelected();
        }
        else {

            $scope.SelectedPostLostItems.push(item.claimItem.id);

            var index = $scope.SelectedCategories.indexOf(item.claimItem.category.name);

            if (index == -1) {
                $scope.SelectedCategories.push(item.claimItem.category.name);
            }

        }
        //$scope.sortforSelected();
    }

    //to get selected category
    $scope.SelectCategory = SelectCategory;
    function SelectCategory(item) {
        var a = $scope.SelectedPostLostItems
        //for selected item category
        if (item.claimItem.category != null) {
            var index = $scope.SelectedCategories.indexOf(item.claimItem.category.name);
            if (index > -1) {
                var flag = 0;
                angular.forEach($scope.SelectedPostLostItems, function (obj) {
                    angular.forEach($scope.LostDamagedItemList, function (val) {

                        if (obj == val.claimItem.id) {

                            if (item.claimItem.category.name == val.claimItem.category.name) {
                                flag++;
                            }
                        }
                    })
                });

                if (flag == 1) {
                    $scope.SelectedCategories.splice(index, 1);
                }
            }
            else {
                $scope.SelectedCategories.push(item.claimItem.category.name);
            }
        }


    }

    $scope.checkAll = function () {
        $scope.SelectedPostLostItems = [];
        if ($scope.selectedAll) {
            $scope.selectedAll = true;
            angular.forEach($scope.FiletrLostDamageList, function (item) {
                if (item.claimItem.status.status != 'UNDER REVIEW' || item.claimItem.status.id != 3) {
                    $scope.SelectedPostLostItems.push(item.claimItem.id);
                }

            });

        } else {
            $scope.selectedAll = false;
            $scope.SelectedPostLostItems = [];
            $scope.SelectedCategories = [];

        }

        angular.forEach($scope.FiletrLostDamageList, function (item) {
            if (item.claimItem.status.status != 'UNDER REVIEW' || item.claimItem.status.id != 3) {
                item.Selected = $scope.selectedAll;
            }
        });


        angular.forEach($scope.FiletrLostDamageList, function (item) {

            angular.forEach($scope.SelectedPostLostItems, function (value) {


                if (item.claimItem.id === parseInt(value)) {

                    item.Selected = true;
                    if (item.claimItem.category != null) {
                        var index = $scope.SelectedCategories.indexOf(item.claimItem.category.name);

                        if (index == -1) {


                            $scope.SelectedCategories.push(item.claimItem.category.name);
                        }
                    }

                }

            });

        });

    };

    //Select vendor to asssign the item and get the minimum cost for it
    $scope.SelectParticipant = function (item) {
        if (item.id != null) {
            $scope.SelectedParticipant = item.id;
        }
       
            $scope.getMinimumCost();
        
         
           
    }

    //selecting service and getting list of vendors who providing those serivces
    $scope.SelectService = function (service) {
        if (service != null) {
            var index = $scope.SelectedServiceList.indexOf(service);
            if (index == -1) {
                $scope.SelectedServiceList.push(service);
            }
            else {
                $scope.SelectedServiceList.splice(index, 1);
            }
        }
        //Filter list on selection PricingSpecialist       
        var list = [];
        $scope.PricingSpecialist = [];
        if ($scope.SelectedServiceList.length > 0) {
            var serviceCount = 0;

            angular.forEach($scope.OriginalPricingSpecialist, function (associate) {
                serviceCount = 0;
                angular.forEach($scope.SelectedServiceList, function (selectedService) {

                angular.forEach(associate.services, function (associateService) {
                        
                        if (selectedService.name == associateService.name) {
                            
                            serviceCount++;
                        }

                    });
                });

                if(serviceCount==$scope.SelectedServiceList.length)
                {
                 
                    $scope.PricingSpecialist.push(associate);
                    serviceCount = 0;
                    $scope.MinServiceCost = 0.0;
                }

            });
            $scope.getServiceProviedInString(); //get services in string to show in table

            if ($scope.SelectedParticipant !== null && angular.isDefined($scope.SelectedParticipant)) {
                
                $scope.getMinimumCost();
            }
        }
        else {
            $scope.PricingSpecialist = $scope.OriginalPricingSpecialist;
            $scope.MinServiceCost = 0.0;
        }
    }
    //End Filter list
    //finding minimum cost for vendor serivces
    $scope.getMinimumCost = getMinimumCost;
    function getMinimumCost() {
      
        var AssociateWithServiceCost = $filter('filter')($scope.PricingSpecialist, { id: $scope.SelectedParticipant });
        $scope.MinServiceCost = null;
        angular.forEach(AssociateWithServiceCost, function (associate) {
            angular.forEach(associate.services, function (service) {
                angular.forEach($scope.ServiceList, function (selectedservice) {

                    if (service.name == selectedservice.name) {
                        $scope.MinServiceCost += service.rate;
                    }

                });
            });
        });
    };

    $scope.getServiceProviedInString =getServiceProviedInString;
    function getServiceProviedInString()
        {
            angular.forEach($scope.PricingSpecialist, function (value, key) {
                value.Services = "";
                if (value.services != null) {
                    angular.forEach(value.services, function (value1, key1) {

                        value.Services += value1.name;
                        if (key1 !== value.services.length - 1) {
                            value.Services = value.Services + ", ";
                        }
                    });

                }
            });
        }

    $scope.GoToDashboard = GoToDashboard;
    function GoToDashboard() {
        $location.url(sessionStorage.getItem('HomeScreen'));
    };

    
});