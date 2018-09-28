angular.module('MetronicApp').controller('ThirdPartyGlobalSearchController', function ($rootScope,$window, $translate, ThirdPartyGlobalSearchService, $translatePartialLoader, $scope, settings,
     $location, $filter) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    $translatePartialLoader.addPart('ThirdPartyGlobalSearch');
    $translate.refresh();
    $scope.pagesize = $rootScope.settings.pagesize;
    $scope.SerchString = "";
    //Claims to be assigned section
    $scope.ClaimsTobeAssigned = [];
   
    function init() {
        $scope.GlobalSearchText = sessionStorage.getItem("ThirdPartyGlobalSearchText");
        if ($scope.GlobalSearchText !== "" && angular.isDefined($scope.GlobalSearchText)) {
            var param = {
                "searchString": $scope.GlobalSearchText,
                "userId": sessionStorage.getItem("UserId") 
            };
            var promisePost = ThirdPartyGlobalSearchService.getSerchedClaim(param);
            promisePost.then(function (success) {
                
                $scope.SerchString = $scope.GlobalSearchText;
                $scope.ClaimsTobeAssigned = success.data.data;
            }, function (error) {
                $scope.ErrorMessage = error.data.errorMessage;
            });
        }
        else
        {
            sessionStorage.setItem("ThirdPartyGlobalSearchText", "");
            $window.history.back();
        }
    }
    init();

    //sort assigned claim
    $scope.Assignsort = function (keyname) {
        $scope.AssignsortKey = keyname;   //set the sortKey to the param passed
        $scope.Assignreverse = !$scope.Assignreverse; //if true make it false and vice versa
    }
   
    $scope.SerchAgain = SerchAgain;
    function SerchAgain()
    {
        var param = {
            "searchString": $scope.GlobalSearchText,
            "userId": sessionStorage.getItem("UserId")
        };
        var promisePost = ThirdPartyGlobalSearchService.getSerchedClaim(param);
        promisePost.then(function (success) {
            
            $scope.SerchString = $scope.GlobalSearchText;
            $scope.ClaimsTobeAssigned = success.data.data;
        }, function (error) {
            $scope.ErrorMessage = error.data.errorMessage;
        });
    }
    $scope.GoBack = GoBack;
    function GoBack()
    {
        sessionStorage.setItem("ThirdPartyGlobalSearchText", "");
        $window.history.back();
    }
});