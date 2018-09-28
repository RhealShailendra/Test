angular.module('MetronicApp').controller('AddInvoicesController', function ($translate, $translatePartialLoader, $rootScope, $log, $scope,
    settings, $http, $timeout, $location) {
    $scope.items = $rootScope.items; $scope.boolValue = true;
    $translatePartialLoader.addPart('AddInvoices');
    $translate.refresh();
    $scope.message="Invoices"

    $scope.ok = function () {
        //Success Call Back is the value to be pass after opertion deone
        $scope.$close("Success Call Back test");
    };
    $scope.cancel = function () {
        $scope.$close("Close call back");
    };

    $scope.data = [{ Item: 'demo', Description: 'demo', Quantity: 'demo',Price:'demo', Amount: 'demo' },
        { Item: 'demo', Description: 'demo', Quantity: 'demo', Price: 'demo', Amount: 'demo' },
        { Item: 'demo', Description: 'demo', Quantity: 'demo', Price: 'demo', Amount: 'demo' },
        { Item: 'demo', Description: 'demo', Quantity: 'demo', Price: 'demo', Amount: 'demo' },
        { Item: 'demo', Description: 'demo', Quantity: 'demo', Price: 'demo', Amount: 'demo' },

    ]
});
