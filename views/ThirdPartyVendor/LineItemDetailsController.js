angular.module('MetronicApp').controller('LineItemDetailsController', function ($translate, $translatePartialLoader, ThirdPartyClaimDetailsService, $rootScope, $log, $scope, $window,
    settings, $http, $timeout, $uibModal, $location, $filter, ThirdPartyLineItemDetailsService, PurchaseOrderService) {
    $scope.items = $rootScope.items;
    $scope.boolValue = true;
    $scope.attachmentListEdit = [];
    $scope.attachmentList = [];
    $scope.itemTypeList = [];
    $scope.subItemList = [];
    $scope.componentsList = [];
    $scope.unitMeasure = [];
    $scope.semiMountingColor = [];
    $scope.semiMountingClarity = [];
    $scope.semiMountingShape = [];
    $scope.semiMountingMetalType = [];
    $scope.mountingMetalType = [];
    $scope.chainMetalType = [];
    $scope.diamondShape = [];
    $scope.diamondColor = [];
    $scope.diamondClarity = [];
    $scope.diamondGemlabs = [];
    $scope.diamondCutgrades = [];
    $scope.gemstoneShape = [];
    $scope.gemstoneType = [];
    $scope.gemstoneQuality = [];
    $scope.PolicyholderDetails;
    $translatePartialLoader.addPart('ThirdPartyLineItemDetails');
    $translate.refresh();
    $scope.tab = 'Contents';
    $scope.NoImagePath = $rootScope.settings.NoImagePath;
    $scope.Compairableslist;
    $scope.Notes = "";
    $scope.NoteDetails;
    $scope.NoteIndex;
    $scope.CategoryList = "";
    $scope.Category = "";
    $scope.SubCategoryList = "";
    $scope.SubCategory = "";
    $scope.ErrorMessage = "";
    $scope.ClaimParticipantsList = [];
    $scope.ParticipantName = "";
    $scope.SerchComparables = false;
    //RCV 
    $scope.OriginalRCVOfItem = 0.0;
    $scope.OriginalACVOfItem = 0.0;
    $scope.Comparables = [];
    $scope.AddedComparables = [];
    //From google
    $scope.ReplacementSuplier = [];
    $scope.GoogleComparableList = [];
    //Sort options for dropdown
    $scope.SortOptions = [{ Id: false, Value: "Price-Low TO High" }, { Id: true, Value: "Price-High To Low" }];
    //$scope.CustomItemType = [{ Id: 1, Name: "QuickAdd" }, { Id: 2, Name: "View/Build custom Item" }];
    $scope.sortcolumn = 'false';
    // Item details object and image object
    $scope.ItemDetails = {};
    $scope.ItemDetails.CustomItemType = "";
    $scope.CustomItemType;
    $scope.images = [];
    //Serch variables for google 
    $scope.displayEmptyPart = true;
    $scope.displaycomparables = false;
    $scope.displayReplacement = false;
    $scope.dispalyAddedComparables = false;
    $scope.sortNote = 'createDate';
    $scope.sortNoteReverse = true;
    $scope.NextStep = true;
    $scope.PrevStep = true;
    $scope.prevPage;
    $scope.statuslist = [{ id: true, status: 'Yes' }, { id: false, status: 'No' }]
    $scope.SalvageDetails = {
        Selection: false
    };
    $scope.UserId = sessionStorage.getItem("UserId");
    function init() {

        $scope.attachmentList = [];
        $scope.submit = false;
        $scope.CommonObj = {
            ClaimNumber: sessionStorage.getItem("ThirdPartyClaimNo"),
            ClaimId: sessionStorage.getItem("ThirdPartyClaimId"),
            AssignmentNumber: sessionStorage.getItem("AssignmentNumber"),
            AssignmentId: sessionStorage.getItem("AssignmentId"),
            ItemNote: "",
            SearchComparables: "",
            ItemId: sessionStorage.getItem("ThirdPartyPostLostItemId"),
            ParticipantId: null,
            OrderType: "0",
            PolicyHolder: sessionStorage.getItem("Policyholder"),
            PurchaseClaimNumber: sessionStorage.getItem("ThirdPartyClaimNo"),
            PurchaseClaimId: sessionStorage.getItem("ThirdPartyClaimId"),
            PurchaseItemId: sessionStorage.getItem("ThirdPartyPostLostItemId"),
            PurchaseItemNumber: null,
            ItemDescription: "",
            OrigionalItemDescription: "",
            ThisPage: "ItemDetails",
            RegistrationNumber: sessionStorage.getItem("RegistrationNumber"),
            CompanyCRN: sessionStorage.getItem("CompanyCRN")
        };
        $(".page-spinner-bar").removeClass("hide");
        $scope.prevPage = $rootScope.previousState;
        //if ($scope.prevPage == 'salvageDashboard')
        //{
        //   $scope.tab = 'Salvage';
        //}
        getItemDetails();       
        getCategory();
        getActiveVendors();
        getReplacementSupplier();             
        GetPolicyHolderDetails();
        GetInsuranceCompanyDetails();
        GetPostLostItems();
        getAttachment();
        GetCustomeTypeOption();
    }

    //ACV calclulation
    $scope.ItemDetails.rcvTax = 0.0;
    $scope.ItemDetails.acvTotal = 0.0;
    init();
    $scope.getItemDetails = getItemDetails;
    function getItemDetails() {
        $(".page-spinner-bar").removeClass("hide");
        //get item details on itemId
        var param = {
            "itemId": $scope.CommonObj.ItemId
        };
        var getItemDetailsOnId = ThirdPartyLineItemDetailsService.gteItemDetails(param);
        getItemDetailsOnId.then(function (success) {
            $scope.ItemDetails = success.data.data;
            $scope.CommonObj.ItemUID = $scope.ItemDetails.itemUID;
            $scope.ItemDetails.appraisalDate = (angular.isDefined($scope.ItemDetails) && $scope.ItemDetails.appraisalDate != null) ? ($filter('DateFormatMMddyyyy')($scope.ItemDetails.appraisalDate)) : ($filter('TodaysDate')());
            if (angular.isDefined($scope.ItemDetails.attachments)) {
                angular.forEach($scope.ItemDetails.attachments, function (file) {
                    $scope.attachmentListEdit.push(file);
                });
            }
            $scope.CommonObj.PurchaseItemId = $scope.ItemDetails.id;
            $scope.CommonObj.PurchaseItemNumber = $scope.ItemDetails.itemNumber;
            $scope.CommonObj.ItemDescription = $scope.ItemDetails.description;
            $scope.CommonObj.OrigionalItemDescription = $scope.CommonObj.ItemDescription;
            //////Calculate total tax and total value for ACV and RCV
            ////if ($scope.ItemDetails.rcv !== null && angular.isDefined($scope.ItemDetails.rcv)) {
            ////    if ($scope.ItemDetails.taxRate !== null && angular.isDefined($scope.ItemDetails.taxRate)) {
            ////        $scope.ItemDetails.rcvTax = ($scope.ItemDetails.rcv * ($scope.ItemDetails.taxRate / 100)).toFixed(2);
            ////        $scope.ItemDetails.rcvTotal = (parseFloat($scope.ItemDetails.rcv) + parseFloat(($scope.ItemDetails.rcv * ($scope.ItemDetails.taxRate / 100)))).toFixed(2);
            ////    }
            ////    else
            ////        $scope.ItemDetails.rcvTax = 0.00;
            ////}
            ////else {
            ////    $scope.ItemDetails.rcvTotal = $scope.ItemDetails.rcv;
            ////    $scope.ItemDetails.rcvTax = 0.00
            ////}
            //////For acv tax and total acv
            ////if ($scope.ItemDetails.acv !== null && angular.isDefined($scope.ItemDetails.acv)) {
            ////    if ($scope.ItemDetails.taxRate !== null && angular.isDefined($scope.ItemDetails.taxRate)) {
            ////        $scope.ItemDetails.acvTax = parseFloat(($scope.ItemDetails.acv * ($scope.ItemDetails.taxRate / 100))).toFixed(2);
            ////        $scope.ItemDetails.acvTotal = (parseFloat($scope.ItemDetails.acv) + parseFloat(($scope.ItemDetails.acv * ($scope.ItemDetails.taxRate / 100)))).toFixed(2);
            ////    }
            ////    else
            ////        $scope.ItemDetails.acvTotal = $scope.ItemDetails.acv;
            ////} else {
            ////    $scope.ItemDetails.acvTotal = $scope.ItemDetails.acv;
            ////    $scope.ItemDetails.acvTax = 0.00;
            ////}
            ////$scope.ItemDetails.acv = ($scope.ItemDetails.acv !== null && angular.isDefined($scope.ItemDetails.acv)) ? parseFloat($scope.ItemDetails.acv.toFixed(2)) : $scope.ItemDetails.acv;
            ////$scope.ItemDetails.holdOverValue = ($scope.ItemDetails.holdOverValue !== null && angular.isDefined($scope.ItemDetails.holdOverValue)) ? parseFloat($scope.ItemDetails.holdOverValue.toFixed(2)) : $scope.ItemDetails.holdOverValue;
            ////$scope.ItemDetails.totalTax = ($scope.ItemDetails.totalTax !== null && angular.isDefined($scope.ItemDetails.totalTax)) ? parseFloat($scope.ItemDetails.totalTax.toFixed(2)) : $scope.ItemDetails.totalTax;
            ////$scope.ItemDetails.valueOfItem = ($scope.ItemDetails.valueOfItem !== null && angular.isDefined($scope.ItemDetails.valueOfItem)) ? parseFloat($scope.ItemDetails.valueOfItem.toFixed(2)) : $scope.ItemDetails.valueOfItem;
            ////$scope.ItemDetails.rcv = ($scope.ItemDetails.rcv !== null && angular.isDefined($scope.ItemDetails.rcv)) ? parseFloat($scope.ItemDetails.rcv.toFixed(2)) : $scope.ItemDetails.rcv;
            //$scope.ItemDetails.dateOfPurchase = $filter('DateFormatMMddyyyy')($scope.ItemDetails.dateOfPurchase);
            $scope.CommonObj.SearchComparables = angular.copy(success.data.data.description)
            GetSubCategory();  
            if (angular.isDefined($scope.ItemDetails.assignedTo) && $scope.ItemDetails.assignedTo !== null)
                $scope.AssignedName = $scope.ItemDetails.assignedTo.firstName + " " + $scope.ItemDetails.assignedTo.lastName;
            else
                $scope.AssignedName = ""
            // get compairables stored in database and insrt in list Comparables
            var param = {
                "itemId": $scope.CommonObj.ItemId
            };
            var GetExistingComparablesFromDb = ThirdPartyLineItemDetailsService.GetExistingComparablesFromDb(param);
            GetExistingComparablesFromDb.then(function (successComparables) {
                $scope.Comparables = successComparables.data.data;
                $scope.CheckForAlreadyAddedComparables();                
            }, function (error) {
                $scope.ErrorMessage = error.data.errorMessage;
            });

            var GetImageOfItem = ThirdPartyLineItemDetailsService.gteItemImagess(param);
            GetImageOfItem.then(function (success) { $scope.images = success.data.data; }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });


            //When ItemType is jewelary
            if ($scope.ItemDetails.category != null && angular.isDefined($scope.ItemDetails.category)) {
                if ($scope.ItemDetails.category.name.toUpperCase() == 'JEWELRY') {
                    GetItemTypeList();
                }
            }
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            $(".page-spinner-bar").addClass("hide");
            toastr.remove();
            toastr.error(error.data.errorMessage, $translate.instant("ErrorHeading"));
            $scope.ErrorMessage = error.data.errorMessage;
        });
    }

    $scope.CheckForAlreadyAddedComparables =CheckForAlreadyAddedComparables;
    function CheckForAlreadyAddedComparables() {
        if ($scope.Comparables != null && $scope.Comparables.comparableItems != null) {
            angular.forEach($scope.Comparables.comparableItems, function (item) {
                $scope.AddedComparables.push({
                    "id": item.id,
                    "description": (angular.isDefined(item.description) && item.description != null ? item.description : "N/A"),
                    "brand": item.brand, "model": item.brand,
                    "price": (angular.isDefined(item.unitPrice) && item.unitPrice !== "N/A" ? item.unitPrice : "N/A"), "buyURL": item.buyURL,
                    "isDataImage": item.isDataImage, "supplier": item.supplier, "imageURL": item.imageData, "isvendorItem": item.isvendorItem, "isReplacementItem": item.isReplacementItem
                })
            })
        } else {
            $scope.AddedComparables = [];
        }
        if ($scope.Comparables.comparableItems != null) {
            $scope.displayReplacement = false;
            $scope.displaycomparables = true;
            $scope.displayEmptyPart = false;
            $scope.dispalyAddedComparables = false;
        }
        else {            
            $scope.displaycomparables = false;
            $scope.displayEmptyPart = true;          
            $scope.dispalyAddedComparables = false;
            $scope.SearchReplacement();
        }
    };

    $scope.getCategory = getCategory;
    function getCategory() {
        var getpromise = ThirdPartyLineItemDetailsService.getCategory();
        getpromise.then(function (success) {
            $scope.CategoryList = success.data.data;
        }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });
    };

    $scope.SelectedSupplier;
    $scope.getReplacementSupplier = getReplacementSupplier;
    function getReplacementSupplier() {
        var GetReplacementSuplier = ThirdPartyLineItemDetailsService.GetReplacementSupplier();
        GetReplacementSuplier.then(function (success) {

            $scope.ReplacementSuplier = success.data.data;
        }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });
    }

    $scope.getActiveVendors = getActiveVendors;
    function getActiveVendors() {
        var param = { "claimNumber": $scope.CommonObj.ClaimNumber };
        var getpromise = ThirdPartyLineItemDetailsService.getVendorsListAgainstClaim(param);
        getpromise.then(function (success) {

            $scope.ClaimParticipantsList = success.data.data;
            angular.forEach($scope.ClaimParticipantsList, function (participant) {
                if (participant.firstName == null) {
                    participant.firstName = " ";
                }
                if (participant.lastName == null) {
                    participant.lastName = " ";
                }
            });
        }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });
    }
    //go back function
    $scope.goBack = goBack;
    function goBack(e) {
        role = sessionStorage.getItem('RoleList');
        if (role == 'GEMLAB ADMINISTRATOR')
            $location.url('GemlabClaimDetails');
        else
            $location.url('ThirdPartyClaimDetails');
    }

    $scope.Back = Back;
    function Back() {
        $scope.tab = 'Contents';
    }

    //open model item value
    $scope.openValueModel = openValueModel;
    function openValueModel() {
        var ItemDetails = {
            "ItemId": $scope.ItemDetails.id,
            "ItemName": $scope.ItemDetails.itemName,
            "quotedPrice": $scope.ItemDetails.totalStatedAmount,
            "IsReplaced": $scope.ItemDetails.isReplaced,
            "depriciationRate": $scope.ItemDetails.depriciationRate,
            "totalTax": $scope.ItemDetails.totalTax,
            "acv": $scope.ItemDetails.acv, "taxRate": $scope.ItemDetails.taxRate, "TotalValue": $scope.ItemDetails.rcvTotal, "rcv": $scope.ItemDetails.rcv
        };
        $scope.animationsEnabled = true;
        var out = $uibModal.open(
            {
                animation: $scope.animationsEnabled,
                templateUrl: "views/ThirdPartyVendor/ItemValue.html",
                controller: "ItemValueController",
                resolve:
                {
                    items: function () {
                        return ItemDetails;
                    }
                }

            });
        out.result.then(function (value) {
            if (value === "Success") {
                var param = {
                    "itemId": $scope.CommonObj.ItemId
                };
                var getItemDetailsOnId = ThirdPartyLineItemDetailsService.gteItemDetails(param);
                getItemDetailsOnId.then(function (success) {
                    $scope.ItemDetails = success.data.data;
                    GetSubCategory();
                    if ($scope.ItemDetails.assignedTo !== null)
                        $scope.AssignedName = $scope.ItemDetails.assignedTo.firstName + " " + $scope.ItemDetails.assignedTo.lastName;
                    else
                        $scope.AssignedName = ""
                    $scope.CommonObj.SearchComparables = angular.copy($scope.ItemDetails.description)
                }, function (error) {
                    $scope.ErrorMessage = error.data.errorMessage;
                });
            }
            //Call Back Function success
        }, function () {

        });
        return {
            open: open
        };
    }

    // *************Add delete comparable form DBlist********************
    $scope.DeletItem = DeletItem;
    function DeletItem(ev) {
        bootbox.confirm({
            size: "",
            closeButton: false,
            title: "Delet Lost/Damaged Item ",
            message: "Are you sure you want to delete this item?  <b>Please Confirm!",
            className: "modalcustom", buttons: {
                confirm: {
                    label: 'Yes',
                    className: 'btn-success'
                },
                cancel: {
                    label: 'No',
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                //if (result)  call delet function
                if (result) {
                    var param = [{
                        "itemId": $scope.CommonObj.ItemId

                    }];
                    var deleteitem = ThirdPartyLineItemDetailsService.deleteLineItem(param);
                    deleteitem.then(function (success) {

                        $scope.Status = success.data.status;
                        if ($scope.Status === 200) {

                            toastr.remove()
                            toastr.success(success.data.message, $translate.instant("SuccessHeading"));
                        }
                    }, function (error) {
                        toastr.remove()
                        toastr.error(error.data.errorMessage, $translate.instant("ErrorHeading"));

                        $scope.ErrorMessage = error.data.errorMessage;
                    });

                }
            }
        });
    }

    //Delete comparables fro list
    $scope.DeletedComparables = [];
    $scope.DeleteComparable = DeleteComparable;
    function DeleteComparable(comp) {
        comp.delete = true;
        $scope.DeletedComparables.push(comp);
        $scope.Comparables.comparableItems.splice($scope.Comparables.comparableItems.indexOf(comp), 1);      
        CalculateACV();
    }

    //Mark as replacement list
    $scope.MarkAsReplacement = MarkAsReplacement;
    function MarkAsReplacement(comp) {
        angular.forEach($scope.Comparables.comparableItems, function (item) {
            if (comp.id != item.id) {
                if (item.isReplacementItem == true) {
                    item.isReplacementItem = false;
                }
            }
            else if (comp.id == item.id) {
                comp.isReplacementItem = true;
                $scope.ItemDetails.adjusterDescription = comp.description;
            }
        });
        CalculateACV();
    }

    // ************* End comparable form DBlist********************
    //*********************Googole search**********************************
    $scope.Searchoptions = [1, 3];
    $scope.SearchReplacement = SearchReplacement;
    function SearchReplacement() {
        //Get items if exists in dbcomparable list and add to addtocomparables list
        if ($scope.Comparables !== null) {
            $(".page-spinner-bar").removeClass("hide");
            if ($scope.AddedComparables.length === 0) {
                angular.forEach($scope.Comparables.comparableItems, function (item) {                  
                    if (angular.isDefined(item.customItemDetail) && item.customItemDetail != null) {
                        angular.forEach(item.customItemDetail.customSubItem, function (subitem) {                          
                            $scope.AddedComparables.push({
                                "id": subitem.id,
                                "description": subitem.description, "brand": null, "model": null, "price": ((subitem.unitPrice.toString()).indexOf('$') > -1) ? subitem.unitPrice.split('$')[1].replace(",", "") : subitem.unitPrice, "buyURL": null,
                                "isDataImage": false, "supplier": null, "imageURL": subitem.attachment[0].url, "isvendorItem": true,
                            });
                        });
                    }
                    else {                       
                        $scope.AddedComparables.push({
                            "id": item.id,
                            "description": item.description, "brand": item.brand, "model": item.model, "price": ((item.unitPrice.toString()).indexOf('$') > -1) ? item.unitPrice.split('$')[1].replace(",", "") : item.unitPrice, "buyURL": item.buyURL,
                            "isDataImage": item.isDataImage, "supplier": item.supplier, "imageURL": ((item.imageData !== null) ? item.imageData : item.imageURL), "isvendorItem": item.isvendorItem,
                        });
                    }
                });
            }

            $(".page-spinner-bar").addClass("hide");
        }
        if ($scope.CommonObj.SearchComparables !== null && !angular.isUndefined($scope.CommonObj.SearchComparables) && $scope.CommonObj.SearchComparables !== "") {
            $(".page-spinner-bar").removeClass("hide");
            $scope.displaycomparables = false;
            $scope.displayReplacement = true;
            $scope.displayEmptyPart = false;
            $scope.dispalyAddedComparables = true;
            $scope.GoogleComparableList = [];
            // Get compaiables form google id will be google or amazon and many more      
            if ($scope.Searchoptions === null || $scope.Searchoptions.length === 0) {

                if ($scope.ReplacementSuplier.length > 0) {
                    $scope.Searchoptions.push(parseInt($scope.ReplacementSuplier[0].id));
                }
                else
                    $scope.Searchoptions = [1];
            }
            var Searchstring = {
                "item": $scope.CommonObj.SearchComparables,
                "numberOfCounts": 10,
                "ids": $scope.Searchoptions
            };
            var GetGoogleCompairables = ThirdPartyLineItemDetailsService.GetComparableListFromGoogle(Searchstring);
            GetGoogleCompairables.then(function (success) {
                //We need to work here googleResults  amazonResults
                var listgooleComparable = [];
                angular.forEach(success.data.data.googleResults, function (item) {                    
                    listgooleComparable.push({
                        "id": null,
                        "description": (angular.isDefined(item.description) && item.description!=null?item.description:"N/A"),
                        "brand": "N/A", "model": "N/A",
                        "price": (angular.isDefined(item.itemPrice) && item.itemPrice !== "N/A"?item.itemPrice:"N/A"), "buyURL": item.itemURL,
                        "isDataImage": true, "supplier": null, "imageURL": item.itemImage, "isvendorItem": false
                    });
                });
                var amazonComparable = [];
                angular.forEach(success.data.data.amazonResults, function (item) {
                    amazonComparable.push({
                        "id": null,
                        "description": item.description, "brand": item.brand, "model": item.model, "price": ((item.price.toString()).indexOf('$') > -1) ? item.price.split('$')[1].replace(",", "") : item.price, "buyURL": item.buyURL,
                        "isDataImage": false, "supplier": null, "imageURL": item.imageURL, "isvendorItem": false
                    });
                });
                var VendorComparables = [];
                angular.forEach(success.data.data.vendorCatalogItems, function (item) {
                    VendorComparables.push({
                        "id": null,
                        "description": item.description, "brand": item.brand, "model": item.model, "price": ((item.price.toString()).indexOf('$') > -1) ? item.price.split('$')[1].replace(",", "") : item.price, "buyURL": null,
                        "isDataImage": false, "supplier": null, "imageURL": ((item.itemImages !== null) ? ((item.itemImages.length > 0) ? item.itemImages[0].url : null) : null), "isvendorItem": true
                    });
                });
                $scope.GoogleComparableList = listgooleComparable.concat(amazonComparable);
                $scope.GoogleComparableList = $scope.GoogleComparableList.concat(VendorComparables);
                $scope.SortGoogleResult();
                $(".page-spinner-bar").addClass("hide");
            }, function (error) {
                $(".page-spinner-bar").addClass("hide");
                $scope.ErrorMessage = error.data.erromessage;
            });
        }
        else {
            $scope.SearchReplacement();
        }
    }
    //Sort Google result
    $scope.reverseOrder = false;
    $scope.SortGoogleResult = SortGoogleResult;
    function SortGoogleResult(type) {
        if (angular.isDefined(type)) {
            $scope.reverseOrder = type == "true" ? true : false;
        }
        angular.forEach($scope.GoogleComparableList, function (item) {
            if (item.price!=='N/A')
            item.price = parseFloat(item.price);
        })
    };

    //List for selected comparables and function add it in list\
    $scope.AddedComparables = [];
    $scope.AddtoComparableList = AddtoComparableList;
    function AddtoComparableList(item) {
        $scope.GoogleComparableList.splice($scope.GoogleComparableList.indexOf(item), 1);
        $scope.AddedComparables.push(item);
       
    };

    //Remove form comaprables from list
    $scope.RemoveFromComparableList = RemoveFromComparableList;
    function RemoveFromComparableList(item) {
        $scope.AddedComparables.splice($scope.AddedComparables.indexOf(item), 1);
        // $scope.CalculateRCV();
        if (item.id === null)
            $scope.GoogleComparableList.push(item);
    }
    //Go to shopping URL
    $scope.ShopNow = ShopNow;
    function ShopNow(comparable) {
        $window.open(comparable.buyURL, '_blank');
    }

    $scope.SaveNewlyAddedComparables = SaveNewlyAddedComparables;
    function SaveNewlyAddedComparables() {
        $(".page-spinner-bar").removeClass("hide");
        var ComparableList = [];
        //If comparabales are newly added then it goed into this block
        angular.forEach($scope.AddedComparables, function (item) {
            if (item.id === null) {
                ComparableList.push({
                    //"id": item.id,
                    "originalItemId": $scope.ItemDetails.id,
                    "isvendorItem": item.isvendorItem,
                    "description": item.description,
                    "itemName": $scope.ItemDetails.itemName,
                    "unitPrice": item.price,
                    "taxRate": null,
                    "brand": item.brand,
                    "model": item.model,
                    "supplier": item.supplier,
                    "itemType": $scope.ItemDetails.itemType,
                    "isReplacementItem":false,
                    "buyURL": item.buyURL,
                    "isDataImage": item.isDataImage,
                    "imageData": (item.isDataImage) ? item.imageURL : null,
                    "imageURL": (!item.isDataImage) ? item.imageURL : null,
                    "delete": false
                });
            }
        });
        if ($scope.Comparables !== null) {
            if ($scope.Comparables.comparableItems !== null) {
                angular.forEach($scope.Comparables.comparableItems, function (item) {
                    var InsertFlag = false;
                    angular.forEach($scope.AddedComparables, function (addedComparableitem) {
                        if (item.id === addedComparableitem.id) {
                            if (item.isReplacementItem == true) {
                                InsertFlag = true;
                            }
                        }
                    });
                    if (InsertFlag === true) {
                        ComparableList.push(item);
                    }
                });
            }
        }
        angular.forEach($scope.DeletedComparables, function (item) {
            ComparableList.push(item);
        });
        var param = {
            "registrationNumber": $scope.CommonObj.CompanyCRN,
            "claimItem": {
                "id": $scope.ItemDetails.id,
                "itemUID": $scope.ItemDetails.itemUID,//"DA022ED3B388",
                "acv": $scope.ItemDetails.acv,
                "acvTax": $scope.ItemDetails.acvTax,
                "acvTotal": $scope.ItemDetails.acvTotal,
                "adjusterDescription": $scope.ItemDetails.adjusterDescription,
                "deductibleAmount": $scope.ItemDetails.deductibleAmount,
                "ageMonths": $scope.ItemDetails.ageMonths,
                "ageYears": $scope.ItemDetails.ageYears,
                "appraisalDate": $filter('DatabaseDateFormatMMddyyyy')($scope.ItemDetails.appraisalDate),
                "appraisalValue": $scope.ItemDetails.appraisalValue,
                "approvedItemValue": $scope.ItemDetails.approvedItemValue,
                "assignedTo": $scope.ItemDetails.assignedTo,
                "brand": $scope.ItemDetails.brand,
                "category": {
                    "annualDepreciation": (($scope.ItemDetails.category !== null && angular.isDefined($scope.ItemDetails.category)) ? $scope.ItemDetails.category.annualDepreciation : null),
                    "id": (($scope.ItemDetails.category !== null && angular.isDefined($scope.ItemDetails.category)) ? $scope.ItemDetails.category.id : null),
                    "name": (($scope.ItemDetails.category !== null && angular.isDefined($scope.ItemDetails.category)) ? $scope.ItemDetails.category.name : null),
                    "usefulYears": (($scope.ItemDetails.category !== null && angular.isDefined($scope.ItemDetails.category)) ? $scope.ItemDetails.category.usefulYears : null),
                    "aggregateLimit": null,
                    "description": null,
                },
                "itemUsefulYears": $scope.ItemDetails.itemUsefulYears,
                "scheduleAmount": (angular.isDefined($scope.ItemDetails.scheduleAmount) && $scope.ItemDetails.scheduleAmount != "" && $scope.ItemDetails.scheduleAmount != null ? $scope.ItemDetails.scheduleAmount : 0),
                "claimId": $scope.ItemDetails.claimId,
                "claimNumber": $scope.ItemDetails.claimNumber,
                "categoryLimit": $scope.ItemDetails.categoryLimit,
                "dateOfPurchase": (($scope.ItemDetails.dateOfPurchase !== null && angular.isDefined($scope.ItemDetails.dateOfPurchase)) ? $scope.ItemDetails.dateOfPurchase : null),
                "depriciationRate": $scope.ItemDetails.depriciationRate,
                "individualLimitAmount": $scope.ItemDetails.individualLimitAmount,
                "description": $scope.ItemDetails.description,
                "holdOverPaymentDate": $scope.ItemDetails.holdOverPaymentDate,
                "holdOverPaymentMode": $scope.ItemDetails.holdOverPaymentMode,
                "holdOverPaymentPaidAmount": $scope.ItemDetails.holdOverPaymentPaidAmount,
                "holdOverValue": $scope.ItemDetails.holdOverValue,
                "insuredPrice": $scope.ItemDetails.insuredPrice,
                "isReplaced": $scope.ItemDetails.isReplaced,
                "isScheduledItem": $scope.ItemDetails.isScheduledItem,
                "itemName": $scope.ItemDetails.itemName,
                "itemType": $scope.ItemDetails.itemType,
                "model": $scope.ItemDetails.model,
                "paymentDetails": $scope.ItemDetails.paymentDetails,
                "quantity": $scope.ItemDetails.quantity,
                "quotedPrice": $scope.ItemDetails.quotedPrice,
                "totalStatedAmount": $scope.ItemDetails.totalStatedAmount,
                "rcv": $scope.ItemDetails.rcv,
                "rcvTax": $scope.ItemDetails.rcvTax,
                "rcvTotal": $scope.ItemDetails.rcvTotal,
                "receiptValue": $scope.ItemDetails.receiptValue,
                "status": {
                    "id": (($scope.ItemDetails.status !== null && angular.isDefined($scope.ItemDetails.status)) ? $scope.ItemDetails.status.id : null),
                    "status": (($scope.ItemDetails.status !== null && angular.isDefined($scope.ItemDetails.status)) ? $scope.ItemDetails.status.status : null)
                },
                "subCategory": {
                    "annualDepreciation": (($scope.ItemDetails.subCategory !== null && angular.isDefined($scope.ItemDetails.subCategory)) ? $scope.ItemDetails.subCategory.annualDepreciation : null),
                    "id": (($scope.ItemDetails.subCategory !== null && angular.isDefined($scope.ItemDetails.subCategory)) ? $scope.ItemDetails.subCategory.id : null),
                    "name": (($scope.ItemDetails.subCategory !== null && angular.isDefined($scope.ItemDetails.subCategory)) ? $scope.ItemDetails.subCategory.name : null),
                    "usefulYears": (($scope.ItemDetails.subCategory !== null && angular.isDefined($scope.ItemDetails.subCategory)) ? $scope.ItemDetails.subCategory.usefulYears : null),
                    "description": null,
                    "aggregateLimit": null
                },
                "taxRate": $scope.ItemDetails.taxRate,
                "totalTax": $scope.ItemDetails.totalTax,
                "valueOfItem": $scope.ItemDetails.valueOfItem,
                // "vendorDetails": $scope.ItemDetails.vendorDetails,
                "vendorDetails": {
                    "billingAddress": $scope.ItemDetails.vendorDetails.billingAddress,
                    "cellPhone": $scope.ItemDetails.vendorDetails.cellPhone,
                    "dayTimePhone": $scope.ItemDetails.vendorDetails.dayTimePhone,
                    "eveningTimePhone": $scope.ItemDetails.vendorDetails.eveningTimePhone,
                    "isActive": $scope.ItemDetails.vendorDetails.isActive,
                    "shippingAddress": $scope.ItemDetails.vendorDetails.shippingAddress,
                    "vendorId": $scope.ItemDetails.vendorDetails.vendorId,
                    "vendorName": $scope.ItemDetails.vendorDetails.vendorName,
                    "vendorNumber": $scope.ItemDetails.vendorDetails.vendorNumber,
                    "website": $scope.ItemDetails.vendorDetails.website
                },
                "yearOfManufecturing": $scope.ItemDetails.yearOfManufecturing
            },
            "comparableItems": ComparableList

        };
        var SaveNewComparables = ThirdPartyLineItemDetailsService.SaveNewComparables(param);
        SaveNewComparables.then(function (success) {
            $(".page-spinner-bar").addClass("hide");
            if ($scope.ItemDetails.salvageItem) {
                var SalvageParam = {
                    "itemUID": $scope.ItemDetails.itemUID,
                    "salvageAmount": $scope.ItemDetails.salvageAmount,
                    "salvageItem": true
                }
                var SalvageItem = ThirdPartyLineItemDetailsService.SaveSalvageItem(SalvageParam);
                SalvageItem.then(function (success) {
                }, function (error) {
                    toastr.remove()
                    toastr.error(error.data.errorMessage, $translate.instant("ErrorHeading"));
                    $(".page-spinner-bar").addClass("hide");
                });
            }
            //Add replacement hide google result and show from Comparables from db
            $scope.AddedComparables = []; $scope.GoogleComparableList = [];
            // get compairables stored in database and insrt in list Comparables
            var ParamItemId = { "itemId": $scope.CommonObj.ItemId };
            var GetExistingComparablesFromDb = ThirdPartyLineItemDetailsService.GetExistingComparablesFromDb(ParamItemId);
            GetExistingComparablesFromDb.then(function (success) {
                $(".page-spinner-bar").addClass("hide");
                //Show toastr for success
                toastr.remove()
                toastr.success(success.data.message, $translate.instant("SuccessHeading"));
                $scope.Comparables = success.data.data;
                ComparableList = [];
                $scope.AddedComparables = [];
                $scope.DeletedComparables = [];
                $scope.CheckForAlreadyAddedComparables();//Adds already added comparables to added comparables list
            }, function (error) {
                $(".page-spinner-bar").addClass("hide");
                toastr.remove()
                toastr.error(error.data.errorMessage, $translate.instant("ErrorHeading"));
                $(".page-spinner-bar").addClass("hide");
                $scope.ErrorMessage = error.data.errorMessage;
            });

        }, function (error) {
            toastr.remove()
            toastr.error(error.data.errorMessage, $translate.instant("ErrorHeading"));
            $(".page-spinner-bar").addClass("hide");
            //Error Popup
        });
    }

    //*********************End Googole search**********************************
    //Show Replacement item pageload state
    $scope.AddReplacement = AddReplacement;
    function AddReplacement() {

        if ($scope.Comparables != null) {
            $scope.displaycomparables = true;
            $scope.displayEmptyPart = false;
        }
        else {
            $scope.displaycomparables = false;
            $scope.displayEmptyPart = true;
        }
    };
    //Select comparables if press back the empty list and calculate rcv again pageload state
    $scope.CancelAddedComparables = CancelAddedComparables;
    function CancelAddedComparables() {
        $scope.GoogleComparableList = [];
        $scope.AddedComparables = [];
        $scope.AddReplacement();
        // $scope.CalculateRCV();

    }

    //Save item details of post loss-------check and remove
    $scope.SaveItems = SaveItems;
    function SaveItems() {
        // Need two more parameters $scope.ItemDetails.isReplaced; TotalTax
        var param = new FormData();
        param.append('filesDetails', JSON.stringify([{ "fileType": "IMAGE", "extension": ".png", "filePurpose": "ITEM", "latitude": 41.403528, "longitude": 2.173944 }]));
        param.append('file', $scope.ItemImageList);
        param.append("itemDetails", JSON.stringify({
            "id": $scope.ItemDetails.id,
            "acv": $scope.ItemDetails.acv,
            "adjusterDescription": $scope.ItemDetails.adjusterDescription,
            "brand": $scope.ItemDetails.brand,
            "category": {
                "id": (($scope.ItemDetails.category !== null && angular.isDefined($scope.ItemDetails.category)) ? ItemDetails.category.id : null)
            },
            "dateOfPurchase": (($scope.ItemDetails.dateOfPurchase !== null && angular.isDefined($scope.ItemDetails.dateOfPurchase)) ? $scope.ItemDetails.dateOfPurchase : null),
            "depriciationRate": $scope.ItemDetails.depriciationRate,
            "description": $scope.ItemDetails.description,
            "insuredPrice": $scope.ItemDetails.insuredPrice,
            "quantity": $scope.ItemDetails.quantity,
            "totalTax": $scope.ItemDetails.totalTax,
            "isReplaced": $scope.ItemDetails.isReplaced,
            "holdOverValue": $scope.ItemDetails.holdOverValue,
            "itemName": $scope.ItemDetails.itemName,
            "model": $scope.ItemDetails.model,
            "quotedPrice": $scope.ItemDetails.quotedPrice,
            "rcv": $scope.ItemDetails.rcv,
            "subCategory": {
                "id": (($scope.ItemDetails.subCategory !== null && angular.isDefined($scope.ItemDetails.subCategory)) ? ItemDetails.subCategory.id : null)
            },
            "taxRate": $scope.ItemDetails.taxRate,
            "valueOfItem": $scope.ItemDetails.valueOfItem,
            "yearOfManufecturing": $scope.ItemDetails.yearOfManufecturing,
            "status": {
                "id": $scope.ItemDetails.status.id
            },
            "isScheduledItem": $scope.ItemDetails.isScheduledItem,
            "age": $scope.ItemDetails.age
        }));
        var SaveItemDetails = ThirdPartyLineItemDetailsService.SaveItemDetails(param);
        SaveItemDetails.then(function (success) {
            //Show message
            toastr.remove()
            toastr.success(success.data.message, $translate.instant("SuccessHeading"));
        }, function (error) {  //Show message
            toastr.remove()
            toastr.error(error.data.errorMessage, $translate.instant("ErrorHeading"));
        });

    }

    //Calculate ACV RCV 
    $scope.OriginalRCVOfItem = 0;
    $scope.OrignialLength = 0;
    $scope.CalculateACV = $scope.CalculateACV;
    function CalculateACV() {

        //ACV = P - ((CA / EL) * P) Formula
        //Get Price of added comparable value 

        var Price = 0.0; var taxRate = 0.0;
        var ACV = 0.0; var RCV = 0.0;
        var Age = 0.0; var usefulYears = 0.0;
        var EL = 0.0; var CA = 0.0;

        angular.forEach($scope.Comparables.comparableItems, function (item) {
            if (item.isReplacementItem == true) {
                Price = parseFloat(item.unitPrice);
            }
        });

        //Get age of item
        if ($scope.ItemDetails.ageMonths !== null && angular.isDefined($scope.ItemDetails.ageMonths) && $scope.ItemDetails.ageMonths > 0) {
            if ($scope.ItemDetails.ageYears !== null && angular.isDefined($scope.ItemDetails.ageYears) && $scope.ItemDetails.ageYears !== "")
                Age = parseFloat($scope.ItemDetails.ageYears) + (parseFloat($scope.ItemDetails.ageMonths) / 12);
            else
                Age = (parseFloat($scope.ItemDetails.ageMonths) / 12);
        }
        else {
            if ($scope.ItemDetails.ageYears !== null && angular.isDefined($scope.ItemDetails.ageYears))
                Age = parseFloat($scope.ItemDetails.ageYears);
        }
        //if usefulYears not getting form db then calculate usefulYears by formula 
        //Useful Years = 100 / (Depreciation %) = 100/10 = 10 years
        if ($scope.ItemDetails.subCategory != null && angular.isUndefined($scope.ItemDetails.subCategory)) {
            if ($scope.ItemDetails.subCategory.usefulYears == null || angular.isUndefined($scope.ItemDetails.subCategory.usefulYears)) {
                if ($scope.ItemDetails.depriciationRate != null && angular.isUndefined($scope.ItemDetails.depriciationRate)) {
                    usefulYears = parseFloat(100 / $scope.ItemDetails.depriciationRate)
                }
            } else {
                usefulYears = $scope.ItemDetails.subCategory.usefulYears;
            }
        }
        else {
            if ($scope.ItemDetails.depriciationRate != null && angular.isUndefined($scope.ItemDetails.depriciationRate)) {
                usefulYears = parseFloat(100 / $scope.ItemDetails.depriciationRate)
            } else {
                //set useful year here if the item usefull year is not mention in the database
                usefulYears = 10;
            }
        }
        EL = (usefulYears = null ? 0 : usefulYears);
        CA = parseFloat(Age);

        ACV = isNaN(ACV) ? 0 : ACV;
        Price = isNaN(Price) ? 0 : Price;
        CA = isNaN(CA) ? 0 : CA;
        EL = isNaN(EL) ? 0 : EL;

        ACV = parseFloat(Price) - ((parseFloat(CA) / parseFloat(EL)) * parseFloat(Price)).toFixed(2);
        RCV = parseFloat(Price);
        taxRate = (isNaN($scope.ItemDetails.taxRate) ? 0 : ($scope.ItemDetails.taxRate)).toFixed(2);
        $scope.ItemDetails.totalTax = parseFloat((taxRate / 100) * (isNaN(Price) ? 1 : Price)).toFixed(2);
        $scope.ItemDetails.rcvTotal = (parseFloat($scope.ItemDetails.totalTax) + parseFloat(Price)).toFixed(2);
        $scope.ItemDetails.holdOverValue = RCV - ACV;
        if ($scope.ItemDetails.holdOverValue < 0)
            $scope.ItemDetails.holdOverValue = 0;
        //////RCV
        //////Case 1 : Receipt value < RCV      
        ////if ((item.itemValue ) < $scope.ItemDetails.individualLimitAmount) {
        ////    $scope.RCVValue = (item.itemValue);
        ////}
        ////    //Case 2 : Receipt value > RCV
        ////else if ((item.itemValue) > $scope.ItemDetails.individualLimitAmount) {
        ////    $scope.RCVValue = scope.ItemDetails.individualLimitAmount;
        ////}
        //////Case 3 : Replacement value < RCV but the group total exceeds group limits    
        //////RCV (for engagement ring) = (group limit) - (cost of individual items already replaced) = $20,000 - $12,500 = $7,500  
        //////TotalGroupitemValue = addtion of all RCV of the item that belog to same category
        ////if ($scope.ItemDetails.category !== null) {
        ////    if ($scope.ItemDetails.category.aggregateLimit !== null && $scope.ItemDetails.category.aggregateLimit >> 0) {
        ////        if ((TotalGroupitemValue + item.itemValue) > $scope.ItemDetails.category.aggregateLimit) {
        ////                $scope.RCVValue = $scope.ItemDetails.category.aggregateLimit - TotalGroupitemValue;                
        ////        }
        ////    }
        ////}
        //////End Calculating RCV
        //////HoldOver
        ////var hode = Rcv - ACV;

        $scope.ItemDetails.acv = (parseFloat(ACV)).toFixed(2);
        $scope.ItemDetails.rcv = (parseFloat(RCV)).toFixed(2);
        if (isNaN($scope.ItemDetails.valueOfItem)) {
            $scope.ItemDetails.valueOfItem = 0;
        }
        if (isNaN($scope.ItemDetails.holdOverValue)) {
            $scope.ItemDetails.holdOverValue = 0;
        }
        if (isNaN($scope.ItemDetails.totalTax)) {
            $scope.ItemDetails.totalTax = 0;
        }
        if (isNaN($scope.ItemDetails.acv)) {
            $scope.ItemDetails.acv = 0;
        }
        if (isNaN($scope.ItemDetails.rcv)) {
            $scope.ItemDetails.rcv = 0;
        }
        if (isNaN($scope.ItemDetails.rcvTax)) {
            $scope.ItemDetails.rcvTax = 0;
        }
        if (isNaN($scope.ItemDetails.rcvTotal)) {
            $scope.ItemDetails.rcvTotal = 0;
        }
        if (isNaN($scope.ItemDetails.acvTotal)) {
            $scope.ItemDetails.acvTotal = 0;
        }
        if (isNaN($scope.ItemDetails.acvTax)) {
            $scope.ItemDetails.acvTax = 0;
        }
    }

    //Calculate RCV
    $scope.CalculateRCV = function () {
        if ($scope.Comparables !== null) {
            $scope.OriginalRCVOfItem = 0;
            $scope.OrignialLength = 0;

            //Get total of comparable value if already has (Saved in database)
            var list = [];
            list = $filter('filter')($scope.Comparables.comparableItems, { delete: false });
            angular.forEach(list, function (item) {
                if (item.isReplacementItem == true) {
                    $scope.OriginalRCVOfItem = $scope.OriginalRCVOfItem + parseFloat(item.unitPrice)
                }
            });

            $scope.OrignialLength = (angular.isDefined(list) && list != null) ? list.length : 0;
        }
        var TotalPrice = 0;
        var count = 0; var age = 1; var Depereciation = 1;
        //Get total of added comparable value 
        angular.forEach($scope.AddedComparables, function (item) {
            if (item.isReplacementItem == true) {
                TotalPrice = parseFloat(TotalPrice) + parseFloat(item.price);
                count++;
            }
        });
        TotalPrice = (angular.isDefined(TotalPrice) && (TotalPrice != null) && (TotalPrice == "") ? TotalPrice : 0);

        //Toatal RCV if more than one comparable is added
        $scope.ItemDetails.rcv = ((TotalPrice + $scope.OriginalRCVOfItem) / (count + $scope.OrignialLength)).toFixed(2);

        //Get age of item
        if ($scope.ItemDetails.ageMonths !== null && angular.isDefined($scope.ItemDetails.ageMonths) && $scope.ItemDetails.ageMonths > 0) {
            if ($scope.ItemDetails.ageYears !== null && angular.isDefined($scope.ItemDetails.ageYears) && $scope.ItemDetails.ageYears !== "")
                age = parseFloat($scope.ItemDetails.ageYears) + (parseFloat($scope.ItemDetails.ageMonths) / 12);
            else
                age = (parseFloat($scope.ItemDetails.ageMonths) / 12);
        }
        else {
            if ($scope.ItemDetails.ageYears !== null && angular.isDefined($scope.ItemDetails.ageYears))
                age = parseFloat($scope.ItemDetails.ageYears);
            else
                age = 1;
        }

        //Get Depereciation rate
        if ($scope.ItemDetails.depriciationRate !== null && angular.isDefined($scope.ItemDetails.depriciationRate) && $scope.ItemDetails.depriciationRate > 0)
            Depereciation = $scope.ItemDetails.depriciationRate;
        else
            Depereciation = 0.1;

        //frequency is always 12  by sameer       
        var frequency = parseFloat(12);
        var DepereciationAmount = parseFloat($scope.ItemDetails.rcv) * (Math.pow((1 + (parseFloat(Depereciation) / (100 * frequency))), (frequency * age)));

        //ACV of item
        $scope.ItemDetails.acv = (parseFloat($scope.ItemDetails.rcv) - (DepereciationAmount - parseFloat($scope.ItemDetails.rcv))).toFixed(2);

        //Toatal value of item 
        if (angular.isDefined($scope.ItemDetails.taxRate) && $scope.ItemDetails.taxRate !== null) {
            $scope.ItemDetails.valueOfItem = (parseFloat($scope.ItemDetails.rcv)).toFixed(2);
            //Tax applied on ACV
            $scope.ItemDetails.totalTax = (parseFloat($scope.ItemDetails.acv) * ($scope.ItemDetails.taxRate / 100)).toFixed(2);

            $scope.ItemDetails.acvTax = parseFloat((parseFloat($scope.ItemDetails.acv) * ($scope.ItemDetails.taxRate / 100))).toFixed(2);
            $scope.ItemDetails.acvTotal = (parseFloat(parseFloat($scope.ItemDetails.acv)) + parseFloat((parseFloat($scope.ItemDetails.acv) * ($scope.ItemDetails.taxRate / 100)))).toFixed(2);
            //Calculate tax on rcv and total rcv
            $scope.ItemDetails.rcvTax = ($scope.ItemDetails.rcv * ($scope.ItemDetails.taxRate / 100)).toFixed(2);
            var tx = angular.copy($scope.ItemDetails.rcvTax);
            var val = angular.copy($scope.ItemDetails.rcv);
            $scope.ItemDetails.rcvTotal = (parseFloat(tx) + parseFloat(val)).toFixed(2);
        }
        else {
            $scope.ItemDetails.valueOfItem = (parseFloat($scope.ItemDetails.rcv)).toFixed(2);
            $scope.ItemDetails.totalTax = 0.0;
            $scope.ItemDetails.acvTax = 0.00;
            $scope.ItemDetails.acvTotal = $scope.ItemDetails.acv;
            $scope.ItemDetails.rcvTax = 0.00;
            $scope.ItemDetails.rcvTotal = $scope.ItemDetails.rcv
        }
        //Hold over for item
        $scope.ItemDetails.holdOverValue = (parseFloat($scope.ItemDetails.rcv) - parseFloat($scope.ItemDetails.acv)).toFixed(2);
        //Check if the value is Nan or not

        $scope.ItemDetails.acv = (parseFloat($scope.ItemDetails.acv)).toFixed(2);
        $scope.ItemDetails.rcv = (parseFloat($scope.ItemDetails.rcv)).toFixed(2);
        if (isNaN($scope.ItemDetails.valueOfItem)) {
            $scope.ItemDetails.valueOfItem = 0;
        }
        if (isNaN($scope.ItemDetails.holdOverValue)) {
            $scope.ItemDetails.holdOverValue = 0;
        }
        if (isNaN($scope.ItemDetails.totalTax)) {
            $scope.ItemDetails.totalTax = 0;
        }
        if (isNaN($scope.ItemDetails.acv)) {
            $scope.ItemDetails.acv = 0;
        }
        if (isNaN($scope.ItemDetails.rcv)) {
            $scope.ItemDetails.rcv = 0;
        }
        if (isNaN($scope.ItemDetails.rcvTax)) {
            $scope.ItemDetails.rcvTax = 0;
        }
        if (isNaN($scope.ItemDetails.rcvTotal)) {
            $scope.ItemDetails.rcvTotal = 0;
        }
        if (isNaN($scope.ItemDetails.acvTotal)) {
            $scope.ItemDetails.acvTotal = 0;
        }
        if (isNaN($scope.ItemDetails.acvTax)) {
            $scope.ItemDetails.acvTax = 0;
        }
    }

    //------------Auto compalete extender----------------------------------
    //select particiapnt
    $scope.afterSelectedParticipant = function () {
        var id = angular.copy($scope.CommonObj.ParticipantId);
        var seleted = $filter('filter')($scope.ClaimParticipantsList, { id: id });
        $scope.ParticipantName = seleted[0].firstName + " " + seleted[0].lastName;
    };
    $scope.ParticipantName = [];
    $scope.participants = [];//select particiapnt
    $scope.GetNoteParticipant = function (selected) {
        if (selected) {
            var flag = 0;
            angular.forEach($scope.participants, function (participant) {

                if (participant.participantId == selected.originalObject.participantId) {
                    flag++;
                }

            });

            if (flag == 0) {

                $scope.participants.push({
                    "participantId": selected.originalObject.participantId,
                    "participantType": selected.originalObject.participantType
                })
                $scope.ParticipantName.push(selected.originalObject.firstName + " " + selected.originalObject.lastName);
            }
        }

    }

    // search function to match full text 
    $scope.localSearch = function (str) {
        var matches = [];
        $scope.ClaimParticipantsList.forEach(function (person) {
            var fullName = ((person.firstName === null) ? "" : person.firstName.toLowerCase()) + ' ' + ((person.lastName === null) ? "" : person.lastName.toLowerCase());
            if (fullName.indexOf(str.toString().toLowerCase()) >= 0) {
                matches.push(person);
            }
        });
        return matches;
    };

    $scope.PraticipantIdList = [];
    //Add note with attachment against claim item
    $scope.AddNote = function (e) {
        //NoteParticipants
        var data = new FormData();
        data.append("mediaFilesDetail", JSON.stringify([{ "fileName": $scope.fileName, "fileType": $scope.FileType, "extension": $scope.FileExtension, "filePurpose": "NOTE", "latitude": null, "longitude": null }]));

        data.append("file", $scope.files[0]);
        var NoteUser = [];
        if ($scope.PraticipantIdList.length > 0) {
            angular.forEach($scope.PraticipantIdList, function (participant) {
                angular.forEach($scope.ClaimParticipantsList, function (item) {
                    if (participant === item.participantId) {
                        NoteUser.push({
                            "participantId": participant, "participantType": { "id": item.participantType.id, "participantType": item.participantType.participantType }
                        });
                    }
                });
            });

            data.append("noteDetail", JSON.stringify({
                "claimId": $scope.CommonObj.ClaimId.toString(),
                "itemId": $scope.CommonObj.ItemId,
                "serviceId": null,
                "isPublicNote": false,
                "message": $scope.CommonObj.ItemNote,
                "groupDetails": {
                    "groupId": null,
                    "groupTitle": "Item Note Group",
                    "groupTitle": "Claim Note Group",
                    "participants": NoteUser
                }
            }));

            var getpromise = ThirdPartyLineItemDetailsService.addClaimNoteWithParticipant(data);
            getpromise.then(function (success) {
                $scope.Status = success.data.status;
                if ($scope.Status === 200) {
                    toastr.remove()
                    toastr.success(success.data.message, $translate.instant("SuccessHeading"));
                    angular.element("input[type='file']").val(null);
                    $scope.fileName = '';
                    $scope.FileType = '';
                    $scope.FileExtension = '';
                    //after adding new note updating note list
                    GetNotes();
                    $scope.ReplyNoteForm.$setUntouched();
                }
            }, function (error) {
                toastr.remove()
                toastr.error(error.data.errorMessage, $translate.instant("ErrorHeading"));
                $scope.ErrorMessage = error.data.errorMessage;
            });
        }
        else {
            data.append("noteDetail", JSON.stringify({

                "claimId": $scope.CommonObj.ClaimId.toString(),
                "itemId": $scope.CommonObj.ItemId,
                "serviceId": null,
                "message": $scope.CommonObj.ItemNote,
                "isPublicNote": true,
                "groupDetails": null

            }));

            var getpromise = ThirdPartyLineItemDetailsService.addClaimNoteWithParticipant(data);
            getpromise.then(function (success) {
                $scope.Status = success.data.status;
                if ($scope.Status === 200) {
                    toastr.remove()
                    toastr.success(success.data.message, $translate.instant("SuccessHeading"));
                    angular.element("input[type='file']").val(null);
                    $scope.fileName = '';
                    $scope.FileType = '';
                    $scope.FileExtension = '';
                    //after adding new note updating note list
                    GetNotes();
                }
            }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });
        }

    }

    //------------End Auto compalete extender----------------------------------

    //---------------Note Attachment------------------------------------------
    $scope.fileName = '';
    $scope.FileExtension = '';
    $scope.FileType = '';
    $scope.files = [];

    //for claim attachment
    $scope.SelectNoteFile = function () {
        angular.element('#NoteFileUpload').trigger('click');

    };

    //Get note attachment details
    $scope.getNoteFileDetails = getNoteFileDetails;
    function getNoteFileDetails(event) {

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
            $scope.files.push({ "FileName": e.target.fileName, "FileExtension": e.target.fileExtension, "FileType": e.target.fileType, "Image": e.target.result, "File": e.target.file })
        });
    }

    function GetNotes() {
        $(".page-spinner-bar").removeClass("hide");
        var param = {
            "itemId": $scope.CommonObj.ItemId
        };
        var getpromise = ThirdPartyLineItemDetailsService.getItemNotes(param);
        getpromise.then(function (success) {
            //   $scope.Notes = success.data.data;
            $scope.Notes = $filter('orderBy')(success.data.data, 'createDate', true);
            if ($scope.Notes !== null && $scope.Notes.length > 0) {
                $scope.NoteDetails = $scope.Notes[0];
                $scope.NoteIndex = 0;
                $(".page-spinner-bar").addClass("hide");
            }
        }, function (error) {
            $scope.ErrorMessage = error.data.errorMessage;
            $(".page-spinner-bar").addClass("hide");
        });

    }
    //---------------End Note Attachment------------------------------------------
    $scope.GetSubCategory = GetSubCategory;
    function GetSubCategory() {
        //--------------------------------------------------------------------------------------------------------------
        //bind subcategory
        if ($scope.ItemDetails.category !== null && angular.isDefined($scope.ItemDetails.category)) {
            var param = { "categoryId": $scope.ItemDetails.category.id };
            var getpromise = ThirdPartyLineItemDetailsService.getSubCategory(param);
            getpromise.then(function (success) {
                $scope.SubCategoryList = success.data.data;
                //Get anual depreciation rate and apply it $scope.ItemDetails.depriciationRate  
            }, function (error) {
                $scope.ErrorMessage = error.data.errorMessage;
            });
        }
    };
    //Add item Image
    $scope.SelectItemImage = function () {
        $scope.displayImageName = true; $scope.displayAddImageButton = false;
        $scope.EnableAddImage = true;
        angular.element('#ItemImageUpload').trigger('click');

    };

    //Change DepriciationRate
    $scope.ChangeDepriciationRate = function () {
        var list = [];
        list = $filter('filter')($scope.SubCategoryList, { id: $scope.ItemDetails.subCategory.id });
        if (list !== null && list.length > 0) {
            $scope.ItemDetails.depriciationRate = list[0].annualDepreciation;
            $scope.ItemDetails.itemUsefulYears = list[0].usefulYears;
            // $scope.CalculateRCV();
        }

    };
    //Change Total stated value if quantity and stated value changes
    $scope.CalculateTotalStatedValue = function () {
        if ($scope.ItemDetails.quantity > 0) {
            if ($scope.ItemDetails.quotedPrice > 0) {
                $scope.ItemDetails.totalStatedAmount = (parseInt($scope.ItemDetails.quantity) * parseFloat($scope.ItemDetails.quotedPrice)).toFixed(2);
            }
        }
    }
    $scope.ImageName;
    $scope.ImageType;
    $scope.ImgExtension;
    $scope.ItemImageList = [];
    $scope.displayImageName = false;

    $scope.EnableAddImage = true;
    $scope.getItemImageDetails = function (e) {
        $scope.$apply(function () {
            $scope.ImageName = e.files[0].name;
            $scope.ImageType = e.files[0].type;
            $scope.ImgExtension = $scope.ImageName.substr($scope.ImageName.lastIndexOf('.'));
            $scope.ItemImageList.push(e.files[0]);
            fr = new FileReader();
            //fr.onload = receivedText;
            fr.readAsDataURL(e.files[0]);
            $scope.displayImageName = true;
            $scope.displayAddImageButton = false;
        });
        $scope.EnableAddImage = false;
        $scope.AddImage();
    };

    $scope.AddImage = function () {
        var param = new FormData();
        param.append('filesDetails', JSON.stringify([{ "fileType": "IMAGE", "extension": ".png", "filePurpose": "ITEM", "latitude": null, "longitude": null }]));
        param.append('file', $scope.ItemImageList[0]);
        param.append("itemDetails", JSON.stringify({
            "id": $scope.ItemDetails.id,
            "acv": $scope.ItemDetails.acv,
            "adjusterDescription": $scope.ItemDetails.adjusterDescription,
            "brand": $scope.ItemDetails.brand,
            "category": {
                "id": (($scope.ItemDetails.category !== null && angular.isDefined($scope.ItemDetails.category)) ? $scope.ItemDetails.category.id : null)
            },
            "dateOfPurchase": (($scope.ItemDetails.dateOfPurchase !== null && angular.isDefined($scope.ItemDetails.dateOfPurchase)) ? $scope.ItemDetails.dateOfPurchase : null),
            "depriciationRate": $scope.ItemDetails.depriciationRate,
            "description": $scope.ItemDetails.description,
            "insuredPrice": $scope.ItemDetails.insuredPrice,
            "quantity": $scope.ItemDetails.quantity,
            "totalTax": $scope.ItemDetails.totalTax,
            "isReplaced": $scope.ItemDetails.isReplaced,
            "holdOverValue": $scope.ItemDetails.holdOverValue,
            "itemName": $scope.ItemDetails.itemName,
            "model": $scope.ItemDetails.model,
            "quotedPrice": $scope.ItemDetails.quotedPrice,
            "rcv": $scope.ItemDetails.rcv,
            "subCategory": {
                "id": (($scope.ItemDetails.subCategory !== null && angular.isDefined($scope.ItemDetails.subCategory)) ? $scope.ItemDetails.subCategory.id : null)
            },
            "taxRate": $scope.ItemDetails.taxRate,
            "valueOfItem": $scope.ItemDetails.valueOfItem,
            "yearOfManufecturing": $scope.ItemDetails.yearOfManufecturing,
            "status": {
                "id": $scope.ItemDetails.status.id
            },
            "isScheduledItem": $scope.ItemDetails.isScheduledItem,
            "age": $scope.ItemDetails.age
        }));
        var SaveItemDetails = ThirdPartyLineItemDetailsService.SaveItemDetails(param);
        SaveItemDetails.then(function (success) {
            //Show message
            toastr.remove();
            toastr.success(success.data.message, $translate.instant("SuccessHeading"));

            $scope.displayAddImageButton = true;
            $scope.displayImageName = false;
            $scope.ClearImage();
            $scope.GetItemImage();
        }, function (error) {  //Show message

            toastr.remove();
            toastr.error(error.data.errorMessage, $translate.instant("ErrorHeading"));

            $scope.displayAddImageButton = true;
            $scope.displayImageName = false;
            $scope.ClearImage();
        });
    }

    //clear  attachments
    $scope.ClearImage = function () {
        angular.element("input[type='file']").val(null);
        $scope.displayImageName = false;
        $scope.displayAddImageButton = true;
        $scope.EnableAddImage = false;
        $scope.ImageName = null;
    }

    $scope.GetItemImage = GetItemImage;
    function GetItemImage() {
        var param = {
            "itemId": $scope.CommonObj.ItemId
        };
        var GetImageOfItem = ThirdPartyLineItemDetailsService.gteItemImagess(param);
        GetImageOfItem.then(function (success) { $scope.images = success.data.data; }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });

    };

    //Accept button
    $scope.AcceptItem = AcceptItem;
    function AcceptItem() {
        var param = {
            "id": $scope.CommonObj.ItemId,
            "approvedItemValue": $scope.ItemDetails.valueOfItem
        };
        var AcceptItem = ThirdPartyLineItemDetailsService.AcceptItem(param);
        AcceptItem.then(function (success) {
            $scope.Status = success.data.status;
            if ($scope.Status === 200) {
                $scope.ItemDetails.status.id = 5; $scope.ItemDetails.status.status = "Approved"
                toastr.remove();
                toastr.success(success.data.message, $translate.instant("SuccessHeading"));
            }
        }, function (error) {
            toastr.remove();
            toastr.error(error.data.errorMessage, $translate.instant("ErrorHeading"));
        });
    }

    $scope.goToDashboard = function () {
        sessionStorage.setItem("ThirdPartyClaimNo", "");
        sessionStorage.setItem("ThirdPartyClaimId", "");
        $location.url(sessionStorage.getItem('HomeScreen'));
    }
    $scope.SuperVisorReview = SuperVisorReview;
    function SuperVisorReview() {
        bootbox.alert({
            size: "",
            title: "Status",
            closeButton: false,
            message: "Item sent for supervisor approval..",
            className: "modalcustom",
            callback: function () { /* your callback code */ }
        });
    }
    $scope.GetNoteDetails = GetNoteDetails;
    function GetNoteDetails(item, ind) {
        $scope.NoteIndex = ind;
        $scope.NoteDetails = item;
    };
    // New Note
    $scope.AddNotePopup = AddNotePopup;
    function AddNotePopup(ev) {

        var obj = {
            "ClaimId": $scope.CommonObj.ClaimId,
            "itemUID": $scope.ItemDetails.itemUID,
            "ClaimNumber": $scope.CommonObj.ClaimNumber,
            "ParticipantList": $scope.ClaimParticipantsList

        };

        $scope.animationsEnabled = true;
        var out = $uibModal.open(
        {
            animation: $scope.animationsEnabled,
            templateUrl: "views/ThirdPartyVendor/AddNotePopup.html",
            controller: "AddItemNotePopupController",
            backdrop: 'static',
            keyboard: false,

            resolve:
            {
                objClaim: function () {
                    objClaim = obj;
                    return objClaim;
                }
            }
        });
        out.result.then(function (value) {
            //Call Back Function success
            if (value === "Success") {
                GetNotes();
            }

        }, function (res) {
            //Call Back Function close
        });
        return {
            open: open
        };

    };

    //Add Custom Item popup
    $scope.AddCustomItemPopup = AddCustomItemPopup;
    function AddCustomItemPopup() {
        //$location.url("AddCustomItemPopup");
        //if ($scope.ClaimParticipantsList.length > 0) {
        var obj = {
            "ClaimId": $scope.CommonObj.ClaimId,
            "itemUID": $scope.ItemDetails.itemUID,
            "CustomItemType": $scope.ItemDetails.CustomItemType
        };
        $scope.animationsEnabled = true;
        var out = $uibModal.open(
        {
            size: "md",
            animation: $scope.animationsEnabled,
            templateUrl: "views/ThirdPartyVendor/AddCustomItemPopup.html",
            controller: "AddCustomItemPopupController",
            backdrop: 'static',
            keyboard: false,
            resolve:
            {
                objClaim: function () {
                    objClaim = obj;
                    return objClaim;
                }
            }

        });
        out.result.then(function (value) {
            $scope.ItemDetails.CustomItemType = "";
            //Call Back Function success
            if (value === "Success") {

            }

        }, function (res) {
            //Call Back Function close
        });
        return {
            open: open
        };
        //}
    }


    $scope.GoToCustomItem = GoToCustomItem;
    function GoToCustomItem() {

        if ($scope.ItemDetails.CustomItemType == "2") {
            sessionStorage.setItem("ClaimNo", $scope.CommonObj.ClaimNumber)
            sessionStorage.setItem("ClaimId", $scope.CommonObj.ClaimId)
            sessionStorage.setItem("Policyholder", $scope.CommonObj.PolicyHolder)
            sessionStorage.setItem("ItemNumber", $scope.ItemDetails.itemNumber);
            sessionStorage.setItem("ItemId", $scope.CommonObj.ItemId);
            sessionStorage.setItem("ItemUId", $scope.CommonObj.ItemUID);
            sessionStorage.setItem("Page", "ThirdPartyLineItemDetails");
            sessionStorage.setItem("ReplacementDesc", $scope.ItemDetails.adjusterDescription);
            sessionStorage.setItem("ReplacementCost", $scope.ItemDetails.rcv);
            sessionStorage.setItem("customItemType", $scope.ItemDetails.CustomItemType);
            $location.url("AddCustomItem");
        }
        else {
            $scope.AddCustomItemPopup();
        }

    };



    //Mer Screen
    $scope.GoToMER = GoToMER;
    function GoToMER() {
        //sessionStorage.setItem("ClaimNo", $scope.CommonObj.ClaimNumber)
        //sessionStorage.setItem("ClaimId", $scope.CommonObj.ClaimId)
        //sessionStorage.setItem("Policyholder", $scope.CommonObj.PolicyHolder)
        //sessionStorage.setItem("ItemId", $scope.CommonObj.ItemId);

        var Item = [$scope.CommonObj.ItemId]
        sessionStorage.setItem("ClaimNumber", $scope.CommonObj.ClaimNumber);
        sessionStorage.setItem("ClaimId", $scope.CommonObj.ClaimId);
        sessionStorage.setItem("ItemNumber", $scope.ItemDetails.itemNumber)
        sessionStorage.setItem("ItemId", $scope.CommonObj.ItemId)
        sessionStorage.setItem("Items", JSON.stringify(Item))
        sessionStorage.setItem("AssignmentNumber", $scope.ItemDetails.assignmentDetails.assignmentNumber)
        sessionStorage.setItem("AssignmentId", $scope.ItemDetails.assignmentDetails.id)
        sessionStorage.setItem("BackPage", "ThirdPartyLineItemDetails");
        sessionStorage.setItem("ClaimDetailsPage", "ThirdPartyClaimDetails");
        sessionStorage.setItem("LineDetailsPage", "ThirdPartyLineItemDetails");
        $location.url('MER');
    };

    //GoTo View Quote
    $scope.GoToViewQuote = GoToViewQuote;
    function GoToViewQuote() {
        var Item = [$scope.CommonObj.ItemId]
        sessionStorage.setItem("ClaimNumber", $scope.CommonObj.ClaimNumber);
        sessionStorage.setItem("ClaimId", $scope.CommonObj.ClaimId);
        sessionStorage.setItem("ItemNumber", $scope.ItemDetails.itemNumber)
        sessionStorage.setItem("ItemId", $scope.CommonObj.ItemId)
        sessionStorage.setItem("Items", JSON.stringify(Item))
        sessionStorage.setItem("AssignmentNumber", $scope.ItemDetails.assignmentDetails.assignmentNumber)
        sessionStorage.setItem("AssignmentId", $scope.ItemDetails.assignmentDetails.id)
        sessionStorage.setItem("BackPage", "ThirdPartyLineItemDetails");
        sessionStorage.setItem("ClaimDetailsPage", "ThirdPartyClaimDetails");
        sessionStorage.setItem("LineDetailsPage", "ThirdPartyLineItemDetails");
        $location.url('ViewQuote');

    };

    //Comparable Screen
    //get subItem type based upon Item Category
    $scope.GetSubItemType = GetSubItemType;
    function GetSubItemType(item) {
        $(".page-spinner-bar").removeClass("hide");
        $scope.subItemList = [];
        var param = { "id": item.id }
        var getSubItemType = ThirdPartyLineItemDetailsService.GetSubItemType(param);
        getSubItemType.then(function (success) {
            $scope.subItemList = success.data.data;
            GetUnitMeasure();
            GetSemiMountingColor();
            GetSemiMountingClarity();
            GetSemiMountingShape();
            GetSemiMountingMetalType();
            GetMountingMetalType();
            GetChainMetalType();
            GetDiamondShape();
            GetDiamondColor();
            GetDiamondClarity();
            GetDiamondGemlabs();
            GetDiamondCutgrades();
            GetGemstoneShape();
            GetGemstoneType();
            GetGemstoneQuality();
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            toastr.remove();
            if (error.data.errorMessage != null && angular.isDefined(error.data.errorMessage)) {
                toastr.error(error.data.errorMessage, "Error")
            }
            else {
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error")
            }
        });
    }
    //get Components based upon Item subItem type

    $scope.getComponents = getComponents;
    function getComponents(item) {
        if (angular.isDefined(item) && item !== null) {
            $scope.componentsList = [];
            var param = {
                "id": item.id
            }
            var Getcomponents = ThirdPartyLineItemDetailsService.getComponents(param);
            Getcomponents.then(function (success) {
                $scope.componentsList = success.data.data.components;
            });
        }
    };

    //Add new Component
    $scope.MountingDetailsList = { metalType: "", metalWeight: "", unitOfMeasure: "" };
    $scope.DiamondDetailsList = [{ caratWeight: "", quantity: "", shape: "", color: "", clarity: "", gemlab: "", cutGrade: "", diamondUID: 0 }];
    $scope.semiMountingDetailsList = { caratWeight: "", quantity: "", shape: "", color: "", clarity: "", metalWeight: "", metalWeight: "", unitOfMeasure: "" };
    $scope.gemstoneDetailsList = [{ type: "", grade: "A", totalWeight: "", quantity: "", shape: "", quality: "", gemstoneUID: 0 }];
    $scope.ChainDetailsList = { metalType: "", metalWeight: "", unitOfMeasure: "" };
    $scope.AddNewComponent = AddNewComponent;
    function AddNewComponent(component) {

        if (component.componentName == "Mounting") {
            $scope.MountingDetailsList.push({ metalType: "", metalWeight: "", unitOfMeasure: "" });
        }
        else if (component.componentName == "Diamond") {
            var uid = $scope.DiamondDetailsList.length;
            $scope.DiamondDetailsList.push({ caratWeight: "", quantity: "", shape: "", color: "", clarity: "", gemlab: "", cutGrade: "", diamondUID: uid });
        }
        else if (component.componentName == "Semi-Mounting") {
            $scope.semiMountingDetailsList.push({ caratWeight: "", quantity: "", shape: "", color: "", clarity: "", metalType: "", metalWeight: "", unitOfMeasure: "" });
        }
        else if (component.componentName == "Gemstone") {
            var uid = $scope.gemstoneDetailsList.length;
            $scope.gemstoneDetailsList.push({ type: "", totalWeight: "", grade: "A", quantity: "", shape: "", quality: "" });
        }
        else {
            $scope.ChainDetailsList.push({ metalType: "", metalWeight: "", unitOfMeasure: "" });
        }
    };

    $scope.GetPolicyHolderDetails = GetPolicyHolderDetails;
    function GetPolicyHolderDetails() {
        param_PolicyHolder =
            {
                "policyNumber": null,
                "claimNumber": $scope.CommonObj.ClaimNumber
            };

        var getDetails = PurchaseOrderService.GetPolicyHolderDetails(param_PolicyHolder);
        getDetails.then(function (success) {
            $scope.PolicyholderDetails = success.data.data;
            if ($scope.PolicyholderDetails.categories != null && $scope.ItemDetails.category != null) {
                GetCatagoryLimit($scope.ItemDetails.category.name)
            }
        }, function (error) {
            toastr.remove();
            if (error.data.errorMessage != null && angular.isDefined(error.data.errorMessage)) {
                toastr.error(error.data.errorMessage, "Error")
            }
            else {
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error")
            }
        });
    };
    $scope.GetCatagoryLimit = GetCatagoryLimit;
    function GetCatagoryLimit(name) {
        var count = 0;
        angular.forEach($scope.PolicyholderDetails.categories, function (item) {
            if (item.name == name) {
                count++;
                $scope.ItemDetails.category.aggregateLimit = (item.coverageLimit == null ? 0 : item.coverageLimit);
            }
        })
        if (count == 0) {
            $scope.ItemDetails.category.aggregateLimit = 0;
        }
    };

    $scope.submit = false;
    $scope.speedCheckLoginDetails;
    $scope.SubmitComparables = SubmitComparables;
    function SubmitComparables() {
        $scope.displayReplacement = false;
        $scope.displaycomparables = false;
        $scope.submit = true;
        $scope.SerchComparables = true;
        //Orignal tokan save in the veriable Vendor_AccessToken
        var Vendor_AccessToken = sessionStorage.getItem("AccessToken");

        var loginParam = {
            "username": "admin@speedcheck.com",
            "password": "demo"
        };
        sessionStorage.setItem("SpeedcheckLoginUrl", "http://69.164.195.59:8080/SpeedCheck_App/api/admin/login");
        sessionStorage.setItem("AccessToken", "");
        var getSpeedCheckLogin = ThirdPartyLineItemDetailsService.speedCheckLogin(loginParam);
        getSpeedCheckLogin.then(function (success) {
            $scope.speedCheckLoginDetails = success.data.data;
            sessionStorage.setItem("AccessToken", $scope.speedCheckLoginDetails.token);
            ////////////////start speed check service //////////////
            sessionStorage.setItem("SpeedcheckUrl", "http://69.164.195.59:8080/SpeedCheck_App/api/web/get/speedcheck/values");
            var param = {
                "item": $scope.ItemDetails.description,
                "claimDetail": {
                    "claimNo": $scope.CommonObj.ClaimNumber,
                    "policyNo": $scope.PolicyholderDetails.policyNumber,
                    "phLastName": $scope.PolicyholderDetails.policyName,
                    "itemType": $scope.itemType.name,
                    "subItemType": $scope.subItemType.name,
                    "appraisalValue": $scope.ItemDetails.appraisalValue,
                    "appraisalDate": $filter('DatabaseDateFormatMMddyyyy')($scope.ItemDetails.appraisalDate)
                },
                "mounting": {
                    "metalType": $scope.MountingDetailsList.metalType,
                    "metalWeight": $scope.MountingDetailsList.metalWeight,
                    "unitOfMeasure": $scope.MountingDetailsList.unitOfMeasure,
                },
                "diamonds": $scope.DiamondDetailsList,
                "gemstones": $scope.gemstoneDetailsList,
                "gemstoneTotalMinValue": null,
                "gemstoneTotalMaxValue": null,
                "semiMounting": $scope.semiMountingDetailsList,
                "chain": $scope.ChainDetailsList
            };
            var getSpeedcheckValue = ThirdPartyLineItemDetailsService.getSpeedcheck(param);
            getSpeedcheckValue.then(function (success) {
                $scope.speedcheckValue = success.data.data;
                sessionStorage.setItem("AccessToken", Vendor_AccessToken);
            }, function (error) {
                sessionStorage.setItem("AccessToken", Vendor_AccessToken);
                toastr.remove();
                if (error.data.errorMessage != null && angular.isDefined(error.data.errorMessage)) {
                    toastr.error(error.data.errorMessage, "Error")
                }
                else {
                    toastr.error(AuthHeaderService.genericErrorMessage(), "Error")
                }
            });
            ////////////////End speed check service //////////////
        }, function (error) {
            sessionStorage.setItem("AccessToken", Vendor_AccessToken);
            toastr.remove();
            if (error.data.errorMessage != null && angular.isDefined(error.data.errorMessage)) {
                toastr.error(error.data.errorMessage, "Error")
            }
            else {
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error")
            }
        })

    }

    $scope.setComponentTab = setComponentTab;
    function setComponentTab(component) {
        $scope.tabComponent = component.componentName;
    };

    $scope.GetInsuranceCompanyDetails = GetInsuranceCompanyDetails;
    function GetInsuranceCompanyDetails() {
        var param = { "claimNumber": $scope.CommonObj.ClaimNumber }
        var getCompanyDetails = ThirdPartyLineItemDetailsService.GetInsuranceCompanyDetails(param);
        getCompanyDetails.then(function (success) {
            $scope.InsuranceCompanyDetails = success.data.data;
        }, function (error) {
            toastr.remove();
            if (error.data.errorMessage != null && angular.isDefined(error.data.errorMessage)) {
                toastr.error(error.data.errorMessage, "Error")
            }
            else {
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error")
            }
        });
    }

    $scope.GetItemTypeList = GetItemTypeList;
    function GetItemTypeList() {

        var getItemTypeList = ThirdPartyLineItemDetailsService.GetItemTypeList();
        getItemTypeList.then(function (success) {
            $scope.itemTypeList = success.data.data;
        }, function (error) {
            toastr.remove();
            if (error.data.errorMessage != null && angular.isDefined(error.data.errorMessage)) {
                toastr.error(error.data.errorMessage, "Error")
            }
            else {
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error")
            }
        });
    }

    $scope.GetUnitMeasure = GetUnitMeasure;
    function GetUnitMeasure() {

        var getUnitMeasure = ThirdPartyLineItemDetailsService.GetUnitMeasure();
        getUnitMeasure.then(function (success) {
            $scope.unitMeasure = success.data.data;
        }, function (error) {
            toastr.remove();
            if (error.data.errorMessage != null && angular.isDefined(error.data.errorMessage)) {
                toastr.error(error.data.errorMessage, "Error")
            }
            else {
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error")
            }
        });
    }

    $scope.GetSemiMountingColor = GetSemiMountingColor;
    function GetSemiMountingColor() {

        var getSemiMountingColor = ThirdPartyLineItemDetailsService.GetSemiMountingColor();
        getSemiMountingColor.then(function (success) {
            $scope.semiMountingColor = success.data.data;
        }, function (error) {
            toastr.remove();
            if (error.data.errorMessage != null && angular.isDefined(error.data.errorMessage)) {
                toastr.error(error.data.errorMessage, "Error")
            }
            else {
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error")
            }
        });
    }

    $scope.GetSemiMountingClarity = GetSemiMountingClarity;
    function GetSemiMountingClarity() {
        var getSemiMountingClarity = ThirdPartyLineItemDetailsService.GetSemiMountingClarity();
        getSemiMountingClarity.then(function (success) {
            $scope.semiMountingClarity = success.data.data;
        }, function (error) {
            toastr.remove();
            if (error.data.errorMessage != null && angular.isDefined(error.data.errorMessage)) {
                toastr.error(error.data.errorMessage, "Error")
            }
            else {
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error")
            }
        });
    }

    $scope.GetSemiMountingShape = GetSemiMountingShape;
    function GetSemiMountingShape() {
        var getSemiMountingShape = ThirdPartyLineItemDetailsService.GetSemiMountingShape();
        getSemiMountingShape.then(function (success) {
            $scope.semiMountingShape = success.data.data;
        }, function (error) {
            toastr.remove();
            if (error.data.errorMessage != null && angular.isDefined(error.data.errorMessage)) {
                toastr.error(error.data.errorMessage, "Error")
            }
            else {
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error")
            }
        });
    }

    $scope.GetSemiMountingMetalType = GetSemiMountingMetalType;
    function GetSemiMountingMetalType() {
        var getSemiMountingMetalType = ThirdPartyLineItemDetailsService.GetSemiMountingMetalType();
        getSemiMountingMetalType.then(function (success) {
            $scope.semiMountingMetalType = success.data.data;
        }, function (error) {
            toastr.remove();
            if (error.data.errorMessage != null && angular.isDefined(error.data.errorMessage)) {
                toastr.error(error.data.errorMessage, "Error")
            }
            else {
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error")
            }
        });
    }

    $scope.GetMountingMetalType = GetMountingMetalType;
    function GetMountingMetalType() {
        var getMountingMetalType = ThirdPartyLineItemDetailsService.GetMountingMetalType();
        getMountingMetalType.then(function (success) {
            $scope.mountingMetalType = success.data.data;
        }, function (error) {
            toastr.remove();
            if (error.data.errorMessage != null && angular.isDefined(error.data.errorMessage)) {
                toastr.error(error.data.errorMessage, "Error")
            }
            else {
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error")
            }
        });
    }
    $scope.GetChainMetalType = GetChainMetalType;
    function GetChainMetalType() {
        var getChainMetalType = ThirdPartyLineItemDetailsService.GetChainMetalType();
        getChainMetalType.then(function (success) {
            $scope.chainMetalType = success.data.data;
        }, function (error) {
            toastr.remove();
            if (error.data.errorMessage != null && angular.isDefined(error.data.errorMessage)) {
                toastr.error(error.data.errorMessage, "Error")
            }
            else {
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error")
            }
        });
    }

    $scope.GetDiamondShape = GetDiamondShape;
    function GetDiamondShape() {
        var getDiamondShape = ThirdPartyLineItemDetailsService.GetDiamondShape();
        getDiamondShape.then(function (success) {
            $scope.diamondShape = success.data.data;
        }, function (error) {
            toastr.remove();
            if (error.data.errorMessage != null && angular.isDefined(error.data.errorMessage)) {
                toastr.error(error.data.errorMessage, "Error")
            }
            else {
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error")
            }
        });
    }
    $scope.GetDiamondColor = GetDiamondColor;
    function GetDiamondColor() {
        var getDiamondColor = ThirdPartyLineItemDetailsService.GetDiamondColor();
        getDiamondColor.then(function (success) {
            $scope.diamondColor = success.data.data;
        }, function (error) {
            toastr.remove();
            if (error.data.errorMessage != null && angular.isDefined(error.data.errorMessage)) {
                toastr.error(error.data.errorMessage, "Error")
            }
            else {
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error")
            }
        });
    }
    $scope.GetDiamondClarity = GetDiamondClarity;
    function GetDiamondClarity() {
        var getDiamondClarity = ThirdPartyLineItemDetailsService.GetDiamondClarity();
        getDiamondClarity.then(function (success) {
            $scope.diamondClarity = success.data.data;
        }, function (error) {
            toastr.remove();
            if (error.data.errorMessage != null && angular.isDefined(error.data.errorMessage)) {
                toastr.error(error.data.errorMessage, "Error")
            }
            else {
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error")
            }
        });
    }
    $scope.GetDiamondGemlabs = GetDiamondGemlabs;
    function GetDiamondGemlabs() {
        var getDiamondGemlabs = ThirdPartyLineItemDetailsService.GetDiamondGemlabs();
        getDiamondGemlabs.then(function (success) {
            $scope.diamondGemlabs = success.data.data;
        }, function (error) {
            toastr.remove();
            if (error.data.errorMessage != null && angular.isDefined(error.data.errorMessage)) {
                toastr.error(error.data.errorMessage, "Error")
            }
            else {
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error")
            }
        });
    }
    $scope.GetDiamondCutgrades = GetDiamondCutgrades;
    function GetDiamondCutgrades() {
        var getDiamondCutgrades = ThirdPartyLineItemDetailsService.GetDiamondCutgrades();
        getDiamondCutgrades.then(function (success) {
            $scope.diamondCutgrades = success.data.data;
        }, function (error) {
            toastr.remove();
            if (error.data.errorMessage != null && angular.isDefined(error.data.errorMessage)) {
                toastr.error(error.data.errorMessage, "Error")
            }
            else {
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error")
            }
        });
    }
    $scope.GetGemstoneShape = GetGemstoneShape;
    function GetGemstoneShape() {
        var getGemstoneShape = ThirdPartyLineItemDetailsService.GetGemstoneShape();
        getGemstoneShape.then(function (success) {
            $scope.gemstoneShape = success.data.data;
        }, function (error) {
            toastr.remove();
            if (error.data.errorMessage != null && angular.isDefined(error.data.errorMessage)) {
                toastr.error(error.data.errorMessage, "Error")
            }
            else {
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error")
            }
        });
    }
    $scope.GetGemstoneType = GetGemstoneType;
    function GetGemstoneType() {
        var getGemstoneType = ThirdPartyLineItemDetailsService.GetGemstoneType();
        getGemstoneType.then(function (success) {
            $scope.gemstoneType = success.data.data;
        }, function (error) {
            toastr.remove();
            if (error.data.errorMessage != null && angular.isDefined(error.data.errorMessage)) {
                toastr.error(error.data.errorMessage, "Error")
            }
            else {
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error")
            }
        });
    }
    $scope.GetGemstoneQuality = GetGemstoneQuality;
    function GetGemstoneQuality() {
        var getGemstoneQuality = ThirdPartyLineItemDetailsService.GetGemstoneQuality();
        getGemstoneQuality.then(function (success) {
            $scope.gemstoneQuality = success.data.data;
        }, function (error) {
            toastr.remove();
            if (error.data.errorMessage != null && angular.isDefined(error.data.errorMessage)) {
                toastr.error(error.data.errorMessage, "Error")
            }
            else {
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error")
            }
        });
    }
    $scope.GetFilterComparableSearch = GetFilterComparableSearch;
    function GetFilterComparableSearch() {
        var param = { "itemId": $scope.CommonObj.PurchaseItemId }
        var getFilterComparableSearch = ThirdPartyLineItemDetailsService.GetFilterComparableSearch();
        getFilterComparableSearch.then(function (success) {

        }, function (error) {
            toastr.remove();
            if (error.data.errorMessage != null && angular.isDefined(error.data.errorMessage)) {
                toastr.error(error.data.errorMessage, "Error")
            }
            else {
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error")
            }
        });
    }

    //File Upload for attachment
    $scope.AddAttachment = function () {
        angular.element('#FileUpload').trigger('click');
    }
    $scope.displayAddImageButton = false;
    $scope.getAttachmentDetails = function (e) {
        $scope.displayAddImageButton = true;
        $scope.$apply(function () {
            var files = event.target.files;
            $scope.filed = event.target.files;
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var reader = new FileReader();
                reader.file = file;
                reader.fileName = files[i].name;
                reader.fileType = files[i].type;
                reader.fileExtension = files[i].name.substr(files[i].name.lastIndexOf('.'));
                reader.onload = $scope.LoadFileInList;
                reader.readAsDataURL(file);
            }
        });
        // $scope.saveAttachment();
    };

    $scope.LoadFileInList = function (e) {
        $scope.$apply(function () {

            $scope.attachmentList.push(
                {
                    "FileName": e.target.fileName, "FileExtension": e.target.fileExtension, "FileType": e.target.fileType,
                    "Image": e.target.result, "File": e.target.file
                })
        });
    }

    $scope.saveAttachment = saveAttachment;
    function saveAttachment() {
        $(".page-spinner-bar").removeClass("hide");

        var param = new FormData();
        $scope.filesDetails = [];
        angular.forEach($scope.attachmentList, function (ItemFile) {
            $scope.filesDetails.push({
                "fileName": ItemFile.FileName, "fileType": ItemFile.FileType, "extension": ItemFile.FileExtension, "filePurpose": "ITEM", "latitude": null, "longitude": null, "footNote": null
            });
            param.append('file', ItemFile.File);

        });
        param.append('filesDetails', JSON.stringify($scope.filesDetails));

        if ($scope.attachmentList.length == 0 || $scope.attachmentList == null) {
            param.append('filesDetails', null);
            param.append('file', null);
        };
        param.append("itemDetail",
           JSON.stringify(
            {
                "itemId": $scope.ItemDetails.id
            }));
        var saveAttachmentDetails = ThirdPartyLineItemDetailsService.saveAttachmentList(param);
        saveAttachmentDetails.then(function (success) {
            toastr.remove()
            toastr.success(success.data.message, $translate.instant("ItemEditSuccessHeading"));
            getAttachment();
            $scope.cancelAttachment();

        }, function (error) {
            toastr.remove()
            toastr.error(error.data.errorMessage, $translate.instant("ErrorHeading"));
            $(".page-spinner-bar").addClass("hide");

        });
    }

    $scope.getAttachment = getAttachment;
    function getAttachment() {
        $scope.attachmentListEdit = [];
        var param = {
            "itemId": $scope.CommonObj.ItemId
        };

        var getAttachmentDetails = ThirdPartyLineItemDetailsService.getAttachmentList(param);
        getAttachmentDetails.then(function (success) {
            $scope.attachmentListEdit = [];
            angular.forEach(success.data.data.attachments, function (ItemFile) {
                $scope.attachmentListEdit.push(
                {
                    "id": ItemFile.id, "name": ItemFile.name, "type": ItemFile.type, "url": ItemFile.url,
                    "uploadDate": ItemFile.uploadDate
                });
            });
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            toastr.remove()
            toastr.error(error.data.errorMessage, $translate.instant("ErrorHeading"));
            $(".page-spinner-bar").addClass("hide");
        });
    }
    $scope.RemoveAttachment = RemoveAttachment;
    function RemoveAttachment(index) {
        if ($scope.attachmentList.length > 0) {
            $scope.attachmentList.splice(index, 1);
        }
    };
    //End File Upload 
    $scope.SaveItemDetails = function (itemid) {
        var param = new FormData();

        angular.forEach($scope.attachmentList, function (ItemFile) {

            param.append('filesDetails', JSON.stringify([{ "fileName": ItemFile.FileName, "fileType": ItemFile.FileType, "extension": ItemFile.FileExtension, "filePurpose": "ITEM", "latitude": null, "longitude": null }]));
            param.append('file', ItemFile.File);

        });
        if ($scope.attachmentList.length == 0 || $scope.attachmentList == null) {
            param.append('filesDetails', null);
            param.append('file', null);
        };

        param.append("itemDetails",
            JSON.stringify(
             {
                 "id": $scope.ItemDetails.id,
                 "ageMonths": $scope.ItemDetails.ageMonths,
                 "ageYears": $scope.ItemDetails.ageYears,
                 "brand": $scope.ItemDetails.brand,
                 "category": {
                     "annualDepreciation": (($scope.ItemDetails.category !== null && angular.isDefined($scope.ItemDetails.category)) ? $scope.ItemDetails.category.annualDepreciation : null),
                     "id": (($scope.ItemDetails.category !== null && angular.isDefined($scope.ItemDetails.category)) ? $scope.ItemDetails.category.id : null),
                     "name": (($scope.ItemDetails.category !== null && angular.isDefined($scope.ItemDetails.category)) ? GetCategoryOrSubCategoryOnId(true, $scope.ItemDetails.category.id) : null),
                     "description": (($scope.ItemDetails.category !== null && angular.isDefined($scope.ItemDetails.category)) ? $scope.ItemDetails.category.description : null),
                     "usefulYears": (($scope.ItemDetails.category !== null && angular.isDefined($scope.ItemDetails.category)) ? $scope.ItemDetails.category.usefulYears : null),
                     "aggregateLimit": (($scope.ItemDetails.category !== null && angular.isDefined($scope.ItemDetails.category)) ? $scope.ItemDetails.category.aggregateLimit : null)
                 },
                 "claimId": $scope.ItemDetails.claimId,
                 "claimNumber": $scope.ItemDetails.claimNumber,
                 "depriciationRate": $scope.ItemDetails.depriciationRate,
                 "appraisalValue": $scope.ItemDetails.appraisalValue,
                 "appraisalDate": $filter('DatabaseDateFormatMMddyyyy')($scope.ItemDetails.appraisalDate),
                 "description": $scope.ItemDetails.description,
                 "insuredPrice": $scope.ItemDetails.insuredPrice,
                 "individualLimitAmount": $scope.ItemDetails.individualLimitAmount,
                 "itemName": $scope.ItemDetails.itemName,
                 "isScheduledItem": $scope.ItemDetails.isScheduledItem,
                 "scheduleAmount": $scope.ItemDetails.scheduleAmount,
                 "model": $scope.ItemDetails.model,
                 "quantity": $scope.ItemDetails.quantity,
                 "status": {
                     "id": $scope.ItemDetails.status.id,
                     "status": $scope.ItemDetails.status.status
                 },
                 "subCategory": {
                     "annualDepreciation": (($scope.ItemDetails.subCategory !== null && angular.isDefined($scope.ItemDetails.subCategory)) ? $scope.ItemDetails.subCategory.annualDepreciation : null),
                     "id": (($scope.ItemDetails.subCategory !== null && angular.isDefined($scope.ItemDetails.subCategory)) ? $scope.ItemDetails.subCategory.id : null),
                     "name": (($scope.ItemDetails.subCategory !== null && angular.isDefined($scope.ItemDetails.subCategory)) ? GetCategoryOrSubCategoryOnId(false, $scope.ItemDetails.subCategory.id) : null),
                     "description": (($scope.ItemDetails.subCategory !== null && angular.isDefined($scope.ItemDetails.subCategory)) ? $scope.ItemDetails.subCategory.description : null),
                     "usefulYears": (($scope.ItemDetails.subCategory !== null && angular.isDefined($scope.ItemDetails.subCategory)) ? $scope.ItemDetails.subCategory.usefulYears : null),
                     "aggregateLimit": (($scope.ItemDetails.subCategory !== null && angular.isDefined($scope.ItemDetails.subCategory)) ? $scope.ItemDetails.subCategory.aggregateLimit : null),

                 },
                 "itemNumber": $scope.ItemDetails.itemNumber,
             }
            ));
        var UpdatePostLoss = ThirdPartyLineItemDetailsService.UpdatePostLoss(param);
        UpdatePostLoss.then(function (success) {
            $(".page-spinner-bar").removeClass("hide");
            $scope.ItemDetails = success.data.data;
            $scope.ItemDetails.appraisalDate = (angular.isDefined($scope.ItemDetails) && $scope.ItemDetails.appraisalDate != null) ? ($filter('DateFormatMMddyyyy')($scope.ItemDetails.appraisalDate)) : null;
            $(".page-spinner-bar").addClass("hide");
            toastr.remove()
            toastr.success(success.data.message, $translate.instant("SuccessHeading"));
            $scope.reset();
        },
        function (error) {
            toastr.remove()
            toastr.error(error.data.errorMessage, $translate.instant("ErrorHeading"));
        });
    };

    function GetCategoryOrSubCategoryOnId(OpertionFlag, id) {
        if (id !== null && angular.isDefined(id)) {
            if (OpertionFlag) {
                var list = $filter('filter')($scope.CategoryList, { categoryId: id });
                return list[0].categoryName;
            }
            else {
                var list = $filter('filter')($scope.SubCategory, { id: id });
                if (list.length > 0)
                    return list[0].name;
                else
                    return null;
            }
        }
        else
            return null;
    }
    $scope.GetPostLostItems = GetPostLostItems;
    function GetPostLostItems() {

        var param = { "claimNumber": $scope.CommonObj.ClaimNumber.toString() }
        var getpromise = ThirdPartyClaimDetailsService.getPostLostItemsForVendor(param);
        getpromise.then(function (success) {
            $scope.FiletrLostDamageList = [];
            $scope.FiletrLostDamageList = success.data.data;
            $scope.FiletrLostDamageList = $filter('orderBy')($scope.FiletrLostDamageList.itemReplacement, "claimItem[0].id");
            $scope.FilteredItemByAssignment = [];
            angular.forEach($scope.FiletrLostDamageList, function (item) {
                if (item.claimItem.assignmentDetails.assignmentNumber == $scope.CommonObj.AssignmentNumber && item.claimItem.assignmentDetails.id == parseInt($scope.CommonObj.AssignmentId)) {
                    $scope.FilteredItemByAssignment.push(item);
                }
            });
            $scope.FiletrLostDamageList = $scope.FilteredItemByAssignment;
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            toastr.remove();
            toastr.error(error.data.errorMessage, $translate.instant("ErrorHeading"));
            $scope.ErrorMessage = error.data.errorMessage;
        });
    };

    $scope.ChangeItem = ChangeItem;
    function ChangeItem($event) {
        $(".page-spinner-bar").removeClass("hide");

        var found = $scope.FiletrLostDamageList.find(function (item) {
            if (item.claimItem.id == sessionStorage.getItem("ThirdPartyPostLostItemId")) {
                return item;
            }
        });
        $scope.index = $scope.FiletrLostDamageList.indexOf(found);
        if ($scope.index > 0) {
            sessionStorage.setItem("ThirdPartyPostLostItemId", $scope.FiletrLostDamageList[$scope.index - 1].claimItem.id);

            if ($scope.NextStep == false)
                $scope.NextStep = true;
            init();
        }
        else {
            $(".page-spinner-bar").addClass("hide");
            $scope.PrevStep = false;
            $scope.NextStep = true;
        }

    }
    $scope.ChangeItemRight = ChangeItemRight;
    function ChangeItemRight($event) {
        $(".page-spinner-bar").removeClass("hide");
        var found = $scope.FiletrLostDamageList.find(function (item) {
            if (item.claimItem.id == sessionStorage.getItem("ThirdPartyPostLostItemId")) {
                return item;
            }
        });
        var index = $scope.FiletrLostDamageList.indexOf(found);
        if (index < $scope.FiletrLostDamageList.length - 1) {
            sessionStorage.setItem("ThirdPartyPostLostItemId", $scope.FiletrLostDamageList[index + 1].claimItem.id);
            if ($scope.PrevStep == false)
                $scope.PrevStep = true;
            init();

        }
        else {
            $(".page-spinner-bar").addClass("hide");
            $scope.NextStep = false;
            $scope.PrevStep = true;
        }
    }

    $scope.showNotes = showNotes;
    function showNotes() {
        $(".page-spinner-bar").removeClass("hide");
        GetNotes();
        $scope.tab = 'Notes';
        $(".page-spinner-bar").addClass("hide");

    }

    $scope.cancelAttachment = cancelAttachment;
    function cancelAttachment() {
        $scope.displayAddImageButton = false;
        $scope.attachmentList = [];
        angular.element("input[type='file']").val(null);
    }

    $scope.showPurchaseOrdersTab = showPurchaseOrdersTab;
    function showPurchaseOrdersTab() {
        $(".page-spinner-bar").removeClass("hide");
        $scope.tab = 'PurchaseOrders';
        sessionStorage.setItem("isLineItem", true);
        $(".page-spinner-bar").addClass("hide");
    }

    $scope.GetCustomeTypeOption = GetCustomeTypeOption;
    function GetCustomeTypeOption() {
        var CutometypeOption = ThirdPartyLineItemDetailsService.getCutomeTypeOption();
        CutometypeOption.then(function (success) {
            $scope.CustomItemType = success.data.data;
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            toastr.remove();
            toastr.error(error.data.errorMessage, $translate.instant("ErrorHeading"));
            $scope.ErrorMessage = error.data.errorMessage;
        });
    };

    $scope.SendMessagePopUp = SendMessagePopUp;
    function SendMessagePopUp($event) {
        if ($scope.Comparables.comparableItems.length == 0) {

            toastr.remove()
            toastr.warning("Comparables not added against item", "Warning");
            $event.stopPropagation();
            $event.preventDefault();
        }
        else {
            var obj = {
                "policyholderDetails": $scope.PolicyholderDetails,
                "claim": {
                    "id": $scope.ItemDetails.claimId
                },
                "item": {
                    "id": $scope.ItemDetails.id
                }
            };
            var out = $uibModal.open(
             {
                 animation: $scope.animationsEnabled,
                 templateUrl: "views/VendorAssociate/SendSMSpopup.html",
                 controller: "SendSMSPopupController",
                 resolve: {
                     objClaim: function () {
                         objClaim = obj;
                         return objClaim;
                     }
                 }
             });
            out.result.then(function (value) {

            }, function (res) {
                //Call Back Function close
            });
            return {
                open: open
            };
        };
    }
    $scope.deteteItemAttachment = deteteItemAttachment;
    function deteteItemAttachment(document) {
        bootbox.confirm({
            size: "",
            closeButton: false,
            title: "Delet media file",
            message: "Are you sure you want to delete this Media File?  <b>Please Confirm!",
            className: "modalcustom", buttons: {
                confirm: {
                    label: 'Yes',
                    className: 'btn-success'
                },
                cancel: {
                    label: 'No',
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                //if (result)  call delet function
                if (result) {
                    $(".page-spinner-bar").removeClass("hide");
                    var param = [{
                        id: angular.isUndefined(document.id) ? (angular.isUndefined(document.imageId) ? null : document.imageId) : document.id

                    }]
                    var promis = ThirdPartyClaimDetailsService.deleteMediaFile(param);
                    promis.then(function (success) {
                        if (angular.isUndefined(document.imageId)) {
                            getAttachment();
                        }
                        else {
                            GetNotes();
                        }
                        toastr.remove()
                        toastr.success(success.data.message, $translate.instant("SuccessHeading"));
                        $(".page-spinner-bar").addClass("hide");
                    }, function (error) {
                        toastr.remove()
                        toastr.error(error.data.errorMessage, $translate.instant("ErrorHeading"));
                        $(".page-spinner-bar").addClass("hide");
                    });

                }
            }
        });
    }

    $scope.showappraisalTab = showappraisalTab;
    function showappraisalTab() {
        $(".page-spinner-bar").removeClass("hide");
        $scope.tab = 'appraisal';
        //sessionStorage.setItem("ReplacementDesc", $scope.ItemDetails.description);
        //sessionStorage.setItem("ReplacementDesc", JSON.stringify($scope.ItemDetails));
        $(".page-spinner-bar").addClass("hide");
    }

    $scope.ReplyToNote = function (NoteDetails) {
        $(".page-spinner-bar").removeClass("hide");
        var data = new FormData();
        if ($scope.files.length > 0) {
            var FileDetails = [];
            angular.forEach($scope.files, function (item) {

                FileDetails.push({
                    "fileName": item.FileName, "fileType": item.FileType,
                    "extension": item.FileExtension,
                    "filePurpose": "NOTE", "latitude": null, "longitude": null
                });
                data.append("file", item.File);
            });
            data.append("mediaFilesDetail", JSON.stringify(FileDetails));
        }
        else {
            data.append("mediaFilesDetail", null);
            data.append("file", null);
        }
        var registrationNumber = "";
        angular.forEach(NoteDetails.participants, function (participants) {
            if (participants.crn != null) {
                registrationNumber = participants.crn;
            }
        });
        data.append("noteDetail", JSON.stringify(
             {
                 "isPublicNote": NoteDetails.isPublicNote,
                 "registrationNumber": registrationNumber,
                 "sender": sessionStorage.getItem("RegistrationNumber"),
                 "isInternal": angular.isDefined(registrationNumber) && registrationNumber != "" ? false : true,
                 "claimNumber": $scope.CommonObj.ClaimNumber,
                 "itemUID": $scope.ItemDetails.itemUID,            // if it is item level note
                 "serviceRequestNumber": null,
                 "message": $scope.claimNote,
                 "groupDetails":
                 { "groupId": NoteDetails.groupId, "groupNumber": NoteDetails.groupNumber }
             }))

        var getpromise = ThirdPartyLineItemDetailsService.ReplyClaimNote(data);
        getpromise.then(function (success) {
            $scope.Status = success.data.status;
            if ($scope.Status == 200) {
                toastr.remove();
                toastr.success(success.data.message, "Confirmation");
                GetNotes();
                $scope.claimNote = "";
                $scope.files = [];
                $scope.ReplyNoteForm.$setUntouched();
                $(".page-spinner-bar").addClass("hide");
            }
        }, function (error) {
            toastr.remove();
            toastr.error(error.data.errorMessage, "Error");
            $scope.ErrorMessage = error.data.errorMessage;
            $(".page-spinner-bar").addClass("hide");
        });
    }
    $scope.DeleteNotes = DeleteNotes;
    function DeleteNotes(item, participants) {
        bootbox.confirm({
            size: "",
            title: "Delete Note",
            message: "Are you sure want to delete the note?", closeButton: false,
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
                    if (angular.isDefined(item.noteUID) && item.noteUID !== null) {
                        $(".page-spinner-bar").removeClass("hide");
                        var registrationNumber = null;
                        angular.forEach(participants, function (participants) {
                            if (participants.crn != null) {
                                registrationNumber = participants.crn;
                            }
                        });
                        var param = {
                            "noteUID": item.noteUID, "registrationNumber": registrationNumber
                        };

                        var promis = ThirdPartyLineItemDetailsService.DeleteNote(param);
                        promis.then(function (success) {
                            GetNotes();
                            toastr.remove();
                            toastr.success(success.data.message, "Confirmation");

                        },
                        function (error) {
                            toastr.remove();
                            if (error.data.errorMessage != null && angular.isDefined(error.data.errorMessage)) {
                                toastr.error(error.data.errorMessage, "Error")
                            }
                            else {
                                toastr.error(AuthHeaderService.genericErrorMessage(), "Error")
                            }
                            $(".page-spinner-bar").addClass("hide");
                        });

                    };
                }
            }
        });
    };
});
