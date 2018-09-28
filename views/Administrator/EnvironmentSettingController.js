angular.module('MetronicApp').controller('EnvironmentSettingController', function ($rootScope, $scope, settings, $http, $uibModal, $timeout, $location, $translate, $translatePartialLoader) {

    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    //set language
    $translatePartialLoader.addPart('EnvironmentSetting');
    $translate.refresh();


    $scope.ContentCategory = true;
    $scope.HomeOwnersPolicies = false;
    $scope.ClaimForm = false;
    $scope.EmailTempalte = false;

    $scope.ShowContentCategory = ShowContentCategory;
    function ShowContentCategory() {
        $scope.ContentCategory = true;
        $scope.HomeOwnersPolicies = false;
        $scope.ClaimForm = false;
        $scope.EmailTempalte = false;
       
    }

    $scope.ShowHomeOwnersPolicies = ShowHomeOwnersPolicies;
    function ShowHomeOwnersPolicies() {
        $scope.ContentCategory = false;
        $scope.HomeOwnersPolicies = true;
        $scope.ClaimForm = false;
        $scope.EmailTempalte = false;
    }


    $scope.ShowCliamForm = ShowCliamForm;
    function ShowCliamForm() {
        $scope.ContentCategory = false;
        $scope.HomeOwnersPolicies = false;
        $scope.ClaimForm = true;
        $scope.EmailTempalte = false;
    }

    $scope.ShowEmailTemplate = ShowEmailTemplate;
    function ShowEmailTemplate() {
        $scope.ContentCategory = false;
        $scope.HomeOwnersPolicies = false;
        $scope.ClaimForm = false;
        $scope.EmailTempalte = true;
    }

   
    //Register
    $scope.Register = Register;
    function Register(e) {
        bootbox.alert({
            size: "",
            title: "Registration Status", closeButton: false,
            message: "You are successfully done with your registration.!!",
            className: "modalcustom",
            callback: function () { /* your callback code */ }
        });

    }

 
});