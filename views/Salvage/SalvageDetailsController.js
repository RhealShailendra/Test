angular.module('MetronicApp').controller('SalvageDetailsController', function ($rootScope, $scope, settings, $location, $translate, $translatePartialLoader,
$filter, AuthHeaderService, SalvageService, $uibModal) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });

    //set language
    $translatePartialLoader.addPart('SalvageDetails');
    $translate.refresh();
    $scope.PackingSlipList = [];
    $scope.UserName = sessionStorage.getItem("UserLastName") + ", " + sessionStorage.getItem("UserFirstName")
    $scope.PaymentTerms;
    $scope.Attachments = [];
    $scope.polishList = [];
    $scope.symmetryList = [];
    $scope.fluorescenceList = [];
    $scope.MetalTypeList = [];
    $scope.MetalColorList = [];
    $scope.StoneTypeList = [];
    $scope.StoneColorList == [];
    $scope.StoneShapeList = [];
    $scope.StoneClarityList = [];
    $scope.attachmentListSalvage = [];
    $scope.salvageMainStone = [];
    $scope.subItem = '1'; //{"id":1,"name":"Diamond"},{"id":2,"name":"Gemstone"},{"id":3,"name":"Watch"},{"id":4,"name":"Finished Jewelry"}
    $scope.currentDate = $filter("date")(Date.now(), 'MM/dd/yyyy');//current Date   
    $scope.itemSalvageDetails = {
        salvageProfile: { id: 1 },
        "metalDetails": {
            "weight": "0",
            "totalPrice": "0",
            "netPrice": "0",
            "spotPrice": "0",
            "contracted": "0",
            "date": $scope.currentDate,
            "metalType": {
                "id": null,
                "type": null
            },
        },
        "salvageCustomerBuyBackDetails": {
            "salvageValue": "",
            "commissionRate": "",
            "shippingFee": "",
            "evaluationFee": "",
            "buyBackPrice": ""
        },
        "sellingRateDetails": {
            "id": null,
            "soldPrice": "0",
            "dateOfSale": $scope.currentDate,
            "soldTo": "",
            "commissionRate": "0",
            "subTotal": "0",
            "certReCutShipFee": "0",
            "netPrice": "0",
            "billingStatus": {
                "id": null
            }
        },
        "salvageTotal": "0",
        "billingDetails": {
            "checkAmount": "",
            "checkNumber": "",
            "datePaid": $scope.currentDate,
            "id": null,
            "status": {
                "id": null
            }
        },
        "relacementDetails": {
            "description": "",
            "replacementQuote": 0,
            "appraisalValue": 0,
            "scheduledValue": 0
        },
    };
    
    function init() {
        //$scope.SoftwareEstimate = { PreEstimate: 0, totalPrice: 0 };
        GetPolicyHolderDetails();
        GetDropDownList();
        GetSalvageProfile();
        GetSalvageDetails();
    }
    init();

    $scope.ChangeProfile = ChangeProfile;
    function ChangeProfile() {
        $scope.itemSalvageDetails.salvageId = null;
        //$scope.attachmentListSalvage = [];
        angular.forEach($scope.SalvageProfileList, function (item) {
            if (item.id == $scope.itemSalvageDetails.salvageProfile.id) {
                $scope.subItem = item.id;
            }
        })
            
        //Diamond
        if ($scope.subItem == "1") {
            $scope.itemSalvageDetails = {
                salvageProfile: { id: 1 },
                "metalDetails": {
                    "weight": "0",
                    "totalPrice": "0",
                    "netPrice": "0",
                    "spotPrice": "0",
                    "contracted": "0",
                    "date": $scope.currentDate,
                    "metalType": {
                        "id": null,
                        "type": null
                    },
                },
                "salvageCustomerBuyBackDetails": {
                    "salvageValue": "",
                    "commissionRate": "",
                    "shippingFee": "",
                    "evaluationFee": "",
                    "buyBackPrice": ""
                },
                "sellingRateDetails": {
                    "id": null,
                    "soldPrice": "0",
                    "dateOfSale": $scope.currentDate,
                    "soldTo": "",
                    "commissionRate": "0",
                    "subTotal": "0",
                    "certReCutShipFee": "0",
                    "netPrice": "0",
                    "billingStatus": {
                        "id": null
                    }
                },
                "salvageTotal": "0",
                "billingDetails": {
                    "checkAmount": "",
                    "checkNumber": "",
                    "datePaid": $scope.currentDate,
                    "id": null,
                    "status": {
                        "id": null
                    }
                },
                "relacementDetails": {
                    "description": "",
                    "replacementQuote": 0,
                    "appraisalValue": 0,
                    "scheduledValue": 0
                },
                }
            }
        //Gemstone
        if ($scope.subItem == "2") {
            $scope.itemSalvageDetails = {
                salvageProfile: { id: 2 },
                "metalDetails": {
                    "weight": "0",
                    "totalPrice": "0",
                    "netPrice": "0",
                    "spotPrice": "0",
                    "contracted": "0",
                    "date": $scope.currentDate,
                    "metalType": {
                        "id": null,
                        "type": null
                    },
                },
                "salvageCustomerBuyBackDetails": {
                    "salvageValue": "",
                    "commissionRate": "",
                    "shippingFee": "",
                    "evaluationFee": "",
                    "buyBackPrice": ""
                },
                "sellingRateDetails": {
                    "id": null,
                    "soldPrice": "0",
                    "dateOfSale": $scope.currentDate,
                    "soldTo": "",
                    "commissionRate": "0",
                    "subTotal": "0",
                    "certReCutShipFee": "0",
                    "netPrice": "0",
                    "billingStatus": {
                        "id": null
                    }
                },
                "billingDetails": {
                    "checkAmount": "",
                    "checkNumber": "",
                    "datePaid": ""
                },
                "salvageTotal": "0",
                "salvageBidsDetails": [
                    {
                        "date": $scope.currentDate,
                        "vendor": {
                            "vendorId": sessionStorage.getItem("VendorId")
                        },
                        "bidValue": ""
                    },
                    {
                        "date": $scope.currentDate,
                        "vendor": {
                            "vendorId": sessionStorage.getItem("VendorId")
                        },
                        "bidValue": ""
                    },
                    {
                        "date": $scope.currentDate,
                        "vendor": {
                            "vendorId": sessionStorage.getItem("VendorId")
                        },
                        "bidValue": ""
                    }
                ],
                "relacementDetails": {
                "description": "",
                "replacementQuote": 0,
                "appraisalValue": 0,
                "scheduledValue": 0
            },
            };
        };
        //Watch
        if ($scope.subItem == "3") {
            $scope.itemSalvageDetails = {
                salvageProfile: { id: 3 },
                "id": null,
                "itemEvaluationDetails": null,
                "sellingRateDetails": {
                    "id": null,
                    "soldPrice": "0",
                    "dateOfSale": $scope.currentDate,
                    "soldTo": "",
                    "commissionRate": "0",
                    "subTotal": "0",
                    "certReCutShipFee": "0",
                    "netPrice": "0",
                    "billingStatus": {
                        "id": null
                    }
                },
                "billingDetails": {
                    "checkAmount": "",
                    "checkNumber": "",
                    "datePaid": ""
                },
                "salvageCustomerBuyBackDetails": {
                    "id": null,
                    "salvageValue": "",
                    "commissionRate": "",
                    "shippingFee": "",
                    "evaluationFee": "",
                    "buyBackPrice": ""
                },
                "salvageBidsDetails": [
                     {
                         "date": $scope.currentDate,
                         "vendor": {
                             "vendorId": sessionStorage.getItem("VendorId")
                         },
                         "bidValue": "0"
                     },
                     {
                         "date": $scope.currentDate,
                         "vendor": {
                             "vendorId": sessionStorage.getItem("VendorId")
                         },
                         "bidValue": "0"
                     },
                     {
                         "date": $scope.currentDate,
                         "vendor": {
                             "vendorId": sessionStorage.getItem("VendorId")
                         },
                         "bidValue": "0"
                     }
                ],
                "salvageEstimate": null,
                "statusDTO": null,
                "salvageDiamondStones": null,
                "salvageItemFinished": null,
                "estimateDetail": {
                    "id": null,
                    "estimatedSalvageValue": "0",
                    "repairs": "0",
                    "expenses": "0",
                    "netProceeds": "0"
                },
                "metalDetails": {
                    "id": null,
                    "metalType": {
                        "id": null,
                        "type": null
                    },
                    "weight": "0",
                    "totalPrice": "0",
                    "netPrice": "0",
                    "spotPrice": "0",
                    "contracted": "0",
                    "date": $scope.currentDate,
                    "salvageItemDetails": null
                },
                "salvageTotal": "0",
                "updateDate": null,
                "explanation": null,
                "otherSalvageValue": null,
                "relacementDetails": {
                    "id": null,
                    "description": "",
                    "replacementQuote": "0",
                    "appraisalValue": "0",
                    "scheduledValue": "0"
                },
                "enable": null,
                "registrationNumber": null
            }
        };
        //Finished Jewelry
        if ($scope.subItem == "4") {
            $scope.FinishedJewelryItemList = [{
                id: null,
                number: 1,
                "mainStone": [],
                "salvageEstimate": [],
                Replacemet_Quoted: [],
            }];
            $scope.itemSalvageDetails = {
                salvageProfile: { id: 4 },
                "metalDetails": {
                    "weight": "0",
                    "totalPrice": "0",
                    "netPrice": "0",
                    "spotPrice": "0",
                    "contracted": "0",
                    "date": $scope.currentDate,
                    "metalType": {
                        "id": null,
                        "type": null
                    },
                },
                "salvageCustomerBuyBackDetails": {
                    "salvageValue": "",
                    "commissionRate": "",
                    "shippingFee": "",
                    "evaluationFee": "",
                    "buyBackPrice": ""
                },
                "sellingRateDetails": {
                    "id": null,
                    "soldPrice": "0",
                    "dateOfSale": $scope.currentDate,
                    "soldTo": "",
                    "commissionRate": "0",
                    "subTotal": "0",
                    "certReCutShipFee": "0",
                    "netPrice": "0",
                    "billingStatus": {
                        "id": null
                    }
                },
                "salvageTotal": "0",
                "billingDetails": {
                    "checkAmount": "",
                    "checkNumber": "",
                    "datePaid": ""
                },
                "relacementDetails": {
                    "description": "",
                    "replacementQuote": 0,
                    "appraisalValue": 0,
                    "scheduledValue": 0
                },
            }
        }
    }

    $scope.GetPolicyHolderDetails = GetPolicyHolderDetails;
    function GetPolicyHolderDetails() {
        param_PolicyHolder =
            {
                "policyNumber": null,
                "claimNumber": $scope.CommonObj.ClaimNumber
            };

        var getDetails = SalvageService.GetPolicyHolderDetails(param_PolicyHolder);
        getDetails.then(function (success) {
            $scope.PolicyholderDetails = success.data.data;
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
    };

    $scope.GetSalvageProfile = GetSalvageProfile;
    function GetSalvageProfile() {
        var GetSalvageProfileDetails = SalvageService.GetSalvageProfile();
        GetSalvageProfileDetails.then(function (success) {
            $scope.SalvageProfileList = success.data.data;
            //$scope.itemSalvageDetails.salvageProfile.id = 2;
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            toastr.remove();
            if (angular.isDefined(error.data.errorMessage) && error.data.errorMessage != null) {
                toastr.error(error.data.errorMessage, "Error");
            }
            else {
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error");
            }
            $(".page-spinner-bar").addClass("hide");
        });
    }

    $scope.GetDropDownList = GetDropDownList;
    function GetDropDownList() {
        var param = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

        var getDetails = SalvageService.GetDropDownDetails(param);
        getDetails.then(function (success) {
            $scope.DropDownList = success.data.data;
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            toastr.remove();
            if (error.data.errorMessage != null && angular.isDefined(error.data.errorMessage)) {
                toastr.error(error.data.errorMessage, "Error")
            }
            else {
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error")
            }
            $(".page-spinner-bar").addClass("hide");
        });
    }

    $scope.StornType = StoneType;
    function StoneType() {
        var GetStoneTypeList = SalvageService.GetStoneTypeList();
        GetStoneTypeList.then(function (success) {
            $scope.StoneTypeList = success.data.data;
        }, function (error) {
            toastr.remove();
            if (angular.isDefined(error.data.errorMessage) && error.data.errorMessage != null) {
                toastr.error(error.data.errorMessage, "Error");
            }
            else {
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error");
            }
        });
    }

    //File Upload for attachment
    $scope.AddAttachmentSalvage = function () {
        angular.element('#FileUploadSalvage').trigger('click');
    }

    $scope.getAttachmentDetailsSalvage = getAttachmentDetailsSalvage;
    function getAttachmentDetailsSalvage(e) {
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
            $scope.attachmentListSalvage.push({
                "FileName": e.target.fileName, "FileExtension": e.target.fileExtension, "FileType": e.target.fileType,
                "Image": e.target.result, "File": e.target.file, "url": null, "imageId": null
            });
        });
    }
    $scope.RemoveAttachmentSalvage = RemoveAttachmentSalvage;
    function RemoveAttachmentSalvage(index) {
        if ($scope.attachmentListSalvage.length > 0) {
            $scope.attachmentListSalvage.splice(index, 1);
        }
    };

    $scope.NewStoneItem = false;
    $scope.selectedStone = {};
    $scope.StoneList = [];
    $scope.getTemplateSalvageStone = function (item) {
        if (!angular.isUndefined(item)) {
            if (item.stoneUID === $scope.selectedStone.stoneUID)
                return 'editSalvageStone';
            else
                return 'displaySalvageStone';
        }
        else
            return 'editSalvageStone';
    };
    $scope.addRemoveStoneItem = addRemoveStoneItem;
    function addRemoveStoneItem(operationFlag, operationType) {
        if (operationFlag == 1 && operationType == "Add") {
            $scope.StoneList.push({
                //id: $scope.selectedStone.id,
                stoneUID: $scope.selectedStone.stoneUID,
                stoneType: {
                    id: $scope.selectedStone.stoneType.id,
                    name: $scope.getStoneTypeName($scope.selectedStone.stoneType.id)
                },
                individualWeight: $scope.selectedStone.individualWeight,
                quantity: $scope.selectedStone.quantity,
                totalCaratWeight: $scope.selectedStone.totalCaratWeight,
                pricePerCarat: $scope.selectedStone.pricePerCarat,
                totalPrice: $scope.selectedStone.totalPrice,
            });
            $scope.NewStoneItem = false;
            $scope.GetTotalPrice();

        }
        else if (operationType == "Edit") {
            //$scope.OrderLbourCharges_ItemList[operationFlag]($scope.selectedLbourCharges);
            $scope.StoneList[operationFlag] = {
                id: $scope.selectedStone.id,
                stoneUID: $scope.selectedStone.stoneUID,
                stoneType: {
                    id: $scope.selectedStone.stoneType.id,
                    name: $scope.getStoneTypeName($scope.selectedStone.stoneType.id)
                },
                individualWeight: $scope.selectedStone.individualWeight,
                quantity: $scope.selectedStone.quantity,
                totalCaratWeight: $scope.selectedStone.totalCaratWeight,
                pricePerCarat: $scope.selectedStone.pricePerCarat,
                totalPrice: $scope.selectedStone.totalPrice,
            };
            $scope.GetTotalPrice();
        }
        else if (operationType == "Remove") {

            $scope.StoneList.splice(operationFlag, 1);
            $scope.GetTotalPrice();
        }
        else if (operationType == "Cancel") {
            $scope.selectedStone = {};
            $scope.NewStoneItem = false;
        }
        $scope.selectedStone = {};
        calculateSalvageTotalLuxuryWatch();
    };

    $scope.getStoneTypeName = getStoneTypeName;
    function getStoneTypeName(id) {
        var name = "";
        angular.forEach($scope.DropDownList.stoneType, function (item) {
            if (item.id == id) {
                name = item.name;
            }
        });
        return name;
    }
    $scope.AddNewStoneItem = AddNewStoneItem;
    function AddNewStoneItem() {
        $scope.selectedStone = {};
        $scope.NewStoneItem = true;
        // $scope.EditPaymentTerm = false;
    };

    $scope.EditSalvageStoneItem = EditSalvageStoneItem;
    function EditSalvageStoneItem(item) {
        $scope.selectedStone = angular.copy(item);
    };
    $scope.GetTotalPrice = GetTotalPrice;
    function GetTotalPrice() {
        if (angular.isDefined($scope.selectedStone)) {
            $scope.selectedStone.totalPrice = parseFloat($scope.selectedStone.totalCaratWeight) * parseFloat($scope.selectedStone.pricePerCarat);
        }
    };

    $scope.SaveGemstoneSalvage = SaveGemstoneSalvage;
    function SaveGemstoneSalvage() {
        $(".page-spinner-bar").removeClass("hide");
        if (angular.isDefined($scope.itemSalvageDetails.id) && $scope.itemSalvageDetails.id != null) {
            //update
            var data = new FormData();
            var TempadditionalStoneDetailsGemstone = [];
            if ($scope.additionalStoneDetailsGemstone.length > 0) {
                angular.forEach($scope.additionalStoneDetailsGemstone, function (item) {
                    if (item.id) {
                        TempadditionalStoneDetailsGemstone.push({
                            //"id": angular.isDefined(item.id) ? item.id : null,
                            "additionalStoneUID": item.stoneUID,
                            "stoneType": {
                                "id": item.stoneType.id,
                            },
                            "individualWeight": item.individualWeight,
                            "quantity": item.quantity,
                            "totalCaratWeight": item.totalCaratWeight,
                            "pricePerCarat": item.pricePerCarat,
                            "totalPrice": item.totalPrice
                        });
                    } else {
                        TempadditionalStoneDetailsGemstone.push({
                            //"id": angular.isDefined(item.id) ? item.id : null,
                            //"additionalStoneUID": item.stoneUID,
                            "stoneType": {
                                "id": item.stoneType.id,
                            },
                            "individualWeight": item.individualWeight,
                            "quantity": item.quantity,
                            "totalCaratWeight": item.totalCaratWeight,
                            "pricePerCarat": item.pricePerCarat,
                            "totalPrice": item.totalPrice
                        });
                    }

                });
            } else {
                TempadditionalStoneDetailsGemstone = null;
            }
            var TempSalvageBidDetails = [];
            if ($scope.itemSalvageDetails.salvageBidsDetails.length > 0) {
                angular.forEach($scope.itemSalvageDetails.salvageBidsDetails, function (item) {
                    TempSalvageBidDetails.push({
                        "bidsUID": item.bidsUID,
                        "date": $filter('DatabaseDateFormatMMddyyyy')(item.date),
                        "vendorName": item.vendorName,
                        "vendor": null,
                        "bidValue": item.bidValue
                    })
                })
            }

            var TempsalvageDiamondStones = [];
            if ($scope.salvageDiamondStones.length > 0) {
                angular.forEach($scope.salvageDiamondStones, function (item) {
                    TempsalvageDiamondStones.push({
                        "stoneUID": item.stoneUID,
                        "originalStone": {
                            "id": angular.isUndefined(item.originalStone.id) ? null : item.originalStone.id,
                            "originalStoneUID": angular.isUndefined(item.originalStone.originalStoneUID) ? null : item.originalStone.originalStoneUID,
                            "shape": {
                                "id": angular.isUndefined(item.originalStone.shape) || item.originalStone.shape == null ? null : angular.isUndefined(item.originalStone.shape.id) ? null : item.originalStone.shape.id
                            },
                            "stoneType": {
                                "id": angular.isUndefined(item.originalStone.stoneType) || item.originalStone.stoneType == null ? null : angular.isUndefined(item.originalStone.stoneType.id) ? null : item.originalStone.stoneType.id
                            },
                            "stoneQuality": {
                                "id": angular.isUndefined(item.originalStone.stoneQuality) || item.originalStone.stoneQuality == null ? null : angular.isUndefined(item.originalStone.stoneQuality.id) ? null : item.originalStone.stoneQuality.id
                            },
                            "weight": angular.isUndefined(item.originalStone.weight) || item.originalStone.shape == null ? null : item.originalStone.weight,
                            "color": {
                                "id": angular.isUndefined(item.originalStone.color) || item.originalStone.color == null ? null : angular.isUndefined(item.originalStone.color.id) ? null : item.originalStone.color.id
                            },
                            "clarity": {
                                "id": angular.isUndefined(item.originalStone.clarity) || item.originalStone.clarity == null ? null : angular.isUndefined(item.originalStone.clarity.id) ? null : item.originalStone.clarity.id
                            },
                            "diameter": angular.isUndefined(item.originalStone.diameter) ? null : item.originalStone.diameter,
                            "depth": angular.isUndefined(item.originalStone.depth) ? null : item.originalStone.depth,
                            "length": angular.isUndefined(item.originalStone.length) ? null : item.originalStone.length,
                            "width": angular.isUndefined(item.originalStone.width) ? null : item.originalStone.width,
                            "cutGrade": {
                                "id": angular.isUndefined(item.originalStone.cutGrade) || item.originalStone.cutGrade == null ? null : angular.isUndefined(item.originalStone.cutGrade.id) ? null : item.originalStone.cutGrade.id
                            },
                            "flouresence": {
                                "id": angular.isUndefined(item.originalStone.flouresence) || item.originalStone.flouresence == null ? null : angular.isUndefined(item.originalStone.flouresence.id) ? null : item.originalStone.flouresence.id
                            }, 
                            "certificateType": {
                                "id": angular.isUndefined(item.originalStone.certificateType) || item.originalStone.certificateType == null ? null : angular.isUndefined(item.originalStone.certificateType.id) ? null : item.originalStone.certificateType.id
                            }
                        },
                        "estimateBeforeRepair": {
                            "id": angular.isUndefined(item.estimateBeforeRepair.id) ? null : item.estimateBeforeRepair.id,
                            "estimateStoneUID": angular.isUndefined(item.estimateBeforeRepair.estimateStoneUID) ? null : item.estimateBeforeRepair.estimateStoneUID,
                            "shape": {
                                "id": angular.isUndefined(item.estimateBeforeRepair.shape) || item.estimateBeforeRepair.shape==null ? null : angular.isUndefined(item.estimateBeforeRepair.shape.id) ? null : item.estimateBeforeRepair.shape.id
                            },
                            "weight": angular.isUndefined(item.estimateBeforeRepair.weight) ? null : item.estimateBeforeRepair.weight,
                            "estWeightLoss": angular.isUndefined(item.estimateBeforeRepair.estWeightLoss) ? null : item.estimateBeforeRepair.estWeightLoss,
                            "estFinishWeight": angular.isUndefined(item.estimateBeforeRepair.estFinishWeight) ? null : item.estimateBeforeRepair.estFinishWeight,
                            "estColor": {
                                "id": angular.isUndefined(item.estimateBeforeRepair.estColor) || item.estimateBeforeRepair.estColor == null ? null : angular.isUndefined(item.estimateBeforeRepair.estColor.id) ? null : item.estimateBeforeRepair.estColor.id
                            },
                            "estClarity": {
                                "id": angular.isUndefined(item.estimateBeforeRepair.estClarity) || item.estimateBeforeRepair.estClarity == null ? null : angular.isUndefined(item.estimateBeforeRepair.estClarity.id) ? null : item.estimateBeforeRepair.estClarity.id
                            },
                            "cutGrade": {
                                "id": angular.isUndefined(item.estimateBeforeRepair.cutGrade) || item.estimateBeforeRepair.cutGrade == null ? null : angular.isUndefined(item.estimateBeforeRepair.cutGrade.id) ? null : item.estimateBeforeRepair.cutGrade.id
                            },
                            "flouresence": {
                                "id": angular.isUndefined(item.estimateBeforeRepair.flouresence) || item.estimateBeforeRepair.flouresence == null ? null : angular.isUndefined(item.estimateBeforeRepair.flouresence.id) ? null : item.estimateBeforeRepair.flouresence.id
                            },
                            "rapPricePC": angular.isUndefined(item.estimateBeforeRepair.rapPricePC) ? null : item.estimateBeforeRepair.rapPricePC,
                            "stonePrice": angular.isUndefined(item.estimateBeforeRepair.stonePrice) ? null : item.estimateBeforeRepair.stonePrice,
                            "marketAdjustment": angular.isUndefined(item.estimateBeforeRepair.marketAdjustment) ? null : item.estimateBeforeRepair.marketAdjustment,
                            "subTotal": angular.isUndefined(item.estimateBeforeRepair.subTotal) ? null : item.estimateBeforeRepair.subTotal,
                            "wholeSaleBuyerAdj": angular.isUndefined(item.estimateBeforeRepair.wholeSaleBuyerAdj) ? null : item.estimateBeforeRepair.wholeSaleBuyerAdj,
                            "salvageValue": angular.isUndefined(item.estimateBeforeRepair.salvageValue) ? null : item.estimateBeforeRepair.salvageValue,
                            "cuttingCharge": angular.isUndefined(item.estimateBeforeRepair.cuttingCharge) ? null : item.estimateBeforeRepair.cuttingCharge,
                            "certificateType": {
                                "id": angular.isUndefined(item.estimateBeforeRepair.certificateType) || item.estimateBeforeRepair.certificateType == null ? null : angular.isUndefined(item.estimateBeforeRepair.certificateType.id) ? null : item.estimateBeforeRepair.certificateType.id
                            },
                            "certFee": angular.isUndefined(item.estimateBeforeRepair.certFee) ? null : item.estimateBeforeRepair.certFee,
                            "shippingCost": angular.isUndefined(item.estimateBeforeRepair.shippingCost) ? null : item.estimateBeforeRepair.shippingCost,
                            "net": angular.isUndefined(item.estimateBeforeRepair.net) ? null : item.estimateBeforeRepair.net
                        },
                        "actualAfterRepair": {
                            "id": angular.isUndefined(item.actualAfterRepair.id) ? null : item.actualAfterRepair.id,
                            "actualStoneUID": angular.isUndefined(item.actualAfterRepair.actualStoneUID) ? null : item.actualAfterRepair.actualStoneUID,
                            "shape": {
                                "id": angular.isUndefined(item.actualAfterRepair.shape) || item.actualAfterRepair.shape==null ? null : angular.isUndefined(item.actualAfterRepair.shape.id) ? null : item.actualAfterRepair.shape.id
                            },
                            "stoneQuality": {
                                "id": angular.isUndefined(item.actualAfterRepair.stoneQuality) || item.actualAfterRepair.stoneQuality == null ? null : angular.isUndefined(item.actualAfterRepair.stoneQuality.id) ? null : item.actualAfterRepair.stoneQuality.id
                            },
                            "weight": angular.isUndefined(item.actualAfterRepair.weight) ? null : item.actualAfterRepair.weight,
                            "color": {
                                "id": angular.isUndefined(item.actualAfterRepair.color) || item.actualAfterRepair.color == null ? null : angular.isUndefined(item.actualAfterRepair.color.id) ? null : item.actualAfterRepair.color.id
                            },
                            "clarity": {
                                "id": angular.isUndefined(item.actualAfterRepair.clarity) || item.actualAfterRepair.clarity == null ? null : angular.isUndefined(item.actualAfterRepair.clarity.id) ? null : item.actualAfterRepair.clarity.id
                            },
                            "cutGrade": {
                                "id": angular.isUndefined(item.actualAfterRepair.cutGrade) || item.actualAfterRepair.cutGrade == null ? null : angular.isUndefined(item.actualAfterRepair.cutGrade.id) ? null : item.actualAfterRepair.cutGrade.id
                            },
                            "flouresence": {
                                "id": angular.isUndefined(item.actualAfterRepair.flouresence) || item.actualAfterRepair.flouresence == null ? null : angular.isUndefined(item.actualAfterRepair.flouresence.id) ? null : item.actualAfterRepair.flouresence.id
                            },
                            "depth": angular.isUndefined(item.actualAfterRepair.depth) ? null : item.actualAfterRepair.depth,
                            "table": angular.isUndefined(item.actualAfterRepair.table) ? null : item.actualAfterRepair.table,
                            "polish": {
                                "id": angular.isUndefined(item.actualAfterRepair.polish) || item.actualAfterRepair.polish == null ? null : angular.isUndefined(item.actualAfterRepair.polish.id) ? null : item.actualAfterRepair.polish.id
                            },
                            "symmetry": {
                                "id": angular.isUndefined(item.actualAfterRepair.symmetry) || item.actualAfterRepair.symmetry == null ? null : angular.isUndefined(item.actualAfterRepair.symmetry.id) ? null : item.actualAfterRepair.symmetry.id
                            },
                            "rapPricePC": angular.isUndefined(item.actualAfterRepair.rapPricePC) ? null : item.actualAfterRepair.rapPricePC,
                            "stonePrice": angular.isUndefined(item.actualAfterRepair.stonePrice) ? null : item.actualAfterRepair.stonePrice,
                            "marketAdjustment": angular.isUndefined(item.actualAfterRepair.marketAdjustment) ? null : item.actualAfterRepair.marketAdjustment,
                            "subTotal": angular.isUndefined(item.actualAfterRepair.subTotal) ? null : item.actualAfterRepair.subTotal,
                            "wholesaleBuyerAdj": angular.isUndefined(item.actualAfterRepair.wholesaleBuyerAdj) ? null : item.actualAfterRepair.wholesaleBuyerAdj,
                            "salvageValue": angular.isUndefined(item.actualAfterRepair.salvageValue) ? null : item.actualAfterRepair.salvageValue,
                            "cuttingCharge": angular.isUndefined(item.actualAfterRepair.cuttingCharge) ? null : item.actualAfterRepair.cuttingCharge,
                            "certificateType": {
                                "id": angular.isUndefined(item.actualAfterRepair.certificateType) || item.actualAfterRepair.certificateType == null ? null : angular.isUndefined(item.actualAfterRepair.certificateType.id) ? null : item.actualAfterRepair.certificateType.id
                            },
                            "certFee": angular.isUndefined(item.actualAfterRepair.certFee) ? null : item.actualAfterRepair.certFee,
                            "shippingFee": angular.isUndefined(item.actualAfterRepair.shippingFee) ? null : item.actualAfterRepair.shippingFee,
                            "netProcessds": angular.isUndefined(item.actualAfterRepair.netProcessds) ? null : item.actualAfterRepair.netProcessds,
                        },
                        "replacementQuoted":null
                        //    {
                        //    "id": angular.isUndefined(item.replacementQuoted.id) ? null : item.replacementQuoted.id,
                        //    "replacementStoneUID": angular.isUndefined(item.replacementQuoted.replacementStoneUID) ? null : item.replacementQuoted.replacementStoneUID,
                        //    "description": angular.isUndefined(item.replacementQuoted.description) ? null : item.replacementQuoted.description,
                        //    "replacementQuote": angular.isUndefined(item.replacementQuoted.replacementQuote) ? null : item.replacementQuoted.replacementQuote,
                        //    "appraisalValue": angular.isUndefined(item.replacementQuoted.appraisalValue) ? null : item.replacementQuoted.appraisalValue,
                        //    "scheduledValue": angular.isUndefined(item.replacementQuoted.scheduledValue) ? null : item.replacementQuoted.scheduledValue
                        //}
                    });
                })
            }

            $scope.filesDetails = [];
            angular.forEach($scope.attachmentListSalvage, function (ItemFile) {
                if (angular.isUndefined(ItemFile.imageId) || ItemFile.imageId == null)
                {
                    $scope.filesDetails.push({
                        "fileType": ItemFile.FileType,
                        "fileName": ItemFile.FileName,
                        "extension": ItemFile.FileExtension,
                        "filePurpose": "ITEM_SALVAGE_DETAILS",
                        "latitude": null,
                        "longitude": null
                    });
                    data.append('files', ItemFile.File);
                }
            });

            if ($scope.attachmentListSalvage.length == 0 || $scope.attachmentListSalvage == null) {
                data.append('filesDetails', null);
                data.append('files', null);
            } else {
                data.append('filesDetails', JSON.stringify($scope.filesDetails));
            }
            var Param = {
                "salvageId": angular.isUndefined($scope.itemSalvageDetails.salvageId) ? null : $scope.itemSalvageDetails.salvageId,
                "adjusterDescription": $scope.itemSalvageDetails.adjusterDescription,
                "gemLabDescription": $scope.itemSalvageDetails.gemLabDescription,
                "salvageDate": $filter('DatabaseDateFormatMMddyyyy')($scope.currentDate),
                "explanation": angular.isUndefined($scope.itemSalvageDetails.explanation) ? null : ($scope.itemSalvageDetails.explanation),
                "cuttersDate": $filter('DatabaseDateFormatMMddyyyy')($scope.itemSalvageDetails.cuttersDate),
                "giaDate": $filter('DatabaseDateFormatMMddyyyy')($scope.itemSalvageDetails.giaDate),
                "salvageItemStatus": {
                    "id": angular.isUndefined($scope.itemSalvageDetails.salvageItemStatus) || $scope.itemSalvageDetails.salvageItemStatus==null ? null : angular.isUndefined($scope.itemSalvageDetails.salvageItemStatus.id) ? null : $scope.itemSalvageDetails.salvageItemStatus.id
                },
                "salvageProfile": {
                    "id": $scope.itemSalvageDetails.salvageProfile.id
                },
                "claimItem": {
                    "itemUID": angular.isUndefined($scope.ItemDetails.claimItem) ? $scope.ItemDetails.itemUID : $scope.ItemDetails.claimItem.itemUID
                },
                "sellingRateDetails": {
                    "soldPrice": $scope.itemSalvageDetails.sellingRateDetails.soldPrice,
                    "dateOfSale": $filter('DatabaseDateFormatMMddyyyy')($scope.itemSalvageDetails.sellingRateDetails.dateOfSale),
                    "soldTo": $scope.itemSalvageDetails.sellingRateDetails.soldTo,
                    "commissionRate": $scope.itemSalvageDetails.sellingRateDetails.commissionRate,
                    "subTotal": $scope.itemSalvageDetails.sellingRateDetails.subTotal,
                    "certReCutShipFee": $scope.itemSalvageDetails.sellingRateDetails.certReCutShipFee,
                    "netPrice": $scope.itemSalvageDetails.sellingRateDetails.netPrice,
                    "billingStatus": {
                        "id": angular.isUndefined($scope.itemSalvageDetails.billingStatus) || $scope.itemSalvageDetails.billingStatus == null ? null : angular.isUndefined($scope.itemSalvageDetails.billingStatus.id) ? null : $scope.itemSalvageDetails.billingStatus.id
                    },
                    "soldPrice": $scope.itemSalvageDetails.sellingRateDetails.soldPrice,
                    "soldTo": $scope.itemSalvageDetails.sellingRateDetails.soldTo,
                },
                "billingDetails": {
                    "checkAmount": $scope.itemSalvageDetails.billingDetails.checkAmount,
                    "checkNumber": $scope.itemSalvageDetails.billingDetails.checkNumber,
                    "datePaid": $filter('DatabaseDateFormatMMddyyyy')($scope.itemSalvageDetails.billingDetails.datePaid)
                },
                "salvageCustomerBuyBackDetails": {
                    "salvageValue": $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.salvageValue,
                    "commissionRate": $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.commissionRate,
                    "shippingFee": $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.shippingFee,
                    "evaluationFee": $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.evaluationFee,
                    "buyBackPrice": $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.buyBackPrice
                },
                "salvageBidsDetails": TempSalvageBidDetails,
                "salvageEstimate": null,
                "statusDTO": {
                    "id": angular.isUndefined($scope.itemSalvageDetails.statusDTO) || $scope.itemSalvageDetails.statusDTO == null ? null : $scope.itemSalvageDetails.statusDTO.id
                },
                "companyRegistration": sessionStorage.getItem("CompanyCRN"),
                "salvageTotal": angular.isUndefined($scope.itemSalvageDetails.salvageTotal) || $scope.itemSalvageDetails.salvageTotal == null ? null : $scope.itemSalvageDetails.salvageTotal,
                "salvageDiamondStones": TempsalvageDiamondStones,
                "salvageItemFinished": null,
                "additionalStoneDetails": TempadditionalStoneDetailsGemstone,
                "metalDetails": {
                    "metalType": {
                        "id": angular.isUndefined($scope.itemSalvageDetails.metalDetails.metalType) || $scope.itemSalvageDetails.metalDetails.metalType==null ? null : angular.isUndefined($scope.itemSalvageDetails.metalDetails.metalType.id) ? null : $scope.itemSalvageDetails.metalDetails.metalType.id
                    },
                    "weight": angular.isUndefined($scope.itemSalvageDetails.metalDetails.weight) ? null : $scope.itemSalvageDetails.metalDetails.weight,
                    "totalPrice": angular.isUndefined($scope.itemSalvageDetails.metalDetails.totalPrice) ? null : $scope.itemSalvageDetails.metalDetails.totalPrice,
                    "netPrice": angular.isUndefined($scope.itemSalvageDetails.metalDetails.netPrice) ? null : $scope.itemSalvageDetails.metalDetails.netPrice,
                    "spotPrice": angular.isUndefined($scope.itemSalvageDetails.metalDetails.spotPrice) ? null : $scope.itemSalvageDetails.metalDetails.spotPrice,
                    "contracted": angular.isUndefined($scope.itemSalvageDetails.metalDetails.contracted) ? null : $scope.itemSalvageDetails.metalDetails.contracted,
                    "date": $filter('DatabaseDateFormatMMddyyyy')($scope.itemSalvageDetails.metalDetails.date)
                },
                "relacementDetails": {
                    "id": angular.isUndefined($scope.itemSalvageDetails.relacementDetails) || $scope.itemSalvageDetails.relacementDetails == null ? null : angular.isUndefined($scope.itemSalvageDetails.relacementDetails.id) ? null : $scope.itemSalvageDetails.relacementDetails.id,
                    "description": angular.isUndefined($scope.itemSalvageDetails.relacementDetails) || $scope.itemSalvageDetails.relacementDetails == null ? null : angular.isUndefined($scope.itemSalvageDetails.relacementDetails.description) ? null : $scope.itemSalvageDetails.relacementDetails.description,
                    "replacementQuote": angular.isUndefined($scope.itemSalvageDetails.relacementDetails) || $scope.itemSalvageDetails.relacementDetails == null ? null : angular.isUndefined($scope.itemSalvageDetails.relacementDetails.replacementQuote) ? null : $scope.itemSalvageDetails.relacementDetails.replacementQuote,
                    "appraisalValue": angular.isUndefined($scope.itemSalvageDetails.relacementDetails) || $scope.itemSalvageDetails.relacementDetails == null ? null : angular.isUndefined($scope.itemSalvageDetails.relacementDetails.appraisalValue) ? null : $scope.itemSalvageDetails.relacementDetails.appraisalValue,
                    "scheduledValue": angular.isUndefined($scope.itemSalvageDetails.relacementDetails) || $scope.itemSalvageDetails.relacementDetails == null ? null : angular.isUndefined($scope.itemSalvageDetails.relacementDetails.scheduledValue) ? null : $scope.itemSalvageDetails.relacementDetails.scheduledValue,
                },
                }
            data.append("itemSalvageDetails", JSON.stringify(Param));
            var UpdateSalvage = SalvageService.UpdateGemstone(data);
            UpdateSalvage.then(function (success) {
                toastr.remove();
                $scope.attachmentListSalvage = [];
                //var id = $scope.itemSalvageDetails.id;
                GetSalvageDetails();
                toastr.success(success.data.message, "Confirmation");
                $(".page-spinner-bar").addClass("hide");
            }, function (error) {
                toastr.remove();
                if (error.data.errorMessage != null && angular.isDefined(error.data.errorMessage)) {
                    toastr.error(error.data.errorMessage, "Error")
                }
                else {
                    toastr.error(AuthHeaderService.genericErrorMessage(), "Error")
                }
                $(".page-spinner-bar").addClass("hide");
            });
        }
        else {
            //Add new

            var TempadditionalStoneDetailsGemstone = [];
            if ($scope.additionalStoneDetailsGemstone.length > 0) {
                angular.forEach($scope.additionalStoneDetailsGemstone, function (item) {
                    TempadditionalStoneDetailsGemstone.push({
                        //"id": angular.isDefined(item.id) ? item.id : null,
                        //"stoneUID": item.stoneUID,
                        "stoneType": {
                            "id": item.stoneType.id,
                        },
                        "individualWeight": item.individualWeight,
                        "quantity": item.quantity,
                        "totalCaratWeight": item.totalCaratWeight,
                        "pricePerCarat": item.pricePerCarat,
                        "totalPrice": item.totalPrice
                    });
                });
            } else {
                TempadditionalStoneDetailsGemstone = null;
            }
            var TempSalvageBidDetails = [];
            if ($scope.itemSalvageDetails.salvageBidsDetails.length > 0) {
                angular.forEach($scope.itemSalvageDetails.salvageBidsDetails, function (item) {
                    TempSalvageBidDetails.push({
                        "date": $filter('DatabaseDateFormatMMddyyyy')(item.date),
                        "vendorName": item.vendorName,
                        "vendor": null,
                        "bidValue": item.bidValue
                    })
                })
            }

            var TempsalvageDiamondStones = [];
            if ($scope.salvageDiamondStones.length > 0) {
                angular.forEach($scope.salvageDiamondStones, function (item) {
                    TempsalvageDiamondStones.push({
                        "originalStone": {
                            //"id": angular.isUndefined(item.originalStone.id) ? null : item.originalStone.id,
                            "originalStoneUID": null,
                            "shape": {
                                "id": angular.isUndefined(item.originalStone.shape) || item.originalStone.shape ==null ? null : angular.isUndefined(item.originalStone.shape.id) ? null : item.originalStone.shape.id
                            },
                            "stoneType": {
                                "id": angular.isUndefined(item.originalStone.stoneType) || item.originalStone.stoneType == null ? null : angular.isUndefined(item.originalStone.stoneType.id) ? null : item.originalStone.stoneType.id
                            },
                            "stoneQuality": {
                                "id": angular.isUndefined(item.originalStone.stoneQuality) || item.originalStone.stoneQuality == null ? null : angular.isUndefined(item.originalStone.stoneQuality.id) ? null : item.originalStone.stoneQuality.id
                            },
                            "weight": angular.isUndefined(item.originalStone.weight) ? null : item.originalStone.weight,
                            "color": {
                                "id": angular.isUndefined(item.originalStone.color) || item.originalStone.color == null ? null : angular.isUndefined(item.originalStone.color.id) ? null : item.originalStone.color.id
                            },
                            "clarity": {
                                "id": angular.isUndefined(item.originalStone.clarity) || item.originalStone.clarity == null ? null : angular.isUndefined(item.originalStone.clarity.id) ? null : item.originalStone.clarity.id
                            },
                            "diameter": angular.isUndefined(item.originalStone.diameter) ? null : item.originalStone.diameter,
                            "depth": angular.isUndefined(item.originalStone.depth) ? null : item.originalStone.depth,
                            "length": angular.isUndefined(item.originalStone.length) ? null : item.originalStone.length,
                            "width": angular.isUndefined(item.originalStone.width) ? null : item.originalStone.width,
                            "cutGrade": {
                                "id": angular.isUndefined(item.originalStone.cutGrade) || item.originalStone.cutGrade == null ? null : angular.isUndefined(item.originalStone.cutGrade.id) ? null : item.originalStone.cutGrade.id
                            },
                            "flouresence": {
                                "id": angular.isUndefined(item.originalStone.flouresence) || item.originalStone.flouresence == null ? null : angular.isUndefined(item.originalStone.flouresence.id) ? null : item.originalStone.flouresence.id
                            },
                            "certificateType": {
                                "id": angular.isUndefined(item.originalStone.certificateType) || item.originalStone.certificateType == null ? null : angular.isUndefined(item.originalStone.certificateType.id) ? null : item.originalStone.certificateType.id
                            }
                        },
                        "estimateBeforeRepair": {
                            //"id": angular.isUndefined(item.estimateBeforeRepair.id) ? null : item.estimateBeforeRepair.id,
                            "shape": {
                                "id": angular.isUndefined(item.estimateBeforeRepair.shape) ? null : angular.isUndefined(item.estimateBeforeRepair.shape.id) ? null : item.estimateBeforeRepair.shape.id
                            },
                            "weight": angular.isUndefined(item.estimateBeforeRepair.weight) ? null : item.estimateBeforeRepair.weight,
                            "estWeightLoss": angular.isUndefined(item.estimateBeforeRepair.estWeightLoss) ? null : item.estimateBeforeRepair.estWeightLoss,
                            "estFinishWeight": angular.isUndefined(item.estimateBeforeRepair.estFinishWeight) ? null : item.estimateBeforeRepair.estFinishWeight,
                            "estColor": {
                                "id": angular.isUndefined(item.estimateBeforeRepair.estColor) || item.estimateBeforeRepair.estColor==null ? null : angular.isUndefined(item.estimateBeforeRepair.estColor.id) ? null : item.estimateBeforeRepair.estColor.id
                            },
                            "estClarity": {
                                "id": angular.isUndefined(item.estimateBeforeRepair.estClarity) || item.estimateBeforeRepair.estClarity == null ? null : angular.isUndefined(item.estimateBeforeRepair.estClarity.id) ? null : item.estimateBeforeRepair.estClarity.id
                            },
                            "cutGrade": {
                                "id": angular.isUndefined(item.estimateBeforeRepair.cutGrade) || item.estimateBeforeRepair.cutGrade == null ? null : angular.isUndefined(item.estimateBeforeRepair.cutGrade.id) ? null : item.estimateBeforeRepair.cutGrade.id
                            },
                            "flouresence": {
                                "id": angular.isUndefined(item.estimateBeforeRepair.flouresence) || item.estimateBeforeRepair.flouresence == null ? null : angular.isUndefined(item.estimateBeforeRepair.flouresence.id) ? null : item.estimateBeforeRepair.flouresence.id
                            },
                            "rapPricePC": angular.isUndefined(item.estimateBeforeRepair.rapPricePC) ? null : item.estimateBeforeRepair.rapPricePC,
                            "stonePrice": angular.isUndefined(item.estimateBeforeRepair.stonePrice) ? null : item.estimateBeforeRepair.stonePrice,
                            "marketAdjustment": angular.isUndefined(item.estimateBeforeRepair.marketAdjustment) ? null : item.estimateBeforeRepair.marketAdjustment,
                            "subTotal": angular.isUndefined(item.estimateBeforeRepair.subTotal) ? null : item.estimateBeforeRepair.subTotal,
                            "wholeSaleBuyerAdj": angular.isUndefined(item.estimateBeforeRepair.wholeSaleBuyerAdj) ? null : item.estimateBeforeRepair.wholeSaleBuyerAdj,
                            "salvageValue": angular.isUndefined(item.estimateBeforeRepair.salvageValue) ? null : item.estimateBeforeRepair.salvageValue,
                            "cuttingCharge": angular.isUndefined(item.estimateBeforeRepair.cuttingCharge) ? null : item.estimateBeforeRepair.cuttingCharge,
                            "certificateType": {
                                "id": angular.isUndefined(item.estimateBeforeRepair.certificateType) || item.estimateBeforeRepair.certificateType == null ? null : angular.isUndefined(item.estimateBeforeRepair.certificateType.id) ? null : item.estimateBeforeRepair.certificateType.id
                            },
                            "certFee": angular.isUndefined(item.estimateBeforeRepair.certFee) ? null : item.estimateBeforeRepair.certFee,
                            "shippingCost": angular.isUndefined(item.estimateBeforeRepair.shippingCost) ? null : item.estimateBeforeRepair.shippingCost,
                            "net": angular.isUndefined(item.estimateBeforeRepair.net) ? null : item.estimateBeforeRepair.net
                        },
                        "actualAfterRepair": {
                            //"id": angular.isUndefined(item.actualAfterRepair.id) ? null : item.actualAfterRepair.id,
                            "actualStoneUID": angular.isUndefined(item.actualAfterRepair.actualStoneUID) ? null : item.actualAfterRepair.actualStoneUID,
                            "shape": {
                                "id": angular.isUndefined(item.actualAfterRepair.shape) || item.actualAfterRepair.shape==null ? null : angular.isUndefined(item.actualAfterRepair.shape.id) ? null : item.actualAfterRepair.shape.id
                            },
                            "stoneQuality": {
                                "id": angular.isUndefined(item.actualAfterRepair.stoneQuality) || item.actualAfterRepair.stoneQuality == null ? null : angular.isUndefined(item.actualAfterRepair.stoneQuality.id) ? null : item.actualAfterRepair.stoneQuality.id
                            },
                            "weight": angular.isUndefined(item.actualAfterRepair.weight) ? null : item.actualAfterRepair.weight,
                            "color": {
                                "id": angular.isUndefined(item.actualAfterRepair.color) || item.actualAfterRepair.color == null ? null : angular.isUndefined(item.actualAfterRepair.color.id) ? null : item.actualAfterRepair.color.id
                            },
                            "clarity": {
                                "id": angular.isUndefined(item.actualAfterRepair.clarity) || item.actualAfterRepair.clarity == null ? null : angular.isUndefined(item.actualAfterRepair.clarity.id) ? null : item.actualAfterRepair.clarity.id
                            },
                            "cutGrade": {
                                "id": angular.isUndefined(item.actualAfterRepair.cutGrade) || item.actualAfterRepair.shape == null ? null : angular.isUndefined(item.actualAfterRepair.cutGrade.id) ? null : item.actualAfterRepair.cutGrade.id
                            },
                            "flouresence": {
                                "id": angular.isUndefined(item.actualAfterRepair.flouresence) || item.actualAfterRepair.flouresence == null ? null : angular.isUndefined(item.actualAfterRepair.flouresence.id) ? null : item.actualAfterRepair.flouresence.id
                            },
                            "depth": angular.isUndefined(item.actualAfterRepair.depth) ? null : item.actualAfterRepair.depth,
                            "table": angular.isUndefined(item.actualAfterRepair.table) ? null : item.actualAfterRepair.table,
                            "polish": {
                                "id": angular.isUndefined(item.actualAfterRepair.polish) || item.actualAfterRepair.polish == null ? null : angular.isUndefined(item.actualAfterRepair.polish.id) ? null : item.actualAfterRepair.polish.id
                            },
                            "symmetry": {
                                "id": angular.isUndefined(item.actualAfterRepair.symmetry) || item.actualAfterRepair.symmetry == null ? null : angular.isUndefined(item.actualAfterRepair.symmetry.id) ? null : item.actualAfterRepair.symmetry.id
                            },
                            "rapPricePC": angular.isUndefined(item.actualAfterRepair.rapPricePC) ? null : item.actualAfterRepair.rapPricePC,
                            "stonePrice": angular.isUndefined(item.actualAfterRepair.stonePrice) ? null : item.actualAfterRepair.stonePrice,
                            "marketAdjustment": angular.isUndefined(item.actualAfterRepair.marketAdjustment) ? null : item.actualAfterRepair.marketAdjustment,
                            "subTotal": angular.isUndefined(item.actualAfterRepair.subTotal) ? null : item.actualAfterRepair.subTotal,
                            "wholesaleBuyerAdj": angular.isUndefined(item.actualAfterRepair.wholesaleBuyerAdj) ? null : item.actualAfterRepair.wholesaleBuyerAdj,
                            "salvageValue": angular.isUndefined(item.actualAfterRepair.salvageValue) ? null : item.actualAfterRepair.salvageValue,
                            "cuttingCharge": angular.isUndefined(item.actualAfterRepair.cuttingCharge) ? null : item.actualAfterRepair.cuttingCharge,
                            "certificateType": {
                                "id": angular.isUndefined(item.actualAfterRepair.certificateType) || item.actualAfterRepair.certificateType == null ? null : angular.isUndefined(item.actualAfterRepair.certificateType.id) ? null : item.actualAfterRepair.certificateType.id
                            },
                            "certFee": angular.isUndefined(item.actualAfterRepair.certFee) ? null : item.actualAfterRepair.certFee,
                            "shippingFee": angular.isUndefined(item.actualAfterRepair.shippingFee) ? null : item.actualAfterRepair.shippingFee,
                            "netProcessds": angular.isUndefined(item.actualAfterRepair.netProcessds) ? null : item.actualAfterRepair.netProcessds,
                        },
                        "replacementQuoted":null,
                        //{
                        //    //"id": angular.isUndefined(item.replacementQuoted.id) ? null : item.replacementQuoted.id,
                        //    "description": angular.isUndefined(item.replacementQuoted.description) ? null : item.replacementQuoted.description,
                        //    "replacementQuote": angular.isUndefined(item.replacementQuoted.replacementQuote) ? null : item.replacementQuoted.replacementQuote,
                        //    "appraisalValue": angular.isUndefined(item.replacementQuoted.appraisalValue) ? null : item.replacementQuoted.appraisalValue,
                        //    "scheduledValue": angular.isUndefined(item.replacementQuoted.scheduledValue) ? null : item.replacementQuoted.scheduledValue
                        //}
                    });
                })
            }

            var data = new FormData();
            $scope.filesDetails = [];
            angular.forEach($scope.attachmentListSalvage, function (ItemFile) {
                $scope.filesDetails.push({
                    "fileType": ItemFile.FileType,
                    "fileName": ItemFile.FileName,
                    "extension": ItemFile.FileExtension,
                    "filePurpose": "ITEM_SALVAGE_DETAILS",
                    "latitude": 41.40,
                    "longitude": 2.17
                });
                data.append('files', ItemFile.File);
                //"fileName": ItemFile.FileName, "fileType": ItemFile.FileType, "extension": ItemFile.FileExtension, "filePurpose": "ITEM_SALVAGE_DETAILS", "latitude": null, "longitude": null, "footNote": null
            });

            if ($scope.attachmentListSalvage.length == 0 || $scope.attachmentListSalvage == null) {
                data.append('filesDetails', null);
                data.append('files', null);
            } else {
                data.append('filesDetails', JSON.stringify($scope.filesDetails));
            }
            var Param = {
                "adjusterDescription": $scope.itemSalvageDetails.adjusterDescription,
                "gemLabDescription": $scope.itemSalvageDetails.gemLabDescription,
                "salvageDate": $filter('DatabaseDateFormatMMddyyyy')($scope.currentDate),
                "explanation": angular.isUndefined($scope.itemSalvageDetails.explanation) ? null : ($scope.itemSalvageDetails.explanation),
                "cuttersDate": $filter('DatabaseDateFormatMMddyyyy')($scope.itemSalvageDetails.cuttersDate),
                "giaDate": $filter('DatabaseDateFormatMMddyyyy')($scope.itemSalvageDetails.giaDate),
                "salvageItemStatus": {
                    "id": angular.isUndefined($scope.itemSalvageDetails.salvageItemStatus) || $scope.itemSalvageDetails.salvageItemStatus==null ? null : angular.isUndefined($scope.itemSalvageDetails.salvageItemStatus.id) ? null : $scope.itemSalvageDetails.salvageItemStatus.id
                },
                "salvageProfile": {
                    "id": $scope.itemSalvageDetails.salvageProfile.id
                },
                "claimItem": {
                    "itemUID": angular.isUndefined($scope.ItemDetails.claimItem) ? $scope.ItemDetails.itemUID : $scope.ItemDetails.claimItem.itemUID
                },
                "sellingRateDetails": {
                    "soldPrice": $scope.itemSalvageDetails.sellingRateDetails.soldPrice,
                    "dateOfSale": $filter('DatabaseDateFormatMMddyyyy')($scope.itemSalvageDetails.sellingRateDetails.dateOfSale),
                    "soldTo": $scope.itemSalvageDetails.sellingRateDetails.soldTo,
                    "commissionRate": $scope.itemSalvageDetails.sellingRateDetails.commissionRate,
                    "subTotal": $scope.itemSalvageDetails.sellingRateDetails.subTotal,
                    "certReCutShipFee": $scope.itemSalvageDetails.sellingRateDetails.certReCutShipFee,
                    "netPrice": $scope.itemSalvageDetails.sellingRateDetails.netPrice,
                    "billingStatus": {
                        "id":angular.isUndefined($scope.itemSalvageDetails.billingStatus) || $scope.itemSalvageDetails.billingStatus==null ? null : angular.isUndefined($scope.itemSalvageDetails.billingStatus.id) ? null : $scope.itemSalvageDetails.billingStatus.id
                    },
                    "soldPrice": $scope.itemSalvageDetails.sellingRateDetails.soldPrice,
                    "soldTo": $scope.itemSalvageDetails.sellingRateDetails.soldTo,
                },
                "billingDetails": {
                    "checkAmount": $scope.itemSalvageDetails.billingDetails.checkAmount,
                    "checkNumber": $scope.itemSalvageDetails.billingDetails.checkNumber,
                    "datePaid": $filter('DatabaseDateFormatMMddyyyy')($scope.itemSalvageDetails.billingDetails.datePaid)
                },
                "salvageCustomerBuyBackDetails": {
                    "salvageValue": $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.salvageValue,
                    "commissionRate": $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.commissionRate,
                    "shippingFee": $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.shippingFee,
                    "evaluationFee": $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.evaluationFee,
                    "buyBackPrice": $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.buyBackPrice
                },
                "salvageBidsDetails": TempSalvageBidDetails,
                //[
                //  {
                //      "date": $filter('DatabaseDateFormatMMddyyyy')($scope.currentDate),
                //      "vendor": {
                //          "vendorId": sessionStorage.getItem("VendorId")
                //      },
                //      "bidValue": $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.bidValue
                //  }
                //],
                "salvageEstimate": null,
                "statusDTO": {
                    "id": angular.isUndefined($scope.itemSalvageDetails.statusDTO) ? 1 : $scope.itemSalvageDetails.statusDTO.id
                },
                "companyRegistration": sessionStorage.getItem("CompanyCRN"),
                "salvageTotal": angular.isUndefined($scope.itemSalvageDetails.salvageTotal) ? 1 : $scope.itemSalvageDetails.salvageTotal,
                "salvageDiamondStones": TempsalvageDiamondStones,
                "salvageItemFinished": null,
                "additionalStoneDetails": TempadditionalStoneDetailsGemstone,
                "metalDetails": {
                    "metalType": {
                        "id": angular.isUndefined($scope.itemSalvageDetails.metalDetails.metalType) || $scope.itemSalvageDetails.metalDetails.metalType == null ? null : angular.isUndefined($scope.itemSalvageDetails.metalDetails.metalType.id) ? null : $scope.itemSalvageDetails.metalDetails.metalType.id
                    },
                    "weight": angular.isUndefined($scope.itemSalvageDetails.metalDetails.weight) ? null : $scope.itemSalvageDetails.metalDetails.weight,
                    "totalPrice": angular.isUndefined($scope.itemSalvageDetails.metalDetails.totalPrice) ? null : $scope.itemSalvageDetails.metalDetails.totalPrice,
                    "netPrice": angular.isUndefined($scope.itemSalvageDetails.metalDetails.netPrice) ? null : $scope.itemSalvageDetails.metalDetails.netPrice,
                    "spotPrice": angular.isUndefined($scope.itemSalvageDetails.metalDetails.spotPrice) ? null : $scope.itemSalvageDetails.metalDetails.spotPrice,
                    "contracted": angular.isUndefined($scope.itemSalvageDetails.metalDetails.contracted) ? null : $scope.itemSalvageDetails.metalDetails.contracted,
                    "date": $filter('DatabaseDateFormatMMddyyyy')($scope.itemSalvageDetails.metalDetails.date)
                },
                "relacementDetails": {
                    "description": angular.isUndefined($scope.itemSalvageDetails.relacementDetails) || $scope.itemSalvageDetails.relacementDetails == null ? null : angular.isUndefined($scope.itemSalvageDetails.relacementDetails.description) ? null : $scope.itemSalvageDetails.relacementDetails.description,
                    "replacementQuote": angular.isUndefined($scope.itemSalvageDetails.relacementDetails) || $scope.itemSalvageDetails.relacementDetails == null ? null : angular.isUndefined($scope.itemSalvageDetails.relacementDetails.replacementQuote) ? null : $scope.itemSalvageDetails.relacementDetails.replacementQuote,
                    "appraisalValue": angular.isUndefined($scope.itemSalvageDetails.relacementDetails) || $scope.itemSalvageDetails.relacementDetails == null ? null : angular.isUndefined($scope.itemSalvageDetails.relacementDetails.appraisalValue) ? null : $scope.itemSalvageDetails.relacementDetails.appraisalValue,
                    "scheduledValue": angular.isUndefined($scope.itemSalvageDetails.relacementDetails) || $scope.itemSalvageDetails.relacementDetails == null ? null : angular.isUndefined($scope.itemSalvageDetails.relacementDetails.scheduledValue) ? null : $scope.itemSalvageDetails.relacementDetails.scheduledValue,
                },
                }
            data.append("itemSalvageDetails", JSON.stringify(Param));
            var SaveSalvage = SalvageService.AddGemstone(data);
            SaveSalvage.then(function (success) {
                //var id = success.data.data.id
                GetSalvageDetails();
                toastr.remove();
                toastr.success(success.data.message, "Confirmation");
                $(".page-spinner-bar").addClass("hide");
            }, function (error) {
                toastr.remove();
                if (error.data.errorMessage != null && angular.isDefined(error.data.errorMessage)) {
                    toastr.error(error.data.errorMessage, "Error")
                }
                else {
                    toastr.error(AuthHeaderService.genericErrorMessage(), "Error")
                }
                $(".page-spinner-bar").addClass("hide");
            });
        }
    };
    //Get all salvage use this method
    $scope.GetSalvageDetails = GetSalvageDetails;
    function GetSalvageDetails() {
        $(".page-spinner-bar").removeClass("hide");

        var param = {
            "claimItem": {
                "id": $scope.ItemDetails.id
            }
        };

        var SalvageDetails = SalvageService.GetSalvageDetails(param);
        SalvageDetails.then(function (success) {
            $scope.itemSalvageDetails=[];
            $scope.itemSalvageDetails = success.data.data;
            if (angular.isDefined($scope.itemSalvageDetails) && $scope.itemSalvageDetails != null) {
                if ($scope.itemSalvageDetails.salvageProfile.id == 1)//diamond
                {
                    $scope.itemSalvageDetails = success.data.data;
                    if (angular.isDefined($scope.itemSalvageDetails.id) && $scope.itemSalvageDetails.id != null) {
                        $scope.itemSalvageDetails.salvageDate = (angular.isDefined($scope.itemSalvageDetails.salvageDate) && $scope.itemSalvageDetails.salvageDate != null) ? ($filter('DateFormatMMddyyyy')($scope.itemSalvageDetails.salvageDate)) : null;
                        $scope.itemSalvageDetails.cuttersDate = (angular.isDefined($scope.itemSalvageDetails.cuttersDate) && $scope.itemSalvageDetails.cuttersDate != null) ? ($filter('DateFormatMMddyyyy')($scope.itemSalvageDetails.cuttersDate)) : null;
                        $scope.itemSalvageDetails.giaDate = (angular.isDefined($scope.itemSalvageDetails.giaDate) && $scope.itemSalvageDetails.giaDate != null) ? ($filter('DateFormatMMddyyyy')($scope.itemSalvageDetails.giaDate)) : null;
                        $scope.itemSalvageDetails.billingDetails.datePaid = (angular.isDefined($scope.itemSalvageDetails.billingDetails.datePaid) && $scope.itemSalvageDetails.billingDetails.datePaid != null) ? ($filter('DateFormatMMddyyyy')($scope.itemSalvageDetails.billingDetails.datePaid)) : null;
                        $scope.itemSalvageDetails.sellingRateDetails.dateOfSale = (angular.isDefined($scope.itemSalvageDetails.sellingRateDetails.dateOfSale) && $scope.itemSalvageDetails.sellingRateDetails.dateOfSale != null) ? ($filter('DateFormatMMddyyyy')($scope.itemSalvageDetails.sellingRateDetails.dateOfSale)) : null;
                        $scope.itemSalvageDetails.metalDetails.date = (angular.isDefined($scope.itemSalvageDetails.metalDetails.date) && $scope.itemSalvageDetails.metalDetails.date != null) ? ($filter('DateFormatMMddyyyy')($scope.itemSalvageDetails.metalDetails.date)) : null;
                        $scope.subItem = $scope.itemSalvageDetails.salvageProfile.id;

                        $scope.additionalStoneDetailsDiamond = [];
                        if ($scope.itemSalvageDetails.additionalStoneDetails.length > 0) {
                            angular.forEach($scope.itemSalvageDetails.additionalStoneDetails, function (item) {
                                $scope.additionalStoneDetailsDiamond.push({
                                    "id": angular.isDefined(item.id) ? item.id : null,
                                    "stoneUID": item.additionalStoneUID,
                                    "stoneType": item.stoneType,
                                    "individualWeight": item.individualWeight,
                                    "quantity": item.quantity,
                                    "totalCaratWeight": item.totalCaratWeight,
                                    "pricePerCarat": item.pricePerCarat,
                                    "totalPrice": item.totalPrice
                                });
                            });
                            $scope.NewStoneItemDiamond = false;
                        } else {
                            TempadditionalStoneDetailsGemstone = null;
                        }

                        var TempsalvageDiamondStones = [];
                        var number = 1;
                        if ($scope.itemSalvageDetails.salvageDiamondStones.length > 0) {
                            angular.forEach($scope.itemSalvageDetails.salvageDiamondStones, function (item) {
                                TempsalvageDiamondStones.push({
                                    "number": number,
                                    "originalStone": {
                                        "originalStoneUID": angular.isUndefined(item.originalStone.originalStoneUID) || item.originalStone.originalStoneUID == null ? null : item.originalStone.originalStoneUID,
                                        "id": angular.isUndefined(item.originalStone.id) || item.originalStone.id == null ? null : item.originalStone.id,
                                        "shape": angular.isUndefined(item.originalStone.shape) ? null : item.originalStone.shape,
                                        "stoneType": angular.isUndefined(item.originalStone.stoneType) ? null : item.originalStone.stoneType,
                                        "stoneQuality": angular.isUndefined(item.originalStone.stoneQuality) ? null : item.originalStone.stoneQuality,
                                        "weight": angular.isUndefined(item.originalStone.weight) || item.originalStone.weight == null ? null : item.originalStone.weight,
                                        "color": angular.isUndefined(item.originalStone.color) ? null : item.originalStone.color,
                                        "clarity": angular.isUndefined(item.originalStone.clarity) ? null : item.originalStone.clarity,
                                        "diameter": angular.isUndefined(item.originalStone.diameter) || item.originalStone.diameter == null ? null : item.originalStone.diameter,
                                        "depth": angular.isUndefined(item.originalStone.depth) || item.originalStone.depth == null ? null : item.originalStone.depth,
                                        "length": angular.isUndefined(item.originalStone.length) || item.originalStone.length == null ? null : item.originalStone.length,
                                        "width": angular.isUndefined(item.originalStone.width) || item.originalStone.width == null ? null : item.originalStone.width,
                                        "cutGrade": angular.isUndefined(item.originalStone.cutGrade) ? null : item.originalStone.cutGrade,
                                        "flouresence": angular.isUndefined(item.originalStone.flouresence) ? null : item.originalStone.flouresence,
                                        "certificateType": angular.isUndefined(item.originalStone.certificateType) ? null : item.originalStone.certificateType
                                    },
                                    "estimateBeforeRepair": {
                                        "id": angular.isUndefined(item.estimateBeforeRepair.id) || item.estimateBeforeRepair.id == null ? null : item.estimateBeforeRepair.id,
                                        "estimateStoneUID": angular.isUndefined(item.estimateBeforeRepair.estimateStoneUID) || item.estimateBeforeRepair.estimateStoneUID == null ? null : item.estimateBeforeRepair.estimateStoneUID,
                                        "shape": angular.isUndefined(item.estimateBeforeRepair.shape) ? null : item.estimateBeforeRepair.shape,
                                        "weight": angular.isUndefined(item.estimateBeforeRepair.weight) || item.estimateBeforeRepair.weight == null ? null : item.estimateBeforeRepair.weight,
                                        "estWeightLoss": angular.isUndefined(item.estimateBeforeRepair.estWeightLoss) || item.estimateBeforeRepair.estWeightLoss == null ? null : item.estimateBeforeRepair.estWeightLoss,
                                        "estFinishWeight": angular.isUndefined(item.estimateBeforeRepair.estFinishWeight) || item.estimateBeforeRepair.estFinishWeight == null ? null : item.estimateBeforeRepair.estFinishWeight,
                                        "estColor": angular.isUndefined(item.estimateBeforeRepair.estColor) ? null : item.estimateBeforeRepair.estColor,
                                        "estClarity": angular.isUndefined(item.estimateBeforeRepair.estClarity) ? null : item.estimateBeforeRepair.estClarity,
                                        "cutGrade": angular.isUndefined(item.estimateBeforeRepair.cutGrade) ? null : item.estimateBeforeRepair.cutGrade,
                                        "flouresence": angular.isUndefined(item.estimateBeforeRepair.flouresence) ? null : item.estimateBeforeRepair.flouresence,
                                        "rapPricePC": angular.isUndefined(item.estimateBeforeRepair.rapPricePC) || item.estimateBeforeRepair.rapPricePC == null ? null : item.estimateBeforeRepair.rapPricePC,
                                        "stonePrice": angular.isUndefined(item.estimateBeforeRepair.stonePrice) || item.estimateBeforeRepair.stonePrice == null ? null : item.estimateBeforeRepair.stonePrice,
                                        "marketAdjustment": angular.isUndefined(item.estimateBeforeRepair.marketAdjustment) || item.estimateBeforeRepair.marketAdjustment == null ? null : item.estimateBeforeRepair.marketAdjustment,
                                        "subTotal": angular.isUndefined(item.estimateBeforeRepair.subTotal) || item.estimateBeforeRepair.subTotal == null ? null : item.estimateBeforeRepair.subTotal,
                                        "wholeSaleBuyerAdj": angular.isUndefined(item.estimateBeforeRepair.wholeSaleBuyerAdj) || item.estimateBeforeRepair.wholeSaleBuyerAdj == null ? null : item.estimateBeforeRepair.wholeSaleBuyerAdj,
                                        "salvageValue": angular.isUndefined(item.estimateBeforeRepair.salvageValue) || item.estimateBeforeRepair.salvageValue == null ? null : item.estimateBeforeRepair.salvageValue,
                                        "cuttingCharge": angular.isUndefined(item.estimateBeforeRepair.cuttingCharge) || item.estimateBeforeRepair.cuttingCharge == null ? null : item.estimateBeforeRepair.cuttingCharge,
                                        "certificateType": angular.isUndefined(item.estimateBeforeRepair.certificateType) ? null : item.estimateBeforeRepair.certificateType,
                                        "certFee": angular.isUndefined(item.estimateBeforeRepair.certFee) || item.estimateBeforeRepair.certFee == null ? null : item.estimateBeforeRepair.certFee,
                                        "shippingCost": angular.isUndefined(item.estimateBeforeRepair.shippingCost) || item.estimateBeforeRepair.shippingCost == null ? null : item.estimateBeforeRepair.shippingCost,
                                        "net": angular.isUndefined(item.estimateBeforeRepair.net) || item.estimateBeforeRepair.net == null ? null : item.estimateBeforeRepair.net
                                    },
                                    "actualAfterRepair": {
                                        "id": angular.isUndefined(item.actualAfterRepair.id) || item.actualAfterRepair.id == null ? null : item.actualAfterRepair.id,
                                        "actualStoneUID": angular.isUndefined(item.actualAfterRepair.actualStoneUID) || item.actualAfterRepair.actualStoneUID == null ? null : item.actualAfterRepair.actualStoneUID,
                                        "shape": angular.isUndefined(item.actualAfterRepair.shape) ? null : item.actualAfterRepair.shape,
                                        "stoneQuality": angular.isUndefined(item.actualAfterRepair.stoneQuality) ? null : item.actualAfterRepair.stoneQuality,
                                        "weight": angular.isUndefined(item.actualAfterRepair.weight) || item.actualAfterRepair.weight == null ? null : item.actualAfterRepair.weight,
                                        "color": angular.isUndefined(item.actualAfterRepair.color) ? null : item.actualAfterRepair.color,
                                        "clarity": angular.isUndefined(item.actualAfterRepair.clarity) ? null : item.actualAfterRepair.clarity,
                                        "cutGrade": angular.isUndefined(item.actualAfterRepair.cutGrade) ? null : item.actualAfterRepair.cutGrade,
                                        "flouresence": angular.isUndefined(item.actualAfterRepair.flouresence) ? null : item.actualAfterRepair.flouresence,
                                        "depth": angular.isUndefined(item.actualAfterRepair.depth) || item.actualAfterRepair.depth == null ? null : item.actualAfterRepair.depth,
                                        "table": angular.isUndefined(item.actualAfterRepair.table) || item.actualAfterRepair.table == null ? null : item.actualAfterRepair.table,
                                        "polish": angular.isUndefined(item.actualAfterRepair.polish) ? null : item.actualAfterRepair.polish,
                                        "symmetry": angular.isUndefined(item.actualAfterRepair.symmetry) ? null : item.actualAfterRepair.symmetry,
                                        "rapPricePC": angular.isUndefined(item.actualAfterRepair.rapPricePC) || item.actualAfterRepair.rapPricePC == null ? null : item.actualAfterRepair.rapPricePC,
                                        "stonePrice": angular.isUndefined(item.actualAfterRepair.stonePrice) || item.actualAfterRepair.stonePrice == null ? null : item.actualAfterRepair.stonePrice,
                                        "marketAdjustment": angular.isUndefined(item.actualAfterRepair.marketAdjustment) || item.actualAfterRepair.marketAdjustment == null ? null : item.actualAfterRepair.marketAdjustment,
                                        "subTotal": angular.isUndefined(item.actualAfterRepair.subTotal) || item.actualAfterRepair.subTotal == null ? null : item.actualAfterRepair.subTotal,
                                        "wholesaleBuyerAdj": angular.isUndefined(item.actualAfterRepair.wholesaleBuyerAdj) || item.actualAfterRepair.wholesaleBuyerAdj == null ? null : item.actualAfterRepair.wholesaleBuyerAdj,
                                        "salvageValue": angular.isUndefined(item.actualAfterRepair.salvageValue) || item.actualAfterRepair.salvageValue == null ? null : item.actualAfterRepair.salvageValue,
                                        "cuttingCharge": angular.isUndefined(item.actualAfterRepair.cuttingCharge) || item.actualAfterRepair.cuttingCharge == null ? null : item.actualAfterRepair.cuttingCharge,
                                        "certificateType": angular.isUndefined(item.actualAfterRepair.certificateType) ? null : item.actualAfterRepair.certificateType,
                                        "certFee": angular.isUndefined(item.actualAfterRepair.certFee) || item.actualAfterRepair.certFee == null ? null : item.actualAfterRepair.certFee,
                                        "shippingFee": angular.isUndefined(item.actualAfterRepair.shippingFee) || item.actualAfterRepair.shippingFee == null ? null : item.actualAfterRepair.shippingFee,
                                        "netProcessds": angular.isUndefined(item.actualAfterRepair.netProcessds) || item.actualAfterRepair.netProcessds == null ? null : item.actualAfterRepair.netProcessds
                                    },
                                    "replacementQuoted":null,//    {
                                    //    "id": angular.isUndefined(item.replacementQuoted.id) || item.replacementQuoted.id == null ? null : item.replacementQuoted.id,
                                    //    "replacementStoneUID": angular.isUndefined(item.replacementQuoted.replacementStoneUID) || item.replacementQuoted.replacementStoneUID == null ? null : item.replacementQuoted.replacementStoneUID,
                                    //    "description": angular.isUndefined(item.replacementQuoted.description) || item.replacementQuoted.description == null ? null : item.replacementQuoted.description,
                                    //    "replacementQuote": angular.isUndefined(item.replacementQuoted.replacementQuote) || item.replacementQuoted.replacementQuote == null ? null : item.replacementQuoted.replacementQuote,
                                    //    "appraisalValue": angular.isUndefined(item.replacementQuoted.appraisalValue) || item.replacementQuoted.appraisalValue == null ? null : item.replacementQuoted.appraisalValue,
                                    //    "scheduledValue": angular.isUndefined(item.replacementQuoted.scheduledValue) || item.replacementQuoted.scheduledValue == null ? null : item.replacementQuoted.scheduledValue
                                    //},
                                    "toDelete": false,
                                    "explanation": angular.isUndefined(item.explanation) ? null : (item.explanation),
                                    "id": angular.isUndefined(item.id) ? null : item.id
                                });
                                //getNameFromId($scope.DropDownList.salvageColor, item.originalStone.color.id, number, 'originalStoneColor');
                                //getNameFromId($scope.DropDownList.salvageClarity, item.originalStone.clarity.id, Item.number, 'originalStoneClarity');
                                //getNameFromId($scope.DropDownList.salvageColor, item.actualAfterRepair.color.id, Item.number, 'actualAfterRepairColor');
                                //getNameFromId($scope.DropDownList.salvageClarity, Item.actualAfterRepair.clarity.id, Item.number, 'actualAfterRepairClarity');
                                //getNameFromId($scope.DropDownList.cutGrades, Item.actualAfterRepair.cutGrade.id, Item.number, 'actualAfterRepairCutGrade');
                                number++;
                            });
                        }

                        $scope.DimondItemList = TempsalvageDiamondStones;
                        $scope.attachmentListSalvage = [];
                        $scope.EditattachmentListSalvage = []
                        if (angular.isDefined($scope.itemSalvageDetails.attachmentList)) {
                            angular.forEach($scope.itemSalvageDetails.attachmentList, function (item) {
                                $scope.EditattachmentListSalvage.push({
                                    "FileName": item.name, "FileExtension": item.name.substr((item.name.lastIndexOf('.') + 1)), "FileType": item.name.substr((item.name.lastIndexOf('.') + 1)),
                                    "Image": item.url, "File": item.url, "url": item.url, "imageId": item.imageId
                                });
                            });
                        }
                        calculateSalvageTotal();
                    }
                } else if ($scope.itemSalvageDetails.salvageProfile.id == 2)//Gemstone
                {
                    if (angular.isDefined($scope.itemSalvageDetails.id) && $scope.itemSalvageDetails.id != null) {
                        $scope.itemSalvageDetails.salvageDate = (angular.isDefined($scope.itemSalvageDetails.salvageDate) && $scope.itemSalvageDetails.salvageDate != null) ? ($filter('DateFormatMMddyyyy')($scope.itemSalvageDetails.salvageDate)) : null;
                        $scope.itemSalvageDetails.cuttersDate = (angular.isDefined($scope.itemSalvageDetails.cuttersDate) && $scope.itemSalvageDetails.cuttersDate != null) ? ($filter('DateFormatMMddyyyy')($scope.itemSalvageDetails.cuttersDate)) : null;
                        $scope.itemSalvageDetails.giaDate = (angular.isDefined($scope.itemSalvageDetails.giaDate) && $scope.itemSalvageDetails.giaDate != null) ? ($filter('DateFormatMMddyyyy')($scope.itemSalvageDetails.giaDate)) : null;
                        $scope.itemSalvageDetails.billingDetails.datePaid = (angular.isDefined($scope.itemSalvageDetails.billingDetails.datePaid) && $scope.itemSalvageDetails.billingDetails.datePaid != null) ? ($filter('DateFormatMMddyyyy')($scope.itemSalvageDetails.billingDetails.datePaid)) : null;
                        $scope.itemSalvageDetails.sellingRateDetails.dateOfSale = (angular.isDefined($scope.itemSalvageDetails.sellingRateDetails.dateOfSale) && $scope.itemSalvageDetails.sellingRateDetails.dateOfSale != null) ? ($filter('DateFormatMMddyyyy')($scope.itemSalvageDetails.sellingRateDetails.dateOfSale)) : null;
                        $scope.itemSalvageDetails.metalDetails.date = (angular.isDefined($scope.itemSalvageDetails.metalDetails.date) && $scope.itemSalvageDetails.metalDetails.date != null) ? ($filter('DateFormatMMddyyyy')($scope.itemSalvageDetails.metalDetails.date)) : null;
                        $scope.subItem = $scope.itemSalvageDetails.salvageProfile.id;
                        $scope.additionalStoneDetailsGemstone = [];
                        if ($scope.itemSalvageDetails.additionalStoneDetails.length > 0) {
                            angular.forEach($scope.itemSalvageDetails.additionalStoneDetails, function (item) {
                                $scope.additionalStoneDetailsGemstone.push({
                                    "id": angular.isDefined(item.id) ? item.id : null,
                                    "stoneUID": item.additionalStoneUID,
                                    "stoneType": item.stoneType,
                                    "individualWeight": item.individualWeight,
                                    "quantity": item.quantity,
                                    "totalCaratWeight": item.totalCaratWeight,
                                    "pricePerCarat": item.pricePerCarat,
                                    "totalPrice": item.totalPrice
                                });
                            });
                            $scope.NewStoneItemGemstone = false;
                        } else {
                            TempadditionalStoneDetailsGemstone = null;
                        }
                        //$scope.additionalStoneDetailsGemstone = TempadditionalStoneDetailsGemstone;
                        var TempSalvageBidDetails = [];
                        if ($scope.itemSalvageDetails.salvageBidsDetails.length > 0) {
                            angular.forEach($scope.itemSalvageDetails.salvageBidsDetails, function (item) {
                                TempSalvageBidDetails.push({
                                    "date": (angular.isDefined(item.date) && item.date != null) ? ($filter('DateFormatMMddyyyy')(item.date)) : null,
                                    "vendorName":item.vendorName,
                                    //"vendor": {
                                    //    "vendorId": sessionStorage.getItem("VendorId")
                                    //},
                                    "bidValue": item.bidValue,
                                    "bidsUID": item.bidsUID
                                })
                            })
                        }
                        $scope.itemSalvageDetails.salvageBidsDetails = TempSalvageBidDetails
                        var TempsalvageDiamondStones = [];
                        var number = 1;
                        if ($scope.itemSalvageDetails.salvageDiamondStones.length > 0) {
                            angular.forEach($scope.itemSalvageDetails.salvageDiamondStones, function (item) {
                                TempsalvageDiamondStones.push({
                                    "number": number,
                                    "stoneUID": item.stoneUID,
                                    "originalStone": {
                                        "originalStoneUID": angular.isUndefined(item.originalStone.originalStoneUID) || item.originalStone.originalStoneUID == null ? null : item.originalStone.originalStoneUID,
                                        "id": angular.isUndefined(item.originalStone.id) || item.originalStone.id == null ? null : item.originalStone.id,
                                        "shape": angular.isUndefined(item.originalStone.shape) ? null : item.originalStone.shape,
                                        "stoneType": angular.isUndefined(item.originalStone.stoneType) ? null : item.originalStone.stoneType,
                                        "stoneQuality": angular.isUndefined(item.originalStone.stoneQuality) ? null : item.originalStone.stoneQuality,
                                        "weight": angular.isUndefined(item.originalStone.weight) || item.originalStone.weight == null ? null : item.originalStone.weight,
                                        "color": angular.isUndefined(item.originalStone.color) ? null : item.originalStone.color,
                                        "clarity": angular.isUndefined(item.originalStone.clarity) ? null : item.originalStone.clarity,
                                        "diameter": angular.isUndefined(item.originalStone.diameter) || item.originalStone.diameter == null ? null : item.originalStone.diameter,
                                        "depth": angular.isUndefined(item.originalStone.depth) || item.originalStone.depth == null ? null : item.originalStone.depth,
                                        "length": angular.isUndefined(item.originalStone.length) || item.originalStone.length == null ? null : item.originalStone.length,
                                        "width": angular.isUndefined(item.originalStone.width) || item.originalStone.width == null ? null : item.originalStone.width,
                                        "cutGrade": angular.isUndefined(item.originalStone.cutGrade) ? null : item.originalStone.cutGrade,
                                        "flouresence": angular.isUndefined(item.originalStone.flouresence) ? null : item.originalStone.flouresence,
                                        "certificateType": angular.isUndefined(item.originalStone.certificateType) ? null : item.originalStone.certificateType
                                    },
                                    "estimateBeforeRepair": {
                                        "id": angular.isUndefined(item.estimateBeforeRepair.id) || item.estimateBeforeRepair.id == null ? null : item.estimateBeforeRepair.id,
                                        "estimateStoneUID": angular.isUndefined(item.estimateBeforeRepair.estimateStoneUID) || item.estimateBeforeRepair.estimateStoneUID == null ? null : item.estimateBeforeRepair.estimateStoneUID,
                                        "shape": angular.isUndefined(item.estimateBeforeRepair.shape) ? null : (item.estimateBeforeRepair.shape),
                                        "weight": angular.isUndefined(item.estimateBeforeRepair.weight) || item.estimateBeforeRepair.weight == null ? null : item.estimateBeforeRepair.weight,
                                        "estWeightLoss": angular.isUndefined(item.estimateBeforeRepair.estWeightLoss) || item.estimateBeforeRepair.estWeightLoss == null ? null : item.estimateBeforeRepair.estWeightLoss,
                                        "estFinishWeight": angular.isUndefined(item.estimateBeforeRepair.estFinishWeight) || item.estimateBeforeRepair.estFinishWeight == null ? null : item.estimateBeforeRepair.estFinishWeight,
                                        "estColor": angular.isUndefined(item.estimateBeforeRepair.estColor) ? null : (item.estimateBeforeRepair.estColor),
                                        "estClarity": angular.isUndefined(item.estimateBeforeRepair.estClarity) ? null : item.estimateBeforeRepair.estClarity,
                                        "cutGrade": angular.isUndefined(item.estimateBeforeRepair.cutGrade) ? null : (item.estimateBeforeRepair.cutGrade),
                                        "flouresence": angular.isUndefined(item.estimateBeforeRepair.flouresence) ? null : (item.estimateBeforeRepair.flouresence),
                                        "rapPricePC": angular.isUndefined(item.estimateBeforeRepair.rapPricePC) || item.estimateBeforeRepair.rapPricePC == null ? null : item.estimateBeforeRepair.rapPricePC,
                                        "stonePrice": angular.isUndefined(item.estimateBeforeRepair.stonePrice) || item.estimateBeforeRepair.stonePrice == null ? null : item.estimateBeforeRepair.stonePrice,
                                        "marketAdjustment": angular.isUndefined(item.estimateBeforeRepair.marketAdjustment) || item.estimateBeforeRepair.marketAdjustment == null ? null : item.estimateBeforeRepair.marketAdjustment,
                                        "subTotal": angular.isUndefined(item.estimateBeforeRepair.subTotal) || item.estimateBeforeRepair.subTotal == null ? null : item.estimateBeforeRepair.subTotal,
                                        "wholeSaleBuyerAdj": angular.isUndefined(item.estimateBeforeRepair.wholeSaleBuyerAdj) || item.estimateBeforeRepair.wholeSaleBuyerAdj == null ? null : item.estimateBeforeRepair.wholeSaleBuyerAdj,
                                        "salvageValue": angular.isUndefined(item.estimateBeforeRepair.salvageValue) || item.estimateBeforeRepair.salvageValue == null ? null : item.estimateBeforeRepair.salvageValue,
                                        "cuttingCharge": angular.isUndefined(item.estimateBeforeRepair.cuttingCharge) || item.estimateBeforeRepair.cuttingCharge == null ? null : item.estimateBeforeRepair.cuttingCharge,
                                        "certificateType": angular.isUndefined(item.estimateBeforeRepair.certificateType) ? null : item.estimateBeforeRepair.certificateType,
                                        "certFee": angular.isUndefined(item.estimateBeforeRepair.certFee) || item.estimateBeforeRepair.certFee == null ? null : item.estimateBeforeRepair.certFee,
                                        "shippingCost": angular.isUndefined(item.estimateBeforeRepair.shippingCost) || item.estimateBeforeRepair.shippingCost == null ? null : item.estimateBeforeRepair.shippingCost,
                                        "net": angular.isUndefined(item.estimateBeforeRepair.net) || item.estimateBeforeRepair.net == null ? null : item.estimateBeforeRepair.net
                                    },
                                    "actualAfterRepair": {
                                        "id": angular.isUndefined(item.actualAfterRepair.id) || item.actualAfterRepair.id == null ? null : item.actualAfterRepair.id,
                                        "actualStoneUID": angular.isUndefined(item.actualAfterRepair.actualStoneUID) || item.actualAfterRepair.actualStoneUID == null ? null : item.actualAfterRepair.actualStoneUID,
                                        "shape": angular.isUndefined(item.actualAfterRepair.shape) ? null : item.actualAfterRepair.shape,
                                        "stoneQuality": angular.isUndefined(item.actualAfterRepair.stoneQuality) ? null : item.actualAfterRepair.stoneQuality,
                                        "weight": angular.isUndefined(item.actualAfterRepair.weight) || item.actualAfterRepair.weight == null ? null : item.actualAfterRepair.weight,
                                        "color": angular.isUndefined(item.actualAfterRepair.color) ? null : item.actualAfterRepair.color,
                                        "clarity": angular.isUndefined(item.actualAfterRepair.clarity) ? null : item.actualAfterRepair.clarity,
                                        "cutGrade": angular.isUndefined(item.actualAfterRepair.cutGrade) ? null : item.actualAfterRepair.cutGrade,
                                        "flouresence": angular.isUndefined(item.actualAfterRepair.flouresence) ? null : item.actualAfterRepair.flouresence,
                                        "depth": angular.isUndefined(item.actualAfterRepair.depth) || item.actualAfterRepair.depth == null ? null : item.actualAfterRepair.depth,
                                        "table": angular.isUndefined(item.actualAfterRepair.table) || item.actualAfterRepair.table == null ? null : item.actualAfterRepair.table,
                                        "polish": angular.isUndefined(item.actualAfterRepair.polish) ? null : item.actualAfterRepair.polish,
                                        "symmetry": angular.isUndefined(item.actualAfterRepair.symmetry) ? null : item.actualAfterRepair.symmetry,
                                        "rapPricePC": angular.isUndefined(item.actualAfterRepair.rapPricePC) || item.actualAfterRepair.rapPricePC == null ? null : item.actualAfterRepair.rapPricePC,
                                        "stonePrice": angular.isUndefined(item.actualAfterRepair.stonePrice) || item.actualAfterRepair.stonePrice == null ? null : item.actualAfterRepair.stonePrice,
                                        "marketAdjustment": angular.isUndefined(item.actualAfterRepair.marketAdjustment) || item.actualAfterRepair.marketAdjustment == null ? null : item.actualAfterRepair.marketAdjustment,
                                        "subTotal": angular.isUndefined(item.actualAfterRepair.subTotal) || item.actualAfterRepair.subTotals == null ? null : item.actualAfterRepair.subTotal,
                                        "wholesaleBuyerAdj": angular.isUndefined(item.actualAfterRepair.wholesaleBuyerAdj) || item.actualAfterRepair.wholesaleBuyerAdj == null ? null : item.actualAfterRepair.wholesaleBuyerAdj,
                                        "salvageValue": angular.isUndefined(item.actualAfterRepair.salvageValue) || item.actualAfterRepair.salvageValue == null ? null : item.actualAfterRepair.salvageValue,
                                        "cuttingCharge": angular.isUndefined(item.actualAfterRepair.cuttingCharge) || item.actualAfterRepair.cuttingCharge == null ? null : item.actualAfterRepair.cuttingCharge,
                                        "certificateType": angular.isUndefined(item.actualAfterRepair.certificateType) ? null : item.actualAfterRepair.certificateType,
                                        "shippingFee": angular.isUndefined(item.actualAfterRepair.shippingFee) || item.actualAfterRepair.shippingFee == null ? null : item.actualAfterRepair.shippingFee,
                                        "certFee": angular.isUndefined(item.actualAfterRepair.certFee) ? null : item.actualAfterRepair.certFee,
                                        "netProcessds": angular.isUndefined(item.actualAfterRepair.netProcessds) || item.actualAfterRepair.netProcessds == null ? null : item.actualAfterRepair.netProcessds,
                                    },
                                    "replacementQuoted": null,
                                    //{
                                    //    "id": angular.isUndefined(item.replacementQuoted.id) || item.replacementQuoted.id == null ? null : item.replacementQuoted.id,
                                    //    "replacementStoneUID": angular.isUndefined(item.replacementQuoted.replacementStoneUID) || item.replacementQuoted.replacementStoneUID == null ? null : item.replacementQuoted.replacementStoneUID,
                                    //    "description": angular.isUndefined(item.replacementQuoted.description) || item.replacementQuoted.description == null ? null : item.replacementQuoted.description,
                                    //    "replacementQuote": angular.isUndefined(item.replacementQuoted.replacementQuote) || item.replacementQuoted.replacementQuote == null ? null : item.replacementQuoted.replacementQuote,
                                    //    "appraisalValue": angular.isUndefined(item.replacementQuoted.appraisalValue) || item.replacementQuoted.appraisalValue == null ? null : item.replacementQuoted.appraisalValue,
                                    //    "scheduledValue": angular.isUndefined(item.replacementQuoted.scheduledValue) || item.replacementQuoted.scheduledValue == null ? null : item.replacementQuoted.scheduledValue
                                    //}
                                });
                                number++;
                            })
                        }
                        $scope.salvageDiamondStones = TempsalvageDiamondStones;
                        $scope.attachmentListSalvage = [];
                        $scope.EditattachmentListSalvage=[]
                        if (angular.isDefined($scope.itemSalvageDetails.attachments)) {
                            angular.forEach($scope.itemSalvageDetails.attachments, function (item) {
                                $scope.EditattachmentListSalvage.push({
                                    "FileName": item.name, "FileExtension": item.name.substr((item.name.lastIndexOf('.') + 1)), "FileType": item.name.substr((item.name.lastIndexOf('.') + 1)),
                                    "Image": item.url, "File": item.url, "url": item.url, "imageId": item.imageId
                                });
                            });
                        }
                    }
                    calculateSalvageTotalGemstone()
                }
                else if ($scope.itemSalvageDetails.salvageProfile.id == 3)//Luxury Watch
                {
                    if (angular.isDefined($scope.itemSalvageDetails.id) && $scope.itemSalvageDetails.id != null) {
                        $scope.subItem = $scope.itemSalvageDetails.salvageProfile.id;
                        $scope.itemSalvageDetails.metalDetails = $scope.itemSalvageDetails.metalDetails;
                        $scope.itemSalvageDetails.relacementDetails = $scope.itemSalvageDetails.relacementDetails;
                        $scope.itemSalvageDetails.estimateDetail = $scope.itemSalvageDetails.estimateDetail;
                        $scope.itemSalvageDetails.salvageCustomerBuyBackDetails = $scope.itemSalvageDetails.salvageCustomerBuyBackDetails;
                        $scope.itemSalvageDetails.billingDetails = $scope.itemSalvageDetails.billingDetails;
                        $scope.itemSalvageDetails.sellingRateDetails = $scope.itemSalvageDetails.sellingRateDetails;
                        $scope.itemSalvageDetails.salvageDate = (angular.isDefined($scope.itemSalvageDetails.salvageDate) && $scope.itemSalvageDetails.salvageDate != null) ? ($filter('DateFormatMMddyyyy')($scope.itemSalvageDetails.salvageDate)) : null;
                        $scope.itemSalvageDetails.cuttersDate = (angular.isDefined($scope.itemSalvageDetails.cuttersDate) && $scope.itemSalvageDetails.cuttersDate != null) ? ($filter('DateFormatMMddyyyy')($scope.itemSalvageDetails.cuttersDate)) : null;
                        $scope.itemSalvageDetails.giaDate = (angular.isDefined($scope.itemSalvageDetails.giaDate) && $scope.itemSalvageDetails.giaDate != null) ? ($filter('DateFormatMMddyyyy')($scope.itemSalvageDetails.giaDate)) : null;
                        $scope.itemSalvageDetails.sellingRateDetails.dateOfSale = (angular.isDefined($scope.itemSalvageDetails.sellingRateDetails.dateOfSale) && $scope.itemSalvageDetails.sellingRateDetails.dateOfSale != null) ? ($filter('DateFormatMMddyyyy')($scope.itemSalvageDetails.sellingRateDetails.dateOfSale)) : null;
                        $scope.itemSalvageDetails.metalDetails.date = (angular.isDefined($scope.itemSalvageDetails.metalDetails.date) && $scope.itemSalvageDetails.metalDetails.date != null) ? ($filter('DateFormatMMddyyyy')($scope.itemSalvageDetails.metalDetails.date)) : null;
                        $scope.itemSalvageDetails.billingDetails.datePaid = (angular.isDefined($scope.itemSalvageDetails.billingDetails.datePaid) && $scope.itemSalvageDetails.billingDetails.datePaid != null) ? ($filter('DateFormatMMddyyyy')($scope.itemSalvageDetails.billingDetails.datePaid)) : null;

                        $scope.additionalStoneDetailsLuxuryWatch = [];
                        if ($scope.itemSalvageDetails.additionalStoneDetails.length > 0) {
                            angular.forEach($scope.itemSalvageDetails.additionalStoneDetails, function (item) {
                                $scope.additionalStoneDetailsLuxuryWatch.push({
                                    "id": angular.isDefined(item.id) ? item.id : null,
                                    "stoneUID": item.additionalStoneUID,
                                    "stoneType": item.stoneType,
                                    "individualWeight": item.individualWeight,
                                    "quantity": item.quantity,
                                    "totalCaratWeight": item.totalCaratWeight,
                                    "pricePerCarat": item.pricePerCarat,
                                    "totalPrice": item.totalPrice
                                });
                            });
                            $scope.NewStoneItemGemstone = false;
                        } else {
                            additionalStoneDetailsLuxuryWatch = null;
                        }
                        //$scope.additionalStoneDetailsGemstone = TempadditionalStoneDetailsGemstone;

                        var TempSalvageBidDetails = [];
                        if ($scope.itemSalvageDetails.salvageBidsDetails.length > 0) {
                            angular.forEach($scope.itemSalvageDetails.salvageBidsDetails, function (item) {
                                TempSalvageBidDetails.push({
                                    "date": (angular.isDefined(item.date) && item.date != null) ? ($filter('DateFormatMMddyyyy')(item.date)) : null,
                                    //"vendor": {
                                    //    "vendorId": sessionStorage.getItem("VendorId")
                                    //},
                                    "vendorName": item.vendorName,
                                    "bidValue": item.bidValue,
                                    "bidsUID": item.bidsUID
                                })
                            })
                        }
                        $scope.itemSalvageDetails.salvageBidsDetails = TempSalvageBidDetails
                        $scope.attachmentListSalvage = [];
                        $scope.EditattachmentListSalvage = []
                        if (angular.isDefined($scope.itemSalvageDetails.attachmentList)) {
                            angular.forEach($scope.itemSalvageDetails.attachmentList, function (item) {
                                $scope.EditattachmentListSalvage.push({
                                    "FileName": item.name, "FileExtension": item.name.substr((item.name.lastIndexOf('.') + 1)), "FileType": item.name.substr((item.name.lastIndexOf('.') + 1)),
                                    "Image": item.url, "File": item.url, "url": item.url, "imageId": item.imageId
                                });
                            });
                        }
                    }
                    calculateSalvageTotalLuxuryWatch();
                }
                else if ($scope.itemSalvageDetails.salvageProfile.id == 4)//Finish Item
                {
                    if (angular.isDefined($scope.itemSalvageDetails.id) && $scope.itemSalvageDetails.id != null) {
                        $scope.itemSalvageDetails.salvageDate = (angular.isDefined($scope.itemSalvageDetails.salvageDate) && $scope.itemSalvageDetails.salvageDate != null) ? ($filter('DateFormatMMddyyyy')($scope.itemSalvageDetails.salvageDate)) : null;
                        $scope.itemSalvageDetails.cuttersDate = (angular.isDefined($scope.itemSalvageDetails.cuttersDate) && $scope.itemSalvageDetails.cuttersDate != null) ? ($filter('DateFormatMMddyyyy')($scope.itemSalvageDetails.cuttersDate)) : null;
                        $scope.itemSalvageDetails.giaDate = (angular.isDefined($scope.itemSalvageDetails.giaDate) && $scope.itemSalvageDetails.giaDate != null) ? ($filter('DateFormatMMddyyyy')($scope.itemSalvageDetails.giaDate)) : null;
                        $scope.itemSalvageDetails.billingDetails.datePaid = (angular.isDefined($scope.itemSalvageDetails.billingDetails.datePaid) && $scope.itemSalvageDetails.billingDetails.datePaid != null) ? ($filter('DateFormatMMddyyyy')($scope.itemSalvageDetails.billingDetails.datePaid)) : null;
                        $scope.itemSalvageDetails.sellingRateDetails.dateOfSale = (angular.isDefined($scope.itemSalvageDetails.sellingRateDetails.dateOfSale) && $scope.itemSalvageDetails.sellingRateDetails.dateOfSale != null) ? ($filter('DateFormatMMddyyyy')($scope.itemSalvageDetails.sellingRateDetails.dateOfSale)) : null;
                        $scope.itemSalvageDetails.metalDetails.date = (angular.isDefined($scope.itemSalvageDetails.metalDetails.date) && $scope.itemSalvageDetails.metalDetails.date != null) ? ($filter('DateFormatMMddyyyy')($scope.itemSalvageDetails.metalDetails.date)) : null;
                        $scope.subItem = $scope.itemSalvageDetails.salvageProfile.id;
                        $scope.attachmentListSalvage = [];
                        $scope.EditattachmentListSalvage = []
                        if (angular.isDefined($scope.itemSalvageDetails.attachmentList)) {
                            angular.forEach($scope.itemSalvageDetails.attachmentList, function (item) {
                                $scope.EditattachmentListSalvage.push({
                                    "FileName": item.name, "FileExtension": item.name.substr((item.name.lastIndexOf('.') + 1)), "FileType": item.name.substr((item.name.lastIndexOf('.') + 1)),
                                    "Image": item.url, "File": item.url, "url": item.url, "imageId": item.imageId
                                });
                            });
                        }
                        $scope.additionalStoneDetailsFinishedItem = [];
                        if ($scope.itemSalvageDetails.additionalStoneDetails.length > 0) {
                            angular.forEach($scope.itemSalvageDetails.additionalStoneDetails, function (item) {
                                $scope.additionalStoneDetailsFinishedItem.push({
                                    "id": angular.isDefined(item.id) ? item.id : null,
                                    "stoneUID": item.additionalStoneUID,
                                    "stoneType": item.stoneType,
                                    "individualWeight": item.individualWeight,
                                    "quantity": item.quantity,
                                    "totalCaratWeight": item.totalCaratWeight,
                                    "pricePerCarat": item.pricePerCarat,
                                    "totalPrice": item.totalPrice
                                });
                            });
                            $scope.NewStoneItemDiamond = false;
                        } else {
                            TempadditionalStoneDetailsGemstone = null;
                        }
                        var TempsalvageDiamondStones = [];
                        var number = 1;
                        if ($scope.itemSalvageDetails.salvageItemFinished.length > 0) {
                            angular.forEach($scope.itemSalvageDetails.salvageItemFinished, function (item) {
                                TempsalvageDiamondStones.push({
                                    "number": number,
                                    "id": angular.isUndefined(item.id) ? null : item.id,
                                    "mainStone": {
                                        "id": angular.isUndefined(item.mainStone.id) ? null : angular.isUndefined(item.mainStone.id) ? null : item.mainStone.id,
                                        "shapeDetails": angular.isUndefined(item.mainStone) ? null : angular.isUndefined(item.mainStone.shapeDetails) ? null : item.mainStone.shapeDetails,
                                        "weight": angular.isUndefined(item.mainStone) ? null : angular.isUndefined(item.mainStone.weight) ? null : item.mainStone.weight,
                                        "stoneColor": angular.isUndefined(item.mainStone) ? null : angular.isUndefined(item.mainStone.stoneColor) ? null : item.mainStone.stoneColor,
                                        "stoneClarity": angular.isUndefined(item.mainStone) ? null : angular.isUndefined(item.mainStone.stoneClarity) ? null : item.mainStone.stoneClarity,
                                        "floursenceDetails": angular.isUndefined(item.mainStone) ? null : angular.isUndefined(item.mainStone.floursenceDetails) ? null : item.mainStone.floursenceDetails,
                                        "stoneCutGrade": angular.isUndefined(item.mainStone) ? null : angular.isUndefined(item.mainStone.stoneCutGrade) ? null : item.mainStone.stoneCutGrade,
                                        "certificationType": angular.isUndefined(item.mainStone) ? null : angular.isUndefined(item.mainStone.certificationType) ? null : item.mainStone.certificationType,
                                        "pricepc": angular.isUndefined(item.mainStone) ? null : angular.isUndefined(item.mainStone.pricepc) ? null : item.mainStone.pricepc,
                                        "stonePrice": angular.isUndefined(item.mainStone) ? null : angular.isUndefined(item.mainStone.stonePrice) ? null : item.mainStone.stonePrice,
                                        "marketAdj": angular.isUndefined(item.mainStone) ? null : angular.isUndefined(item.mainStone.marketAdj) ? null : item.mainStone.marketAdj,
                                        "subtotal": angular.isUndefined(item.mainStone) ? null : angular.isUndefined(item.mainStone.subtotal) ? null : item.mainStone.subtotal,
                                        "wholesaleAdj": angular.isUndefined(item.mainStone) ? null : angular.isUndefined(item.mainStone.wholesaleAdj) ? null : item.mainStone.wholesaleAdj,
                                        "salvageValue": angular.isUndefined(item.mainStone) ? null : angular.isUndefined(item.mainStone.salvageValue) ? null : item.mainStone.salvageValue
                                    },
                                    "salvageEstimate": {
                                        "estimatedSalvageValue": angular.isUndefined(item.salvageEstimate) ? null : angular.isUndefined(item.salvageEstimate.estimatedSalvageValue) ? null : item.salvageEstimate.estimatedSalvageValue,
                                        "repairs": angular.isUndefined(item.salvageEstimate) ? null : angular.isUndefined(item.salvageEstimate.repairs) ? null : item.salvageEstimate.repairs,
                                        "expenses": angular.isUndefined(item.salvageEstimate) ? null : angular.isUndefined(item.salvageEstimate.expenses) ? null : item.salvageEstimate.expenses,
                                        "netProceeds": angular.isUndefined(item.salvageEstimate) ? null : angular.isUndefined(item.salvageEstimate.netProceeds) ? null : item.salvageEstimate.netProceeds,
                                    },
                                    "replacementDetails":null,
                                    //{
                                    //    "description": angular.isUndefined(item.replacementDetails) ? null : angular.isUndefined(item.replacementDetails.description) ? null : item.replacementDetails.description,
                                    //    "replacementQuote": angular.isUndefined(item.replacementDetails) ? null : angular.isUndefined(item.replacementDetails.replacementQuote) ? null : item.replacementDetails.replacementQuote,
                                    //    "appraisalValue": angular.isUndefined(item.replacementDetails) ? null : angular.isUndefined(item.replacementDetails.appraisalValue) ? null : item.replacementDetails.appraisalValue,
                                    //    "scheduledValue": angular.isUndefined(item.replacementDetails) ? null : angular.isUndefined(item.replacementDetails.scheduledValue) ? null : item.replacementDetails.scheduledValue,
                                    //}
                                });
                                number++;
                            });
                        }
                        $scope.FinishedJewelryItemList = TempsalvageDiamondStones;
                        //$scope.FinishedJewelryItemList[0].estimateDetail = $scope.itemSalvageDetails.estimateDetail;

                        calculateSalvageTotalFinishedItem();
                    }
                }
            } else {
                $scope.itemSalvageDetails = {
                    salvageProfile: { id: 1 },
                    "metalDetails": {
                        "weight": "0",
                        "totalPrice": "0",
                        "netPrice": "0",
                        "spotPrice": "0",
                        "contracted": "0",
                        "date": $scope.currentDate,
                        "metalType": {
                            "id": null,
                            "type": null
                        },
                    },
                    "salvageCustomerBuyBackDetails": {
                        "salvageValue": "",
                        "commissionRate": "",
                        "shippingFee": "",
                        "evaluationFee": "",
                        "buyBackPrice": ""
                    },
                    "sellingRateDetails": {
                        "id": null,
                        "soldPrice": "0",
                        "dateOfSale": $scope.currentDate,
                        "soldTo": "",
                        "commissionRate": "0",
                        "subTotal": "0",
                        "certReCutShipFee": "0",
                        "netPrice": "0",
                        "billingStatus": {
                            "id": null
                        }
                    },
                    "salvageTotal": "0",
                    "billingDetails": {
                        "checkAmount": "",
                        "checkNumber": "",
                        "datePaid": $scope.currentDate,
                        "id": null,
                        "status": {
                            "id": null
                        }
                    },
                    "relacementDetails": {
                        "description": "",
                        "replacementQuote": 0,
                        "appraisalValue": 0,
                        "scheduledValue": 0
                            },
                        }
            }
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            $scope.itemSalvageDetails = {
                salvageProfile: { id: 1 },
                "metalDetails": {
                    "weight": "0",
                    "totalPrice": "0",
                    "netPrice": "0",
                    "spotPrice": "0",
                    "contracted": "0",
                    "date": $scope.currentDate,
                    "metalType": {
                "id": null,
                        "type": null
                },
                    },
                "salvageCustomerBuyBackDetails": {
                    "salvageValue": "",
                    "commissionRate": "",
                    "shippingFee": "",
                    "evaluationFee": "",
                    "buyBackPrice": ""
                },
                "sellingRateDetails": {
                                "id": null,
                    "soldPrice": "0",
                    "dateOfSale": $scope.currentDate,
                    "soldTo": "",
                    "commissionRate": "0",
                    "subTotal": "0",
                    "certReCutShipFee": "0",
                    "netPrice": "0",
                    "billingStatus": {
                            "id": null
                    }
                },
                "salvageTotal": "0",
                "billingDetails": {
                    "checkAmount": "",
                    "checkNumber": "",
                    "datePaid": $scope.currentDate,
                    "id": null,
                    "status": {
                        "id": null
                    }
                },
                "relacementDetails": {
                    "description": "",
                    "replacementQuote": 0,
                    "appraisalValue": 0,
                    "scheduledValue": 0
                },
            }
            $(".page-spinner-bar").addClass("hide");
        });
    }

    $scope.saveDiamondSalvage = saveDiamondSalvage;
    function saveDiamondSalvage() {
        $(".page-spinner-bar").removeClass("hide");
        var data = new FormData();
        $scope.filesDetails = [];
        angular.forEach($scope.attachmentListSalvage, function (ItemFile) {
            if (angular.isUndefined(ItemFile.imageId) || ItemFile.imageId == null) {
                $scope.filesDetails.push({
                    "extension": ItemFile.FileExtension,
                    "fileName": ItemFile.FileName,
                    "filePurpose": "ITEM_SALVAGE_DETAILS",
                    "fileType": ItemFile.FileType
                });
                data.append('file', ItemFile.File);
            }
        });
        if ($scope.attachmentListSalvage.length == 0 || $scope.attachmentListSalvage == null) {
            data.append('filesDetails', null);
            data.append('file', null);
        } else {
            data.append('filesDetails', JSON.stringify($scope.filesDetails));
        }
        var TempadditionalStoneDetailsDiamond = [];
        if ($scope.additionalStoneDetailsDiamond.length > 0) {
            angular.forEach($scope.additionalStoneDetailsDiamond, function (item) {
                TempadditionalStoneDetailsDiamond.push({
                    "id": angular.isUndefined(item.id) ? null : item.id,
                    //"additionalStoneUID": item.stoneUID,
                    "stoneType": {
                        "id": angular.isUndefined(item.stoneType) || item.stoneType==null ? null : angular.isUndefined(item.stoneType.id) ? null : item.stoneType.id,
                    },
                    "individualWeight": item.individualWeight,
                    "quantity": item.quantity,
                    "totalCaratWeight": item.totalCaratWeight,
                    "pricePerCarat": item.pricePerCarat,
                    "totalPrice": item.totalPrice
                });
            });
        } else {
            TempadditionalStoneDetailsDiamond = null;
        }
        var TempsalvageDiamondStones = [];
        if ($scope.DimondItemList.length > 0) {
            angular.forEach($scope.DimondItemList, function (item) {
                TempsalvageDiamondStones.push({
                    "originalStone": {
                        //"id": angular.isUndefined(item.originalStone.id) ? null : item.originalStone.id,
                        "shape": {
                            "id": angular.isUndefined(item.originalStone) ? null : angular.isUndefined(item.originalStone.shape) || item.originalStone.shape==null ? null : item.originalStone.shape.id
                        },
                        "weight": angular.isUndefined(item.originalStone) ? null : item.originalStone.weight,
                        "color": {
                            "id": angular.isUndefined(item.originalStone) ? null : angular.isUndefined(item.originalStone.color) || item.originalStone.color==null ? null : item.originalStone.color.id
                        },
                        "clarity": {
                            "id": angular.isUndefined(item.originalStone) ? null : angular.isUndefined(item.originalStone.clarity) || item.originalStone.clarity ==null ? null : item.originalStone.clarity.id
                        },
                        "diameter": angular.isUndefined(item.originalStone) ? null : angular.isUndefined(item.originalStone.diameter) ? null : item.originalStone.diameter,
                        "depth": angular.isUndefined(item.originalStone) ? null : angular.isUndefined(item.originalStone.depth) ? null : item.originalStone.depth,
                        "length": angular.isUndefined(item.originalStone) ? null : angular.isUndefined(item.originalStone.length) ? null : item.originalStone.length,
                        "width": angular.isUndefined(item.originalStone) ? null : angular.isUndefined(item.originalStone.width) ? null : item.originalStone.width,
                        "cutGrade": {
                            "id": angular.isUndefined(item.originalStone) ? null : angular.isUndefined(item.originalStone.cutGrade) || item.originalStone.cutGrade ==null ? null : angular.isUndefined(item.originalStone.cutGrade.id) ? 0 : item.originalStone.cutGrade.id
                        },
                        "flouresence": {
                            "id": angular.isUndefined(item.originalStone) ? null : angular.isUndefined(item.originalStone.flouresence) || item.originalStone.flouresence==null ? null : item.originalStone.flouresence.id
                        },
                        "certificateType": {
                            "id": angular.isUndefined(item.originalStone) ? null : angular.isUndefined(item.originalStone.certificateType) || item.originalStone.certificateType==null ? null : item.originalStone.certificateType.id
                        },
                        //not present on screen
                        "stoneType": {
                            "id": angular.isUndefined(item.originalStone) ? null : angular.isUndefined(item.originalStone.stoneType) || item.originalStone.stoneType==null ? null : item.originalStone.stoneType.id
                        },
                        "stoneQuality": {
                            "id": angular.isUndefined(item.originalStone) ? null : angular.isUndefined(item.originalStone.stoneQuality) || item.originalStone.stoneQuality == null ? null : item.originalStone.stoneQuality.id
                        }
                    },
                    "estimateBeforeRepair": {
                        "shape": {
                            "id": angular.isUndefined(item.estimateBeforeRepair) ? null : angular.isUndefined(item.estimateBeforeRepair.shape) || item.estimateBeforeRepair.shape == null ? null : item.estimateBeforeRepair.shape.id
                        },
                        "weight": angular.isUndefined(item.estimateBeforeRepair) ? null : angular.isUndefined(item.estimateBeforeRepair.weight) ? null : item.estimateBeforeRepair.weight,
                        "estWeightLoss": angular.isUndefined(item.estimateBeforeRepair) ? null : angular.isUndefined(item.estimateBeforeRepair.estWeightLoss) ? null : item.estimateBeforeRepair.estWeightLoss,
                        "estFinishWeight": angular.isUndefined(item.estimateBeforeRepair) ? null : angular.isUndefined(item.estimateBeforeRepair.estFinishWeight) ? null : item.estimateBeforeRepair.estFinishWeight,
                        "estColor": {
                            "id": angular.isUndefined(item.estimateBeforeRepair) ? null : angular.isUndefined(item.estimateBeforeRepair.estColor) || item.estimateBeforeRepair.estColor == null ? null : item.estimateBeforeRepair.estColor.id
                        },
                        "estClarity": {
                            "id": angular.isUndefined(item.estimateBeforeRepair) ? null : angular.isUndefined(item.estimateBeforeRepair.estClarity) || item.estimateBeforeRepair.estClarity == null ? null : item.estimateBeforeRepair.estClarity.id
                        },
                        "cutGrade": {
                            "id": angular.isUndefined(item.estimateBeforeRepair) ? 1 : angular.isUndefined(item.estimateBeforeRepair.cutGrade) || item.estimateBeforeRepair.cutGrade == null ? 1 : item.estimateBeforeRepair.cutGrade.id
                        },
                        "flouresence": {
                            "id": angular.isUndefined(item.estimateBeforeRepair) ? null : angular.isUndefined(item.estimateBeforeRepair.flouresence) || item.estimateBeforeRepair.flouresence == null ? null : item.estimateBeforeRepair.flouresence.id
                        },
                        "rapPricePC": angular.isUndefined(item.estimateBeforeRepair) ? null : angular.isUndefined(item.estimateBeforeRepair.rapPricePC) ? null : item.estimateBeforeRepair.rapPricePC,
                        "stonePrice": angular.isUndefined(item.estimateBeforeRepair) ? null : angular.isUndefined(item.estimateBeforeRepair.stonePrice) ? null : item.estimateBeforeRepair.stonePrice,
                        "marketAdjustment": angular.isUndefined(item.estimateBeforeRepair) ? null : angular.isUndefined(item.estimateBeforeRepair.marketAdjustment) ? null : item.estimateBeforeRepair.marketAdjustment,
                        "subTotal": angular.isUndefined(item.estimateBeforeRepair) ? null : angular.isUndefined(item.estimateBeforeRepair.subTotal) ? null : item.estimateBeforeRepair.subTotal,
                        "wholeSaleBuyerAdj": angular.isUndefined(item.estimateBeforeRepair) ? null : angular.isUndefined(item.estimateBeforeRepair.wholeSaleBuyerAdj) ? null : item.estimateBeforeRepair.wholeSaleBuyerAdj,
                        "salvageValue": angular.isUndefined(item.estimateBeforeRepair) ? null : angular.isUndefined(item.estimateBeforeRepair.salvageValue) ? null : item.estimateBeforeRepair.salvageValue,
                        "cuttingCharge": angular.isUndefined(item.estimateBeforeRepair) ? null : angular.isUndefined(item.estimateBeforeRepair.cuttingCharge) ? null : item.estimateBeforeRepair.cuttingCharge,
                        "certificateType": {
                            "id": angular.isUndefined(item.estimateBeforeRepair) ? null : angular.isUndefined(item.estimateBeforeRepair.certificateType) || item.estimateBeforeRepair.certificateType==null ? null : item.estimateBeforeRepair.certificateType.id
                        },
                        "certFee": angular.isUndefined(item.estimateBeforeRepair) ? null : angular.isUndefined(item.estimateBeforeRepair.certFee) ? null : item.estimateBeforeRepair.certFee,
                        "shippingCost": angular.isUndefined(item.estimateBeforeRepair) ? null : angular.isUndefined(item.estimateBeforeRepair.shippingCost) ? null : item.estimateBeforeRepair.shippingCost,
                        "net": angular.isUndefined(item.estimateBeforeRepair) ? null : angular.isUndefined(item.estimateBeforeRepair.net) ? null : item.estimateBeforeRepair.net
                    },
                    "actualAfterRepair": {
                        "shape": {
                            "id": angular.isUndefined(item.actualAfterRepair) ? null : angular.isUndefined(item.actualAfterRepair.shape) || item.actualAfterRepair.shape==null ? null : item.actualAfterRepair.shape.id
                        },
                        "weight": angular.isUndefined(item.actualAfterRepair) ? null : angular.isUndefined(item.actualAfterRepair.weight) ? null : item.actualAfterRepair.weight,
                        "color": {
                            "id": angular.isUndefined(item.actualAfterRepair) ? null : angular.isUndefined(item.actualAfterRepair.color) || item.actualAfterRepair.color == null ? null : item.actualAfterRepair.color.id
                        },
                        "clarity": {
                            "id": angular.isUndefined(item.actualAfterRepair) ? null : angular.isUndefined(item.actualAfterRepair.clarity) || item.actualAfterRepair.clarity == null ? null : item.actualAfterRepair.clarity.id
                        },
                        "cutGrade": {
                            "id": angular.isUndefined(item.actualAfterRepair) ? 1 : angular.isUndefined(item.actualAfterRepair.cutGrade) || item.actualAfterRepair.cutGrade == null ? null : item.actualAfterRepair.cutGrade.id
                        },
                        "flouresence": {
                            "id": angular.isUndefined(item.actualAfterRepair) ? null : angular.isUndefined(item.actualAfterRepair.flouresence) || item.actualAfterRepair.flouresence == null ? null : item.actualAfterRepair.flouresence.id
                        },
                        "depth": angular.isUndefined(item.actualAfterRepair) ? null : angular.isUndefined(item.actualAfterRepair.depth) ? null : item.actualAfterRepair.depth,
                        "table": angular.isUndefined(item.actualAfterRepair) ? null : angular.isUndefined(item.actualAfterRepair.table) ? null : item.actualAfterRepair.table,
                        "polish": {
                            "id": angular.isUndefined(item.actualAfterRepair) ? null : angular.isUndefined(item.actualAfterRepair.polish) || item.actualAfterRepair.polish == null ? null : item.actualAfterRepair.polish.id
                        },
                        "stoneQuality": {
                            "id": angular.isUndefined(item.actualAfterRepair) ? null : angular.isUndefined(item.actualAfterRepair.stoneQuality) || item.actualAfterRepair.stoneQuality == null ? null : item.actualAfterRepair.stoneQuality.id
                        },
                        "symmetry": {
                            "id": angular.isUndefined(item.actualAfterRepair) ? null : angular.isUndefined(item.actualAfterRepair.symmetry) || item.actualAfterRepair.symmetry == null ? null : item.actualAfterRepair.symmetry.id
                        },
                        "rapPricePC": angular.isUndefined(item.actualAfterRepair) ? null : angular.isUndefined(item.actualAfterRepair.rapPricePC) ? null : item.actualAfterRepair.rapPricePC,
                        "stonePrice": angular.isUndefined(item.actualAfterRepair) ? null : angular.isUndefined(item.actualAfterRepair.stonePrice) ? null : item.actualAfterRepair.stonePrice,
                        "marketAdjustment": angular.isUndefined(item.actualAfterRepair) ? null : angular.isUndefined(item.actualAfterRepair.marketAdjustment) ? null : item.actualAfterRepair.marketAdjustment,
                        "subTotal": angular.isUndefined(item.actualAfterRepair) ? null : angular.isUndefined(item.actualAfterRepair.subTotal) ? null : item.actualAfterRepair.subTotal,
                        "wholesaleBuyerAdj": angular.isUndefined(item.actualAfterRepair) ? null : angular.isUndefined(item.actualAfterRepair.wholesaleBuyerAdj) ? null : item.actualAfterRepair.wholesaleBuyerAdj,
                        "salvageValue": angular.isUndefined(item.actualAfterRepair) ? null : angular.isUndefined(item.actualAfterRepair.salvageValue) ? null : item.actualAfterRepair.salvageValue,
                        "cuttingCharge": angular.isUndefined(item.actualAfterRepair) ? null : angular.isUndefined(item.actualAfterRepair.cuttingCharge) ? null : item.actualAfterRepair.cuttingCharge,
                        "certificateType": {
                            "id": angular.isUndefined(item.actualAfterRepair) ? null : angular.isUndefined(item.actualAfterRepair.certificateType) || item.actualAfterRepair.certificateType == null ? null : item.actualAfterRepair.certificateType.id
                        },
                        "certFee": angular.isUndefined(item.actualAfterRepair) ? null : angular.isUndefined(item.actualAfterRepair.certFee) ? null : item.actualAfterRepair.certFee,
                        "shippingFee": angular.isUndefined(item.actualAfterRepair) ? null : angular.isUndefined(item.actualAfterRepair.shippingFee) ? null : item.actualAfterRepair.shippingFee,
                        "netProcessds": angular.isUndefined(item.actualAfterRepair) ? null : angular.isUndefined(item.actualAfterRepair.netProcessds) ? null : item.actualAfterRepair.netProcessds
                    },
                    "replacementQuoted": null,
                    //{
                    //    "description": angular.isUndefined(item.replacementQuoted) ? null : angular.isUndefined(item.replacementQuoted.description) ? null : item.replacementQuoted.description,
                    //    "replacementQuote": angular.isUndefined(item.replacementQuoted) ? null : angular.isUndefined(item.replacementQuoted.replacementQuote) ? null : item.replacementQuoted.replacementQuote,
                    //    "appraisalValue": angular.isUndefined(item.replacementQuoted) ? null : angular.isUndefined(item.replacementQuoted.appraisalValue) ? null : item.replacementQuoted.appraisalValue,
                    //    "scheduledValue": angular.isUndefined(item.replacementQuoted) ? null : angular.isUndefined(item.replacementQuoted.scheduledValue) ? null : item.replacementQuoted.scheduledValue
                    //},
                    "toDelete": false,
                    "explanation": angular.isUndefined(item.explanation) ? null : (item.explanation),
                    "id": angular.isUndefined(item.id) ? null : item.id
                });
            })
        }
        var Param = {
            "id": angular.isUndefined($scope.itemSalvageDetails.id) ? null : $scope.itemSalvageDetails.id,
            "salvageId": angular.isUndefined($scope.itemSalvageDetails.salvageId) ? null : $scope.itemSalvageDetails.salvageId,
            "adjusterDescription": $scope.itemSalvageDetails.adjusterDescription,
            "gemLabDescription": $scope.itemSalvageDetails.gemLabDescription,
            "salvageDate": $filter('DatabaseDateFormatMMddyyyy')($scope.currentDate),
            "cuttersDate": $filter('DatabaseDateFormatMMddyyyy')($scope.itemSalvageDetails.cuttersDate),
            "giaDate": $filter('DatabaseDateFormatMMddyyyy')($scope.itemSalvageDetails.giaDate),
            "claimItem": {
                "itemUID": angular.isUndefined($scope.itemSalvageDetails.itemUID) ? $scope.ItemDetails.itemUID : $scope.itemSalvageDetails.itemUID
            },
            "salvageItemStatus": {
                "id": angular.isUndefined($scope.itemSalvageDetails.salvageItemStatus) || $scope.itemSalvageDetails.salvageItemStatus == null ? null : angular.isUndefined($scope.itemSalvageDetails.salvageItemStatus.id) ? null : $scope.itemSalvageDetails.salvageItemStatus.id
            },
            "sellingRateDetails": {
                "soldPrice": angular.isUndefined($scope.itemSalvageDetails.sellingRateDetails) ? null : angular.isUndefined($scope.itemSalvageDetails.sellingRateDetails.soldPrice) ? null : $scope.itemSalvageDetails.sellingRateDetails.soldPrice,
                "dateOfSale": angular.isUndefined($scope.itemSalvageDetails.sellingRateDetails) ? null : angular.isUndefined($scope.itemSalvageDetails.sellingRateDetails.dateOfSale) ? null : $filter('DatabaseDateFormatMMddyyyy')($scope.itemSalvageDetails.sellingRateDetails.dateOfSale),
                "commissionRate": angular.isUndefined($scope.itemSalvageDetails.sellingRateDetails) ? null : angular.isUndefined($scope.itemSalvageDetails.sellingRateDetails.commissionRate) ? null : $scope.itemSalvageDetails.sellingRateDetails.commissionRate,
                "subTotal": angular.isUndefined($scope.itemSalvageDetails.sellingRateDetails) ? null : angular.isUndefined($scope.itemSalvageDetails.sellingRateDetails.subTotal) ? null : $scope.itemSalvageDetails.sellingRateDetails.subTotal,
                "certReCutShipFee": angular.isUndefined($scope.itemSalvageDetails.sellingRateDetails) ? null : angular.isUndefined($scope.itemSalvageDetails.sellingRateDetails.certReCutShipFee) ? null : $scope.itemSalvageDetails.sellingRateDetails.certReCutShipFee,
                "netPrice": angular.isUndefined($scope.itemSalvageDetails.sellingRateDetails) ? null : angular.isUndefined($scope.itemSalvageDetails.sellingRateDetails.netPrice) ? null : $scope.itemSalvageDetails.sellingRateDetails.netPrice,
                "billingStatus": {
                    "id": angular.isUndefined($scope.itemSalvageDetails.sellingRateDetails) ? null : angular.isUndefined($scope.itemSalvageDetails.sellingRateDetails.billingStatus) || ($scope.itemSalvageDetails.sellingRateDetails.billingStatus == null) ? null : angular.isUndefined($scope.itemSalvageDetails.sellingRateDetails.billingStatus.id) ? null : $scope.itemSalvageDetails.sellingRateDetails.billingStatus.id
                },
                "soldTo": angular.isUndefined($scope.itemSalvageDetails.sellingRateDetails) ? null : angular.isUndefined($scope.itemSalvageDetails.sellingRateDetails.soldTo) ? null : $scope.itemSalvageDetails.sellingRateDetails.soldTo,
            },
            "billingDetails": {
                "checkAmount": angular.isUndefined($scope.itemSalvageDetails.billingDetails) ? null : angular.isUndefined($scope.itemSalvageDetails.billingDetails.checkAmount) ? null : $scope.itemSalvageDetails.billingDetails.checkAmount,
                "checkNumber": angular.isUndefined($scope.itemSalvageDetails.billingDetails) ? null : angular.isUndefined($scope.itemSalvageDetails.billingDetails.checkNumber) ? null : $scope.itemSalvageDetails.billingDetails.checkNumber,
                "datePaid": angular.isUndefined($scope.itemSalvageDetails.billingDetails) ? null : angular.isUndefined($scope.itemSalvageDetails.billingDetails.datePaid) ? null : $filter('DatabaseDateFormatMMddyyyy')($scope.itemSalvageDetails.billingDetails.datePaid),
                "status": {
                    "id": angular.isUndefined($scope.itemSalvageDetails.billingDetails) ? null : angular.isUndefined($scope.itemSalvageDetails.billingDetails.status) || ($scope.itemSalvageDetails.billingDetails.status == null) ? null : angular.isUndefined($scope.itemSalvageDetails.billingDetails.status.id) ? null : $scope.itemSalvageDetails.billingDetails.status.id,
                }
            },
            "salvageCustomerBuyBackDetails": {
                "salvageValue": angular.isUndefined($scope.itemSalvageDetails.salvageCustomerBuyBackDetails) ? null : angular.isUndefined($scope.itemSalvageDetails.salvageCustomerBuyBackDetails.salvageValue) ? null : $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.salvageValue,
                "commissionRate": angular.isUndefined($scope.itemSalvageDetails.salvageCustomerBuyBackDetails) ? null : angular.isUndefined($scope.itemSalvageDetails.salvageCustomerBuyBackDetails.commissionRate) ? null : $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.commissionRate,
                "shippingFee": angular.isUndefined($scope.itemSalvageDetails.salvageCustomerBuyBackDetails) ? null : angular.isUndefined($scope.itemSalvageDetails.salvageCustomerBuyBackDetails.shippingFee) ? null : $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.shippingFee,
                "evaluationFee": angular.isUndefined($scope.itemSalvageDetails.salvageCustomerBuyBackDetails) ? null : angular.isUndefined($scope.itemSalvageDetails.salvageCustomerBuyBackDetails.evaluationFee) ? null : $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.evaluationFee,
                "buyBackPrice": angular.isUndefined($scope.itemSalvageDetails.salvageCustomerBuyBackDetails) ? null : angular.isUndefined($scope.itemSalvageDetails.salvageCustomerBuyBackDetails.buyBackPrice) ? null : $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.buyBackPrice
            },
            "estimateDetail": null,
            "salvageDiamondStones": TempsalvageDiamondStones,
            "additionalStoneDetails": TempadditionalStoneDetailsDiamond,
            "metalDetails": {
                "metalType": {
                    "id": angular.isUndefined($scope.itemSalvageDetails.metalDetails) || $scope.itemSalvageDetails.metalDetails.metalType == null ? null : angular.isUndefined($scope.itemSalvageDetails.metalDetails.metalType) || ($scope.itemSalvageDetails.metalDetails.metalType == null) ? null : angular.isUndefined($scope.itemSalvageDetails.metalDetails.metalType.id) ? null : $scope.itemSalvageDetails.metalDetails.metalType.id
                },
                "weight": angular.isUndefined($scope.itemSalvageDetails.metalDetails) ? null : angular.isUndefined($scope.itemSalvageDetails.metalDetails.weight) ? null : $scope.itemSalvageDetails.metalDetails.weight,
                "totalPrice": angular.isUndefined($scope.itemSalvageDetails.metalDetails) ? null : angular.isUndefined($scope.itemSalvageDetails.metalDetails.totalPrice) ? null : $scope.itemSalvageDetails.metalDetails.totalPrice,
                "netPrice": angular.isUndefined($scope.itemSalvageDetails.metalDetails) ? null : angular.isUndefined($scope.itemSalvageDetails.metalDetails.netPrice) ? null : $scope.itemSalvageDetails.metalDetails.netPrice,
                "spotPrice": angular.isUndefined($scope.itemSalvageDetails.metalDetails) ? null : angular.isUndefined($scope.itemSalvageDetails.metalDetails.spotPrice) ? null : $scope.itemSalvageDetails.metalDetails.spotPrice,
                "contracted": angular.isUndefined($scope.itemSalvageDetails.metalDetails) ? null : angular.isUndefined($scope.itemSalvageDetails.metalDetails.contracted) ? null : $scope.itemSalvageDetails.metalDetails.contracted,
                "date": angular.isUndefined($scope.itemSalvageDetails.metalDetails) ? null : angular.isUndefined($scope.itemSalvageDetails.metalDetails.date) ? null : $filter('DatabaseDateFormatMMddyyyy')($scope.itemSalvageDetails.metalDetails.date)
                },
            "relacementDetails":{
                "description": angular.isUndefined($scope.itemSalvageDetails.relacementDetails) || $scope.itemSalvageDetails.relacementDetails == null ? null : angular.isUndefined($scope.itemSalvageDetails.relacementDetails.description) ? null : $scope.itemSalvageDetails.relacementDetails.description,
                "replacementQuote": angular.isUndefined($scope.itemSalvageDetails.relacementDetails) || $scope.itemSalvageDetails.relacementDetails == null ? null : angular.isUndefined($scope.itemSalvageDetails.relacementDetails.replacementQuote) ? null : $scope.itemSalvageDetails.relacementDetails.replacementQuote,
                "appraisalValue": angular.isUndefined($scope.itemSalvageDetails.relacementDetails) || $scope.itemSalvageDetails.relacementDetails == null ? null : angular.isUndefined($scope.itemSalvageDetails.relacementDetails.appraisalValue) ? null : $scope.itemSalvageDetails.relacementDetails.appraisalValue,
                "scheduledValue": angular.isUndefined($scope.itemSalvageDetails.relacementDetails) || $scope.itemSalvageDetails.relacementDetails == null ? null : angular.isUndefined($scope.itemSalvageDetails.relacementDetails.scheduledValue) ? null : $scope.itemSalvageDetails.relacementDetails.scheduledValue,
            },
            "salvageTotal": angular.isUndefined($scope.itemSalvageDetails.salvageTotal) ? null : $scope.itemSalvageDetails.salvageTotal,
            "explanation": null,
            "otherSalvageValue": angular.isUndefined($scope.itemSalvageDetails.otherSalvageValue) ? null : ($scope.itemSalvageDetails.otherSalvageValue),
            "salvageProfile": {
                "id": $scope.itemSalvageDetails.salvageProfile.id
            },
            "companyRegistration": sessionStorage.getItem("CompanyCRN")
        }
        data.append("salvageDetails", JSON.stringify(Param));
        var SaveSalvage = SalvageService.AddDiamondSalvage(data);
        SaveSalvage.then(function (success) {
            toastr.remove();
            toastr.success(success.data.message, "Confirmation");
            
            GetSalvageDetails();
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
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

    $scope.GetFloursenceName = GetFloursenceName;
    function GetFloursenceName(id) {
        var name = "";
        angular.forEach($scope.fluorescenceList, function (item) {
            if (item.id == id) {
                name = item.name;
            }
        });
        return name;
    };
    $scope.GetSymmetryName = GetSymmetryName;
    function GetSymmetryName(id) {
        var name = "";
        angular.forEach($scope.symmetryList, function (item) {
            if (item.id == id) {
                name = item.name;
            }
        });
        return name;
    };

    $scope.GetPolishName = GetPolishName;
    function GetPolishName(id) {
        var name = "";
        angular.forEach($scope.polishList, function (item) {
            if (item.id == id) {
                name = item.name;
            }
        });
        return name;
    };
    $scope.GetColorName = GetColorName;
    function GetColorName(id) {
        var name = "";
        angular.forEach($scope.StoneColorList, function (item) {
            if (item.id == id) {
                name = item.name;
            }
        });
        return name;
    };
    $scope.GetClarityName = GetClarityName;
    function GetClarityName(id) {
        var name = "";
        angular.forEach($scope.StoneClarityList, function (item) {
            if (item.id == id) {
                name = item.name;
            }
        });
        return name;
    };
    $scope.GetShapeName = GetShapeName;
    function GetShapeName(id) {
        var name = "";
        angular.forEach($scope.StoneShapeList, function (item) {
            if (item.id == id) {
                name = item.name;
            }
        });
        return name;
    };

    //Start Finished Jewelry
    //Initialy declare the list
    $scope.FinishedJewelryTab = 1;
    $scope.FinishedJewelryItemList = [{
        id: null,
        number: 1,
        "mainStone": [],
        "salvageEstimate": [],
        Replacemet_Quoted: [],
    }];
    $scope.ShowFinishedJewelryTab = ShowFinishedJewelryTab;
    function ShowFinishedJewelryTab(index) {
        var currenttab = index + 1;
        $scope.FinishedJewelryTab = currenttab;
    };
    $scope.AddNewFinishedJewelry = AddNewFinishedJewelry;
    function AddNewFinishedJewelry() {
        var item = $scope.FinishedJewelryItemList.length + 1;
        $scope.FinishedJewelryItemList.push({
            id: null,
            number: item,
            "mainStone": [],
            "salvageEstimate": [],
            Replacemet_Quoted: [],
        });
    };
    $scope.RemoveFinishedJewelryTab = RemoveFinishedJewelryTab;
    function RemoveFinishedJewelryTab(index) {
        $scope.FinishedJewelryItemList.splice(index, 1);
    };
    //End Finished Jewelry

    //Start Gemstone 
    //Initialy declare the list
    $scope.GemstoneTab = 1;
    $scope.salvageDiamondStones = [{
        id: null,
        number: 1,
        "originalStone": {
        },
        "estimateBeforeRepair": {
        },
        "actualAfterRepair": {
        },
        "replacementQuoted": {
        }
    }];
    $scope.ShowGemstoneTab = ShowGemstoneTab;
    function ShowGemstoneTab(index) {
        var currenttab = index + 1;
        $scope.GemstoneTab = currenttab;
    };
    $scope.AddNewGemstone = AddNewGemstone;
    function AddNewGemstone() {
        var item = $scope.salvageDiamondStones.length + 1;
        $scope.salvageDiamondStones.push({
            id: null,
            number: item,
            "originalStone": {
            },
            "estimateBeforeRepair": {
            },
            "actualAfterRepair": {
            },
            "replacementQuoted": {
            }
        });
    };
    $scope.RemoveGemstoneTab = RemoveGemstoneTab;
    function RemoveGemstoneTab(index) {
        $scope.salvageDiamondStones.splice(index, 1);
    };
    $scope.calculateSalvageTotalGemstone = calculateSalvageTotalGemstone;
    function calculateSalvageTotalGemstone() {
        $scope.salvageMainStone = [];
        var Totalprice = 0;
        if (angular.isDefined($scope.salvageDiamondStones)) {
            angular.forEach($scope.salvageDiamondStones, function (Item) {
                if (angular.isUndefined(Item.actualAfterRepair.netProcessds) || Item.actualAfterRepair.netProcessds== "") {
                    if (angular.isUndefined(Item.estimateBeforeRepair.net) || Item.estimateBeforeRepair.netProcessds == "") {
                        $scope.salvageMainStone.push(0);
                    } else {
                        $scope.salvageMainStone.push(Item.estimateBeforeRepair.net);
                        Totalprice += parseFloat(Item.estimateBeforeRepair.net);
                    }
                } else {
                    $scope.salvageMainStone.push(Item.actualAfterRepair.netProcessds);
                    Totalprice += parseFloat(Item.actualAfterRepair.netProcessds);
                }
            });
        }
        
        if (angular.isDefined($scope.additionalStoneDetailsGemstone))
        {
            angular.forEach($scope.additionalStoneDetailsGemstone, function (item) {
                Totalprice += parseFloat(item.totalPrice);
            });
        }
        if (angular.isDefined($scope.itemSalvageDetails.metalDetails))
        {
            var metalprice = angular.isUndefined($scope.itemSalvageDetails.metalDetails.netPrice) ? 0 : $scope.itemSalvageDetails.metalDetails.netPrice == "" ? 0 : $scope.itemSalvageDetails.metalDetails.netPrice;
            Totalprice += parseFloat(metalprice);
        }
        
        $scope.itemSalvageDetails.salvageTotal = parseFloat(Totalprice);
        $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.salvageValue = $scope.itemSalvageDetails.salvageTotal;
    }
    //End Gemstone 

    //Start Dimand 
    //Initialy declare the list
    $scope.salvageDiamondItem = [{
        id: null,
        number: 1,
        "originalStone": {
        },
        "estimateBeforeRepair": {
        },
        "actualAfterRepair": {
        },
        "replacementQuoted": {
        }
    }];
    $scope.DimondTab = 1;
    $scope.DimondItemList = [{
        id: null,
        number: 1,
        "originalStone": {
        },
        "estimateBeforeRepair": {
        },
        "actualAfterRepair": {
        },
        "replacementQuoted": {
        },
        explanation: "The diamonds original description/appraisal stated _ in color but the actual color is _. In addition, the diamond clarity was stated to be _ but the actual Clarity is _. The weight loss of the stone is _ %."
       // explanation: "The diamonds orignal description/appraisal stated ____ color and actual color is ____ which is ____ grade(s) lower.In additon, the dimond clarity was stated to be ____ and actual is ____ which is ____ grade(s) lower.The weight loss of the stone was ____%"
    }];
    $scope.ShowDimondTab = ShowDimondTab;
    function ShowDimondTab(index) {
        var currenttab = index + 1;
        $scope.DimondTab = currenttab;
    };
    $scope.AddNewDimond = AddNewDimond;
    function AddNewDimond() {
        var item = $scope.DimondItemList.length + 1;
        $scope.DimondItemList.push({
            id: null,
            number: item,
            "originalStone": {
            },
            "estimateBeforeRepair": {
            },
            "actualAfterRepair": {
            },
            "replacementQuoted": {
            },
           // explanation: "The diamonds orignal description/appraisal stated ____ color and actual color is ____ which is ____ grade(s) lower.In additon, the dimond clarity was stated to be ____ and actual is ____ which is ____ grade(s) lower.The weight loss of the stone was ____%"
            explanation: "The diamonds original description/appraisal stated _ in color but the actual color is _. In addition, the diamond clarity was stated to be _ but the actual Clarity is _. The weight loss of the stone is _ %."
        });
    };
    $scope.RemoveDimondTab = RemoveDimondTab;
    function RemoveDimondTab(index) {
        $scope.DimondItemList.splice(index, 1);
    };
    //End Dimand 

    //start addional stone gemston
    $scope.AddNewStoneItemGemstone = AddNewStoneItemGemstone;
    function AddNewStoneItemGemstone() {
        $scope.selectedStoneGemstone = {};
        $scope.NewStoneItemGemstone = true;
        // $scope.EditPaymentTerm = false;
    };
    $scope.NewStoneItemGemstone = false;
    $scope.selectedStoneGemstone = {};
    $scope.additionalStoneDetailsGemstone = [];
    $scope.getTemplateSalvageStoneGemstone = function getTemplateSalvageStoneGemstone(item) {
        if (!angular.isUndefined(item)) {
            if (item.stoneUID === $scope.selectedStoneGemstone.stoneUID)
                return 'editSalvageStoneGemstone';
            else
                return 'displaySalvageStoneGemstone';
        }
        else
            return 'displaySalvageStoneGemstone';
    };
    $scope.addRemoveStoneItemGemstone = addRemoveStoneItemGemstone;
    function addRemoveStoneItemGemstone(operationFlag, operationType) {
        if (operationFlag == 1 && operationType == "Add") {
            //$scope.additionalStoneDetailsGemstone.push($scope.selectedStone)

            $scope.additionalStoneDetailsGemstone.push({
                id: angular.isUndefined($scope.selectedStoneGemstone.id) ? null : $scope.selectedStoneGemstone.id,
                stoneUID: $scope.selectedStoneGemstone.stoneUID,
                stoneType: {
                    id: $scope.selectedStoneGemstone.stoneType.id,
                    name: $scope.getStoneTypeName($scope.selectedStoneGemstone.stoneType.id)
                },
                individualWeight: $scope.selectedStoneGemstone.individualWeight,
                quantity: $scope.selectedStoneGemstone.quantity,
                totalCaratWeight: $scope.selectedStoneGemstone.totalCaratWeight,
                pricePerCarat: $scope.selectedStoneGemstone.pricePerCarat,
                totalPrice: $scope.selectedStoneGemstone.totalPrice,
            });
            $scope.NewStoneItemGemstone = false;
            //  $scope.GetTotalPriceGemstone();
        }
        else if (operationType == "Edit") {
            //$scope.OrderLbourCharges_ItemList[operationFlag]($scope.selectedLbourCharges);
            $scope.additionalStoneDetailsGemstone[operationFlag] = {
                id: $scope.selectedStoneGemstone.id,
                stoneUID: $scope.selectedStoneGemstone.stoneUID,
                stoneType: {
                    id: $scope.selectedStoneGemstone.stoneType.id,
                    name: $scope.getStoneTypeName($scope.selectedStoneGemstone.stoneType.id)
                },
                individualWeight: $scope.selectedStoneGemstone.individualWeight,
                quantity: $scope.selectedStoneGemstone.quantity,
                totalCaratWeight: $scope.selectedStoneGemstone.totalCaratWeight,
                pricePerCarat: $scope.selectedStoneGemstone.pricePerCarat,
                totalPrice: $scope.selectedStoneGemstone.totalPrice,
            };
            // $scope.GetTotalPriceGemstone();
        }
        else if (operationType == "Remove") {

            $scope.additionalStoneDetailsGemstone.splice(operationFlag, 1);
            $scope.GetTotalPriceGemstone();
        }
        else if (operationType == "Cancel") {
            $scope.selectedStoneGemstone = {};
            $scope.NewStoneItemGemstone = false;
        }
        $scope.selectedStoneGemstone = {};
        calculateSalvageTotalGemstone();
    };
    $scope.EditSalvageStoneItemGemstone = EditSalvageStoneItemGemstone;
    function EditSalvageStoneItemGemstone(item) {
        $scope.selectedStoneGemstone = angular.copy(item);
    }
    $scope.GetTotalPriceGemStone = GetTotalPriceGemStone;
    function GetTotalPriceGemStone() {
        $scope.selectedStoneGemstone.pricePerCarat = angular.isUndefined($scope.selectedStoneGemstone.pricePerCarat) ? 0 : $scope.selectedStoneGemstone.pricePerCarat;
        $scope.selectedStoneGemstone.totalCaratWeight = angular.isUndefined($scope.selectedStoneGemstone.totalCaratWeight) ? 0 : $scope.selectedStoneGemstone.totalCaratWeight;
        if (angular.isDefined($scope.selectedStoneGemstone)) {
            $scope.selectedStoneGemstone.totalPrice = parseFloat($scope.selectedStoneGemstone.pricePerCarat) * parseFloat($scope.selectedStoneGemstone.totalCaratWeight);
        }
        
    };
    //Stop addional stone gemston

    //start addional stone LuxuryWatch
    $scope.AddNewStoneItemLuxuryWatch = AddNewStoneItemLuxuryWatch;
    function AddNewStoneItemLuxuryWatch() {
        $scope.selectedStoneLuxuryWatch = {};
        $scope.NewStoneItemLuxuryWatch = true;
    };
    $scope.NewStoneItemLuxuryWatch = false;
    $scope.selectedStoneLuxuryWatch = {};
    $scope.additionalStoneDetailsLuxuryWatch = [];
    $scope.getTemplateSalvageStoneLuxuryWatch = function getTemplateSalvageStoneLuxuryWatch(item) {
        if (!angular.isUndefined(item)) {
            if (item.stoneUID === $scope.selectedStoneLuxuryWatch.stoneUID)
                return 'editSalvageStoneLuxuryWatch';
            else
                return 'displaySalvageStoneLuxuryWatch';
        }
        else
            return 'displaySalvageStoneLuxuryWatch';
    };
    $scope.addRemoveStoneItemLuxuryWatch = addRemoveStoneItemLuxuryWatch;
    function addRemoveStoneItemLuxuryWatch(operationFlag, operationType) {
        if (operationFlag == 1 && operationType == "Add") {
            //$scope.additionalStoneDetailsLuxuryWatch.push($scope.selectedStone)

            $scope.additionalStoneDetailsLuxuryWatch.push({
                id: angular.isUndefined($scope.selectedStoneLuxuryWatch.id) ? null : $scope.selectedStoneLuxuryWatch.id,
                stoneUID: $scope.selectedStoneLuxuryWatch.stoneUID,
                stoneType: {
                    id: $scope.selectedStoneLuxuryWatch.stoneType.id,
                    name: $scope.getStoneTypeName($scope.selectedStoneLuxuryWatch.stoneType.id)
                },
                individualWeight: $scope.selectedStoneLuxuryWatch.individualWeight,
                quantity: $scope.selectedStoneLuxuryWatch.quantity,
                totalCaratWeight: $scope.selectedStoneLuxuryWatch.totalCaratWeight,
                pricePerCarat: $scope.selectedStoneLuxuryWatch.pricePerCarat,
                totalPrice: $scope.selectedStoneLuxuryWatch.totalPrice,
            });
            $scope.NewStoneItemLuxuryWatch = false;
        }
        else if (operationType == "Edit") {
            $scope.additionalStoneDetailsLuxuryWatch[operationFlag] = {
                id: $scope.selectedStoneLuxuryWatch.id,
                stoneUID: $scope.selectedStoneLuxuryWatch.stoneUID,
                stoneType: {
                    id: $scope.selectedStoneLuxuryWatch.stoneType.id,
                    name: $scope.getStoneTypeName($scope.selectedStoneLuxuryWatch.stoneType.id)
                },
                individualWeight: $scope.selectedStoneLuxuryWatch.individualWeight,
                quantity: $scope.selectedStoneLuxuryWatch.quantity,
                totalCaratWeight: $scope.selectedStoneLuxuryWatch.totalCaratWeight,
                pricePerCarat: $scope.selectedStoneLuxuryWatch.pricePerCarat,
                totalPrice: $scope.selectedStoneLuxuryWatch.totalPrice,
            };
            // $scope.GetTotalPriceLuxuryWatch();
        }
        else if (operationType == "Remove") {

            $scope.additionalStoneDetailsLuxuryWatch.splice(operationFlag, 1);
            $scope.GetTotalPriceLuxuryWatch();
        }
        else if (operationType == "Cancel") {
            $scope.selectedStoneLuxuryWatch = {};
            $scope.NewStoneItemLuxuryWatch = false;
        }
        $scope.selectedStoneLuxuryWatch = {};
        calculateSalvageTotalLuxuryWatch();
    };
    $scope.EditSalvageStoneItemLuxuryWatch = EditSalvageStoneItemLuxuryWatch;
    function EditSalvageStoneItemLuxuryWatch(item) {
        $scope.selectedStoneLuxuryWatch = angular.copy(item);
    }
    $scope.GetTotalPriceLuxuryWatch = GetTotalPriceLuxuryWatch;
    function GetTotalPriceLuxuryWatch() {
        $scope.selectedStoneLuxuryWatch.pricePerCarat = angular.isUndefined($scope.selectedStoneLuxuryWatch.pricePerCarat) ? 0 : $scope.selectedStoneLuxuryWatch.pricePerCarat;
        $scope.selectedStoneLuxuryWatch.totalCaratWeight = angular.isUndefined($scope.selectedStoneLuxuryWatch.totalCaratWeight) ? 0 : $scope.selectedStoneLuxuryWatch.totalCaratWeight;
        if (angular.isDefined($scope.selectedStoneLuxuryWatch)) {
            $scope.selectedStoneLuxuryWatch.totalPrice = parseFloat($scope.selectedStoneLuxuryWatch.pricePerCarat) * parseFloat($scope.selectedStoneLuxuryWatch.totalCaratWeight);
        }
    };
    //Stop addional stone LuxuryWatch

    $scope.AddNewStoneItemDiamond = AddNewStoneItemDiamond;
    function AddNewStoneItemDiamond() {
        $scope.selectedStoneDiamond = {};
        $scope.NewStoneItemDiamond = true;
        // $scope.EditPaymentTerm = false;
    };
    $scope.getTemplateSalvageStoneDiamond = function getTemplateSalvageStoneDiamond(item) {
        if (!angular.isUndefined(item)) {
            if (item.stoneUID === $scope.selectedStoneDiamond.stoneUID)
                return 'editSalvageStoneDiamond';
            else
                return 'displaySalvageStoneDiamond';
        }
        else
            return 'displaySalvageStoneDiamond';
    };
    $scope.selectedStoneDiamond = {};
    $scope.additionalStoneDetailsDiamond = [];
    $scope.addRemoveStoneItemDiamond = addRemoveStoneItemDiamond;
    function addRemoveStoneItemDiamond(operationFlag, operationType) {
        if (operationFlag == 1 && operationType == "Add") {
            //$scope.additionalStoneDetailsGemstone.push($scope.selectedStone)

            $scope.additionalStoneDetailsDiamond.push({
                id: angular.isUndefined($scope.selectedStoneDiamond.id) ? null : $scope.selectedStoneDiamond.id,
                stoneUID: $scope.selectedStoneDiamond.stoneUID,
                stoneType: {
                    id: $scope.selectedStoneDiamond.stoneType.id,
                    name: $scope.getStoneTypeName($scope.selectedStoneDiamond.stoneType.id)
                },
                individualWeight: $scope.selectedStoneDiamond.individualWeight,
                quantity: $scope.selectedStoneDiamond.quantity,
                totalCaratWeight: $scope.selectedStoneDiamond.totalCaratWeight,
                pricePerCarat: $scope.selectedStoneDiamond.pricePerCarat,
                totalPrice: $scope.selectedStoneDiamond.totalPrice,
            });
            $scope.NewStoneItemDiamond = false;
            //  $scope.GetTotalPriceGemstone();
        }
        else if (operationType == "Edit") {
            //$scope.OrderLbourCharges_ItemList[operationFlag]($scope.selectedLbourCharges);

            $scope.additionalStoneDetailsDiamond[operationFlag] = {
                id: $scope.selectedStoneDiamond.id,
                stoneUID: $scope.selectedStoneDiamond.stoneUID,
                stoneType: {
                    id: $scope.selectedStoneDiamond.stoneType.id,
                    name: $scope.getStoneTypeName($scope.selectedStoneDiamond.stoneType.id)
                },
                individualWeight: $scope.selectedStoneDiamond.individualWeight,
                quantity: $scope.selectedStoneDiamond.quantity,
                totalCaratWeight: $scope.selectedStoneDiamond.totalCaratWeight,
                pricePerCarat: $scope.selectedStoneDiamond.pricePerCarat,
                totalPrice: $scope.selectedStoneDiamond.totalPrice,
            };
        }
        else if (operationType == "Remove") {

            $scope.additionalStoneDetailsDiamond.splice(operationFlag, 1);
            $scope.GetTotalPriceDiamond();
        }
        else if (operationType == "Cancel") {
            $scope.selectedStoneDiamond = {};
            $scope.NewStoneItemDiamond = false;
        }
        $scope.selectedStoneDiamond = {};
        calculateSalvageTotal();
        angular.forEach($scope.DimondItemList, function (Item) {
            Dimand_estimateBeforeRepair_StonePriceCalulation(Item);
            Dimand_actualAfterRepair_StonePriceCalulation(Item);
        })
       
    }

    $scope.EditSalvageStoneItemDiamond = EditSalvageStoneItemDiamond;
    function EditSalvageStoneItemDiamond(item) {
        $scope.selectedStoneDiamond = angular.copy(item);
    }

    $scope.GetTotalPriceDiamond = GetTotalPriceDiamond;
    function GetTotalPriceDiamond() {
        if (angular.isDefined($scope.selectedStoneDiamond)) {
            $scope.selectedStoneDiamond.totalPrice = parseFloat($scope.selectedStoneDiamond.pricePerCarat) * parseFloat($scope.selectedStoneDiamond.totalCaratWeight);
        }
        
    };
    //{"id":1,"name":"Diamond"},{"id":2,"name":"Gemstone"},{"id":3,"name":"Watch"},{"id":4,"name":"Finished Jewelry"}
    $scope.addSaveSalvage = addSaveSalvage;
    function addSaveSalvage() {
        if ($scope.itemSalvageDetails.salvageProfile.id == '1') {//Diamond
            saveDiamondSalvage();
        }
        else if ($scope.itemSalvageDetails.salvageProfile.id == '2') {//Gemstone
            SaveGemstoneSalvage();
        }
        else if ($scope.itemSalvageDetails.salvageProfile.id == '3') {//Watch
            saveLuxuryWatchSalvage();
        }
        else if ($scope.itemSalvageDetails.salvageProfile.id == '4') {//Finished Jewelry
            saveFinishedItemSalvage();
        }
        else {
            toastr.remove();
            toastr.error(AuthHeaderService.genericErrorMessage(), "Error")
        }
    }

    $scope.getNameFromId = getNameFromId;
    function getNameFromId(list, id, itemNumber, listType) {

        if (list != null && list.length > 0) {
            angular.forEach(list, function (value) {
                if (value.id == id) {
                    if (listType == 'originalStoneColor') {
                        $scope.DimondItemList[itemNumber - 1].originalStone.color.name = value.name;
                    }
                    else if (listType == 'originalStoneClarity') {
                        $scope.DimondItemList[itemNumber - 1].originalStone.clarity.name = value.name;
                    }
                    else if (listType == 'actualAfterRepairClarity') {
                        $scope.DimondItemList[itemNumber - 1].actualAfterRepair.clarity.name = value.name
                    }
                    else if (listType == 'actualAfterRepairColor') {
                        $scope.DimondItemList[itemNumber - 1].actualAfterRepair.color.name = value.name
                    }
                    else if (listType == 'actualAfterRepairCutGrade') {
                        $scope.DimondItemList[itemNumber - 1].actualAfterRepair.cutGrade.name = value.name
                    }
                    else if (listType == 'salvageItemStatus') {
                        angular.forEach($scope.DropDownList.sellingRateStatus, function (item) {
                            if (item.id == id) {
                                $scope.itemSalvageDetails.salvageItemStatus.name = item.name;
                            }
                        });
                    }
                    else if (listType == 'FinishedItemStoneType') {

                        $scope.selectedStoneFinishedItem[itemNumber].stoneType.name = value.name;
                    }
                }
            });
        }
        var Item = $scope.DimondItemList[itemNumber - 1];
        if (Item) {
            $scope.DimondItemList[itemNumber - 1].explanation =
            "The diamonds original description/appraisal stated " +
            (angular.isUndefined(Item.originalStone) ? " _ " : angular.isUndefined(Item.originalStone.color) || Item.originalStone.color==null ? " _ " : Item.originalStone.color.name) +
            " in color but the actual color is " +
            (angular.isUndefined(Item.actualAfterRepair) ? " _ " : angular.isUndefined(Item.actualAfterRepair.color) ||Item.actualAfterRepair.color== null ? " _ " : Item.actualAfterRepair.color.name)
            + 
            ". In addition, the diamond clarity was stated to be " +
            (angular.isUndefined(Item.originalStone) ? " _ " : angular.isUndefined(Item.originalStone.clarity) || Item.originalStone.clarity == null ? " _ " : Item.originalStone.clarity.name) +
            " but the actual clarity is " +
            (angular.isUndefined(Item.actualAfterRepair) ? " _ " : angular.isUndefined(Item.actualAfterRepair.clarity) || Item.actualAfterRepair.clarity == null ? " _ " : Item.actualAfterRepair.clarity.name) +
            ". The weight loss of the stone is " +
            (angular.isUndefined(Item.estimateBeforeRepair.estWeightLoss) || Item.estimateBeforeRepair == null ? " _ " : Item.estimateBeforeRepair.estWeightLoss) +
            " %.";
        }

    }

    $scope.calculateSalvageTotal = calculateSalvageTotal;
    function calculateSalvageTotal() {
        $scope.itemSalvageDetails.salvageTotal = 0;
        $scope.DimandMainStone = [];
        var total = 0;
        if ($scope.DimondItemList.length > 0) {
            angular.forEach($scope.DimondItemList, function (diamond) {
                if (angular.isUndefined(diamond.actualAfterRepair.netProcessds) || diamond.actualAfterRepair.netProcessds == "") {
                    if (angular.isUndefined(diamond.estimateBeforeRepair.net) || diamond.estimateBeforeRepair.net == "") {
                        $scope.DimandMainStone.push(0);
                    } else {
                        $scope.DimandMainStone.push(diamond.estimateBeforeRepair.net);
                        total += parseFloat(diamond.estimateBeforeRepair.net)
                    }
                } else {
                    $scope.DimandMainStone.push(diamond.actualAfterRepair.netProcessds)
                    total += parseFloat(diamond.actualAfterRepair.netProcessds)
                }
            });
        }
        if ($scope.additionalStoneDetailsDiamond.length > 0) {
            angular.forEach($scope.additionalStoneDetailsDiamond, function (stone) {
                total += angular.isUndefined(stone.totalPrice) ? 0 : parseFloat(stone.totalPrice)
            });
        }
        total += angular.isUndefined($scope.itemSalvageDetails.metalDetails) ? 0 : angular.isUndefined($scope.itemSalvageDetails.metalDetails.netPrice) ? 0 : parseFloat($scope.itemSalvageDetails.metalDetails.netPrice);

        $scope.itemSalvageDetails.salvageTotal = total;
        $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.salvageValue = total;
    }

    $scope.calculateSalvageTotalLuxuryWatch = calculateSalvageTotalLuxuryWatch;
    function calculateSalvageTotalLuxuryWatch() {
        //Total(Summary) = Watch + Additional Stones + Metal = Total

        $scope.itemSalvageDetails.salvageTotal = 0;
        var total = 0;
        if ($scope.additionalStoneDetailsLuxuryWatch.length > 0) {
            angular.forEach($scope.additionalStoneDetailsLuxuryWatch, function (stone) {
                total += angular.isUndefined(stone.totalPrice) ? 0 : parseFloat(stone.totalPrice)
            });
        }
        total += angular.isUndefined($scope.itemSalvageDetails.metalDetails) ? 0 : angular.isUndefined($scope.itemSalvageDetails.metalDetails.netPrice) ? 0 : parseFloat($scope.itemSalvageDetails.metalDetails.netPrice);
        total += angular.isUndefined($scope.itemSalvageDetails.estimateDetail) ? 0 : angular.isUndefined($scope.itemSalvageDetails.estimateDetail.netProceeds) ? 0 : parseFloat($scope.itemSalvageDetails.estimateDetail.netProceeds);
        $scope.itemSalvageDetails.salvageTotal = total;
        $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.salvageValue = total;
    }

    $scope.saveLuxuryWatchSalvage = saveLuxuryWatchSalvage;
    function saveLuxuryWatchSalvage() {
        $(".page-spinner-bar").removeClass("hide");

        var data = new FormData();
        $scope.filesDetails = [];
        angular.forEach($scope.attachmentListSalvage, function (ItemFile) {
            if (angular.isUndefined(ItemFile.imageId) || ItemFile.imageId == null) {
                $scope.filesDetails.push({
                    "fileType": ItemFile.FileType,
                    "fileName": ItemFile.FileName,
                    "extension": ItemFile.FileExtension,
                    "filePurpose": "ITEM_SALVAGE_DETAILS",
                    "latitude": 41.40,
                    "longitude": 2.17
                });
                data.append('file', ItemFile.File);
            }
        });
        if ($scope.attachmentListSalvage.length == 0 || $scope.attachmentListSalvage == null) {
            data.append('filesDetails', null);
            data.append('file', null);
        } else {
            data.append('filesDetails', JSON.stringify($scope.filesDetails));
        }

        var TempadditionalStoneDetailsLuxuryWatch = [];
        if ($scope.additionalStoneDetailsLuxuryWatch.length > 0) {
            angular.forEach($scope.additionalStoneDetailsLuxuryWatch, function (item) {
                TempadditionalStoneDetailsLuxuryWatch.push({
                    "id": angular.isUndefined(item.id) ? null : item.id,
                    "stoneType": {
                        "id": item.stoneType.id,
                    },
                    "additionalStoneUID": (item.id == null) ? null : item.stoneUID,
                    "isDelete": null,
                    "individualWeight": item.individualWeight,
                    "quantity": item.quantity,
                    "totalCaratWeight": item.totalCaratWeight,
                    "pricePerCarat": item.pricePerCarat,
                    "totalPrice": item.totalPrice
                });
            });
        } else {
            TempadditionalStoneDetailsLuxuryWatch = null;
        }

        var TempSalvageBidDetails = [];
        if ($scope.itemSalvageDetails.salvageBidsDetails.length > 0) {
            angular.forEach($scope.itemSalvageDetails.salvageBidsDetails, function (item) {
                TempSalvageBidDetails.push({
                    "date": $filter('DatabaseDateFormatMMddyyyy')(item.date),
                    "bidValue": item.bidValue,
                    "id": null,
                    "vendor": {
                        "vendorId": sessionStorage.getItem("VendorId"),
                    },
                    "vendorName": item.vendorName,
                });
            });
        }
        var Param = {
            "id": angular.isUndefined($scope.itemSalvageDetails.id) ? null : $scope.itemSalvageDetails.id,
            "salvageId": angular.isUndefined($scope.itemSalvageDetails.salvageId) ? null : $scope.itemSalvageDetails.salvageId,
            "adjusterDescription": $scope.itemSalvageDetails.adjusterDescription,
            "gemLabDescription": $scope.itemSalvageDetails.gemLabDescription,
            "salvageDate": $filter('DatabaseDateFormatMMddyyyy')($scope.currentDate),
            "cuttersDate": $filter('DatabaseDateFormatMMddyyyy')($scope.itemSalvageDetails.cuttersDate),
            "giaDate": $filter('DatabaseDateFormatMMddyyyy')($scope.itemSalvageDetails.giaDate),
            "claimItem": {
                "itemUID": angular.isUndefined($scope.itemSalvageDetails.itemUID) ? $scope.ItemDetails.itemUID : $scope.itemSalvageDetails.itemUID
            },
            "itemEvaluationDetails": null,
            "salvageItemStatus": {
                "id": angular.isUndefined($scope.itemSalvageDetails.salvageItemStatus) || $scope.itemSalvageDetails.salvageItemStatus == null ? null : angular.isUndefined($scope.itemSalvageDetails.salvageItemStatus.id) ? null : $scope.itemSalvageDetails.salvageItemStatus.id,
            },
            "sellingRateDetails": {
                "id": angular.isUndefined($scope.itemSalvageDetails.sellingRateDetails) ? null : angular.isUndefined($scope.itemSalvageDetails.sellingRateDetails.id) ? null : $scope.itemSalvageDetails.sellingRateDetails.id,
                "soldPrice": angular.isUndefined($scope.itemSalvageDetails.sellingRateDetails) ? null : angular.isUndefined($scope.itemSalvageDetails.sellingRateDetails.soldPrice) ? null : $scope.itemSalvageDetails.sellingRateDetails.soldPrice,
                "dateOfSale": $filter('DatabaseDateFormatMMddyyyy')($scope.itemSalvageDetails.sellingRateDetails.dateOfSale),
                "soldTo": angular.isUndefined($scope.itemSalvageDetails.sellingRateDetails) ? null : angular.isUndefined($scope.itemSalvageDetails.sellingRateDetails.soldTo) ? null : $scope.itemSalvageDetails.sellingRateDetails.soldTo,
                "commissionRate": angular.isUndefined($scope.itemSalvageDetails.sellingRateDetails) ? null : angular.isUndefined($scope.itemSalvageDetails.sellingRateDetails.commissionRate) ? null : $scope.itemSalvageDetails.sellingRateDetails.commissionRate,
                "subTotal": angular.isUndefined($scope.itemSalvageDetails.sellingRateDetails) ? null : angular.isUndefined($scope.itemSalvageDetails.sellingRateDetails.subTotal) ? null : $scope.itemSalvageDetails.sellingRateDetails.subTotal,
                "certReCutShipFee": angular.isUndefined($scope.itemSalvageDetails.sellingRateDetails) ? null : angular.isUndefined($scope.itemSalvageDetails.sellingRateDetails.certReCutShipFee) ? null : $scope.itemSalvageDetails.sellingRateDetails.certReCutShipFee,
                "netPrice": angular.isUndefined($scope.itemSalvageDetails.sellingRateDetails) ? null : angular.isUndefined($scope.itemSalvageDetails.sellingRateDetails.netPrice) ? null : $scope.itemSalvageDetails.sellingRateDetails.netPrice,
                "billingStatus": {
                    "id": angular.isUndefined($scope.itemSalvageDetails.sellingRateDetails) ? null : angular.isUndefined($scope.itemSalvageDetails.sellingRateDetails.billingStatus) ? null : $scope.itemSalvageDetails.sellingRateDetails.billingStatus.id,
                },
            },
            "billingDetails": {
                "checkAmount": angular.isUndefined($scope.itemSalvageDetails.billingDetails) ? null : angular.isUndefined($scope.itemSalvageDetails.billingDetails.checkAmount) ? null : $scope.itemSalvageDetails.billingDetails.checkAmount,
                "checkNumber": angular.isUndefined($scope.itemSalvageDetails.billingDetails) ? null : angular.isUndefined($scope.itemSalvageDetails.billingDetails.checkNumber) ? null : $scope.itemSalvageDetails.billingDetails.checkNumber,
                "datePaid": $filter('DatabaseDateFormatMMddyyyy')($scope.itemSalvageDetails.billingDetails.datePaid),
                "id": angular.isUndefined($scope.itemSalvageDetails.billingDetails) ? null : angular.isUndefined($scope.itemSalvageDetails.billingDetails.id) ? null : $scope.itemSalvageDetails.billingDetails.id,
                "status": {
                    "id": angular.isUndefined($scope.itemSalvageDetails.billingDetails) ? null : angular.isUndefined($scope.itemSalvageDetails.billingDetails.status) || ($scope.itemSalvageDetails.billingDetails.status == null) ? null : $scope.itemSalvageDetails.billingDetails.status.id,
                }
            },
            "salvageCustomerBuyBackDetails": {
                "id": null,
                "salvageValue": angular.isUndefined($scope.itemSalvageDetails.salvageCustomerBuyBackDetails) ? null : angular.isUndefined($scope.itemSalvageDetails.salvageCustomerBuyBackDetails.salvageValue) ? null : $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.salvageValue,
                "commissionRate": angular.isUndefined($scope.itemSalvageDetails.salvageCustomerBuyBackDetails) ? null : angular.isUndefined($scope.itemSalvageDetails.salvageCustomerBuyBackDetails.commissionRate) ? null : $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.commissionRate,
                "shippingFee": angular.isUndefined($scope.itemSalvageDetails.salvageCustomerBuyBackDetails) ? null : angular.isUndefined($scope.itemSalvageDetails.salvageCustomerBuyBackDetails.shippingFee) ? null : $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.shippingFee,
                "evaluationFee": angular.isUndefined($scope.itemSalvageDetails.salvageCustomerBuyBackDetails) ? null : angular.isUndefined($scope.itemSalvageDetails.salvageCustomerBuyBackDetails.evaluationFee) ? null : $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.evaluationFee,
                "buyBackPrice": angular.isUndefined($scope.itemSalvageDetails.salvageCustomerBuyBackDetails) ? null : angular.isUndefined($scope.itemSalvageDetails.salvageCustomerBuyBackDetails.buyBackPrice) ? null : $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.buyBackPrice
            },
            "salvageBidsDetails": TempSalvageBidDetails,
            "salvageEstimate": null,
            "statusDTO": null,
            "salvageDiamondStones": null,
            "salvageItemFinished": null,
            "additionalStoneDetails": TempadditionalStoneDetailsLuxuryWatch,
            "estimateDetail": {
                "id": angular.isUndefined($scope.itemSalvageDetails.estimateDetail) ? null : angular.isUndefined($scope.itemSalvageDetails.estimateDetail.id) ? null : $scope.itemSalvageDetails.estimateDetail.id,
                "estimatedSalvageValue": angular.isUndefined($scope.itemSalvageDetails.estimateDetail) ? null : angular.isUndefined($scope.itemSalvageDetails.estimateDetail.estimatedSalvageValue) ? null : $scope.itemSalvageDetails.estimateDetail.estimatedSalvageValue,
                "repairs": angular.isUndefined($scope.itemSalvageDetails.estimateDetail) ? null : angular.isUndefined($scope.itemSalvageDetails.estimateDetail.repairs) ? null : $scope.itemSalvageDetails.estimateDetail.repairs,
                "expenses": angular.isUndefined($scope.itemSalvageDetails.estimateDetail) ? null : angular.isUndefined($scope.itemSalvageDetails.estimateDetail.expenses) ? null : $scope.itemSalvageDetails.estimateDetail.expenses,
                "netProceeds": angular.isUndefined($scope.itemSalvageDetails.estimateDetail) ? null : angular.isUndefined($scope.itemSalvageDetails.estimateDetail.netProceeds) ? null : $scope.itemSalvageDetails.estimateDetail.netProceeds
            },
            "metalDetails": {
                "id": angular.isUndefined($scope.itemSalvageDetails.metalDetails) || $scope.itemSalvageDetails.metalDetails.metalType == null ? null : angular.isUndefined($scope.itemSalvageDetails.metalDetails.id) ? null : $scope.itemSalvageDetails.metalDetails.id,
                "metalType": {
                    "id": angular.isUndefined($scope.itemSalvageDetails.metalDetails) ? null : angular.isUndefined($scope.itemSalvageDetails.metalDetails.metalType.id) ? null : $scope.itemSalvageDetails.metalDetails.metalType.id,
                    "type": null
                },
                "weight": angular.isUndefined($scope.itemSalvageDetails.metalDetails) ? null : angular.isUndefined($scope.itemSalvageDetails.metalDetails.weight) ? null : $scope.itemSalvageDetails.metalDetails.weight,
                "totalPrice": angular.isUndefined($scope.itemSalvageDetails.metalDetails) ? null : angular.isUndefined($scope.itemSalvageDetails.metalDetails.totalPrice) ? null : $scope.itemSalvageDetails.metalDetails.totalPrice,
                "netPrice": angular.isUndefined($scope.itemSalvageDetails.metalDetails) ? null : angular.isUndefined($scope.itemSalvageDetails.metalDetails.netPrice) ? null : $scope.itemSalvageDetails.metalDetails.netPrice,
                "spotPrice": angular.isUndefined($scope.itemSalvageDetails.metalDetails) ? null : angular.isUndefined($scope.itemSalvageDetails.metalDetails.spotPrice) ? null : $scope.itemSalvageDetails.metalDetails.spotPrice,
                "contracted": angular.isUndefined($scope.itemSalvageDetails.metalDetails) ? null : angular.isUndefined($scope.itemSalvageDetails.metalDetails.contracted) ? null : $scope.itemSalvageDetails.metalDetails.contracted,
                "date": angular.isUndefined($scope.itemSalvageDetails.metalDetails) ? null : angular.isUndefined($scope.itemSalvageDetails.metalDetails.date) ? null : $filter('DatabaseDateFormatMMddyyyy')($scope.itemSalvageDetails.metalDetails.date),
                "salvageItemDetails": null

            },
            "salvageTotal": angular.isUndefined($scope.itemSalvageDetails.salvageTotal) ? null : $scope.itemSalvageDetails.salvageTotal,
            "updateDate": null,
            "explanation": null,
            "otherSalvageValue": angular.isUndefined($scope.itemSalvageDetails.otherSalvageValue) ? null : ($scope.itemSalvageDetails.otherSalvageValue),
            "salvageProfile": {
                "id": $scope.itemSalvageDetails.salvageProfile.id,
            },
            "relacementDetails": {
                "id": angular.isUndefined($scope.itemSalvageDetails.relacementDetails) || $scope.itemSalvageDetails.relacementDetails == null ? null : angular.isUndefined($scope.itemSalvageDetails.relacementDetails.id) ? null : $scope.itemSalvageDetails.relacementDetails.id,
                "description": angular.isUndefined($scope.itemSalvageDetails.relacementDetails) || $scope.itemSalvageDetails.relacementDetails == null ? null : angular.isUndefined($scope.itemSalvageDetails.relacementDetails.description) ? null : $scope.itemSalvageDetails.relacementDetails.description,
                "replacementQuote": angular.isUndefined($scope.itemSalvageDetails.relacementDetails) || $scope.itemSalvageDetails.relacementDetails == null ? null : angular.isUndefined($scope.itemSalvageDetails.relacementDetails.replacementQuote) ? null : $scope.itemSalvageDetails.relacementDetails.replacementQuote,
                "appraisalValue": angular.isUndefined($scope.itemSalvageDetails.relacementDetails) || $scope.itemSalvageDetails.relacementDetails == null ? null : angular.isUndefined($scope.itemSalvageDetails.relacementDetails.appraisalValue) ? null : $scope.itemSalvageDetails.relacementDetails.appraisalValue,
                "scheduledValue": angular.isUndefined($scope.itemSalvageDetails.relacementDetails) || $scope.itemSalvageDetails.relacementDetails == null ? null : angular.isUndefined($scope.itemSalvageDetails.relacementDetails.scheduledValue) ? null : $scope.itemSalvageDetails.relacementDetails.scheduledValue
            },
            "enable": null,
            "companyRegistration": sessionStorage.getItem("CompanyCRN")
        };
        data.append("salvageDetails", JSON.stringify(Param));

        if (angular.isDefined($scope.itemSalvageDetails.id)) {//update
            
            var UpdateSalvage = SalvageService.UpdateluxuryWatchSalvage(data);
            UpdateSalvage.then(function (success) {
                toastr.remove();
                toastr.success(success.data.message, "Confirmation");
                GetSalvageDetails();
                //var id = success.data.data.id;
                //GetLuxuryWatchSalvageDetails(id);
                $(".page-spinner-bar").addClass("hide");
            }, function (error) {
                toastr.remove();                
                if (error.data.errorMessage != null && angular.isDefined(error.data.errorMessage)) {
                    toastr.error(error.data.errorMessage, "Error")
                }
                else {
                    toastr.error(AuthHeaderService.genericErrorMessage(), "Error")
                }
                $(".page-spinner-bar").addClass("hide");
            });

        } else {//add
            var addSalvage = SalvageService.AddluxuryWatchSalvage(data);
            addSalvage.then(function (success) {
                toastr.remove();
                toastr.success(success.data.message, "Confirmation");
                GetSalvageDetails();
                //var id = success.data.data.id;
                //GetLuxuryWatchSalvageDetails(id);
                $(".page-spinner-bar").addClass("hide");
            }, function (error) {
                toastr.remove();
                if (error.data.errorMessage != null && angular.isDefined(error.data.errorMessage)) {
                    toastr.error(error.data.errorMessage, "Error")
                }
                else {
                    toastr.error(AuthHeaderService.genericErrorMessage(), "Error")
                }
                $(".page-spinner-bar").addClass("hide");
            });
                    }
    }

    $scope.NewFinishedItem = false;
    $scope.selectedStoneFinishedItem = {};
    $scope.additionalStoneDetailsFinishedItem = [];
    $scope.addRemoveStoneItemFinishedItem = addRemoveStoneItemFinishedItem;
    function addRemoveStoneItemFinishedItem(operationFlag, operationType) {
        if (operationFlag == 1 && operationType == "Add") {
            //$scope.additionalStoneDetailsGemstone.push($scope.selectedStone)

            $scope.additionalStoneDetailsFinishedItem.push({
                id: angular.isUndefined($scope.selectedStoneFinishedItem.id) ? null : $scope.selectedStoneFinishedItem.id,
                stoneUID: $scope.selectedStoneFinishedItem.stoneUID,
                stoneType: {
                    id: $scope.selectedStoneFinishedItem.stoneType.id,
                    name: $scope.getStoneTypeName($scope.selectedStoneFinishedItem.stoneType.id)
                },
                individualWeight: $scope.selectedStoneFinishedItem.individualWeight,
                quantity: $scope.selectedStoneFinishedItem.quantity,
                totalCaratWeight: $scope.selectedStoneFinishedItem.totalCaratWeight,
                pricePerCarat: $scope.selectedStoneFinishedItem.pricePerCarat,
                totalPrice: $scope.selectedStoneFinishedItem.totalPrice,
            });
            $scope.NewFinishedItem = false;
            //  $scope.GetTotalPriceGemstone();
        }
        else if (operationType == "Edit") {
            //$scope.OrderLbourCharges_ItemList[operationFlag]($scope.selectedLbourCharges);

            $scope.additionalStoneDetailsFinishedItem[operationFlag] = {
                id: $scope.selectedStoneFinishedItem.id,
                stoneUID: $scope.selectedStoneFinishedItem.stoneUID,
                stoneType: {
                    id: $scope.selectedStoneFinishedItem.stoneType.id,
                    name: $scope.getStoneTypeName($scope.selectedStoneFinishedItem.stoneType.id)
                },
                individualWeight: $scope.selectedStoneFinishedItem.individualWeight,
                quantity: $scope.selectedStoneFinishedItem.quantity,
                totalCaratWeight: $scope.selectedStoneFinishedItem.totalCaratWeight,
                pricePerCarat: $scope.selectedStoneFinishedItem.pricePerCarat,
                totalPrice: $scope.selectedStoneFinishedItem.totalPrice,
            };
        }
        else if (operationType == "Remove") {

            $scope.additionalStoneDetailsFinishedItem.splice(operationFlag, 1);
            $scope.GetTotalPriceFinishedItem();
        }
        else if (operationType == "Cancel") {
            $scope.selectedStoneFinishedItem = {};
            $scope.NewFinishedItem = false;
        }
        calculateSalvageTotalFinishedItem();
        $scope.selectedStoneFinishedItem = {};
    }

    $scope.EditSalvageStoneItemFinishedItem = EditSalvageStoneItemFinishedItem;
    function EditSalvageStoneItemFinishedItem(item) {
        $scope.selectedStoneFinishedItem = angular.copy(item);
    }

    $scope.GetTotalPriceFinishedItem = GetTotalPriceFinishedItem;
    function GetTotalPriceFinishedItem() {
        if (angular.isDefined($scope.selectedStoneFinishedItem)) {
            $scope.selectedStoneFinishedItem.totalPrice = parseFloat($scope.selectedStoneFinishedItem.pricePerCarat) * parseFloat($scope.selectedStoneFinishedItem.totalCaratWeight);
        }
       
    };

    $scope.AddNewFinishedItem = AddNewFinishedItem;
    function AddNewFinishedItem() {
        $scope.NewFinishedItem = true;
    }
    $scope.getTemplateSalvageStoneFinishedItem = function (item) {
        if (!angular.isUndefined(item)) {
            if (item.stoneUID === $scope.selectedStoneFinishedItem.stoneUID)
                return 'editSalvageStone';
            else
                return 'displaySalvageStone';
        }
        else
            return 'editSalvageStone';
    };
   
    $scope.calculateSalvageTotalFinishedItem = calculateSalvageTotalFinishedItem;
    function calculateSalvageTotalFinishedItem() {
       
        $scope.netProceeds = 0;
        $scope.itemSalvageDetails.salvageTotal = 0;
        var total = 0;
        
        $scope.additionalStone = [];
        if ($scope.additionalStoneDetailsFinishedItem.length > 0) {
            angular.forEach($scope.additionalStoneDetailsFinishedItem, function (stone) {
                $scope.additionalStone.push(angular.isUndefined(stone.totalPrice) ? 0 : parseFloat(stone.totalPrice));
                total += angular.isUndefined(stone.totalPrice) ? 0 : parseFloat(stone.totalPrice);
            });
        }
        $scope.itemSalvageDetails.otherSalvageValue = angular.isUndefined($scope.itemSalvageDetails.otherSalvageValue) ? 0 : parseFloat($scope.itemSalvageDetails.otherSalvageValue);
        $scope.itemSalvageDetails.metalDetails.netPrice=angular.isUndefined($scope.itemSalvageDetails.metalDetails) ? 0 : (angular.isUndefined($scope.itemSalvageDetails.metalDetails.netPrice) && $scope.itemSalvageDetails.metalDetails.netPrice == null) ? 0 : parseFloat($scope.itemSalvageDetails.metalDetails.netPrice);
        total += angular.isUndefined($scope.itemSalvageDetails.metalDetails) ? 0 : (angular.isUndefined($scope.itemSalvageDetails.metalDetails.netPrice) && $scope.itemSalvageDetails.metalDetails.netPrice == null) ? 0 : parseFloat($scope.itemSalvageDetails.metalDetails.netPrice);
        total += angular.isUndefined($scope.itemSalvageDetails.otherSalvageValue) ? 0 : parseFloat($scope.itemSalvageDetails.otherSalvageValue);

        if ($scope.FinishedJewelryItemList.length > 0) {
            var repairs = 0;
            var expenses = 0;
            angular.forEach($scope.FinishedJewelryItemList, function (diamond) {
                if (angular.isUndefined(diamond.mainStone) || diamond.mainStone == null) {
                    total += 0;
                } else if (angular.isUndefined(diamond.mainStone.salvageValue) || diamond.mainStone.salvageValue != null) {
                    total += angular.isUndefined(diamond.mainStone) ? 0 : (angular.isUndefined(diamond.mainStone.salvageValue) || diamond.mainStone.salvageValue == null) ? 0 : parseFloat(diamond.mainStone.salvageValue)
                }
                if (angular.isUndefined(diamond.salvageEstimate) || diamond.salvageEstimate == null) {
                    repairs += 0;
                    expenses += 0;
                } else {
                    repairs += (angular.isUndefined(diamond.salvageEstimate.repairs) || diamond.salvageEstimate.repairs == null ? 0 : parseFloat(diamond.salvageEstimate.repairs))
                    expenses += (angular.isUndefined(diamond.salvageEstimate.expenses) || diamond.salvageEstimate.expenses == null ? 0 : parseFloat(diamond.salvageEstimate.expenses))
                }
            });
            $scope.netProceeds = parseFloat(total) - parseFloat(repairs + expenses);
        }

        $scope.itemSalvageDetails.salvageTotal = total;
        $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.salvageValue = total;
    }

    $scope.saveFinishedItemSalvage = saveFinishedItemSalvage;
    function saveFinishedItemSalvage() {
        $(".page-spinner-bar").removeClass("hide");

        //if (angular.isDefined($scope.itemSalvageDetails.id) && $scope.itemSalvageDetails.id != null) {//update
            var data = new FormData();
            $scope.filesDetails = [];
            angular.forEach($scope.attachmentListSalvage, function (ItemFile) {
                if (angular.isUndefined(ItemFile.imageId) || ItemFile.imageId == null) {
                    $scope.filesDetails.push({
                        "fileType": ItemFile.FileType,
                        "fileName": ItemFile.FileName,
                        "extension": ItemFile.FileExtension,
                        "filePurpose": "ITEM_SALVAGE_DETAILS",
                        "latitude": 41.40,
                        "longitude": 2.17
                    });
                    data.append('file', ItemFile.File);
                }
            });
            if ($scope.attachmentListSalvage.length == 0 || $scope.attachmentListSalvage == null) {
                data.append('filesDetails', null);
                data.append('file', null);
            } else {
                data.append('filesDetails', JSON.stringify($scope.filesDetails));
            }

            var TempadditionalStoneDetailsFinishedItem = [];
            if ($scope.additionalStoneDetailsFinishedItem.length > 0) {
                angular.forEach($scope.additionalStoneDetailsFinishedItem, function (item) {
                    TempadditionalStoneDetailsFinishedItem.push({
                        "id": angular.isUndefined(item.id) ? null : item.id,
                        "stoneType": {
                            "id": item.stoneType.id,
                        },
                        //"additionalStoneUID": angular.isUndefined(item.id) ? null : item.stoneUID,
                        //"isDelete": null,
                        "individualWeight": item.individualWeight,
                        "quantity": item.quantity,
                        "totalCaratWeight": item.totalCaratWeight,
                        "pricePerCarat": item.pricePerCarat,
                        "totalPrice": item.totalPrice
                    });
                });
            } else {
                TempadditionalStoneDetailsFinishedItem = null;
            }

            var TempsalvageFinishedItemStones = [];
            if ($scope.FinishedJewelryItemList.length > 0) {
                angular.forEach($scope.FinishedJewelryItemList, function (item) {
                    TempsalvageFinishedItemStones.push({
                        "id":angular.isUndefined(item.id)?null:item.id,
                        "mainStone": {
                            //"id": angular.isUndefined(item.mainStone.id) ? null : item.originalStone.id,
                            "shapeDetails": {
                                "id": angular.isUndefined(item.mainStone) ? null : angular.isUndefined(item.mainStone.shapeDetails) || item.mainStone.shapeDetails==null ? null : item.mainStone.shapeDetails.id
                            },
                            "weight": angular.isUndefined(item.mainStone) ? null : item.mainStone.weight,
                            "stoneColor": {
                                "id": angular.isUndefined(item.mainStone) ? null : angular.isUndefined(item.mainStone.stoneColor) || item.mainStone.stoneColor==null ? null : item.mainStone.stoneColor.id
                            },
                            "stoneClarity": {
                                "id": angular.isUndefined(item.mainStone) ? null : angular.isUndefined(item.mainStone.stoneClarity) || item.mainStone.stoneClarity == null ? null : item.mainStone.stoneClarity.id
                            },
                            "floursenceDetails": {
                                "id": angular.isUndefined(item.mainStone) ? null : angular.isUndefined(item.mainStone.floursenceDetails) || item.mainStone.floursenceDetails == null ? null : item.mainStone.floursenceDetails.id
                            },
                            "stoneCutGrade": {
                                "id": angular.isUndefined(item.mainStone) ? 1 : angular.isUndefined(item.mainStone.stoneCutGrade) || item.mainStone.stoneCutGrade == null ? null : angular.isUndefined(item.mainStone.stoneCutGrade.id) ? 1 : item.mainStone.stoneCutGrade.id
                            },
                            "certificationType": {
                                "id": angular.isUndefined(item.mainStone) ? null : angular.isUndefined(item.mainStone.certificationType) || item.mainStone.certificationType == null ? null : item.mainStone.certificationType.id
                            },
                            "pricepc": angular.isUndefined(item.mainStone) ? null : angular.isUndefined(item.mainStone.pricepc) ? null : item.mainStone.pricepc,
                            "stonePrice": angular.isUndefined(item.mainStone) ? null : angular.isUndefined(item.mainStone.stonePrice) ? null : item.mainStone.stonePrice,
                            "marketAdj": angular.isUndefined(item.mainStone) ? null : angular.isUndefined(item.mainStone.marketAdj) ? null : item.mainStone.marketAdj,
                            "subtotal": angular.isUndefined(item.mainStone) ? null : angular.isUndefined(item.mainStone.subtotal) ? null : item.mainStone.subtotal,
                            "wholesaleAdj": angular.isUndefined(item.mainStone) ? null : angular.isUndefined(item.mainStone.wholesaleAdj) ? null : item.mainStone.wholesaleAdj,
                            "salvageValue": angular.isUndefined(item.mainStone) ? null : angular.isUndefined(item.mainStone.salvageValue) ? null : item.mainStone.salvageValue
                        },
                        "salvageEstimate": {
                            "estimatedSalvageValue": angular.isUndefined(item.salvageEstimate) ? null : angular.isUndefined(item.salvageEstimate.estimatedSalvageValue) ? null : item.salvageEstimate.estimatedSalvageValue,
                            "repairs": angular.isUndefined(item.salvageEstimate) ? null : angular.isUndefined(item.salvageEstimate.repairs) ? null : item.salvageEstimate.repairs,
                            "expenses": angular.isUndefined(item.salvageEstimate) ? null : angular.isUndefined(item.salvageEstimate.expenses) ? null : item.salvageEstimate.expenses,
                            "netProceeds": angular.isUndefined(item.salvageEstimate) ? null : angular.isUndefined(item.salvageEstimate.netProceeds) ? null : item.salvageEstimate.netProceeds,
                        },
                        "replacementDetails": null, //{
                        //    "description": angular.isUndefined(item.replacementDetails) ? null : angular.isUndefined(item.replacementDetails.description) ? null : item.replacementDetails.description,
                        //    "replacementQuote": angular.isUndefined(item.replacementDetails) ? null : angular.isUndefined(item.replacementDetails.replacementQuote) ? null : item.replacementDetails.replacementQuote,
                        //    "appraisalValue": angular.isUndefined(item.replacementDetails) ? null : angular.isUndefined(item.replacementDetails.appraisalValue) ? null : item.replacementDetails.appraisalValue,
                        //    "scheduledValue": angular.isUndefined(item.replacementDetails) ? null : angular.isUndefined(item.replacementDetails.scheduledValue) ? null : item.replacementDetails.scheduledValue,
                        //}
                    });
                })
            }
            var Param = {
                "id": angular.isUndefined($scope.itemSalvageDetails.id) ? null : $scope.itemSalvageDetails.id,
                "salvageId": angular.isUndefined($scope.itemSalvageDetails.salvageId) ? null : $scope.itemSalvageDetails.salvageId,
                "adjusterDescription": $scope.itemSalvageDetails.adjusterDescription,
                "gemLabDescription": $scope.itemSalvageDetails.gemLabDescription,
                "salvageDate": $filter('DatabaseDateFormatMMddyyyy')($scope.currentDate),
                "cuttersDate": $filter('DatabaseDateFormatMMddyyyy')($scope.itemSalvageDetails.cuttersDate),
                "giaDate": $filter('DatabaseDateFormatMMddyyyy')($scope.itemSalvageDetails.giaDate),
                 "claimItem": {
                    "itemUID": angular.isUndefined($scope.itemSalvageDetails.itemUID) ? $scope.ItemDetails.itemUID : $scope.itemSalvageDetails.itemUID
                 },
                "salvageItemStatus": {
                    "id": angular.isUndefined($scope.itemSalvageDetails.salvageItemStatus) || $scope.itemSalvageDetails.salvageItemStatus == null ? null : angular.isUndefined($scope.itemSalvageDetails.salvageItemStatus.id) ? null : $scope.itemSalvageDetails.salvageItemStatus.id
                },
                "sellingRateDetails": {
                    "soldPrice": angular.isUndefined($scope.itemSalvageDetails.sellingRateDetails) ? null : $scope.itemSalvageDetails.sellingRateDetails.soldPrice,
                    "dateOfSale": $filter('DatabaseDateFormatMMddyyyy')($scope.itemSalvageDetails.sellingRateDetails.dateOfSale),
                    "commissionRate": angular.isUndefined($scope.itemSalvageDetails.sellingRateDetails) ? null : $scope.itemSalvageDetails.sellingRateDetails.commissionRate,
                    "subTotal": angular.isUndefined($scope.itemSalvageDetails.sellingRateDetails) ? null : $scope.itemSalvageDetails.sellingRateDetails.subTotal,
                    "certReCutShipFee": angular.isUndefined($scope.itemSalvageDetails.sellingRateDetails) ? null : $scope.itemSalvageDetails.sellingRateDetails.certReCutShipFee,
                    "netPrice": angular.isUndefined($scope.itemSalvageDetails.sellingRateDetails) ? null : $scope.itemSalvageDetails.sellingRateDetails.netPrice,
                    "billingStatus": {
                        "id": angular.isUndefined($scope.itemSalvageDetails.sellingRateDetails) ? null : angular.isUndefined($scope.itemSalvageDetails.sellingRateDetails.billingStatus.id) ? null : $scope.itemSalvageDetails.sellingRateDetails.billingStatus.id
                    },
                    "soldTo": angular.isUndefined($scope.itemSalvageDetails.sellingRateDetails) ? null : $scope.itemSalvageDetails.sellingRateDetails.soldTo,
                },
                "billingDetails": {
                    "checkAmount": angular.isUndefined($scope.itemSalvageDetails.billingDetails) ? null : $scope.itemSalvageDetails.billingDetails.checkAmount,
                    "checkNumber": angular.isUndefined($scope.itemSalvageDetails.billingDetails) ? null : $scope.itemSalvageDetails.billingDetails.checkNumber,
                    "datePaid": $filter('DatabaseDateFormatMMddyyyy')($scope.itemSalvageDetails.billingDetails.datePaid),
                    "status": {
                        "id": angular.isUndefined($scope.itemSalvageDetails.billingDetails) ? null : angular.isUndefined($scope.itemSalvageDetails.billingDetails.status) || $scope.itemSalvageDetails.billingDetails.status==null ? null : angular.isUndefined($scope.itemSalvageDetails.billingDetails.status.id) ? null : $scope.itemSalvageDetails.billingDetails.status.id
                    }
                },
                "salvageCustomerBuyBackDetails": {
                    "salvageValue": angular.isUndefined($scope.itemSalvageDetails.salvageCustomerBuyBackDetails) ? null : $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.salvageValue,
                    "commissionRate": angular.isUndefined($scope.itemSalvageDetails.salvageCustomerBuyBackDetails) ? null : $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.commissionRate,
                    "shippingFee": angular.isUndefined($scope.itemSalvageDetails.salvageCustomerBuyBackDetails) ? null : $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.shippingFee,
                    "evaluationFee": angular.isUndefined($scope.itemSalvageDetails.salvageCustomerBuyBackDetails) ? null : $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.evaluationFee,
                    "buyBackPrice": angular.isUndefined($scope.itemSalvageDetails.salvageCustomerBuyBackDetails) ? null : $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.buyBackPrice,
                },
                "estimateDetail": null,
                "salvageItemFinished": TempsalvageFinishedItemStones,
                "additionalStoneDetails": TempadditionalStoneDetailsFinishedItem,
                "metalDetails": {
                    "metalType": {
                        "id": angular.isUndefined($scope.itemSalvageDetails.metalDetails) || $scope.itemSalvageDetails.metalDetails.metalType == null ? null : angular.isUndefined($scope.itemSalvageDetails.metalDetails.metalType) ? null : $scope.itemSalvageDetails.metalDetails.metalType.id
                    },
                    "weight": angular.isUndefined($scope.itemSalvageDetails.metalDetails) ? null : $scope.itemSalvageDetails.metalDetails.weight,
                    "totalPrice": angular.isUndefined($scope.itemSalvageDetails.metalDetails) ? null : $scope.itemSalvageDetails.metalDetails.totalPrice,
                    "netPrice": angular.isUndefined($scope.itemSalvageDetails.metalDetails) ? null : $scope.itemSalvageDetails.metalDetails.netPrice,
                    "spotPrice": angular.isUndefined($scope.itemSalvageDetails.metalDetails) ? null : $scope.itemSalvageDetails.metalDetails.spotPrice,
                    "contracted": angular.isUndefined($scope.itemSalvageDetails.metalDetails) ? null : $scope.itemSalvageDetails.metalDetails.contracted,
                    "date": $filter('DatabaseDateFormatMMddyyyy')($scope.itemSalvageDetails.metalDetails.date),
                },
                "salvageTotal": angular.isUndefined($scope.itemSalvageDetails.salvageTotal) ? null : $scope.itemSalvageDetails.salvageTotal,
                "explanation": null,
                "otherSalvageValue": angular.isUndefined($scope.itemSalvageDetails.otherSalvageValue) ? null : $scope.itemSalvageDetails.otherSalvageValue,
                "salvageProfile": {
                    "id": $scope.itemSalvageDetails.salvageProfile.id
                },
                "relacementDetails": {
                    "id": angular.isUndefined($scope.itemSalvageDetails.relacementDetails) || $scope.itemSalvageDetails.relacementDetails==null ? null : angular.isUndefined($scope.itemSalvageDetails.relacementDetails.id) ? null : $scope.itemSalvageDetails.relacementDetails.id,
                    "description": angular.isUndefined($scope.itemSalvageDetails.relacementDetails) || $scope.itemSalvageDetails.relacementDetails == null ? null : angular.isUndefined($scope.itemSalvageDetails.relacementDetails.description) ? null : $scope.itemSalvageDetails.relacementDetails.description,
                    "replacementQuote": angular.isUndefined($scope.itemSalvageDetails.relacementDetails) || $scope.itemSalvageDetails.relacementDetails == null ? null : angular.isUndefined($scope.itemSalvageDetails.relacementDetails.replacementQuote) ? null : $scope.itemSalvageDetails.relacementDetails.replacementQuote,
                    "appraisalValue": angular.isUndefined($scope.itemSalvageDetails.relacementDetails) || $scope.itemSalvageDetails.relacementDetails == null ? null : angular.isUndefined($scope.itemSalvageDetails.relacementDetails.appraisalValue) ? null : $scope.itemSalvageDetails.relacementDetails.appraisalValue,
                    "scheduledValue": angular.isUndefined($scope.itemSalvageDetails.relacementDetails) || $scope.itemSalvageDetails.relacementDetails == null ? null : angular.isUndefined($scope.itemSalvageDetails.relacementDetails.scheduledValue) ? null : $scope.itemSalvageDetails.relacementDetails.scheduledValue
                },
                "companyRegistration": sessionStorage.getItem("CompanyCRN")

            }
            data.append("salvageDetails", JSON.stringify(Param));
            var addSalvage = SalvageService.UpdateFinishedItem(data);
            addSalvage.then(function (success) {
                toastr.remove();
                toastr.success(success.data.message, "Confirmation");
                GetSalvageDetails();
                
                $(".page-spinner-bar").addClass("hide");
            }, function (error) {
                toastr.remove();
                if (error.data.errorMessage != null && angular.isDefined(error.data.errorMessage)) {
                    toastr.error(error.data.errorMessage, "Error")
                }
                else {
                    toastr.error(AuthHeaderService.genericErrorMessage(), "Error")
                }
                $(".page-spinner-bar").addClass("hide");
            });
    }

    $scope.HideSalvage = HideSalvage;
    function HideSalvage() {
        $scope.tab = 'Contents';
    }

    //Dimand Calulation  start
    $scope.Dimand_estimateBeforeRepair_WeightCalulation = Dimand_estimateBeforeRepair_WeightCalulation;
    function Dimand_estimateBeforeRepair_WeightCalulation(Item) {
        //Est Finished Weight=(Weight x Est Weight Loss)
        //Est Finish Weight (Estimate) = Weight x Est Weight Loss
        var originalStone_weight = 0;
        if (Item.originalStone != null)
            originalStone_weight = (angular.isUndefined(Item.originalStone.weight) || (Item.originalStone.weight == "") || (Item.originalStone.weight == null) ? 1 : Item.originalStone.weight);
        if (Item.actualAfterRepair != null)
            Item.actualAfterRepair.weight = originalStone_weight;

        //Item.estimateBeforeRepair.weight = Item.originalStone.weight;

        //CalculatePercentage(Item.estimateBeforeRepair.estWeightLoss, Item.originalStone.weight)

        if (Item.estimateBeforeRepair != null) {
            Item.estimateBeforeRepair.weight = originalStone_weight;
            Item.estimateBeforeRepair.estFinishWeight = parseFloat(originalStone_weight) - CalculatePercentage(Item.estimateBeforeRepair.estWeightLoss, Item.originalStone.weight)
            //Item.estimateBeforeRepair.estFinishWeight = originalStone_weight * (angular.isUndefined(Item.estimateBeforeRepair.estWeightLoss) || (Item.estimateBeforeRepair.estWeightLoss == "") || (Item.estimateBeforeRepair.estWeightLoss == null) ? 1 : Item.estimateBeforeRepair.estWeightLoss)
        }
        Dimand_estimateBeforeRepair_StonePriceCalulation(Item)
    };

    $scope.Dimand_estimateBeforeRepair_StonePriceCalulation = Dimand_estimateBeforeRepair_StonePriceCalulation;
    function Dimand_estimateBeforeRepair_StonePriceCalulation(Item) {
        //Stone Price=Total price of stone (Carat weight x rap price per carat)
        if (Item.estimateBeforeRepair != null) {
            var rapPricePC = angular.isUndefined(Item.estimateBeforeRepair.rapPricePC) || Item.estimateBeforeRepair.rapPricePC == "" || Item.estimateBeforeRepair.rapPricePC == null ? 1 : Item.estimateBeforeRepair.rapPricePC;
            var estFinishWeight = (angular.isUndefined(Item.estimateBeforeRepair.estFinishWeight) || (Item.estimateBeforeRepair.estFinishWeight == "") || (Item.estimateBeforeRepair.estFinishWeight == null) ? 1 : Item.estimateBeforeRepair.estFinishWeight)
            Item.estimateBeforeRepair.stonePrice = parseFloat(rapPricePC) * parseFloat(estFinishWeight);
            Dimand_estimateBeforeRepair_NetCalulation(Item)
        }
    };

    $scope.Dimand_estimateBeforeRepair_SubtotalCalulation = Dimand_estimateBeforeRepair_SubtotalCalulation;
    function Dimand_estimateBeforeRepair_SubtotalCalulation(Item) {
        //Subtotal (Est Before Repairs)=Stone price x Market adjustment
        if (Item.estimateBeforeRepair != null) {
            var marketAdjustment = parseFloat(angular.isUndefined(Item.estimateBeforeRepair.marketAdjustment) || (Item.estimateBeforeRepair.marketAdjustment == "") || (Item.estimateBeforeRepair.marketAdjustment == null) ? 1 : Item.estimateBeforeRepair.marketAdjustment)
            var stonePrice = angular.isUndefined(Item.estimateBeforeRepair.stonePrice) || (Item.estimateBeforeRepair.stonePrice == "") || (Item.estimateBeforeRepair.stonePrice == null) ? 1 : Item.estimateBeforeRepair.stonePrice
            Item.estimateBeforeRepair.subTotal = parseFloat(stonePrice) - CalculatePercentage(marketAdjustment, stonePrice);
            Dimand_estimateBeforeRepair_SalvageValueCalulation(Item);
        }
    };

    $scope.Dimand_estimateBeforeRepair_SalvageValueCalulation = Dimand_estimateBeforeRepair_SalvageValueCalulation;
    function Dimand_estimateBeforeRepair_SalvageValueCalulation(Item) {
        //Salvage Value (Est Before Repairs)=Subtotal x Wholesale Buyer Adjustment
        if (Item.estimateBeforeRepair != null) {
            var wholeSaleBuyerAdj = parseFloat(angular.isUndefined(Item.estimateBeforeRepair.wholeSaleBuyerAdj) || (Item.estimateBeforeRepair.wholeSaleBuyerAdj == "") || (Item.estimateBeforeRepair.wholeSaleBuyerAdj == null) ? 1 : Item.estimateBeforeRepair.wholeSaleBuyerAdj)
            var subTotal = angular.isUndefined(Item.estimateBeforeRepair.subTotal) || (Item.estimateBeforeRepair.subTotal == "") || (Item.estimateBeforeRepair.subTotal == null) ? 1 : Item.estimateBeforeRepair.subTotal
            Item.estimateBeforeRepair.salvageValue = parseFloat(subTotal) - CalculatePercentage(wholeSaleBuyerAdj, subTotal)
            Dimand_estimateBeforeRepair_NetCalulation(Item);
        }
    };

    $scope.Dimand_estimateBeforeRepair_NetCalulation = Dimand_estimateBeforeRepair_NetCalulation;
    function Dimand_estimateBeforeRepair_NetCalulation(Item) {
        if (Item.estimateBeforeRepair != null) {
            //Net (Estimate)=Salvage value - (cutting charge + cert fee + shipping cost)
            var salvageValue = (angular.isUndefined(Item.estimateBeforeRepair.salvageValue) || (Item.estimateBeforeRepair.salvageValue == "") || (Item.estimateBeforeRepair.salvageValue == null) ? 0 : Item.estimateBeforeRepair.salvageValue);
            var cuttingCharge = (angular.isUndefined(Item.estimateBeforeRepair.cuttingCharge) || (Item.estimateBeforeRepair.cuttingCharge == "") || (Item.estimateBeforeRepair.cuttingCharge == null) ? 0 : Item.estimateBeforeRepair.cuttingCharge);
            var certFee = (angular.isUndefined(Item.estimateBeforeRepair.certFee) || (Item.estimateBeforeRepair.certFee == "") || (Item.estimateBeforeRepair.certFee == null) ? 0 : Item.estimateBeforeRepair.certFee);
            var shippingCost = (angular.isUndefined(Item.estimateBeforeRepair.shippingCost) || (Item.estimateBeforeRepair.shippingCost == "") || (Item.estimateBeforeRepair.certFee == null) ? 0 : Item.estimateBeforeRepair.shippingCost);
            
            Item.estimateBeforeRepair.net = parseFloat(salvageValue) - (parseFloat(cuttingCharge) + parseFloat(certFee) + parseFloat(shippingCost));
            calculateSalvageTotal();
        }
    };

    $scope.Dimand_actualAfterRepair_StonePriceCalulation = Dimand_actualAfterRepair_StonePriceCalulation;
    function Dimand_actualAfterRepair_StonePriceCalulation(Item) {
        //Stone Price=Total price of stone (Carat weight x rap price per carat)
        if (Item.actualAfterRepair != null) {
            var CaratWeight = (angular.isUndefined(Item.actualAfterRepair.weight) || (Item.actualAfterRepair.weight == "") || (Item.actualAfterRepair.weight == null) ? 1 : Item.actualAfterRepair.weight)
            var rapPricePC = (angular.isUndefined(Item.actualAfterRepair.rapPricePC) || (Item.actualAfterRepair.rapPricePC == "") || (Item.actualAfterRepair.rapPricePC == null) ? 1 : Item.actualAfterRepair.rapPricePC)
            Item.actualAfterRepair.stonePrice = (CaratWeight) * parseFloat(rapPricePC)
            Dimand_actualAfterRepair_SubtotalCalulation(Item)
        }
    };

    $scope.Dimand_actualAfterRepair_SubtotalCalulation = Dimand_actualAfterRepair_SubtotalCalulation;
    function Dimand_actualAfterRepair_SubtotalCalulation(Item) {
        //Subtotal (Est Before Repairs)=Stone price x Market adjustment
        if (Item.actualAfterRepair != null) {
            var marketAdjustment = parseFloat(angular.isUndefined(Item.actualAfterRepair.marketAdjustment) || (Item.actualAfterRepair.marketAdjustment == "") || (Item.actualAfterRepair.marketAdjustment == null) ? 1 : Item.actualAfterRepair.marketAdjustment)
            var stonePrice = angular.isUndefined(Item.actualAfterRepair.stonePrice) || (Item.actualAfterRepair.stonePrice == "") || (Item.actualAfterRepair.stonePrice == null) ? 1 : Item.actualAfterRepair.stonePrice
            Item.actualAfterRepair.subTotal = parseFloat(stonePrice) - CalculatePercentage(marketAdjustment, stonePrice);
            Dimand_actualAfterRepair_SalvageValueCalulation(Item);
        }
    };

    $scope.Dimand_actualAfterRepair_SalvageValueCalulation = Dimand_actualAfterRepair_SalvageValueCalulation;
    function Dimand_actualAfterRepair_SalvageValueCalulation(Item) {
        //Salvage Value (Est Before Repairs)=Subtotal x Wholesale Buyer Adjustment
        if (Item.actualAfterRepair != null) {
            var wholesaleBuyerAdj = parseFloat(angular.isUndefined(Item.actualAfterRepair.wholesaleBuyerAdj) || (Item.actualAfterRepair.wholesaleBuyerAdj == "") || (Item.actualAfterRepair.wholesaleBuyerAdj == null) ? 1 : Item.actualAfterRepair.wholesaleBuyerAdj)
            var subTotal = angular.isUndefined(Item.actualAfterRepair.subTotal) || (Item.actualAfterRepair.subTotal == "") || (Item.actualAfterRepair.subTotal == null) ? 1 : Item.actualAfterRepair.subTotal
            Item.actualAfterRepair.salvageValue = parseFloat(subTotal) - parseFloat(CalculatePercentage(wholesaleBuyerAdj, subTotal));
            
            Dimand_actualAfterRepair_NetCalulation(Item);
        }
    };

    $scope.Dimand_actualAfterRepair_NetCalulation = Dimand_actualAfterRepair_NetCalulation;
    function Dimand_actualAfterRepair_NetCalulation(Item) {
        if (Item.actualAfterRepair != null) {
            //Net=Salvage value - (cutting charge + cert fee + shipping cost) 
            var salvageValue = (angular.isUndefined(Item.actualAfterRepair.salvageValue) || (Item.actualAfterRepair.salvageValue == "") || (Item.actualAfterRepair.salvageValue == null) ? 0 : Item.actualAfterRepair.salvageValue);
            var cuttingCharge = (angular.isUndefined(Item.actualAfterRepair.cuttingCharge) || (Item.actualAfterRepair.cuttingCharge == "") || (Item.actualAfterRepair.cuttingCharge == null) ? 0 : Item.actualAfterRepair.cuttingCharge);
            var certFee = (angular.isUndefined(Item.actualAfterRepair.certFee) || (Item.actualAfterRepair.certFee == "") || (Item.actualAfterRepair.certFee == null) ? 0 : Item.actualAfterRepair.certFee);
            var shippingCost = (angular.isUndefined(Item.actualAfterRepair.shippingFee) || (Item.actualAfterRepair.shippingFee == "") || (Item.actualAfterRepair.shippingFee == null) ? 0 : Item.actualAfterRepair.shippingFee);

            Item.actualAfterRepair.netProcessds = parseFloat(salvageValue) - (parseFloat(cuttingCharge) + parseFloat(certFee) + parseFloat(shippingCost));
            calculateSalvageTotal()
        }

    };

    $scope.Dimand_sellingRateDetails_subTotal = Dimand_sellingRateDetails_subTotal;
    function Dimand_sellingRateDetails_subTotal() {
        //Sub Total  = Sold Price - Commission Rate
        var soldPrice = (angular.isUndefined($scope.itemSalvageDetails.sellingRateDetails.soldPrice) || ($scope.itemSalvageDetails.sellingRateDetails.soldPrice == "") || ($scope.itemSalvageDetails.sellingRateDetails.soldPrice == null) ? 0 : $scope.itemSalvageDetails.sellingRateDetails.soldPrice);
        var commissionRate = (angular.isUndefined($scope.itemSalvageDetails.sellingRateDetails.commissionRate) || ($scope.itemSalvageDetails.sellingRateDetails.commissionRate == "") || ($scope.itemSalvageDetails.sellingRateDetails.commissionRate == null) ? 0 : $scope.itemSalvageDetails.sellingRateDetails.commissionRate);
        $scope.itemSalvageDetails.sellingRateDetails.commissionRate = commissionRate;
        $scope.itemSalvageDetails.sellingRateDetails.soldPrice = soldPrice;
        $scope.itemSalvageDetails.sellingRateDetails.subTotal = parseFloat(soldPrice) - CalculatePercentage(commissionRate, soldPrice);
        Dimand_SellingRate_NetPriceCalulation()
    };

    $scope.Dimand_SellingRate_NetPriceCalulation = Dimand_SellingRate_NetPriceCalulation;
    function Dimand_SellingRate_NetPriceCalulation(Item) {
        //Net Price = Sub Total - Cert,Re-Cut, Ship Fees
        var subTotal = (angular.isUndefined($scope.itemSalvageDetails.sellingRateDetails.subTotal) || ($scope.itemSalvageDetails.sellingRateDetails.subTotal == "") || ($scope.itemSalvageDetails.sellingRateDetails.subTotal == null) ? 0 : $scope.itemSalvageDetails.sellingRateDetails.subTotal);
        var certReCutShipFee = (angular.isUndefined($scope.itemSalvageDetails.sellingRateDetails.certReCutShipFee) || ($scope.itemSalvageDetails.sellingRateDetails.certReCutShipFee == "") || ($scope.itemSalvageDetails.sellingRateDetails.certReCutShipFee == null) ? 0 : $scope.itemSalvageDetails.sellingRateDetails.certReCutShipFee);

        $scope.itemSalvageDetails.sellingRateDetails.netPrice = parseFloat(subTotal) - parseFloat(certReCutShipFee)
    };
    $scope.Dimand_metalDetails_netPrice = Dimand_metalDetails_netPrice;
    function Dimand_metalDetails_netPrice() {
        //Net Price  = Sub Total - Cert,Re-Cut, Ship Fees
        var weight = (angular.isUndefined($scope.itemSalvageDetails.metalDetails.weight) || ($scope.itemSalvageDetails.metalDetails.weight == "") || ($scope.itemSalvageDetails.metalDetails.weight == null) ? 0 : $scope.itemSalvageDetails.metalDetails.weight);
        var spotPrice = (angular.isUndefined($scope.itemSalvageDetails.metalDetails.spotPrice) || ($scope.itemSalvageDetails.metalDetails.spotPrice == "") || ($scope.itemSalvageDetails.metalDetails.spotPrice == null) ? 0 : $scope.itemSalvageDetails.metalDetails.spotPrice);
        var totalPrice = (angular.isUndefined($scope.itemSalvageDetails.metalDetails.totalPrice) || ($scope.itemSalvageDetails.metalDetails.totalPrice == "") || ($scope.itemSalvageDetails.metalDetails.totalPrice == null) ? 0 : $scope.itemSalvageDetails.metalDetails.totalPrice);

        $scope.itemSalvageDetails.metalDetails.totalPrice = parseFloat(weight) * parseFloat(spotPrice);
        var totalPrice = (angular.isUndefined($scope.itemSalvageDetails.metalDetails.totalPrice) || ($scope.itemSalvageDetails.metalDetails.totalPrice == "") || ($scope.itemSalvageDetails.metalDetails.totalPrice == null) ? 0 : $scope.itemSalvageDetails.metalDetails.totalPrice);
        var contracted = (angular.isUndefined($scope.itemSalvageDetails.metalDetails.contracted) || ($scope.itemSalvageDetails.metalDetails.contracted == "") || ($scope.itemSalvageDetails.metalDetails.contracted == null) ? 0 : $scope.itemSalvageDetails.metalDetails.contracted);
        //var netPrice = (angular.isUndefined($scope.itemSalvageDetails.metalDetails.netPrice) || ($scope.itemSalvageDetails.metalDetails.netPrice == "") || ($scope.itemSalvageDetails.metalDetails.netPrice == null) ? 0 : $scope.itemSalvageDetails.metalDetails.netPrice);

        $scope.itemSalvageDetails.metalDetails.netPrice = parseFloat(totalPrice) - parseFloat(CalculatePercentage(contracted, $scope.itemSalvageDetails.metalDetails.totalPrice));
    };

    $scope.Dimand_salvageCustomerBuyBackDetails_buyBackPrice = Dimand_salvageCustomerBuyBackDetails_buyBackPrice;
    function Dimand_salvageCustomerBuyBackDetails_buyBackPrice() {
        //Buyback Price = Evaluation fee + Shipping fee + Commission Fee + Salvage Value
        var salvageValue = (angular.isUndefined($scope.itemSalvageDetails.salvageCustomerBuyBackDetails.salvageValue) || ($scope.itemSalvageDetails.salvageCustomerBuyBackDetails.salvageValue == "") || ($scope.itemSalvageDetails.salvageCustomerBuyBackDetails.salvageValue == null) ? 0 : $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.salvageValue);
        var commissionRate = (angular.isUndefined($scope.itemSalvageDetails.salvageCustomerBuyBackDetails.commissionRate) || ($scope.itemSalvageDetails.salvageCustomerBuyBackDetails.commissionRate == "") || ($scope.itemSalvageDetails.salvageCustomerBuyBackDetails.commissionRate == null) ? 0 : $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.commissionRate);
        var shippingFee = (angular.isUndefined($scope.itemSalvageDetails.salvageCustomerBuyBackDetails.shippingFee) || ($scope.itemSalvageDetails.salvageCustomerBuyBackDetails.shippingFee == "") || ($scope.itemSalvageDetails.salvageCustomerBuyBackDetails.shippingFee == null) ? 0 : $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.shippingFee);
        var evaluationFee = (angular.isUndefined($scope.itemSalvageDetails.salvageCustomerBuyBackDetails.evaluationFee) || ($scope.itemSalvageDetails.salvageCustomerBuyBackDetails.evaluationFee == "") || ($scope.itemSalvageDetails.salvageCustomerBuyBackDetails.evaluationFee == null) ? 0 : $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.evaluationFee);

        $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.salvageValue = salvageValue;
        $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.commissionRate = commissionRate;
        $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.shippingFee = shippingFee;
        $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.evaluationFee = evaluationFee;
        var commsitionRatePercentage = parseFloat(salvageValue) - CalculatePercentage(commissionRate, salvageValue);
        $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.buyBackPrice = parseFloat(salvageValue) + commsitionRatePercentage + parseFloat(shippingFee) + parseFloat(evaluationFee);
        //$scope.itemSalvageDetails.salvageCustomerBuyBackDetails.buyBackPrice = (parseFloat(salvageValue) - CalculatePercentage(commissionRate, salvageValue)) + parseFloat(shippingFee) + parseFloat(evaluationFee);

    };
    //Dimand Calulation  End

    //Gemstone Calulation  start
    $scope.Gemstone_estimateBeforeRepair_WeightCalulation = Gemstone_estimateBeforeRepair_WeightCalulation;
    function Gemstone_estimateBeforeRepair_WeightCalulation(Item) {
        //Est Finish Weight (Estimate) = Weight x Est Weight Loss 
        var originalStone_weight = 0;
        if (Item.originalStone != null)
            originalStone_weight = (angular.isUndefined(Item.originalStone.weight) || (Item.originalStone.weight == "") || (Item.originalStone.weight == null) ? 1 : Item.originalStone.weight);
        if (Item.actualAfterRepair != null)
            Item.actualAfterRepair.weight = originalStone_weight == 1 ? Item.actualAfterRepair.weight : originalStone_weight;;

        //Item.estimateBeforeRepair.weight = Item.originalStone.weight;

        //CalculatePercentage(Item.estimateBeforeRepair.estWeightLoss, Item.originalStone.weight)

        if (Item.estimateBeforeRepair != null) {
            Item.estimateBeforeRepair.weight = originalStone_weight == 1 ? Item.estimateBeforeRepair.weight : originalStone_weight;
            Item.estimateBeforeRepair.estFinishWeight = parseFloat(Item.estimateBeforeRepair.weight) - CalculatePercentage(Item.estimateBeforeRepair.estWeightLoss, Item.estimateBeforeRepair.weight)
            //Item.estimateBeforeRepair.estFinishWeight = originalStone_weight * (angular.isUndefined(Item.estimateBeforeRepair.estWeightLoss) || (Item.estimateBeforeRepair.estWeightLoss == "") || (Item.estimateBeforeRepair.estWeightLoss == null) ? 1 : Item.estimateBeforeRepair.estWeightLoss)
        }
        Gemstone_estimateBeforeRepair_StonePriceCalulation(Item)
    };

    $scope.Gemstone_estimateBeforeRepair_StonePriceCalulation = Gemstone_estimateBeforeRepair_StonePriceCalulation;
    function Gemstone_estimateBeforeRepair_StonePriceCalulation(Item) {
        //Stone Price(Estimate) = Estimated finish weight x price per carat
        if (Item.estimateBeforeRepair != null) {
            var rapPricePC = angular.isUndefined(Item.estimateBeforeRepair.rapPricePC) || Item.estimateBeforeRepair.rapPricePC == "" || Item.estimateBeforeRepair.rapPricePC == null ? 1 : Item.estimateBeforeRepair.rapPricePC;
            var estFinishWeight=(angular.isUndefined(Item.estimateBeforeRepair.estFinishWeight) || (Item.estimateBeforeRepair.estFinishWeight == "") || (Item.estimateBeforeRepair.estFinishWeight == null) ? 1 : Item.estimateBeforeRepair.estFinishWeight)
            Item.estimateBeforeRepair.stonePrice =  parseFloat(rapPricePC) * parseFloat (estFinishWeight);
            Gemstone_estimateBeforeRepair_NetCalulation(Item)
        }
    };

    $scope.Gemstone_estimateBeforeRepair_NetCalulation = Gemstone_estimateBeforeRepair_NetCalulation;
    function Gemstone_estimateBeforeRepair_NetCalulation(Item) {
        if (Item.estimateBeforeRepair != null) {
            //Net (Estimate)=Stone price - cutting charge- shipping cost 
            var stonePrice = (angular.isUndefined(Item.estimateBeforeRepair.stonePrice) || (Item.estimateBeforeRepair.stonePrice == "") || (Item.estimateBeforeRepair.stonePrice == null) ? 0 : Item.estimateBeforeRepair.stonePrice);
            var cuttingCharge = (angular.isUndefined(Item.estimateBeforeRepair.cuttingCharge) || (Item.estimateBeforeRepair.cuttingCharge == "") || (Item.estimateBeforeRepair.cuttingCharge == null) ? 0 : Item.estimateBeforeRepair.cuttingCharge);
            var shippingCost = (angular.isUndefined(Item.estimateBeforeRepair.shippingCost) || (Item.estimateBeforeRepair.shippingCost == "") || (Item.estimateBeforeRepair.shippingCost == null) ? 0 : Item.estimateBeforeRepair.shippingCost);

            Item.estimateBeforeRepair.net = parseFloat(stonePrice) - parseFloat(cuttingCharge) - parseFloat(shippingCost);
            calculateSalvageTotalGemstone();
        }        
    };

    $scope.Gemstone_actualAfterRepair_StonePriceCalulation = Gemstone_actualAfterRepair_StonePriceCalulation;
    function Gemstone_actualAfterRepair_StonePriceCalulation(Item) {
        //Stone Price (Actual) = Price per carat x Weight
        if (Item.actualAfterRepair != null) {
            //var CaratWeight = 1;
            //if ($scope.additionalStoneDetailsGemstone.length > 0) {
            //    CaratWeight = 0;
            //    angular.forEach($scope.additionalStoneDetailsGemstone, function (selectedStoneDiamond) {
            //        CaratWeight += parseFloat(angular.isUndefined(selectedStoneDiamond.totalCaratWeight) || (selectedStoneDiamond.totalCaratWeight == "") || (selectedStoneDiamond.totalCaratWeight == null) ? 0 : selectedStoneDiamond.totalCaratWeight)
            //    })
            //}
            var rapPricePC = angular.isUndefined(Item.actualAfterRepair.rapPricePC) || Item.actualAfterRepair.rapPricePC == "" || Item.actualAfterRepair.rapPricePC == null ? 1 : Item.actualAfterRepair.rapPricePC;
            var weight = (angular.isUndefined(Item.actualAfterRepair.weight) || (Item.actualAfterRepair.weight == "") || (Item.actualAfterRepair.weight == null) ? 1 : Item.actualAfterRepair.weight)

            Item.actualAfterRepair.stonePrice = parseFloat(rapPricePC) * parseFloat(weight);
            Gemstone_actualAfterRepair_NetCalulation(Item)
        }
    };
    
    $scope.Gemstone_actualAfterRepair_NetCalulation = Gemstone_actualAfterRepair_NetCalulation;
    function Gemstone_actualAfterRepair_NetCalulation(Item) {
        if (Item.actualAfterRepair != null) {
            //Net Proceeds (Actual) = Stone price - cutting charge - shipping cost 
            var stonePrice = (angular.isUndefined(Item.actualAfterRepair.stonePrice) || (Item.actualAfterRepair.stonePrice == "") || (Item.actualAfterRepair.stonePrice == null) ? 0 : Item.actualAfterRepair.stonePrice);
            var cuttingCharge = (angular.isUndefined(Item.actualAfterRepair.cuttingCharge) || (Item.actualAfterRepair.cuttingCharge == "") || (Item.actualAfterRepair.cuttingCharge == null) ? 0 : Item.actualAfterRepair.cuttingCharge);
            var shippingCost = (angular.isUndefined(Item.actualAfterRepair.shippingFee) || (Item.actualAfterRepair.shippingFee == "") || (Item.actualAfterRepair.shippingFee == null) ? 0 : Item.actualAfterRepair.shippingFee);

            Item.actualAfterRepair.netProcessds = parseFloat(stonePrice) - parseFloat(cuttingCharge) - parseFloat(shippingCost);
            calculateSalvageTotalGemstone()
        }
    };

     $scope.Gemstone_metalDetails_netPrice = Gemstone_metalDetails_netPrice;
    function Gemstone_metalDetails_netPrice() {
        //Net Price  = Sub Total - Cert,Re-Cut, Ship Fees
        var weight = (angular.isUndefined($scope.itemSalvageDetails.metalDetails.weight) || ($scope.itemSalvageDetails.metalDetails.weight == "") || ($scope.itemSalvageDetails.metalDetails.weight == null) ? 0 : $scope.itemSalvageDetails.metalDetails.weight);
        var spotPrice = (angular.isUndefined($scope.itemSalvageDetails.metalDetails.spotPrice) || ($scope.itemSalvageDetails.metalDetails.spotPrice == "") || ($scope.itemSalvageDetails.metalDetails.spotPrice == null) ? 0 : $scope.itemSalvageDetails.metalDetails.spotPrice);
        var totalPrice = (angular.isUndefined($scope.itemSalvageDetails.metalDetails.totalPrice) || ($scope.itemSalvageDetails.metalDetails.totalPrice == "") || ($scope.itemSalvageDetails.metalDetails.totalPrice == null) ? 0 : $scope.itemSalvageDetails.metalDetails.totalPrice);
        
        $scope.itemSalvageDetails.metalDetails.totalPrice = parseFloat(weight) * parseFloat(spotPrice);
        var totalPrice = (angular.isUndefined($scope.itemSalvageDetails.metalDetails.totalPrice) || ($scope.itemSalvageDetails.metalDetails.totalPrice == "") || ($scope.itemSalvageDetails.metalDetails.totalPrice == null) ? 0 : $scope.itemSalvageDetails.metalDetails.totalPrice);
        var contracted = (angular.isUndefined($scope.itemSalvageDetails.metalDetails.contracted) || ($scope.itemSalvageDetails.metalDetails.contracted == "") || ($scope.itemSalvageDetails.metalDetails.contracted == null) ? 0 : $scope.itemSalvageDetails.metalDetails.contracted);
        //var netPrice = (angular.isUndefined($scope.itemSalvageDetails.metalDetails.netPrice) || ($scope.itemSalvageDetails.metalDetails.netPrice == "") || ($scope.itemSalvageDetails.metalDetails.netPrice == null) ? 0 : $scope.itemSalvageDetails.metalDetails.netPrice);

        $scope.itemSalvageDetails.metalDetails.netPrice = parseFloat(totalPrice) - parseFloat(CalculatePercentage(contracted, $scope.itemSalvageDetails.metalDetails.totalPrice));
        if ($scope.itemSalvageDetails.salvageProfile.id == 2)//Gemstone
        {
            calculateSalvageTotalGemstone();
        } else if ($scope.itemSalvageDetails.salvageProfile.id == 3) {// watch
            calculateSalvageTotalLuxuryWatch();
        } else if ($scope.itemSalvageDetails.salvageProfile.id == 4) {// Finished item
            calculateSalvageTotalFinishedItem();
        }
    };

    $scope.Gemstone_sellingRateDetails_subTotal = Gemstone_sellingRateDetails_subTotal;
    function Gemstone_sellingRateDetails_subTotal() {
        //Sub Total  = Sold Price - Commission Rate
        $scope.itemSalvageDetails.sellingRateDetails.soldPrice = (angular.isUndefined($scope.itemSalvageDetails.sellingRateDetails.soldPrice) || ($scope.itemSalvageDetails.sellingRateDetails.soldPrice == "") || ($scope.itemSalvageDetails.sellingRateDetails.soldPrice == null) ? 0 : $scope.itemSalvageDetails.sellingRateDetails.soldPrice);
        $scope.itemSalvageDetails.sellingRateDetails.commissionRate = (angular.isUndefined($scope.itemSalvageDetails.sellingRateDetails.commissionRate) || ($scope.itemSalvageDetails.sellingRateDetails.commissionRate == "") || ($scope.itemSalvageDetails.sellingRateDetails.commissionRate == null) ? 0 : $scope.itemSalvageDetails.sellingRateDetails.commissionRate);

        $scope.itemSalvageDetails.sellingRateDetails.subTotal = parseFloat($scope.itemSalvageDetails.sellingRateDetails.soldPrice) - CalculatePercentage($scope.itemSalvageDetails.sellingRateDetails.commissionRate, $scope.itemSalvageDetails.sellingRateDetails.soldPrice);
        //Gemstone_sellingRateDetails_netPrice()

        //Net Price  = Sub Total - Cert,Re-Cut, Ship Fees
        $scope.itemSalvageDetails.sellingRateDetails.subTotal = (angular.isUndefined($scope.itemSalvageDetails.sellingRateDetails.subTotal) || ($scope.itemSalvageDetails.sellingRateDetails.subTotal == "") || ($scope.itemSalvageDetails.sellingRateDetails.subTotal == null) ? 0 : $scope.itemSalvageDetails.sellingRateDetails.subTotal);
        $scope.itemSalvageDetails.sellingRateDetails.certReCutShipFee = (angular.isUndefined($scope.itemSalvageDetails.sellingRateDetails.certReCutShipFee) || ($scope.itemSalvageDetails.sellingRateDetails.certReCutShipFee == "") || ($scope.itemSalvageDetails.sellingRateDetails.certReCutShipFee == null) ? 0 : $scope.itemSalvageDetails.sellingRateDetails.certReCutShipFee);
        
        $scope.itemSalvageDetails.sellingRateDetails.netPrice = parseFloat($scope.itemSalvageDetails.sellingRateDetails.subTotal) - parseFloat($scope.itemSalvageDetails.sellingRateDetails.certReCutShipFee);
    };
    
    $scope.Gemstone_salvageCustomerBuyBackDetails_buyBackPrice = Gemstone_salvageCustomerBuyBackDetails_buyBackPrice;
    function Gemstone_salvageCustomerBuyBackDetails_buyBackPrice() {
        //Buyback Price = Evaluation fee + Shipping fee + Commission Fee + Salvage Value
        var salvageValue = (angular.isUndefined(    $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.salvageValue) || ($scope.itemSalvageDetails.salvageCustomerBuyBackDetails.salvageValue == "") || ($scope.itemSalvageDetails.salvageCustomerBuyBackDetails.salvageValue == null) ? 0 : $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.salvageValue);
        var commissionRate = (angular.isUndefined(  $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.commissionRate) || ($scope.itemSalvageDetails.salvageCustomerBuyBackDetails.commissionRate == "") || ($scope.itemSalvageDetails.salvageCustomerBuyBackDetails.commissionRate == null) ? 0 : $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.commissionRate);
        var shippingFee = (angular.isUndefined(     $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.shippingFee) || ($scope.itemSalvageDetails.salvageCustomerBuyBackDetails.shippingFee == "") || ($scope.itemSalvageDetails.salvageCustomerBuyBackDetails.shippingFee == null) ? 0 : $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.shippingFee);
        var evaluationFee = (angular.isUndefined(   $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.evaluationFee) || ($scope.itemSalvageDetails.salvageCustomerBuyBackDetails.evaluationFee == "") || ($scope.itemSalvageDetails.salvageCustomerBuyBackDetails.evaluationFee == null) ? 0 : $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.evaluationFee);

        $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.salvageValue = salvageValue;
        $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.commissionRate = commissionRate;
        $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.shippingFee = shippingFee;
        $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.evaluationFee = evaluationFee;
        var commsitionRatePercentage = parseFloat(salvageValue) - CalculatePercentage(commissionRate, salvageValue);
        $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.buyBackPrice = parseFloat(salvageValue) + commsitionRatePercentage + parseFloat(shippingFee) + parseFloat(evaluationFee);
        //$scope.itemSalvageDetails.salvageCustomerBuyBackDetails.buyBackPrice = (parseFloat(salvageValue) - CalculatePercentage(commissionRate, salvageValue)) + parseFloat(shippingFee) + parseFloat(evaluationFee);

    };

    //Gemstone Calulation  End
    
    //Watch Calulation  start
    $scope.watch_NetCalulation = watch_NetCalulation;
    function watch_NetCalulation() {
            //Net Proceeds = Salvage Value - repairs- expenses 
        var estimatedSalvageValue = (angular.isUndefined($scope.itemSalvageDetails.estimateDetail.estimatedSalvageValue) || ($scope.itemSalvageDetails.estimateDetail.estimatedSalvageValue == "") || ($scope.itemSalvageDetails.estimateDetail.estimatedSalvageValue == null) ? 0 : $scope.itemSalvageDetails.estimateDetail.estimatedSalvageValue);
        var repairs = (angular.isUndefined($scope.itemSalvageDetails.estimateDetail.repairs) || ($scope.itemSalvageDetails.estimateDetail.repairs == "") || ($scope.itemSalvageDetails.estimateDetail.repairs == null) ? 0 : $scope.itemSalvageDetails.estimateDetail.repairs);
        var expenses = (angular.isUndefined($scope.itemSalvageDetails.estimateDetail.expenses) || ($scope.itemSalvageDetails.estimateDetail.expenses == "") || ($scope.itemSalvageDetails.estimateDetail.expenses == null) ? 0 : $scope.itemSalvageDetails.estimateDetail.expenses);
        $scope.itemSalvageDetails.estimateDetail.netProceeds = parseFloat(estimatedSalvageValue) - parseFloat(repairs) - parseFloat(expenses);
        $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.salvageValue = $scope.itemSalvageDetails.estimateDetail.netProceeds;
        calculateSalvageTotalLuxuryWatch();
    };

    //Replaced with Gemstone_sellingRateDetails_subTotal()

    //$scope.watch_SubTotal = watch_SubTotal;
    //function watch_SubTotal() {
    //    //Sub Total	=	Sold Price - Commission Rate
    //    var soldPrice = (angular.isUndefined($scope.itemSalvageDetails.sellingRateDetails.soldPrice) || ($scope.itemSalvageDetails.sellingRateDetails.soldPrice == "") || ($scope.itemSalvageDetails.sellingRateDetails.soldPrice == null) ? 0 : $scope.itemSalvageDetails.sellingRateDetails.soldPrice);
    //    var commissionRate = (angular.isUndefined($scope.itemSalvageDetails.sellingRateDetails.commissionRate) || ($scope.itemSalvageDetails.sellingRateDetails.commissionRate == "") || ($scope.itemSalvageDetails.sellingRateDetails.commissionRate == null) ? 0 : $scope.itemSalvageDetails.sellingRateDetails.commissionRate);
    //    $scope.itemSalvageDetails.sellingRateDetails.subTotal = parseFloat(soldPrice) - parseFloat(commissionRate);
    //}

    //$scope.watch_NetPriceCalulation = watch_NetPriceCalulation;
    //function watch_NetPriceCalulation() {
    //    //Net Price	=	Sub Total - Cert,Re-Cut, Ship Fees	
    //    var soldPrice = (angular.isUndefined($scope.itemSalvageDetails.sellingRateDetails.soldPrice) || ($scope.itemSalvageDetails.sellingRateDetails.soldPrice == "") || ($scope.itemSalvageDetails.sellingRateDetails.soldPrice == null) ? 0 : $scope.itemSalvageDetails.sellingRateDetails.soldPrice);
    //    var commissionRate = (angular.isUndefined($scope.itemSalvageDetails.sellingRateDetails.commissionRate) || ($scope.itemSalvageDetails.sellingRateDetails.commissionRate == "") || ($scope.itemSalvageDetails.sellingRateDetails.commissionRate == null) ? 0 : $scope.itemSalvageDetails.sellingRateDetails.commissionRate);
    //    $scope.itemSalvageDetails.sellingRateDetails.subTotal = parseFloat(soldPrice) - parseFloat(commissionRate);
    //}

    //Replaced with Gemstone_salvageCustomerBuyBackDetails_buyBackPrice()

    //$scope.watch_BuyBackPrice = watch_BuyBackPrice;
    //function watch_BuyBackPrice() {
    //    //Customer buy back salvage price: Salvage value x commission rate x shipping fee x evaluation fee = Buy back price
    //    var salvageValue = (angular.isUndefined($scope.itemSalvageDetails.salvageCustomerBuyBackDetails.salvageValue) || ($scope.itemSalvageDetails.salvageCustomerBuyBackDetails.salvageValue == "") ? 1 : $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.salvageValue);
    //    var commissionRate = (angular.isUndefined($scope.itemSalvageDetails.salvageCustomerBuyBackDetails.commissionRate) || ($scope.itemSalvageDetails.salvageCustomerBuyBackDetails.commissionRate == "") ? 1 : $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.commissionRate);
    //    var shippingFee = (angular.isUndefined($scope.itemSalvageDetails.salvageCustomerBuyBackDetails.shippingFee) || ($scope.itemSalvageDetails.salvageCustomerBuyBackDetails.shippingFee == "") ? 1 : $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.shippingFee);
    //    var evaluationFee = (angular.isUndefined($scope.itemSalvageDetails.salvageCustomerBuyBackDetails.evaluationFee) || ($scope.itemSalvageDetails.salvageCustomerBuyBackDetails.evaluationFee == "") ? 1 : $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.evaluationFee);
    //    $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.buyBackPrice = parseFloat(salvageValue) * parseFloat(commissionRate) * parseFloat(shippingFee) * parseFloat(evaluationFee);
    //}

    //Watch Calulation End

    //Finished Calulation  start
    $scope.FinishedItem_BuyBackPrice = FinishedItem_BuyBackPrice;
    function FinishedItem_BuyBackPrice() {
        if (Item.mainStone != null) {
            //Customer buy back salvage price:Salvage value x commission rate x shipping fee x evaluation fee = Buy back price
            var salvageValue = (angular.isUndefined($scope.itemSalvageDetails.salvageCustomerBuyBackDetails.salvageValue) || ($scope.itemSalvageDetails.salvageCustomerBuyBackDetails.salvageValue == "") ? 1 : $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.salvageValue);
            var commissionRate = (angular.isUndefined($scope.itemSalvageDetails.salvageCustomerBuyBackDetails.commissionRate) || ($scope.itemSalvageDetails.salvageCustomerBuyBackDetails.commissionRate == "") ? 1 : $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.commissionRate);
            var shippingFee = (angular.isUndefined($scope.itemSalvageDetails.salvageCustomerBuyBackDetails.shippingFee) || ($scope.itemSalvageDetails.salvageCustomerBuyBackDetails.shippingFee == "") ? 1 : $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.shippingFee);
            var evaluationFee = (angular.isUndefined($scope.itemSalvageDetails.salvageCustomerBuyBackDetails.evaluationFee) || ($scope.itemSalvageDetails.salvageCustomerBuyBackDetails.evaluationFee == "") ? 1 : $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.evaluationFee);
            $scope.itemSalvageDetails.salvageCustomerBuyBackDetails.buyBackPrice = parseFloat(salvageValue) * parseFloat(commissionRate) * parseFloat(shippingFee) * parseFloat(evaluationFee);
        }
    }

    $scope.FinishedItem_mainStone_StonePriceCalulation = FinishedItem_mainStone_StonePriceCalulation;
    function FinishedItem_mainStone_StonePriceCalulation(Item) {
        //  stone price	 = Price per carat x weight 
        if (Item.mainStone != null) {
            Item.mainStone.weight = parseFloat(angular.isUndefined(Item.mainStone.weight) || (Item.mainStone.weight == "") || (Item.mainStone.weight == null) ? 1 : Item.mainStone.weight);
            Item.mainStone.pricepc= parseFloat(angular.isUndefined(Item.mainStone.pricepc) || (Item.mainStone.pricepc == "") || (Item.mainStone.pricepc == null) ? 1 : Item.mainStone.pricepc);
            Item.mainStone.stonePrice = parseFloat(Item.mainStone.weight) * parseFloat(Item.mainStone.pricepc)
            FinishedItem_mainStone_SubtotalCalulation(Item)
        }
    };

    $scope.FinishedItem_mainStone_SubtotalCalulation = FinishedItem_mainStone_SubtotalCalulation;
    function FinishedItem_mainStone_SubtotalCalulation(Item) {
        //  Subtotal = Stone price x market adjustment
        if (Item.mainStone != null) {
            Item.mainStone.marketAdj = parseFloat(angular.isUndefined(Item.mainStone.marketAdj) || (Item.mainStone.marketAdj == "") || (Item.mainStone.marketAdj == null) ? 1 : Item.mainStone.marketAdj);
            Item.mainStone.stonePrice = parseFloat(angular.isUndefined(Item.mainStone.stonePrice) || (Item.mainStone.stonePrice == "") || (Item.mainStone.stonePrice == null) ? 1 : Item.mainStone.stonePrice);
            Item.mainStone.subtotal = parseFloat(Item.mainStone.stonePrice) - parseFloat(CalculatePercentage(Item.mainStone.marketAdj, Item.mainStone.stonePrice));
            FinishedItem_mainStone_SalvageValueCalulation(Item)
        }
    };

    $scope.FinishedItem_mainStone_SalvageValueCalulation = FinishedItem_mainStone_SalvageValueCalulation;
    function FinishedItem_mainStone_SalvageValueCalulation(Item) {
        //salvage value = Subtotal x wholesale adjustment
        if (Item.mainStone != null) {
            Item.mainStone.subtotal = parseFloat(angular.isUndefined(Item.mainStone.subtotal) || (Item.mainStone.subtotal == "") || (Item.mainStone.subtotal == null) ? 1 : Item.mainStone.subtotal);
            Item.mainStone.wholesaleAdj = parseFloat(angular.isUndefined(Item.mainStone.wholesaleAdj) || (Item.mainStone.wholesaleAdj == "") || (Item.mainStone.wholesaleAdj == null) ? 1 : Item.mainStone.wholesaleAdj)
            Item.mainStone.salvageValue = (Item.mainStone.subtotal) - parseFloat(CalculatePercentage(Item.mainStone.wholesaleAdj, Item.mainStone.subtotal));
        }
    };

    $scope.FinishedItem_Estimate_NetProceedsCalulation = FinishedItem_Estimate_NetProceedsCalulation;
    function FinishedItem_Estimate_NetProceedsCalulation(Item) {
        //netProceeds=salvage value-(repairs+expenses)
        if (Item.salvageEstimate != null) {
            Item.salvageEstimate.estimatedSalvageValue = parseFloat(angular.isUndefined(Item.salvageEstimate.estimatedSalvageValue) || (Item.salvageEstimate.estimatedSalvageValue == "") || (Item.salvageEstimate.estimatedSalvageValue == null) ? 0 : Item.salvageEstimate.estimatedSalvageValue);
            Item.salvageEstimate.repairs = parseFloat(angular.isUndefined(Item.salvageEstimate.repairs) || (Item.salvageEstimate.repairs == "") || (Item.salvageEstimate.repairs == null) ? 0 : Item.salvageEstimate.repairs);
            Item.salvageEstimate.expenses = parseFloat(angular.isUndefined(Item.salvageEstimate.expenses) || (Item.salvageEstimate.expenses == "") || (Item.salvageEstimate.expenses == null) ?0 : Item.salvageEstimate.expenses);
            Item.salvageEstimate.netProceeds = (Item.salvageEstimate.estimatedSalvageValue) - parseFloat(Item.salvageEstimate.repairs + Item.salvageEstimate.expenses);
            calculateSalvageTotalFinishedItem();
        }
    };
    //Finished Calulation  End

    $scope.CalculatePercentage = CalculatePercentage;
    function CalculatePercentage(perRate, againstPercentage) {
        
        var perValue = 0;
        perRate =  parseFloat(perRate);
        againstPercentage =  parseFloat(againstPercentage);
        if (!isNaN(perRate) && !isNaN(againstPercentage)) {
            perValue = (perRate / 100) * (againstPercentage);
        } 
        return perValue;
    }
    
});