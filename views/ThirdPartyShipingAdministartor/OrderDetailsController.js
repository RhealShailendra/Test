angular.module('MetronicApp').controller('OrderDetailsController', function ($rootScope, $uibModal,
    $scope, $location, $translate, $translatePartialLoader, OrdersService, AuthHeaderService) {

    $translatePartialLoader.addPart('OrdersDetails');
    $translate.refresh();

    $scope.SupplierList = [];
    $scope.OrderDetails = {};

    function init() {
        $scope.OrderDetails = JSON.parse(sessionStorage.getItem("OrderDetails"));
    };
    init();
    //$scope.getOrderDetails = getDepartmentList;
    //function getDepartmentList() {
    //    $scope.GetDepartmentList = PurchaseOrderMappingService.GetDepartments();
    //    GetDepartmentList.then(function (success) {
    //        $scope.DepartmentList = success.data.data;
    //        toastr.remove();
    //        toastr.error(success.data.data, "Confirmation");

    //    }, function (error) {
    //        toastr.remove()
    //        if (angular.isDefined(error.data.errorMessage)) {
    //            toastr.error(error.data.errorMessage, "Error");
    //        }
    //        else
    //            toastr.error(AuthHeader.genericErrorMessage, "Error");
    //    })
    //};

    $scope.GotoDashboard = function () {
        $location.url('Orders');
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

    //Add Labour cost for labour charges
    $scope.LaborCostWorkDetails = [];
    $scope.LaborCostWorkCode = LaborCostWorkCode;
    function LaborCostWorkCode(ev) {
        $scope.animationsEnabled = true;
        var out = $uibModal.open(
        {
            animation: $scope.animationsEnabled,
            templateUrl: "views/ThirdPartyShipingAdministartor/LaborCostWorkCode.html",
            controller: "LaborCostWorkCodeController",
            resolve:
            {
            }
        });
        out.result.then(function (value) {
            //Call Back Function success
            if (value) {
                $scope.LaborCostWorkDetails.push(value);
            }

        }, function (res) {
            //Call Back Function close
        });
        return {
            open: open
        };
    };
    $scope.RemoveLaborCostWork = RemoveLaborCostWork;
    function RemoveLaborCostWork(index) {
        $scope.LaborCostWorkDetails.splice(index, 1);
    }



});