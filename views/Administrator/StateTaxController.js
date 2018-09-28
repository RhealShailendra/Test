angular.module('MetronicApp').controller('StateTaxController', function ($rootScope, $scope,
    settings, $location, $translate, $translatePartialLoader,BusinessRuleService) {

    //set language
    $translatePartialLoader.addPart('BusinessRules');
    $translate.refresh();

    $scope.StateList = []
    $scope.Selected = {};

    function init()
    {
        param = {
            "isTaxRate": true,
            "isTimeZone": true
        };
        var GetStateList = BusinessRuleService.GetStateList(param);
        GetStateList.then(function (success) {
            $scope.StateList = success.data.data;
        },
        function (error) {


        });

    }
    $scope.onStateChange = function (state) {
        $scope.stateID = state;
        param = {
            "id": state
        };
        var GetStateTax = BusinessRuleService.GetStateTax(param);
        GetStateTax.then(function (success) {
            $scope.TaxRate = success.data.data.taxRate;
        },
        function (error) {
            $scope.TaxRate =0;

        });
       
    }

    $scope.UpdateStateTax = function () {
         
        param = {
            "id": $scope.stateID,
            "taxRate": $scope.TaxRate
        };

        var UpdateStateTax = BusinessRuleService.UpdateStateTax(param);
        UpdateStateTax.then(function (success) {
             
            toastr.remove()
            toastr.success(success.data.message, "Confirmation");
        },
        function (error) {
            toastr.remove()
            toastr.error(error.data.errorMessage, "Error while updating");

        });
    }

    init();
    $scope.GoToHome=function()
    {
        $location.url(sessionStorage.getItem('HomeScreen'));
    }
});