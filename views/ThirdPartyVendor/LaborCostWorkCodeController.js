angular.module('MetronicApp').controller('LaborCostWorkCodeController', function ($rootScope,
    $scope, $uibModal, $translate, $translatePartialLoader, LaborList) {

    $scope.Cancel = function () {
        $scope.$close();
    };
     
    $scope.JobWorkCodes = LaborList;

    $scope.Ok = function (item) {       
        $scope.$close(item);
    };

});