angular.module('MetronicApp').controller('SearchPODetailsController', function ($translate, $translatePartialLoader, $rootScope, $log, $scope,
    settings, $http, $timeout, $location, $uibModal, $filter, AuthHeaderService, PurchaseOrderService) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    $translatePartialLoader.addPart('GemlabOrderDetails');
    $translate.refresh();

    function init() {
        $scope.PackingSlip = false;
        GetGemLabData();
        SetInitialOrderDetails();
         
        //Get Purchase order types
        $scope.OrderTypeList = [];
        var TypeList = PurchaseOrderService.GetOrderTypes();
        TypeList.then(function (success) {
            $scope.OrderTypeList = success.data.data;
        }, function (error) {
            $scope.OrderTypeList = [];
        });
    };
    init();

   
    //Initial order Details
    function SetInitialOrderDetails() {
        if (angular.isUndefined($scope.OrderDetails)) {
            $scope.OrderDetails = {
                "orderType": {
                    "name": 'BIB from PH'
                },
                //"lineItem": { "itemId": $scope.CommonObj.PurchaseItemId },
                //"claim": { "claimId": $scope.CommonObj.PurchaseClaimId }
            };
        }
        if (angular.isDefined($scope.PolicyHolderDetails) && $scope.PolicyHolderDetails !== null) {
            $scope.OrderDetails = {
                "orderType": {
                    "name": $scope.OrderDetails.orderType.name
                },
                //"lineItem": { "itemId": $scope.CommonObj.PurchaseItemId },
                //"claim": { "claimId": $scope.CommonObj.PurchaseClaimId },
                //"orderDate": $filter('TodaysDate')(),
                "csr": sessionStorage.getItem("Name"),
                //"csr": $scope.PolicyHolderDetails.policyHolder.lastName + ", " + $scope.PolicyHolderDetails.policyHolder.firstName,

                "phName": (angular.isDefined($scope.PolicyHolderDetails.policyHolder) && $scope.PolicyHolderDetails.policyHolder !== null) ? ($scope.PolicyHolderDetails.policyHolder.lastName + ", " + $scope.PolicyHolderDetails.policyHolder.firstName) : null,
                "address": (angular.isDefined($scope.PolicyHolderDetails.policyHolder) && $scope.PolicyHolderDetails.policyHolder !== null) ? ((angular.isDefined($scope.PolicyHolderDetails.policyHolder.address) && $scope.PolicyHolderDetails.policyHolder.address !== null) ? ({
                    "city": $scope.PolicyHolderDetails.policyHolder.address.city,
                    "streetAddressOne": $scope.PolicyHolderDetails.policyHolder.address.streetAddressOne,
                    "streetAddressTwo": $scope.PolicyHolderDetails.policyHolder.address.streetAddressTwo,
                    "zipcode": $scope.PolicyHolderDetails.policyHolder.address.zipcode,
                    "state": {
                        "id": $scope.PolicyHolderDetails.policyHolder.address.state.id
                    }
                }) : null) : null,
                "phone": (angular.isDefined($scope.PolicyHolderDetails.policyHolder) && $scope.PolicyHolderDetails.policyHolder !== null) ? $scope.PolicyHolderDetails.policyHolder.cellPhone : null,
                "email": (angular.isDefined($scope.PolicyHolderDetails.policyHolder) && $scope.PolicyHolderDetails.policyHolder !== null) ? $scope.PolicyHolderDetails.policyHolder.email : null
            };
        }
    }

    //  PackingSlip
    $scope.GoToPackingSlip = GoToPackingSlip;
    function GoToPackingSlip() {
        $scope.PurchaseOrderAddEdit = false;
        $scope.PackingSlip = true;
        $scope.OrderPackingSlip_ItemList = [];

        $(".page-spinner-bar").removeClass("hide");
        var getVendorCompanyDetails = PurchaseOrderService.GetVendorDetails();
        getVendorCompanyDetails.then(function (success) {
            $scope.VendorCompanyDetails = success.data.data;
            $(".page-spinner-bar").addClass("hide");

        }, function (error) {
            toastr.remove();
            if (angualr.isDefined(error.data.errorMessage) && error.data.errorMessage !== null) {
                toastr.error(error.data.errorMessage, "Error");
            }
            else {
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error");
            }

        });

        var IDVar = 1;
        if (angular.isDefined($scope.OrderDetails.purchaseOrderItems)) {
            $scope.OrderPackingSlip_ItemList.push({ id: IDVar, description: $scope.OrderDetails.purchaseOrderItems[0].description, quantity: $scope.OrderDetails.purchaseOrderItems[0].quantity });
        }
        angular.forEach($scope.SelectedPackingSlips, function (slip) {
            IDVar++;
            $scope.OrderPackingSlip_ItemList.push({ id: IDVar, description: slip.attachName, quantity: slip.quantity });
        });

    };

    $scope.HidePackingSlipDiv = HidePackingSlipDiv;
    function HidePackingSlipDiv() {
        $scope.PurchaseOrderAddEdit = true;
        $scope.PackingSlip = false;
    };
    $scope.ClearPackingSlipItems = ClearPackingSlipItems;
    function ClearPackingSlipItems() {
        $scope.SelectedPackingSlips = [];
        $scope.OrderShipment_ItemList = [];
        angular.forEach($scope.PackingSlipList, function (slip) {
            slip.IsChecked = false;
        });
    };
    //GemLab Purachse order
    $scope.Stone = {};
    $scope.Genlab = {};
    $scope.NewStoneItem = false;
    $scope.StoneList = [{ id: 1, type: 'test', quantity: 2, price: 100, color: 'red', clarity: 20, mm: 'test' },
                        { id: 2, type: 'test', quantity: 2, price: 100, color: 'red', clarity: 20, mm: 'test' }];
    $scope.getTemplateStone = getTemplateStone;
    function getTemplateStone(item) {
        if (!angular.isUndefined(item)) {
            if (item.id === $scope.Stone.id)
                return 'editStone';
            else
                return 'displayStone';
        }
        else
            return 'displayStone';
    };

    $scope.RemoveStone = RemoveStone;
    function RemoveStone(item, index) {
        item.StoneList.splice(index, 1);
    };
    $scope.AddOrCancelStone = AddOrCancelStone;
    function AddOrCancelStone(item, index, opt) {

        if (opt == 'Add') {

            var typename = getTypeName($scope.Stone.type.id);
            var colorname = getColorName($scope.Stone.color.id);
            var clarityname = getClarityName($scope.Stone.clarity.id)

            item.StoneList.push({
                id: $scope.Stone.id,
                type: {
                    id: $scope.Stone.type.id,
                    name: typename
                },
                quantity: 2, price: 100,
                color: {
                    id: $scope.Stone.color.id,
                    name: colorname
                },
                clarity: {
                    id: $scope.Stone.clarity.id,
                    name: clarityname
                },
                mm: $scope.Stone.mm
            });


            $scope.Stone = {};
            $scope.NewStoneItem = false;

        }
        else if (opt == 'Cancel') {
            $scope.Stone = {};
            $scope.NewStoneItem = false;
        }
        else if (opt == 'Edit') {
            var typename = getTypeName($scope.Stone.type.id);
            var colorname = getColorName($scope.Stone.color.id);
            var clarityname = getClarityName($scope.Stone.clarity.id)

            item.StoneList[index] = {
                id: $scope.Stone.id,
                type: {
                    id: $scope.Stone.type.id,
                    name: typename
                },
                quantity: 2, price: 100,
                color: {
                    id: $scope.Stone.color.id,
                    name: colorname
                },
                clarity: {
                    id: $scope.Stone.clarity.id,
                    name: clarityname
                },
                mm: $scope.Stone.mm
            };

            $scope.Stone = {};
            $scope.NewStoneItem = false;
        }

    };

    function getTypeName(id) {
        var name = ""
        angular.forEach($scope.StoneTypeList, function (stone) {
            if (stone.id == id) {
                name = stone.name;

            }
        });

        return name;
    };

    function getColorName(id) {
        var name = ""
        angular.forEach($scope.StoneColorList, function (stone) {
            if (stone.id == id) {
                name = stone.name;
            }
        });
        return name;
    };

    function getClarityName(id) {
        var name = ""
        angular.forEach($scope.StoneClarityList, function (stone) {
            if (stone.id == id) {
                name = stone.name;
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
        $scope.Stone = angular.copy(item);
        $scope.NewStoneItem = false;
    };

    //Gemlab Tab
    $scope.GemlabTab = 1;
    $scope.GemLabItemList = [{
        id: 1, Description: "",
        ClaimReason: { Id: null },
        Type: { Id: null },
        quantity: 0,
        MetalType: { Id: null },
        MetalColor: { Id: null },
        DamagedDescription: "",
        Weight: 0,
        CertificateNumber: "",
        CSRWeight: 0,
        StoneList: [],
        Inspection: { Id: 'false' },
        SARIN: { Id: 'false', Remove: false },
        Estimate: { Id: 'false', Salavage: 0, BuyBack: 0 },
        AppraisalInfo: { Id: 'false', CenterStone: false, SideStone: false, EntireStone: false, Color: "", Clarity: 0, Weight: 0 },
        PhotoRequest: { Id: 'false', Description: "", SpecialInstruction: "" },
        NotesInstruction: ""
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
            id: item, Description: "",
            ClaimReason: { Id: null },
            Type: { Id: null },
            quantity: 0,
            MetalType: { Id: null },
            MetalColor: { Id: null },
            DamagedDescription: "",
            Weight: 0,
            CertificateNumber: "",
            CSRWeight: 0,
            StoneList: [],
            Inspection: { Id: 'false' },
            SARIN: { Id: 'false', Remove: false },
            Estimate: { Id: 'false', Salavage: 0, BuyBack: 0 },
            AppraisalInfo: { Id: 'false', CenterStone: false, SideStone: false, EntireStone: false, Color: "", Clarity: 0, Weight: 0 },
            PhotoRequest: { Id: 'false', Description: "", SpecialInstruction: "" }, NotesInstruction: ""
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

    $scope.IntialiseComponent = IntialiseComponent;
    function IntialiseComponent() {
        if ($scope.OrderDetails.orderType.name == 'Gemlab Request') {
            $(".page-spinner-bar").removeClass("hide");
            $scope.GetGemLabData();
        }
        $scope.ClearPackingSlipItems();
        SetInitialOrderDetails();
        //$rootScope.BIBFormPH.$setUntouched(); 
    };

    $scope.back = function () {

        //$window.history.back();
        $location.url("/AdjusterGlobalSearch");
    }

});