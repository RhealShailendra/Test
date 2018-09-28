angular.module('MetronicApp').controller('RolesAndPermissionMappingController', function ($rootScope, $scope,
    settings, $location, $translate, $translatePartialLoader, RolesAndPermissionMappingService) {

    //set language
    $translatePartialLoader.addPart('AdminPermissionMapping');
    $translate.refresh();
    $scope.RoleList = [];
    $scope.Role;
    $scope.ScreenList = [];
    $scope.ScreenPermission = [];
    $scope.OriginalScreenPermission = [];
    $scope.ErrorMessage = "";
    $scope.DisplayError = false;
    init();

    function init() {
        //Get Role List #94
        var promiseGetRoles = RolesAndPermissionMappingService.GetRoleList();
        promiseGetRoles.then(function (success) { $scope.RoleList = success.data.data; }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });

        //Get All Screen list
        var GetAllScreens = RolesAndPermissionMappingService.GetAllScreenList();
        GetAllScreens.then(function (success) { $scope.ScreenList = success.data.data; }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });
    }

    //Get permission's for specific role
    $scope.GetPermissionsForRoles = GetPermissionsForRoles;
    function GetPermissionsForRoles() {

        if ($scope.Role != null || $scope.Role != "") {
            var paramRoleId =
                  {
                      "roleId": $scope.Role
                  };
            var getScreenPermissions = RolesAndPermissionMappingService.GetScreenPermissions(paramRoleId);
            getScreenPermissions.then(function (success) {
                $scope.OriginalScreenPermission = [];
                $scope.OriginalScreenPermission = angular.copy(success.data.data);
                $scope.ScreenPermission = success.data.data; $scope.CheckSelected();
            }, function (error) { if (error !== null) { $scope.ErrorMessage = error.data.errorMessage; } });
        }
    }

    //Select existing permission for role
    $scope.CheckSelected = CheckSelected;
    function CheckSelected() {
        angular.forEach($scope.ScreenList, function (screen) {
            screen.IsScreenSelect = false;
            screen.IsCreate = false;
            screen.IsDelete = false;
            screen.IsSelect = false;
            screen.IsUpdate = false;

        });

        $scope.AssignedPermissions = [];
        $scope.AssignedPermissions = $scope.ScreenPermission[0].permissions;
        angular.forEach($scope.AssignedPermissions, function (permission) {
            angular.forEach($scope.ScreenList, function (screen) {
                if (permission.id == screen.id) {
                    screen.IsScreenSelect = true;
                    screen.IsCreate = permission.canCreate;
                    screen.IsDelete = permission.canDelete;
                    screen.IsSelect = permission.canSelect;
                    screen.IsUpdate = permission.canUpdate;
                }
            })
        });
    }

    //Save permission
    $scope.AssignPermission = function () {

        if ($scope.ScreenList == null || $scope.ScreenList.length == 0) {
            $scope.DisplayError = true;
        }
        else {
            $scope.Permissions = [];
            angular.forEach($scope.ScreenList, function (screen) {
                if (screen.IsScreenSelect === true) {
                    $scope.Permissions.push({ "id": screen.id, "permission": { "canDelete": screen.IsDelete, "canUpdate": screen.IsUpdate, "canCreate": screen.IsCreate, "canSelect": screen.IsSelect } })
                }
            });

            $scope.DeletePermissionList = [];


            var flag = false;
            angular.forEach($scope.OriginalScreenPermission[0].permissions, function (OldPermissionList) {
                angular.forEach($scope.Permissions, function (Newpermission) {
                    if (Newpermission.id === OldPermissionList.id) {
                        flag = true;
                    }
                });
                if (!flag) {
                    $scope.DeletePermissionList.push({
                        "id": OldPermissionList.id,
                        "isDelete": true
                    });
                }
                flag = false;
            });
            var param = {

                "id": $scope.Role,
                "permissions": $scope.Permissions

            };
            //Assign Permission to role
            var promiseGetRoles = RolesAndPermissionMappingService.AssignPermissionToRole(param);
            promiseGetRoles.then(function (success) {
                $scope.Status = success.data.status;
                //Delete Permission to role
                if ($scope.DeletePermissionList.length > 0) {
                    var Deleteparam = {
                        "id": $scope.Role,
                        "permissions": $scope.DeletePermissionList
                    };
                    var promiseDeleteRoles = RolesAndPermissionMappingService.AssignPermissionToRole(Deleteparam);
                    promiseDeleteRoles.then(function (success) {
                        if ($scope.Status == 200) {
                            bootbox.alert({
                                size: "",
                                title: $translate.instant("AlertMessage.PermissionAssignTitle"),
                                closeButton: false,
                                message: success.data.message,
                                className: "modalcustom",
                                callback: function () { /* your callback code */ }
                            });
                        }
                    }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });
                }
                else {
                    if ($scope.Status == 200) {
                        bootbox.alert({
                            size: "",
                            title: $translate.instant("AlertMessage.PermissionAssignTitle"),
                            closeButton: false,
                            message: success.data.message,
                            className: "modalcustom",
                            callback: function () { /* your callback code */ }
                        });
                    }
                }
            },
                 function (error) {
                     $scope.ErrorMessage = error.data.errorMessage;
                 });
        }
    }

    //Selete Unselect screen
    $scope.SelectScreen = SelectScreen;
    function SelectScreen(screen) {
        if (screen.IsScreenSelect === false) {
            screen.IsCreate = false;
            screen.IsDelete = false;
            screen.IsSelect = false;
            screen.IsUpdate = false;
        }
        else {
            screen.IsCreate = true;
            screen.IsDelete = true;
            screen.IsSelect = true;
            screen.IsUpdate = true;
        }
    }

    //If all permission get seleted the automatically screen get seleted.
    $scope.CheckScreen = CheckScreen
    function CheckScreen(screen) {
        if (screen.IsCreate === true && screen.IsDelete === true && screen.IsSelect === true && screen.IsUpdate === true) {
            screen.IsScreenSelect = true;
        }
    }
});