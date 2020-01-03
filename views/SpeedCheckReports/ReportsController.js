angular.module('MetronicApp').controller('ReportsController', function ($rootScope, $scope, $filter, settings, $http, $location, $translate, $translatePartialLoader,
    AuthHeaderService) {

        $translatePartialLoader.addPart('SpeedCheckReports');
        $translate.refresh();
        $scope.ShowHeader = true;
        $scope.$on('$viewContentLoaded', function () {
            // initialize core components
            App.initAjax();
        });  

});