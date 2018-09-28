angular.module('MetronicApp').controller('GemLabOrderDetailsController', function ($translate, $translatePartialLoader, $rootScope, $log, $scope,
    settings, $http, $timeout, $location, $uibModal, $filter, AuthHeaderService, PurchaseOrderService, GemLabOrderDetailService) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    $translatePartialLoader.addPart('GemlabOrderDetails');
    $translate.refresh();
    $scope.PurchaseOrderDetails = [{ itemDetails: [] }];
    $scope.PurchaseOrderDetails.itemDetails;
    $scope.statusList = [];
    $scope.attachemnt = [];
    $scope.POStatusList = [];
    function init() {
        $scope.statusList = [{ id: true, name: "Yes" }, { id: false, name: "No" }];
        GetGemLabData();
        GetPurchaseOrderDetails();
    };
    init();

    $scope.GetPOStatusList = GetPOStatusList;
    function GetPOStatusList() {
        var param = {
            "id": $scope.PurchaseOrderDetails.orderType.id
        }
        $(".page-spinner-bar").removeClass("hide");
        var getPOStatusList = GemLabOrderDetailService.getStatusList(param);
        getPOStatusList.then(function (success) {
            $scope.POStatusList = success.data.data;
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            toastr.remove();
            if (error.data.errorMessage != null && angualr.isDefined(error.data.errorMessage))
                toastr.error(error.data.errorMessage, "Error");
            else
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error");
        });
    };

    $scope.PolicyHolderDetails;
    function GetPolicyholderData()
    {
        //Get Policy Details
        var paramPO = {
            "policyNumber": null,
            "claimNumber": $scope.PurchaseOrderDetails.claimNumber
        };
        $(".page-spinner-bar").removeClass("hide");
        var GetPolicyHolderDetails = GemLabOrderDetailService.GetPolicyHolderDetails(paramPO);
        GetPolicyHolderDetails.then(function (success) {           
            $scope.PolicyHolderDetails = success.data.data;
            $scope.PurchaseOrderDetails.phName = $scope.PolicyHolderDetails.policyHolder.lastName + ", " + $scope.PolicyHolderDetails.policyHolder.firstName;
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            toastr.remove();
            toastr.error((error.data) ? error.data.errorMessage : "Failed to get the policy holder details. please try again", "Error");
            $(".page-spinner-bar").addClass("hide");
        });
    }
    //get purchse order Details 
    $scope.GetPurchaseOrderDetails = GetPurchaseOrderDetails;
    function GetPurchaseOrderDetails() {
        $(".page-spinner-bar").removeClass("hide");
        var param = {
            "id": sessionStorage.getItem("OrderId")
        }
        var GetPurchaseOrderDetails = GemLabOrderDetailService.GetPurchaseOrder(param);
        GetPurchaseOrderDetails.then(function (success) {
            $scope.PurchaseOrderDetails = success.data.data;
            angular.element("input[type='file']").val(null);
            $scope.GemLabItemList = [];
            var tempNumber = 1;
            angular.forEach($scope.PurchaseOrderDetails.itemDetails, function (item) {
                var SINo = 1;
                $scope.tempStoneDetails = [];
                angular.forEach(item.stoneDetails, function (stones) {
                    $scope.tempStoneDetails.push({
                        SINo: SINo,
                        id: stones.id,
                        price: stones.price,
                        isDelete: stones.isDelete,
                        mmCtw: stones.mmCtw,
                        quantity: stones.quantity,
                        stoneClarity: stones.stoneClarity,
                        stoneColor: stones.stoneColor,
                        stoneShape: stones.stoneShape,
                        stoneType: stones.stoneType,
                    });
                    SINo++;
                })
                $scope.GemLabItemList.push({
                    number: tempNumber,
                    claimReason: { id: angular.isUndefined(item.claimReason) || item.claimReason == null ? null : item.claimReason.id },
                    csrVerifiedCurrentWeight: angular.isUndefined(item.csrVerifiedCurrentWeight) || item.csrVerifiedCurrentWeight == null ? null : item.csrVerifiedCurrentWeight,
                    damaged: angular.isUndefined(item.damaged) || item.damaged == null ? null : item.damaged,
                    gemLabItemType: { id: angular.isUndefined(item.gemLabItemType) || item.gemLabItemType == null ? null : item.gemLabItemType.id },
                    id: angular.isUndefined(item.id) || item.id == null ? null : item.id,
                    itemDescription: angular.isUndefined(item.itemDescription) || item.itemDescription == null ? null : item.itemDescription,
                    labCertificate: angular.isUndefined(item.labCertificate) || item.labCertificate == null ? null : item.labCertificate,
                    metalColor: { id: angular.isUndefined(item.metalColor) || item.metalColor == null ? null : item.metalColor.id },
                    metalType: { id: angular.isUndefined(item.metalType) || item.metalType == null ? null : item.metalType.id },
                    quantity: angular.isUndefined(item.quantity) || item.quantity == null ? null : item.quantity,
                    weight: angular.isUndefined(item.weight) || item.weight == null ? null : item.weight,
                    purchaseOrderServiceRequest: angular.isUndefined(item.purchaseOrderServiceRequest) || item.purchaseOrderServiceRequest == null ? null : item.purchaseOrderServiceRequest,
                    stoneDetails: angular.isUndefined($scope.tempStoneDetails) || $scope.tempStoneDetails == null ? null : $scope.tempStoneDetails,
                    labFee: angular.isUndefined(item.labFee) || item.labFee == null ? null : item.labFee,
                    AttachmentEditList: item.attachments,
                    AttachmentList: [],
                });
                tempNumber++;
            })
            $scope.PurchaseOrderDetails.itemDetails = $scope.GemLabItemList;
            GetPolicyholderData();
            GetPOStatusList();
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
    //GemLab Purachse order
    //$scope.stoneDetails = {};
    $scope.Genlab = {};
    $scope.NewStoneItem = false;
    //$scope.stoneDetails = [{ id: 1, stoneType: 'test', quantity: 2, price: 100, stoneColor: 'red', stoneClarity: 20, mm: 'test' },
    //                    { id: 2, stoneType: 'test', quantity: 2, price: 100, stoneColor: 'red', stoneClarity: 20, mm: 'test' }];
    $scope.stoneDetails = [];
    $scope.getTemplateStone = getTemplateStone;
    function getTemplateStone(item) {
        if (!angular.isUndefined(item)) {
            if (item.SINo === $scope.stoneDetails.SINo)
                return 'editStone';
            else
                return 'displayStone';
        }
        else
            return 'displayStone';
    };

    $scope.RemoveStone = RemoveStone;
    function RemoveStone(item, index) {
        item.stoneDetails.splice(index, 1);
    };
    $scope.AddOrCancelStone = AddOrCancelStone;
    function AddOrCancelStone(item, index, opt) {

        if (opt == 'Add') {
            var typename = getTypeName($scope.stoneDetails.stoneType.id);
            var stoneShapename = getstoneShapename($scope.stoneDetails.stoneShape.id);
            var colorname = getColorName($scope.stoneDetails.stoneColor.id);
            var clarityname = getClarityName($scope.stoneDetails.stoneClarity.id)
            item.stoneDetails.push({
                SINo: $scope.stoneDetails.SINo,
                stoneType: {
                    id: $scope.stoneDetails.stoneType.id,
                    name: typename
                },
                quantity: $scope.stoneDetails.quantity,
                price: $scope.stoneDetails.price,
                stoneShape: {
                    id: $scope.stoneDetails.stoneShape.id,
                    name: stoneShapename
                },
                stoneColor: {
                    id: $scope.stoneDetails.stoneColor.id,
                    name: colorname
                },
                stoneClarity: {
                    id: $scope.stoneDetails.stoneClarity.id,
                    name: clarityname
                },
                mmCtw: $scope.stoneDetails.mmCtw
            });
            $scope.stoneDetails = {};
            $scope.NewStoneItem = false;

        }
        else if (opt == 'Cancel') {
            $scope.stoneDetails = {};
            $scope.NewStoneItem = false;
        }
        else if (opt == 'Edit') {
            var typename = getTypeName($scope.stoneDetails.stoneType.id);
            var stoneShapename = getstoneShapename($scope.stoneDetails.stoneShape.id);
            var colorname = getColorName($scope.stoneDetails.stoneColor.id);
            var clarityname = getClarityName($scope.stoneDetails.stoneClarity.id)

            item.stoneDetails[index] = {
                id: angular.isDefined($scope.stoneDetails.id) ? $scope.stoneDetails.id : null,
                SINo: $scope.stoneDetails.SINo,
                stoneType: {
                    id: $scope.stoneDetails.stoneType.id,
                    name: typename
                },
                quantity: $scope.stoneDetails.quantity,
                price: $scope.stoneDetails.price,
                stoneShape: {
                    id: $scope.stoneDetails.stoneShape.id,
                    name: stoneShapename
                },
                stoneColor: {
                    id: $scope.stoneDetails.stoneColor.id,
                    name: colorname
                },
                stoneClarity: {
                    id: $scope.stoneDetails.stoneClarity.id,
                    name: clarityname
                },
                mmCtw: $scope.stoneDetails.mmCtw
            };
            $scope.stoneDetails = {};
            $scope.NewStoneItem = false;
        }
    };

    function getTypeName(id) {
        var name = ""
        angular.forEach($scope.StoneTypeList, function (stoneDetails) {
            if (stoneDetails.id == id) {
                name = stoneDetails.name;
            }
        });
        return name;
    };

    function getstoneShapename(id) {
        var name = ""
        angular.forEach($scope.StoneShapeList, function (stoneDetails) {
            if (stoneDetails.id == id) {
                name = stoneDetails.name;
            }
        });
        return name;
    };

    function getColorName(id) {
        var name = ""
        angular.forEach($scope.StoneColorList, function (stoneDetails) {
            if (stoneDetails.id == id) {
                name = stoneDetails.name;
            }
        });
        return name;
    };

    function getClarityName(id) {
        var name = ""
        angular.forEach($scope.StoneClarityList, function (stoneDetails) {
            if (stoneDetails.id == id) {
                name = stoneDetails.name;
            }
        });
        return name;
    };
    $scope.AddNewStone = AddNewStone;
    function AddNewStone() {
        $scope.NewStoneItem = true;
    };

    $scope.EditStone = EditStone;
    function EditStone(item) {
        $scope.stoneDetails = angular.copy(item);
        $scope.NewStoneItem = false;
    };

    //Gemlab Tab
    $scope.GemlabTab = 1;
    $scope.PurchaseOrderDetails.itemDetails = [{
        id: null,
        number: 1,
        itemDescription: "",
        claimReason: { id: null },
        gemLabItemType: { id: null },
        quantity: 0,
        metalType: { id: null },
        metalColor: { id: null },
        damaged: "",
        weight: 0,
        labCertificate: "",
        csrVerifiedCurrentWeight: 0,
        StoneList: [],
        purchaseOrderServiceRequest: {
            isItemInspection: false,
            isSarinRequest: false,
            isApprovalToRemove: false,
            isPreSalvageEstimationOnly: false,
            salvageValue: 0,
            customerBuyBackValue: 0,
            isAppraisalInformation: false,
            isCenterStone: false,
            isSideStone: false,
            isEntirePiece: false,
            colorDescription: "",
            clarityDescription: "",
            caratWeightDescription: "",
            isPhotoRequest: false,
            photoDetails: "",
            photoSpecialInstruction: "",
            totalCost: 0,
            note: ""
        },

    }];

    $scope.ShowGemLabTab = ShowGemLabTab;
    function ShowGemLabTab(index) {
        var currenttab = index + 1;
        $scope.GemlabTab = currenttab;
    };

    $scope.AddNewGemLabTab = AddNewGemLabTab;
    function AddNewGemLabTab() {
        var item = $scope.GemLabItemList.length + 1;
        $scope.GemLabItemList.push({
            id: null,
            number: item,
            stoneDetails: [],
            AttachmentList: [],
            //Description: "",
            //ClaimReason: { Id: null },
            //Type: { Id: null },
            //quantity: 0,
            //MetalType: { Id: null },
            //MetalColor: { Id: null },
            //DamagedDescription: "",
            //Weight: 0,
            //CertificateNumber: "",
            //CSRWeight: 0,
            //Inspection: { Id: 'false' },
            //SARIN: { Id: 'false', Remove: false },
            //Estimate: { Id: 'false', Salavage: 0, BuyBack: 0 },
            //AppraisalInfo: { Id: 'false', CenterStone: false, SideStone: false, EntireStone: false, Color: "", Clarity: 0, Weight: 0 },
            //PhotoRequest: { Id: 'false', Description: "", SpecialInstruction: "" }, NotesInstruction: ""
        });
    };
    $scope.ClaimReasonList = [];
    $scope.ItemTypeList = [];
    $scope.MetalTypeList = [];
    $scope.MetalColorList = [];
    $scope.StoneTypeList = [];
    $scope.StoneColorList == [];
    $scope.StoneShapeList = [];
    $scope.StoneClarityList = [];
    $scope.GemLabAssignmentList = [];

    $scope.GetGemLabData = GetGemLabData;
    function GetGemLabData() {
        //Get claim reason list
        var GetClaimReasonList = PurchaseOrderService.GetClaimReasonList();
        GetClaimReasonList.then(function (success) {
            $scope.ClaimReasonList = success.data.data;
        }, function (error) {
            toastr.remove();
            if (angular.isDefined(error.data.errorMessage) && error.data.errorMessage != null) {
                toastr.error(error.data.errorMessage, "Error");
            }
            else {
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error");
            }
        });


        //Get item type list
        var GetItemTypeList = PurchaseOrderService.GetItemTypeList();
        GetItemTypeList.then(function (success) {
            $scope.ItemTypeList = success.data.data;
        }, function (error) {
            toastr.remove();
            if (angular.isDefined(error.data.errorMessage) && error.data.errorMessage != null) {
                toastr.error(error.data.errorMessage, "Error");
            }
            else {
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error");
            }
        });

        //Get metal type list
        var GetMetalTypeList = PurchaseOrderService.GetMetalTypeList();
        GetMetalTypeList.then(function (success) {
            $scope.MetalTypeList = success.data.data;
        }, function (error) {
            toastr.remove();
            if (angular.isDefined(error.data.errorMessage) && error.data.errorMessage != null) {
                toastr.error(error.data.errorMessage, "Error");
            }
            else {
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error");
            }
        });

        //Get metal color list
        var GetMetalColorList = PurchaseOrderService.GetMetalColorList();
        GetMetalColorList.then(function (success) {
            $scope.MetalColorList = success.data.data;
        }, function (error) {
            toastr.remove();
            if (angular.isDefined(error.data.errorMessage) && error.data.errorMessage != null) {
                toastr.error(error.data.errorMessage, "Error");
            }
            else {
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error");
            }
        });

        //Get stone type  list
        var GetStoneTypeList = PurchaseOrderService.GetStoneTypeList();
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

        //Get stone color list
        var GetStoneColorList = PurchaseOrderService.GetStoneColorList();
        GetStoneColorList.then(function (success) {
            $scope.StoneColorList = success.data.data;
        }, function (error) {
            toastr.remove();
            if (angular.isDefined(error.data.errorMessage) && error.data.errorMessage != null) {
                toastr.error(error.data.errorMessage, "Error");
            }
            else {
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error");
            }
        });

        //Get stone shape list
        var GetStoneShapeList = PurchaseOrderService.GetStoneShapeList();
        GetStoneShapeList.then(function (success) {
            $scope.StoneShapeList = success.data.data;
        }, function (error) {
            toastr.remove();
            if (angular.isDefined(error.data.errorMessage) && error.data.errorMessage != null) {
                toastr.error(error.data.errorMessage, "Error");
            }
            else {
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error");
            }
        });

        //Get stone clarity list
        var GetStoneClarityList = PurchaseOrderService.GetStoneClarityList();
        GetStoneClarityList.then(function (success) {
            $scope.StoneClarityList = success.data.data;
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            toastr.remove();
            if (angular.isDefined(error.data.errorMessage) && error.data.errorMessage != null) {
                toastr.error(error.data.errorMessage, "Error");
            }
            else {
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error");
            }
        });


        //Get gemlab assignment list
        var GetAssignmentList = PurchaseOrderService.GetGemLabAssignmentList();
        GetAssignmentList.then(function (success) {
            $scope.GemLabAssignmentList = success.data.data;
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            toastr.remove();
            if (angular.isDefined(error.data.errorMessage) && error.data.errorMessage != null) {
                toastr.error(error.data.errorMessage, "Error");
            }
            else {
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error");
            }
        });
    };
    $scope.back = function () {
        //$window.history.back();
        $location.url(sessionStorage.getItem('HomeScreen'));
    }

    //File Upload Attachment
    $scope.currentItem = null;
    $scope.AddAttachment = function (Item) {
        $scope.currentItem = Item;
        angular.element('#FileUpload').trigger('click');
    }
    $scope.AttachmentList = [];
    $scope.getattachemntFileDetails = function (e) {
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
    };
    $scope.LoadFileInList = function (e) {
        $scope.$apply(function () {
            if ($scope.currentItem != null) {
                $scope.currentItem.AttachmentList.push({
                    "FileName": e.target.fileName, "FileExtension": e.target.fileExtension, "FileType": e.target.fileType, "Image": e.target.result, "File": e.target.file
                })
            }
        });
    }

    $scope.RemoveAttachment = RemoveAttachment;
    function RemoveAttachment(index, Item) {
        if (Item.AttachmentList.length > 0) {
            Item.AttachmentList.splice(index, 1);
        }
    };
    //End File Upload Attachment

    $scope.Save_PO_GemblabRequest = Save_PO_GemblabRequest;
    function Save_PO_GemblabRequest() {
        var param = new FormData();
        $scope.List = [];
        var index = 0;
        angular.forEach($scope.GemLabItemList, function (Item) {
            angular.forEach(Item.AttachmentList, function (attachment) {
                $scope.List.push({
                    "fileName": attachment.FileName,
                    "fileType": attachment.FileType,
                    "extension": attachment.FileExtension,
                    "filePurpose": "GEMLAB_PURCHASE_ORDER",
                    "latitude": null,
                    "longitude": null,
                    "index": index,
                })

                param.append('file', attachment.File);
            })
            index = index + 1;
        });
        if ($scope.List.length == 0) {
            param.append('file', null);
            param.append('filesDetails', null);
        }
        else {
            param.append('filesDetails', JSON.stringify($scope.List));
        }

        $scope.PurchaseOrderDetails.itemDetails = JSON.parse(angular.toJson($scope.PurchaseOrderDetails.itemDetails));
        var item_Stone_Details = [];
        angular.forEach($scope.PurchaseOrderDetails.itemDetails, function (item) {
            angular.forEach(item.stoneDetails, function (itemStoneDetails) {
                item_Stone_Details.push({
                    id: (angular.isDefined(itemStoneDetails.id)) ? itemStoneDetails.id : null,
                    //SINo: itemStoneDetails.SINo,
                    stoneType: {
                        id: itemStoneDetails.stoneType.id,
                        //name: itemStoneDetails.stoneType.name
                    },
                    quantity: itemStoneDetails.quantity,
                    price: itemStoneDetails.price,
                    stoneShape: {
                        id: itemStoneDetails.stoneShape.id,
                        //name: itemStoneDetails.stoneShape.name
                    },
                    stoneColor: {
                        id: itemStoneDetails.stoneColor.id,
                        //name: itemStoneDetails.stoneColor.name
                    },
                    stoneClarity: {
                        id: itemStoneDetails.stoneClarity.id,
                        //name: itemStoneDetails.stoneClarity.name
                    },
                    mmCtw: itemStoneDetails.mmCtw
                });
            });
            item.stoneDetails = item_Stone_Details.length == 0 ? null : item_Stone_Details;
            item_Stone_Details = [];
            delete item.AttachmentList;
            delete item.AttachmentEditList;
            delete item.number;
            if (item.purchaseOrderServiceRequest) {
                item.purchaseOrderServiceRequest.id = angular.isUndefined(item.purchaseOrderServiceRequest.id) ? null : item.purchaseOrderServiceRequest.id,
                item.purchaseOrderServiceRequest.isAppraisalInformation = angular.isUndefined(item.purchaseOrderServiceRequest.isAppraisalInformation) ? false : item.purchaseOrderServiceRequest.isAppraisalInformation,
                item.purchaseOrderServiceRequest.isItemInspection = angular.isUndefined(item.purchaseOrderServiceRequest.isItemInspection) ? false : item.purchaseOrderServiceRequest.isItemInspection,
                item.purchaseOrderServiceRequest.isPhotoRequest = angular.isUndefined(item.purchaseOrderServiceRequest.isPhotoRequest) ? false : item.purchaseOrderServiceRequest.isPhotoRequest,
                item.purchaseOrderServiceRequest.isPreSalvageEstimationOnly = angular.isUndefined(item.purchaseOrderServiceRequest.isPreSalvageEstimationOnly) ? false : item.purchaseOrderServiceRequest.isPreSalvageEstimationOnly,
                item.purchaseOrderServiceRequest.isSarinRequest = angular.isUndefined(item.purchaseOrderServiceRequest.isSarinRequest) ? false : item.purchaseOrderServiceRequest.isSarinRequest,
                item.purchaseOrderServiceRequest.isSideStone = angular.isUndefined(item.purchaseOrderServiceRequest.isSideStone) ? null : item.purchaseOrderServiceRequest.isSideStone,
                item.purchaseOrderServiceRequest.isApprovalToRemove = angular.isUndefined(item.purchaseOrderServiceRequest.isApprovalToRemove) ? null : item.purchaseOrderServiceRequest.isApprovalToRemove,
                item.purchaseOrderServiceRequest.isCenterStone = angular.isUndefined(item.purchaseOrderServiceRequest.isCenterStone) ? null : item.purchaseOrderServiceRequest.isCenterStone,
                item.purchaseOrderServiceRequest.isEntirePiece = angular.isUndefined(item.purchaseOrderServiceRequest.isEntirePiece) ? null : item.purchaseOrderServiceRequest.isEntirePiece,
                item.purchaseOrderServiceRequest.caratWeightDescription = angular.isUndefined(item.purchaseOrderServiceRequest.caratWeightDescription) ? null : item.purchaseOrderServiceRequest.caratWeightDescription,
                item.purchaseOrderServiceRequest.clarityDescription = angular.isUndefined(item.purchaseOrderServiceRequest.clarityDescription) ? null : item.purchaseOrderServiceRequest.clarityDescription,
                item.purchaseOrderServiceRequest.colorDescription = angular.isUndefined(item.purchaseOrderServiceRequest.colorDescription) ? null : item.purchaseOrderServiceRequest.colorDescription,
                item.purchaseOrderServiceRequest.customerBuyBackValue = angular.isUndefined(item.purchaseOrderServiceRequest.customerBuyBackValue) ? null : item.purchaseOrderServiceRequest.customerBuyBackValue,
                item.purchaseOrderServiceRequest.note = angular.isUndefined(item.purchaseOrderServiceRequest.note) ? null : item.purchaseOrderServiceRequest.note,
                item.purchaseOrderServiceRequest.photoDetails = angular.isUndefined(item.purchaseOrderServiceRequest.photoDetails) ? null : item.purchaseOrderServiceRequest.photoDetails,
                item.purchaseOrderServiceRequest.photoSpecialInstruction = angular.isUndefined(item.purchaseOrderServiceRequest.photoSpecialInstruction) ? null : item.purchaseOrderServiceRequest.photoSpecialInstruction,
                item.purchaseOrderServiceRequest.salvageValue = angular.isUndefined(item.purchaseOrderServiceRequest.salvageValue) ? null : item.purchaseOrderServiceRequest.salvageValue,
                item.purchaseOrderServiceRequest.totalCost = angular.isUndefined(item.purchaseOrderServiceRequest.totalCost) ? null : item.purchaseOrderServiceRequest.totalCost
            } else {
                item.purchaseOrderServiceRequest = null;
            }
        });
        var Gemlabparam = {
            "id": $scope.PurchaseOrderDetails.id,
            "assignmentNumber": $scope.PurchaseOrderDetails.assignmentNumber,
            "claimNumber": $scope.PurchaseOrderDetails.claimNumber,
            "description": (angular.isUndefined($scope.PurchaseOrderDetails.description) ? null : $scope.PurchaseOrderDetails.description),
            "lineItem": {
                "id": (angular.isDefined($scope.PurchaseOrderDetails.lineItem.id) ? $scope.PurchaseOrderDetails.lineItem.id : null)
            },
            "associate": {
                "id": angular.isUndefined($scope.PurchaseOrderDetails.associate) || $scope.PurchaseOrderDetails.associate== null ? null : $scope.PurchaseOrderDetails.associate.id
            },
            "orderType": {
                "id": $scope.PurchaseOrderDetails.orderType.id
            },
            "purchaseOrderStatus": {
                "id": (angular.isDefined($scope.PurchaseOrderDetails.purchaseOrderStatus) && $scope.PurchaseOrderDetails.purchaseOrderStatus != null) ? $scope.PurchaseOrderDetails.purchaseOrderStatus.id : 1
            },
            "itemDetails": JSON.parse(angular.toJson($scope.PurchaseOrderDetails.itemDetails))
        };
        param.append("purchaseOrder", JSON.stringify(Gemlabparam));
        $(".page-spinner-bar").removeClass("hide");
        var SaveGemlabRequest = PurchaseOrderService.SaveGemlabRequest(param);
        SaveGemlabRequest.then(function (success) {
            //changeOrderStatus();
            var param_Notification = {
                "assignmentNumber": $scope.PurchaseOrderDetails.assignmentNumber,
                "claimNumber": $scope.PurchaseOrderDetails.claimNumber,
                "receiverId": 3,
                "purchaseOrderId": $scope.PurchaseOrderDetails.id
            }
            var Notification = PurchaseOrderService.sendNotification_associate(param_Notification);
            Notification.then(function (sucess) {
                //alert("Gemlab Update Notification Send sucessfully");
            }, function (error) {
            });
            $location.url("GemlabDashboard");
            toastr.remove()
            toastr.success((success.data.message !== null) ? success.data.message : "Order details saved successfully.", "Confirmation");
            $(".page-spinner-bar").addClass("hide");

        }, function (error) {
            toastr.remove()
            toastr.error((error.data) ? error.data.message : "Failed to saved the order details.", "Error");
            $(".page-spinner-bar").addClass("hide");
        });
    };

    $scope.changeOrderStatus = changeOrderStatus;
    function changeOrderStatus() {
        angular.forEach($scope.POStatusList, function (item) {
            if (item.name == "COMPLETED")
            {
                $scope.PurchaseOrderDetails.purchaseOrderStatus.id = item.id;
            }
        });
        var statusParam = {
            "id": $scope.PurchaseOrderDetails.id, // purchase order id
            "status": {
                "id": $scope.PurchaseOrderDetails.purchaseOrderStatus.id // status id
            },
            "orderType": {
                "id": $scope.PurchaseOrderDetails.orderType.id  // order type id
            }
        }
         
        $(".page-spinner-bar").removeClass("hide");
        var statusDetails = PurchaseOrderService.ChangeOrderStatus(statusParam)
        statusDetails.then(function (success) {
            toastr.remove()
            toastr.success((success.data.message !== null) ? success.data.message : "Order details updated successfully.", "Confirmation");
            $location.url("GemlabDashboard");
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            $(".page-spinner-bar").addClass("hide");
            toastr.remove();
            if (angular.isDefined(error.data.errorMessage) && error.data.errorMessage != null) {
                toastr.error(error.data.errorMessage, "Error");
            }
            else {
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error");
            }
        });
    };

    $scope.canclePurchaseOrder = canclePurchaseOrder;
    function canclePurchaseOrder() {
        $location.url("GemlabDashboard");
    };
    $scope.RemoveGemLabTab = RemoveGemLabTab;
    function RemoveGemLabTab(index) {
        $scope.GemLabItemList.splice(index, 1);
        var currenttab = $scope.GemLabItemList.length;
        var number = 1;
        angular.forEach($scope.GemLabItemList, function (item) {
            item.number = number++;
        });
        $scope.GemlabTab = 1;
    };

    $scope.isSarinRequestChanged = isSarinRequestChanged;
    function isSarinRequestChanged(Item) {
        if (Item.purchaseOrderServiceRequest.isSarinRequest == "true") {
            Item.purchaseOrderServiceRequest.isSarinRequest = true;
            Item.purchaseOrderServiceRequest.isApprovalToRemove = false;
        } else {
            Item.purchaseOrderServiceRequest.isSarinRequest = false;
        }
    };

});