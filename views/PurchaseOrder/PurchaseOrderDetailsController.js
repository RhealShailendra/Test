angular.module('MetronicApp').controller('PurchaseOrderDetailsController', function ($rootScope, $scope, settings, $location, $translate, $translatePartialLoader,
$filter, AuthHeaderService, PurchaseOrderService, $uibModal) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });

    //set language
    $translatePartialLoader.addPart('AssociateLineItemDetails');
    $translate.refresh();
    $scope.GemLabDemo = {};
    $scope.PageSize = settings.pagesize;
    $scope.UserType = sessionStorage.getItem("RoleList");
    SetInitialOrderDetails();
    $scope.UserName = sessionStorage.getItem("UserLastName") + ", " + sessionStorage.getItem("UserFirstName")
    GetPackingSlipList();
    GetSupplierList();
    $scope.PackingSlipList = [];
    $scope.PaymentTerms;
    $scope.OrderDetails.finaltotalcost = 0;
    $scope.StateList = [];
    $scope.CertificationListEdit = [];
    $scope.InvoiceListEdit = [];
    $scope.MemoListEdit = [];
    $scope.attachemnt = [];
    $scope.currentDate;
    $scope.Orders = [];
    $scope.BIB_with_Gemlab = false;
    $scope.IsJobCost = false;//For Compelted Labor charges
    $scope.statusList = [{ id: true, name: "Yes" }, { id: false, name: "No" }];
    $scope.currentItemId;
    $scope.ItemStatusList = [];
    //$scope.ItemStatusList = [{ Id: 1, Name: "Created" },
    //                      { Id: 2, Name: "Received" },
    //                      { Id: 3, Name: "Partial return" },
    //                      { Id: 4, Name: "Returned" }, ]
    $scope.temp_BIB_Of_GemlabRequest = [];
    $scope.OrigionalGemlabObject = [];
    $scope.GemlabOrederList = [];
    $scope.viewOnlyPurchaseOrder = true;

    function init() {
        //we are hide the create new PO nutton for GEMLAB ADMINISTRATOR
        if (sessionStorage.getItem("RoleList") == "GEMLAB ADMINISTRATOR") {
            $scope.viewOnlyPurchaseOrder = false;
        }
    } init();
    $scope.IntialiseComponent = IntialiseComponent;
    function IntialiseComponent() {
        if ($scope.OrderDetails.orderType.name == 'Gemlab Request') {
            $scope.GemLabItemList = [];
            $(".page-spinner-bar").removeClass("hide");
            angular.element("input[type='file']").val(null);
            $scope.GemLabItemList = [{
                id: null,
                number: 1,
                stoneDetails: [],
                AttachmentList: [],
                itemDescription: angular.isUndefined($scope.CommonObj.ItemDescription) ? "Item Description" : $scope.CommonObj.ItemDescription,
                purchaseOrderServiceRequest: {
                    "isItemInspection": false,
                    "isSarinRequest": false,
                    "isPreSalvageEstimationOnly": false,
                    "isAppraisalInformation": false,
                    "isPhotoRequest": false,
                }
            }];
            $scope.GetGemLabData();           
            //$scope.GemLabDemo.GemlabRequest.$setPristine();
            $scope.OrderDetails.status = { id: 18,status:"CREATED" };
        }

        $scope.ClearAllItemsList();
        SetInitialOrderDetails();
        
        //$rootScope.BIBFormPH.$setUntouched(); 
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

    //Get Policy Details
    var paramPO = {
        "policyNumber": null,
        "claimNumber": $scope.CommonObj.ClaimNumber
    };
    $(".page-spinner-bar").removeClass("hide");
    var GetPolicyHolderDetails = PurchaseOrderService.GetPolicyHolderDetails(paramPO);
    GetPolicyHolderDetails.then(function (success) {
        $(".page-spinner-bar").addClass("hide");
        $scope.PolicyHolderDetails = success.data.data;
        SetInitialOrderDetails();
    }, function (error) {
        toastr.remove();
        toastr.error((error.data) ? error.data.errorMessage : "Failed to get the policy holder details. please try again", "Error");
        $(".page-spinner-bar").addClass("hide");
    });
    function SetInitialOrderDetails() {
        $scope.currentDate = ($filter('TodaysDate')());;//current Date
        $scope.currentTime = $filter('date')(new Date(), 'HH:mm')
        $scope.CommonObj.ItemDescription = $scope.CommonObj.OrigionalItemDescription;
        if (angular.isUndefined($scope.OrderDetails)) {
            $scope.OrderDetails = {
                "orderType": {
                    "name": 'BIB from PH'
                },
                "lineItem": {
                    "itemId": $scope.CommonObj.PurchaseItemId,
                    "itemNumber": $scope.CommonObj.PurchaseItemNumber
                },
                "claim": {
                    "claimId": $scope.CommonObj.PurchaseClaimId,
                    "claimNumber": $scope.CommonObj.ClaimNumber
                },
                "pickupDate": $scope.currentDate
            };
        }
        if (angular.isDefined($scope.PolicyHolderDetails) && $scope.PolicyHolderDetails !== null) {
            $scope.OrderDetails = {
                "orderType": {
                    "name": $scope.OrderDetails.orderType.name
                },
                "lineItem": {
                    "itemId": $scope.CommonObj.PurchaseItemId,
                    "itemNumber": $scope.CommonObj.PurchaseItemNumber
                },
                "claim": {
                    "claimId": $scope.CommonObj.PurchaseClaimId,
                    "claimNumber": $scope.CommonObj.ClaimNumber
                },
                "orderDate": $filter('TodaysDate')(),
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
                "phone": (angular.isDefined($scope.PolicyHolderDetails.policyHolder) && $scope.PolicyHolderDetails.policyHolder !== null) ? $filter('tel')($scope.PolicyHolderDetails.policyHolder.dayTimePhone) : null,
                "email": (angular.isDefined($scope.PolicyHolderDetails.policyHolder) && $scope.PolicyHolderDetails.policyHolder !== null) ? $scope.PolicyHolderDetails.policyHolder.email : null,
                "pickupDate": "",
                "pickupTime":"",
                "receivedDate": "",
                //"eta": $scope.currentDate,
                "arrivalAtDestination": "",
            };
        }
        if (angular.isDefined($scope.OrderDetails.orderType) || $scope.OrderDetails.orderType!= null)
        {
            angular.forEach($scope.OrderTypeList, function (item) {
                if ($scope.OrderDetails.orderType.name == item.name) {
                    
                    GetStatusList(item.id);
                }
            })            
        }
            
    }
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

    $scope.PurchaseOrderAddEdit = false;
    $scope.PackingSlip = false;
    $scope.IsEditOrder = false;
    $scope.IsCompleted = false;
    //Cancel order details view
    $scope.CancelOrderDetails = CancelOrderDetails;
    function CancelOrderDetails() {
        $scope.IsEditOrder = false;
        $scope.PurchaseOrderAddEdit = false;
        $scope.IsCompleted = false;
        SetInitialOrderDetails();
    }

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

    //Get purchase order
    function GetAllPurchaseOrders() {
        $(".page-spinner-bar").removeClass("hide");
        
        var paramId = {};
        var isLineItem = sessionStorage.getItem("isLineItem");
        if (isLineItem=="true") {
            paramId = {
                "lineItem": {
                    "itemId": $scope.OrderDetails.lineItem.itemId
                },
                "claim": {
                    "claimId": $scope.OrderDetails.claim.claimId
                }
            };
        }
        else {
            paramId = {
                "vendorAssignment": {
                    "assignmentNumber": $scope.CommonObj.AssignmentNumber
                }
            };
        }
        var GetOrderList = PurchaseOrderService.GetAllPurchaseOrder(paramId);
        GetOrderList.then(function (success) {
            $scope.Orders = success.data.data;
            if ($scope.Orders !== null) {
                $scope.Orders = $filter('orderBy')($scope.Orders, "createDate", true);
            }
            //var isLineItem = sessionStorage.getItem("isLineItem");
            if (isLineItem == "true") {
               var param ={
                   "lineItem": {
                       "id": $scope.OrderDetails.lineItem.itemId
                   }
                }
            } else {
                var param = {
                    "assignmentNumber": $scope.CommonObj.AssignmentNumber
                }
            }

            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            toastr.remove();
            if (error.data.errorMessage != null && angualr.isDefined(error.data.errorMessage))
                toastr.error(error.data.errorMessage, "Error");
            else
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error");
            $scope.Orders = [];
        });

    }
    GetAllPurchaseOrders();

    //New Purchase order
    $scope.NewPurchaseOrder = NewPurchaseOrder;
    function NewPurchaseOrder() {
        if ($scope.CommonObj.ThisPage == "ClaimDetails") {
            $scope.PurchaseOrderItemPopUp();
        }
        $scope.IsEditOrder = false;
        $scope.PurchaseOrderAddEdit = true;
        $scope.IsCompleted = false;
        $scope.ClearAllItemsList();
        SetInitialOrderDetails();

    }

    //Show Order Details view
    $scope.GotoOrderDetails = GotoOrderDetails;
    function GotoOrderDetails(order) {
        $scope.IsEditOrder = true;
        $scope.PurchaseOrderAddEdit = true;
        if (order.status == 'Completed') {
            $scope.IsCompleted = true;
        }
        else {
            $scope.IsCompleted = false;
        }
    };

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
        $(".page-spinner-bar").removeClass("hide");
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
            if (angular.isDefined($scope.temp_BIB_Of_GemlabRequest)&& $scope.temp_BIB_Of_GemlabRequest!=null) {
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
            }

            var attaches = [];
            var ItemList = [];
            angular.forEach($scope.SelectedPackingSlips, function (attchment) {
                attaches.push({ id: attchment.id });
            });
            angular.forEach($scope.OrderPackingSlip_ItemList, function (item) {
                ItemList.push({ "quantity": item.quantity, "description": item.description });
            });
            
            if (angular.isDefined($scope.temp_BIB_Of_GemlabRequest) && $scope.temp_BIB_Of_GemlabRequest.length >0 && $scope.OrderDetails.isLab == true) {
                var item_Stone_Details = [];
                var temp_Item = [];
                var i = 0;
                var GemlabParam;
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
                GemlabParam = {
                    "id": angular.isUndefined($scope.temp_BIB_Of_GemlabRequest.id) ? null : $scope.temp_BIB_Of_GemlabRequest.id,
                    "assignmentNumber": $scope.temp_BIB_Of_GemlabRequest.assignmentNumber,
                    "claimNumber": $scope.temp_BIB_Of_GemlabRequest.claimNumber,
                    "description": (angular.isUndefined($scope.temp_BIB_Of_GemlabRequest.description) ? null : $scope.temp_BIB_Of_GemlabRequest.description),
                    "lineItem": {
                        "id": (angular.isUndefined($scope.temp_BIB_Of_GemlabRequest.lineItem) ?null : $scope.temp_BIB_Of_GemlabRequest.lineItem.id)
                    },
                    "associate": {
                        "id": (angular.isDefined($scope.temp_BIB_Of_GemlabRequest.associate.id) && $scope.temp_BIB_Of_GemlabRequest.associate !== null ? $scope.temp_BIB_Of_GemlabRequest.associate.id : null)
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
            param.append("purchaseOrder", JSON.stringify(
                {
                    "id": (angular.isDefined($scope.OrderDetails.id)) ? $scope.OrderDetails.id : null,
                    "orderType": {
                        "name": (angular.isDefined($scope.OrderDetails.orderType.name) ? $scope.OrderDetails.orderType.name : null)
                    },
                    "csr": (angular.isDefined($scope.OrderDetails.csr) ? $scope.OrderDetails.csr : sessionStorage.getItem("Name")),
                    "lineItem": {
                        "itemId": (angular.isDefined($scope.OrderDetails.id) ? $scope.OrderDetails.lineItem.itemId : $scope.CommonObj.PurchaseItemId)
                    },
                    "claim": {
                        "claimId": (angular.isDefined($scope.OrderDetails.claim.claimId) ? $scope.OrderDetails.claim.claimId : null)
                    },
                    "vendorAssignment": {
                        "id": $scope.CommonObj.AssignmentId
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
                    "phone": (angular.isDefined($scope.OrderDetails.phone) ? $scope.OrderDetails.phone.replace(/[()-]/g, '').replace(/ /g, '') : null),
                    "email": (angular.isDefined($scope.OrderDetails.email) ? $scope.OrderDetails.email : null),
                    "tracking": (angular.isDefined($scope.OrderDetails.tracking) ? $scope.OrderDetails.tracking : null),
                    "returnTracking": (angular.isDefined($scope.OrderDetails.returnTracking) ? $scope.OrderDetails.returnTracking : null),
                    "specialInstruction": (angular.isDefined($scope.OrderDetails.specialInstruction) ? $scope.OrderDetails.specialInstruction : null),
                    "method": {
                        "id": (angular.isDefined($scope.OrderDetails.method)) ? $scope.OrderDetails.method.id : null
                    },
                    "returnMethod": ((angular.isDefined($scope.OrderDetails.returnMethod) && $scope.OrderDetails.returnMethod != null) ?{ "id": $scope.OrderDetails.returnMethod.id } : null),
                    "pickup": (angular.isDefined($scope.OrderDetails.pickup) ? $scope.OrderDetails.pickup : null),
                    "eta": $filter('DatabaseDateFormatMMddyyyy')($scope.OrderDetails.eta),
                    "pickupDate": $filter('DatabaseDateFormatMMddyyyy')($scope.OrderDetails.pickupDate),
                    "pickupTime": (angular.isDefined($scope.OrderDetails.pickupTime) && ($scope.OrderDetails.pickupTime != null) && ($scope.OrderDetails.pickupTime != "") ? returnDateForEvent(angular.copy($scope.OrderDetails.pickupDate), $scope.OrderDetails.pickupTime) : null),
                    "receivedDate": (angular.isDefined($scope.OrderDetails.receivedDate) ? $filter('DatabaseDateFormatMMddyyyy')($scope.OrderDetails.receivedDate) : null),
                    "shippingCost": (angular.isDefined($scope.OrderDetails.shippingCost) ? $scope.OrderDetails.shippingCost : 0),
                    "submitDate": $filter('DatabaseDateFormatMMddyyyy')((angular.isDefined($scope.OrderDetails.submitDate) && $scope.OrderDetails.submitDate !== null) ? $scope.OrderDetails.submitDate : ($filter('TodaysDate')())),
                    "packingSlip": true,
                    "description": (angular.isDefined($scope.CommonObj.ItemDescription) ? $scope.CommonObj.ItemDescription : null),
                    "isLab": angular.isDefined($scope.OrderDetails.isLab) ? $scope.OrderDetails.isLab : false,
                    "purchaseOrderItems": [{
                        "id": $scope.OrderDetails.purchaseOrderItems[0].id, // id for udpate
                        "quantity": $scope.OrderDetails.purchaseOrderItems[0].availabeQuantity,
                        "description": $scope.CommonObj.ItemDescription//$scope.OrderDetails.purchaseOrderItems[0].description
                    }],
                    "status": {
                        "id": (angular.isDefined($scope.OrderDetails.status) && $scope.OrderDetails.status != null) ? $scope.OrderDetails.status.id : 1
                    },
                    "orderTotalCost": (angular.isDefined($scope.OrderDetails.orderTotalCost) && $scope.OrderDetails.orderTotalCost != null) ? $scope.OrderDetails.orderTotalCost : (angular.isDefined($scope.OrderDetails.shippingCost) ? $scope.OrderDetails.shippingCost : 0),

                    "packingSlipDetails": {
                        "id": (angular.isDefined($scope.OrderDetails.packingSlipDetails)) ? $scope.OrderDetails.packingSlipDetails.id : null,  // mandatory id for update
                        "policyHolder": {
                            "firstName": (angular.isDefined($scope.PolicyHolderDetails.policyHolder) && $scope.PolicyHolderDetails.policyHolder !== null) ? $scope.PolicyHolderDetails.policyHolder.firstName : null,
                            "lastName": (angular.isDefined($scope.PolicyHolderDetails.policyHolder) && $scope.PolicyHolderDetails.policyHolder !== null) ? $scope.PolicyHolderDetails.policyHolder.lastName : null,
                            "email": $scope.OrderDetails.email,
                            "dayTimePhone": $scope.OrderDetails.phone.replace(/[()-]/g, '').replace(/ /g, '')
                        },
                        "purchaseOrderMethod": {
                            "id": (angular.isDefined($scope.OrderDetails.method)) ? $scope.OrderDetails.method.id : null
                        },
                        "attaches": (attaches.length > 0 ? attaches : null),
                        "items": (ItemList.length > 0 ? ItemList : null)
                    },
                    "gemLabRequestPurchaseOrders": GemLabOrder
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
                    "amount": item.amount,
                    "quantity": item.quantity,
                    "sku": item.sku,
                    "si": item.SINo,
                    "unitPrice": item.unitPrice
                });
            });


            param.append("purchaseOrder",
            JSON.stringify({
                "id": (angular.isDefined($scope.OrderDetails.id)) ? $scope.OrderDetails.id : null,
                "orderType": {
                    "name": $scope.OrderDetails.orderType.name
                },
                "description": $scope.CommonObj.ItemDescription,
                "date": $filter('DatabaseDateFormatMMddyyyy')((angular.isDefined($scope.OrderDetails.date) && $scope.OrderDetails.date !== null) ? $scope.OrderDetails.date : ($filter('TodaysDate')())),
                "lineItem": {
                    "itemId": (angular.isDefined($scope.OrderDetails.lineItem.itemId) ? $scope.OrderDetails.lineItem.itemId : $scope.CommonObj.PurchaseItemId)
                },
                "claim": {
                    "claimId": (angular.isDefined($scope.OrderDetails.claim.claimId) ? $scope.OrderDetails.claim.claimId : null)
                },
                "specialInstruction": $scope.OrderDetails.specialInstruction,
                "vendorAssignment": {
                    "id": $scope.CommonObj.AssignmentId
                },
                "csr": (angular.isDefined($scope.OrderDetails.csr) ? $scope.OrderDetails.csr : sessionStorage.getItem("Name")),
                "phName": $scope.OrderDetails.phName,
                "supplier": {
                    "vendorId": $scope.OrderDetails.supplier.vendorId
                },
                "purchaseOrderItems": OrderLbourChargesItemList,
                "specialInstruction": $scope.OrderDetails.specialInstruction,
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
                    "purchaseOrderStatus":{ "id" : getItemStatus(item.status) }
                });
                $scope.OrderDetails.orderTotalCost += item.totalcost;
            });
            param.append("purchaseOrder",
         JSON.stringify({
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
                 "id": $scope.CommonObj.AssignmentId
             },
             "csr": (angular.isDefined($scope.OrderDetails.csr) ? $scope.OrderDetails.csr : sessionStorage.getItem("Name")),
             "phName": $scope.OrderDetails.phName,
             "supplier": {
                 "vendorId": $scope.OrderDetails.supplier.vendorId
             },
             "description": (angular.isDefined($scope.CommonObj.ItemDescription) ? $scope.CommonObj.ItemDescription : null),
             "confirmation": $scope.OrderDetails.confirmation,
             "shippingCost": (angular.isDefined($scope.OrderDetails.shippingCost) && $scope.OrderDetails.shippingCost !== null) ? $scope.OrderDetails.shippingCost : null,
             "tracking": (angular.isDefined($scope.OrderDetails.tracking) && $scope.OrderDetails.tracking !== null) ? $scope.OrderDetails.tracking : null,
             "eta": $filter('DatabaseDateFormatMMddyyyy')($scope.OrderDetails.eta),
             "specialInstruction": $scope.OrderDetails.specialInstruction,
             "method": {
                 "id": (angular.isDefined($scope.OrderDetails.method) && $scope.OrderDetails.method!==null) ? $scope.OrderDetails.method.id : null
             },
             "memo": (angular.isDefined($scope.OrderDetails.memo) && $scope.OrderDetails.memo !== null) ? $scope.OrderDetails.memo : null,
             "invoiceNumber": (angular.isDefined($scope.OrderDetails.invoiceNumber) && $scope.OrderDetails.invoiceNumber !== null) ? $scope.OrderDetails.invoiceNumber: null,            
             "receivedDate": (angular.isDefined($scope.OrderDetails.receivedDate) && $scope.OrderDetails.receivedDate != null ? $filter('DatabaseDateFormatMMddyyyy')($scope.OrderDetails.receivedDate) : null), //(angular.isDefined($scope.OrderDetails.receivedDate) && $scope.OrderDetails.receivedDate !== null) ? $scope.OrderDetails.receivedDate : null,
             "purchaseOrderItems": OrderFormItemList,
             "status": {
                 "id": (angular.isDefined($scope.OrderDetails.status) && $scope.OrderDetails.status != null) ? $scope.OrderDetails.status.id : 1
             },
             "orderTotalCost": (angular.isDefined($scope.OrderDetails.orderTotalCost) && $scope.OrderDetails.orderTotalCost != null) ? $scope.OrderDetails.orderTotalCost : totalAmountFromVendor,
             "certification": (angular.isDefined($scope.OrderDetails.certification) && $scope.OrderDetails.certification !== null) ? $scope.OrderDetails.certification : null
         }
          ));

            $scope.List = [];
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
            if ($scope.InvoiceList.length == 0 && $scope.CertificationList.length == 0 && $scope.MemoList.length == 0)
            {
                param.append('file',null);
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
                        "id": (angular.isDefined($scope.temp_BIB_Of_GemlabRequest.associate) && $scope.temp_BIB_Of_GemlabRequest.associate!==null ? $scope.temp_BIB_Of_GemlabRequest.associate.id : null)
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
                    "si": item.SINo,
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
                        "id": $scope.CommonObj.AssignmentId
                    },
                    "csr": (angular.isDefined($scope.OrderDetails.csr) ? $scope.OrderDetails.csr : sessionStorage.getItem("Name")),
                    "phName": $scope.OrderDetails.phName,
                    "supplier": {
                        "vendorId": $scope.OrderDetails.supplier.vendorId
                    },
                    "description": (angular.isDefined($scope.CommonObj.ItemDescription) ? $scope.CommonObj.ItemDescription : null),
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
            $scope.OrderDetails.orderTotalCost = 0.00;
            angular.forEach($scope.OrderShipment_ItemList, function (item) {
                $scope.OrderDetails.orderTotalCost += parseFloat(item.amount);
                ShipemntItems.push({
                    "id": item.id,
                    "quantity": item.quantity,
                    "description": item.description,
                    "amount": item.amount,
                    "sku": item.SKU,
                    "saleTax": item.saleTax,
                    "unitPrice": item.unitPrice
                });
            });
            $scope.OrderDetails.orderTotalCost += parseInt($scope.OrderDetails.shippingCost);

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
                    "id": $scope.CommonObj.AssignmentId
                },
                "description":(angular.isDefined($scope.CommonObj.ItemDescription)?$scope.CommonObj.ItemDescription:null),
                "csr": (angular.isDefined($scope.OrderDetails.csr) ? $scope.OrderDetails.csr : sessionStorage.getItem("Name")),
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
                "email":  (angular.isDefined($scope.OrderDetails.email) ? $scope.OrderDetails.email : null),
                "tracking": (angular.isDefined($scope.OrderDetails.tracking) ? $scope.OrderDetails.tracking : null),
                "receivedDate": (angular.isDefined($scope.OrderDetails.receivedDate) ? $filter('DatabaseDateFormatMMddyyyy')($scope.OrderDetails.receivedDate) : null),
                "returnTracking": (angular.isDefined($scope.OrderDetails.returnTracking) ? $scope.OrderDetails.returnTracking : null),
                "eta":(angular.isDefined($scope.OrderDetails.eta) ?$filter('DatabaseDateFormatMMddyyyy')($scope.OrderDetails.eta):null),
                "shippingCost": (angular.isDefined($scope.OrderDetails.shippingCost) ? $scope.OrderDetails.shippingCost : 0),
                "specialInstruction": (angular.isDefined($scope.OrderDetails.specialInstruction) ? $scope.OrderDetails.specialInstruction : null),
                "method": {
                    "id": (angular.isDefined($scope.OrderDetails.method)) ? $scope.OrderDetails.method.id : null
                },
                "returnMethod": ((angular.isDefined($scope.OrderDetails.returnMethod) && $scope.OrderDetails.returnMethod != null) ?
                { "id": $scope.OrderDetails.returnMethod.id } : null),
                "arrivalAtDestination": (angular.isDefined($scope.OrderDetails.arrivalAtDestination) ? $filter('DatabaseDateFormatMMddyyyy')($scope.OrderDetails.arrivalAtDestination) : null),
                "packingSlip": true,
                "purchaseOrderItems": ((ShipemntItems.length>0) && ShipemntItems!=null?ShipemntItems:null),
                "status": {
                    "id": (angular.isDefined($scope.OrderDetails.status) && $scope.OrderDetails.status != null) ? $scope.OrderDetails.status.id : 1
                },
                "orderTotalCost": (angular.isDefined($scope.OrderDetails.orderTotalCost) && $scope.OrderDetails.orderTotalCost != null) ? $scope.OrderDetails.orderTotalCost : $scope.OrderDetails.shippingCost,
                "packingSlipDetails": {
                    "id": (angular.isDefined($scope.OrderDetails.packingSlipDetails)) ? $scope.OrderDetails.packingSlipDetails.id : null,  // mandatory id for update
                    "policyHolder": {
                        "firstName": (angular.isDefined($scope.PolicyHolderDetails.policyHolder) && $scope.PolicyHolderDetails.policyHolder !== null) ? $scope.PolicyHolderDetails.policyHolder.firstName : null,
                        "lastName": (angular.isDefined($scope.PolicyHolderDetails.policyHolder) && $scope.PolicyHolderDetails.policyHolder !== null) ? $scope.PolicyHolderDetails.policyHolder.lastName : null,
                        "email": $scope.OrderDetails.email,
                        "dayTimePhone": $scope.OrderDetails.phone.replace(/[()-]/g, '').replace(/ /g, '')
                    },
                    "purchaseOrderMethod": {
                        "id": (angular.isDefined($scope.OrderDetails.method)) ? $scope.OrderDetails.method.id : null
                    },                 
                    "attaches": attaches.length>0?attaches:null,
                    "items": ItemList.length>0?ItemList:null
                }
            }));
            param.append('filesDetails', null);
            param.append('file', null);
        }
        //Add/Edit PO Common function used for all types
        var TypeList = PurchaseOrderService.SaveBoxInBox(param);
        TypeList.then(function (success) {
            if ($scope.OrderDetails.orderType.name == "BIB from PH" && $scope.OrderDetails.isLab == true && angular.isDefined($scope.OrderDetails.id)) {
                var param_Notification = {
                    "assignmentNumber": $scope.CommonObj.AssignmentId,
                    "claimNumber": $scope.CommonObj.ClaimNumber,
                    "receiverId": 23,
                    "purchaseOrderId": $scope.OrderDetails.id
                }
                var Notification = PurchaseOrderService.sendNotification_admin(param_Notification);
                $(".page-spinner-bar").addClass("hide");
                Notification.then(function (sucess) {
                    //alert("Gemlab Update Notification Send sucessfully");
                }, function (error) {
                    $(".page-spinner-bar").addClass("hide");
                });

            }
            $scope.CommonObj.ItemDescription = $scope.CommonObj.OrigionalItemDescription;
            GetAllPurchaseOrders();
            $scope.PurchaseOrderAddEdit = false;
            $scope.IsEditOrder = false;
            $scope.PackingSlip = false;
            $scope.ClearAllItemsList();
            toastr.remove()
            toastr.success((success.data.message !== null) ? success.data.message : "Order details saved successfully.", "Confirmation");
        }, function (error) {
            toastr.remove()
            toastr.error((error.data) ? error.data.message : "Failed to saved the order details.", "Error");
        });
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
    function RemoveAttachment(index,Item) {
        if (Item.AttachmentList.length > 0) {
            Item.AttachmentList.splice(index, 1);
        }
    };
    //End File Upload Attachment

    $scope.Save_PO_GemblabRequest = Save_PO_GemblabRequest;
    function Save_PO_GemblabRequest() {
        $(".page-spinner-bar").removeClass("hide");
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

        $scope.stoneDetails = JSON.parse(angular.toJson($scope.stoneDetails));
        var item_purchaseOrder_ServiceRequest = {};
        var item_Stone_Details = [];
        if ($scope.GemLabItemList.length > 0) {
            angular.forEach($scope.GemLabItemList, function (item) {
                item.itemDescription = angular.isUndefined(item.ItemDescription) || item.itemDescription=="" ? $scope.CommonObj.ItemDescription : item.itemDescription;
                item.quantity = item.quantity;
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
            "id": (angular.isDefined($scope.OrderDetails.id) ? $scope.OrderDetails.id : null),
            //"csr": (angular.isDefined($scope.OrderDetails.csr) ? $scope.OrderDetails.csr : sessionStorage.getItem("Name")),
            "assignmentNumber": (angular.isDefined($scope.OrderDetails.assignmentNumber) ? $scope.OrderDetails.assignmentNumber : $scope.CommonObj.AssignmentNumber),
            "claimNumber": (angular.isDefined($scope.temp_BIB_Of_GemlabRequest.ClaimNumber) ? $scope.temp_BIB_Of_GemlabRequest.ClaimNumber : $scope.CommonObj.ClaimNumber),
            "description": (angular.isUndefined($scope.CommonObj.ItemDescription) ? null : $scope.CommonObj.ItemDescription),
            "lineItem": {
                "id": (angular.isDefined($scope.OrderDetails.lineItem) ? (angular.isDefined($scope.OrderDetails.lineItem.id) ? $scope.OrderDetails.lineItem.id : angular.isDefined($scope.CommonObj.PurchaseItemId) ? $scope.CommonObj.PurchaseItemId : null) : null)
            },
            "associate": {
                "id": (angular.isDefined($scope.temp_BIB_Of_GemlabRequest.associate) && $scope.temp_BIB_Of_GemlabRequest.associate!=null ? $scope.temp_BIB_Of_GemlabRequest.associate.id : 4),
            },
            "orderType": {
                "id": (angular.isDefined($scope.temp_BIB_Of_GemlabRequest.orderType) ? $scope.temp_BIB_Of_GemlabRequest.orderType.id : 6),
            },
            "purchaseOrderStatus": {
                "id": (angular.isDefined($scope.OrderDetails.status) && $scope.OrderDetails.status != null) ? $scope.OrderDetails.status.id : 18
            },
            "itemDetails": JSON.parse(angular.toJson($scope.GemLabItemList))
        };
        param.append("purchaseOrder", JSON.stringify(Gemlabparam));
        if (angular.isDefined($scope.OrderDetails.isLab) && $scope.OrderDetails.isLab == true) {
            $scope.temp_BIB_Of_GemlabRequest = Gemlabparam;
            $scope.OrigionalGemlabObject = angular.copy($scope.temp_BIB_Of_GemlabRequest)
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
                $(".page-spinner-bar").addClass("hide");
                toastr.success((success.data.message !== null) ? success.data.message : "Order details saved successfully.", "Confirmation");
            }, function (error) {
                $(".page-spinner-bar").addClass("hide");
                toastr.remove()
                toastr.error((error.data) ? error.data.message : "Failed to saved the order details.", "Error");
            });
        }
    }

    //Labour charges
    $scope.NewItemLbourCharges = false;
    $scope.OrderLbourCharges_ItemList = [];
    $scope.selectedLbourCharges = {};

    $scope.getTemplateLbourCharges = function (item) {
        if (!angular.isUndefined(item)) {
            if (item.SINo === $scope.selectedLbourCharges.SINo)
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
            $scope.OrderLbourCharges_ItemList.push({
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
            CalculateTotalOrderFromvendor
        }
            //else if (operationFlag != 0 && operationType == "Remove") {
        else if (operationType == "Remove") {
            $scope.OrderFromvendor_ItemList.splice(operationFlag, 1);
            CalculateTotalOrderFromvendor();
        }
        else if (operationType == "Cancel") {
            $scope.NewItemOrderFromvendor = false;
            $scope.selectedOrderFromvendor = {};
            CalculateTotalOrderFromvendor
        }
        $scope.selectedOrderFromvendor = {};
    }

    $scope.AddNewOrderFromvendorItem = AddNewOrderFromvendorItem;
    function AddNewOrderFromvendorItem() {
        $scope.selectedOrderFromvendor = {};
        $scope.selectedOrderFromvendor.SINo = $scope.OrderFromvendor_ItemList.length + 1;
        $scope.NewItemOrderFromvendor = true;
        $scope.EditPaymentTerm = false;
    }

    $scope.EditOrderFromvendorItem = EditOrderFromvendorItem;
    function EditOrderFromvendorItem(item) {
        $scope.selectedOrderFromvendor = angular.copy(item);
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
        $scope.selectedPickUpFromVendor.SINo = $scope.OrderPickUpFromVendor_ItemList.length + 1;
        $scope.NewItemPickUpFromVendor = true;
        // $scope.EditPaymentTerm = false;
    }

    $scope.EditPickUpFromVendorItem = EditPickUpFromVendorItem;
    function EditPickUpFromVendorItem(item) {

        $scope.selectedPickUpFromVendor = angular.copy(item);
        $scope.CalculateTotalPickUpFromVendor();
    }

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
    $scope.VendorListDDL = [];
    $scope.GetSupplierList =GetSupplierList;
    function GetSupplierList()
    {
        $(".page-spinner-bar").removeClass("hide");
            $scope.VendorListDDL = [];
            var Vendors = PurchaseOrderService.GetVendorList();
            Vendors.then(function (success) {
                $scope.VendorListDDL = success.data.data;
                $(".page-spinner-bar").addClass("hide");
            }, function (error) {
                toastr.remove()
                toastr.error((error.data) ? success.data.message : AuthHeaderService.genericErrorMessage(), "Error");
                $(".page-spinner-bar").addClass("hide");
            });
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
                backdrop: 'static',
                keyboard: false,

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
    

    //Cancel PO order
    $scope.CancelPurchaseOrder = CancelPurchaseOrder;
    function CancelPurchaseOrder() {
        $scope.PurchaseOrderAddEdit = false;
    }

    //Edit PO
    $scope.EditPurchaseOrder = EditPurchaseOrder;
    function EditPurchaseOrder(item) {
        angular.element("input[type='file']").val(null);
        $scope.ClearAllItemsList();
        $(".page-spinner-bar").removeClass("hide");

        if (item.orderType.name == "Gemlab Request")
        {
            $scope.GetGemLabData();
            var paramId = {
                "id": item.id
            };
            var GetDetails = PurchaseOrderService.GemlabOrderDetails(paramId);
            GetDetails.then(function (success) {
                $scope.OrderDetails = success.data.data;
                $scope.OrderDetails.phName = $scope.OrderDetails.policyHolder.firstName + ", " + $scope.OrderDetails.policyHolder.lastName;
                if ($scope.OrderDetails.vendorContact != null) {
                    $scope.OrderDetails.csr = angular.isDefined($scope.OrderDetails.vendorContact) && $scope.OrderDetails.vendorContac != null ? $scope.OrderDetails.vendorContact.lastName + ", " + $scope.OrderDetails.vendorContact.firstName : null;
                } else {
                    $scope.OrderDetails.csr = angular.isDefined($scope.OrderDetails.vendorAssociate) && $scope.OrderDetails.vendorAssociate != null ? $scope.OrderDetails.vendorAssociate.lastName + ", " + $scope.OrderDetails.vendorAssociate.firstName : null;
                }
                $scope.OrderDetails.status = { id: "", status: "" };
                $scope.OrderDetails.status.id = angular.isDefined($scope.OrderDetails.purchaseOrderStatus) ? (angular.isDefined($scope.OrderDetails.purchaseOrderStatus.id) ? $scope.OrderDetails.purchaseOrderStatus.id : null) : null
                $scope.OrderDetails.status.status = angular.isDefined($scope.OrderDetails.purchaseOrderStatus) ? (angular.isDefined($scope.OrderDetails.purchaseOrderStatus.name) ? $scope.OrderDetails.purchaseOrderStatus.name : null) : null
                //$scope.OrderDetails.status = angular.isDefined($scope.OrderDetails.purchaseOrderStatus)?$scope.OrderDetails.purchaseOrderStatus:null
                
                //$scope.OrderDetails.csr = sessionStorage.getItem("Name");
                $scope.OrderDetails.orderDate = (angular.isDefined($scope.OrderDetails.createDate) && $scope.OrderDetails.createDate != null) ? ($filter('DateFormatMMddyyyy')($scope.OrderDetails.createDate)) : (null);
                $scope.GemLabItemList = [];
                var tempNumber = 1;
                angular.forEach($scope.OrderDetails.itemDetails, function (item) {
                    var SINo = 1;
                    $scope.tempStoneDetails = [];
                    if (angular.isDefined(item.stoneDetails))
                    {
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
                    }
                    else
                    {
                        $scope.tempStoneDetails = [];
                    }

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
                $scope.GemlabTab = 1;
                $scope.PurchaseOrderAddEdit = true;
                $scope.IsEditOrder = true;
                $scope.OrderDetails.date = (angular.isDefined($scope.OrderDetails.createDate) && $scope.OrderDetails.createDate != null) ? ($filter('DateFormatMMddyyyy')($scope.OrderDetails.createDate)) : ($filter('TodaysDate')());
                $scope.OrderDetails.claim = {
                    claimNumber :$scope.OrderDetails.claimNumber
                }
                $scope.CommonObj.ItemDescription = $scope.OrderDetails.itemDetails[0].itemDescription;
                $scope.OrderDetails.phName = $scope.OrderDetails.phName;
                $(".page-spinner-bar").addClass("hide");
            }, function (error) {
                $scope.PurchaseOrderAddEdit = false;
                $scope.IsEditOrder = false;
                toastr.remove()
                toastr.error((error.data) ? error.data.errorMessage : "Failed to get the order details.", "Error");
                $(".page-spinner-bar").addClass("hide");
            });
        }
        else {
            var paramId = {
                "id": item.id
            };
            var GetDetails = PurchaseOrderService.GetPurchaseOrderDetails(paramId);
            GetDetails.then(function (success) {
                $scope.OrderDetails = success.data.data[0];
                //For all the order
                $scope.OrderDetails.date = (angular.isDefined($scope.OrderDetails.date) && $scope.OrderDetails.date != null) ? ($filter('DateFormatMMddyyyy')($scope.OrderDetails.date)) : ($filter('TodaysDate')());
                $scope.OrderDetails.arrivalAtDestination = (angular.isDefined($scope.OrderDetails.arrivalAtDestination) && $scope.OrderDetails.arrivalAtDestination != null) ? ($filter('DateFormatMMddyyyy')($scope.OrderDetails.arrivalAtDestination)) : null
                $scope.OrderDetails.eta = (angular.isDefined($scope.OrderDetails.eta) && $scope.OrderDetails.eta != null) ? ($filter('DateFormatMMddyyyy')($scope.OrderDetails.eta)) : null
                $scope.OrderDetails.createDate = (angular.isDefined($scope.OrderDetails.createDate) && $scope.OrderDetails.createDate != null) ? ($filter('DateFormatMMddyyyy')($scope.OrderDetails.createDate)) : (null);
                $scope.OrderDetails.pickupDate = ((angular.isDefined($scope.OrderDetails.pickupDate) && $scope.OrderDetails.pickupDate != null && $scope.OrderDetails.pickupDate != "") ? $filter('DateFormatMMddyyyy')($scope.OrderDetails.pickupDate) : null);
                $scope.OrderDetails.receivedDate = (angular.isDefined($scope.OrderDetails.receivedDate) && $scope.OrderDetails.receivedDate != null) ? ($filter('DateFormatMMddyyyy')($scope.OrderDetails.receivedDate)) : null
                $scope.OrderDetails.submitDate = (angular.isDefined($scope.OrderDetails.submitDate) && $scope.OrderDetails.submitDate != null) ? ($filter('DateFormatMMddyyyy')($scope.OrderDetails.submitDate)) : null
                $scope.OrderDetails.dateOrdered = (angular.isDefined($scope.OrderDetails.dateOrdered) && $scope.OrderDetails.dateOrdered != null) ? ($filter('DateFormatMMddyyyy')($scope.OrderDetails.dateOrdered)) : null
                if ($scope.OrderDetails.orderType.name == "BIB from PH") {
                    $scope.OrderDetails.phone = $filter('tel')($scope.OrderDetails.phone);
                    $scope.CommonObj.ItemDescription = $scope.OrderDetails.purchaseOrderItems[0].description;
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
                    $scope.CommonObj.ItemDescription = $scope.OrderDetails.description;                   
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
                            $scope.OrderPickUpFromVendor_ItemList.push({ id: item.id, SINo: item.si, sku: item.sku, description: item.description, quantity: item.availabeQuantity, unitPrice: item.unitPrice, amount: item.amount, status: angular.isUndefined(item.purchaseOrderStatus) ? "CREATED" : item.purchaseOrderStatus.status });
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
                    $scope.CommonObj.ItemDescription = $scope.OrderDetails.description;
                    angular.forEach($scope.OrderDetails.purchaseOrderItems, function (item) {
                        id++;
                        $scope.OrderLbourCharges_ItemList.push({ id: item.id, SINo: item.si, sku: item.sku, unitPrice: item.unitPrice, amount: item.amount, quantity: item.availabeQuantity, status: 'true' });
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
                            $scope.OrderFromvendor_ItemList.push({ id: item.id, sku: item.sku, description: item.description, quantity: item.availabeQuantity, unitprice: item.unitPrice, tax: item.saleTax, totalcost: item.amount, status: angular.isUndefined(item.purchaseOrderStatus) ? "CREATED" : item.purchaseOrderStatus.status, SINo: item.si });
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
                        $scope.CommonObj.ItemDescription = item.itemDescription;
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
                $scope.PurchaseOrderAddEdit = false;
                $scope.IsEditOrder = false;
                toastr.remove()
                toastr.error((error.data) ? error.data.errorMessage : "Failed to get the order details.", "Error");
                $(".page-spinner-bar").addClass("hide");
            });
        }
        
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
                backdrop: 'static',
                keyboard: false,
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

                $scope.OrderDetails.lineItem.itemId = value.id;
                $scope.CommonObj.PurchaseItemId = value.id;
                $scope.CommonObj.PurchaseItemNumber = value.itemNumber;
                $scope.CommonObj.ItemDescription = value.description;
                $scope.CommonObj.OrigionalItemDescription = value.description;
                SetInitialOrderDetails();

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
        var msg = "";
        if (angular.isDefined($scope.OrderDetails.id)) {
            msg = "Are you sure want to cancel the purchase order #" + $scope.OrderDetails.id + "?";
        }
        else {
            msg = "Are you sure want to cancel the purchase order";
        }


        bootbox.confirm({
            size: "",
            title: "Delete purchase order",
            message: msg, closeButton: false,
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
                    if (angular.isDefined($scope.OrderDetails.id) && $scope.OrderDetails.id != null && $scope.OrderDetails.id > 0) {
                        var paramId = [{
                            "id": $scope.OrderDetails.id
                        }];
                        var CancelOrders = PurchaseOrderService.CancelPurchaseOrder(paramId);
                        CancelOrders.then(function (success) {
                            GetAllPurchaseOrders();
                            $scope.PurchaseOrderAddEdit = false;
                            $scope.IsEditOrder = false;
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
                }
            }
        });
       
    }

    $scope.ChangeOrderStatus = ChangeOrderStatus;
    function ChangeOrderStatus() {
        $scope.Form.$setPristine();
    }

    $scope.ReturnOrder = ReturnOrder;
    function ReturnOrder() {
    }

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

    $scope.CalculateTotalOrderFromvendor = CalculateTotalOrderFromvendor;
    function CalculateTotalOrderFromvendor() {  
        if (angular.isDefined($scope.selectedOrderFromvendor)) {
                $scope.OrderDetails.orderTotalCost = 0.00;
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

            $scope.OrderDetails.orderTotalCost = 0.00;
            angular.forEach($scope.OrderFromvendor_ItemList, function (item) {
                item.totalcost = 0.00;
                item.totalcost = item.totalcost + (parseFloat(angular.isDefined(item.unitprice) && item.unitprice != "" ? item.unitprice : 0)) * (parseInt(angular.isDefined(item.quantity) && item.quantity != "" ? item.quantity : 0));
                var taxAmount = (parseFloat(angular.isDefined(item.tax) && item.tax !== "" ? item.tax : 0) / 100) * item.totalcost;
                item.totalcost = item.totalcost + taxAmount;
                $scope.OrderDetails.orderTotalCost = $scope.OrderDetails.orderTotalCost + item.totalcost;
            });
        }

        $scope.OrderDetails.orderTotalCost=$filter('currency')($scope.OrderDetails.orderTotalCost);
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
            if (angular.isDefined($scope.temp_BIB_Of_GemlabRequest.itemDetails) && $scope.temp_BIB_Of_GemlabRequest.itemDetails != null)
            {
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

    $scope.VendorCompanyDetails = {};

    $scope.GoToPackingSlipFromShipment = GoToPackingSlipFromShipment;
    function GoToPackingSlipFromShipment() {
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

    $scope.ClearAllItemsList = ClearAllItemsList;
    function ClearAllItemsList() {
        angular.element("input[type='file']").val(null);
        $scope.CertificationListEdit = [];
        $scope.InvoiceListEdit = [];
        $scope.MemoListEdit = [];
        $scope.CertificationList = [];
        $scope.InvoiceList = [];
        $scope.MemoList = [];
        $scope.LaborCostWorkDetails = [];
        $scope.SelectedPackingSlips = [];
        $scope.OrderShipment_ItemList = [];
        $scope.OrderLbourCharges_ItemLis = [];
        $scope.OrderFromvendor_ItemList = [];
        $scope.OrderPickUpFromVendor_ItemList = [];
        $scope.OrderPackingSlip_ItemList = [];
        $scope.ReturnPurchaseOrder = [];
        $scope.GemLabItemList = [{
            id: null,
            number: 1,
            stoneDetails: [],
            AttachmentList:[],
            itemDescription: angular.isUndefined($scope.CommonObj.ItemDescription) ? "Item Description" : $scope.CommonObj.ItemDescription,
            purchaseOrderServiceRequest: {
                //"isItemInspection": false,
                //"isSarinRequest": false,
                "isPreSalvageEstimationOnly": false,
                "isAppraisalInformation": false,
                "isPhotoRequest": false,
            }
        }];
        $scope.temp_BIB_Of_GemlabRequest = [];
        $scope.OrderLbourCharges_ItemList = [];
        $scope.OrderPickUpFromVendor_ItemList = [];
        //id: 4,attachName: "Return Box"
        
        angular.forEach($scope.PackingSlipList, function (slip) {
            slip.IsChecked = false;
        });

        if ($scope.OrderDetails.orderType.name == "BIB from PH") {
            angular.forEach($scope.PackingSlipList, function (slip) {
                if (slip.id == 4) {
                    slip.IsChecked = true;
                }
            });
        }
    };

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
        itemDescription: angular.isUndefined($scope.CommonObj.ItemDescription) ? null : $scope.CommonObj.ItemDescription,
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
            item.itemDescription = $scope.CommonObj.ItemDescription;
        });
        $scope.GemlabTab = 1;
    };
    $scope.AddNewGemLabTab = AddNewGemLabTab;
    function AddNewGemLabTab() {
        var item = $scope.GemLabItemList.length + 1;
        $scope.GemLabItemList.push({
            id: null,
            number: item,
            itemDescription: $scope.CommonObj.ItemDescription,
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

    //get StateList 
    var stateparam =
       {
           "isTaxRate": false,
           "isTimeZone": false
       };

    var getstate = PurchaseOrderService.getStates(stateparam);
    getstate.then(function (success) { $scope.StateList = success.data.data; }, function (error) { });
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

    $scope.SaveItemReturn = function () {
        $scope.$broadcast('SaveItemReturn', { message: 'test' });

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
    };

    $scope.CancelItemReturn = CancelItemReturn;
    function CancelItemReturn() {
        $scope.EditPurchaseOrder($scope.OrderDetails);
        $scope.PreviousPOType = $scope.OrderDetails.orderType.name;
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
                    AttachmentList:[],
                    AttachmentEditList: item.attachments,
                });
                tempNumber++;
            })
            $scope.temp_BIB_Of_GemlabRequest.itemDetails = $scope.GemLabItemList;
            $scope.OrderDetails = $scope.temp_BIB_Of_GemlabRequest;
            $scope.OrderDetails.claim = $scope.BIB_Param.claim;
            $scope.OrderDetails.lineItem = $scope.BIB_Param.lineItem
            if ($scope.temp_BIB_Of_GemlabRequest.vendorContact != null) {
                $scope.OrderDetails.csr = angular.isDefined($scope.temp_BIB_Of_GemlabRequest.vendorContact) && $scope.temp_BIB_Of_GemlabRequest.vendorContac != null ? $scope.temp_BIB_Of_GemlabRequest.vendorContact.lastName + ", " + $scope.temp_BIB_Of_GemlabRequest.vendorContact.firstName : null;
            } else {
                $scope.OrderDetails.csr = angular.isDefined($scope.temp_BIB_Of_GemlabRequest.vendorAssociate) && $scope.temp_BIB_Of_GemlabRequest.vendorAssociate != null ? $scope.temp_BIB_Of_GemlabRequest.vendorAssociate.lastName + ", " + $scope.temp_BIB_Of_GemlabRequest.vendorAssociate.firstName : null;
            }
            //$scope.OrderDetails.csr = $scope.BIB_Param.csr
            $scope.OrderDetails.phName = $scope.BIB_Param.phName
            $scope.OrderDetails.orderDate = (angular.isDefined($scope.BIB_Param.orderDate) && $scope.BIB_Param.orderDate != null) ? ($filter('DateFormatMMddyyyy')($scope.BIB_Param.orderDate)) : (null);
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
                AttachmentList: [],
                itemDescription: angular.isUndefined($scope.CommonObj.ItemDescription) ? null : $scope.CommonObj.ItemDescription,
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
    $scope.isSarinRequestChanged = isSarinRequestChanged;
    function isSarinRequestChanged(Item) {
        if (Item.purchaseOrderServiceRequest.isSarinRequest == "true") {
            Item.purchaseOrderServiceRequest.isSarinRequest = true;
            Item.purchaseOrderServiceRequest.isApprovalToRemove = false;
        } else {
            Item.purchaseOrderServiceRequest.isSarinRequest = false;
        }
    };

    $scope.ShowAddSupplierPopup = ShowAddSupplierPopup;
    function ShowAddSupplierPopup() {
        if (angular.isDefined($scope.statelist) && $scope.statelist.length > 0)
        {
            var objState = $scope.statelist;
            var out = $uibModal.open(
            {
                animation: $scope.animationsEnabled,
                templateUrl: "views/VendorSupplier/AddSupplierOnTheFly.html",
                controller: "AddSupplierOnTheFlyController",
                backdrop: 'static',
                keyboard: false,
                resolve:
                {
                    objState: function () {
                       
                        return objState;
                    }
                }

            });
            out.result.then(function (value) {          
                if (value === "Success") {
                    $scope.GetSupplierList();
                }
            }, function (res) {            
            });
            return {
                open: open
            };
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
    
    $scope.ChangeJobCost = ChangeJobCost;
    function ChangeJobCost(param,val)
    {
        var origionalVal = val;

        if(param=='Cancel')
        {
            if (angular.isUndefined(val) || val == "") {
                val = 0;
            }
            
            $scope.IsJobCost = false;
        }
        else if (param == '1')
        {
            if (angular.isUndefined(val)|| val == "") {
                val = 0;
            }
            $scope.IsJobCost = true;
        }
        else if (param == '0') {
            if (angular.isUndefined(val) || val == "")
            {
                val = 0;
            }
            $scope.IsJobCost = false;
        }
    }

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
    $scope.GetStatusList = GetStatusList;
    function getItemStatus(status) {
        var statusId = 1;
        angular.forEach($scope.ItemStatusList, function (item) {
            if (item.name == status) {
                statusId = item.id
            }
        })
        return (statusId);
    }

});