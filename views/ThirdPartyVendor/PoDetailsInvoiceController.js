angular.module('MetronicApp').controller('PoDetailsInvoiceController', function ($rootScope, $scope, settings, $location, $translate, $translatePartialLoader,$filter, AuthHeaderService,PurchaseOrderService, $uibModal) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    $translatePartialLoader.addPart('AssociateLineItemDetails');
    $translate.refresh();
    $scope.init = init;
    $scope.OrderDetails = {};
    $scope.SelectedPackingSlips = [];
    $scope.PackingSlipList = null;
    $scope.OrderPackingSlip_ItemList = [];
    $scope.OrderFromvendor_ItemList = [];
    $scope.OrderShipment_ItemList = [];
    $scope.ReturnItem = {};
    function init()
    {
        $scope.commonObj = {
            AssignmentNumber: sessionStorage.getItem("AssignmentNumber"),
            PurchaseOrderId: sessionStorage.getItem('InvoicePoDetailsID'),
            ItemDescription:null
        }
        GetPackingSlipList();
        getPurchaseOrderDetails();
    }
    init();
    
    $scope.getPurchaseOrderDetails = getPurchaseOrderDetails;
    function getPurchaseOrderDetails()
    {
        $(".page-spinner-bar").removeClass("hide");
        var paramId = {
            "id": $scope.commonObj.PurchaseOrderId
        };
    var GetDetails = PurchaseOrderService.GetPurchaseOrderDetails(paramId);
    GetDetails.then(function (success) {
        $scope.OrderDetails = success.data.data[0];
        //For all the order
        $scope.OrderDetails.date = (angular.isDefined($scope.OrderDetails.date) && $scope.OrderDetails.date != null) ? ($filter('DateFormatMMddyyyy')($scope.OrderDetails.date)) : ($filter('TodaysDate')());
        $scope.OrderDetails.arrivalAtDestination = (angular.isDefined($scope.OrderDetails.arrivalAtDestination) && $scope.OrderDetails.arrivalAtDestination != null) ? ($filter('DateFormatMMddyyyy')($scope.OrderDetails.arrivalAtDestination)) : null
        $scope.OrderDetails.eta = (angular.isDefined($scope.OrderDetails.eta) && $scope.OrderDetails.eta != null) ? ($filter('DateFormatMMddyyyy')($scope.OrderDetails.eta)) : null
        $scope.OrderDetails.createDate = (angular.isDefined($scope.OrderDetails.createDate) && $scope.OrderDetails.createDate != null) ? ($filter('DateFormatMMddyyyy')($scope.OrderDetails.createDate)) : (null);
        $scope.OrderDetails.pickupDate = (angular.isDefined($scope.OrderDetails.pickupDate) && $scope.OrderDetails.pickupDate != null) ? ((($scope.OrderDetails.pickupDate.indexOf('T') !== -1)) ? $filter('DateFormatMMddyyyy')($scope.OrderDetails.pickupDate) : $scope.OrderDetails.pickupDate) : null;
        $scope.OrderDetails.receivedDate = (angular.isDefined($scope.OrderDetails.receivedDate) && $scope.OrderDetails.receivedDate != null) ? ($filter('DateFormatMMddyyyy')($scope.OrderDetails.receivedDate)) : null
        $scope.OrderDetails.submitDate = (angular.isDefined($scope.OrderDetails.submitDate) && $scope.OrderDetails.submitDate != null) ? ($filter('DateFormatMMddyyyy')($scope.OrderDetails.submitDate)) : null
        $scope.OrderDetails.dateOrdered = (angular.isDefined($scope.OrderDetails.dateOrdered) && $scope.OrderDetails.dateOrdered != null) ? ($filter('DateFormatMMddyyyy')($scope.OrderDetails.dateOrdered)) : null
        if ($scope.OrderDetails.orderType.name == "BIB from PH") {
            $scope.OrderDetails.phone = $filter('tel')($scope.OrderDetails.phone);
            $scope.commonObj.ItemDescription = $scope.OrderDetails.purchaseOrderItems[0].description;
            $scope.currentItemId = $scope.OrderDetails.lineItem.itemId;

            $scope.OrderDetails.pickupTime = $filter('DateFormatTimeOne')($scope.OrderDetails.pickupTime);
            $scope.OrderPackingSlip_ItemList = [];

            angular.forEach($scope.PackingSlipList, function (item) {

                if (angular.isDefined($scope.OrderDetails.packingSlipDetails)) {
                    angular.forEach($scope.OrderDetails.packingSlipDetails.attaches, function (orderitemslip) {
                        if (orderitemslip.id == item.id) {
                            item.IsChecked = true;
                            $scope.SelectedPackingSlips.push(item);
                        }
                    });
                }
            });

            if (angular.isDefined($scope.OrderDetails.id) && $scope.OrderDetails.id != null) {
                if (angular.isDefined($scope.OrderDetails.packingSlipDetails)) {

                    if ($scope.OrderDetails.packingSlipDetails.items != null && $scope.OrderDetails.packingSlipDetails.items.length > 0) {
                        angular.forEach($scope.OrderDetails.packingSlipDetails.items, function (item) {
                            $scope.OrderPackingSlip_ItemList.push({ id: item.id, description: item.description, quantity: item.quantity });
                        });
                    }
                }
            }

            if ($scope.OrderDetails.gemLabRequestPurchaseOrders != null) {
                $scope.temp_BIB_Of_GemlabRequest = $scope.OrderDetails.gemLabRequestPurchaseOrders[0];
                $scope.OrigionalGemlabObject = $scope.OrderDetails.gemLabRequestPurchaseOrders[0];
            }
        }
        if ($scope.OrderDetails.orderType.name == "Shipment") {
            $scope.commonObj.ItemDescription = $scope.OrderDetails.description;
            $scope.OrderDetails.phone = $filter('tel')($scope.OrderDetails.phone);
            $scope.OrderPackingSlip_ItemList = [];
            angular.forEach($scope.PackingSlipList, function (item) {
                angular.forEach($scope.OrderDetails.packingSlipDetails.attaches, function (orderitemslip) {
                    if (orderitemslip.id == item.id) {
                        item.IsChecked = true;
                        $scope.SelectedPackingSlips.push(item);
                    }
                });
            });
            $scope.OrderShipment_ItemList = [];
            var id = 1;
            angular.forEach($scope.OrderDetails.purchaseOrderItems, function (item) {
                id++;
                $scope.OrderShipment_ItemList.push({ id: item.id, SINo: id, description: item.description, quantity: item.availabeQuantity, SKU: item.sku, unitPrice: item.unitPrice, amount: item.amount, status: item.status, saleTax: item.saleTax });
            });

            $scope.CalculateTotalShipment();

            if (angular.isDefined($scope.OrderDetails.id) && $scope.OrderDetails.id != null) {
                if (angular.isDefined($scope.OrderDetails.packingSlipDetails)) {

                    if ($scope.OrderDetails.packingSlipDetails.items != null && $scope.OrderDetails.packingSlipDetails.items.length > 0) {
                        angular.forEach($scope.OrderDetails.packingSlipDetails.items, function (item) {
                            $scope.OrderPackingSlip_ItemList.push({ id: item.id, description: item.description, quantity: item.quantity });
                        });
                    }
                }
            }
        }
        if ($scope.OrderDetails.orderType.name == "Pick up from Vendor/Email Label") {
            $(".page-spinner-bar").removeClass("hide");
            SelectedSupplierDetails();
            $scope.GetReturnPurchaseItems();
            $scope.OrderDetails.pickupTime = $filter('DateFormatTimeOne')($scope.OrderDetails.pickupTime);
            $scope.OrderPickUpFromVendor_ItemList = [];

            if ($scope.OrderDetails.purchaseOrderItems != null) {
                var id = 1;
                angular.forEach($scope.OrderDetails.purchaseOrderItems, function (item) {
                    id++;
                    $scope.OrderPickUpFromVendor_ItemList.push({ id: item.id, SINo: id, sku: item.sku, description: item.description, quantity: item.availabeQuantity, unitPrice: item.unitPrice, amount: item.amount, status: item.status });
                })
            }
            if ($scope.OrderDetails.gemLabRequestPurchaseOrders != null) {
                $scope.temp_BIB_Of_GemlabRequest = $scope.OrderDetails.gemLabRequestPurchaseOrders[0];
                $scope.OrigionalGemlabObject = $scope.OrderDetails.gemLabRequestPurchaseOrders[0];
            }
            $scope.CalculateTotalPickUpFromVendor();
            $scope.OrderPackingSlip_ItemList = $scope.OrderDetails.purchaseOrderItems;
        }
        if ($scope.OrderDetails.orderType.name == "Labor Charges") {
            $scope.OrderLbourCharges_ItemList = [];
            var id = 1;
            $scope.commonObj.ItemDescription = $scope.OrderDetails.description;
            angular.forEach($scope.OrderDetails.purchaseOrderItems, function (item) {
                id++;
                $scope.OrderLbourCharges_ItemList.push({ id: item.id, SINo: id, sku: item.sku, unitPrice: item.unitPrice, amount: item.amount, quantity: item.availabeQuantity, status: 'true' });
            })

            $scope.LaborCostWorkDetails = [];
            if (angular.isDefined($scope.OrderDetails.laborCodeDetails) && $scope.OrderDetails.laborCodeDetails != null) {
                $scope.LaborCostWorkDetails = [{
                    "code": $scope.OrderDetails.laborCodeDetails.code,
                    "description": $scope.OrderDetails.laborCodeDetails.description,
                    "id": $scope.OrderDetails.laborCodeDetails.id,
                    "jobName": $scope.OrderDetails.laborCodeDetails.jobName,
                    "price": $scope.OrderDetails.laborCodeDetails.price
                }];
            }
        }
        if ($scope.OrderDetails.orderType.name == "Order from Vendor") {
            $scope.OrderFromvendor_ItemList = [];
            $scope.OrderDetails.orderTotalCost = $filter('currency')($scope.OrderDetails.orderTotalCost);
            if ($scope.OrderDetails.purchaseOrderItems != null) {
                var id = 1;
                angular.forEach($scope.OrderDetails.purchaseOrderItems, function (item) {
                    id++;
                    $scope.OrderFromvendor_ItemList.push({ id: item.id,sku: item.sku, description: item.description, quantity: item.availabeQuantity, unitprice: item.unitPrice, tax: item.saleTax,totalcost:item.amount,status: item.status, SINo: item.si });
                });
            }
            $scope.CertificationListEdit = [];
            $scope.InvoiceListEdit = [];
            $scope.MemoListEdit = [];

            angular.forEach($scope.OrderDetails.purchaseOrderDocuments, function (attachemnt) {
                if (attachemnt.filePurpose == "PURCHASE_ORDER_CERTIFICATION") {
                    $scope.CertificationListEdit.push(attachemnt)
                }
                else if (attachemnt.filePurpose == "PURCHASE_ORDER_INVOICE") {
                    $scope.InvoiceListEdit.push(attachemnt)
                }
                else if (attachemnt.filePurpose == "PURCHASE_ORDER_MEMO") {
                    $scope.MemoListEdit.push(attachemnt)
                }
            });
            SelectedSupplierDetails();                   
            $scope.GetReturnPurchaseItems();
        }
        if ($scope.OrderDetails.orderType.name == "Gemlab Request") {
            $scope.OrderFromvendor_ItemList = (angular.isDefined($scope.OrderDetails.purchaseOrderItems) && $scope.OrderDetails.purchaseOrderItems != null) ? $scope.OrderDetails.purchaseOrderItems : [];

            $scope.stoneDetails = [];
            var id = 1;
            angular.forEach($scope.OrderDetails.purchaseOrderItems, function (item) {
                $scope.commonObj.ItemDescription = item.itemDescription;
                id++;
                $scope.stoneDetails.push({
                    id: item.stoneDetails.id,
                    SINo: id,
                    stoneType: {
                        id: item.stoneDetails.stoneType.id,
                        name: typename
                    },
                    quantity: item.stoneDetails.quantity,
                    price: item.stoneDetails.price,
                    stoneShape: {
                        id: item.stoneDetails.stoneShape.id,
                        name: stoneShapename
                    },
                    stoneColor: {
                        id: item.stoneDetails.stoneColor.id,
                        name: colorname
                    },
                    stoneClarity: {
                        id: item.stoneDetails.stoneClarity.id,
                        name: clarityname
                    },
                    mmCtw: item.stoneDetails.mmCtw
                });
            });
            SelectedSupplierDetails();
            CalculateTotalOrderFromvendor();
        }
        $scope.OrderDetails.orderDate = $scope.OrderDetails.createDate;
        $scope.PurchaseOrderAddEdit = true;
        $scope.IsEditOrder = true;
        $(".page-spinner-bar").addClass("hide");
    }, function (error) {
        $scope.PurchaseOrderAddEdit = false;
        $scope.IsEditOrder = false;
        toastr.remove()
        toastr.error((error.data) ? error.data.errorMessage : "Failed to get the order details.", "Error");
        $(".page-spinner-bar").addClass("hide");
    });
    }

    $scope.GetPackingSlipList = GetPackingSlipList;
    function GetPackingSlipList() {
        angular.forEach($scope.PackingSlipList, function (slip) {
            slip.IsChecked = true;
        });

        var GetPolicyHolderDetails = PurchaseOrderService.GetPackingSlipList();
        GetPolicyHolderDetails.then(function (success) {
            $scope.PackingSlipList = success.data.data;
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

    $scope.SelectedSupplierDetails = SelectedSupplierDetails;
    function SelectedSupplierDetails() {
        var SupplierId = $scope.OrderDetails.supplier.vendorId;
        $scope.suppleirDetails = [];
        angular.forEach($scope.VendorListDDL, function (item) {
            if (item.id == $scope.OrderDetails.supplier.vendorId) {
                $scope.suppleirDetails = item;
            }
        });
    };
    $scope.GetReturnPurchaseItems = GetReturnPurchaseItems;
    function GetReturnPurchaseItems() {
        var param = {
            "purchaseOrder": {
                "id": $scope.OrderDetails.id
            }
        }
        var getReturnItems = PurchaseOrderService.getReturnItems(param);
        getReturnItems.then(function (success) {
            $scope.ReturnPurchaseOrder = success.data.data;
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            $(".page-spinner-bar").addClass("hide");
        })
    };

    $scope.CalculateTotalPickUpFromVendor = CalculateTotalPickUpFromVendor;
    function CalculateTotalPickUpFromVendor() {
        var totalCost = 0.00;
        if (angular.isDefined($scope.selectedPickUpFromVendor)) {
            $scope.selectedPickUpFromVendor.amount = (parseFloat(angular.isDefined($scope.selectedPickUpFromVendor.unitPrice) && $scope.selectedPickUpFromVendor.unitPrice != "" ? $scope.selectedPickUpFromVendor.unitPrice : 0)) * (parseInt(angular.isDefined($scope.selectedPickUpFromVendor.quantity) && $scope.selectedPickUpFromVendor.quantity != "" ? $scope.selectedPickUpFromVendor.quantity : 0));


        }
        angular.forEach($scope.OrderPickUpFromVendor_ItemList, function (item) {

            item.amount = (parseFloat(angular.isDefined(item.unitPrice) && item.unitPrice != "" ? item.unitPrice : 0)) * (parseInt(angular.isDefined(item.quantity) && item.quantity != "" ? item.quantity : 0));
            totalCost += item.amount;
        });
    };
    $scope.CalculateTotalShipment = CalculateTotalShipment;
    function CalculateTotalShipment() {

        if (angular.isDefined($scope.selectedShipment)) {
            $scope.selectedShipment.amount = parseFloat($scope.selectedShipment.unitPrice) * parseInt($scope.selectedShipment.quantity);
            var taxAmount = parseFloat(angular.isUndefined($scope.selectedShipment.saleTax) ? 0 : $scope.selectedShipment.saleTax == null ? 0 : $scope.selectedShipment.saleTax / 100) * $scope.selectedShipment.amount;
            $scope.selectedShipment.amount += taxAmount;
        }

        angular.forEach($scope.OrderFromvendor_ItemList, function (item) {
            if (parseFloat(item.quantity) > 0 && parseFloat(item.unitPrice) > 0 && parseFloat(item.saleTax) > 0) {
                item.totalcost = 0.00;

                item.amount = item.totalcost + ((parseFloat(item.unitPrice) * parseInt(item.quantity)));
                var taxAmount = parseFloat(angular.isUndefined(item.saleTax) ? 0 : item.saleTax == null ? 0 : item.saleTax / 100) * item.amount;
                item.totalcost = item.totalcost + taxAmount;
            }

        });
    };

    $scope.EditReturnItemOrder = EditReturnItemOrder;
    function EditReturnItemOrder(item) {
        $scope.EditReturnDetails = item;
        //$scope.EditItemReturn = false;
        $scope.PreviousPOType = $scope.OrderDetails.orderType.name;
        $scope.OrderDetails.orderType.name = 'Item Return';
        GetTotalCost();
    };
    function GetTotalCost() {
       
        $scope.ReturnItem.TotalPoCost = 0;
        $scope.ReturnItem.CreaditDue = 0;
        $scope.ReturnItem.TotalQunatity = 0;
        $scope.ReturnItem.TotalCost = 0;
        angular.forEach($scope.EditReturnDetails.purchaseOrderReturnItems, function (item) {
            $scope.ReturnItem.TotalQunatity += parseInt(item.totalReturnQuantity);
            var totalcost = item.unitPrice * item.totalReturnQuantity;
            $scope.ReturnItem.TotalCost += totalcost;
        });
        var val = parseInt($scope.EditReturnDetails.restockingFee) / 100 * $scope.ReturnItem.TotalCost;
        // $scope.ReturnOrder.RestockingFee = val;
        $scope.ReturnItem.CreaditDue = $scope.ReturnItem.TotalCost - val;
        $scope.ReturnItem.TotalPoCost = $scope.ReturnItem.TotalCost + parseFloat($scope.EditReturnDetails.shippingCost);

    };

    $scope.GoToPackingSlip = GoToPackingSlip;
    function GoToPackingSlip() {
        $scope.PurchaseOrderAddEdit = false;
        $scope.PackingSlip = true;
        $(".page-spinner-bar").removeClass("hide");
        var getVendorCompanyDetails = PurchaseOrderService.GetVendorDetails();
        getVendorCompanyDetails.then(function (success) {
            $scope.VendorCompanyDetails = success.data.data;
            $(".page-spinner-bar").addClass("hide");
        },
        function (error) {
            toastr.remove();
            if (angualr.isDefined(error.data.errorMessage) && error.data.errorMessage !== null) {
                toastr.error(error.data.errorMessage, "Error");
            }
            else {
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error");
            }

        });
        var count = 0;
        if (angular.isUndefined($scope.OrderDetails.id) && $scope.OrderDetails.id == null) {

            if (angular.isDefined($scope.OrderDetails.purchaseOrderItems)) {
                angular.forEach($scope.OrderPackingSlip_ItemList, function (orderList) {
                    if (orderList.description == $scope.CommonObj.ItemDescription) {
                        count++;
                    }
                })
                if (count == 0) {
                    $scope.OrderPackingSlip_ItemList.push({ id: $scope.CommonObj.ItemDescription, description: $scope.CommonObj.ItemDescription, quantity: $scope.OrderDetails.purchaseOrderItems[0].availabeQuantity });
                }

            }
        }
    };
  
    $scope.GoToPackingSlipFromShipment = GoToPackingSlipFromShipment;
    function GoToPackingSlipFromShipment() {
        $scope.PackingSlip = true;
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
    };

    $scope.HidePackingSlipDiv = HidePackingSlipDiv;
    function HidePackingSlipDiv() {
        $scope.PackingSlip = false;
    };

    $scope.GoToBIB_of_Gemlab_PO = GoToBIB_of_Gemlab_PO;
    function GoToBIB_of_Gemlab_PO() {
        $scope.BIB_Param = angular.copy($scope.OrderDetails);
        $scope.temp_BIB_Of_GemlabRequest = angular.copy($scope.OrigionalGemlabObject)
        $scope.BIB_with_Gemlab = true;
        if (angular.isDefined($scope.temp_BIB_Of_GemlabRequest) && angular.isDefined($scope.temp_BIB_Of_GemlabRequest.assignmentNumber)) {
            //$scope.temp_BIB_Of_GemlabRequest.orderType = {};
            $scope.temp_BIB_Of_GemlabRequest.orderType.name = 'Gemlab Request';
            $scope.GemLabItemList = [];
            var tempNumber = 1;
            angular.forEach($scope.temp_BIB_Of_GemlabRequest.itemDetails, function (item) {
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
                        price: stones.price,
                        stoneClarity: stones.stoneClarity,
                        stoneColor: stones.stoneColor,
                        stoneShape: stones.stoneShape,
                        stoneType: stones.stoneType,
                    });
                    SINo++;
                })
                $scope.GemLabItemList.push({
                    number: tempNumber,
                    itemDescription: item.itemDescription,
                    claimReason: item.claimReason,
                    csrVerifiedCurrentWeight: item.csrVerifiedCurrentWeight,
                    damaged: item.damaged,
                    gemLabItemType: item.gemLabItemType,
                    id: item.id,
                    itemDescription: item.itemDescription,
                    labCertificate: item.labCertificate,
                    metalColor: item.metalColor,
                    metalType: item.metalType,
                    quantity: item.quantity,
                    weight: item.weight,
                    purchaseOrderServiceRequest: item.purchaseOrderServiceRequest,
                    stoneDetails: $scope.tempStoneDetails,
                    labFee: angular.isUndefined(item.labFee) || item.labFee == null ? null : item.labFee
                });
                tempNumber++;
            })
            $scope.temp_BIB_Of_GemlabRequest.itemDetails = $scope.GemLabItemList;
            $scope.OrderDetails = $scope.temp_BIB_Of_GemlabRequest;
            $scope.OrderDetails.claim = $scope.BIB_Param.claim;
            $scope.OrderDetails.lineItem = $scope.BIB_Param.lineItem
            $scope.OrderDetails.csr = $scope.BIB_Param.csr
            $scope.OrderDetails.phName = $scope.BIB_Param.phName
            $scope.OrderDetails.orderDate = $scope.BIB_Param.orderDate
            $scope.GemlabTab = 1;
        }
        else {
            $scope.OrderDetails = {
                "orderType": {
                    "name": 'Gemlab Request'
                },
                "lineItem": {
                    "itemId": $scope.CommonObj.PurchaseItemId,
                    "itemNumber": $scope.CommonObj.PurchaseItemNumber
                },
                "claim": {
                    "claimId": $scope.CommonObj.PurchaseClaimId,
                    "claimNumber": $scope.CommonObj.ClaimNumber
                },
                "phName": (angular.isDefined($scope.PolicyHolderDetails.policyHolder) && $scope.PolicyHolderDetails.policyHolder !== null) ? ($scope.PolicyHolderDetails.policyHolder.lastName + ", " + $scope.PolicyHolderDetails.policyHolder.firstName) : null,
                "orderDate": $filter('TodaysDate')(),
                "csr": sessionStorage.getItem("Name"),
            };
            $scope.GemLabItemList = [{
                id: null,
                number: 1,
                stoneDetails: [],
                itemDescription: angular.isUndefined($scope.CommonObj.itemDescription) ? null : $scope.CommonObj.itemDescription,
                purchaseOrderServiceRequest: {
                    "isItemInspection": false,
                    "isSarinRequest": false,
                    "isPreSalvageEstimationOnly": false,
                    "isAppraisalInformation": false,
                    "isPhotoRequest": false,
                }
            }];
        }
        $(".page-spinner-bar").removeClass("hide");
        $scope.GetGemLabData();
        $scope.OrderDetails.isLab = true;
    }

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

    $scope.CancelItemReturn = CancelItemReturn;
    function CancelItemReturn() {
        $scope.OrderDetails.orderType.name=$scope.PreviousPOType;
    };
    $scope.HidePurchseOrderDiv = function () {
        if ($scope.BIB_with_Gemlab) {
            if (angular.isDefined($scope.temp_BIB_Of_GemlabRequest.itemDetails) && $scope.temp_BIB_Of_GemlabRequest.itemDetails != null) {
                var a = $scope.temp_BIB_Of_GemlabRequest.itemDetails.length;
                var b = $scope.OrigionalGemlabObject.itemDetails.length;
                ////if (angular.isDefined($scope.temp_BIB_Of_GemlabRequest) && $scope.temp_BIB_Of_GemlabRequest !== null) {
                ////    angular.forEach($scope.temp_BIB_Of_GemlabRequest.itemDetails, function (objtemp) {
                ////        if (objtemp.id == null || angular.isUndefined(objtemp.id)) {
                ////            $scope.OrigionalGemlabObject.itemDetails.push(objtemp)
                ////        }
                ////    });
                ////}
                $scope.temp_BIB_Of_GemlabRequest.itemDetails = $scope.OrigionalGemlabObject.itemDetails;
            }
            $scope.OrderDetails = $scope.BIB_Param;
            $scope.BIB_with_Gemlab = false;
            $scope.GemLabItemList = $scope.OrigionalGemlabObject;
            $scope.GemlabTab = 1;
        }
        else {

            $scope.PurchaseOrderAddEdit = false;
            $scope.IsEditOrder = false;
            $scope.ClearAllItemsList();
        }
    };
    
});