angular.module('MetronicApp').controller('RolesAndScreenMappingController', function ($rootScope, $scope,
    settings, RolesAndScreenMapping, $location, $translate, $translatePartialLoader) {
   
   
   

    //set language
    $translatePartialLoader.addPart('AdminScreenMapping');
    $translate.refresh();
    $scope.RoleList = [];
    $scope.ScreenList = [];
    $scope.SelectedScreens = [];
    $scope.AssignedScreens = [];
    $scope.ErrorMessage = "";
    $scope.Role;
    $scope.DisplayError = false;
    init();
    function init() {
        //Get Role List #94
        var promiseGetRoles = RolesAndScreenMapping.GetRoleList();
        promiseGetRoles.then(function (success) { $scope.RoleList = success.data.data; }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });
        GetScreens();
    }

    $scope.GetScreens = GetScreens;
    function GetScreens()
    {
        var promiseGetRoles = RolesAndScreenMapping.GetAllScreens();
        promiseGetRoles.then(function (success) { $scope.ScreenList = success.data.data; }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });
    }

    $scope.GetAssignedScreens=function()
    {
        $scope.DisplayError = false;

        if ($scope.Role != null || $scope.Role != "")
        {
            var param =
                  {
                      "roleId": $scope.Role
                  };
            var getAssignedScreens = RolesAndScreenMapping.GetRoleSpecificScreens(param);
            getAssignedScreens.then(function (success) { $scope.AssignedScreens = success.data.data; $scope.CheckSelected(); }, function (error) { if (error !== null) { $scope.ErrorMessage = error.data.errorMessage; } });
        }
      
    }

    $scope.CheckSelected = CheckSelected;
    function CheckSelected()
    {
        angular.forEach($scope.ScreenList,function(screen)
        {
            screen.IsSelected = false;
        })
        $scope.SelectedScreens = [];
        angular.forEach($scope.AssignedScreens, function (assigned) {
            angular.forEach($scope.ScreenList, function (screen) {
                if(screen.id===assigned.id)
                {
                    screen.IsSelected = true;
                    $scope.SelectedScreens.push(screen.id)
                }

            });

        });
    }

    $scope.SelectScreen = function (Screen)
    {

        var index = $scope.SelectedScreens.indexOf(Screen.id)
        if (index > -1) {
            $scope.SelectedScreens.splice(index, 1)
            Screen.IsSelected = false;
        }
        else {
            $scope.SelectedScreens.push(Screen.id);
            Screen.IsSelected = true;
            $scope.DisplayError = false;
        }
       
    }

    $scope.AssignScreens=function (Screen)
        {
            if ($scope.SelectedScreens == null || $scope.SelectedScreens.length == 0) {
                $scope.DisplayError = true;
            }
            else {

            }
        }
});