angular.module('MetronicApp').controller('PODetailsDepartmentsController', function ($rootScope, $scope, $location, $translate, $translatePartialLoader,
$filter, PurchaseOrderService,AuthHeaderService,$uibModal) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });

    //set language
    $translatePartialLoader.addPart('AssociateLineItemDetails');
    $translate.refresh();
    $scope.PolicyHolderDetails;
    $scope.NewItemLbourCharges = false;
    $scope.NewItemFormVendor = false;
    $scope.NewItemPickUpFormVendor = false;
    $scope.NewItemShipment = false;
    $scope.BIB_with_Gemlab = false;
    $scope.PaymentTerms = [];
    $scope.POStatusList = [];
    $scope.OrderDetails = {};
    $scope.CertificationList = [];
    $scope.InvoiceList = [];
    $scope.MemoList = [];
    $scope.attachemnt = [];
    $scope.currentItemId;
    GetPackingSlipList();
    $scope.PackingSlipList = [];
    $scope.ItemStatusList = [];
    $scope.statusList = [{ id: true, name: "Yes" }, { id: false, name: "No" }];
    //$scope.ItemStatusList = [{ Id: 1, Name: "Created" },
    //                     { Id: 2, Name: "Received" },
    //                     { Id: 3, Name: "Partial return" },
    //                     { Id: 4, Name: "Returned" }, ];
    $scope.OrigionalGemlabObject = [];

    $scope.IntialiseComponent = IntialiseComponent;
    function IntialiseComponent() {
        if ($scope.OrderDetails.orderType.name == 'Gemlab Request') {
            $(".page-spinner-bar").removeClass("hide");
            $scope.GetGemLabData();
        }
        //$scope.ClearAllItemsList();
        //SetInitialOrderDetails();
        //$rootScope.BIBFormPH.$setUntouched(); 
    };

    function init() {
      
        GetVendorSuppliersList();
        $(".page-spinner-bar").removeClass("hide");
        var paramId = {
            "id": sessionStorage.getItem("OrderId")
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
            GetPOStatusList();
            if ($scope.OrderDetails.orderType.name == "BIB from PH") {
                if ($scope.OrderDetails.status.status == "CREATED") {
                    $scope.IsCompleted = false;
                }
                else {
                    $scope.IsCompleted = true;
                }
                $scope.OrderDetails.phone = $filter('tel')($scope.OrderDetails.phone);
                $scope.currentItemId = $scope.OrderDetails.lineItem.itemId;
                $scope.OrderDetails.pickupTime = $filter('DateFormatTimeOne')($scope.OrderDetails.pickupTime);
                $scope.OrderPackingSlip_ItemList = [];
                angular.forEach($scope.PackingSlipList, function (item) {
                    angular.forEach($scope.OrderDetails.packingSlipDetails.attaches, function (orderitemslip) {
                        if (orderitemslip.id == item.id) {
                            item.IsChecked = true;
                            $scope.SelectedPackingSlips.push(item);
                        }
                    });
                });
                $scope.OrderPackingSlip_ItemList = [];
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
                if ($scope.OrderDetails.status.status == "CREATED") {
                    $scope.IsCompleted = false;
                }
                else {
                    $scope.IsCompleted = true;
                }
                
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
            }
            if ($scope.OrderDetails.orderType.name == "Pick up from Vendor/Email Label") {
                $(".page-spinner-bar").removeClass("hide");
                if ($scope.OrderDetails.status.status == "CREATED") {
                    $scope.IsCompleted = false;
                }
                else {
                    $scope.IsCompleted = true;
                }
                // SelectedSupplierDetails();
                $scope.suppleirDetails = $scope.OrderDetails.supplier;
                 
                $scope.GetReturnPurchaseItems();
                $scope.OrderDetails.pickupTime = $filter('DateFormatTimeOne')($scope.OrderDetails.pickupTime);
                $scope.OrderPickUpFromVendor_ItemList = [];
                var id = 1;
                angular.forEach($scope.OrderDetails.purchaseOrderItems, function (item) {
                    id++;
                    $scope.OrderPickUpFromVendor_ItemList.push({ id: item.id, SINo: id, sku: item.sku, description: item.description, quantity: item.availabeQuantity, unitPrice: item.unitPrice, amount: item.amount, status: angular.isUndefined(item.purchaseOrderStatus)?"CREATED": item.purchaseOrderStatus.status });
                })
                $scope.CalculateTotalPickUpFromVendor();
                $scope.OrderPackingSlip_ItemList = $scope.OrderDetails.purchaseOrderItems;
                if ($scope.OrderDetails.gemLabRequestPurchaseOrders != null) {
                    $scope.temp_BIB_Of_GemlabRequest = $scope.OrderDetails.gemLabRequestPurchaseOrders[0];
                    $scope.OrigionalGemlabObject = $scope.OrderDetails.gemLabRequestPurchaseOrders[0];
                }
            }
            if ($scope.OrderDetails.orderType.name == "Labor Charges") {
                if ($scope.OrderDetails.status.status == "CREATED") {
                    $scope.IsCompleted = false;
                }
                else {
                    $scope.IsCompleted = true;
                }
                $scope.OrderLbourCharges_ItemList = [];
                var id = 1;
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
                if ($scope.OrderDetails.status.status == "CREATED") {
                    $scope.IsCompleted = false;
                }
                else {
                    $scope.IsCompleted = true;
                }
                $scope.OrderFromvendor_ItemList = [];
                var id = 1;
                angular.forEach($scope.OrderDetails.purchaseOrderItems, function (item) {
                    id++;
                    $scope.OrderFromvendor_ItemList.push({ id: item.id, SINo: item.si, sku: item.sku, description: item.description, quantity: item.availabeQuantity, unitprice: item.unitPrice, totalcost: item.amount, tax: item.saleTax, status: angular.isUndefined(item.purchaseOrderStatus) ? "CREATED" : item.purchaseOrderStatus.status });
                });

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
                $scope.suppleirDetails = $scope.OrderDetails.supplier;              
                $scope.GetReturnPurchaseItems();
            }
            if ($scope.OrderDetails.orderType.name == "Gemlab Request") {
                //$scope.OrderFromvendor_ItemList = (angular.isDefined($scope.OrderDetails.purchaseOrderItems) && $scope.OrderDetails.purchaseOrderItems != null) ? $scope.OrderDetails.purchaseOrderItems : [];
                if ($scope.OrderDetails.status.status == "CREATED") {
                    $scope.IsCompleted = false;
                }
                else {
                    $scope.IsCompleted = true;
                }
                $scope.stoneDetails = [];
                var id = 1;
                angular.forEach($scope.OrderDetails.purchaseOrderItems, function (item) {
                    id++;
                    $scope.stoneDetails.push({
                        SINo: id,
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
                });
                SelectedSupplierDetails();
                CalculateTotalOrderFromvendor();
            }
            $scope.OrderDetails.orderDate = (angular.isDefined($scope.OrderDetails.createDate) && $scope.OrderDetails.createDate != null) ? ($filter('DateFormatMMddyyyy')($scope.OrderDetails.createDate)) : (null);
            if (angular.isDefined($scope.OrderDetails.orderType) || $scope.OrderDetails.orderType != null) {
                angular.forEach($scope.OrderTypeList, function (item) {
                    if ($scope.OrderDetails.orderType.name == item.name) {
                        GetStatusList(item.id);
                    }
                })
            };
            $scope.PurchaseOrderAddEdit = true;
            $scope.IsEditOrder = true;
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            toastr.remove()
            toastr.error((error.data) ? error.data.errorMessage : "Failed to get the order details.", "Error");
            $(".page-spinner-bar").addClass("hide");
        });

        //Get state name
        $scope.OrderTypeList = [];
        var paramState = {
            "isTaxRate": false,
            "isTimeZone": false
        };
        var GetState = PurchaseOrderService.GetStates(paramState);
        GetState.then(function (success) {
            $scope.statelist = success.data.data;
        }, function (error) {
            $scope.statelist = [];
        });
    }
    init();

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
    //Get Purchase order types
    $scope.OrderTypeList = [];
    var TypeList = PurchaseOrderService.GetOrderTypes();
    TypeList.then(function (success) {
        $scope.OrderTypeList = success.data.data;
    }, function (error) {
        $scope.OrderTypeList = [];
    });

    //Get purchase method type
    $scope.OrderMethodList = [];
    var MethodList = PurchaseOrderService.GetPurchaseOrderMethod();
    MethodList.then(function (success) {
        $scope.OrderMethodList = success.data.data;
    }, function (error) {
        $scope.OrderMethodList = [];
    });


    $scope.GetPOStatusList = GetPOStatusList;
    function GetPOStatusList() {
        $(".page-spinner-bar").removeClass("hide");
        var param = {
            "id": $scope.OrderDetails.orderType.id
        };
        var getPOStatusList = PurchaseOrderService.getStatusList(param);
        getPOStatusList.then(function (success) {
            $scope.POStatusList = success.data.data;
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
             
            $(".page-spinner-bar").addClass("hide");
            toastr.remove();
            toastr.error((angular.isDefined(error.data) && angular.isDefined(error.data.errorMessage) ? error.data.errorMessage : AuthHeaderService.genericErrorMessage()), "Error");
        });
    };

    var getPaymentTerms = PurchaseOrderService.getPaymentTerms();
    getPaymentTerms.then(function (success) {
        $scope.PaymentTerms = success.data.data;
    }, function (error) {
        toastr.remove();
        if (error.data.errorMessage != null && angualr.isDefined(error.data.errorMessage))
            toastr.error(error.data.errorMessage, "Error");
        else
            toastr.error(AuthHeaderService.genericErrorMessage(), "Error");

    });
    //Order Form Vendor Items
    $scope.NewItemOrderFromvendor = false;
    $scope.OrderFromvendor_ItemList = [];
    $scope.selectedOrderFromvendor = {};

    $scope.getTemplateOrderFromvendor = function (item) {

        if (!angular.isUndefined(item)) {
            if (item.SINo === $scope.selectedOrderFromvendor.SINo)
                return 'edit1OrderFromvendor';
            else
                return 'display1OrderFromvendor';
        }
        else
            return 'display1OrderFromvendor';
    };

    $scope.addItem_OrderFromvendor = addItem_OrderFromvendor;
    function addItem_OrderFromvendor(operationFlag, operationType) {

        if (operationFlag == 1 && operationType == "Add") {
            $scope.OrderFromvendor_ItemList.push($scope.selectedOrderFromvendor);
            $scope.NewItemOrderFromvendor = false;
            CalculateTotalOrderFromvendor();
        }
        else if (operationType == "Edit") {
            $scope.OrderFromvendor_ItemList[operationFlag] = {
                id: (angular.isDefined($scope.selectedOrderFromvendor.id)) ? $scope.selectedOrderFromvendor.id : null,
                SINo: $scope.selectedOrderFromvendor.SINo, description: $scope.selectedOrderFromvendor.description, sku: $scope.selectedOrderFromvendor.sku,
                quantity: $scope.selectedOrderFromvendor.quantity, unitprice: $scope.selectedOrderFromvendor.unitprice,
                tax: $scope.selectedOrderFromvendor.tax, totalcost: $scope.selectedOrderFromvendor.totalcost,
                status: $scope.selectedOrderFromvendor.status,
            };
            CalculateTotalOrderFromvendor();
        }
            //else if (operationFlag != 0 && operationType == "Remove") {
        else if (operationType == "Remove") {
            $scope.OrderFromvendor_ItemList.splice(operationFlag, 1);
            CalculateTotalOrderFromvendor();
        }
        else if (operationType == "Cancel") {
            $scope.NewItemOrderFromvendor = false;
            $scope.selectedOrderFromvendor = {};
        }
        $scope.selectedOrderFromvendor = {};
    }

    $scope.AddNewOrderFromvendorItem = AddNewOrderFromvendorItem;
    function AddNewOrderFromvendorItem() {
        $scope.selectedOrderFromvendor = {};
        $scope.NewItemOrderFromvendor = true;
        $scope.EditPaymentTerm = false;
    }

    $scope.EditOrderFromvendorItem = EditOrderFromvendorItem;
    function EditOrderFromvendorItem(item) {
        $scope.selectedOrderFromvendor = angular.copy(item);
    }
    //view Packiging slip
    $scope.GetPackingSlipList = GetPackingSlipList;
    function GetPackingSlipList() {
        var GetPolicyHolderDetails = PurchaseOrderService.GetPackingSlipList();
        GetPolicyHolderDetails.then(function (success) {
            $scope.PackingSlipList = success.data.data;          
            angular.forEach($scope.PackingSlipList, function (slip) {
                slip.IsChecked = false;
            });
            $scope.SelectedPackingSlips = [];
            $scope.OrderPackingSlip_ItemList = [];

            if (angular.isDefined($scope.OrderDetails.packingSlipDetails) && $scope.OrderDetails.packingSlipDetails != null)
            {
                angular.forEach($scope.PackingSlipList, function (item) {
                    angular.forEach($scope.OrderDetails.packingSlipDetails.attaches, function (orderitemslip) {
                        if (orderitemslip.id == item.id) {
                            item.IsChecked = true;
                            $scope.SelectedPackingSlips.push(item);
                        }
                    });
                });
            }
            
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


    $scope.GoToPackingSlipFromShipment = GoToPackingSlipFromShipment;
    function GoToPackingSlipFromShipment() {
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
        if (angular.isDefined($scope.OrderShipment_ItemList)) {
            angular.forEach($scope.OrderShipment_ItemList, function (item) {
                IDVar++
                $scope.OrderPackingSlip_ItemList.push({ id: IDVar, description: item.description, quantity: item.quantity });

            });

        }

        angular.forEach($scope.SelectedPackingSlips, function (slip) {
            IDVar++;
            $scope.OrderPackingSlip_ItemList.push({ id: IDVar, description: slip.attachName, quantity: slip.quantity });
        });

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

        }, function (error) {
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

    $scope.HidePackingSlipDiv = HidePackingSlipDiv;
    function HidePackingSlipDiv() {
        $scope.PurchaseOrderAddEdit = true;
        $scope.PackingSlip = false;
    };
    $scope.PreviousPOType;
    $scope.ReturnItem = ReturnItem;
    function ReturnItem() {
        $scope.EditItemReturn = false;
        $scope.PreviousPOType = $scope.OrderDetails.orderType.name;
        $scope.OrderDetails.orderType.name = "Item Return";

    };

    $scope.ClearPackingSlipItems = ClearPackingSlipItems;
    function ClearPackingSlipItems() {
        $scope.SelectedPackingSlips = [];
        $scope.OrderShipment_ItemList = [];
        angular.forEach($scope.PackingSlipList, function (slip) {
            slip.IsChecked = false;
        });
    };
    $scope.SelectedPackingSlips = []
    $scope.AddToList = AddToList;
    function AddToList(item) {
        if (item.IsChecked == true) {
            $scope.SelectedPackingSlips.push(item);

            var count = 0;
            angular.forEach($scope.OrderPackingSlip_ItemList, function (Orderitem) {
                if (item.attachName == Orderitem.description) {
                    count++
                }
            });

            if (count == 0) {
                $scope.OrderPackingSlip_ItemList.push({ id: item.attachName, description: item.attachName, quantity: item.quantity });
            }
        }
        else if (item.IsChecked == false) {
            angular.forEach($scope.SelectedPackingSlips, function (slip, key) {
                if (slip.id == item.id) {
                    RemoveItem(key);
                }
            });

            angular.forEach($scope.OrderPackingSlip_ItemList, function (Orderitem, key) {
                if (item.attachName == Orderitem.description) {
                    $scope.OrderPackingSlip_ItemList.splice(key, 1);
                }
            });
        }


        var count = $scope.SelectedPackingSlips;
    };

    function RemoveItem(key) {
        $scope.SelectedPackingSlips.splice(key, 1);
    }

    function returnDateForEvent(dt, time) {
        if (dt != null && time != null) {
            var data = new Date(dt);
            data.setHours(parseInt(time.split(':')[0]), parseInt(time.split(':')[1]));
            data = data.toISOString().split('.')[0];
            data = data + 'Z';
            var dateForEvent = data.split('T')[0];
            var Setyear = dateForEvent.split('-')[0];
            var SetMonth = dateForEvent.split('-')[1];
            var SetDate = dateForEvent.split('-')[2];
            return SetMonth + '-' + SetDate + '-' + Setyear + 'T' + data.split('T')[1];
        }
        else
            return null;
    }
    $scope.savePurchaseOrder = savePurchaseOrder;
    function savePurchaseOrder($event) {

        if ($scope.OrderDetails.orderType.name == "Order from Vendor") {
            if ($scope.OrderFromvendor_ItemList.length == 0 || $scope.OrderFromvendor_ItemList == null) {
                toastr.remove();
                toastr.error("0 items availabe for this purchase order", "Error");
                $event.stopPropagation();
                $event.preventDefault();
                return;
            }

        }
        else if ($scope.OrderDetails.orderType.name == "Pick up from Vendor/Email Label") {
            if ($scope.OrderPickUpFromVendor_ItemList.length == 0 || $scope.OrderPickUpFromVendor_ItemList == null) {
                toastr.remove();
                toastr.error("0 items availabe for this purchase order", "Error");
                $event.stopPropagation();
                $event.preventDefault();
                return;
            }
        }

        else if ($scope.OrderDetails.orderType.name == "Labor Charges") {
            if ($scope.OrderLbourCharges_ItemList.length == 0 || $scope.OrderLbourCharges_ItemList == null) {
                toastr.remove();
                toastr.error("0 items availabe for this purchase order", "Error");
                $event.stopPropagation();
                $event.preventDefault();
                return;
            }
            else if ($scope.LaborCostWorkDetails.length == 0 || $scope.LaborCostWorkDetails == null) {
                toastr.remove();
                toastr.error("Labor cost not added", "Error");
                $event.stopPropagation();
                $event.preventDefault();
                return;
            }
        }       
        var totalAmountLaborType = 0.0;
        var totalAmountLaborType = 0.0;
        $scope.CalculateTotalOrderLabor();
        var totalAmountFromVendor = 0.0;
        if (angular.isDefined($scope.OrderFromvendor_ItemList) && $scope.OrderFromvendor_ItemList !== null) {
            angular.forEach($scope.OrderFromvendor_ItemList, function (item) {
                totalAmountFromVendor = totalAmountFromVendor + (parseFloat(item.amount) * (item.quantity));
            });
        }
        var param = new FormData();       
        if ($scope.OrderDetails.orderType.name == "BIB from PH") {

            $scope.List = [];
            var index = 0;
            if (angular.isDefined($scope.temp_BIB_Of_GemlabRequest)) {
                angular.forEach($scope.GemLabItemList, function (Item) {
                    //Hide this code because shipping admin have not permission to update gemlab details
                    //angular.forEach(Item.AttachmentList, function (attachment) {
                    //    $scope.List.push({
                    //        "fileName": attachment.FileName,
                    //        "fileType": attachment.FileType,
                    //        "extension": attachment.FileExtension,
                    //        "filePurpose": "GEMLAB_PURCHASE_ORDER",
                    //        "latitude": null,
                    //        "longitude": null,
                    //        "index": index,
                    //    })
                    //    param.append('file', attachment.File);
                    //})
                    //index = index + 1;
                });
                if ($scope.List.length == 0) {
                    param.append('file', null);
                    param.append('filesDetails', null);
                }
                else {
                    param.append('filesDetails', JSON.stringify($scope.List));
                }
            }

            var attaches = [];
            var ItemList = [];
            angular.forEach($scope.SelectedPackingSlips, function (attchment) {
                attaches.push({ id: attchment.id });
            });
            var item_Stone_Details = [];
            var temp_Item = [];
            var i = 0;
            if (angular.isDefined($scope.temp_BIB_Of_GemlabRequest)) {
                angular.forEach($scope.temp_BIB_Of_GemlabRequest.itemDetails, function (item) {
                    angular.forEach(item.stoneDetails, function (itemStoneDetails) {
                        item_Stone_Details.push({
                            "id": (angular.isDefined(itemStoneDetails.id)) ? itemStoneDetails.id : null,
                            //SINo: itemStoneDetails.SINo,
                            "stoneType": {
                                "id": itemStoneDetails.stoneType.id,
                                "name": itemStoneDetails.stoneType.name
                            },
                            "quantity": itemStoneDetails.quantity,
                            "price": itemStoneDetails.price,
                            "stoneShape": {
                                "id": itemStoneDetails.stoneShape.id,
                                "name": itemStoneDetails.stoneShape.name
                            },
                            "stoneColor": {
                                "id": itemStoneDetails.stoneColor.id,
                                "name": itemStoneDetails.stoneColor.name
                            },
                            "stoneClarity": {
                                "id": itemStoneDetails.stoneClarity.id,
                                "name": itemStoneDetails.stoneClarity.name
                            },
                            "mmCtw": itemStoneDetails.mmCtw
                        });
                    });
                    delete item.AttachmentList;
                    delete item.AttachmentEditList;
                    delete item.number
                    temp_Item[i] = JSON.parse(angular.toJson(item));
                    temp_Item[i].stoneDetails = JSON.parse(angular.toJson(item_Stone_Details));// to remove $$hashkey
                    item_Stone_Details = [];
                    ////delete item.$$hashkey;
                    ////delete item.stoneDetails.$$hashkey
                    i++;
                });
                $scope.temp_BIB_Of_GemlabRequest.itemDetails = temp_Item;
            }

            var GemLabOrder = [];
            var GemlabParam;
            if (angular.isDefined($scope.temp_BIB_Of_GemlabRequest) && $scope.temp_BIB_Of_GemlabRequest != null && $scope.OrderDetails.isLab == true) {
                //GemLabOrder.push($scope.temp_BIB_Of_GemlabRequest);
                GemlabParam = {
                    "id":  angular.isUndefined($scope.temp_BIB_Of_GemlabRequest.id)?null:$scope.temp_BIB_Of_GemlabRequest.id,
                    "assignmentNumber": $scope.temp_BIB_Of_GemlabRequest.assignmentNumber,
                    "claimNumber": $scope.temp_BIB_Of_GemlabRequest.claimNumber,
                    "description": "",//(angular.isUndefined($scope.OrderDetails.description) ? null : $scope.OrderDetails.description),
                    "lineItem": {
                        "id": (angular.isDefined($scope.temp_BIB_Of_GemlabRequest.lineItem.id) ? $scope.temp_BIB_Of_GemlabRequest.lineItem.id : null)
                    },
                    "associate": {
                        "id": (angular.isDefined($scope.temp_BIB_Of_GemlabRequest.associate) && $scope.temp_BIB_Of_GemlabRequest.associate != null ? $scope.temp_BIB_Of_GemlabRequest.associate.id : null)
                    },
                    "orderType": {
                        "id": $scope.temp_BIB_Of_GemlabRequest.orderType.id
                    },
                    "purchaseOrderStatus": {
                        "id": (angular.isDefined($scope.temp_BIB_Of_GemlabRequest.purchaseOrderStatus) && $scope.temp_BIB_Of_GemlabRequest.purchaseOrderStatus != null) ? $scope.temp_BIB_Of_GemlabRequest.purchaseOrderStatus.id : 1
                    },
                    "itemDetails": JSON.parse(angular.toJson($scope.temp_BIB_Of_GemlabRequest.itemDetails))
                };
                GemLabOrder.push(GemlabParam);

            }
            else {
                GemLabOrder = null;
            }
            angular.forEach($scope.OrderPackingSlip_ItemList, function (item) {
                ItemList.push({ "quantity": item.quantity, "description": item.description });
            });
            param.append("purchaseOrder", JSON.stringify(
                {
                    "id": (angular.isDefined($scope.OrderDetails.id)) ? $scope.OrderDetails.id : null,
                    "orderType": {
                        "name": (angular.isDefined($scope.OrderDetails.orderType.name) ? $scope.OrderDetails.orderType.name : null)
                    },
                    "csr": (angular.isDefined($scope.OrderDetails.csr) ? $scope.OrderDetails.csr : sessionStorage.getItem("Name")),
                    "lineItem": {
                        "itemId": (angular.isDefined($scope.currentItemId) ? $scope.currentItemId : null)
                    },
                    "claim": {
                        "claimId": (angular.isDefined($scope.OrderDetails.claim.claimId) ? $scope.OrderDetails.claim.claimId : null)
                    },
                    "vendorAssignment": {
                        "id": (angular.isDefined($scope.OrderDetails.vendorAssignment) ? $scope.OrderDetails.vendorAssignment.id : null)
                    },
                    "phName": $scope.OrderDetails.phName,
                    "address": {
                        "city": $scope.OrderDetails.address.city,
                        "streetAddressOne": $scope.OrderDetails.address.streetAddressOne,
                        "streetAddressTwo": $scope.OrderDetails.address.streetAddressTwo,
                        "zipcode": $scope.OrderDetails.address.zipcode,
                        "state": {
                            "id": $scope.OrderDetails.address.state.id
                        }
                    },
                    "phone":(angular.isDefined($scope.OrderDetails.phone) ? $scope.OrderDetails.phone.replace(/[()-]/g, '').replace(/ /g, '') : null),
                    "email": (angular.isDefined($scope.OrderDetails.email) ? $scope.OrderDetails.email : null),
                    "tracking":(angular.isDefined($scope.OrderDetails.tracking) ? $scope.OrderDetails.tracking : null),
                    "returnTracking": (angular.isDefined($scope.OrderDetails.returnTracking) ? $scope.OrderDetails.returnTracking : null),
                    "specialInstruction": (angular.isDefined($scope.OrderDetails.specialInstruction) ? $scope.OrderDetails.specialInstruction : null),
                    "method": {
                        "id": (angular.isDefined($scope.OrderDetails.method)) ? $scope.OrderDetails.method.id : null
                    },
                    "returnMethod": ((angular.isDefined($scope.OrderDetails.returnMethod) && $scope.OrderDetails.returnMethod != null) ?
                { "id": $scope.OrderDetails.returnMethod.id } : null),
                    "pickup": (angular.isDefined($scope.OrderDetails.pickup) ? $scope.OrderDetails.pickup : null),
                    "eta": $filter('DatabaseDateFormatMMddyyyy')($scope.OrderDetails.eta),
                    "pickupDate": $filter('DatabaseDateFormatMMddyyyy')($scope.OrderDetails.pickupDate),
                    "pickupTime": (angular.isDefined($scope.OrderDetails.pickupTime) && ($scope.OrderDetails.pickupTime != null) && ($scope.OrderDetails.pickupTime != "") ? returnDateForEvent(angular.copy($scope.OrderDetails.pickupDate), $scope.OrderDetails.pickupTime) : null),
                    "receivedDate": $filter('DatabaseDateFormatMMddyyyy')($scope.OrderDetails.receivedDate),
                    "shippingCost": $scope.OrderDetails.shippingCost,
                    "submitDate": $filter('DatabaseDateFormatMMddyyyy')((angular.isDefined($scope.OrderDetails.submitDate) && $scope.OrderDetails.submitDate !== null) ? $scope.OrderDetails.submitDate : ($filter('TodaysDate')())),
                    "packingSlip": true,
                    "isLab": angular.isDefined($scope.OrderDetails.isLab) ? $scope.OrderDetails.isLab : false,
                    "purchaseOrderItems": [{
                        "id": $scope.OrderDetails.purchaseOrderItems[0].id, // id for udpate
                        "quantity": $scope.OrderDetails.purchaseOrderItems[0].availabeQuantity,
                        "description": $scope.OrderDetails.purchaseOrderItems[0].description
                    }],
                    "status": {                     
                        "id":((angular.isDefined($scope.OrderDetails.status) && $scope.OrderDetails.status != null) ? $scope.OrderDetails.status.id : 18)
                    },
                    "orderTotalCost": $scope.OrderDetails.shippingCost, //(angular.isDefined($scope.OrderDetails.orderTotalCost) && $scope.OrderDetails.orderTotalCost != null) ? $scope.OrderDetails.orderTotalCost : $scope.OrderDetails.shippingCost,
                    "packingSlipDetails": {
                        "id": (angular.isDefined($scope.OrderDetails.packingSlipDetails)) ? $scope.OrderDetails.packingSlipDetails.id : null,  // mandatory id for update
                        "policyHolder":$scope.OrderDetails.packingSlipDetails.policyHolder,                          
                        "purchaseOrderMethod": {
                            "id": (angular.isDefined($scope.OrderDetails.method)) ? $scope.OrderDetails.method.id : null
                        },
                        "specialInstructions": angular.isDefined($scope.OrderDetails.packingSlipDetails.specialInstructions) ? $scope.OrderDetails.packingSlipDetails.specialInstructions : null,
                        "attaches": (attaches.length > 0 ? attaches : null),
                        "items": (ItemList.length > 0 ? ItemList : null)
                    },
                    "gemLabRequestPurchaseOrders":GemLabOrder
                }));
            //param.append('filesDetails', null);
            //param.append('file', null);
        }
        else if ($scope.OrderDetails.orderType.name == "Labor Charges") {
            $scope.OrderDetails.laborCodeDetails = $scope.LaborCostWorkDetails;
            if ((angular.isDefined($scope.OrderDetails.laborCodeDetails)) && $scope.OrderDetails.laborCodeDetails !== null) {
                totalAmountLaborType = totalAmountLaborType + (($scope.OrderDetails.laborCodeDetails.length > 0) ? $scope.OrderDetails.laborCodeDetails[0].price : 0.0);
            }
            var OrderLbourChargesItemList = [];
            angular.forEach($scope.OrderLbourCharges_ItemList, function (item) {
                OrderLbourChargesItemList.push({
                    "id": (angular.isDefined(item.id)) ? item.id : null,
                    "description": item.description,
                    "amount": item.totalcost,
                    "quantity": item.quantity,
                    "sku": item.sku
                });
            });
            param.append("purchaseOrder",
            JSON.stringify({
                "id": (angular.isDefined($scope.OrderDetails.id)) ? $scope.OrderDetails.id : null,
                "orderType": {
                    "name": $scope.OrderDetails.orderType.name
                },
                "description": $scope.OrderDetails.description,
                "date": $filter('DatabaseDateFormatMMddyyyy')((angular.isDefined($scope.OrderDetails.date) && $scope.OrderDetails.date !== null) ? $scope.OrderDetails.date : ($filter('TodaysDate')())),
                "lineItem": {
                    "itemId": (angular.isDefined($scope.OrderDetails.lineItem.itemId) ? $scope.OrderDetails.lineItem.itemId : null)
                },
                "claim": {
                    "claimId": (angular.isDefined($scope.OrderDetails.claim.claimId) ? $scope.OrderDetails.claim.claimId : null)
                },
                "specialInstruction": $scope.OrderDetails.specialInstruction,
                "vendorAssignment": {
                    "id": (angular.isDefined($scope.OrderDetails.vendorAssignment) ? $scope.OrderDetails.vendorAssignment.id : null)
                },
                "csr": (angular.isDefined($scope.OrderDetails.csr) ? $scope.OrderDetails.csr : sessionStorage.getItem("Name")),
                "phName": $scope.OrderDetails.phName,
                "supplier": {
                    "vendorId": $scope.OrderDetails.supplier.vendorId
                },
                "purchaseOrderItems": $scope.OrderLbourChargesItemList,
                "status": {
                    "id": (angular.isDefined($scope.OrderDetails.status) && $scope.OrderDetails.status != null) ? $scope.OrderDetails.status.id : 1
                },
                "orderTotalCost": (angular.isDefined($scope.OrderDetails.orderTotalCost) && $scope.OrderDetails.orderTotalCost !== null) ? $scope.OrderDetails.orderTotalCost : totalAmountLaborType,
                "laborCodeDetails": {
                    "id": ((angular.isDefined($scope.OrderDetails.laborCodeDetails) && $scope.OrderDetails.laborCodeDetails.length > 0) ? $scope.OrderDetails.laborCodeDetails[0].id : null)
                }
            }
          ));
            param.append('filesDetails', null);
            param.append('file', null);
        }
        else if ($scope.OrderDetails.orderType.name == "Order from Vendor") {
            var OrderFormItemList = [];
            $scope.OrderDetails.orderTotalCost = 0.00;
            angular.forEach($scope.OrderFromvendor_ItemList, function (item) {
                OrderFormItemList.push({
                    "id": (angular.isDefined(item.id)) ? item.id : null,
                    "description": item.description,
                    "amount": item.totalcost,
                    "quantity": item.quantity,
                    "sku": item.sku,
                    "saleTax": item.tax,
                    "unitPrice": item.unitprice,
                    "si": item.SINo,
                    "toDelete": item.toDelete,
                    "purchaseOrderStatus": { "id": getItemStatus(item.status) }
                });
                $scope.OrderDetails.orderTotalCost += item.totalcost;
            });
            param.append("purchaseOrder",JSON.stringify({
             "id": (angular.isDefined($scope.OrderDetails.id)) ? $scope.OrderDetails.id : null,
             "orderType": {
                 "name": $scope.OrderDetails.orderType.name
             },
             "dateOrdered": $filter('DatabaseDateFormatMMddyyyy')((angular.isDefined($scope.OrderDetails.dateOrdered) && $scope.OrderDetails.dateOrdered !== null) ? $scope.OrderDetails.dateOrdered : ($filter('TodaysDate')())),
             "paymentTerm": {
                 "id": (angular.isDefined($scope.OrderDetails.paymentTerm) && ($scope.OrderDetails.paymentTerm != null) ? $scope.OrderDetails.paymentTerm.id : null),
             },
             "lineItem": {
                 "itemId": (angular.isDefined($scope.OrderDetails.lineItem.itemId) ? $scope.OrderDetails.lineItem.itemId : null)
             },
             "claim": {
                 "claimId": (angular.isDefined($scope.OrderDetails.claim.claimId) ? $scope.OrderDetails.claim.claimId : null)
             },
             "vendorAssignment": {
                 "id": (angular.isDefined($scope.OrderDetails.vendorAssignment) ? $scope.OrderDetails.vendorAssignment.id : null)
             },
             "csr": (angular.isDefined($scope.OrderDetails.csr) ? $scope.OrderDetails.csr : sessionStorage.getItem("Name")),
             "phName": $scope.OrderDetails.phName,
             "supplier": {
                 "vendorId": $scope.OrderDetails.supplier.vendorId
             },
             "description": (angular.isDefined($scope.OrderDetails.description) && $scope.OrderDetails.description !== null) ? $scope.OrderDetails.description : null,
             "confirmation": (angular.isDefined($scope.OrderDetails.confirmation) && $scope.OrderDetails.confirmation !== null) ? $scope.OrderDetails.confirmation : null,
             "shippingCost": (angular.isDefined($scope.OrderDetails.shippingCost) && $scope.OrderDetails.shippingCost !== null) ? $scope.OrderDetails.shippingCost : null,
             "tracking": (angular.isDefined($scope.OrderDetails.tracking) && $scope.OrderDetails.tracking !== null) ? $scope.OrderDetails.tracking : null,
             "eta": $filter('DatabaseDateFormatMMddyyyy')($scope.OrderDetails.eta),
             "specialInstruction": $scope.OrderDetails.specialInstruction,
             "method": {
                 "id": (angular.isDefined($scope.OrderDetails.method)) ? $scope.OrderDetails.method.id : null
             },
             "memo": (angular.isDefined($scope.OrderDetails.memo) && $scope.OrderDetails.memo !== null) ? $scope.OrderDetails.memo : null,
             "invoiceNumber": (angular.isDefined($scope.OrderDetails.invoiceNumber) && $scope.OrderDetails.invoiceNumber !== null) ? $scope.OrderDetails.invoiceNumber : null,
             "receivedDate": (angular.isDefined($scope.OrderDetails.receivedDate) && $scope.OrderDetails.receivedDate !== null) ? $filter('DatabaseDateFormatMMddyyyy')($scope.OrderDetails.receivedDate) : null,
             "purchaseOrderItems": OrderFormItemList,
             "status": {
                 "id": (angular.isDefined($scope.OrderDetails.status) && $scope.OrderDetails.status != null) ? $scope.OrderDetails.status.id : 1
             },
             "orderTotalCost": (angular.isDefined($scope.OrderDetails.orderTotalCost) && $scope.OrderDetails.orderTotalCost != null) ? $scope.OrderDetails.orderTotalCost : totalAmountFromVendor,
             "certification": (angular.isDefined($scope.OrderDetails.certification) && $scope.OrderDetails.certification !== null) ? $scope.OrderDetails.certification : null
         }
          ));

            $scope.List = [];
            //$scope.steps = JSON.parse(angular.toJson($scope.MemoList));
            //alert($scope.steps);

            angular.forEach($scope.MemoList, function (attachment) {
                $scope.List.push({
                    "fileName": attachment.FileName,
                    "fileType": attachment.FileType,
                    "extension": attachment.FileExtension,
                    "filePurpose": "PURCHASE_ORDER_MEMO",
                    "latitude": null,
                    "longitude": null
                })
                param.append('file', attachment.File);
            });

            angular.forEach($scope.InvoiceList, function (attachment) {
                $scope.List.push({
                    "fileName": attachment.FileName,
                    "fileType": attachment.FileType,
                    "extension": attachment.FileExtension,
                    "filePurpose": "PURCHASE_ORDER_INVOICE",
                    "latitude": null,
                    "longitude": null
                })
                param.append('file', attachment.File);
            });

            angular.forEach($scope.CertificationList, function (attachment) {
                $scope.List.push({
                    "fileName": attachment.FileName,
                    "fileType": attachment.FileType,
                    "extension": attachment.FileExtension,
                    "filePurpose": "PURCHASE_ORDER_CERTIFICATION",
                    "latitude": null,
                    "longitude": null
                })
                param.append('file', attachment.File);
            });

            if ($scope.InvoiceList.length == 0 && $scope.CertificationList.length == 0 && $scope.MemoList.length == 0) {
                param.append('file', null);
                param.append('filesDetails', null);
            }
            else {
                param.append('filesDetails', JSON.stringify($scope.List));
            }
        }
        else if ($scope.OrderDetails.orderType.name == "Pick up from Vendor/Email Label") {
            var OrderPickUpFromVendorItemList = [];
            $scope.List = [];
            var index = 0;
            if (angular.isDefined($scope.temp_BIB_Of_GemlabRequest)) {
                angular.forEach($scope.GemLabItemList, function (Item) {
                    //Hide this code because shipping admin have not permission to update gemlab details
                    //angular.forEach(Item.AttachmentList, function (attachment) {
                    //    $scope.List.push({
                    //        "fileName": attachment.FileName,
                    //        "fileType": attachment.FileType,
                    //        "extension": attachment.FileExtension,
                    //        "filePurpose": "GEMLAB_PURCHASE_ORDER",
                    //        "latitude": null,
                    //        "longitude": null,
                    //        "index": index,
                    //    })
                    //    param.append('file', attachment.File);
                    //})
                    //index = index + 1;
                });
                if ($scope.List.length == 0) {
                    param.append('file', null);
                    param.append('filesDetails', null);
                }
                else {
                    param.append('filesDetails', JSON.stringify($scope.List));
                }
            }
            var item_Stone_Details = [];
            var temp_Item = [];
            var i = 0;
            if (angular.isDefined($scope.temp_BIB_Of_GemlabRequest)) {
                angular.forEach($scope.temp_BIB_Of_GemlabRequest.itemDetails, function (item) {
                    angular.forEach(item.stoneDetails, function (itemStoneDetails) {
                        item_Stone_Details.push({
                            "id": (angular.isDefined(itemStoneDetails.id)) ? itemStoneDetails.id : null,
                            "stoneType": {
                                "id": itemStoneDetails.stoneType.id,
                            },
                            "quantity": itemStoneDetails.quantity,
                            "price": itemStoneDetails.price,
                            "stoneShape": {
                                "id": itemStoneDetails.stoneShape.id,
                            },
                            "stoneColor": {
                                "id": itemStoneDetails.stoneColor.id,
                            },
                            "stoneClarity": {
                                "id": itemStoneDetails.stoneClarity.id,
                            },
                            "mmCtw": itemStoneDetails.mmCtw
                        });

                    });
                    delete item.AttachmentList;
                    delete item.AttachmentEditList;
                    delete item.number
                    temp_Item[i] = JSON.parse(angular.toJson(item));
                    temp_Item[i].stoneDetails = JSON.parse(angular.toJson(item_Stone_Details));// to remove $$hashkey
                    item_Stone_Details = [];
                    i++;
                });
                $scope.temp_BIB_Of_GemlabRequest.itemDetails = temp_Item;
            }

            var GemLabOrder = [];
            var GemlabParam;
            if (angular.isDefined($scope.temp_BIB_Of_GemlabRequest) && $scope.temp_BIB_Of_GemlabRequest != null && $scope.OrderDetails.isLab == true) {
                GemlabParam = {
                    "id": angular.isUndefined($scope.temp_BIB_Of_GemlabRequest.id) ? null : $scope.temp_BIB_Of_GemlabRequest.id,
                    "assignmentNumber": $scope.temp_BIB_Of_GemlabRequest.assignmentNumber,
                    "claimNumber": $scope.temp_BIB_Of_GemlabRequest.claimNumber,
                    "description": (angular.isUndefined($scope.temp_BIB_Of_GemlabRequest.description) ? null : $scope.temp_BIB_Of_GemlabRequest.description),
                    "lineItem": {
                        "id": (angular.isDefined($scope.temp_BIB_Of_GemlabRequest.lineItem.id) ? $scope.temp_BIB_Of_GemlabRequest.lineItem.id : null)
                    },
                    "associate": {
                        "id": (angular.isDefined($scope.temp_BIB_Of_GemlabRequest.associate) && $scope.temp_BIB_Of_GemlabRequest.associate !== null ? $scope.temp_BIB_Of_GemlabRequest.associate.id : null)
                    },
                    "orderType": {
                        "id": $scope.temp_BIB_Of_GemlabRequest.orderType.id
                    },
                    "purchaseOrderStatus": {
                        "id": (angular.isDefined($scope.temp_BIB_Of_GemlabRequest.purchaseOrderStatus) && $scope.temp_BIB_Of_GemlabRequest.purchaseOrderStatus != null) ? $scope.temp_BIB_Of_GemlabRequest.purchaseOrderStatus.id : 1
                    },
                    "itemDetails": JSON.parse(angular.toJson($scope.temp_BIB_Of_GemlabRequest.itemDetails))
                };
                GemLabOrder.push(GemlabParam);
            }
            else {
                GemLabOrder = null;
            }

            $scope.OrderDetails.orderTotalCost = 0.00;
            angular.forEach($scope.OrderPickUpFromVendor_ItemList, function (item) {

                $scope.OrderDetails.orderTotalCost += item.amount != null ? item.amount : 0;
                OrderPickUpFromVendorItemList.push({
                    "id": (angular.isDefined(item.id)) ? item.id : null,
                    "description": item.description,
                    "amount": item.amount,
                    "quantity": item.quantity,
                    "sku": item.sku,
                    "unitPrice": item.unitPrice,
                    "purchaseOrderStatus": { "id": getItemStatus(item.status) }
                });
            });
            $scope.OrderDetails.orderTotalCost += $scope.OrderDetails.shippingCost;
            param.append("purchaseOrder",
            JSON.stringify(
                {
                    "id": (angular.isDefined($scope.OrderDetails.id)) ? $scope.OrderDetails.id : null,
                    "orderType": {
                        "name": $scope.OrderDetails.orderType.name
                    },
                    "lineItem": {
                        "itemId": (angular.isDefined($scope.OrderDetails.lineItem.itemId) ? $scope.OrderDetails.lineItem.itemId : null)
                    },
                    "claim": {
                        "claimId": (angular.isDefined($scope.OrderDetails.claim.claimId) ? $scope.OrderDetails.claim.claimId : null)
                    },
                    "vendorAssignment": {
                        "id": (angular.isDefined($scope.OrderDetails.vendorAssignment) ? $scope.OrderDetails.vendorAssignment.id : null)
                    },
                    "csr": (angular.isDefined($scope.OrderDetails.csr) ? $scope.OrderDetails.csr : sessionStorage.getItem("Name")),
                    "phName": $scope.OrderDetails.phName,
                    "supplier": {
                        "vendorId": $scope.OrderDetails.supplier.vendorId
                    },
                    "description": (angular.isDefined($scope.OrderDetails.description) ? $scope.OrderDetails.description : null),
                    "shippingCost": $scope.OrderDetails.shippingCost,
                    "tracking": $scope.OrderDetails.tracking,
                    "returnTracking": $scope.OrderDetails.returnTracking,
                    "specialInstruction": $scope.OrderDetails.specialInstruction,
                    "method": {
                        "id": (angular.isDefined($scope.OrderDetails.method)) ? $scope.OrderDetails.method.id : null
                    },
                    "returnMethod": ((angular.isDefined($scope.OrderDetails.returnMethod) && $scope.OrderDetails.returnMethod != null) ?
                { "id": $scope.OrderDetails.returnMethod.id } : null),
                    "pickup": $scope.OrderDetails.pickup,
                    "eta": $filter('DatabaseDateFormatMMddyyyy')($scope.OrderDetails.eta),
                    "pickupDate": $filter('DatabaseDateFormatMMddyyyy')($scope.OrderDetails.pickupDate),
                    "pickupTime": (angular.isDefined($scope.OrderDetails.pickupTime) && ($scope.OrderDetails.pickupTime != null) && ($scope.OrderDetails.pickupTime != "") ? returnDateForEvent(angular.copy($scope.OrderDetails.pickupDate), $scope.OrderDetails.pickupTime) : null),
                    "submitDate": $filter('DatabaseDateFormatMMddyyyy')($scope.OrderDetails.submitDate),
                    "receivedDate": (angular.isDefined($scope.OrderDetails.receivedDate) && $scope.OrderDetails.receivedDate != null ? $filter('DatabaseDateFormatMMddyyyy')($scope.OrderDetails.receivedDate) : null),
                    "purchaseOrderItems": OrderPickUpFromVendorItemList,
                    "isReturn": true,
                    "status": {
                        "id": (angular.isDefined($scope.OrderDetails.status) && $scope.OrderDetails.status != null) ? $scope.OrderDetails.status.id : 1
                    },
                    "orderTotalCost": (angular.isDefined($scope.OrderDetails.orderTotalCost) && $scope.OrderDetails.orderTotalCost !== null) ? $scope.OrderDetails.orderTotalCost : ((angular.isDefined($scope.OrderDetails.purchaseOrderItems) && $scope.OrderDetails.purchaseOrderItems !== null) ? $scope.OrderDetails.purchaseOrderItems[0].amount : 0.0),
                    "is_pickupItem": $scope.OrderDetails.is_pickupItem,
                    "sendEmailLabel": $scope.OrderDetails.sendEmailLabel,
                    "isLab": $scope.OrderDetails.isLab,
                    "gemLabRequestPurchaseOrders": GemLabOrder
                }

                ));
            //param.append('filesDetails', null);
            //param.append('file', null);

        }
        else if ($scope.OrderDetails.orderType.name == "Shipment") {
           
            var attaches = [];
            var ItemList = [];
            var ShipemntItems = []
            angular.forEach($scope.SelectedPackingSlips, function (attchment) {
                attaches.push({ id: attchment.id });
            });

            angular.forEach($scope.OrderPackingSlip_ItemList, function (item) {
                ItemList.push({ "quantity": item.quantity, "description": item.description });
            });
            //Shipment Order Items
            angular.forEach($scope.OrderShipment_ItemList, function (item) {
                ShipemntItems.push({ "id": item.id, "quantity": item.quantity, "description": item.description });
            });

            param.append("purchaseOrder", JSON.stringify(
            {
                "id": (angular.isDefined($scope.OrderDetails.id)) ? $scope.OrderDetails.id : null,
                "orderType": {
                    "name": $scope.OrderDetails.orderType.name
                },
                "shippedDate": (angular.isDefined($scope.OrderDetails.shippedDate) && $scope.OrderDetails.shippedDate !== null) ? $scope.OrderDetails.shippedDate : null,
                "lineItem": {
                    "itemId": (angular.isDefined($scope.OrderDetails.lineItem.itemId) ? $scope.OrderDetails.lineItem.itemId : null)
                },
                "claim": {
                    "claimId": (angular.isDefined($scope.OrderDetails.claim.claimId) ? $scope.OrderDetails.claim.claimId : null)
                },
                "vendorAssignment": {
                    "id": (angular.isDefined($scope.OrderDetails.vendorAssignment) ? $scope.OrderDetails.vendorAssignment.id : null)
                },
                "csr": (angular.isDefined($scope.OrderDetails.csr) ? $scope.OrderDetails.csr : sessionStorage.getItem("Name")),
                "description": $scope.OrderDetails.description,
                "phName": $scope.OrderDetails.phName,
                "address": {
                    "city": $scope.OrderDetails.address.city,
                    "streetAddressOne": $scope.OrderDetails.address.streetAddressOne,
                    "streetAddressTwo": $scope.OrderDetails.address.streetAddressTwo,
                    "zipcode": $scope.OrderDetails.address.zipcode,
                    "state": {
                        "id": $scope.OrderDetails.address.state.id
                    }
                },
                "phone": (angular.isDefined($scope.OrderDetails.phone) ? $scope.OrderDetails.phone.replace(/[()-]/g, '').replace(/ /g, '') : null),
                "email": (angular.isDefined($scope.OrderDetails.email) ? $scope.OrderDetails.email : null),
                "tracking": (angular.isDefined($scope.OrderDetails.tracking) ? $scope.OrderDetails.tracking : null),
                "receivedDate": (angular.isDefined($scope.OrderDetails.receivedDate) ? $filter('DatabaseDateFormatMMddyyyy')($scope.OrderDetails.receivedDate) : null),
                "eta": $filter('DatabaseDateFormatMMddyyyy')($scope.OrderDetails.eta),
                "shippingCost": (angular.isDefined($scope.OrderDetails.shippingCost) ? $scope.OrderDetails.shippingCost : 0),
                "returnTracking": (angular.isDefined($scope.OrderDetails.returnTracking) ? $scope.OrderDetails.returnTracking : null),
                "specialInstruction": (angular.isDefined($scope.OrderDetails.specialInstruction) ? $scope.OrderDetails.specialInstruction : null),
                "method": {
                    "id": (angular.isDefined($scope.OrderDetails.method)) ? $scope.OrderDetails.method.id : null
                },
                "returnMethod": ((angular.isDefined($scope.OrderDetails.returnMethod) && $scope.OrderDetails.returnMethod != null) ?
                { "id": $scope.OrderDetails.returnMethod.id } : null),
                "arrivalAtDestination": $filter('DatabaseDateFormatMMddyyyy')($scope.OrderDetails.arrivalAtDestination),
                "packingSlip": true,
                "purchaseOrderItems": ShipemntItems.length>0?ShipemntItems:null,
                "status": {
                    "id": (angular.isDefined($scope.OrderDetails.status) && $scope.OrderDetails.status != null) ? $scope.OrderDetails.status.id : 1
                },
                "orderTotalCost": (angular.isDefined($scope.OrderDetails.orderTotalCost) && $scope.OrderDetails.orderTotalCost != null) ? $scope.OrderDetails.orderTotalCost : $scope.OrderDetails.shippingCost,
                "packingSlipDetails": {
                    "id": (angular.isDefined($scope.OrderDetails.packingSlipDetails)) ? $scope.OrderDetails.packingSlipDetails.id : null,  // mandatory id for update
                    "policyHolder": {
                        "firstName": (angular.isDefined($scope.PolicyHolderDetails) && $scope.PolicyHolderDetails.policyHolder !== null) ? $scope.PolicyHolderDetails.policyHolder.firstName : null,
                        "lastName": (angular.isDefined($scope.PolicyHolderDetails) && $scope.PolicyHolderDetails.policyHolder !== null) ? $scope.PolicyHolderDetails.policyHolder.lastName : null,
                        "email": $scope.OrderDetails.email,
                        "dayTimePhone": $scope.OrderDetails.phone.replace(/[()-]/g, '').replace(/ /g, '')
                    },
                    "purchaseOrderMethod": {
                        "id": (angular.isDefined($scope.OrderDetails.method)) ? $scope.OrderDetails.method.id : null
                    },
                    "specialInstructions": $scope.OrderDetails.packingSlipDetails.specialInstructions,
                    "attaches": attaches,
                    "items": ItemList
                }
            }));
            param.append('filesDetails', null);
            param.append('file', null);
             
        }
         
        var TypeList = PurchaseOrderService.SaveBoxInBox(param);
        TypeList.then(function (success) {            
            $location.url("SalesOrders");
            toastr.remove()
            toastr.success((success.data.message !== null) ? success.data.message : "Order details saved successfully.", "Confirmation");
        }, function (error) {
            toastr.remove()
            toastr.error((error.data) ? error.data.message : "Failed to saved the order details.", "Error");
        });
    }

    //PackingSlip Items
    $scope.NewItemPackingSlip = false;
    $scope.OrderPackingSlip_ItemList = [];
    $scope.selectedPackingSlip = {};
    $scope.PackingSlipCount = 0;
    $scope.getTemplatePackingSlip = function (item) {
        if (!angular.isUndefined(item)) {

            if (item.id === $scope.selectedPackingSlip.id)

                return 'edit1PackingSlip';
            else
                return 'display1PackingSlip';
        }
        else
            return 'display1PackingSlip';
    };

    $scope.addItem_PackingSlip = addItem_PackingSlip;
    function addItem_PackingSlip(operationFlag, operationType) {

        if (operationFlag == 1 && operationType == "Add") {
            $scope.OrderPackingSlip_ItemList.push($scope.selectedPackingSlip);
        }
        else if (operationType == "Edit") {
            $scope.OrderPackingSlip_ItemList[operationFlag] = angular.copy($scope.selectedPackingSlip);
        }
            //else if (operationFlag != 0 && operationType == "Remove") {
        else if (operationType == "Remove") {
            $scope.OrderPackingSlip_ItemList.splice(operationFlag, 1);
        }
        else if (operationType == "Cancel") {

            $scope.selectedPackingSlip = {};
            $scope.NewItemPackingSlip = false;
        }
        $scope.selectedPackingSlip = {};
    }
    $scope.AddNewPackingSlipItem = AddNewPackingSlipItem;
    function AddNewPackingSlipItem() {

        $scope.selectedPackingSlip = {};
        $scope.NewItemPackingSlip = true;
        // $scope.EditPaymentTerm = false;
    };

    $scope.EditPackingSlipItem = EditPackingSlipItem;
    function EditPackingSlipItem(item) {

        $scope.selectedPackingSlip = angular.copy(item);
    };


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

        var item_purchaseOrder_ServiceRequest = {};
        $scope.stoneDetails = JSON.parse(angular.toJson($scope.stoneDetails));
        var item_Stone_Details = [];
        if ($scope.GemLabItemList.length > 0) {
            angular.forEach($scope.GemLabItemList, function (item) {
                item.itemDescription = $scope.CommonObj.ItemDescription;
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
                if (angular.isDefined($scope.OrderDetails.isLab) && $scope.OrderDetails.isLab == true) {

                } else {
                    delete item.AttachmentList;
                    delete item.AttachmentEditList;
                }
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
        } else {
            $scope.GemLabItemList = null;
        }
        var Gemlabparam = {
            "id": $scope.OrderDetails.id,
            "assignmentNumber": $scope.OrderDetails.assignmentNumber,
            "claimNumber": $scope.OrderDetails.ClaimNumber,
            "description": "",//(angular.isUndefined($scope.OrderDetails.description) ? null : $scope.OrderDetails.description),
            "lineItem": {
                "id": $scope.OrderDetails.lineItem.itemId
            },
            "associate": {
                "id": (angular.isDefined($scope.OrderDetails.associate) && $scope.OrderDetails.associate != null ? $scope.OrderDetails.associate.id : 4),
            },
            "orderType": {
                "id": $scope.OrderDetails.orderType.id
            },
            "purchaseOrderStatus": {
                "id": $scope.OrderDetails.purchaseOrderStatus.id
            },
            "itemDetails": JSON.parse(angular.toJson($scope.GemLabItemList))
        };
        param.append("purchaseOrder", JSON.stringify(Gemlabparam));
        if (angular.isDefined($scope.OrderDetails.isLab) && $scope.OrderDetails.isLab == true) {
            $scope.temp_BIB_Of_GemlabRequest = param;
            $scope.OrigionalGemlabObject = angular.copy($scope.temp_BIB_Of_GemlabRequest);
            $scope.OrderDetails = $scope.BIB_Param;
            $scope.BIB_with_Gemlab = false;
            $(".page-spinner-bar").addClass("hide");
        }
        else {
            var SaveGemlabRequest = PurchaseOrderService.SaveGemlabRequest(param);
            SaveGemlabRequest.then(function (success) {
                GetAllPurchaseOrders();
                $scope.PurchaseOrderAddEdit = false;
                $scope.IsEditOrder = false;
                $scope.PackingSlip = false;
                $scope.ClearAllItemsList();
                // $scope.ClearPackingSlipItems();
                toastr.remove()
                toastr.success((success.data.message !== null) ? success.data.message : "Order details saved successfully.", "Confirmation");
            }, function (error) {
                toastr.remove()
                toastr.error((error.data) ? error.data.message : "Failed to saved the order details.", "Error");
            });
        }
    }

    //Labour charges
    $scope.OrderLbourCharges_ItemList = [];
    $scope.OrderLbourCharges_ItemList.push({
        "sku": "", "quantity": "", "amount": ""
    });

    $scope.addItem_OrderLbourCharges = addItem_OrderLbourCharges;
    function addItem_OrderLbourCharges(operationFlag, operationType) {
        if (operationFlag == 1 && operationType == "Add") {
            $scope.OrderLbourCharges_ItemList.push({
                "SKU": "", "quantity": "", "amount": ""
            });
        }
        else if (operationFlag != 0 && operationType == "Remove") {
            $scope.OrderLbourCharges_ItemList.splice(operationFlag, 1);
        }

    }

    //Adjust labor codes
    $scope.LaborCostWorkDetails = [];
    $scope.LaborCostWorkCode = LaborCostWorkCode;
    function LaborCostWorkCode(ev) {
        var Get = PurchaseOrderService.GetLaborCode();
        Get.then(function (success) {
            $scope.animationsEnabled = true;
            var out = $uibModal.open(
            {
                animation: $scope.animationsEnabled,
                templateUrl: "views/ThirdPartyVendor/LaborCostWorkCode.html",
                controller: "LaborCostWorkCodeController",
                resolve:
                {
                    LaborList: function () {

                        return success.data.data;
                    }
                }
            });
            out.result.then(function (value) {
                //Call Back Function success
                if (value) {
                    $scope.LaborCostWorkDetails = [];
                    $scope.LaborCostWorkDetails.push(value);
                    $scope.CalculateTotalOrderLabor();
                }

            }, function (res) {
                //Call Back Function close
            });
            return {
                open: open
            };
        }, function (error) {
            toastr.remove()
            toastr.error((error.data) ? success.data.message : "Failed to get labor codes.", "Error");
        });
    };

    $scope.RemoveLaborCostWork = RemoveLaborCostWork;
    function RemoveLaborCostWork(ind) {
        $scope.LaborCostWorkDetails = [];
        $scope.CalculateTotalOrderLabor();
    };
    //Get supplier list for vendor
    $scope.VendorListDDL = [];

    $scope.GetVendorSuppliersList = GetVendorSuppliersList;
    function GetVendorSuppliersList()
    {
        var Vendors = PurchaseOrderService.GetVendorList();
        Vendors.then(function (success) {
            $scope.VendorListDDL = success.data.data;           
        }, function (error) {
            toastr.remove()
            toastr.error((error.data) ? error.data.errorMessage : "No supplier found.", "Error");
        });
    }
   

    //Time Pick start----------------------------------------------------------

    /** @type {Date} */
    $scope.EventTime = new Date;
    /** @type {number} */
    $scope.hstep = 1;
    /** @type {number} */
    $scope.mstep = 15;
    $scope.options = {
        hstep: [1, 2, 3],
        mstep: [1, 5, 10, 15, 25, 30]
    };
    /** @type {boolean} */
    $scope.ismeridian = true;
    /**
     * @return {undefined}
     */
    $scope.toggleMode = function () {
        /** @type {boolean} */
        $scope.ismeridian = !$scope.ismeridian;
    };
    /**
     * @return {undefined}
     */
    $scope.update = function () {
        /** @type {Date} */

        var d = new Date;
        d.setHours(14);
        d.setMinutes(0);
        /** @type {Date} */
        $scope.EventTime = d;
    };
    /**
     * @return {undefined}
     */
    $scope.changed = function () {

        //$log.log("Time changed to: " + $scope.EventTime);
    };
    $scope.changed1 = function () {

        //$log.log("Time changed to: " + $scope.EventTime);
    };
    /**
     * @return {undefined}
     */
    $scope.clear = function () {
        /** @type {null} */
        $scope.EventTime = null;
    };

    //--------End Time Picker-------------------------------------------------------------

    //Item popup
    $scope.PurchaseOrderItemPopUp = function () {
        var ItemObj = $scope.FiletrLostDamageList;
        $scope.animationsEnabled = true;
        var vm = this;
        var out = $uibModal.open(
            {
                animation: $scope.animationsEnabled,
                size: "md",
                templateUrl: "views/ThirdPartyVendor/PurchaseOrderPopup.html",
                controller: "PurchaseOrderPopupController",

                resolve:
            {
                ItemObj: function () {
                    ItemObj = ItemObj;
                    return ItemObj;
                }
            }

            });
        out.result.then(function (value) {
            if (value !== null && angular.isDefined(value)) {
                $scope.OrderDetails.lineItem.itemId = value;
            }
            //Call Back Function success
        }, function () {

        });
        return {
            open: open
        };
    }

    $scope.CancelOrder = CancelOrder;
    function CancelOrder() {
        if (angular.isDefined($scope.OrderDetails.id) && $scope.OrderDetails.id != null && $scope.OrderDetails.id > 0) {
            var paramId = [{
                "id": $scope.OrderDetails.id
            }];
            var CancelOrders = PurchaseOrderService.CancelPurchaseOrder(paramId);
            CancelOrders.then(function (success) {
                toastr.remove();
                toastr.success((success.data) ? success.data.message : "Order canceled successfully.", "Error");
            }, function (error) {
                toastr.remove()
                toastr.error((error.data) ? error.data.errorMessage : "Failed to cancel order.", "Error");
            });
        }
        else {
            toastr.remove()
            toastr.warning("Please select order to cancel.", "Warning.");
        }
    };

    $scope.ReturnOrder = ReturnOrder;
    function ReturnOrder() {

    }
    //calculate  OrderFromvendor OrderDetails.totalcost
    $scope.CalculateTotalOrderFromvendor = CalculateTotalOrderFromvendor;
    function CalculateTotalOrderFromvendor() {
        $scope.OrderDetails.orderTotalCost = 0.00;

        if (angular.isDefined($scope.selectedOrderFromvendor)) {
            $scope.selectedOrderFromvendor.totalcost = 0.00;
            $scope.selectedOrderFromvendor.totalcost = $scope.selectedOrderFromvendor.totalcost + ((parseFloat(angular.isDefined($scope.selectedOrderFromvendor.unitprice) && $scope.selectedOrderFromvendor.unitprice != "" ? $scope.selectedOrderFromvendor.unitprice : 0) * parseInt(angular.isDefined($scope.selectedOrderFromvendor.quantity) && $scope.selectedOrderFromvendor.quantity != "" ? $scope.selectedOrderFromvendor.quantity : 0)));
            var taxAmount = (parseFloat(angular.isDefined($scope.selectedOrderFromvendor.tax) && $scope.selectedOrderFromvendor.tax != "" ? $scope.selectedOrderFromvendor.tax : 0) / 100) * $scope.selectedOrderFromvendor.totalcost
            $scope.selectedOrderFromvendor.totalcost = $scope.selectedOrderFromvendor.totalcost + taxAmount;
            $scope.OrderDetails.finaltotalcost = $scope.OrderDetails.finaltotalcost + $scope.selectedOrderFromvendor.totalcost;

            angular.forEach($scope.OrderFromvendor_ItemList, function (item) {
                item.totalcost = 0.00;
                item.totalcost = item.totalcost + (parseFloat(angular.isDefined(item.unitprice) && item.unitprice != "" ? item.unitprice : 0)) * (parseInt(angular.isDefined(item.quantity) && item.quantity != "" ? item.quantity : 0));
                var taxAmount = (parseFloat(angular.isDefined(item.tax) && item.tax !== "" ? item.tax : 0) / 100) * item.totalcost;
                item.totalcost = item.totalcost + taxAmount;
                $scope.OrderDetails.orderTotalCost = $scope.OrderDetails.orderTotalCost + item.totalcost;
            });
        }

        else {

            //if (parseFloat(angular.isDefined($scope.selectedOrderFromvendor.quantity) && $scope.selectedOrderFromvendor.quantity!=""?$scope.selectedOrderFromvendor.quantity:0) > 0 && parseFloat((angular.isDefined($scope.selectedOrderFromvendor.unitprice) && $scope.selectedOrderFromvendor.unitprice != "" ? $scope.selectedOrderFromvendor.unitprice : 0)) > 0 && parseFloat((angular.isDefined($scope.selectedOrderFromvendor.tax) && $scope.selectedOrderFromvendor.tax != "" ? $scope.selectedOrderFromvendor.tax : 0)) > 0) {
            //    $scope.selectedOrderFromvendor.totalcost = 0.00;

            //    $scope.selectedOrderFromvendor.totalcost = $scope.selectedOrderFromvendor.totalcost + (parseFloat((angular.isDefined($scope.selectedOrderFromvendor.unitprice) && $scope.selectedOrderFromvendor.unitprice != "" ? $scope.selectedOrderFromvendor.unitprice : 0)) * (parseInt(angular.isDefined($scope.selectedOrderFromvendor.quantity) && $scope.selectedOrderFromvendor.quantity!="" ? $scope.selectedOrderFromvendor.quantity:0)));
            //    var taxAmount = parseFloat(angular.isUndefined($scope.selectedOrderFromvendor.tax) ? 0 : $scope.selectedOrderFromvendor.tax == null ? 0 : $scope.selectedOrderFromvendor.tax / 100) * $scope.selectedOrderFromvendor.totalcost
            //    $scope.selectedOrderFromvendor.totalcost = $scope.selectedOrderFromvendor.totalcost + taxAmount;
            //    $scope.OrderDetails.finaltotalcost = $scope.OrderDetails.finaltotalcost + $scope.selectedOrderFromvendor.totalcost;
            //}

            angular.forEach($scope.OrderFromvendor_ItemList, function (item) {

                item.totalcost = 0.00;

                item.totalcost = item.totalcost + (parseFloat(angular.isDefined(item.unitprice) && item.unitprice != "" ? item.unitprice : 0)) * (parseInt(angular.isDefined(item.quantity) && item.quantity != "" ? item.quantity : 0));
                var taxAmount = (parseFloat(angular.isDefined(item.tax) && item.tax !== "" ? item.tax : 0) / 100) * item.totalcost;
                item.totalcost = item.totalcost + taxAmount;
                $scope.OrderDetails.orderTotalCost = $scope.OrderDetails.orderTotalCost + item.totalcost;


            });
        }

    };

    $scope.CalculateTotalOrderLabor = CalculateTotalOrderLabor;
    function CalculateTotalOrderLabor() {
        var totalAmountLaborType = 0.0;

        if (angular.isDefined($scope.selectedLbourCharges)) {
            $scope.selectedLbourCharges.amount = parseFloat(angular.isDefined($scope.selectedLbourCharges.quantity) && $scope.selectedLbourCharges.quantity != "" ? $scope.selectedLbourCharges.quantity : 0) * parseFloat(angular.isDefined($scope.selectedLbourCharges.unitPrice) && $scope.selectedLbourCharges.unitPrice != "" ? $scope.selectedLbourCharges.unitPrice : 0);
        }
        if (angular.isDefined($scope.OrderLbourCharges_ItemList) && $scope.OrderLbourCharges_ItemList !== null) {
            angular.forEach($scope.OrderLbourCharges_ItemList, function (item) {
                item.amount = parseFloat(angular.isDefined(item.quantity) && item.quantity != "" ? item.quantity : 0) * parseFloat(angular.isDefined(item.unitPrice) && item.unitPrice != "" ? item.unitPrice : 0);
                totalAmountLaborType += item.amount;
            });
            if ($scope.LaborCostWorkDetails.length > 0) {
                totalAmountLaborType += $scope.LaborCostWorkDetails[0].price;

            }
            $scope.OrderDetails.orderTotalCost = totalAmountLaborType;
        }

    }

    $scope.HidePurchseOrderDiv = function () {
        if ($scope.BIB_with_Gemlab) {
            if (angular.isDefined($scope.temp_BIB_Of_GemlabRequest.itemDetails) && $scope.temp_BIB_Of_GemlabRequest.itemDetails != null) {
                var a = $scope.temp_BIB_Of_GemlabRequest.itemDetails.length;
                var b = $scope.OrigionalGemlabObject.itemDetails.length;
                $scope.temp_BIB_Of_GemlabRequest.itemDetails = $scope.OrigionalGemlabObject.itemDetails;
            }
           $scope.OrderDetails = $scope.BIB_Param;
           $scope.BIB_with_Gemlab = false;
           $scope.GemLabItemList = $scope.OrigionalGemlabObject;
           $scope.GemlabTab = 1;
        }
        else {
            $location.url("SalesOrders");
        }

    };
   

    $scope.OrderLbourCharges_ItemList = [];
    $scope.selectedLbourCharges = {};

    $scope.getTemplateLbourCharges = function (item) {
        if (!angular.isUndefined(item)) {
            if (item.id === $scope.selectedLbourCharges.id)
                return 'edit1LbourCharges';
            else
                return 'display1LbourCharges';
        }
        else
            return 'display1LbourCharges';
    };

    $scope.addItem_LbourCharges = addItem_LbourCharges;
    function addItem_LbourCharges(operationFlag, operationType) {       
        if (operationFlag == 1 && operationType == "Add") {
            $scope.OrderLbourCharges_ItemList.push( {
                SINo: $scope.selectedLbourCharges.SINo,
                id: null,
                sku: $scope.selectedLbourCharges.sku,
                quantity: $scope.selectedLbourCharges.quantity,
                unitPrice: $scope.selectedLbourCharges.unitPrice,
                amount: $scope.selectedLbourCharges.amount,
                status: $scope.selectedLbourCharges.status
            });
            $scope.NewItemLbourCharges = false;
            $scope.CalculateTotalOrderLabor();
        }
        else if (operationType == "Edit") {
            //$scope.OrderLbourCharges_ItemList[operationFlag]($scope.selectedLbourCharges);
            $scope.OrderLbourCharges_ItemList[operationFlag] = {
                SINo: $scope.selectedLbourCharges.SINo,
                id: $scope.selectedLbourCharges.id,
                sku: $scope.selectedLbourCharges.sku,
                quantity: $scope.selectedLbourCharges.quantity,
                unitPrice: $scope.selectedLbourCharges.unitPrice,
                amount: $scope.selectedLbourCharges.amount,
                status: $scope.selectedLbourCharges.status
            };
            $scope.CalculateTotalOrderLabor();
        }
            //else if (operationFlag != 0 && operationType == "Remove") {
        else if (operationType == "Remove") {
            $scope.OrderLbourCharges_ItemList.splice(operationFlag, 1);

            $scope.CalculateTotalOrderLabor();
        }
        else if (operationType == "Cancel") {
            $scope.selectedLbourCharges = {};
            $scope.NewItemLbourCharges = false;
        }
        $scope.selectedLbourCharges = {};

    }
    $scope.AddNewLbourChargesItem = AddNewLbourChargesItem;
    function AddNewLbourChargesItem() {
        $scope.selectedLbourCharges = {};
        $scope.NewItemLbourCharges = true;
       
    }

    $scope.EditLbourChargesItem = EditLbourChargesItem;
    function EditLbourChargesItem(item) {
        $scope.selectedLbourCharges = angular.copy(item);
    }

    //Form Vendor Items
    //$scope.getTemplateFormVendor = function (item) {
    //    if (!angular.isUndefined(item)) {
    //        if (item.id === $scope.selectedFormVendor.id)
    //            return 'edit1FormVendor';
    //        else
    //            return 'display1FormVendor';
    //    }
    //    else
    //        return 'display1FormVendor';
    //};
    //$scope.addItem_OrderFromvendor = addItem_OrderFromvendor;
    //function addItem_OrderFromvendor(operationFlag, operationType) {
    //    if (operationFlag == 1 && operationType == "Add") {
    //        $scope.OrderFromvendor_ItemList.push({
    //            "description": "", "sku": "", "quantity": "", "amount": ""//, "salesTax": ""
    //        });
    //    } else if (operationType == "Edit") {
    //        $scope.OrderShipment_ItemList[operationFlag] = {
    //            amount: $scope.selectedFormVendor.amount, description: $scope.selectedFormVendor.description, id: $scope.selectedFormVendor.id, quantity: $scope.selectedFormVendor.quantity, sku: $scope.selectedFormVendor.SKU, taxRate: $scope.selectedFormVendor.taxRate
    //        };
    //        $scope.selectedFormVendor = {};
    //    }
    //    else if (operationType == "Remove") {
    //        $scope.OrderFromvendor_ItemList.splice(operationFlag, 1);
    //    }
    //}
    //$scope.EditFormVendorItem = EditFormVendorItem;
    //function EditFormVendorItem(item) {
    //    $scope.selectedFormVendor = angular.copy(item);
    //}

    //Form Vendor Items
    $scope.OrderFromvendor_ItemList = [];
    $scope.selectedFromvendor = {};

    $scope.getTemplateFromvendor = function (item) {
        if (!angular.isUndefined(item)) {
            if (item.id === $scope.selectedFromvendor.id)
                return 'edit1Fromvendor';
            else
                return 'display1Fromvendor';
        }
        else
            return 'display1Fromvendor';
    };

    $scope.addItem_Fromvendor = addItem_Fromvendor;
    function addItem_Fromvendor(operationFlag, operationType) {
         
        if (operationFlag == 1 && operationType == "Add") {
            $scope.OrderFromvendor_ItemList.push($scope.selectedFromvendor);
            $scope.NewItemFromvendor = false;
        }
        else if (operationType == "Edit") {
            $scope.OrderFromvendor_ItemList[operationFlag] = {
                amount: $scope.selectedFromvendor.amount, description: $scope.selectedFromvendor.description, id: $scope.selectedFromvendor.id, quantity: $scope.selectedFromvendor.quantity, sku: $scope.selectedFromvendor.SKU, taxRate: $scope.selectedFromvendor.taxRate
            };
        }
            //else if (operationFlag != 0 && operationType == "Remove") {
        else if (operationType == "Remove") {
            $scope.OrderFromvendor_ItemList.splice(operationFlag, 1);
        }
        else if (operationType == "Cancel") {
            $scope.selectedFromvendor = {};
            $scope.NewItemFromvendor = false;
        }
        $scope.selectedFromvendor = {};

    }
    $scope.AddNewFromvendorItem = AddNewFromvendorItem;
    function AddNewFromvendorItem() {
        $scope.selectedFromvendor = {};
        $scope.NewItemFromvendor = true;
        // $scope.EditPaymentTerm = false;
    }

    $scope.EditFromcvndorItem = EditFromVendorItem;
    function EditFromVendorItem(item) {
        $scope.selectedFromvendor = angular.copy(item);
    }
  
    //PickUp From Vendor 
    $scope.NewItemPickUpFromVendor = false;
    $scope.OrderPickUpFromVendor_ItemList = [];
    $scope.selectedPickUpFromVendor = {};
    $scope.getTemplatePickUpFromVendor = function (item) {
        if (!angular.isUndefined(item)) {
            if (item.SINo === $scope.selectedPickUpFromVendor.SINo)
                return 'edit1PickUpFromVendor';
            else
                return 'display1PickUpFromVendor';
        }
        else
            return 'display1PickUpFromVendor';
    };

    $scope.addItem_PickUpFromVendor = addItem_PickUpFromVendor;
    function addItem_PickUpFromVendor(operationFlag, operationType) {
        if (operationFlag == 1 && operationType == "Add") {
            $scope.OrderPickUpFromVendor_ItemList.push($scope.selectedPickUpFromVendor);
            $scope.NewItemPickUpFromVendor = false;
            $scope.CalculateTotalPickUpFromVendor();
        }
        else if (operationType == "Edit") {
            $scope.OrderPickUpFromVendor_ItemList[operationFlag] = {
                id: $scope.selectedPickUpFromVendor.id,
                SINo: $scope.selectedPickUpFromVendor.SINo,
                description: $scope.selectedPickUpFromVendor.description,
                sku: $scope.selectedPickUpFromVendor.sku,
                quantity: $scope.selectedPickUpFromVendor.quantity,
                unitPrice: $scope.selectedPickUpFromVendor.unitPrice,
                amount: $scope.selectedPickUpFromVendor.amount,
                tax: $scope.selectedPickUpFromVendor.tax,
                status: $scope.selectedPickUpFromVendor.status

            };
            $scope.CalculateTotalPickUpFromVendor();
        }
            //else if (operationFlag != 0 && operationType == "Remove") {
        else if (operationType == "Remove") {
            $scope.OrderPickUpFromVendor_ItemList.splice(operationFlag, 1);
            $scope.CalculateTotalPickUpFromVendor();
        }
        else if (operationType == "Cancel") {
            $scope.selectedPickUpFromVendor = {};
            $scope.NewItemPickUpFromVendor = false;
        }
        $scope.selectedPickUpFromVendor = {};

    }
    $scope.AddNewPickUpFromVendorItem = AddNewPickUpFromVendorItem;
    function AddNewPickUpFromVendorItem() {

        $scope.selectedPickUpFromVendor = {};
        $scope.NewItemPickUpFromVendor = true;
        // $scope.EditPaymentTerm = false;
    }

    $scope.EditPickUpFromVendorItem = EditPickUpFromVendorItem;
    function EditPickUpFromVendorItem(item) {

        $scope.selectedPickUpFromVendor = angular.copy(item);
        $scope.CalculateTotalPickUpFromVendor();
    }


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

    //Shipment Items
    $scope.NewItemShipment = false;
    $scope.OrderShipment_ItemList = [];
    $scope.selectedShipment = {};

    $scope.getTemplateShipment = function (item) {
        if (!angular.isUndefined(item)) {
            if (item.SINo === $scope.selectedShipment.SINo)
                return 'edit1Shipment';
            else
                return 'display1Shipment';
        }
        else
            return 'display1Shipment';
    };

    $scope.addItem_Shipment = addItem_Shipment;
    function addItem_Shipment(operationFlag, operationType) {
        if (operationFlag == 1 && operationType == "Add") {
            $scope.OrderShipment_ItemList.push($scope.selectedShipment);
            $scope.NewItemShipment = false;
            $scope.CalculateTotalShipment();
        }
        else if (operationType == "Edit") {
            $scope.OrderShipment_ItemList[operationFlag] = {
                id: $scope.selectedShipment.id,
                amount: $scope.selectedShipment.amount,
                description: $scope.selectedShipment.description,
                SINo: $scope.selectedShipment.SINo,
                quantity: $scope.selectedShipment.quantity,
                unitPrice: $scope.selectedShipment.unitPrice,
                SKU: $scope.selectedShipment.SKU,
                saleTax: $scope.selectedShipment.saleTax,
                status: $scope.selectedShipment.status
            };
            $scope.CalculateTotalShipment();
        }
            //else if (operationFlag != 0 && operationType == "Remove") {
        else if (operationType == "Remove") {
            $scope.OrderShipment_ItemList.splice(operationFlag, 1);
            $scope.CalculateTotalShipment();
        }
        else if (operationType == "Cancel") {
            $scope.NewItemShipment = false;
            $scope.selectedShipment = {};
        }
        $scope.selectedShipment = {};
    }
    $scope.AddNewShipmentItem = AddNewShipmentItem;
    function AddNewShipmentItem() {
        $scope.selectedShipment = {};
        $scope.NewItemShipment = true;
        // $scope.EditPaymentTerm = false;
    };

    $scope.EditShipmentItem = EditShipmentItem;
    function EditShipmentItem(item) {
        $scope.selectedShipment = angular.copy(item);
    };
  
    //File Upload Memo
    $scope.AddAttachmentMemo = function () {
        angular.element('#FileUploadMemo').trigger('click');
    }
    $scope.MemoList = [];
    $scope.getMemoFileDetails = function (e) {
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
                reader.onload = $scope.LoadFileInListMemo;
                reader.readAsDataURL(file);
            }
        });
    };
    $scope.LoadFileInListMemo = function (e) {
        $scope.$apply(function () {
            $scope.MemoList.push(
                {
                    "FileName": e.target.fileName, "FileExtension": e.target.fileExtension, "FileType": e.target.fileType,
                    "Image": e.target.result, "File": e.target.file
                })
        });
    }

    $scope.RemoveAttachmentMemo = RemoveAttachmentMemo;
    function RemoveAttachmentMemo(index) {
        if ($scope.MemoList.length > 0) {
            $scope.MemoList.splice(index, 1);
        }
    };
    //End File Upload Memo

    //File Upload Invoice
    $scope.AddAttachmentInvoice = function () {
        angular.element('#FileUploadInvoice').trigger('click');
    }
    $scope.InvoiceList = [];
    $scope.getInvoiceFileDetails = function (e) {
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
                reader.onload = $scope.LoadFileInListInvoice;
                reader.readAsDataURL(file);
            }
        });
    };
    $scope.LoadFileInListInvoice = function (e) {
        $scope.$apply(function () {
            $scope.InvoiceList.push(
                {
                    "FileName": e.target.fileName, "FileExtension": e.target.fileExtension, "FileType": e.target.fileType,
                    "Image": e.target.result, "File": e.target.file
                })
        });
    }
    $scope.RemoveAttachmentInvoice = RemoveAttachmentInvoice;
    function RemoveAttachmentInvoice(index) {
        if ($scope.InvoiceList.length > 0) {
            $scope.InvoiceList.splice(index, 1);
        }
    };
    //End File Upload Invoice 

    //File Upload Certification
    $scope.AddAttachmentCertification = function () {
        angular.element('#FileUploadCertification').trigger('click');
    }
    $scope.CertificationList = [];
    $scope.getCertificationFileDetails = function (e) {
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
                reader.onload = $scope.LoadFileInListCertification;
                reader.readAsDataURL(file);
            }
        });
    };
    $scope.LoadFileInListCertification = function (e) {
        $scope.$apply(function () {
            $scope.CertificationList.push(
                {
                    "FileName": e.target.fileName, "FileExtension": e.target.fileExtension, "FileType": e.target.fileType,
                    "Image": e.target.result, "File": e.target.file
                })
        });
    }
    $scope.RemoveAttachmentCertification = RemoveAttachmentCertification;
    function RemoveAttachmentCertification(index) {

        if ($scope.CertificationList.length > 0) {
            $scope.CertificationList.splice(index, 1);
        }
    };
    //End File Upload Certification
    $scope.PreviousPOType;
    $scope.ReturnItem = ReturnItem;
    function ReturnItem() {
        $scope.EditItemReturn = false;
        $scope.PreviousPOType = $scope.OrderDetails.orderType.name;
        $scope.OrderDetails.orderType.name = "Item Return";

    };

    $scope.SaveItemReturn = function () {
        $scope.$broadcast('SaveItemReturn', { message: 'test' });
        $scope.OrderDetails.orderType.name = $scope.PreviousPOType;
        $scope.EditPurchaseOrder($scope.OrderDetails);

    };
    $scope.ReturnPurchaseOrder = [];
    $scope.EditItemReturn = false;
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

    $scope.EditReturnItemOrder = EditReturnItemOrder;
    function EditReturnItemOrder(item) {
        $scope.EditReturnDetails = item;
        $scope.EditItemReturn = true;
        $scope.PreviousPOType = $scope.OrderDetails.orderType.name;
        $scope.OrderDetails.orderType.name = 'Item Return';
    }

    $scope.CancelItemReturn = CancelItemReturn;
    function CancelItemReturn() {
        init();
        $scope.PreviousPOType = $scope.OrderDetails.orderType.name;
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
                    labFee: angular.isUndefined(item.labFee) || item.labFee == null ? null : item.labFee,
                    AttachmentList: [],
                    AttachmentEditList: item.attachments,
                });
                tempNumber++;
            })
            $scope.temp_BIB_Of_GemlabRequest.itemDetails = $scope.GemLabItemList;
            $scope.OrderDetails = $scope.temp_BIB_Of_GemlabRequest;
            $scope.OrderDetails.status = "";
            $scope.OrderDetails.status = $scope.BIB_Param.status;
            $scope.OrderDetails.claim = $scope.BIB_Param.claim;
            $scope.OrderDetails.lineItem = $scope.BIB_Param.lineItem;
            $scope.OrderDetails.csr = $scope.BIB_Param.csr;
            $scope.OrderDetails.phName = $scope.BIB_Param.phName;
            $scope.OrderDetails.createDate = (angular.isDefined($scope.OrderDetails.createDate) && $scope.OrderDetails.createDate != null) ? ($filter('DateFormatMMddyyyy')($scope.OrderDetails.createDate)) : (null);
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
                itemDescription: angular.isUndefined($scope.CommonObj.ItemDescription) ? null : $scope.CommonObj.ItemDescription,
                AttachmentList: [],
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
    $scope.sortPOKey;
    $scope.sortPurchaseOrder = sortPurchaseOrder;
    function sortPurchaseOrder(keyname) {
        $scope.sortPOKey = keyname;
        $scope.reversePO = !$scope.reversePO;
    }

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
                id: $scope.stoneDetails.id,
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
    $scope.GemLabItemList = [{
        id: null,
        number: 1,
        stoneDetails: [],
        AttachmentList: [],
        purchaseOrderServiceRequest: {
            "isItemInspection": false,
            "isSarinRequest": false,
            "isPreSalvageEstimationOnly": false,
            "isAppraisalInformation": false,
            "isPhotoRequest": false,
        }
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
        //PhotoRequest: { Id: 'false', Description: "", SpecialInstruction: "" },
        //NotesInstruction: ""
    }];

    $scope.ShowGemLabTab = ShowGemLabTab;
    function ShowGemLabTab(index) {
        var currenttab = index + 1;
        $scope.GemlabTab = currenttab;
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

    $scope.AddNewGemLabTab = AddNewGemLabTab;
    function AddNewGemLabTab() {
        var item = $scope.GemLabItemList.length + 1;
        $scope.GemLabItemList.push({
            id: null,
            number: item,
            stoneDetails: [],
            AttachmentList: [],
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
    $scope.changeOrderStatus = changeOrderStatus; 
    function changeOrderStatus(OrderType, Status) {
        var statusParam = {};
        var statusId = null
        if (OrderType == "Shipment" && Status == "Complete") {
            statusId = 16;
        }
        else if (OrderType == "Labor Charges" && Status == "Complete") {
            statusId = 16;
        }
        else if (OrderType == "Pick up from Vendor/Email Label" && Status == "Receive") {
            statusId = 5;
        }
        else if (OrderType == "Order from Vendor" && Status == "Receive") {
            statusId = 9;
        }
        else if (OrderType == "Pick up from Vendor/Email Label" && Status == "Return") {
            statusId = 7;
        }
        else if (OrderType == "Order from Vendor" && Status == "Return") {
            statusId = 11;
        }

        if (statusId != null) {
            statusParam = {
                "id": $scope.OrderDetails.id, // purchase order id
                "status": {
                    "id": statusId // status id
                },
                "orderType": {
                    "id": $scope.OrderDetails.orderType.id // order type id
                }
            };
            var statusDetails = PurchaseOrderService.ChangeOrderStatus(statusParam)
            statusDetails.then(function (success) {
                $location.url("SalesOrders");
                toastr.remove()
                toastr.success(success.data.message, "Confirmation");

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

        //var msg = "";
        //if (angular.isDefined(Status)) {
        //    msg = "Are you sure want to <b>" + Status + "</b> Purchase Order #" + $scope.OrderDetails.id + "?";
        //}      

        //bootbox.confirm({
        //    size: "",
        //    title: "Purchase order action",
        //    message: msg, closeButton: false,
        //    className: "modalcustom", buttons: {
        //        confirm: {
        //            label: "Yes",
        //            className: 'btn-success'
        //        },
        //        cancel: {
        //            label: "No", //$translate.instant('ClaimDetails_Delete.BtnNo'),
        //            className: 'btn-danger'
        //        }
        //    },
        //    callback: function (result) {
        //        if (result) {
        //            var statusParam = {};
        //            var statusId = null
        //            if (OrderType == "Shipment" && Status == "Complete") {
        //                statusId = 16;
        //            }
        //            else if (OrderType == "Labor Charges" && Status == "Complete") {
        //                statusId = 16;
        //            }
        //            else if (OrderType == "Pick up from Vendor/Email Label" && Status == "Receive") {
        //                statusId = 5;
        //            }
        //            else if (OrderType == "Order from Vendor" && Status == "Receive") {
        //                statusId = 9;
        //            }
        //            else if (OrderType == "Pick up from Vendor/Email Label" && Status == "Return") {
        //                statusId = 7;
        //            }
        //            else if (OrderType == "Order from Vendor" && Status == "Return") {
        //                statusId = 11;
        //            }

        //            if (statusId != null) {
        //                statusParam = {
        //                    "id": $scope.OrderDetails.id, // purchase order id
        //                    "status": {
        //                        "id": statusId // status id
        //                    },
        //                    "orderType": {
        //                        "id": $scope.OrderDetails.orderType.id // order type id
        //                    }
        //                };
        //                var statusDetails = PurchaseOrderService.ChangeOrderStatus(statusParam)
        //                statusDetails.then(function (success) {
        //                    $location.url("SalesOrders");
        //                    toastr.remove()
        //                    toastr.success(success.data.message, "Confirmation");

        //                }, function (error) {
        //                    toastr.remove();
        //                    if (angular.isDefined(error.data.errorMessage) && error.data.errorMessage != null) {
        //                        toastr.error(error.data.errorMessage, "Error");
        //                    }
        //                    else {
        //                        toastr.error(AuthHeaderService.genericErrorMessage(), "Error");
        //                    }
        //                });
        //            }
        //        }
        //    }
        //});
         
    };

    $scope.saveOrder = saveOrder;
    function saveOrder() {
        $scope.OrderPackingSlip_ItemList = [];

        if (angular.isDefined($scope.OrderDetails.id) && $scope.OrderDetails.id != null) {
            angular.forEach($scope.OrderDetails.packingSlipDetails.items, function (item) {
                $scope.OrderPackingSlip_ItemList.push({ id: item.id, description: item.description, quantity: item.quantity });
            });
        }
        else {
            var IDVar = 1;
            if (angular.isDefined($scope.OrderDetails.purchaseOrderItems)) {
                $scope.OrderPackingSlip_ItemList.push({ id: IDVar, description: $scope.CommonObj.ItemDescription, quantity: $scope.OrderDetails.purchaseOrderItems[0].availabeQuantity });
            }
            angular.forEach($scope.SelectedPackingSlips, function (slip) {
                IDVar++;
                $scope.OrderPackingSlip_ItemList.push({ id: IDVar, description: slip.attachName, quantity: slip.quantity });
            });
        }
        $scope.savePurchaseOrder();
    };

    $scope.saveOrderForShipment = saveOrderForShipment;
    function saveOrderForShipment() {
        $scope.OrderPackingSlip_ItemList = [];
         
        if (angular.isDefined($scope.OrderDetails.id) && $scope.OrderDetails.id != null) {
            angular.forEach($scope.OrderDetails.packingSlipDetails.items, function (item) {
                $scope.OrderPackingSlip_ItemList.push({ id: item.id, description: item.description, quantity: item.quantity });
            });
        }
        else {
            var IDVar = 1;
            if (angular.isDefined($scope.OrderShipment_ItemList)) {
                angular.forEach($scope.OrderShipment_ItemList, function (item) {
                    IDVar++
                    $scope.OrderPackingSlip_ItemList.push({ id: IDVar, description: item.description, quantity: item.quantity });

                });

            }
            angular.forEach($scope.SelectedPackingSlips, function (slip) {
                IDVar++;
                $scope.OrderPackingSlip_ItemList.push({ id: IDVar, description: slip.attachName, quantity: slip.quantity });
            });
        }

        $scope.savePurchaseOrder();
    };
    $scope.isSarinRequestChanged = isSarinRequestChanged;
    function isSarinRequestChanged(Item) {
        if (Item.purchaseOrderServiceRequest.isSarinRequest == true) {
            Item.purchaseOrderServiceRequest.isApprovalToRemove = false;
        }
    };

    $scope.ChangeBIBStatusWithDetails = ChangeBIBStatusWithDetails;
    function ChangeBIBStatusWithDetails(OrderType, Status) {
        if (OrderType == "BIB from PH" && Status == "Receive") {
            $scope.OrderDetails.status.id = 2;
            $scope.savePurchaseOrder();
        }
        else if (OrderType == "BIB from PH" && Status == "PENDING RETURN") {
            $scope.OrderDetails.status.id = 23;
            $scope.savePurchaseOrder();
        }
    };


    $scope.changeETA = changeETA;
    function changeETA(id) {
        $scope.OrderDetails.eta = "";
        var d = new Date();
        var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        if (id == 1) {
            if (d.getDay() < 4)
                $scope.OrderDetails.eta = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 2).toLocaleDateString();
            else if (days[d.getDay()] == "Thursday" || days[d.getDay()] == "Friday")
                $scope.OrderDetails.eta = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 4).toLocaleDateString();
            else if (days[d.getDay()] == "Saturday")
                $scope.OrderDetails.eta = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 3).toLocaleDateString();
        }
        else if (id == 3 || id == 2) {
            if (d.getDay() < 5)
                $scope.OrderDetails.eta = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).toLocaleDateString();
            else if (days[d.getDay()] == "Friday")
                $scope.OrderDetails.eta = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 3).toLocaleDateString();
            else if (days[d.getDay()] == "Saturday")
                $scope.OrderDetails.eta = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 2).toLocaleDateString();
        }
        else if (id == 4) {
            var first = d.getDate() - d.getDay(); // First day is the day of the month - the day of the week
            var last = first + 6;
            $scope.OrderDetails.eta = new Date(d.setDate(last)).toLocaleDateString();
            //new Date(d.getFullYear(), d.getMonth(), d.getDate() + 2).toLocaleDateString();
        }
    };

    $scope.GetStatusList = GetStatusList;
    function GetStatusList(id) {
        var param = {
            "id": id
        }
        $(".page-spinner-bar").removeClass("hide");
        var getStatusList = PurchaseOrderService.getStatusList(param);
        getStatusList.then(function (success) {
            $scope.ItemStatusList = success.data.data;
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            toastr.remove();
            if (error.data.errorMessage != null && angualr.isDefined(error.data.errorMessage))
                toastr.error(error.data.errorMessage, "Error");
            else
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error");
        });
    };
    $scope.getItemStatus = getItemStatus;
    function getItemStatus(status) {
        var statusId;
        angular.forEach($scope.POStatusList, function (item) {
            if (item.name == status) {
                statusId = item.id
            }
        })
        return (statusId);
    }
});