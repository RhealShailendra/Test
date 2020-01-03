angular.module('MetronicApp').controller('GlobalSearchAssociateController', function ($rootScope, $window, $translate, $translatePartialLoader, $scope, settings, VendorAssociateDashboardService,
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
    $scope.GlobalSearchReasult = [];

    function init() {
        $scope.GlobalSearchText = sessionStorage.getItem("VendorAssociateGlobalSearchText");
        if ($scope.GlobalSearchText !== "" && angular.isDefined($scope.GlobalSearchText)) {
            var param = {
                "searchString": $scope.GlobalSearchText,
                "userId": sessionStorage.getItem("UserId")
            };
            var promisePost = VendorAssociateDashboardService.getSerchedClaim(param);
            promisePost.then(function (success) {
                $scope.SerchString = $scope.GlobalSearchText;
                $scope.GlobalSearchReasult = success.data.data;
            }, function (error) {
                $scope.ErrorMessage = error.data.errorMessage;
            });
        }
        else {
            sessionStorage.setItem("VendorAssociateGlobalSearchText", "");
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
    function SerchAgain() {
        var param = {
            "searchString": $scope.GlobalSearchText,
            "userId": sessionStorage.getItem("UserId") //hard code
        };
        var promisePost = VendorAssociateDashboardService.getSerchedClaim(param);
        promisePost.then(function (success) {
            $scope.SerchString = $scope.GlobalSearchText;
            $scope.GlobalSearchReasult = success.data.data;
        }, function (error) {
            $scope.ErrorMessage = error.data.errorMessage;
        });
    }
    $scope.GoBack = GoBack;
    function GoBack() {
        sessionStorage.setItem("VendorAssociateGlobalSearchText", "");
        $window.history.back();
    }
});