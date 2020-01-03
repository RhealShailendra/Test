angular.module('MetronicApp').controller('EmailTempalteController', function ($rootScope, $scope, settings, $http, $uibModal, $timeout, $location, $translate, $translatePartialLoader, notifications) {

    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    $translatePartialLoader.addPart('EmailTempalte');
    $translate.refresh();
    $scope.ErrorMessage = "";
    $scope.pagesize = $rootScope.settings.pagesize;
    $scope.AddEmailTempShow;
    $scope.EmailTempleteListView;
    $scope.EmailTemplateList = [];
    $scope.init = init;
    $scope.Show = false;
    $scope.ShowSuccess = false;
    $scope.columnList = [{ column: '', type: '' }];
    function init() {
        $scope.AddEmailTempShow = false;
        $scope.EmailTempleteListView = true;
        $scope.EmailTemplateList = [

             {
                 "TemplateId": "1",
                 "TemplateTitle": "Title 1",
                 "ShortDescription": "Description"
             },
              {
                  "TemplateId": "2",
                  "TemplateTitle": "Title 2",
                  "ShortDescription": "Description"
              },
              {
                  "TemplateId": "3",
                  "TemplateTitle": "Title 3",
                  "ShortDescription": "Description"
              }
        ];
    }
    $scope.init();

    
    $scope.AddNewEmailTempalte = AddNewEmailTempalte;
    function AddNewEmailTempalte() {

        $scope.AddEmailTempShow = true;
        $scope.EmailTempleteListView = false;

    }
    $scope.Edit = Edit;
    function Edit(item) {

        $scope.AddEmailTempShow = true;
        $scope.EmailTempleteListView = false;

    }

    $scope.BtnBackClick = BtnBackClick;
    function BtnBackClick() {

        $scope.AddEmailTempShow = false;
        $scope.EmailTempleteListView = true;

    }

    $scope.Save = Save;
    function Save() {
      
        $scope.Show = true;
       
    }

    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

    $scope.closeSuccess = function () {
        $scope.Show = false;
    };
   

});