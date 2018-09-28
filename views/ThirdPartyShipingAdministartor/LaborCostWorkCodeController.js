angular.module('MetronicApp').controller('LaborCostWorkCodeController', function ($rootScope,
    $scope, $uibModal, $translate, $translatePartialLoader) {

    $scope.Cancel = function () {
        $scope.$close();
    };
    $scope.JobWorkCodes = [
        { "jobId": 1, "description": "Job Description1", "price": 100 },
        { "jobId": 2, "description": "Job Description2", "price": 200 },
        { "jobId": 3, "description": "Job Description5", "price": 400 },
        { "jobId": 4, "description": "Job Description3", "price": 600 },
        { "jobId": 5, "description": "Job Description4", "price": 800 },
    ];

    $scope.Ok = function (item) {       
        $scope.$close(item);
    };

});