angular.module('MetronicApp').controller('UserAdministrationController', function ($rootScope, $scope,
    settings, $location, $translate, $translatePartialLoader) {

    //set language
    $translatePartialLoader.addPart('AdminPermissionMapping');
    $translate.refresh();
    $scope.message = "user administration"
});