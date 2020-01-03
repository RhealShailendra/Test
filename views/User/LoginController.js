angular.module('MetronicApp').controller('LoginController', function ($rootScope, UserService, LoginService, $scope, $http, $location, $cookies, $timeout, $state, $translate,
    $translatePartialLoader, RoleBasedService) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    //set language
    $translatePartialLoader.addPart('Login');
    $translate.refresh();
    $scope.errormsg = "";
    $scope.username = "";
    $scope.password = "";
    $scope.errormsg = "";
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
        
        if (($scope.username !== null && angular.isDefined($scope.username) && $scope.username !== "") && ($scope.password !== null && angular.isDefined($scope.password) && $scope.password !== "")) {
            delete $http.defaults.headers.common['X-Auth-Token'];
            $scope.token = "";
            var data = {
                "username": $scope.username,
                "password": $scope.password
            };
            var response = LoginService.LogIn(data);
            response.then(function (success) {
                 //Added for new page
                var myE2 = angular.element(document.querySelector('.page-wrapper'));
                myE2.addClass('wrapBoxShodow');
                //end 
                var myEl = angular.element(document.querySelector('.page-on-load'));
                myEl.addClass('div_MainBody');
                var result = UserService.initUserDetails(success.data, $scope.password, $scope.RememberMe);
               // $http.defaults.headers.common['X-Auth-Token'] = success.data.data.token;
                //$scope.RolePermission = success.data.data.roles;
                $scope.RolePermission = success.data.data.role;
                sessionStorage.setItem("IsVendorLogIn", undefined);
                //Make single list of screen and its permission stored in session uisng RolebasedService
                $scope.ScreenList = [];
                $scope.RoleList = [];

                // If the role list is blank use this for testing. Replace the roleName with login you need
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

                if (flagIsvendor === true)
                    RoleBasedService.SetHomePageForUser("VENDOR");
                else
                    RoleBasedService.SetHomePageForUser($scope.RoleList[0]);

                //set screen list of logged in user
                RoleBasedService.SetUserScreenList($scope.ScreenList);

                //check if user login first time 
                if (success.data.data.resetPassword) {
                    //sessionStorage.setItem("resetPassword", true);
                    $location.url("/Security");                 
                }
                else {
                    $location.path(RoleBasedService.GetHomePageForUser());
                }
                
                // init core components 
                Layout.init();
                App.initComponents();
            }, function (error) {
                if (error !== null) {
                    if (error.data !== null) {
                        $scope.errormsg = error.data.errorMessage;
                    }
                    else {
                        $scope.errormsg = "Invalid userid or password..";
                    }
                }
                else {
                    $scope.errormsg = "Invalid userid or password..";
                }
            });
        }
    }

    $scope.RegisterUserForm = RegisterUserForm;
    function RegisterUserForm(event) {
        $location.path('/register');
    }
    $scope.ForgotPasswordForm = ForgotPasswordForm;
    function ForgotPasswordForm(event) {
        sessionStorage.setItem("IsVendorLogIn", undefined);
        $location.path('/forgotpassword');
    }
    //Added for ne wpage
    $scope.EmptyError = function(){
                        $scope.errormsg='';
    }//end
    //To get Artigem Version Number
   
    $scope.GetVersionNumber = GetVersionNumber;
    function GetVersionNumber() {
        var Getversion = LoginService.GetVersionNumber();
        Getversion.then(function (success) {
             
            $scope.versionData = success.data.data;

        },
            function (error) {
                toastr.remove();
                toastr.error(error.data.errorMessage, "Error");
            })
    }
    $scope.GetVersionNumber();
});
