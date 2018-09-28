angular.module('MetronicApp').controller('SalesAdminOrdersController', function ($rootScope,
    $scope, $location, $translate,$filter,$translatePartialLoader, SalesAdminOrdersService, AuthHeaderService) {
    $translatePartialLoader.addPart('SalesAdminOrders');
    $translate.refresh();

    $scope.AlertList = [];
    $scope.EventList = [];
    $scope.Orders = [];
    function init() {
        $(".page-spinner-bar").removeClass("hide");
        var param = {
            "id": sessionStorage.getItem("DepartmentId"), //Department ID
          //  "pageNumber":1 // optioal for get result in pagination, skip it for get all records.
          
        };
        var GetOrders = SalesAdminOrdersService.GetOrder(param);
        GetOrders.then(function (success) {
            if (success.data.data != null)
            {
                $scope.Orders = success.data.data.purchaseOrders;
                $scope.Orders = $filter('orderBy')($scope.Orders, 'createDate',true);
            }
            
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            $(".page-spinner-bar").addClass("hide");
            toastr.remove();
            toastr.error((angular.isDefined(error.data) && angular.isDefined(error.data.errorMessage) ? error.data.errorMessage : AuthHeaderService.genericErrorMessage()), "Error");
        });
    };
    init();

    $scope.GotoDashboard = function () {
        $location.url(sessionStorage.getItem('HomeScreen'));
    }

    $scope.GotoOrderDetails = GotoOrderDetails;
    function GotoOrderDetails(order) {
        sessionStorage.setItem("OrderId", JSON.stringify(order.id));
        $location.url('PODetailsDepartment');

    };

    $scope.sortNewClaim = sortNewClaim;
    function sortNewClaim(key)
    {
        $scope.sortNewClaimKey = key;
        $scope.reverseNewClaim = !$scope.reverseNewClaim;
    }

});