angular.module('MetronicApp').controller('AllAppraisalsController', function ($rootScope, $scope, $filter, settings, $http, $location, $translate, $translatePartialLoader,
    AuthHeaderService) {

        $translatePartialLoader.addPart('SpeedCheckAllAppraisals');
        $translate.refresh();
        $scope.ShowHeader = true;
        $scope.$on('$viewContentLoaded', function () {
            // initialize core components
            App.initAjax();
        });  

});