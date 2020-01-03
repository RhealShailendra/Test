angular.module('MetronicApp').controller('SendToAdjusterPopUpController', function ($rootScope, $filter, $uibModal, $location, $scope, $translate, $translatePartialLoader
    , QuoteService, AuthHeaderService, objItemDetails) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    //set language 
    $translatePartialLoader.addPart('ViewQuote');
    $translate.refresh();

    function init()
    {
        $scope.AdjusterDetails = {};
         
        if (objItemDetails != null && angular.isDefined(objItemDetails))
        {
            $scope.AdjusterDetails =angular.copy(objItemDetails);
        }
       

    }
    init();

    $scope.cancel = function () {
        $scope.$close();
    };
});