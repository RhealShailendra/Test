angular.module('MetronicApp').controller('AddCustomItemController', function ($translate, $translatePartialLoader, $rootScope, $log, $scope, $window,
    settings, $http, $timeout, $uibModal, $location, $filter, ThirdPartyLineItemDetailsService) {

    $translatePartialLoader.addPart('AddCustomItem');
    $translate.refresh();

    $scope.CustomItem = {};
    $scope.CustomItemList = [];
    $scope.CustomSubItem = [];
    $scope.CustomSubItemTotalCost = 0.00;
    $scope.NewCustomItem = false;
    function init()
    {
        $scope.CommonObj = {
            ItemId: sessionStorage.getItem("ItemId"),
            ItemNumber: sessionStorage.getItem("ItemNumber"),
            ItemUID: sessionStorage.getItem("ItemUId"),
            ClaimNo: sessionStorage.getItem("ClaimNo"),
            ClaimId: sessionStorage.getItem("ClaimId"),
            PolicyHolder: sessionStorage.getItem("Policyholder"),
            Page: sessionStorage.getItem("Page"),
            ReplacementDesc: sessionStorage.getItem("ReplacementDesc"),
            ReplacementCost: sessionStorage.getItem("ReplacementCost")
        };

        $scope.CustomItem.description = $scope.CommonObj.ReplacementDesc;
        $scope.CustomItem.replacementCost = $scope.CommonObj.ReplacementCost;


        var param = {
            "itemId": $scope.CommonObj.ItemId
        };

        var getItemDetailsOnId = ThirdPartyLineItemDetailsService.gteItemDetails(param);
        getItemDetailsOnId.then(function (success) {
            $scope.ItemDetails = success.data.data;             
        }, function (error) {
            toastr.remove();
            toastr.error(error.data.errorMessage, "Error");
        });

        GetCustomItems();
    }
    init();

    $scope.GetCustomItems = GetCustomItems;
    function GetCustomItems()
    {
        var param = {
            "lineItem": {
                "itemId": $scope.CommonObj.ItemId
            },
            "claim": {
                "claimId": $scope.CommonObj.ClaimId
            }
        };
   
        var getCustomId = ThirdPartyLineItemDetailsService.GetCustomItemsList(param);
        getCustomId.then(function (success) {
            $scope.CustomItemList = success.data.data;             
        }, function (error) {
            toastr.remove();
            toastr.error(error.data.errorMessage, "Error");
        });
    }

    $scope.goToDashboard = function () {       
        $location.url(sessionStorage.getItem('HomeScreen'));
    }

    $scope.goBack = goBack;
    function goBack(e) {
        if ($scope.CommonObj.Page =="VendorAssociateItemDetails")
        {
            $location.url('VendorAssociateClaimDetails');
        }
        else {
            $location.url('ThirdPartyClaimDetails');
        }
       
    };
    $scope.NewItem = NewItem;
    function NewItem() {
        $scope.CustomSubItemTotalCost = 0;
        $scope.NewCustomItem = true;
    };
    
    $scope.NewItemPopup = NewItemPopup;
    function NewItemPopup(ev) {
        $scope.animationsEnabled = true;
        var out = $uibModal.open(
        {
            animation: $scope.animationsEnabled,
            templateUrl: "views/ThirdPartyVendor/AddNewCustomItem.html",
            controller: "AddNewCustomItemController",
            backdrop: 'static',
            keyboard: false,
            resolve:
            {
                objClaim: function () {

                    return "";
                }
            }
        });
        out.result.then(function (value) {
            //Call Back Function success
            if (angular.isDefined(value) && value!=null) {
                $scope.CustomSubItem.push(value);
                $scope.CustomSubItemTotalCost = 0;
                angular.forEach($scope.CustomSubItem, function (item) {
                    $scope.CustomSubItemTotalCost += parseInt(item.totalCost);
                });
            }

        }, function (res) {
            //Call Back Function close
        });
        return {
            open: open
        };
        //}

    }
    //End item popup


    $scope.AddUpdateCustomItem = AddUpdateCustomItem;
    function AddUpdateCustomItem(status) {
                
        //EDIT
        if (angular.isDefined($scope.CustomItem.id) && $scope.CustomItem.id != null)
        {           
            $scope.CustomItems = [];
            angular.forEach($scope.CustomSubItem, function (subitem) {
                $scope.CustomItems.push({
                    "id":(angular.isDefined(subitem.id)&&subitem.id!=null?subitem.id:null) ,
                    "description": subitem.description,
                    "unitPrice": subitem.unitPrice,
                    "quantity": subitem.quantity,
                    "taxRate": subitem.taxRate,
                    "totalCost": subitem.totalCost
                })
            });

            var param = new FormData();
            var count = 0;
            var Filedetails = [];
            angular.forEach($scope.CustomSubItem, function (subitem, key) {              
                if (angular.isDefined(subitem.attachment) && subitem.attachment !== null && subitem.attachment.length > 0) {
                    angular.forEach(subitem.attachment, function (attachment) {
                        if (subitem.id == null)
                        {
                            count++;
                            Filedetails.push({ "fileName": attachment.name, "fileType": attachment.FileType, "extension": attachment.FileExtension, "filePurpose": "CUSTOM_SUB_ITEM", "customSubItemIndex": key })
                            param.append('file', attachment.File);
                        }
                    });
                }
            });
            if (count > 0) {
                param.append('filesDetails', JSON.stringify(Filedetails));
            }

            if ($scope.CustomSubItem.length == 0 || count==0) {
                param.append('filesDetails', null);
                param.append('file', null);
            }
            param.append("customItem", JSON.stringify({
                "id": $scope.CustomItem.id,
                "customItemFlag": true,
                "itemStatus": status,
                "replacementCost": $scope.CustomItem.replacementCost,
                "description": $scope.CustomItem.description,
                "claim": {
                    "claimId": $scope.CommonObj.ClaimId
                },
                "item": {
                    "itemUID": $scope.CommonObj.ItemUID
                },
                "supplierName": null,
                "supplierWebsite": null,
                "sku": null,
                "registrationNumber": sessionStorage.getItem("CompanyCRN"),
                "customItemType": {
                    id: sessionStorage.getItem("customItemType"),
                },
                "customSubItem": $scope.CustomItems
            }))
        }
            //ADD NEW
        else {           
            $scope.CustomItems = [];
            angular.forEach($scope.CustomSubItem, function (subitem) {
                $scope.CustomItems.push({
                    "id": null,
                    "description": subitem.description,
                    "unitPrice": subitem.unitPrice,
                    "quantity": subitem.quantity,
                    "taxRate": subitem.taxRate,
                    "totalCost": subitem.totalCost
                })
            });
            var param = new FormData();
            var count = 0;
            var Filedetails = [];
            angular.forEach($scope.CustomSubItem, function (subitem, key) {
                if (angular.isDefined(subitem.attachment) && subitem.attachment !== null && subitem.attachment.length > 0) {
                    angular.forEach(subitem.attachment, function (attachment) {
                        if (angular.isUndefined(attachment.url)) {
                            count++;
                            Filedetails.push({ "fileName": attachment.name, "fileType": attachment.FileType, "extension": attachment.FileExtension, "filePurpose": "CUSTOM_SUB_ITEM", "customSubItemIndex": key })

                            param.append('file', attachment.File);
                        }
                    });
                }
            });
            if (count > 0) {
                param.append('filesDetails', JSON.stringify(Filedetails));
            }

            if ($scope.CustomSubItem.length == 0 || count==0)
            {
                param.append('filesDetails', null);
                param.append('file', null);
            }
            param.append("customItem", JSON.stringify({
                "id": null,// for update
                "customItemFlag": true,
                "itemStatus": status,
                "description": $scope.CustomItem.description,
                "replacementCost": ($scope.CustomItem.replacementCost !== null && angular.isDefined($scope.CustomItem.replacementCost) ? $scope.CustomItem.replacementCost : null),
                "claim": {
                    "claimId": $scope.CommonObj.ClaimId
                },
                "item": {
                    "itemUID": $scope.CommonObj.ItemUID
                },
                "supplierName": null,
                "supplierWebsite": null,
                "registrationNumber": sessionStorage.getItem("CompanyCRN"),
                "customItemType":{
                    id: sessionStorage.getItem("customItemType"),
                },
                    "sku": null,
                "customSubItem": $scope.CustomItems
            }))
        }
        
            //Add/Update custom item
            var getItemDetailsOnId = ThirdPartyLineItemDetailsService.AddCustomItem(param);
            getItemDetailsOnId.then(function (success) {
                toastr.remove();
                toastr.success(success.data.message, "Confirmation");
                $scope.GetCustomItems();
                $scope.CustomItem = {};
                $scope.NewCustomItem = false;
            }, function (error) {
                toastr.remove();
                toastr.error(error.data.errorMessage, "Error");
            });
    };

    $scope.Draft = Draft;
    function Draft()
    {

    }

    $scope.GotoDetails = GotoDetails;
    function  GotoDetails(customitem)
    {

        $scope.CustomItem = angular.copy(customitem); 
        $scope.CustomSubItem = angular.copy(customitem.customSubItem);
        $scope.NewCustomItem = true;

        $scope.CustomSubItemTotalCost = 0;
        angular.forEach($scope.CustomSubItem, function (item) {
            $scope.CustomSubItemTotalCost += parseInt(item.totalCost);
        });
    }
     
    $scope.Cancel = Cancel;
    function Cancel() {
        $scope.CustomItem.description = "";
        $scope.CustomSubItem = [];
        $scope.NewCustomItem = false;
    };


    $scope.RemoveSubItem = RemoveSubItem;
    function RemoveSubItem(item, index) {
        if (angular.isDefined(item.id) && item.id !== null) {
            
            $scope.DeleteCustomSubItem(item);
        }
        else {
            $scope.CustomSubItem.splice(index, 1);
        }

    };

    $scope.DeleteCustomItem = DeleteCustomItem;
    function DeleteCustomItem(item) {
        bootbox.confirm({
            size: "",
            title: "Delete Custom Item",
            message: "Are you sure want to delete custom item?", closeButton: false,
            className: "modalcustom", buttons: {
                confirm: {
                    label: "Yes",
                    className: 'btn-success'
                },
                cancel: {
                    label:"No", //$translate.instant('ClaimDetails_Delete.BtnNo'),
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                if (result) {
                     
                    if (angular.isDefined(item.id) && item.id !== null) {
                        var param = [{
                            "id": item.id
                        }]
                        var DeleteItem = ThirdPartyLineItemDetailsService.DeleteCustomItem(param);
                        DeleteItem.then(function (success) {
                            toastr.remove();
                            toastr.success(success.data.message, "Confirmation");
                            $scope.GetCustomItems();
                            $scope.NewCustomItem = false;
                        }, function (error) {
                            toastr.remove();
                            toastr.error(error.data.errorMessage, "Error");
                        });

                    };
                }
            }
        });
       
    };

    $scope.AddToComparable = AddToComparable;
    function AddToComparable(customitem) {
        $scope.CustomItem = angular.copy(customitem);
        var param =
            {
                "id": $scope.CustomItem.id,
                "registrationNumber": sessionStorage.getItem("CompanyCRN"),
                "itemStatus": "Comparable",
                "claim": {
                    "claimId": parseInt($scope.CommonObj.ClaimId)
                },
                "item": {
                    "itemId": parseInt($scope.CommonObj.ItemId)
                }
            }

        //Add/Update custom item
        var getItemDetailsOnId = ThirdPartyLineItemDetailsService.ChangeStatusOfCustomItem(param);
        getItemDetailsOnId.then(function (success) {
            toastr.remove();
            toastr.success(success.data.message, "Confirmation");
            $scope.GetCustomItems();
            $scope.NewCustomItem = false;
        }, function (error) {
            toastr.remove();
            toastr.error(error.data.errorMessage, "Error");
        });
    }

    $scope.DeleteCustomSubItem = DeleteCustomSubItem;
    function DeleteCustomSubItem(item) {
        bootbox.confirm({
            size: "",
            title: "Delete Sub Item",
            message: "Are you sure want to delete sub item?", closeButton: false,
            className: "modalcustom", buttons: {
                confirm: {
                    label: "Yes",
                    className: 'btn-success'
                },
                cancel: {
                    label: "No", //$translate.instant('ClaimDetails_Delete.BtnNo'),
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                if (result) {
                     
                    if (angular.isDefined(item.id) && item.id !== null) {
                        var param = [{
                            "id": item.id
                        }]
                        var DeleteItem = ThirdPartyLineItemDetailsService.DeleteCustomSubItem(param);
                        DeleteItem.then(function (success) {
                            toastr.remove();
                            toastr.success(success.data.message, "Confirmation");
                            $scope.GetCustomItems();
                            $scope.NewCustomItem = false;
                        }, function (error) {
                            toastr.remove();
                            toastr.error(error.data.errorMessage, "Error");
                        });

                    };
                }
            }
        });

    };

    $scope.goItemPage = goItemPage;
    function goItemPage()
    {
    sessionStorage.setItem("ThirdPartyClaimNo", $scope.CommonObj.ClaimNo);
    sessionStorage.setItem("ThirdPartyClaimId", $scope.CommonObj.ClaimId);
    sessionStorage.setItem("ThirdPartyPostLostItemId", $scope.CommonObj.ItemId);
    sessionStorage.setItem("Policyholder"," ");
     $location.url($scope.CommonObj.Page);

    }

});