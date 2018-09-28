angular.module('MetronicApp').controller('GemLabItemDetailsController', function ($translate, $translatePartialLoader, $rootScope, $log, $scope, $window,
    settings, $http, $timeout, $uibModal, $location, $filter,GemLabLineItemDetailsService,PurchaseOrderService) {

    $scope.items = $rootScope.items;
    $scope.boolValue = true;

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
    //RCV 
    $scope.OriginalRCVOfItem = 0.0;
    $scope.OriginalACVOfItem = 0.0;
    $scope.Comparables = [];
    $scope.AddedComparables = [];
    //From google
    $scope.ReplacementSuplier = [];
    $scope.GoogleComparableList = [];
    //Sort options for dropdown
    $scope.SortOptions = [{ Id: '-price', Value: "Price-Low TO High" }, { Id: '+price', Value: "Price-High To Low" }];
    $scope.sortcolumn = '-price';
    // Item details object and image object
    $scope.ItemDetails = {};
    $scope.images = [];
    //Serch variables for google 
    $scope.displayEmptyPart = true;
    $scope.displaycomparables = false;
    $scope.displayReplacement = false;
    $scope.dispalyAddedComparables = false;
    $scope.statuslist = [{ id: true, status: 'Yes' }, { id: false, status: 'No' }]
    $scope.SalvageDetails = {
        Selection: false
    };
    function init() {
        $scope.CommonObj = {
            ClaimNumber: sessionStorage.getItem("ThirdPartyClaimNo"),
            ClaimId: sessionStorage.getItem("ThirdPartyClaimId"),
            AssignmentNumber: sessionStorage.getItem("AssignmentNumber"),
            ItemNote: "",
            SearchComparables: "",
            ItemId: sessionStorage.getItem("ThirdPartyPostLostItemId"),
            ParticipantId: null,
            OrderType: "0",
            PolicyHolder: sessionStorage.getItem("Policyholder"),
            PurchaseClaimNumber: sessionStorage.getItem("ThirdPartyClaimNo"),
            PurchaseClaimId: sessionStorage.getItem("ThirdPartyClaimId"),
            PurchaseItemId: sessionStorage.getItem("ThirdPartyPostLostItemId"),
            ThisPage: "ItemDetails",
            RegistrationNumber: sessionStorage.getItem("RegistrationNumber")
        };



        //get item details on itemId
        var param = {
            "itemId": $scope.CommonObj.ItemId
        };
        var getItemDetailsOnId = GemLabLineItemDetailsService.gteItemDetails(param);
        getItemDetailsOnId.then(function (success) {
            $scope.ItemDetails = success.data.data;           
            //Calculate total tax and total value for ACV and RCV
            if ($scope.ItemDetails.rcv !== null && angular.isDefined($scope.ItemDetails.rcv)) {
                if ($scope.ItemDetails.taxRate !== null && angular.isDefined($scope.ItemDetails.taxRate)) {
                    $scope.ItemDetails.rcvTax = ($scope.ItemDetails.rcv * ($scope.ItemDetails.taxRate / 100)).toFixed(2);
                    $scope.ItemDetails.rcvTotal = (parseFloat($scope.ItemDetails.rcv) + parseFloat(($scope.ItemDetails.rcv * ($scope.ItemDetails.taxRate / 100)))).toFixed(2);
                }
                else
                    $scope.ItemDetails.rcvTax = 0.00;
            }
            else {
                $scope.ItemDetails.rcvTotal = $scope.ItemDetails.rcv;
                $scope.ItemDetails.rcvTax = 0.00
            }
            //For acv tax and total acv
            if ($scope.ItemDetails.acv !== null && angular.isDefined($scope.ItemDetails.acv)) {
                if ($scope.ItemDetails.taxRate !== null && angular.isDefined($scope.ItemDetails.taxRate)) {
                    $scope.ItemDetails.acvTax = parseFloat(($scope.ItemDetails.acv * ($scope.ItemDetails.taxRate / 100))).toFixed(2);
                    $scope.ItemDetails.acvTotal = (parseFloat($scope.ItemDetails.acv) + parseFloat(($scope.ItemDetails.acv * ($scope.ItemDetails.taxRate / 100)))).toFixed(2);
                }
                else
                    $scope.ItemDetails.acvTotal = $scope.ItemDetails.acv;

            } else {
                $scope.ItemDetails.acvTotal = $scope.ItemDetails.acv;
                $scope.ItemDetails.acvTax = 0.00;
            }
            $scope.ItemDetails.acv = ($scope.ItemDetails.acv !== null && angular.isDefined($scope.ItemDetails.acv)) ? parseFloat($scope.ItemDetails.acv.toFixed(2)) : $scope.ItemDetails.acv;
            $scope.ItemDetails.holdOverValue = ($scope.ItemDetails.holdOverValue !== null && angular.isDefined($scope.ItemDetails.holdOverValue)) ? parseFloat($scope.ItemDetails.holdOverValue.toFixed(2)) : $scope.ItemDetails.holdOverValue;
            $scope.ItemDetails.totalTax = ($scope.ItemDetails.totalTax !== null && angular.isDefined($scope.ItemDetails.totalTax)) ? parseFloat($scope.ItemDetails.totalTax.toFixed(2)) : $scope.ItemDetails.totalTax;
            $scope.ItemDetails.valueOfItem = ($scope.ItemDetails.valueOfItem !== null && angular.isDefined($scope.ItemDetails.valueOfItem)) ? parseFloat($scope.ItemDetails.valueOfItem.toFixed(2)) : $scope.ItemDetails.valueOfItem;
            $scope.ItemDetails.rcv = ($scope.ItemDetails.rcv !== null && angular.isDefined($scope.ItemDetails.rcv)) ? parseFloat($scope.ItemDetails.rcv.toFixed(2)) : $scope.ItemDetails.rcv;
            //$scope.ItemDetails.dateOfPurchase = $filter('DateFormatMMddyyyy')($scope.ItemDetails.dateOfPurchase);
            $scope.CommonObj.SearchComparables = angular.copy(success.data.data.description)

            GetSubCategory();
            //get images of item

            if ($scope.ItemDetails.assignedTo !== null)
                $scope.AssignedName = $scope.ItemDetails.assignedTo.firstName + " " + $scope.ItemDetails.assignedTo.lastName;
            else
                $scope.AssignedName = ""
            // get compairables stored in database and insrt in list Comparables
            var param = {
                "itemId": $scope.CommonObj.ItemId
            };

            var GetExistingComparablesFromDb = GemLabLineItemDetailsService.GetExistingComparablesFromDb(param);

            GetExistingComparablesFromDb.then(function (successComparables) {

                $scope.Comparables = successComparables.data.data;
                if ($scope.Comparables.comparableItems != null) {
                    $scope.displaycomparables = true;
                    $scope.displayEmptyPart = false;
                }
                else {
                    $scope.displaycomparables = false;
                    $scope.displayEmptyPart = true;
                    $scope.SearchReplacement();
                }
            }, function (error) {
                $scope.ErrorMessage = error.data.errorMessage;
            });
            GetNotes();
            var GetImageOfItem = GemLabLineItemDetailsService.gteItemImagess(param);

            GetImageOfItem.then(function (success) { $scope.images = success.data.data; }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });
        }, function (error) {
            toastr.remove();
            toastr.error(error.data.errorMessage, $translate.instant("ErrorHeading"));

            $scope.ErrorMessage = error.data.errorMessage;
        });
        //Get payment Details for vendor      
        var GetInvoice = GemLabLineItemDetailsService.getInvoiceList(param);
        GetInvoice.then(function (success) { $scope.InvoiceDetails = success.data.data; }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });

        var getReciptList = GemLabLineItemDetailsService.getReceiptList(param);
        getReciptList.then(function (success) { $scope.ReceiptList = success.data.data; }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });

        //--------------------------------------------------------------------------------------------------------------
        //get category list #29
        var getpromise = GemLabLineItemDetailsService.getCategory();
        getpromise.then(function (success) { $scope.CategoryList = success.data.data; }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });

        // get active vendors against claim for autocomplete textbox
        var param = { "claimNumber": $scope.CommonObj.ClaimNumber };
        var getpromise = GemLabLineItemDetailsService.getVendorsListAgainstClaim(param);
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

        //GetReplacementSupplier
        $scope.SelectedSupplier;
        var GetReplacementSuplier = GemLabLineItemDetailsService.GetReplacementSupplier();
        GetReplacementSuplier.then(function (success) { $scope.ReplacementSuplier = success.data.data; }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });


    }

    //ACV calclulation
    $scope.ItemDetails.rcvTax = 0.0;
    $scope.ItemDetails.acvTotal = 0.0;
    init();
    //go back function
    $scope.goBack = goBack;
    function goBack(e) {
        $location.url('ClaimDetails');
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
                var getItemDetailsOnId = GemLabLineItemDetailsService.gteItemDetails(param);
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
                    var deleteitem = GemLabLineItemDetailsService.deleteLineItem(param);
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
        $scope.CalculateRCV();
    }



    //Mark as replacement list
    $scope.MarkAsReplacement = MarkAsReplacement;
    function MarkAsReplacement(comp) {
        if (comp.isReplacementItem === true) {
            comp.isReplacementItem = false;
        }
        else
            comp.isReplacementItem = true;
    }

    // ************* End comparable form DBlist********************
    //*********************Googole search**********************************
    $scope.Searchoptions = [1, 3];
    $scope.SearchReplacement = SearchReplacement;
    function SearchReplacement() {
        //Get items if exists in dbcomparable list and add to addtocomparables list
        if ($scope.Comparables !== null) {
            if ($scope.AddedComparables.length === 0) {
                angular.forEach($scope.Comparables.comparableItems, function (item) {
                    if (angular.isDefined(item.customItemDetail) && item.customItemDetail != null) {
                        angular.forEach(item.customItemDetail.customSubItem, function (subitem) {

                            $scope.AddedComparables.push({
                                "id": subitem.id,
                                "description": subitem.description, "brand": null, "model": null, "price": ((subitem.unitPrice.toString()).indexOf('$') > -1) ? subitem.unitPrice.split('$')[1] : subitem.unitPrice, "buyURL": null,
                                "isDataImage": false, "supplier": null, "imageURL": subitem.attachment[0].url, "isvendorItem": true,
                            });
                        });
                    }
                    else {

                        $scope.AddedComparables.push({
                            "id": item.id,
                            "description": item.description, "brand": item.brand, "model": item.model, "price": ((item.unitPrice.toString()).indexOf('$') > -1) ? item.unitPrice.split('$')[1] : item.unitPrice, "buyURL": item.buyURL,
                            "isDataImage": item.isDataImage, "supplier": item.supplier, "imageURL": ((item.imageData !== null) ? item.imageData : item.imageURL), "isvendorItem": item.isvendorItem,
                        });
                    }
                });
            }
        }
        if ($scope.CommonObj.SearchComparables !== null && !angular.isUndefined($scope.CommonObj.SearchComparables) && $scope.CommonObj.SearchComparables !== "") {
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
                "ids": $scope.Searchoptions
            };
            var GetGoogleCompairables = GemLabLineItemDetailsService.GetComparableListFromGoogle(Searchstring);
            GetGoogleCompairables.then(function (success) {
                //We need to work here googleResults  amazonResults
                var listgooleComparable = [];
                angular.forEach(success.data.data.googleResults, function (item) {
                    listgooleComparable.push({
                        "id": null,
                        "description": item.description, "brand": null, "model": null, "price": ((item.price.toString()).indexOf('$') > -1) ? item.price.split('$')[1] : item.price, "buyURL": item.itemURL,
                        "isDataImage": true, "supplier": null, "imageURL": item.image, "isvendorItem": false
                    });
                });
                var amazonComparable = [];
                angular.forEach(success.data.data.amazonResults, function (item) {
                    amazonComparable.push({
                        "id": null,
                        "description": item.description, "brand": item.brand, "model": item.model, "price": ((item.price.toString()).indexOf('$') > -1) ? item.price.split('$')[1] : item.price, "buyURL": item.buyURL,
                        "isDataImage": false, "supplier": null, "imageURL": item.imageURL, "isvendorItem": false
                    });
                });
                var VendorComparables = [];
                angular.forEach(success.data.data.vendorCatalogItems, function (item) {
                    VendorComparables.push({
                        "id": null,
                        "description": item.description, "brand": item.brand, "model": item.model, "price": ((item.price.toString()).indexOf('$') > -1) ? item.price.split('$')[1] : item.price, "buyURL": null,
                        "isDataImage": false, "supplier": null, "imageURL": ((item.itemImages !== null) ? ((item.itemImages.length > 0) ? item.itemImages[0].url : null) : null), "isvendorItem": true
                    });
                });


                $scope.GoogleComparableList = listgooleComparable.concat(amazonComparable);
                $scope.GoogleComparableList = $scope.GoogleComparableList.concat(VendorComparables);

                $scope.SortGoogleResult();
            }, function (error) { $scope.ErrorMessage = error.data.erromessage; });
        }
        else {
            $scope.SearchReplacement();
        }
    }


    //Sort Google result
    $scope.SortGoogleResult = SortGoogleResult;
    function SortGoogleResult() {
        $scope.GoogleComparableList = $filter('orderBy')($scope.GoogleComparableList, $scope.sortcolumn);
    };

    //List for selected comparables and function add it in list\
    $scope.AddedComparables = [];
    $scope.AddtoComparableList = AddtoComparableList;
    function AddtoComparableList(item) {
        $scope.GoogleComparableList.splice($scope.GoogleComparableList.indexOf(item), 1);
        $scope.AddedComparables.push(item);
        $scope.CalculateRCV();
    };

    //Remove form comaprables from list
    $scope.RemoveFromComparableList = RemoveFromComparableList;
    function RemoveFromComparableList(item) {
        $scope.AddedComparables.splice($scope.AddedComparables.indexOf(item), 1);
        $scope.CalculateRCV();
        if (item.id === null)
            $scope.GoogleComparableList.push(item);
    }
    //Go to shopping URL
    $scope.ShopNow = ShopNow;
    function ShopNow(comparable) {
        $window.open(comparable.buyURL, '_blank');
    }

    $scope.SaveNewlyAddedComparables = SaveNewlyAddedComparables;
    function SaveNewlyAddedComparables()//SaveNewComparables
    {
        //$(".page-spinner-bar").removeClass("hide");
        var ComparableList = [];
        //Need to work

        angular.forEach($scope.AddedComparables, function (item) {
            if (item.id === null) {
                ComparableList.push({
                    "id": item.id,
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
                    "isReplacementItem": ($scope.ItemDetails.isReplacementItem) ? $scope.ItemDetails.isReplacementItem : false,
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
                            InsertFlag = true;
                        }
                    });
                    if (InsertFlag === true) {
                        ComparableList.push(item);
                    }
                    //Need to chek form him the item should be removed form here or not
                    //else
                    //{
                    //    item.delete = true;
                    //    ComparableList.push(item);
                    //}                    
                });
            }
        }
        angular.forEach($scope.DeletedComparables, function (item) {

            ComparableList.push(item);
        });
        var param = {
            "registrationNumber": $scope.CommonObj.RegistrationNumber,
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
                "scheduleAmount": $scope.ItemDetails.scheduleAmount,
                "claimId": $scope.ItemDetails.claimId,
                "claimNumber": $scope.ItemDetails.claimNumber,
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
                "vendorDetails": $scope.ItemDetails.vendorDetails,
                "yearOfManufecturing": $scope.ItemDetails.yearOfManufecturing
            },
            "comparableItems": ComparableList

        };
        var SaveNewComparables = GemLabLineItemDetailsService.SaveNewComparables(param);
        SaveNewComparables.then(function (success) {
            if ($scope.ItemDetails.salvageItem) {
                var SalvageParam = {
                    "itemUID": $scope.ItemDetails.itemUID,
                    "salvageAmount": $scope.ItemDetails.salvageAmount,
                    "salvageItem": true
                }
                var SalvageItem = GemLabLineItemDetailsService.SaveSalvageItem(SalvageParam);
                SalvageItem.then(function (success) {
                }, function (error) {
                    toastr.remove()
                    toastr.error(error.data.errorMessage, $translate.instant("ErrorHeading"));
                });
            }

            //Add replacement hide google result and show from Comparables from db
            $scope.AddedComparables = []; $scope.GoogleComparableList = [];
            // get compairables stored in database and insrt in list Comparables
            var ParamItemId = { "itemId": $scope.CommonObj.ItemId };
            var GetExistingComparablesFromDb = GemLabLineItemDetailsService.GetExistingComparablesFromDb(ParamItemId);
            GetExistingComparablesFromDb.then(function (success) {
                $(".page-spinner-bar").addClass("hide");
                //Show toastr for success
                toastr.remove()
                toastr.success(success.data.message, $translate.instant("SuccessHeading"));


                $scope.Comparables = success.data.data;
                ComparableList = []; $scope.AddedComparables = []; $scope.DeletedComparables = [];
                $scope.AddReplacement();
            }, function (error) {
                $(".page-spinner-bar").addClass("hide");

                toastr.remove()
                toastr.error(error.data.errorMessage, $translate.instant("ErrorHeading"));


                $scope.ErrorMessage = error.data.errorMessage;
            });

        }, function (error) {
            toastr.remove()
            toastr.error(error.data.errorMessage, $translate.instant("ErrorHeading"));

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
        $scope.displayReplacement = false;
        $scope.dispalyAddedComparables = false;
        //$scope.Comparables=$scope.AddedAsReplacementList;//serchers
    };
    //Select comparables if press back the empty list and calculate rcv again pageload state
    $scope.CancelAddedComparables = CancelAddedComparables;
    function CancelAddedComparables() {
        $scope.GoogleComparableList = [];
        $scope.AddedComparables = [];
        $scope.AddReplacement();
        $scope.CalculateRCV();

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
        var SaveItemDetails = GemLabLineItemDetailsService.SaveItemDetails(param);
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

    //Calculate RCV
    $scope.CalculateRCV = function () {
        if ($scope.Comparables !== null) {
            $scope.OriginalRCVOfItem = 0;
            $scope.OrignialLength = 0;

            //Get total of comparable value if already has (Saved in database)
            var list = [];
            list = $filter('filter')($scope.Comparables.comparableItems, { delete: false });
            angular.forEach(list, function (item) {
                $scope.OriginalRCVOfItem = $scope.OriginalRCVOfItem + parseFloat(item.unitPrice)
            });

            $scope.OrignialLength = (angular.isDefined(list) && list != null) ? list.length : 0;
        }

        var TotalPrice = 0;
        var count = 0; var age = 1; var Depereciation = 1;
        //Get total of added comparable value 
        angular.forEach($scope.AddedComparables, function (item) {
            TotalPrice = parseFloat(TotalPrice) + parseFloat(item.price); count++;
        });

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

            var getpromise = GemLabLineItemDetailsService.addClaimNoteWithParticipant(data);
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

            var getpromise = GemLabLineItemDetailsService.addClaimNoteWithParticipant(data);
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
    $scope.getNoteFileDetails = function (e) {

        $scope.$apply(function () {
            $scope.fileName = e.files[0].name;
            $scope.FileType = e.files[0].type;
            $scope.FileExtension = $scope.fileName.substr($scope.fileName.lastIndexOf('.'));
            $scope.files.push(e.files[0]);
            fr = new FileReader();
            //fr.onload = receivedText;
            fr.readAsDataURL(e.files[0]);
        });

    };


    function GetNotes() {
        var param = {
            "itemId": $scope.CommonObj.ItemId
        };
        var getpromise = GemLabLineItemDetailsService.getItemNotes(param);
        getpromise.then(function (success) {
            $scope.Notes = success.data.data; $scope.Notes = success.data.data;
            if ($scope.Notes !== null && $scope.Notes.length > 0) {
                $scope.NoteDetails = $scope.Notes[0];
                $scope.NoteIndex = 0;
            }
        }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });

    }
    //---------------End Note Attachment------------------------------------------
    $scope.GetSubCategory = GetSubCategory;
    function GetSubCategory() {
        //--------------------------------------------------------------------------------------------------------------
        //bind subcategory
        if ($scope.ItemDetails.category !== null && angular.isDefined($scope.ItemDetails.category)) {
            var param = { "categoryId": $scope.ItemDetails.category.id };
            var getpromise = GemLabLineItemDetailsService.getSubCategory(param);
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
            $scope.CalculateRCV();
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
    $scope.displayAddImageButton = true;
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
        var SaveItemDetails = GemLabLineItemDetailsService.SaveItemDetails(param);
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
        var GetImageOfItem = GemLabLineItemDetailsService.gteItemImagess(param);
        GetImageOfItem.then(function (success) { $scope.images = success.data.data; }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });

    };

    //Accept button

    $scope.AcceptItem = AcceptItem;
    function AcceptItem() {
        var param = {
            "id": $scope.CommonObj.ItemId,
            "approvedItemValue": $scope.ItemDetails.valueOfItem
        };
        var AcceptItem = GemLabLineItemDetailsService.AcceptItem(param);
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
    //New Note
    $scope.AddNotePopup = AddNotePopup;
    function AddNotePopup(ev) {
        var obj = {
            "ClaimId": $scope.CommonObj.ClaimId,
            "ItemId": $scope.CommonObj.ItemId,
            "ParticipantList": $scope.ClaimParticipantsList

        };

        $scope.animationsEnabled = true;
        var out = $uibModal.open(
        {
            animation: $scope.animationsEnabled,
            templateUrl: "views/ThirdPartyVendor/AddNotePopup.html",
            controller: "AddItemNotePopupController",
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

    $scope.AddNotePopup = AddNotePopup;
    function AddNotePopup(ev) {
        var obj = {
            "ClaimId": $scope.CommonObj.ClaimId,
            "ItemId": $scope.CommonObj.ItemId,
            "ParticipantList": $scope.ClaimParticipantsList

        };
        $scope.animationsEnabled = true;
        var out = $uibModal.open(
        {
            animation: $scope.animationsEnabled,
            templateUrl: "views/ThirdPartyVendor/AddNotePopup.html",
            controller: "AddItemNotePopupController",
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


    $scope.GoToCustomItem = GoToCustomItem;
    function GoToCustomItem() {
         
        sessionStorage.setItem("ClaimNo", $scope.CommonObj.ClaimNumber)
        sessionStorage.setItem("ClaimId", $scope.CommonObj.ClaimId)
        sessionStorage.setItem("Policyholder", $scope.CommonObj.PolicyHolder)
        sessionStorage.setItem("ItemNumber", $scope.ItemDetails.itemNumber);
        sessionStorage.setItem("ItemId", $scope.CommonObj.ItemId);
        sessionStorage.setItem("Page", "ThirdPartyLineItemDetails");

        $location.url("AddCustomItem");
    };

    //Mer Screen
    $scope.GoToMER = GoToMER;
    function GoToMER() {

        sessionStorage.setItem("ClaimNo", $scope.CommonObj.ClaimNumber)
        sessionStorage.setItem("ClaimId", $scope.CommonObj.ClaimId)

        sessionStorage.setItem("Policyholder", $scope.CommonObj.PolicyHolder)
        sessionStorage.setItem("ItemId", $scope.CommonObj.ItemId);
        $location.url('MER');
    };

    //GoTo View Quote
    $scope.GoToViewQuote = GoToViewQuote;
    function GoToViewQuote() {
        sessionStorage.setItem("ClaimNumber", $scope.CommonObj.ClaimNumber);
        sessionStorage.setItem("ClaimId", $scope.CommonObj.ClaimId);
        sessionStorage.setItem("ItemNumber", $scope.ItemDetails.itemNumber)
        sessionStorage.setItem("ItemId", $scope.CommonObj.ItemId)
        sessionStorage.setItem("AssignmentNumber", $scope.ItemDetails.assignmentDetails.assignmentNumber)
        sessionStorage.setItem("AssignmentId", $scope.ItemDetails.assignmentDetails.id)
        sessionStorage.setItem("BackPage", "ThirdPartyLineItemDetails");
        sessionStorage.setItem("ClaimDetailsPage", "ThirdPartyClaimDetails");
        sessionStorage.setItem("LineDetailsPage", "ThirdPartyLineItemDetails");
        $location.url('ViewQuote');

    };
});