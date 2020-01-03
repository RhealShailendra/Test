angular.module('MetronicApp').controller('AddItemController', function ($translate, $translatePartialLoader, $rootScope, $log, $scope, settings, $http, $timeout, $location, $uibModal, $filter, AuthHeaderService, ThirdPartyClaimDetailsService) {

    $scope.items = $rootScope.items; $scope.boolValue = true;
    $translatePartialLoader.addPart('ThirdPartyClaimDetails');
    $translate.refresh();

    $scope.AddNewItem = false;
    $scope.EditItem = false;
    $scope.FiletrLostDamageList = [];
    $scope.selected = { isScheduledItem : false};
    $scope.CommonObj =  
    {
        ClaimProfile: sessionStorage.getItem("claimProfile"),
        ClaimNumber: sessionStorage.getItem("ThirdPartyClaimNo"),
        ClaimId: sessionStorage.getItem("ThirdPartyClaimId"),
        AssignmentNumber: sessionStorage.getItem("AssignmentNumber"),
        AssignmentId: sessionStorage.getItem("AssignmentId"),
    }
    function init()
    {
        GetPostLostItems();
        GetPolicyDetails();
       
    }
    init();

    $scope.SaveItemDetails = function (itemid) {
        $(".page-spinner-bar").removeClass("hide");
        //update Item
        if (!angular.isUndefined(itemid)) {
            
            var param = new FormData();
       
            if ($scope.ItemFiles.length == 0 || $scope.ItemFiles == null) {
                param.append('filesDetails', null);
                param.append('file', null);
            }
            else {
                var fileDetails = [];
                angular.forEach($scope.ItemFiles, function (ItemFile) {
                    fileDetails.push({ "fileName": ItemFile.FileName, "fileType": ItemFile.FileType, "extension": ItemFile.FileExtension, "filePurpose": "ITEM", "latitude": null, "longitude": null });
                    param.append('file', ItemFile.File);
                });
                param.append('filesDetails', JSON.stringify(fileDetails));
           
            };
            param.append("itemDetails",
                JSON.stringify(
                 {
                     "id": $scope.selected.id,
                     "acv": (angular.isDefined($scope.selected.acv) && $scope.selected != null ? $scope.selected.acv :null),
                     "acvTax": (angular.isDefined($scope.selected.acvTax) && $scope.selected != null ? $scope.selected.acvTax : null),
                     "acvTotal": (angular.isDefined($scope.selected.acvTotal) && $scope.selected != null ? $scope.selected.acvTotal : null),
                     "registrationNumber": sessionStorage.getItem("CompanyCRN"),
                     "adjusterDescription": (angular.isDefined($scope.selected.adjusterDescription) && $scope.selected != null ? $scope.selected.adjusterDescription : null),
                     "ageMonths": (angular.isDefined($scope.selected.ageMonths) ? $scope.selected.ageMonths : 0),
                     "ageYears": (angular.isDefined($scope.selected.ageYears) ? $scope.selected.ageYears : 0),
                     "brand": $scope.selected.brand,
                     "category": {
                         "id": (($scope.selected.category !== null && angular.isDefined($scope.selected.category)) ? $scope.selected.category.id : null),
                         "name": (($scope.selected.category !== null && angular.isDefined($scope.selected.category)) ? GetCategoryOrSubCategoryOnId(true, $scope.selected.category.id) : null),
                     },
                     //"attachments": [
                     //   { "id": 59, "name": "Salvage item", "uploadDate": "07-02-2018T20:09:47Z", "url": "http://localhost:8080/ArtigemRS-FI/artigem/mediafiles/ABCD98108_1530542387777.jpg" }
                     //],
                     "categoryLimit": (angular.isDefined($scope.selected.category.aggregateLimit)&&$scope.selected.category.aggregateLimit!=null?$scope.selected.category.aggregateLimit:0),
                   //  "claimId": $scope.selected.claimId,
                     "claimNumber": $scope.selected.claimNumber,
                     "dateOfPurchase": ((angular.isDefined($scope.selected.dateOfPurchase) && $scope.selected.dateOfPurchase !== null && $scope.selected.dateOfPurchase != "") ? $filter('DatabaseDateFormatMMddyyyy')($scope.selected.dateOfPurchase) : null),
                     "depriciationRate": $scope.selected.depriciationRate,
                     "description": $scope.selected.description,
                     "appraisalValue": $scope.selected.appraisalValue,
                     "holdOverPaymentDate": ((angular.isDefined($scope.selected.holdOverPaymentDate) && $scope.selected.holdOverPaymentDate !== null && $scope.selected.holdOverPaymentDate != "") ? $filter('DatabaseDateFormatMMddyyyy')($scope.selected.holdOverPaymentDate) : null),
                     "holdOverPaymentMode": (angular.isDefined($scope.selected.holdOverPaymentMode) ? $scope.selected.holdOverPaymentMode : null),
                     "holdOverPaymentPaidAmount": (angular.isDefined($scope.selected.holdOverPaymentPaidAmount) ? $scope.selected.holdOverPaymentPaidAmount : null),
                     "holdOverValue": (angular.isDefined($scope.selected.holdOverValue) ? $scope.selected.holdOverValue : null),                  
                     "insuredPrice": $scope.selected.insuredPrice,
                     "isReplaced": (angular.isDefined($scope.selected.isReplaced) ? $scope.selected.isReplaced : null),
                     "isScheduledItem": (angular.isDefined($scope.selected.isScheduledItem) ? $scope.selected.isScheduledItem : null),
                     "itemName": (angular.isDefined($scope.selected.itemName) ? $scope.selected.itemName : null),
                     "itemType": (angular.isDefined($scope.selected.itemType) ? $scope.selected.itemType : null),
                     "model": (angular.isDefined($scope.selected.model) ? $scope.selected.model : null),
                     "scheduleAmount": (angular.isDefined($scope.selected.scheduleAmount) ? $scope.selected.scheduleAmount: null),
                     "quantity": (angular.isDefined($scope.selected.quantity) ? $scope.selected.quantity : null),
                     "quotedPrice": (angular.isDefined($scope.selected.quotedPrice) ? $scope.selected.quotedPrice : null),
                     "rcv": (angular.isDefined($scope.selected.rcv) && $scope.selected != null ? $scope.selected.rcv : null),
                     "rcvTax": (angular.isDefined($scope.selected.rcvTax) && $scope.selected != null ? $scope.selected.rcvTax : null),
                     "rcvTotal": (angular.isDefined($scope.selected.rcvTotal) && $scope.selected != null ? $scope.selected.rcvTotal : null),
                     "receiptValue": (angular.isDefined($scope.selected.receiptValue) && $scope.selected != null ? $scope.selected.receiptValue : null),
                     "status": {
                         "id": $scope.selected.status.id,
                         "status": $scope.selected.status.status
                     },
                     "subCategory": (angular.isDefined($scope.selected.subCategory) ? {
                         "id": (($scope.selected.subCategory !== null && angular.isDefined($scope.selected.subCategory)) ? $scope.selected.subCategory.id : null),
                         "name": (($scope.selected.subCategory !== null && angular.isDefined($scope.selected.subCategory)) ? GetCategoryOrSubCategoryOnId(false, $scope.selected.subCategory.id) : null),
                     } : null),
                     "taxRate": (angular.isDefined($scope.selected.taxRate) && $scope.selected != null ? $scope.selected.taxRate : null),
                     "totalQuantityReplaced": (angular.isDefined($scope.selected.totalQuantityReplaced) && $scope.selected != null ? $scope.selected.totalQuantityReplaced : null),
                     "totalTax": (angular.isDefined($scope.selected.totalTax) && $scope.selected != null ? $scope.selected.totalTax : null),
                     "valueOfItem": (angular.isDefined($scope.selected.valueOfItem) && $scope.selected != null ? $scope.selected.valueOfItem : null),
                     "vendorDetails": {
                         "isActive": ((angular.isDefined($scope.selected.vendorDetails) && $scope.selected.vendorDetails != null) ? (angular.isDefined($scope.selected.vendorDetails.isActive) ? $scope.selected.vendorDetails.isActive : null) : null),
                         "vendorId": ((angular.isDefined($scope.selected.vendorDetails) && $scope.selected.vendorDetails != null) ? (angular.isDefined($scope.selected.vendorDetails.vendorId) ? $scope.selected.vendorDetails.vendorId : null) : null),
                         "vendorName": ((angular.isDefined($scope.selected.vendorDetails) && $scope.selected.vendorDetails != null) ? (angular.isDefined($scope.selected.vendorDetails.vendorName) ? $scope.selected.vendorDetails.vendorName : null) : null),
                         "vendorNumber": ((angular.isDefined($scope.selected.vendorDetails) && $scope.selected.vendorDetails != null) ? (angular.isDefined($scope.selected.vendorDetails.vendorNumber) ? $scope.selected.vendorDetails.vendorNumber : null) : null),
                     },
                     "yearOfManufecturing": (angular.isDefined($scope.selected.yearOfManufecturing) && $scope.selected != null ? $scope.selected.yearOfManufecturing : null),
                     "itemNumber": $scope.selected.itemNumber,
                     "appraisalDate": ((angular.isDefined($scope.selected.appraisalDate) && $scope.selected.appraisalDate !== null && $scope.selected.appraisalDate != "") ? $filter('DatabaseDateFormatMMddyyyy')($scope.selected.appraisalDate) : null),
                     "individualLimitAmount": (angular.isDefined($scope.selected.individualLimitAmount) ? $scope.selected.individualLimitAmount : null),
                     "itemUID": $scope.selected.itemUID,
                 }
                ));


            var UpdatePostLoss = ThirdPartyClaimDetailsService.UpdatePostLoss(param);
            UpdatePostLoss.then(function (success) {
                $scope.EditItemFiles = [];
                $scope.GetPostLostItems();
                // var obj = MakeObjectToAddInList(success);
                //obj.status.status = $scope.OriginalPostLossItem.claimItem.status.status;
                //obj.isReplaced = $scope.OriginalPostLossItem.claimItem.isReplaced;
                //$scope.FiletrLostDamageList[$scope.OriginalPostLossIndex].claimItem = angular.copy(obj);
                toastr.remove()
                toastr.success(success.data.message, $translate.instant("ItemEditSuccessHeading"));

                $scope.reset();
            },
            function (error) {
                toastr.remove()
                toastr.error(error.data.errorMessage, $translate.instant("ItemEditErrorHeading"));
            });
        }
            //save Item
        else {
            //Call Api save And get its id then assign id and pass 
            calculateMaxItemNo();
            var param = new FormData();
            var param = new FormData();
            angular.forEach($scope.ItemFiles, function (ItemFile) {

                param.append('filesDetails', JSON.stringify([{ "fileName": ItemFile.FileName, "fileType": ItemFile.FileType, "extension": ItemFile.FileExtension, "filePurpose": "ITEM", "latitude": null, "longitude": null }]));
                param.append('file', ItemFile.File);
            });

            if ($scope.ItemFiles.length == 0 || $scope.ItemFiles == null) {
                param.append('filesDetails', null);
                param.append('file', null);
            };

            param.append("itemDetails",
                JSON.stringify({
                    "acv": null,
                    "acvTax": null,
                    "acvTotal": null,
                    "registrationNumber": sessionStorage.getItem("CompanyCRN"),
                    "assignmentDetails": { "assignmentNumber": $scope.CommonObj.AssignmentNumber },
                    "ageMonths": (angular.isDefined($scope.selected.ageMonths) ? $scope.selected.ageMonths : 0),
                    "adjusterDescription":null ,
                    "ageYears": (angular.isDefined($scope.selected.ageYears) ? $scope.selected.ageYears : 0),
                    "brand": $scope.selected.brand,
                    "category": {
                        "id": (($scope.selected.category !== null && angular.isDefined($scope.selected.category)) ? $scope.selected.category.id : null),
                        "name": (($scope.selected.category !== null && angular.isDefined($scope.selected.category)) ? GetCategoryOrSubCategoryOnId(true, $scope.selected.category.id) : null),
                    },
                    "categoryLimit": (angular.isDefined($scope.selected.category.aggregateLimit) ? $scope.selected.category.aggregateLimit : 0),
                    "claimNumber": $scope.CommonObj.ClaimNumber,
                    "categoryLimit": "100",
                    "dateOfPurchase": null,
                    "depriciationRate": $scope.selected.depriciationRate,
                    "holdOverPaymentDate": null,
                    "holdOverPaymentMode": null,
                    "holdOverPaymentPaidAmount": null,
                    "holdOverValue": null,
                    "insuredPrice": $scope.selected.insuredPrice,
                    "isReplaced": false,
                    "isScheduledItem": $scope.selected.isScheduledItem,
                    "itemName": $scope.selected.itemName,
                    "itemType":null,
                    "model": $scope.selected.model,
                    "quantity": $scope.selected.quantity,
                    "quotedPrice": null,
                    "rcv": null,
                    "rcvTax": null,
                    "rcvTotal": null,
                    "receiptValue": null,
                    "scheduleAmount": $scope.selected.scheduleAmount,
                    "status": {
                        "id": (($scope.selected.status !== null && angular.isDefined($scope.selected.status)) ? $scope.selected.status.id : null),
                        "status": (($scope.selected.status !== null && angular.isDefined($scope.selected.status)) ? $scope.selected.status.status : null)
                    },
                    "subCategory": (angular.isDefined($scope.selected.subCategory) ? {
                       
                        "id": (($scope.selected.subCategory !== null && angular.isDefined($scope.selected.subCategory)) ? $scope.selected.subCategory.id : null),
                        "name": (($scope.selected.subCategory !== null && angular.isDefined($scope.selected.subCategory)) ? GetCategoryOrSubCategoryOnId(false, $scope.selected.subCategory.id) : null),

                    } : null),
                    "taxRate": null,
                    "totalQuantityReplaced":null,
                    "totalTax": null,
                    "valueOfItem": null,
                    "vendorDetails": {
                        "isActive": true,
                        "vendorId": sessionStorage.getItem("VendorId"),
                        "vendorName": sessionStorage.getItem("vendorName"),
                        "vendorNumber": sessionStorage.getItem("RegistrationNumber")
                    },
                    "yearOfManufecturing": null,
                   // "categoryLimit": (angular.isDefined($scope.selected.category.aggregateLimit) ? $scope.selected.category.aggregateLimit : 0),
                   //"claimId": $scope.CommonObj.ClaimId,
                    "itemNumber": null,//$scope.selected.itemNumber,
                    "appraisalValue": $scope.selected.appraisalValue,
                    "appraisalDate": ((angular.isDefined($scope.selected.appraisalDate) && $scope.selected.appraisalDate !== null && $scope.selected.appraisalDate != "" && $scope.selected.appraisalDate != " ") ? $filter('DatabaseDateFormatMMddyyyy')($scope.selected.appraisalDate) : null),
                    "description": $scope.selected.description,
                    "individualLimitAmount": (angular.isDefined($scope.selected.individualLimitAmount) ? $scope.selected.individualLimitAmount : null),
                }
                ));

            var SavePostLossItem = ThirdPartyClaimDetailsService.AddPostLossItem(param);
            SavePostLossItem.then(function (success) {
                //Need to pass the ItemId which will generate after inserting item  
                $scope.NewlyAddedItemId = success.data.data.id;
                $scope.EditItemFiles = [];
               $scope.GetPostLostItems();
                toastr.remove()
                toastr.success(success.data.message, $translate.instant("ItemEditSuccessHeading"));
                $(".page-spinner-bar").addClass("hide");
                $scope.reset();
            }, function (error) {

                toastr.remove()
                toastr.error(error.data.errorMessage, $translate.instant("ItemEditErrorHeading"));
                $(".page-spinner-bar").addClass("hide");

            });
        }

    };

    $scope.reset = function () {
        if ($scope.CommonObj.ClaimProfile == 'Jewelry') {
            $scope.AddItemForm.$setUntouched();
        }
        else {
            $scope.AddContentsItemForm.$setUntouched();
        }

        $scope.AddNewItem = false;
        $scope.EditItem = false;
        $scope.ItemFiles = [];
        $scope.EditItemFiles = [];
        if ($scope.CommonObj.ClaimProfile == 'Jewelry') {
            $scope.selected = { isScheduledItem: false, category: { id: 30 } };
            $scope.GetSubCategory();
        }
        else {
            $scope.selected = { isScheduledItem: false };
        }
    };
    $scope.calculateMaxItemNo = calculateMaxItemNo;
    function calculateMaxItemNo() {

        $scope.selected.itemNumber = parseInt($scope.FiletrLostDamageList == null ? 0 : $scope.FiletrLostDamageList.length) + 1;
    }
    $scope.SelectItemFile = function () {

        angular.element('#ItemFileUpload').trigger('click');
    };

    $scope.ItemFiles = []
    $scope.getItemFileDetails = function (e) {
        $scope.ItemFiles = [];
        var files = event.target.files;
        $scope.filed = event.target.files;
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var reader = new FileReader();
            reader.file = file;
            reader.fileName = files[i].name;
            reader.fileType = files[i].type;
            reader.fileExtension = files[i].name.substr(files[i].name.lastIndexOf('.'));
            reader.onload = $scope.ItemImageLoaded;
            reader.readAsDataURL(file);
        }
    };

    $scope.removeattchment = removeattchment;
    function removeattchment(index) {
        $scope.ItemFiles.splice(index, 1);
    };
    $scope.ItemImageLoaded = function (e) {
        $scope.$apply(function () {

            $scope.ItemFiles.push({ "FileName": e.target.fileName, "FileExtension": e.target.fileExtension, "FileType": e.target.fileType, "Image": e.target.result, "File": e.target.file })
        });
    };
    $scope.selected.isScheduledItem = false;
    $scope.SelectScheduledItem = SelectScheduledItem;
    function SelectScheduledItem(val) {
        if (val == true) {
            $scope.ScheduledItem = true;
        }
        else if (val == false) {
            $scope.ScheduledItem = false;
        }

    }

    $scope.SetScheduledStatus = SetScheduledStatus;
    function SetScheduledStatus(item, status) {
        item.isScheduledItem = status;
    };

    $scope.GetSubCategory = GetSubCategory;
    function GetSubCategory() {
        if ($scope.selected.category != null && angular.isDefined($scope.selected.category)) {
            $(".page-spinner-bar").removeClass("hide");
            var param = {
                "categoryId": $scope.selected.category.id
            };
            GetCatagoryLimit($scope.selected.category.id);

            var respGetSubCategory = ThirdPartyClaimDetailsService.getSubCategory(param);
            respGetSubCategory.then(function (success) {
                $scope.SubCategory = success.data.data;
                $(".page-spinner-bar").addClass("hide");
            }, function (error) {
                $scope.SubCategory = null; $scope.ErrorMessage = error.data.errorMessage
                $(".page-spinner-bar").addClass("hide");
            });
        }
    }

    $scope.GetCatagoryLimit = GetCatagoryLimit;
    function GetCatagoryLimit(id) {
        var count = 0;
        angular.forEach($scope.PolicyDetails.categories, function (item) {
            if (item.id == id) {
                count++
                $scope.selected.category.aggregateLimit = (item.coverageLimit == null ? 0 : item.coverageLimit);
            }
        })
        if (count == 0) {
            $scope.selected.category.aggregateLimit = 0;
        }
    };

    $scope.GetPolicyDetails = GetPolicyDetails;
    function GetPolicyDetails() {
        //Get Policy Details
        var param = { "policyNumber": null, "claimNumber": $scope.CommonObj.ClaimNumber };
        var getPolicyDetails = ThirdPartyClaimDetailsService.getPolicyDetails(param);
        getPolicyDetails.then(function (success) {
            $scope.PolicyDetails = success.data.data;
            GetCategory();
            if ($scope.CommonObj.ClaimProfile == 'Jewelry') {
                $scope.selected = { isScheduledItem: false, category: { id: 30 } };
                GetSubCategory();
            }
        }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });

    };
    $scope.EditItemDetails = function (item) {
        $scope.EditItemFiles = [];
        if ($scope.EditItemFiles == null || $scope.EditItemFiles.length == 0) {
            angular.forEach(item.claimItem.attachments, function (attachment) {
                $scope.EditItemFiles.push({ "FileName": attachment.name, "url": attachment.url })
            });
        }
        $scope.selected = {};
        $scope.selected = angular.copy(item.claimItem);

        $scope.selected.appraisalDate = $filter('DateFormatMMddyyyy')($scope.selected.appraisalDate);
        $scope.OriginalPostLossIndex = $scope.FiletrLostDamageList.indexOf(item);
        $scope.OriginalPostLossItem = angular.copy(item);

        if ($scope.CommonObj.ClaimProfile == 'Contents') {
            $scope.GetCategory();
            $scope.GetSubCategory();
        }
        //$scope.EditItemFiles = item.claimItem.attachments;
    };
    $scope.getTemplate = function (item) {
            return 'display';
    };

    $scope.GetPostLostItems = GetPostLostItems;
    function GetPostLostItems() {
        $(".page-spinner-bar").removeClass("hide");
        var param = {
            "claimNumber": $scope.CommonObj.ClaimNumber.toString(),
            "assignmentNumber":$scope.CommonObj.AssignmentNumber.toString()
        }
        var getpromise = ThirdPartyClaimDetailsService.getPostLostItemsForVendor(param);
        getpromise.then(function (success) {
            $scope.FiletrLostDamageList = [];
            $scope.FiletrLostDamageList = success.data.data.itemReplacement;
            $scope.FilteredItemByAssignment = [];
            var TempList = [];
            angular.forEach($scope.FiletrLostDamageList, function (item) {
                if (item.claimItem.isActive) {
                    TempList.push(item)
                }
            });
            $scope.FiletrLostDamageList = angular.copy(TempList);
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            toastr.remove();
            toastr.error(error.data.errorMessage, $translate.instant("ErrorHeading"));
            $scope.ErrorMessage = error.data.errorMessage;
            $(".page-spinner-bar").addClass("hide");
        });
    };

    $scope.GoToClaimDetails = GoToClaimDetails;
    function GoToClaimDetails() {

        var user = sessionStorage.getItem("RoleList");
        if (user.toUpperCase() == "VENDOR ASSOCIATE") {
            $location.url('VendorAssociateClaimDetails');
        } else {
            $location.url('ThirdPartyClaimDetails');
        }
    };
    $scope.back = function () {
        sessionStorage.setItem("ThirdPartyClaimNo", "");
        sessionStorage.setItem("ThirdPartyClaimId", "");
        sessionStorage.setItem("SelectedItemList", "");
        sessionStorage.setItem("ShowEventActive", ""),
       sessionStorage.setItem("ShowNoteActive", "")
        //$window.history.back();
        $location.url(sessionStorage.getItem('HomeScreen'));
    }

    //get Category name on category id for showing in grid of post loss itemd
    function GetCategoryOrSubCategoryOnId(OpertionFlag, id) {
        if (id !== null && angular.isDefined(id)) {
            if (OpertionFlag) {
                var list = $filter('filter')($scope.DdlSourceCategoryList, { categoryId: id });
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

    $scope.GetCategory = GetCategory;
    function GetCategory() {
        var getpromise = ThirdPartyClaimDetailsService.getCategories();
        getpromise.then(function (success) {
            $scope.DdlSourceCategoryList = success.data.data;
        }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });
    }

    //Lost Damage Items 
    $scope.DeletItem = DeletItem;
    function DeletItem(obj) {
        var DeleteItemMessage = "Are you sure you want to delete <b>item # " + obj.claimItem.itemUID + "</b> (" + obj.claimItem.description + ")";
        bootbox.confirm({
            size: "",
            title: $translate.instant('Confirm.DeleteItemTitle'),
            message: $translate.instant(DeleteItemMessage), closeButton: false,
            className: "modalcustom", buttons: {
                confirm: {
                    label: $translate.instant('Confirm.BtnYes'),
                    className: 'btn-success'
                },
                cancel: {
                    label: $translate.instant('Confirm.BtnNo'),
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
               
                if (result) {
                    $(".page-spinner-bar").removeClass("hide");
                    var paramId = {
                        "registrationNumber": sessionStorage.getItem("CompanyCRN"),
                        "itemUID": obj.claimItem.itemUID
                    };
                    var response = ThirdPartyClaimDetailsService.DeleteLostDamageItem(paramId);
                    response.then(function (success) { //Filter list and remove item   
                        toastr.remove();
                        toastr.success(success.data.message, "Confirmation");
                        GetPostLostItems();
                        $(".page-spinner-bar").addClass("hide");
                    }, function (error) {
                        toastr.remove();
                        toastr.error(error.data.errorMessage, "Error");
                        $(".page-spinner-bar").addClass("hide");
                    });
                }
            }
        });
    }

    $scope.EditItemDetails = function (item) {
        $scope.AddNewItem = false;
        $scope.EditItem = false;
        $scope.ItemFiles = [];
        $scope.EditItemFiles = [];

        if ($scope.EditItemFiles == null || $scope.EditItemFiles.length == 0) {
            angular.forEach(item.claimItem.attachments, function (attachment) {
                $scope.EditItemFiles.push({ "FileName": attachment.name, "url": attachment.url })
            });
        }
        $scope.selected = {};
        $scope.selected = angular.copy(item.claimItem);
        $scope.selected.category.aggregateLimit = $scope.selected.categoryLimit;

        $scope.selected.appraisalDate = ((angular.isDefined($scope.selected.appraisalDate) && $scope.selected.appraisalDate !== null && $scope.selected.appraisalDate != "") ? $filter('DateFormatMMddyyyy')($scope.selected.appraisalDate) : null);
        $scope.OriginalPostLossIndex = $scope.FiletrLostDamageList.indexOf(item);
        $scope.OriginalPostLossItem = angular.copy(item);

        if ($scope.CommonObj.ClaimProfile == 'Contents') {
            $scope.GetCategory();
            $scope.GetSubCategory();
        }

        //$scope.EditItemFiles = item.claimItem.attachments;
    };
})
