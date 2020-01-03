angular.module('MetronicApp').controller('OrdersController', function ($rootScope, $scope,  $translate, $translatePartialLoader, $location) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    //set language
    $translatePartialLoader.addPart('Orders');
    $translate.refresh();
    $scope.CurrentClaimTab = "OpenOrders";

    $scope.CommonObj = { OrderType: "0" }
    $scope.AlertList = [];
    $scope.EventList = [];
    //Prchase order
    $scope.OrderTypeList = [
        { "id": 1, "orderType": "Box In Box from Policyholder" },
        { "id": 2, "orderType": "PickUp from Vendor/Email Label" },
        { "id": 3, "orderType": "Order from Vendor" },
        { "id": 4, "orderType": "Labor Charges" },
        { "id": 5, "orderType": "Shipment" }
    ];
    $scope.Orders = [];
    $scope.CommonObj.OrderType = "";
    $scope.CommonObj.OrderTypeId === 0;
    $scope.ChangeOrderType = ChangeOrderType;
    function ChangeOrderType() {
        if ($scope.CommonObj.OrderTypeId > 0) {
            for (var i = 0; i <= $scope.OrderTypeList.length; i++) {
                if ($scope.OrderTypeList[i].id === $scope.CommonObj.OrderTypeId) {
                    $scope.CommonObj.OrderType = $scope.OrderTypeList[i].orderType;
                    break;
                }
            };
        }
    };


    $scope.OrderFromvendor_ItemList = [];
    $scope.OrderFromvendor_ItemList.push(
        {
            "itemDescription": "", "SKU": "", "quantity": "", "unitPrice": "", "salesTax": ""
        });
    $scope.addItem_OrderFromvendor = addItem_OrderFromvendor;
    function addItem_OrderFromvendor(operationFlag, operationType) {
        if (operationFlag == 1 && operationType == "Add") {
            $scope.OrderFromvendor_ItemList.push({
                "itemDescription": "", "SKU": "", "quantity": "", "unitPrice": "", "salesTax": ""
            });
        }
        else if (operationFlag != 0 && operationType == "Remove") {
            $scope.OrderFromvendor_ItemList.splice(operationFlag, 1);
        }

    }

    //Labour charges
    $scope.OrderLbourCharges_ItemList = [];
    $scope.OrderLbourCharges_ItemList.push(
        {
            "SKU": "", "quantity": "", "amount": ""
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


    $scope.PurchaseDetails = {
        Tax: 0,
        unitPrice: 0,
        quentity: 0,
        PurchaseValue: 0
    }

    $scope.PurachseTotal = PurachseTotal;
    function PurachseTotal() {
        if ($scope.PurchaseDetails.unitPrice !== "" && $scope.PurchaseDetails.unitPrice !== 0) {

            if ($scope.PurchaseDetails.quentity == 0 && $scope.PurchaseDetails.quentity == "");
            {
                $scope.PurchaseDetails.quentity = 1;
            };

            //if ($scope.PurchaseDetails.Tax == "");
            //{
            //    $scope.PurchaseDetails.Tax = 0;
            //}

            $scope.PurchaseDetails.PurchaseValue = ((parseInt($scope.PurchaseDetails.quentity) * parseInt($scope.PurchaseDetails.unitPrice)) * (1 + parseInt($scope.PurchaseDetails.Tax)))


        }

    }
    $scope.GotoOrderDetails = GotoOrderDetails;
    function GotoOrderDetails(order) {
        sessionStorage.setItem("OrderDetails", JSON.stringify(order));
        $location.url('OrderDetails');

    };
});