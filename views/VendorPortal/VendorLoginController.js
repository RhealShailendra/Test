angular.module('MetronicApp').controller('VendorLoginController', function ($rootScope, $http, RoleBasedService, $location, UserService, VendorLoginService, $uibModal, $cookies, $scope, $translate, $translatePartialLoader) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    $translatePartialLoader.addPart('VendorLogin');
    $translate.refresh();
    $scope.errormsg = "";
    $scope.username = "";
    $scope.password = "";
    $scope.RememberMe = false;



    ////Implement auto login if remember me clicked
    AutoLogIn();
    $scope.AutoLogIn = AutoLogIn;
    function AutoLogIn() {
        var flag = $cookies.get("UserName");
        if (angular.isDefined(flag)) {
            $scope.username = $cookies.get("UserName");
            $scope.password = $cookies.get("Password");
            LogIn();
        }
    }


    $scope.LogIn = LogIn;
    function LogIn(ev) {
        $scope.errormsg = "";
        if (($scope.username !== null && angular.isDefined($scope.username) && $scope.username !== "") && ($scope.password !== null && angular.isDefined($scope.password) && $scope.password !== "")) {
            delete $http.defaults.headers.common['X-Auth-Token'];
            $scope.token = "";
            var data = {
                "username": $scope.username,
                "password": $scope.password
            };
            //Code to bypass the login 
            if ($scope.RememberMe) {
                //Get hard code data
                var success = { data: UserService.DummyData($scope.username) };

                var myE2 = angular.element(document.querySelector('.page-wrapper'));
                myE2.addClass('wrapBoxShodow');
                var myEl = angular.element(document.querySelector('.page-on-load'));
                myEl.addClass('div_MainBody');

                var result = UserService.initUserDetails(success.data, $scope.password, $scope.RememberMe);
               // $http.defaults.headers.common['X-Auth-Token'] = success.data.data.token;
                $scope.RolePermission = success.data.data.role;
                sessionStorage.setItem("IsVendorLogIn", undefined);
                $scope.ScreenList = [];
                $scope.RoleList = [];

                for (var i = 0; i < $scope.RolePermission.length; i++) {

                    if ((angular.isDefined($scope.RolePermission[i].roleName)) && ($scope.RolePermission[i].roleName !== null)) {
                        $scope.RoleList.push($scope.RolePermission[i].roleName);
                    }

                    if ($scope.ScreenList !== null && angular.isDefined($scope.ScreenList) && $scope.ScreenList.length > 0) {
                        $scope.ScreenList = $scope.ScreenList.concat(RoleBasedService.GetUserScreenList($scope.RolePermission[i].roleName));
                    }
                    else {
                        $scope.ScreenList = RoleBasedService.GetUserScreenList($scope.RolePermission[i].roleName);
                    }
                }
                //Set Role of user           
                var flagIsvendor = false;
                angular.forEach($scope.RoleList, function (item) {
                    if (item === "VENDOR") {
                        flagIsvendor = true;
                    }
                });
                RoleBasedService.SetUserRoles($scope.RoleList[0]);
                //Get set Home page for each role  RoleBasedService.SetHomePageForUser($scope.RoleList); to save multiple row

                //if (flagIsvendor === true)
                //    RoleBasedService.SetHomePageForUser("VENDOR");
                //else
                //    RoleBasedService.SetHomePageForUser($scope.RoleList[0]);

                //set screen list of logged in user
              //  RoleBasedService.SetUserScreenList($scope.ScreenList);
                if (success.data.data.resetPassword) {
                    $location.url("/Security");
                    //sessionStorage.setItem("resetPassword", true);
                }
                else {
                    $location.path(RoleBasedService.GetHomePageForUser());
                }
                
                // init core components 
                Layout.init();
                App.initComponents();
            }
           // End code to bypass the login 
            else {
               //
                var response = VendorLoginService.LogIn(data);
                response.then(function (success) {
                    $scope.errormsg = "";                //Added for new page
                    var LoginResponse = success.data.data;//Later used while checking user is first time logginn in or not
                    var myE2 = angular.element(document.querySelector('.page-wrapper'));
                    myE2.addClass('wrapBoxShodow');
                    //end 
                    var myEl = angular.element(document.querySelector('.page-on-load'));
                    myEl.addClass('div_MainBody');
                    var result = UserService.initUserDetails(success.data, $scope.password, $scope.RememberMe);
                   // $http.defaults.headers.common['X-Auth-Token'] = success.data.data.token;
                    $scope.RolePermission = success.data.data.role;
                    sessionStorage.setItem("IsVendorLogIn", undefined);
                    //Make single list of screen and its permission stored in session uisng RolebasedService
                    $scope.ScreenList = [];
                    $scope.RoleList = [];

                    // If the orle list is blank use this for testing. Replace the roleName with login you need
                    //if ($scope.RolePermission.length === 0) {
                    //    $scope.RolePermission[0] = { "roleName": "CLAIM MANAGER" };              

                    //    $scope.RolePermission[1] = { "roleName": "ADJUSTER" };
                    //}


                    for (var i = 0; i < $scope.RolePermission.length; i++) {
                        //Simply get the screen access list screen code and stored it in list and chek wheather the code is present in list or not
                        if ((angular.isDefined($scope.RolePermission[i].roleName)) && ($scope.RolePermission[i].roleName !== null)) {
                            //Get Role List
                            $scope.RoleList.push($scope.RolePermission[i].roleName);
                        }
                        //Get Screen List for getting values form Db and when will get updated API just uncomment it and comment following part
                        //if ($scope.RolePermission[i].permissions !== null) {                    
                        //for (var j = 0; j < $scope.RolePermission[i].permissions.length; j++) {
                        //    $scope.ScreenList.push($scope.RolePermission[i].permissions[j].name);
                        //}                   
                        // }    

                        //Get screen list form Role BasedMenu service                 
                        if ($scope.ScreenList !== null && angular.isDefined($scope.ScreenList) && $scope.ScreenList.length > 0) {
                            $scope.ScreenList = $scope.ScreenList.concat(RoleBasedService.GetUserScreenList($scope.RolePermission[i].roleName));
                        }
                        else {
                             
                            var Rolelist = $scope.RolePermission[i].roleName;
                            var list;
                            $scope.ScreenList = RoleBasedService.GetUserScreenList($scope.RolePermission[i].roleName);
                            $scope.ScreenList.then(function (success) {
                                AllRoleslist = success.data;
                                    var Flag = 0;
                                    angular.forEach(AllRoleslist.RoleList, function (roleList) {
                                        if (Flag == 0) {
                                            angular.forEach(roleList.Roles, function (role) {
                                                if (Flag == 0) {
                                                    if (role === Rolelist) {
                                                        list = roleList.Screens;
                                                        sessionStorage.setItem("HomeScreen", roleList.Home);
                                                        Flag++;
                                                    }
                                                }
                                            });
                                        }
                                    });
                                    sessionStorage.setItem("ScreenList", JSON.stringify(list));
                                    if (LoginResponse.resetPassword) {
                                        $location.url("/Security");
                                        //sessionStorage.setItem("resetPassword", true);
                                    }
                                    else {
                                        $location.path(RoleBasedService.GetHomePageForUser());
                                    }
                                });
                        }
                    }
                    //Set Role of user           
                    var flagIsvendor = false;
                    angular.forEach($scope.RoleList, function (item) {
                        if (item === "VENDOR") {
                            flagIsvendor = true;
                        }
                    });
                    RoleBasedService.SetUserRoles($scope.RoleList[0]);
                    //Get set Home page for each role  RoleBasedService.SetHomePageForUser($scope.RoleList); to save multiple row

                    //if (flagIsvendor === true)
                    //    RoleBasedService.SetHomePageForUser("VENDOR");
                    //else
                    //    RoleBasedService.SetHomePageForUser($scope.RoleList[0]);

                    //set screen list of logged in user
                   // RoleBasedService.SetUserScreenList($scope.ScreenList);
                   
                    // init core components 
                    Layout.init();
                    App.initComponents();
                }, function (error) {
                    $scope.errormsg = error.data.errorMessage;
                });
            }
        }

     
    }

    $scope.ForgotPasswordForm = ForgotPasswordForm;
    function ForgotPasswordForm(event) {
        sessionStorage.setItem("IsVendorLogIn", "True");
        $location.path('/forgotpassword');
    }

    //To get Artigem Version Number   
    //$scope.GetVersionNumber = GetVersionNumber;
    //function GetVersionNumber() {
    //    var Getversion = VendorLoginService.GetVersionNumber();
    //    Getversion.then(function (success) {
    //        $scope.versionData = success.data.data;

    //    },
    //        function (error) {
    //            toastr.remove();
    //            toastr.error(error.data.errorMessage, "Error");
    //        })
    //}
    //$scope.GetVersionNumber();

});