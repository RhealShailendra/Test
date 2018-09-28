angular.module('MetronicApp').controller('PurchaseOrderMappingController', function ($rootScope,
    $scope, $location, $translate, $translatePartialLoader, PurchaseOrderMappingService, AuthHeaderService) {

    $translatePartialLoader.addPart('PurchaseOrder');
    $translate.refresh();

    $scope.DepartmentList;
    $scope.PurchaseOrderType;
    $scope.PurchseOrderMap = [];
    function init() {

        GetPurchaseOrdersType();
        getDepartmentList();       
    };

    init();
    $scope.GetPurchaseOrdersType = GetPurchaseOrdersType;
    function GetPurchaseOrdersType() {
        var getPurchaseOrdersType = PurchaseOrderMappingService.GetPurchaseOrders();
        getPurchaseOrdersType.then(function (success) {
            $scope.PurchaseOrderType = success.data.data;
            $scope.GetPurchaseOrderMapping();
        }, function (error) {
            toastr.remove();
            toastr.error(((error !== null) ? error.data.errorMessage : AuthHeaderService.genericErrorMessage(), "error"));
        });
    };
    $scope.getDepartmentList = getDepartmentList;
    function getDepartmentList() {
        var GetDepartmentList = PurchaseOrderMappingService.GetDepartments();
        GetDepartmentList.then(function (success) {
            $scope.DepartmentList = success.data.data;
             
        }, function (error) {
            toastr.remove()
            if (angular.isDefined(error.data.errorMessage)) {
                toastr.error(error.data.errorMessage, "Error");
            }
            else
                toastr.error(AuthHeader.genericErrorMessage(), "Error");
        })
    };

    $scope.GotoDashboard = function () {
        $location.url(sessionStorage.getItem('HomeScreen'));
    };

    $scope.GetPurchaseOrderMapping = GetPurchaseOrderMapping;
    function GetPurchaseOrderMapping()
    {
        for (var i = 0; i < $scope.PurchaseOrderType.length; i++) {
            if (angular.isDefined($scope.PurchaseOrderType[i].id) && $scope.PurchaseOrderType[i].id !== null) {
                var param = {
                    "id": $scope.PurchaseOrderType[i].id

                };
                $scope.PurchaseOrderMap = [];
                var count = 0;
                var getPurchaseOrderMapping = PurchaseOrderMappingService.GetPurchaseOrderMapping(param);
                getPurchaseOrderMapping.then(function (success) {
                    count++;
                    $scope.PurchaseOrderMap.push(success.data.data);

                    if (count == $scope.PurchaseOrderType.length)
                    {
                        map();
                    }

                }, function (error) {
                    toastr.remove();
                    toastr.error(((error !== null) ? error.data.errorMessage : AuthHeaderService.genericErrorMessage(), "error"));
                });
            }

        }


       
        

    }

    function map()
    {
         
        angular.forEach($scope.PurchaseOrderMap, function (mapping) {
             
            angular.forEach($scope.PurchaseOrderType, function (order) {
                 
                if (mapping.purchaseOrderType.id == order.id) {
                    if (mapping.department!==null)
                    order.deptid = mapping.department.id
                }

            });
        });
    }

    var count = 0;
    $scope.Message = "";
    $scope.SaveMapping = SaveMapping;
    function SaveMapping() {

        for (var i = 0; i < $scope.PurchaseOrderType.length; i++)
        {
            if (angular.isDefined($scope.PurchaseOrderType[i].deptid) && $scope.PurchaseOrderType[i].deptid !== null)
            {             
                var paramMap = {
                    "purchaseOrderType": {
                        "id": $scope.PurchaseOrderType[i].id
                    },
                    "department": {
                        "id":$scope.PurchaseOrderType[i].deptid
                    }
                };               
                var SaveMapping = PurchaseOrderMappingService.SavePurchaseOrderMapping(paramMap);
                SaveMapping.then(function (success) {
                    toastr.remove();
                    toastr.success(success.data.message, "confirmation");
                    $scope.GetPurchaseOrderMapping();
                }, function (error) {
                    toastr.remove();
                    toastr.error(((error !== null) ? error.data.errorMessage : AuthHeaderService.genericErrorMessage, "error"));
                });
            }

               
        }
       
    }

});