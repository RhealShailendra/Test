angular.module('MetronicApp').controller('ItemReturnController', function ($rootScope, $uibModal,
    $scope, $location, $translate,$filter, $translatePartialLoader, PurchaseOrderService, AuthHeaderService) {

    $translatePartialLoader.addPart('OrdersDetails');
    $translate.refresh();

    $scope.message = "This is item return page";

   
    function init() {
        $scope.ReturnItemList = [];
        $scope.ReturnOrder = {
            TotalQunatity: 0,
            TotalCost: 0,
            RestockingFee: 0,
            CreaditDue: 0,
            RestockingFeePer:0
           
        };
        getPurchaseOrderReturnItems();
        $scope.selectedReturnItem = {};
        $scope.NewReturnCharge = false;
    };
    init();
   
    $scope.getPurchaseOrderReturnItems = getPurchaseOrderReturnItems;
    function getPurchaseOrderReturnItems()
    {
       
        if ($scope.EditItemReturn == true)
        {
            //$scope.ReturnPurchaseOrder = $scope.ReturnPurchaseOrder[0];
            $scope.OrderDetails.arrivalAtDestination = (angular.isDefined($scope.EditReturnDetails.arrivalDestination) && $scope.EditReturnDetails.arrivalDestination != null) ? ($filter('DateFormatMMddyyyy')($scope.EditReturnDetails.arrivalDestination)) : null;
            $scope.ReturnOrder.CreaditDue = $scope.EditReturnDetails.creditDue;
            $scope.ReturnOrder.TotalPoCost = $scope.EditReturnDetails.totalCost;
            if (angular.isDefined($scope.OrderDetails.method) && $scope.OrderDetails.method !== null)
            {
                $scope.OrderDetails.method.id = $scope.EditReturnDetails.purchaseOrderMethod.id;
            } else {
                $scope.OrderDetails.method={id:$scope.EditReturnDetails.purchaseOrderMethod.id}
            }
           
            $scope.OrderDetails.note = $scope.EditReturnDetails.note;
            $scope.OrderDetails.eta = (angular.isDefined($scope.EditReturnDetails.eta) && $scope.EditReturnDetails.eta != null) ? ($filter('DateFormatMMddyyyy')($scope.EditReturnDetails.eta)) : null
            $scope.OrderDetails.tracking = $scope.EditReturnDetails.tracking;
            $scope.OrderDetails.shippingCost = $scope.EditReturnDetails.shippingCost;
            $scope.ReturnOrder.RestockingFee = $scope.EditReturnDetails.restockingFee;
            $scope.OrderDetails.returnOrderId = $scope.EditReturnDetails.id
            GetEditOrderItems();
        }
        else {
            GetOrderItems();
        }
    }
    function GetOrderItems() {      
        angular.forEach($scope.OrderDetails.purchaseOrderItems, function (item, key) {
            $scope.ReturnItemList.push({ id: item.id, SI: key + 1, description: item.description, availabeQuantity: item.availabeQuantity, returnQuantity: item.totalReturnQuantity, quantity: item.availabeQuantity, unitcost: item.unitPrice, totalcost: item.amount })
        });

        $scope.OrderDetails.shippingCost = 0.00;
        GetTotalCost();
    };


    function GetEditOrderItems() {
      
        angular.forEach($scope.EditReturnDetails.purchaseOrderReturnItems, function (item, key) {
            $scope.ReturnItemList.push({ id: item.id, SI: key + 1, description: item.description, returnQuantity: item.returnQuantity, quantity: item.returnQuantity, unitcost: item.unitPrice, totalcost: item.amount })
        });
        GetTotalCost();
    }

    $scope.getTemplateItemReturn = function (item) {
      
        if (!angular.isUndefined(item)) {
            if (item.id === $scope.selectedReturnItem.id)
                return 'editItemReturn';
            else
                return 'displayItemReturn';
        }
        else
            return 'displayItemReturn';
    };

   
    $scope.RemoveReturnItem = RemoveReturnItem;
    function RemoveReturnItem(index, oper) {
        $scope.ReturnItemList.splice(index, 1);
    };

    $scope.EditReturnItem = EditReturnItem;
    function EditReturnItem(item) {

        $scope.selectedReturnItem = angular.copy(item);
    };

    $scope.EditCancel = function (index, opr) {
        if (opr == 'Edit') {
            $scope.ReturnItemList[index] = angular.copy($scope.selectedReturnItem); //{ id: $scope.selectedReturnItem.id, SI: $scope.selectedReturnItem.SI, description: $scope.selectedReturnItem.description, quantity: $scope.selectedReturnItem.quantity, unitcost: $scope.selectedReturnItem.unitcost, totalcost: $scope.selectedReturnItem.totalcost };
            
            $scope.selectedReturnItem = {};
            GetTotalCost();
        }
        else if (opr == 'Cancel') {
            $scope.selectedReturnItem = {};
        }
        else if (opr == 'Remove') {
            $scope.ReturnItemList.splice(index, 1);
            GetTotalCost();
        }
    };


    $scope.$on('SaveItemReturn', function (event,args) {
        
        var praram = {};
        var ItemList = [];
        angular.forEach($scope.ReturnItemList, function (attchment) {
            ItemList.push({

                "id": (angular.isDefined(attchment.id)) ? attchment.id : null,
                "description": attchment.description,
                "returnQuantity": attchment.quantity,
                "unitPrice": attchment.unitcost,
                "amount": attchment.totalcost

            });
        });     
        if (angular.isDefined($scope.OrderDetails.returnOrderId)) {            
            praram = {
                "id": $scope.OrderDetails.returnOrderId,
                "vendorSupplier": {
                    "id": $scope.OrderDetails.supplier.vendorId
                },
                "purchaseOrderReturnItems": ItemList,
                "restockingFee": (angular.isDefined($scope.ReturnOrder.RestockingFee) ? $scope.ReturnOrder.RestockingFee : null),
                "purchaseOrderMethod": {
                    "id": (angular.isDefined($scope.OrderDetails.method.id) ? $scope.OrderDetails.method.id : null)
                },
                "shippingCost": (angular.isDefined($scope.OrderDetails.shippingCost) ? $scope.OrderDetails.shippingCost : null),
                "tracking": (angular.isDefined($scope.OrderDetails.tracking) ? $scope.OrderDetails.tracking : null),
                "eta": $filter('DatabaseDateFormatMMddyyyy')($scope.OrderDetails.eta),
                "note": (angular.isDefined($scope.OrderDetails.note) ? $scope.OrderDetails.note : ""),
                "arrivalDestination": (angular.isDefined($scope.OrderDetails.arrivalAtDestination) ? $filter('DatabaseDateFormatMMddyyyy')($scope.OrderDetails.arrivalAtDestination) : null),
                "totalCost": (angular.isDefined($scope.ReturnOrder.TotalPoCost) ? $scope.ReturnOrder.TotalPoCost : null),
                "creditDue": (angular.isDefined($scope.ReturnOrder.CreaditDue) ? $scope.ReturnOrder.CreaditDue : null),
                "purchaseOrder": {
                    "id": $scope.OrderDetails.id
                }
            };

           // Update
            var TypeList = PurchaseOrderService.UpdateReturnItems(praram);
            TypeList.then(function (success) {
                toastr.remove()
                toastr.success((success.data.message !== null) ? success.data.message : "Order details saved successfully.", "Confirmation");
                $scope.GetOldDetails();
            }, function (error) {
                toastr.remove()
                toastr.error((error.data) ? error.data.errorMessage : "Failed to saved return item.", "Error");
                $scope.GetOldDetails();
            });
           
        }
        else {
             
            var praram = {
                "vendorSupplier": {
                    "id": $scope.OrderDetails.supplier.vendorId
                },
                "purchaseOrderReturnItems": ItemList,
                "restockingFee": (angular.isDefined($scope.ReturnOrder.RestockingFee) ? $scope.ReturnOrder.RestockingFee : null),
                "purchaseOrderMethod": {
                    "id":(angular.isDefined($scope.OrderDetails.method.id)?$scope.OrderDetails.method.id:null)
                },
                "shippingCost": (angular.isDefined($scope.OrderDetails.shippingCost) ? $scope.OrderDetails.shippingCost : null),
                "tracking": (angular.isDefined($scope.OrderDetails.tracking) ? $scope.OrderDetails.tracking : null),
                "eta": $filter('DatabaseDateFormatMMddyyyy')($scope.OrderDetails.eta),
                "note": (angular.isDefined($scope.OrderDetails.note) ? $scope.OrderDetails.note : ""),
                "arrivalDestination": (angular.isDefined($scope.OrderDetails.arrivalAtDestination) ? $filter('DatabaseDateFormatMMddyyyy')($scope.OrderDetails.arrivalAtDestination) : null),
                "totalCost":(angular.isDefined( $scope.ReturnOrder.TotalPoCost) ?  $scope.ReturnOrder.TotalPoCost :null),
                "creditDue": (angular.isDefined($scope.ReturnOrder.CreaditDue) ? $scope.ReturnOrder.CreaditDue : null),
                "purchaseOrder": {
                    "id": $scope.OrderDetails.id
                }
            };

            //Add New
            var TypeList = PurchaseOrderService.SaveReturnItems(praram);
            TypeList.then(function (success) {
                toastr.remove()
                toastr.success((success.data.message !== null) ? success.data.message : "Order details saved successfully.", "Confirmation");
                $scope.GetOldDetails();
            }, function (error) {
                toastr.remove()
                toastr.error((error.data) ? error.data.errorMessage : "Failed to saved return item.", "Error");
                $scope.GetOldDetails();
            });
        }
        


    });


    $scope.GetOldDetails =GetOldDetails;
    function GetOldDetails()
        {
            $scope.OrderDetails.orderType.name = $scope.PreviousPOType;
            $scope.EditPurchaseOrder($scope.OrderDetails);
        }

    //$scope.SaveItemReturn = SaveItemReturn;
    //function SaveItemReturn() {
    //};
    
    $scope.GetTotal = GetTotal;
    function GetTotal()
    {
        //GetTotalCost();
        if (angular.isDefined($scope.selectedReturnItem)) {
            $scope.ReturnOrder.TotalCost = parseInt($scope.selectedReturnItem.unitcost) * parseInt($scope.selectedReturnItem.quantity);
            //$scope.selectedReturnItem.totalcost = $scope.ReturnOrder.TotalCost;
           // $scope.ReturnOrder.TotalQunatity = $scope.selectedReturnItem.quantity;
        }
        var val = parseFloat( $scope.ReturnOrder.RestockingFee) / 100 * $scope.ReturnOrder.TotalCost;
       
        $scope.ReturnOrder.CreaditDue = $scope.ReturnOrder.TotalCost - val;
        $scope.ReturnOrder.TotalPoCost = $scope.ReturnOrder.TotalCost + $scope.OrderDetails.shippingCost;
       
    }
 
    $scope.AddShippingCost = AddShippingCost;
    function AddShippingCost()
    {
        GetTotalCost();
    }
    function GetTotalCost() {
      
        if (angular.isDefined($scope.selectedReturnItem)) {
            $scope.selectedReturnItem.totalcost = parseInt($scope.selectedReturnItem.unitcost) * parseInt($scope.selectedReturnItem.quantity);
        }      
        $scope.ReturnOrder.TotalPoCost = 0;
        $scope.ReturnOrder.CreaditDue = 0;
       // $scope.ReturnOrder.RestockingFee = 0;
        $scope.ReturnOrder.TotalQunatity = 0;
        $scope.ReturnOrder.TotalCost = 0;
        angular.forEach($scope.ReturnItemList, function (item) {
            $scope.ReturnOrder.TotalQunatity += parseInt(item.quantity);
            item.totalcost = item.unitcost * item.quantity;
            $scope.ReturnOrder.TotalCost += item.totalcost; 
        });
        var val = parseInt($scope.ReturnOrder.RestockingFee) / 100 * $scope.ReturnOrder.TotalCost;
       // $scope.ReturnOrder.RestockingFee = val;
        $scope.ReturnOrder.CreaditDue = $scope.ReturnOrder.TotalCost - val;
        $scope.ReturnOrder.TotalPoCost = $scope.ReturnOrder.TotalCost + parseFloat($scope.OrderDetails.shippingCost);
       
    };
   
});
