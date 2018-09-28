/// <reference path="Services/GemLabAdmin/ClaimDetailsService.js" />
/// <reference path="Services/GemLabAdmin/ClaimDetailsService.js" />
/// <reference path="Services/GemLabAdmin/ClaimDetailsService.js" />
/// <reference path="Services/PolicyDetails/PolicyDetailsService.js" />
/// <reference path="Services/PolicyDetails/PolicyDetailsService.js" />
/***
Metronic AngularJS App Main Script
***/
/* Metronic App */
var MetronicApp = angular.module("MetronicApp", [
    "ui.router",
    "ngTouch",
    "ui.bootstrap",
    "oc.lazyLoad",
    "ngSanitize",
    "ngCookies",
    "angularUtils.directives.dirPagination",
    "pascalprecht.translate",
    "ngIdle",
    "angucomplete-alt",
    "anguFixedHeaderTable",
    "scrollable-table", "pdf",
   "ui.calendar", "pickadate",
   "ngTagsInput"


]);

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
MetronicApp.config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        // global configs go here
    });
}]);

//AngularJS v1.3.x workaround for old style controller declarition in HTML
MetronicApp.config(['$controllerProvider', function ($controllerProvider) {
    // this option might be handy for migrating old apps, but please don't use it
    // in new ones!
    $controllerProvider.allowGlobals();
}]);

MetronicApp.config(function ($translateProvider, $translatePartialLoaderProvider) {
    $translateProvider.useLoader('$translatePartialLoader', {
        urlTemplate: 'Translation/{part}/{lang}.json'
    });
    $translateProvider.useSanitizeValueStrategy('sanitize');
    $translateProvider.preferredLanguage('en-US');

});

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/

/* Setup global settings */
MetronicApp.factory('settings', ['$rootScope', function ($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: true, // sidebar menu state
            pageContentWhite: true, // set page content layout
            pageBodySolid: false, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        assetsPath: 'assets',
        globalPath: 'assets/global',
        layoutPath: 'assets/layouts/layout4',
        pagesize: "20",
        itemPagesize: "20",
        apiurl: 'http://69.164.195.59:8080/ArtigemRS-FI/api/',
        NoImagePath: "assets/global/img/no-image.png"
    };
    $rootScope.settings = settings;
    return settings;
}]);
/* Setup App Main Controller */
MetronicApp.controller('AppController', ['$scope', '$rootScope', '$state', 'Idle', '$location', '$http', '$cookies', 'Keepalive', 'UserService', function ($scope, $rootScope, $state, Idle, $location, $http, $cookies, Keepalive, UserService) {
    $scope.$on('$viewContentLoaded', function () {
        App.initComponents(); // init core components

        Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 
        //<!-- Toster notification options -->
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "newestOnTop": false,
            "progressBar": false,
            "positionClass": "toast-top-full-width",
            "preventDuplicates": true,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "0",
            "extendedTimeOut": "0",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
            //,
            //"tapToDismiss":"false"
        }
    });

    $scope.$on('IdleStart', function () {
        // the user appears to have gone idle
        $("title", "head").text("Artigem 3CircleCRM");
        console.log("Ideal time start");
    });

    $scope.$on('IdleWarn', function (e, countdown) {
        // follows after the IdleStart event, but includes a countdown until the user is considered timed out
        // the countdown arg is the number of seconds remaining until then.
        // you can change the title or display a warning dialog from here.
        // you can let them resume their session by calling Idle.watch()
        $("title", "head").text("Artigem 3CircleCRM");
        console.log("Ideal warn time start");
    });

    $scope.$on('IdleTimeout', function () {
        // the user has timed out (meaning idleDuration + timeout has passed without any activity logout user)
        if (angular.isDefined(sessionStorage.getItem("IsVendorLogIn")) && (sessionStorage.getItem("IsVendorLogIn") === "True")) {
            toastr.remove();
            sessionStorage.setItem("IsVendorLogIn", undefined);
            $(".wrapBoxShodow").css("box-shadow", "0px 1px 16px 1px #364150");
            var APIURL = sessionStorage.getItem("apiurl")
            var ReceiptURL = sessionStorage.getItem("receipturl");
            var ExportURL = sessionStorage.getItem("ExportUrl");        
            var Xoriginator = sessionStorage.getItem("Xoriginator");
            var VendorDetailsTemplate = sessionStorage.getItem("VendorDetailsTemplate");
            var claimProfile = sessionStorage.getItem("claimProfile");
            var PolicyholderAppListURL = sessionStorage.getItem("PolicyholderAppListURL");
            sessionStorage.clear();
            sessionStorage.setItem("apiurl", APIURL)
            sessionStorage.setItem("receipturl", ReceiptURL);
            sessionStorage.setItem("ExportUrl", ExportURL);
            sessionStorage.setItem("Xoriginator", Xoriginator);
            sessionStorage.setItem("VendorDetailsTemplate", VendorDetailsTemplate);
            sessionStorage.setItem("claimProfile", claimProfile);
            sessionStorage.setItem("PolicyholderAppListURL", PolicyholderAppListURL);

            $cookies.remove('UserName');
            $cookies.remove('Password'); $("title", "head").text("Artigem 3CircleCRM");
            $rootScope.IsLoginedUser = false;
            $state.go('login');
            toastr.warning("Session expired. You have been logged out.", "Session time out..!");

        }
        else {
            toastr.remove();
            $(".wrapBoxShodow").css("box-shadow", "0px 1px 16px 1px #364150");
            var APIURL = sessionStorage.getItem("apiurl")
            var ReceiptURL = sessionStorage.getItem("receipturl");
            var ExportURL = sessionStorage.getItem("ExportUrl");
            var Xoriginator = sessionStorage.getItem("Xoriginator");
            var VendorDetailsTemplate = sessionStorage.getItem("VendorDetailsTemplate");
            var claimProfile = sessionStorage.getItem("claimProfile");
            var PolicyholderAppListURL = sessionStorage.getItem("PolicyholderAppListURL");
            sessionStorage.clear();
            sessionStorage.setItem("apiurl", APIURL)
            sessionStorage.setItem("receipturl", ReceiptURL);
            sessionStorage.setItem("ExportUrl", ExportURL);
            sessionStorage.setItem("Xoriginator", Xoriginator);
            sessionStorage.setItem("VendorDetailsTemplate", VendorDetailsTemplate);
            sessionStorage.setItem("claimProfile", claimProfile);
            sessionStorage.setItem("PolicyholderAppListURL", PolicyholderAppListURL);
            $cookies.remove('UserName');
            $cookies.remove('Password'); $("title", "head").text("Artigem 3CircleCRM");
            $rootScope.IsLoginedUser = false;
            $state.go('login');
            toastr.warning("Session expired. You have been logged out.", "Session time out..!");
        }
        console.log("Ideal time out. Session end");
    });



    $scope.$on('IdleEnd', function () {
        // the user has come back from AFK and is doing stuff. if you are warning them, you can use this to hide the dialog
        console.log("User is alive. Active again.");
    });

    //$scope.$on('Keepalive', function () {      
    //    // do something to keep the user's session alive
    //});
    

}]);

/***
Layout Partials.
By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial 
initialization can be disabled and Layout.init() should be called on page load complete as explained above.
***/

/* Setup Layout Part - Header */
MetronicApp.controller('HeaderController', ['$scope', '$location', '$state', '$rootScope', '$http', '$translatePartialLoader', '$translate', 'RoleBasedService', '$interval', '$filter', 'UserService', 'HeaderService', function ($scope, $location, $state, $rootScope, $http, $translatePartialLoader, $translate, RoleBasedService, $interval, $filter, UserService, HeaderService) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initHeader(); // init header
    });

    $scope.ShowSearchBar = true;
    $translatePartialLoader.addPart('AdjusterDashboard');
    $translate.refresh();
    var UserType = sessionStorage.getItem("UserType")
    if (UserType === "POLICY_HOLDER") {
        $scope.ShowSearchBar = false;
    }
    $scope.CommonObj = {
        GlobalSearchText: ""
    }
    $scope.Notifications = [];
    $scope.LatestNotification = [];
    $scope.Events = [];

    $scope.LatestEvents = [];
    $scope.EventCount;
    $scope.totalCount;
    $scope.ErrorMessage;
    $translatePartialLoader.addPart('SideBar');
    $translate.refresh();
    $scope.ScreenList;
    //Method should be call on init method    
    function init() {
        //It again calling getscreenlist so list is null make anothre method which return screen list form session storage
        $scope.ScreenList = RoleBasedService.GetUserScreenListFromSession();
        GetNotification();
        $interval(function () {
            if ($rootScope.IsLoginedUser === true) {
                $scope.GetNotification();
            }
        }, 60000);
    }
    init();
    $scope.GetNotification = GetNotification;
    function GetNotification() {
        //get notification for the user
        var param =
            {
                "id": sessionStorage.getItem("UserId")
            }
        var getNotification = HeaderService.getAlertList(param);
        getNotification.then(function (success) { $scope.Notifications = success.data.data; $scope.getRecent(); }, function (error) {
            if (error != null) {
                $scope.ErrorMessage = error.data.errorMessage;
            }
        });
    }


    $scope.getRecent = getRecent;
    function getRecent() {
        $scope.LatestNotification = [];

        angular.forEach($scope.Notifications, function (notification) {
            if (notification.isRead == false) {
                $scope.LatestNotification.push(notification);
            }
        })

        $scope.totalCount = $scope.LatestNotification.length;
        $scope.getTime();
    }

    $scope.Globalsearch = function Globalsearch() {
        var abc = $location.path();
        if (abc === '/AdjusterGlobalSearch') {
            sessionStorage.setItem("GlobalSearchtext", $scope.CommonObj.GlobalSearchText);
            $state.reload()
        }
        else {
            var backpath = $location.path();
            sessionStorage.setItem("BackPage", backpath);
            sessionStorage.setItem("GlobalSearchtext", $scope.CommonObj.GlobalSearchText);
            $location.url('AdjusterGlobalSearch');
        }

    }
    $rootScope.$on("$locationChangeStart", function () {
        if ($location.path() !== "/AdjusterGlobalSearch")
            $scope.CommonObj.GlobalSearchText = "";
        else
            $scope.CommonObj.GlobalSearchText = sessionStorage.getItem("GlobalSearchtext");

    });
    if ($location.path() === "/AdjusterGlobalSearch")
        $scope.CommonObj.GlobalSearchText = sessionStorage.getItem("GlobalSearchtext");

    $scope.getTime = getTime;
    function getTime() {
        $scope.TodaysDate = $filter('date')(new Date(), "MM/dd/yyyy");

        angular.forEach($scope.LatestNotification, function (notification) {
            notification.createDate = $filter('date')(notification.createDate, "MM/dd/yyyy");
        });
        angular.forEach($scope.LatestNotification, function (notification) {
            if (notification.createDate == $scope.TodaysDate) {
                notification.notificationdate = "Today"
            }
            else {
                notification.notificationdate = $filter('date')(notification.createDate, "dd/MM/yyyy");
            }
        });

        $scope.LatestNotification = $filter('orderBy')($scope.LatestNotification, 'createDate');
    };

    $scope.MarkAsRead = function (obj) {
        var param =
           {
               "id": obj.id
           }
        var getNotification = HeaderService.markAsRead(param);
        getNotification.then(function (success) {

            $scope.status = success.data.status;
            if ($scope.status === 200) {

                $scope.totalCount = $scope.totalCount - 1;
                var index = $scope.LatestNotification.indexOf(obj);
                $scope.LatestNotification.splice(index, 1);

                $scope.RedirectTodetail(obj);

            }

        }, function (error) {
            if (error != null) {
                $scope.ErrorMessage = error.data.errorMessage;
            }

        });
    };

    $scope.RedirectTodetail = RedirectTodetail;
    function RedirectTodetail(obj) {
        var role = sessionStorage.getItem("RoleList");

        if (role === 'ADJUSTER') {
            sessionStorage.setItem("AdjusterClaimId", obj.notificationParams.claimId);
            sessionStorage.setItem("AdjusterClaimNo", obj.notificationParams.claimNumber);
            $location.url('\AdjusterPropertyClaimDetails');
        }
            //For Third party vendor
        else if (role === 'VENDOR CONTACT PERSON') {
            sessionStorage.setItem("ThirdPartyClaimId", obj.notificationParams.claimId);
            sessionStorage.setItem("ThirdPartyClaimNo", obj.notificationParams.claimNumber);

            $location.url('\ThirdPartyClaimDetails');
        }
            //For policyholder
        else if (role === 'INSURED') {
            sessionStorage.setItem("ThirdPartyClaimId", obj.notificationParams.claimId);
            sessionStorage.setItem("ThirdPartyClaimNo", obj.notificationParams.claimNumber);
            $location.url('\ThirdPartyClaimDetails');
        }
            //For vendor associate
        else if (role === 'VENDOR ASSOCIATE') {
            sessionStorage.setItem("VendorAssociateClaimId", obj.notificationParams.claimId);
            sessionStorage.setItem("VendorAssociateClaimNo", obj.notificationParams.claimNumber);

            $location.url('\VendorAssociateClaimDetails');
        }
            //For Claim Supervisor
        else if (role === 'SUPERVISOR') {
            sessionStorage.setItem("SupervisorClaimId", obj.notificationParams.claimId);
            sessionStorage.setItem("SupervisorClaimNo", obj.notificationParams.claimNumber);
            $location.url('\SupervisorClaimDetails');
        }
        else if (role === "CLAIM MANAGER" || role === "CLAIM CENTER ADMIN" || role === "AGENT") {
            sessionStorage.setItem("ManagerScreenClaimId", obj.notificationParams.claimId);
            sessionStorage.setItem("ManagerScreenClaimNo", obj.notificationParams.claimNumber);
            $location.url('\ClaimCenter-ClaimDetails');
        }

    };

    $scope.IsAccess = IsAccess;
    function IsAccess(param) {
        if ($scope.ScreenList === null)
            $scope.ScreenList = RoleBasedService.GetUserScreenListFromSession();
        var abc = $scope.ScreenList;
        //var index = $scope.ScreenList.indexOf(param);
        //if(index !==-1)
        //{           
        //    return true;
        //}
        //else
        //{
        //    if ("webuser@artigem.com" === sessionStorage.getItem("UserName"))
        //        return true
        //    else
        //    return false;
        //}
        //When need to turn off Role based screen use this and comment above part
        // return true;      
        var list = $filter('filter')($scope.ScreenList, { ScreenCode: param });
        if (list!=null && list.length > 0) {
            if (list[0].ScreenCode === param) return true;
            else
                return false;
        }
        else {
            //if ("webuser@artigem.com" === sessionStorage.getItem("UserName"))
            //    return true
            //else
            return false;
        }
    }

    $scope.Name = sessionStorage.getItem("Name");
    //$scope.toggleSidebar = function () {
    //    var body = $('body');
    //    var sidebar = $('.page-sidebar');
    //    var sidebarMenu = $('.page-sidebar-menu');
    //    $(".sidebar-search", sidebar).removeClass("open");

    //    if (body.hasClass("page-sidebar-closed")) {
    //        body.removeClass("page-sidebar-closed");
    //        sidebarMenu.removeClass("page-sidebar-menu-closed");
    //        if (Cookies) {
    //            Cookies.set('sidebar_closed', '0');
    //        }
    //    } else {
    //        body.addClass("page-sidebar-closed");
    //        sidebarMenu.addClass("page-sidebar-menu-closed");
    //        if (body.hasClass("page-sidebar-fixed")) {
    //            sidebarMenu.trigger("mouseleave");
    //        }
    //        if (Cookies) {
    //            Cookies.set('sidebar_closed', '1');
    //        }
    //    }

    //    $(window).trigger('resize');


    //};
    $scope.Logout = Logout;
    function Logout(e) {

        if (angular.isDefined(sessionStorage.getItem("IsVendorLogIn")) && (sessionStorage.getItem("IsVendorLogIn") === "True")) {
            sessionStorage.setItem("IsVendorLogIn", undefined);
            //document.body.style.backgroundColor = "#364150";
            $(".wrapBoxShodow").css("box-shadow", "0px 1px 16px 1px #364150");
           
            UserService.removeUserDetails();
            sessionStorage.setItem("apiurl", APIURL)
            sessionStorage.setItem("receipturl", ReceiptURL);
            sessionStorage.setItem("ExportUrl", ExportURL);
            sessionStorage.setItem("Xoriginator", Xoriginator);
            sessionStorage.setItem("VendorDetailsTemplate", VendorDetailsTemplate);
            sessionStorage.setItem("claimProfile", claimProfile);
            sessionStorage.setItem("PolicyholderAppListURL", PolicyholderAppListURL);
            $location.path('/login');
        }
        else {
            var myE2 = angular.element(document.querySelector('.page-wrapper'));
            myE2.removeClass('wrapBoxShodow');
            //document.body.style.backgroundColor = "#364150";
            $(".wrapBoxShodow").css("box-shadow", "0px 1px 16px 1px #364150");
            var APIURL = sessionStorage.getItem("apiurl")
            var ReceiptURL = sessionStorage.getItem("receipturl");
            var ExportURL = sessionStorage.getItem("ExportUrl");
            var Xoriginator = sessionStorage.getItem("Xoriginator");
            var VendorDetailsTemplate = sessionStorage.getItem("VendorDetailsTemplate");
            var claimProfile = sessionStorage.getItem("claimProfile");
            var PolicyholderAppListURL = sessionStorage.getItem("PolicyholderAppListURL");
            UserService.removeUserDetails();
            sessionStorage.setItem("apiurl", APIURL)
            sessionStorage.setItem("receipturl", ReceiptURL);
            sessionStorage.setItem("ExportUrl", ExportURL);
            sessionStorage.setItem("Xoriginator", Xoriginator);
            sessionStorage.setItem("VendorDetailsTemplate", VendorDetailsTemplate);
            sessionStorage.setItem("claimProfile", claimProfile);
            sessionStorage.setItem("PolicyholderAppListURL", PolicyholderAppListURL);
            $location.path('/login');
        }
    }

}]);
MetronicApp.config(['KeepaliveProvider', 'IdleProvider', function (KeepaliveProvider, IdleProvider) {
    IdleProvider.idle(600); // in seconds user ideal time start after 600000
    IdleProvider.timeout(5); // wait seconds user gets in idel state
    //KeepaliveProvider.interval(2); // in seconds
    //KeepaliveProvider.http('/api/web'); // URL that makes sure session is alive call the method to get the token has expired or not
}]);
/* Setup Layout Part - Sidebar */
MetronicApp.controller('SidebarController', ['$state', '$scope', '$translatePartialLoader', '$translate', '$filter', 'RoleBasedService', function ($state, $scope, $translatePartialLoader, $translate, $filter, RoleBasedService) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initSidebar($state); // init sidebar
    });
    $translatePartialLoader.addPart('SideBar');
    $translate.refresh();
    $scope.ScreenList;
    //Method should be call on init method    
    function init() {
        //It again calling getscreenlist so list is null make anothre method which return screen list form session storage
        $scope.ScreenList = RoleBasedService.GetUserScreenListFromSession();
    }
    init();

    $scope.IsAccess = IsAccess;
    function IsAccess(param) {
        if ($scope.ScreenList === null)
            $scope.ScreenList = RoleBasedService.GetUserScreenListFromSession();
        //var index = $scope.ScreenList.indexOf(param);
        //if(index !==-1)
        //{           
        //    return true;
        //}
        //else
        //{
        //    if ("webuser@artigem.com" === sessionStorage.getItem("UserName"))
        //        return true
        //    else
        //    return false;
        //}
        //When need to turn off Role based screen use this and comment above part
        // return true;      
        var list = $filter('filter')($scope.ScreenList, { ScreenCode: param });
        if (list.length > 0)
            return true;
        else {
            if ("webuser@artigem.com" === sessionStorage.getItem("UserName"))
                return true;
            else
                return false;
        }
    }


}]);

/* Setup Layout Part - Sidebar */
MetronicApp.controller('PageHeadController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Quick Sidebar */
MetronicApp.controller('QuickSidebarController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        setTimeout(function () {
            QuickSidebar.init(); // init quick sidebar        
        }, 2000);
    });
}]);

/* Setup Layout Part - Theme Panel */
MetronicApp.controller('ThemePanelController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Footer */
MetronicApp.controller('FooterController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initFooter(); // init footer
    });
}]);

/* Setup Rounting For All Pages */
MetronicApp.config(['$stateProvider', '$urlRouterProvider', '$urlMatcherFactoryProvider', function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
    // Redirect any unmatched url and if user not logined or unautherised access
    var VendorAssociate = "VENDOR ASSOCIATE";
    var VendorAdmin = "VENDOR COMPANY ADMINISTRATOR";
    var ShippingAdmin = 'SHIPPING ADMINISTRATOR';
    var VendorContact = "VENDOR CONTACT";
    var GemLabAdmin = "GEMLAB ADMINISTRATOR";
    var SalseCoOrdinator="SALES CO-ORDINATOR";
    var AccountingAdmin = "ACCOUNTING ADMINISTRATOR";
    var VENDOR_SUPERVISOR = "VENDOR SUPERVISOR";
    //For case Insensitive url 
    $urlMatcherFactoryProvider.caseInsensitive(true);
    $stateProvider
        //vendor Login
         .state('login', {
             url: "/login",
             templateUrl: "views/VendorPortal/VendorLogin.html",
             data: { pageTitle: '' },
             controller: "VendorLoginController",
             resolve: {
                 deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                     return $ocLazyLoad.load({
                         name: 'MetronicApp',
                         insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                         files: [
                            'assets/global/plugins/morris/morris.css',
                            'assets/global/plugins/morris/morris.min.js',
                            'assets/global/plugins/morris/raphael-min.js',
                            'assets/global/plugins/jquery.sparkline.min.js',
                            'assets/pages/css/login.css',
                            'views/VendorPortal/VendorLoginController.js',
                             'js/Services/CommonServices/AuthHeaderService.js',
                             'js/Services/VendorPortal/VendorLoginService.js'
                         ]
                     });
                 }]
             }
         })

        .state('forgotpassword', {
            url: "/forgotpassword",
            //templateUrl: "views/User/ForgotPassword.html",
            templateUrl: "views/User/ForgetPass.html",
            data: { pageTitle: 'Forgot Password' },
            controller: "ForgotPasswordController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                             'assets/pages/css/login-5.min.css',
                              'assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
                                'assets/global/plugins/backstretch/jquery.backstretch.min.js',
                          'assets/pages/scripts/login-5.js',
                           'js/Services/CommonServices/AuthHeaderService.js',
                          'js/Services/ForgetpasswordService.js',
                          'views/User/ForgotPasswordController.js',

                        ]
                    });
                }]
            }
        })
        //External vendor registraion
        .state('NewVendorRegistration', {
            url: "/NewVendorRegistration",
            templateUrl: "views/VendorPortal/NewVendorRegistration.html",
            data: { pageTitle: '' },
            controller: "NewVendorRegistrationController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                             'assets/global/plugins/morris/morris.css',
                           'assets/global/plugins/morris/morris.min.js',
                           'assets/global/plugins/morris/raphael-min.js',
                           'assets/global/plugins/jquery.sparkline.min.js',
                           'assets/pages/css/login.css',
                           'views/VendorPortal/NewVendorRegistrationController.js',
                            'js/Services/CommonServices/AuthHeaderService.js',
                            'js/Services/VendorPortal/NewVendorRegistrationService.js'
                        ]
                    });
                }]
            }
        })
        .state('register', {
            url: "/register",
            templateUrl: "views/User/RegisterUser.html",
            data: { pageTitle: 'Register' },
            controller: "RegisterController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                           'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css',
                           'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',
                           'assets/pages/css/login.css',
                            'js/Services/CommonServices/AuthHeaderService.js',
                           'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                            'js/Services/RegisterUserService.js',
                           'views/User/RegisterController.js'
                        ]
                    });
                }]
            }
        })

         .state('AdjusterGlobalSearch', {
             url: "/AdjusterGlobalSearch",
             templateUrl: "views/ThirdPartyVendor/AdjusterGlobalSearch.html",
             data: {
                 pageTitle: 'Search Result',
                 roles: [VendorAssociate, VendorAdmin, ShippingAdmin, VendorContact, GemLabAdmin]
             },
             controller: "AdjusterGlobalSearchController",
             resolve: {
                 deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                     return $ocLazyLoad.load({
                         name: 'MetronicApp',
                         insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                         files: [
                              'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                               'assets/global/plugins/select2/css/select2.min.css',
                               'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                               'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',

                                'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                               'assets/global/plugins/select2/js/select2.full.min.js',
                               'assets/pages/scripts/components-bootstrap-select.min.js',
                               'assets/pages/scripts/components-select2.min.js',
                              'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                             'assets/global/plugins/select2/js/select2.full.min.js',

                             'assets/pages/scripts/components-bootstrap-select.min.js',
                             'assets/pages/scripts/components-select2.min.js',
                             'views/ThirdPartyVendor/AdjusterGlobalSearchController.js',
                               //services
                               'js/Services/CommonServices/AuthHeaderService.js',
                                'js/Services/ThirdPartyVendor/AdjusterDashboardService.js',
                                'views/GlobalSearch/DocumentDetailsController.js',
                                

                         ]
                     });
                 }]
             }
         })

        .state('UploadClaimFromCSV', {
            url: "/UploadClaimFromCSV",
            templateUrl: "views/UploadClaim/UploadClaimFromCSV.html",
            data: { pageTitle: 'Upload Claim' },
            controller: "UploadClaimFromCSVController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                             'views/UploadClaim/UploadClaimFromCSVController.js',
                             'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                             'assets/global/plugins/select2/css/select2.min.css',
                             'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                             'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                             'assets/global/plugins/select2/js/select2.full.min.js',
                             'assets/pages/scripts/components-bootstrap-select.min.js',
                             'assets/pages/scripts/components-select2.min.js',
                              'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css',
                             'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',
                             'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                              //services
                             'js/Services/CommonServices/AuthHeaderService.js',
                             'js/Services/UploadClaim/UploadClaimFromCSVService.js'
                        ]
                    });
                }]
            }
        })


        .state('CreateServiceInvoice', {
            url: "/CreateServiceInvoice",
            templateUrl: "views/ThirdPartyVendor/CreateServiceInvoice.html",
            data: {
                pageTitle: 'New Invoice',
                roles: [VendorContact, VendorAssociate]
            },
            controller: "CreateServiceInvoiceController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [

                             'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                             'assets/global/plugins/select2/css/select2.min.css',
                             'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                             'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css',
                             'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',


                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                            'assets/global/plugins/select2/js/select2.full.min.js',

                            'assets/pages/scripts/components-bootstrap-select.min.js',
                            'assets/pages/scripts/components-select2.min.js',
                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                             'views/ThirdPartyVendor/CreateServiceInvoiceController.js',
                            //services
                            'js/Services/CommonServices/AuthHeaderService.js',
                            'js/Services/ThirdPartyVendor/CreateServiceInvoiceService.js',
                        ]
                    });
                }]
            }
        })


           .state('ServiceRequestInvoicesVendor',
        {
            url: "/ServiceRequestInvoicesVendor",
            templateUrl: "views/ThirdPartyVendor/ServiceRequestInvoicesVendor.html",
            data: { pageTitle: 'Third Party Vendor' },
            controller: "ServiceRequestInvoicesVendorController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                              'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                              'assets/global/plugins/select2/css/select2.min.css',
                              'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                              'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                              'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css',
                              'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',
                               'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                              'assets/global/plugins/select2/js/select2.full.min.js',
                              'assets/pages/scripts/components-bootstrap-select.min.js',
                              'assets/pages/scripts/components-select2.min.js',
                             'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                             'assets/global/plugins/select2/js/select2.full.min.js',
                              'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',

                            'views/ThirdPartyVendor/ServiceRequestInvoicesVendorController.js',
                                //services
                            'js/Services/CommonServices/AuthHeaderService.js',

                            'js/Services/ThirdPartyVendor/ServiceRequestInvoicesVendorService.js'
                        ]
                    });
                }]
            }
        })
         .state('ServiceRequestInvoicesAssociate',
        {
            url: "/ServiceRequestInvoicesAssociate",
            templateUrl: "views/VendorAssociate/ServiceRequestInvoicesAssociate.html",
            data: { pageTitle: 'Associate' },
            controller: "ServiceRequestInvoicesAssociateController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                              'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                              'assets/global/plugins/select2/css/select2.min.css',
                              'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                              'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                              'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css',
                              'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',
                               'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                              'assets/global/plugins/select2/js/select2.full.min.js',
                              'assets/pages/scripts/components-bootstrap-select.min.js',
                              'assets/pages/scripts/components-select2.min.js',
                             'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                             'assets/global/plugins/select2/js/select2.full.min.js',
                              'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                            'views/VendorAssociate/ServiceRequestInvoicesAssociateController.js',
                            //services
                            'js/Services/CommonServices/AuthHeaderService.js',
                            'js/Services/VendorAssociate/ServiceRequestInvoicesAssociateService.js'
                        ]
                    });
                }]
            }
        })

         .state('ServiceRequestInvoices',
        {
            url: "/ServiceRequestInvoices",
            templateUrl: "views/ClaimsSupervisor/ServiceRequestInvoices.html",
            data: { pageTitle: 'SuperVisor' },
            controller: "ServiceRequestInvoicesController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                              'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                              'assets/global/plugins/select2/css/select2.min.css',
                              'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                              'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                              'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css',
                              'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',
                               'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                              'assets/global/plugins/select2/js/select2.full.min.js',
                              'assets/pages/scripts/components-bootstrap-select.min.js',
                              'assets/pages/scripts/components-select2.min.js',
                             'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                             'assets/global/plugins/select2/js/select2.full.min.js',
                              'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                            'views/ClaimsSupervisor/ServiceRequestInvoicesController.js',
                            //services
                            'js/Services/CommonServices/AuthHeaderService.js',
                            'js/Services/ClaimSupervisor/ServiceRequestInvoicesService.js'
                        ]
                    });
                }]
            }
        })


          .state('ServiceRequestInvoiceDetails',
        {
            url: "/ServiceRequestInvoiceDetails",
            templateUrl: "views/ClaimsSupervisor/ServiceRequestInvoiceDetails.html",
            data: { pageTitle: 'Invoice Details' },
            controller: "ServiceRequestInvoiceDetailsController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                              'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                              'assets/global/plugins/select2/css/select2.min.css',
                              'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                              'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                              'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css',
                              'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',
                              'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                             'assets/global/plugins/select2/js/select2.full.min.js',
                             'assets/pages/scripts/components-bootstrap-select.min.js',
                             'assets/pages/scripts/components-select2.min.js',
                             'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                             'assets/global/plugins/select2/js/select2.full.min.js',
                             'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                            'views/ClaimsSupervisor/ServiceRequestInvoiceDetailsController.js',
                                //services
                            'js/Services/CommonServices/AuthHeaderService.js',
                            'js/Services/ClaimSupervisor/SupervisorClaimDetailsService.js',
                            'js/Services/ClaimSupervisor/VendorInvoiceDetailsService.js'
                        ]
                    });
                }]
            }
        })


         .state('AttachmentMapping', {
             url: "/AttachmentMapping",
             templateUrl: "views/DocumentMapping/AttachmentMapping.html",
             data: { pageTitle: 'Attachment Mapping' },
             controller: "AttachmentMappingController",
             resolve: {
                 deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                     return $ocLazyLoad.load({
                         name: 'MetronicApp',
                         insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                         files: [
                             'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                             'assets/global/plugins/select2/css/select2.min.css',
                             'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                             'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                             'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                             'assets/global/plugins/select2/js/select2.full.min.js',
                             'assets/pages/scripts/components-bootstrap-select.min.js',
                             'assets/pages/scripts/components-select2.min.js',
                             'views/DocumentMapping/AttachmentMappingController.js',
                             //'views/Adjuster/ReceiptMapperLabelController.js',
                              //services
                              'js/Services/CommonServices/AuthHeaderService.js',
                              'js/Services/DocumentMapping/DocumentMappingService.js'
                         ]
                     });
                 }]
             }
         })

         .state('AdjusterAssignServiceRequest', {
             url: "/AdjusterAssignServiceRequest",
             templateUrl: "views/Adjuster/AdjusterAssignServiceRequest.html",
             data: { pageTitle: 'Assign Service Request' },
             controller: "AdjusterAssignServiceRequesttController",
             resolve: {
                 deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                     return $ocLazyLoad.load({
                         name: 'MetronicApp',
                         insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                         files: [
                               'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                             'assets/global/plugins/select2/css/select2.min.css',
                             'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                             'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                             'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                             'assets/global/plugins/select2/js/select2.full.min.js',
                             'assets/pages/scripts/components-bootstrap-select.min.js',
                             'assets/pages/scripts/components-select2.min.js',
                              'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                              //controller
                             'views/Adjuster/AdjsuterAssignServiceRequestController.js',

                              //services
                              'js/Services/CommonServices/AuthHeaderService.js',
                              'js/Services/Adjuster/AdjusterServiceRequestService.js'
                         ]
                     });
                 }]
             }
         })

          //Sub Menu Content Categories Under Environment Settings
         .state('ContentCategories', {
             url: "/ContentCategories",
             templateUrl: "views/Administrator/EnvironmentContentCategories.html",
             data: { pageTitle: 'ContentCategories' },
             controller: "EnvironmentSettingController",
             resolve: {
                 deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                     return $ocLazyLoad.load({
                         name: 'MetronicApp',
                         insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                         files: [
                            //  'views/Company/RoleController.js',
                              'views/Administrator/ContentCategoriesController.js',
                              'views/Administrator/AddSubCategoryController.js',
                              'views/Administrator/EnvironmentSettingController.js',
                              'views/Administrator/EmailTempalteController.js',
                              'views/Administrator/ClaimFormController.js',
                              'views/Administrator/ContentCategoriesController.js',
                              'views/Administrator/HomeOwnersPoliciesController.js',

                             'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                             'assets/global/plugins/select2/css/select2.min.css',
                             'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                              'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                             'assets/global/plugins/select2/js/select2.full.min.js',
                             'assets/pages/scripts/components-bootstrap-select.min.js',
                             'assets/pages/scripts/components-select2.min.js',
                             //services
                             'js/Services/CommonServices/AuthHeaderService.js',
                            'js/Services/HomeOwenerPolicy/HomeOwenerPolicyService.js',
                             'js/Services/Administrator/CategoryService.js',
                             'js/Services/Company/AddSubCategoryService.js',
                             //'js/Services/Company/CompanyService.js',
                             //'js/Services/Company/CompanyContactsService.js',
                             //'js/Services/Company/CompanyAdministrationService.js',
                             'js/Services/Administrator/AlertService.js',
                             'js/Services/ClaimForm/ClaimFormService.js'
                         ]
                     });
                 }]
             }
         })

        //Sub Menu Home Owner's Policies Under Environment Settings
         .state('HomeOwnersPolicies', {
             url: "/HomeOwnersPolicies",
             templateUrl: "views/Administrator/EnvironmentHomeOwnersPolicies.html",
             data: { pageTitle: 'ContentCategories' },
             controller: "EnvironmentSettingController",
             resolve: {
                 deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                     return $ocLazyLoad.load({
                         name: 'MetronicApp',
                         insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                         files: [
                            //  'views/Company/RoleController.js',
                              'views/Administrator/ContentCategoriesController.js',
                              'views/Administrator/AddSubCategoryController.js',
                              'views/Administrator/EnvironmentSettingController.js',
                              'views/Administrator/EmailTempalteController.js',
                              'views/Administrator/ClaimFormController.js',
                              'views/Administrator/ContentCategoriesController.js',
                              'views/Administrator/HomeOwnersPoliciesController.js',

                             'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                             'assets/global/plugins/select2/css/select2.min.css',
                             'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                              'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                             'assets/global/plugins/select2/js/select2.full.min.js',
                             'assets/pages/scripts/components-bootstrap-select.min.js',
                             'assets/pages/scripts/components-select2.min.js',
                             //services
                             'js/Services/CommonServices/AuthHeaderService.js',
                            'js/Services/HomeOwenerPolicy/HomeOwenerPolicyService.js',
                             'js/Services/Administrator/CategoryService.js',
                             'js/Services/Company/AddSubCategoryService.js',
                             //'js/Services/Company/CompanyService.js',
                             //'js/Services/Company/CompanyContactsService.js',
                             //'js/Services/Company/CompanyAdministrationService.js',
                             'js/Services/Administrator/AlertService.js',
                             'js/Services/ClaimForm/ClaimFormService.js'
                         ]
                     });
                 }]
             }
         })
         //added sub menu remittance address
          .state('Services', {
              url: "/Services",
              templateUrl: "views/Administrator/Services.html",
              data: { pageTitle: 'Services' },
              controller: "ServicesController",
              resolve: {
                  deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                      return $ocLazyLoad.load({
                          name: 'MetronicApp',
                          insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                          files: [
                               'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                               'assets/global/plugins/select2/css/select2.min.css',
                               'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                               'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                               'assets/global/plugins/select2/js/select2.full.min.js',
                               'assets/pages/scripts/components-bootstrap-select.min.js',
                               'assets/pages/scripts/components-select2.min.js',
                               'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css',
                               'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',
                               'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                               'views/Administrator/ServicesController.js',
                                //services
                               'js/Services/CommonServices/AuthHeaderService.js',
                               'js/Services/Administrator/EnvironmentSettingsService.js'
                          ]
                      });
                  }]
              }
          })

         //added sub menu remittance address
          .state('ContentService', {
              url: "/ContentService",
              templateUrl: "views/Administrator/ContentService.html",
              data: { pageTitle: 'Content Services' },
              controller: "ContentServiceController",
              resolve: {
                  deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                      return $ocLazyLoad.load({
                          name: 'MetronicApp',
                          insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                          files: [
                               'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                               'assets/global/plugins/select2/css/select2.min.css',
                               'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                               'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                               'assets/global/plugins/select2/js/select2.full.min.js',
                               'assets/pages/scripts/components-bootstrap-select.min.js',
                               'assets/pages/scripts/components-select2.min.js',
                                'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css',
                               'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',
                               'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',

                                'views/Administrator/ContentServiceController.js',
                                //services
                               'js/Services/CommonServices/AuthHeaderService.js',
                             'js/Services/Administrator/EnvironmentSettingsService.js'


                          ]
                      });
                  }]
              }
          })
        //Sub Menu Claim Form Under Environment Settings
         .state('ClaimForms', {
             url: "/ClaimForms",
             templateUrl: "views/Administrator/EnvironmentClaimForm.html",
             data: { pageTitle: 'ContentCategories' },
             controller: "EnvironmentSettingController",
             resolve: {
                 deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                     return $ocLazyLoad.load({
                         name: 'MetronicApp',
                         insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                         files: [
                            //  'views/Company/RoleController.js',
                              'views/Administrator/ContentCategoriesController.js',
                              'views/Administrator/AddSubCategoryController.js',
                              'views/Administrator/EnvironmentSettingController.js',
                              'views/Administrator/EmailTempalteController.js',
                              'views/Administrator/ClaimFormController.js',
                              'views/Administrator/ContentCategoriesController.js',
                              'views/Administrator/HomeOwnersPoliciesController.js',

                             'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                             'assets/global/plugins/select2/css/select2.min.css',
                             'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                              'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                             'assets/global/plugins/select2/js/select2.full.min.js',
                             'assets/pages/scripts/components-bootstrap-select.min.js',
                             'assets/pages/scripts/components-select2.min.js',
                             //services
                             'js/Services/CommonServices/AuthHeaderService.js',
                            'js/Services/HomeOwenerPolicy/HomeOwenerPolicyService.js',
                             'js/Services/Administrator/CategoryService.js',
                             'js/Services/Company/AddSubCategoryService.js',
                             //'js/Services/Company/CompanyService.js',
                             //'js/Services/Company/CompanyContactsService.js',
                             //'js/Services/Company/CompanyAdministrationService.js',
                             'js/Services/Administrator/AlertService.js',
                             'js/Services/ClaimForm/ClaimFormService.js'
                         ]
                     });
                 }]
             }
         })


         //Environment Setting
         .state('UserAdministration', {
             url: "/UserAdministration",
             templateUrl: "views/Company/CompanyAdminstration.html",
             data: { pageTitle: 'User Administration' },
             controller: "CompanyAdminstrationController",
             resolve: {
                 deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                     return $ocLazyLoad.load({
                         name: 'MetronicApp',
                         insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                         files: [
                             'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                             'assets/global/plugins/select2/css/select2.min.css',
                             'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                              'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                             'assets/global/plugins/select2/js/select2.full.min.js',
                             'assets/pages/scripts/components-bootstrap-select.min.js',
                             'assets/pages/scripts/components-select2.min.js',
                             //controller
                             'views/Company/CompanyAdminstration.js',
                             //services
                             'js/Services/CommonServices/AuthHeaderService.js',
                            'js/Services/HomeOwenerPolicy/HomeOwenerPolicyService.js',
                             'js/Services/Administrator/CategoryService.js',
                             'js/Services/Company/AddSubCategoryService.js',

                             //'js/Services/Company/CompanyService.js',
                             //'js/Services/Company/CompanyContactsService.js',
                             'js/Services/Company/CompanyAdminstrationService.js',
                             'js/Services/Administrator/AlertService.js',

                         ]
                     });
                 }]
             }
         })


         //Added for sub menu Users
         .state('Users', {
             url: "/Users",
             templateUrl: "views/Company/Users.html",
             data: { pageTitle: 'Users' },
             controller: "CompanyAdminstrationController",
             resolve: {
                 deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                     return $ocLazyLoad.load({
                         name: 'MetronicApp',
                         insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                         files: [
                             'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                             'assets/global/plugins/select2/css/select2.min.css',
                             'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                              'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                             'assets/global/plugins/select2/js/select2.full.min.js',
                             'assets/pages/scripts/components-bootstrap-select.min.js',
                             'assets/pages/scripts/components-select2.min.js',
                             //controller
                             'views/Company/CompanyAdminstration.js',
                             //services
                             'js/Services/CommonServices/AuthHeaderService.js',
                            'js/Services/HomeOwenerPolicy/HomeOwenerPolicyService.js',
                             'js/Services/Administrator/CategoryService.js',
                             'js/Services/Company/AddSubCategoryService.js',

                             //'js/Services/Company/CompanyService.js',
                             //'js/Services/Company/CompanyContactsService.js',
                             'js/Services/Company/CompanyAdminstrationService.js',
                             'js/Services/Administrator/AlertService.js',

                         ]
                     });
                 }]
             }
         })

        //Office
        .state('Office', {
            url: "/Office",
            templateUrl: "views/Office/Office.html",
            data: { pageTitle: 'Office' },
            controller: "OfficeController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'views/Office/MemberContactController.js',
                            'views/Office/NewBranchController.js',
                            'views/Office/OfficeSummaryController.js',
                            'views/Office/OfficeController.js',
                            //services
                            'js/Services/CommonServices/AuthHeaderService.js',
                            'js/Services/Office/OfficeNewBranchService.js',
                            'js/Services/Office/OfficeService.js',
                            'js/Services/Office/OfficeSummaryService.js'
                        ]
                    });
                }]
            }
        })

        // Edit Member
         .state('AdminstrationsEditMember', {
             url: "/AdminstrationsEditMember",
             templateUrl: "views/Company/EditMemberAdminstrations.html",
             data: { pageTitle: 'Member Details' },
             controller: "EditMemberAdminstrationsController",
             resolve: {
                 deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                     return $ocLazyLoad.load({
                         name: 'MetronicApp',
                         insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                         files: [
                              'views/Company/EditMemberAdminstrationsController.js',
                              'views/Company/AssignRoleToMemberController.js',

                               'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                              'assets/global/plugins/select2/css/select2.min.css',
                              'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                             'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                              'assets/global/plugins/select2/js/select2.full.min.js',
                              'assets/pages/scripts/components-bootstrap-select.min.js',
                              'assets/pages/scripts/components-select2.min.js',
                               //services
                              'js/Services/CommonServices/AuthHeaderService.js',
                              'js/Services/Company/CompanyEditMemberAdministrationService.js',
                              'js/Services/Company/CompanyAssignRoleToMemberService.js'


                         ]
                     });
                 }]
             }
         })

        //Third party vendor

         .state('ThirdPartyServiceRequestEdit', {
             url: "/ThirdPartyServiceRequestEdit",
             templateUrl: "views/ThirdPartyVendor/ThirdPartyServiceRequestEdit.html",
             data: {
                 pageTitle: 'Edit Service Request',
                 roles: [VendorContact]
             },
             controller: "ThirdPartyServiceRequestEditController",
             resolve: {
                 deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                     return $ocLazyLoad.load({
                         name: 'MetronicApp',
                         insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                         files: [
                               'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                             'assets/global/plugins/select2/css/select2.min.css',
                             'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                             'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                             'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                             'assets/global/plugins/select2/js/select2.full.min.js',
                             'assets/pages/scripts/components-bootstrap-select.min.js',
                             'assets/pages/scripts/components-select2.min.js',
                              'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                              //controller
                             'views/ThirdPartyVendor/ThirdPartyServiceRequestEditController.js',

                              //services
                              'js/Services/CommonServices/AuthHeaderService.js',
                              'js/Services/ThirdPartyVendor/ThirdPartyServiceRequestEditService.js'
                         ]
                     });
                 }]
             }
         })

        .state('ThirdPartyAssignServiceRequest', {
            url: "/ThirdPartyAssignServiceRequest",
            templateUrl: "views/ThirdPartyVendor/ThirdPartyAssignServiceRequest.html",
            data: {
                pageTitle: 'Assign Service Request',
                roles: [VendorContact]
            },
            controller: "ThirdPartyAssignServiceRequesttController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                              'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                            'assets/global/plugins/select2/css/select2.min.css',
                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                            'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                            'assets/global/plugins/select2/js/select2.full.min.js',
                            'assets/pages/scripts/components-bootstrap-select.min.js',
                            'assets/pages/scripts/components-select2.min.js',
                             'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                             //controller
                            'views/ThirdPartyVendor/ThirdPartyAssignServiceRequestController.js',

                             //services
                              'js/Services/ThirdPartyVendor/ThirdPartyServiceRequestEditService.js',
                             'js/Services/CommonServices/AuthHeaderService.js'
                        ]
                    });
                }]
            }
        })

        .state('ThirdPartyVendorDashboard', {
            url: "/ThirdPartyVendorDashboard",
            templateUrl: "views/ThirdPartyVendor/ThirdPartyDashboard.html",
            data: {
                pageTitle: 'Third Party Vendor',
                roles: [VendorContact]
            },
            controller: "ThirdPartyDashboardController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                               'views/ThirdPartyVendor/ThirdPartyDashboardController.js',

                             'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                             'assets/global/plugins/select2/css/select2.min.css',
                             'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                             'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                             'assets/global/plugins/select2/js/select2.full.min.js',
                             'assets/pages/scripts/components-bootstrap-select.min.js',
                             'assets/pages/scripts/components-select2.min.js',

                              //services
                             'js/Services/CommonServices/AuthHeaderService.js',
                              'js/Services/ThirdPartyVendor/ThirdPartyVendorDashboardService.js'

                        ]
                    });
                }]
            }
        })

         .state('ThirdPartyAllClaims', {
             url: "/ThirdPartyAllClaims",
             templateUrl: "views/ThirdPartyVendor/ThirdPartyAllClaims.html",
             data: {
                 pageTitle: 'All Claims',
                 roles: [VendorContact, VendorAssociate, VENDOR_SUPERVISOR]
             },
             controller: "ThirdPartyAllClaimsController",
             resolve: {
                 deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                     return $ocLazyLoad.load({
                         name: 'MetronicApp',
                         insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                         files: [
                              'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                              'assets/global/plugins/select2/css/select2.min.css',
                              'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                              'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                              'assets/global/plugins/select2/js/select2.full.min.js',
                              'assets/pages/scripts/components-bootstrap-select.min.js',
                              'assets/pages/scripts/components-select2.min.js',

                               //services
                                'views/ThirdPartyVendor/ThirdPartyAllClaimsController.js',
                                'js/Services/CommonServices/AuthHeaderService.js',
                                'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                                'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                'assets/pages/scripts/components-date-time-pickers.min.js',
                                'js/Services/ThirdPartyVendor/ThirdPartyAllClaimsService.js'

                         ]
                     });
                 }]
             }
         })

        .state('ThirdPartyGlobalSearch', {
            url: "/ThirdPartyGlobalSearch",
            templateUrl: "views/ThirdPartyVendor/ThirdPartyGlobalSearch.html",
            data: {
                pageTitle: 'Global Search',
                roles: [VendorAssociate, VendorContact, GemLabAdmin]
            },
            controller: "ThirdPartyGlobalSearchController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                             'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                             'assets/global/plugins/select2/css/select2.min.css',
                             'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                             'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                             'assets/global/plugins/select2/js/select2.full.min.js',
                             'assets/pages/scripts/components-bootstrap-select.min.js',
                             'assets/pages/scripts/components-select2.min.js',
                             'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                             'assets/fullcalendar.css',
                              //services
                              'views/ThirdPartyVendor/ThirdPartyGlobalSearchController.js',
                             'js/Services/CommonServices/AuthHeaderService.js',
                              'js/Services/ThirdPartyVendor/ThirdPartyGlobalSearchService.js'

                        ]
                    });
                }]
            }
        })

         .state('VendorDetails', {
             url: "/ThirdPartyClaimDetails",
             templateUrl: "views/ThirdPartyVendor/ThirdPartyClaimDetails.html",
             data: {
                 pageTitle: 'Claim Details',
                 roles: [VendorContact]
             },
             controller: "ThirdPartyClaimDetailsController",
             resolve: {
                 deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                     return $ocLazyLoad.load({
                         name: 'MetronicApp',
                         insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                         files: [
                         'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                         'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                         'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                         'assets/global/plugins/select2/css/select2.min.css',
                         'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                         'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                         'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',
                         'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                         'assets/fullcalendar.css',
                         'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                         'assets/global/plugins/select2/js/select2.full.min.js',
                         'assets/pages/scripts/components-bootstrap-select.min.js',
                         'assets/pages/scripts/components-select2.min.js',
                         'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                         'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                         'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                         'assets/pages/scripts/components-date-time-pickers.min.js',
                         //Controller
                                'views/ThirdPartyVendor/ThirdPartyClaimDetailsController.js',
                                'views/ThirdPartyVendor/AddInvoicesController.js',
                                'views/ThirdPartyVendor/AddNewVendorController.js',
                                'views/ThirdPartyVendor/ItemValueController.js',
                                'views/ThirdPartyVendor/ShowClaimAttachmentController.js',
                                'views/ThirdPartyVendor/ShowNotesAttachmentController.js',
                                'views/ThirdPartyVendor/EventDetailsController.js',
                                'views/ThirdPartyVendor/AddNotePopupController.js',
                                'views/ThirdPartyVendor/AddEventPopupController.js',
                                'views/AllNotes/NoteDetailsController.js',
                                'views/Reports/ReportController.js',
                                'views/ThirdPartyVendor/ThirdPartyCreateInvoiceController.js',
                                'views/AddServiceForInvoice/AddServiceForInvoiceController.js',
                                'views/ThirdPartyVendor/PurchaseOrderPopupController.js',
                                'views/ThirdPartyVendor/LaborCostWorkCodeController.js',
                                'views/PurchaseOrder/PurchaseOrderDetailsController.js',
                                'views/ThirdPartyVendor/LaborCostWorkCodeController.js',
                                'views/ThirdPartyVendor/LaborCostWorkCodeController.js',
                                'views/PurchaseOrder/ItemReturnController.js',
                                'views/VendorSupplier/AddSupplierOnTheFlyController.js',                               
                                //services
                               'js/Services/CommonServices/AuthHeaderService.js',
                               'js/Services/ThirdPartyVendor/ThirdPartyClaimDetailsService.js',
                               'js/Services/ThirdPartyVendor/AdjusterPropertyClaimDetailsService.js',
                               'js/Services/ThirdPartyVendor/AddInvoicesService.js',
                               'js/Services/ThirdPartyVendor/ItemValueService.js',
                               'js/Services/ThirdPartyVendor/EventService.js',
                               'js/Services/ThirdPartyVendor/ThirdPartyInvoiceDetailsService.js',
                               'js/Services/ThirdPartyVendor/ServiceRequestOfferedService.js',
                               'js/Services/Report/ReportService.js',
                               'js/Services/PurchaseOrder/PurchaseOrderService.js',
                               'js/Services/VendorSupplier/NewVendorSupplierService.js',
                                'js/Services/AllNotes/AllNotesService.js'

                         ]
                     });
                 }]
             }
         })    
        
         .state('AddCustomItem', {
             url: "/AddCustomItem",
             templateUrl: "views/ThirdPartyVendor/AddCustomItem.html",
             data: {
                 pageTitle: 'Add Custom Item',
                 roles: [VendorContact, VendorAssociate]
             },
             controller: "AddCustomItemController",
             resolve: {
                 deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                     return $ocLazyLoad.load({
                         name: 'MetronicApp',
                         insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                         files: [
                              'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css',
                             'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                             'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                             'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                             'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                             'assets/pages/scripts/components-date-time-pickers.min.js',
                              'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                              'assets/global/plugins/select2/css/select2.min.css',
                              'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                              'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                              'assets/global/plugins/select2/js/select2.full.min.js',
                              'views/ThirdPartyVendor/AddCustomItemController.js',
                              'js/Services/CommonServices/AuthHeaderService.js',
                             'js/Services/ThirdPartyVendor/ThirdPartyLineItemDetails.js',
                              'views/ThirdPartyVendor/AddNewCustomItemController.js'
                         ]
                     });
                 }]
             }
         })

         .state('ThirdPartyAssignPostLoss', {
             url: "/ThirdPartyAssignPostLoss",
             templateUrl: "views/ThirdPartyVendor/AssignPostLostItem.html",
             data: {
                 pageTitle: 'Assign Post Loss',
                 roles: [VendorContact]
             },
             controller: "ThirdPartyAssignPostLostItemController",
             resolve: {
                 deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                     return $ocLazyLoad.load({
                         name: 'MetronicApp',
                         insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                         files: [
                                'views/ThirdPartyVendor/ThirdPartyClaimDetailsController.js',
                                'views/ThirdPartyVendor/AssignPostLostController.js',
                              'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                              'assets/global/plugins/select2/css/select2.min.css',
                              'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                              'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                              'assets/global/plugins/select2/js/select2.full.min.js',
                              'assets/pages/scripts/components-bootstrap-select.min.js',
                              'assets/pages/scripts/components-select2.min.js',

                               //services
                              'js/Services/CommonServices/AuthHeaderService.js',
                              'js/Services/ThirdPartyVendor/ThirdPartyClaimDetailsService.js'

                         ]
                     });
                 }]
             }
         })

           .state('ThirdPartyVendorCatalog', {
               url: "/ThirdPartyVendorCatalog",
               templateUrl: "views/ThirdPartyVendor/ThirdPartyVendorCatalog.html",
               data: {
                   pageTitle: 'Inventory',
                   roles: [VendorContact, VendorAssociate, VendorAdmin]
               },
               controller: "ThirdPartyVendorCatalogController",
               resolve: {
                   deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                       return $ocLazyLoad.load({
                           name: 'MetronicApp',
                           insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                           files: [
                                'views/ThirdPartyVendor/ThirdPartyVendorCatalogController.js',


                                'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                                'assets/global/plugins/select2/css/select2.min.css',
                                'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                'assets/global/plugins/select2/js/select2.full.min.js',
                                'assets/pages/scripts/components-bootstrap-select.min.js',
                                'assets/pages/scripts/components-select2.min.js',
                                 'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css',
                                'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',
                                'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                                 //services
                                'js/Services/CommonServices/AuthHeaderService.js',
                                'js/Services/ThirdPartyVendor/ThirdPartyCatalogService.js'


                           ]
                       });
                   }]
               }
           })



        .state('ThirdPartyAddItemToCatalog', {
            url: "/ThirdPartyAddItemToCatalog",
            templateUrl: "views/ThirdPartyVendor/ThirdPartyAddItemToCatalog.html",
            data: {
                pageTitle: 'Add Catalog Items',
                roles: [VendorContact, VendorAssociate, VendorAdmin]
            },
            controller: "ThirdPartyAddItemToCatalogController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                             'views/ThirdPartyVendor/ThirdPartyAddItemToCatalogController.js',
                             'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                             'assets/global/plugins/select2/css/select2.min.css',
                             'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                             'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                             'assets/global/plugins/select2/js/select2.full.min.js',
                             'assets/pages/scripts/components-bootstrap-select.min.js',
                             'assets/pages/scripts/components-select2.min.js',
                              //services
                             'js/Services/CommonServices/AuthHeaderService.js',
                             'js/Services/ThirdPartyVendor/ThirdPartyCatalogService.js'
                        ]
                    });
                }]
            }
        })

        .state('ThirdPartyVendorAdministration', {
            url: "/ThirdPartyVendorAdministration",
            templateUrl: "views/ThirdPartyVendor/ThirdPartyVendorAdministration.html",
            data: { pageTitle: 'Third Party Vendor Administration' },
            controller: "ThirdPartyVendorAdministrationController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                             'views/ThirdPartyVendor/ThirdPartyVendorAdministrationController.js',


                             'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                             'assets/global/plugins/select2/css/select2.min.css',
                             'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                             'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                             'assets/global/plugins/select2/js/select2.full.min.js',
                             'assets/pages/scripts/components-bootstrap-select.min.js',
                             'assets/pages/scripts/components-select2.min.js',
                              'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css',
                             'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',
                             'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                              //services
                             'js/Services/CommonServices/AuthHeaderService.js',
                             'js/Services/ThirdPartyVendor/ThirdPartyVendorAdministrationService.js'


                        ]
                    });
                }]
            }
        })

        //added sub menu company details
         .state('WorkflowManagement', {
             url: "/WorkflowManagement",
             templateUrl: "views/ThirdPartyVendor/WorkflowManagement.html",
             data: {
                 pageTitle: 'Workflow Management',
                 roles: [ VendorAdmin]
             },
             controller: "WorkflowManagementController",
             resolve: {
                 deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                     return $ocLazyLoad.load({
                         name: 'MetronicApp',
                         insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                         files: [
                              'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                              'assets/global/plugins/select2/css/select2.min.css',
                              'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                              'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                              'assets/global/plugins/select2/js/select2.full.min.js',
                              'assets/pages/scripts/components-bootstrap-select.min.js',
                              'assets/pages/scripts/components-select2.min.js',
                               'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css',
                              'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',
                              'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                              //Controller
                              'views/ThirdPartyVendor/WorkflowManagementController.js',
                              //services
                              'js/Services/CommonServices/AuthHeaderService.js',
                              'js/Services/ThirdPartyVendor/ThirdPartyVendorAdministrationService.js',
                              'js/Services/ThirdPartyVendor/WorkflowManagementService.js'
                         ]
                     });
                 }]
             }
         })

        .state('CompanyDetails', {
            url: "/CompanyDetails",
            templateUrl: "views/ThirdPartyVendor/CompanyDetails.html",
            data: {
                pageTitle: 'Company Details',
                roles: [ VendorAdmin]
            },
            controller: "ThirdPartyVendorAdministrationController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                             'views/ThirdPartyVendor/ThirdPartyVendorAdministrationController.js',


                             'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                             'assets/global/plugins/select2/css/select2.min.css',
                             'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                             'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                             'assets/global/plugins/select2/js/select2.full.min.js',
                             'assets/pages/scripts/components-bootstrap-select.min.js',
                             'assets/pages/scripts/components-select2.min.js',
                              'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css',
                             'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',
                             'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                              //services
                             'js/Services/CommonServices/AuthHeaderService.js',
                            'js/Services/ThirdPartyVendor/ThirdPartyVendorAdministrationService.js'


                        ]
                    });
                }]
            }
        })


        //added sub menu remittance address
        .state('RemittanceDetails', {
            url: "/RemittanceDetails",
            templateUrl: "views/ThirdPartyVendor/RemittanceDetails.html",
            data: {
                pageTitle: 'Remittance Details',
                roles: [VendorAdmin]
            },
            controller: "ThirdPartyVendorAdministrationController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                             'views/ThirdPartyVendor/ThirdPartyVendorAdministrationController.js',


                             'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                             'assets/global/plugins/select2/css/select2.min.css',
                             'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                             'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                             'assets/global/plugins/select2/js/select2.full.min.js',
                             'assets/pages/scripts/components-bootstrap-select.min.js',
                             'assets/pages/scripts/components-select2.min.js',
                              'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css',
                             'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',
                             'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                              //services
                             'js/Services/CommonServices/AuthHeaderService.js',
                            'js/Services/ThirdPartyVendor/ThirdPartyVendorAdministrationService.js'


                        ]
                    });
                }]
            }
        })

        .state('UploadItemsFromCSV', {
            url: "/UploadItemsFromCSV",
            templateUrl: "views/UploadPostLossItem/UploadItemsFromCSV.html",
            data: {
                pageTitle: 'Upload Post Loss Items',
                roles: [VendorContact]
            },
            controller: "UploadItemsFromCSVController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                             'views/UploadPostLossItem/UploadItemsFromCSVController.js',


                             'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                             'assets/global/plugins/select2/css/select2.min.css',
                             'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                             'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                             'assets/global/plugins/select2/js/select2.full.min.js',
                             'assets/pages/scripts/components-bootstrap-select.min.js',
                             'assets/pages/scripts/components-select2.min.js',
                              'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css',
                             'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',
                             'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                              //services
                             'js/Services/CommonServices/AuthHeaderService.js',
                             'js/Services/UploadPostLossItem/UploadItemsFromCSVService.js'


                        ]
                    });
                }]
            }
        })

        .state('UploadCatalogItem', {
            url: "/UploadCatalogItem",
            templateUrl: "views/UploadCatalogItems/UploadCatalogItems.html",
            data: {
                pageTitle: 'Upload Catalog Items',
                roles: [VendorContact, VendorAssociate, VendorAdmin]
            },
            controller: "UploadCatalogItemController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                             'views/UploadCatalogItems/UploadCatalogItemsController.js',
                             'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                             'assets/global/plugins/select2/css/select2.min.css',
                             'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                             'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                             'assets/global/plugins/select2/js/select2.full.min.js',
                             'assets/pages/scripts/components-bootstrap-select.min.js',
                             'assets/pages/scripts/components-select2.min.js',
                              'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css',
                             'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',
                             'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                              //services
                             'js/Services/CommonServices/AuthHeaderService.js',
                             'js/Services/UploadCatalogItems/UploadCatalogItemsService.js'
                        ]
                    });
                }]
            }
        })


         .state('BillsAndPayment', {
             url: "/BillsAndPayment",
             templateUrl: "views/ThirdPartyVendor/BillsAndPayment.html",
             data: {
                 pageTitle: 'BillsAndPayment',
                 roles: [VendorContact, VendorAssociate, VENDOR_SUPERVISOR]
             },
             controller: "BillsAndPaymentController",
             resolve: {
                 deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                     return $ocLazyLoad.load({
                         name: 'MetronicApp',
                         insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                         files: [

                              'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                              'assets/global/plugins/select2/css/select2.min.css',
                              'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                              'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                              'assets/global/plugins/select2/js/select2.full.min.js',
                              'assets/pages/scripts/components-bootstrap-select.min.js',
                              'assets/pages/scripts/components-select2.min.js',
                               'views/ThirdPartyVendor/BillsAndPaymentController.js',
                               //services
                              'js/Services/CommonServices/AuthHeaderService.js',
                              'js/Services/ThirdPartyVendor/AddEditThirdPartyInventoryService.js',
                              'js/Services/ThirdPartyVendor/BillsAndPaymentService.js'
                         ]
                     });
                 }]
             }
         })

        .state('VendorApprisal', {
            url: "/VendorApprisal",
            templateUrl: "views/VendorApprisal/VendorApprisal.html",
            data: {
                pageTitle: 'VendorApprisal',
                roles: [VendorAssociate, VendorAdmin, ShippingAdmin]
            },
            controller: "VendorApprisalController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                        'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                        'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                        'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                        'assets/global/plugins/select2/css/select2.min.css',
                        'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                        'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                        'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',
                        'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                        'assets/fullcalendar.css',
                        'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                        'assets/global/plugins/select2/js/select2.full.min.js',
                        'assets/pages/scripts/components-bootstrap-select.min.js',
                        'assets/pages/scripts/components-select2.min.js',
                        'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                        'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                        'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                        'assets/pages/scripts/components-date-time-pickers.min.js',
                        //Controllers
                        'views/ThirdPartyVendor/LineItemDetailsController.js',
                        'views/ThirdPartyVendor/AddInvoicesController.js',
                        'views/ThirdPartyVendor/ItemValueController.js',
                        'views/ThirdPartyVendor/AddItemNotePopupController.js',
                        'views/PurchaseOrder/PurchaseOrderDetailsController.js',
                        'views/Salvage/SalvageDetailsController.js',
                         'views/PurchaseOrder/ItemReturnController.js',
                        'views/ThirdPartyVendor/LaborCostWorkCodeController.js',
                        'views/ThirdPartyVendor/LaborCostWorkCodeController.js',
                        'views/VendorApprisal/VendorApprisalController.js',
                        'views/VendorApprisal/ApprisalPreviewController.js',
                        'views/ThirdPartyVendor/AddCustomItemPopupController.js',
                        'views/VendorAssociate/SendSMSPopUpController.js',
                         'views/VendorSupplier/AddSupplierOnTheFlyController.js',
                         //services
                         'js/Services/CommonServices/AuthHeaderService.js',
                         'js/Services/ThirdPartyVendor/ThirdPartyLineItemDetails.js',
                         'js/Services/ThirdPartyVendor/ItemValueService.js',
                         'js/Services/ThirdPartyVendor/AdjusterLineItemDetailsService.js',
                         'js/Services/PurchaseOrder/PurchaseOrderService.js',
                         'js/Services/Salvage/SalvageService.js',
                         'js/Services/ThirdPartyVendor/ThirdPartyClaimDetailsService.js',
                         'js/Services/VendorApprisal/VendorApprisalService.js',
                         'js/Services/VendorAssociate/VendorAssociateItemDetailService.js',
                          'js/Services/VendorSupplier/NewVendorSupplierService.js',
                        ]
                    });
                }]
            }
        })

            .state('ThirdPartyLineItemDetails', {
                      url: "/ThirdPartyLineItemDetails",
                      templateUrl: "views/ThirdPartyVendor/LineItemDetails.html",
                      data: {
                          pageTitle: 'Line Item Details',
                          roles: [VendorContact, GemLabAdmin]
                      },
                      controller: "LineItemDetailsController",
                      resolve: {
                          deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                              return $ocLazyLoad.load({
                                  name: 'MetronicApp',
                                  insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                  files: [
                                  'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                  'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                  'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                                  'assets/global/plugins/select2/css/select2.min.css',
                                  'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                  'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                                  'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',
                                  'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                  'assets/fullcalendar.css',
                                  'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                  'assets/global/plugins/select2/js/select2.full.min.js',
                                  'assets/pages/scripts/components-bootstrap-select.min.js',
                                  'assets/pages/scripts/components-select2.min.js',
                                  'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                                  'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                  'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                  'assets/pages/scripts/components-date-time-pickers.min.js',
                                  //Controllers
                                  'views/ThirdPartyVendor/LineItemDetailsController.js',
                                  'views/ThirdPartyVendor/AddInvoicesController.js',
                                  'views/ThirdPartyVendor/ItemValueController.js',
                                  'views/ThirdPartyVendor/AddItemNotePopupController.js',
                                  'views/PurchaseOrder/PurchaseOrderDetailsController.js',
                                  'views/Salvage/SalvageDetailsController.js',
                                   'views/PurchaseOrder/ItemReturnController.js',
                                  'views/ThirdPartyVendor/LaborCostWorkCodeController.js',
                                  'views/ThirdPartyVendor/LaborCostWorkCodeController.js',
                                  'views/VendorApprisal/VendorApprisalController.js',
                                  'views/VendorApprisal/ApprisalPreviewController.js',
                                  'views/ThirdPartyVendor/AddCustomItemPopupController.js',
                                  'views/VendorAssociate/SendSMSPopUpController.js',
                                   'views/VendorSupplier/AddSupplierOnTheFlyController.js',
                                   //services
                                   'js/Services/CommonServices/AuthHeaderService.js',
                                   'js/Services/ThirdPartyVendor/ThirdPartyLineItemDetails.js',
                                   'js/Services/ThirdPartyVendor/ItemValueService.js',
                                   'js/Services/ThirdPartyVendor/AdjusterLineItemDetailsService.js',
                                   'js/Services/PurchaseOrder/PurchaseOrderService.js',
                                   'js/Services/Salvage/SalvageService.js',
                                   'js/Services/ThirdPartyVendor/ThirdPartyClaimDetailsService.js',
                                   'js/Services/VendorApprisal/VendorApprisalService.js',
                                   'js/Services/VendorAssociate/VendorAssociateItemDetailService.js',
                                    'js/Services/VendorSupplier/NewVendorSupplierService.js',
                                  ]
                              });
                          }]
                      }
                  })

            .state('ViewQuote', {
                url: "/ViewQuote",
                templateUrl: "views/ThirdPartyVendor/ViewQuote.html",
                data: {
                    pageTitle: 'View Quote',
                    roles: [VendorContact, VendorAssociate, GemLabAdmin]
                },
                controller: "ViewQuoteController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'MetronicApp',
                            insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                            files: [
                                  'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                                  'assets/global/plugins/select2/css/select2.min.css',
                                  'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                  'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                                  'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css',
                                  'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',
                                  'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                  'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                  'assets/global/plugins/select2/js/select2.full.min.js',
                                  'assets/pages/scripts/components-bootstrap-select.min.js',
                                  'assets/pages/scripts/components-select2.min.js',
                                  'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                                  'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                  'assets/layouts/layout4/scripts/IPadResolution.js',
                                  'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                  'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                  'assets/global/plugins/select2/js/select2.full.min.js',
                                  'assets/global/plugins/jquery-multi-select/css/multi-select.css',
                                  'assets/pages/scripts/components-bootstrap-select.min.js',
                                  'assets/pages/scripts/components-select2.min.js',
                                  'assets/global/plugins/jquery-multi-select/js/jquery.multi-select.js',
                                  'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                  //controller
                                  'views/ThirdPartyVendor/ViewQuoteController.js',
                                  'views/ThirdPartyVendor/SendToAdjusterPopUpController.js',
                                  //services
                                  'js/Services/CommonServices/AuthHeaderService.js',
                                  'js/Services/ThirdPartyVendor/QuoteService.js'
                            ]
                        });
                    }]
                }
            })

         .state('ThirdPartyInvoiceDetails',
            {
            url: "/ThirdPartyInvoiceDetails",
            templateUrl: "views/ThirdPartyVendor/ThirdPartyInvoiceDetails.html",
            data: {
                pageTitle: 'Vendor Invoice',
                roles: [VendorContact, VendorAssociate]
            },
            controller: "ThirdPartyInvoiceDetailsController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                         'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                         'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                         'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                         'assets/global/plugins/select2/css/select2.min.css',
                         'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                         'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                         'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                         'assets/global/plugins/fullcalendar/fullcalendar.min.css',
                         'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                         'assets/global/plugins/select2/js/select2.full.min.js',
                         'assets/pages/scripts/components-bootstrap-select.min.js',
                         'assets/pages/scripts/components-select2.min.js',
                         'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                         'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                         'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                         'assets/pages/scripts/components-date-time-pickers.min.js',
                         'views/AddServiceForInvoice/AddServiceForInvoiceController.js',
                         'js/Services/ThirdPartyVendor/ThirdPartyInvoiceDetailsService.js',
                         'views/ThirdPartyVendor/ThirdPartyInvoiceDetailsController.js',
                         //services
                         'js/Services/CommonServices/AuthHeaderService.js',
                         'js/Services/ThirdPartyVendor/ThirdPartyInvoiceDetailsService.js'
                        ]
                    });
                }]
            }
        })


         .state('ThirdPartyCreateInvoice',
        {
            url: "/ThirdPartyCreateInvoice",
            templateUrl: "views/ThirdPartyVendor/ThirdPartyCreateInvoice.html",
            data: { pageTitle: 'Create Invoice' },
            controller: "ThirdPartyCreateInvoiceController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                              'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                              'assets/global/plugins/select2/css/select2.min.css',
                              'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                              'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                              'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css',
                              'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',
                              'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',

                               'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                              'assets/global/plugins/select2/js/select2.full.min.js',
                              'assets/pages/scripts/components-bootstrap-select.min.js',
                              'assets/pages/scripts/components-select2.min.js',
                             'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                              'assets/global/plugins/select2/js/select2.full.min.js',
                              'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                              'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',

                            'assets/pages/scripts/components-bootstrap-select.min.js',
                            'assets/pages/scripts/components-select2.min.js',
                            'views/ThirdPartyVendor/ThirdPartyCreateInvoiceController.js',
                            'views/AddServiceForInvoice/AddServiceForInvoiceController.js',
                             //services
                             'js/Services/CommonServices/AuthHeaderService.js',
                            'js/Services/ThirdPartyVendor/ThirdPartyInvoiceDetailsService.js',
                            'js/Services/ThirdPartyVendor/ServiceRequestOfferedService.js'
                        ]
                    });
                }]
            }
        })
          //ClaimAssociates 
        .state('ClaimAssociates', {
            url: "/ClaimAssociates",
            templateUrl: "views/ThirdPartyVendor/ClaimAssociates.html",
            data: {
                pageTitle: 'Claim Associates',
                roles: [ VendorAdmin]
            },
            controller: "ClaimAssociatesController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                             'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                             'assets/global/plugins/select2/css/select2.min.css',
                             'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                             'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                             'assets/global/plugins/select2/js/select2.full.min.js',
                             'assets/pages/scripts/components-bootstrap-select.min.js',
                             'assets/pages/scripts/components-select2.min.js',

                             'views/ThirdPartyVendor/ClaimAssociatesController.js',
                             //services
                             'js/Services/CommonServices/AuthHeaderService.js',
                             'js/Services/ThirdPartyVendor/ClaimAssociatesService.js'


                        ]
                    });
                }]
            }
        })
         .state('NewClaimAssociate', {
             url: "/NewClaimAssociate",
             templateUrl: "views/ThirdPartyVendor/AddNewClaimAssociate.html",
             data: {
                 pageTitle: 'Claim Associates',
                 roles: [VendorAdmin]
             },
             controller: "AddNewClaimAssociateController",
             resolve: {
                 deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                     return $ocLazyLoad.load({
                         name: 'MetronicApp',
                         insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                         files: [
                              'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                              'assets/global/plugins/select2/css/select2.min.css',
                              'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                              'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                              'assets/global/plugins/select2/js/select2.full.min.js',
                              'assets/pages/scripts/components-bootstrap-select.min.js',
                              'assets/pages/scripts/components-select2.min.js',

                              'views/ThirdPartyVendor/AddNewClaimAssociateController.js',
                              //services
                              'js/Services/CommonServices/AuthHeaderService.js',
                              'js/Services/ThirdPartyVendor/AddNewClaimAssociateService.js'


                         ]
                     });
                 }]
             }
         })

        //Vendor Associated

         .state('VendorAssociateDashboard', {
             url: "/VendorAssociateDashboard",
             templateUrl: "views/VendorAssociate/VendorAssociateDashboard.html",
             data: {
                 pageTitle: 'Dashboard',
                 roles: [VendorAssociate]
             },
             controller: "VendorAssociateDashboardController",
             resolve: {
                 deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                     return $ocLazyLoad.load({
                         name: 'MetronicApp',
                         insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                         files: [
                               'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                             'assets/global/plugins/select2/css/select2.min.css',
                             'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                             'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                             'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                             'assets/global/plugins/select2/js/select2.full.min.js',
                             'assets/pages/scripts/components-bootstrap-select.min.js',
                             'assets/pages/scripts/components-select2.min.js',
                             //Controller
                             'views/VendorAssociate/VendorAssociateDashboardController.js',
                             //For popup Show Attchment
                             'views/VendorAssociate/ShowClaimAttachmentController.js',

                              //services
                              'js/Services/CommonServices/AuthHeaderService.js',
                              'js/Services/VendorAssociate/VendorAssociateDashboardService.js'

                         ]
                     });
                 }]
             }
         })

         .state('AssociateVendorCatalog', {
             url: "/AssociateVendorCatalog",
             templateUrl: "views/VendorAssociate/AssociateVendorCatalog.html",
             data: { pageTitle: 'Dashboard' },
             controller: "AssociateVendorCatalogController",
             resolve: {
                 deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                     return $ocLazyLoad.load({
                         name: 'MetronicApp',
                         insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                         files: [
                               'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                             'assets/global/plugins/select2/css/select2.min.css',
                             'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                             'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                             'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                             'assets/global/plugins/select2/js/select2.full.min.js',
                             'assets/pages/scripts/components-bootstrap-select.min.js',
                             'assets/pages/scripts/components-select2.min.js',
                             //Controller
                             'views/VendorAssociate/AssociateVendorCatalogController.js',
                             //For popup Show Attchment
                             //'views/VendorAssociate/ShowClaimAttachmentController.js',

                              //services
                              'js/Services/CommonServices/AuthHeaderService.js',
                              'js/Services/ThirdPartyVendor/ThirdPartyCatalogService.js',
                                'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                         ]
                     });
                 }]
             }
         })

         .state('AssociateServiceRequestEdit', {
             url: "/AssociateServiceRequestEdit",
             templateUrl: "views/VendorAssociate/AssociateServiceRequestEdit.html",
             data: {
                 pageTitle: 'Edit Service Request',
                 roles: [VendorAssociate]
             },
             controller: "AssociateServiceRequestEditController",
             resolve: {
                 deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                     return $ocLazyLoad.load({
                         name: 'MetronicApp',
                         insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                         files: [
                               'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                             'assets/global/plugins/select2/css/select2.min.css',
                             'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                             'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                             'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                             'assets/global/plugins/select2/js/select2.full.min.js',
                             'assets/pages/scripts/components-bootstrap-select.min.js',
                             'assets/pages/scripts/components-select2.min.js',
                              'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                              //controller
                             'views/VendorAssociate/AssociateServiceRequestEditController.js',

                              //services
                              'js/Services/CommonServices/AuthHeaderService.js',
                              'js/Services/VendorAssociate/AssociateServiceRequestEditService.js'
                         ]
                     });
                 }]
             }
         })

         .state('GlobalSearchAssociate', {
             url: "/GlobalSearchAssociate",
             templateUrl: "views/VendorAssociate/GlobalSearchAssociate.html",
             data: {
                 pageTitle: 'Dashboard',
                 roles: [VendorAssociate]
             },
             controller: "GlobalSearchAssociateController",
             resolve: {
                 deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                     return $ocLazyLoad.load({
                         name: 'MetronicApp',
                         insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                         files: [
                               'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                             'assets/global/plugins/select2/css/select2.min.css',
                             'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                             'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                             'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                             'assets/global/plugins/select2/js/select2.full.min.js',
                             'assets/pages/scripts/components-bootstrap-select.min.js',
                             'assets/pages/scripts/components-select2.min.js',
                             //Controller
                             'views/VendorAssociate/GlobalSearchAssociateController.js',
                              //services
                              'js/Services/CommonServices/AuthHeaderService.js',
                              'js/Services/VendorAssociate/VendorAssociateDashboardService.js'

                         ]
                     });
                 }]
             }
         })

         .state('VendorAssociateClaimDetails', {
             url: "/VendorAssociateClaimDetails",
             templateUrl: "views/VendorAssociate/VendorAssociateClaimDetails.html",
             data: {
                 pageTitle: 'Claim Details',
                 roles: [VendorAssociate]
             },
             controller: "VendorAssociateClaimDetailsController",
             resolve: {
                 deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                     return $ocLazyLoad.load({
                         name: 'MetronicApp',
                         insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                         files: [

                         'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                         'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                         'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                         'assets/global/plugins/select2/css/select2.min.css',
                         'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                         'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                         'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',
                         'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                         'assets/fullcalendar.css',
                         'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                         'assets/global/plugins/select2/js/select2.full.min.js',
                         'assets/pages/scripts/components-bootstrap-select.min.js',
                         'assets/pages/scripts/components-select2.min.js',
                         'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                         'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                         'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                         'assets/pages/scripts/components-date-time-pickers.min.js',
                           //Controller
                          'views/VendorAssociate/VendorAssociateClaimDetailsController.js',
                          'views/ThirdPartyVendor/AddNewVendorController.js',
                          'views/ThirdPartyVendor/ItemValueController.js',
                          'views/ThirdPartyVendor/ShowNotesAttachmentController.js',
                          'views/ThirdPartyVendor/ShowClaimAttachmentController.js',
                          'views/ThirdPartyVendor/EventDetailsController.js',
                          'views/VendorAssociate/AddNewVendorController.js',
                          //'views/VendorAssociate/AddNotePopupController.js',
                          'views/ThirdPartyVendor/AddEventPopupController.js',
                          'views/AllNotes/NoteDetailsController.js',
                          'views/Reports/ReportController.js',
                          'views/ThirdPartyVendor/AddNotePopupController.js',
                          'views/ThirdPartyVendor/ThirdPartyCreateInvoiceController.js',
                          'views/AddServiceForInvoice/AddServiceForInvoiceController.js',
                          'views/PurchaseOrder/PurchaseOrderDetailsController.js',
                          'views/ThirdPartyVendor/LaborCostWorkCodeController.js',
                          'views/ThirdPartyVendor/LaborCostWorkCodeController.js',
                          'views/PurchaseOrder/ItemReturnController.js',
                          'views/VendorSupplier/AddSupplierOnTheFlyController.js',
                               //services
                              'js/Services/CommonServices/AuthHeaderService.js',
                              'js/Services/VendorAssociate/VendorAssociateClaimDetailsService.js',
                              'js/Services/Report/ReportService.js',
                              'js/Services/ThirdPartyVendor/ItemValueService.js',
                              'js/Services/ThirdPartyVendor/EventService.js',
                              'js/Services/ThirdPartyVendor/AdjusterPropertyClaimDetailsService.js',
                              'js/Services/ThirdPartyVendor/ThirdPartyInvoiceDetailsService.js',
                              'js/Services/ThirdPartyVendor/ServiceRequestOfferedService.js',
                              'views/ThirdPartyVendor/PurchaseOrderPopupController.js',
                              'js/Services/PurchaseOrder/PurchaseOrderService.js',                              
                              'js/Services/VendorSupplier/NewVendorSupplierService.js',
                                'js/Services/AllNotes/AllNotesService.js'
                         ]
                     });
                 }]
             }
         })

          .state('VendorAssociateItemDetails', {
              url: "/VendorAssociateItemDetails",
              templateUrl: "views/VendorAssociate/VendorAssociateLineItemDetails.html",
              data: {
                  pageTitle: 'Item Details',
                  roles: [VendorAssociate]
              },
              controller: "VendorAssociateLineItemController",
              resolve: {
                  deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                      return $ocLazyLoad.load({
                          name: 'MetronicApp',
                          insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                          files: [
                         'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                         'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                         'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                         'assets/global/plugins/select2/css/select2.min.css',
                         'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                         'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                         'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',
                         'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                         'assets/fullcalendar.css',
                         'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                         'assets/global/plugins/select2/js/select2.full.min.js',
                         'assets/pages/scripts/components-bootstrap-select.min.js',
                         'assets/pages/scripts/components-select2.min.js',
                         'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                         'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                         'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                         'assets/pages/scripts/components-date-time-pickers.min.js',
                               //Controller
                               'views/VendorAssociate/VendorAssociateLineItemController.js',
                               'views/ThirdPartyVendor/ItemValueController.js',
                               'views/ThirdPartyVendor/AddItemNotePopupController.js',
                               'views/PurchaseOrder/PurchaseOrderDetailsController.js',
                               'views/ThirdPartyVendor/LaborCostWorkCodeController.js',
                               'views/PurchaseOrder/PurchaseOrderDetailsController.js',
                               'views/ThirdPartyVendor/LaborCostWorkCodeController.js',
                               'views/ThirdPartyVendor/LaborCostWorkCodeController.js',
                               'views/VendorApprisal/VendorApprisalController.js',
                               'views/Salvage/SalvageDetailsController.js',
                               'views/PurchaseOrder/ItemReturnController.js',
                               'views/VendorAssociate/SendSMSPopUpController.js',
                               'views/VendorApprisal/ApprisalPreviewController.js',
                               'views/ThirdPartyVendor/AddCustomItemPopupController.js',
                               'views/VendorSupplier/AddSupplierOnTheFlyController.js',
                                //services
                               'js/Services/CommonServices/AuthHeaderService.js',
                               'js/Services/VendorAssociate/VendorAssociateItemDetailService.js',
                               'js/Services/ThirdPartyVendor/AdjusterLineItemDetailsService.js',
                               'js/Services/ThirdPartyVendor/ThirdPartyLineItemDetails.js',
                               'js/Services/ThirdPartyVendor/ItemValueService.js',
                               'js/Services/PurchaseOrder/PurchaseOrderService.js',
                               'js/Services/PurchaseOrder/PurchaseOrderService.js',
                               'js/Services/VendorApprisal/VendorApprisalService.js',
                               'js/Services/VendorAssociate/VendorAssociateClaimDetailsService.js',
                               'js/Services/Salvage/SalvageService.js',
                               'js/Services/VendorSupplier/NewVendorSupplierService.js',
                          ]
                      });
                  }]
              }
          })

           .state('vendorAssociateBillsAndPayment', {
               url: "/vendorAssociateBillsAndPayment",
               templateUrl: "views/VendorAssociate/vendorAssociateBillsAndPayment.html",
               data: { pageTitle: 'BillsAndPayment' },
               controller: "vendorAssociateBillsAndPaymentController",
               resolve: {
                   deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                       return $ocLazyLoad.load({
                           name: 'MetronicApp',
                           insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                           files: [

                                'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                                'assets/global/plugins/select2/css/select2.min.css',
                                'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                'assets/global/plugins/select2/js/select2.full.min.js',
                                'assets/pages/scripts/components-bootstrap-select.min.js',
                                'assets/pages/scripts/components-select2.min.js',
                                 'views/VendorAssociate/vendorAssociateBillsAndPaymentController.js',
                                 //services
                                'js/Services/CommonServices/AuthHeaderService.js',
                                'js/Services/VendorAssociate/vendorAssociateBillsAndPaymentService.js',
                                 'js/Services/ThirdPartyVendor/BillsAndPaymentService.js'
                           ]
                       });
                   }]
               }
           })

         .state('vendorAssociateInvoiceDetails', {
             url: "/vendorAssociateInvoiceDetails",
             templateUrl: "views/VendorAssociate/vendorAssociateInvoiceDetails.html",
             data: { pageTitle: 'BillsAndPayment' },
             controller: "VendorAssociateInvoiceDetailsController",
             resolve: {
                 deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                     return $ocLazyLoad.load({
                         name: 'MetronicApp',
                         insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                         files: [

                              'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                              'assets/global/plugins/select2/css/select2.min.css',
                              'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                              'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                              'assets/global/plugins/select2/js/select2.full.min.js',
                              'assets/pages/scripts/components-bootstrap-select.min.js',
                              'assets/pages/scripts/components-select2.min.js',
                               'views/VendorAssociate/VendorAssociateInvoiceDetailsController.js',
                               //services
                              'js/Services/CommonServices/AuthHeaderService.js',
                              'js/Services/VendorAssociate/VendorAssociateInvoiceDetailsService.js'
                         ]
                     });
                 }]
             }
         })

          .state('VendorAssociateInventory', {
              url: "/VendorAssociateInventory",
              templateUrl: "views/VendorAssociate/VendorAssociateInventory.html",
              data: { pageTitle: 'BillsAndPayment' },
              controller: "VendorAssociateInventoryController",
              resolve: {
                  deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                      return $ocLazyLoad.load({
                          name: 'MetronicApp',
                          insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                          files: [

                               'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                               'assets/global/plugins/select2/css/select2.min.css',
                               'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                               'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                               'assets/global/plugins/select2/js/select2.full.min.js',
                               'assets/pages/scripts/components-bootstrap-select.min.js',
                               'assets/pages/scripts/components-select2.min.js',
                                'views/VendorAssociate/VendorAssociateInventoryController.js',
                                //services
                               'js/Services/CommonServices/AuthHeaderService.js',
                               'js/Services/VendorAssociate/VendorAssociateInventoryService.js'
                          ]
                      });
                  }]
              }
          })

          .state('VendorAssociateEditInventory', {
              url: "/VendorAssociateEditInventory",
              templateUrl: "views/VendorAssociate/VendorAssociateEditInventory.html",
              data: { pageTitle: 'BillsAndPayment' },
              controller: "VendorAssociateEditInventoryController",
              resolve: {
                  deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                      return $ocLazyLoad.load({
                          name: 'MetronicApp',
                          insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                          files: [

                               'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                               'assets/global/plugins/select2/css/select2.min.css',
                               'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                               'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                               'assets/global/plugins/select2/js/select2.full.min.js',
                               'assets/pages/scripts/components-bootstrap-select.min.js',
                               'assets/pages/scripts/components-select2.min.js',
                                'views/VendorAssociate/VendorAssociateEditInventoryController.js',
                                //services
                               'js/Services/CommonServices/AuthHeaderService.js',
                              'js/Services/VendorAssociate/VendorAssociateInventoryService.js'
                          ]
                      });
                  }]
              }
          })

          .state('VendorAssociateCreateInvoice', {
              url: "/VendorAssociateCreateInvoice",
              templateUrl: "views/VendorAssociate/VendorAssociateCreateInvoice.html",
              data: {
                  pageTitle: 'Create Invoice',

              },
              controller: "VendorAssociateCreateInvoiceController",
              resolve: {
                  deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                      return $ocLazyLoad.load({
                          name: 'MetronicApp',
                          insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                          files: [
                               'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                               'assets/global/plugins/select2/css/select2.min.css',
                               'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css',
                              'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',
                               'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                               'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                               'assets/global/plugins/select2/js/select2.full.min.js',
                               'assets/pages/scripts/components-bootstrap-select.min.js',
                               'assets/pages/scripts/components-select2.min.js',
                               'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                               'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                'views/VendorAssociate/VendorAssociateCreateInvoiceController.js',
                                'views/AddServiceForInvoice/AddServiceForInvoiceController.js',

                                //services
                               'js/Services/CommonServices/AuthHeaderService.js',
                              'js/Services/VendorAssociate/VendorAssociateInvoiceDetailsService.js',
                               'js/Services/ThirdPartyVendor/ServiceRequestOfferedService.js'


                          ]
                      });
                  }]
              }
          })

        //  Third party vendor
        .state('AdministratorThirdPartyVendor', {
            url: "/AdministratorThirdPartyVendor",
            templateUrl: "views/Administrator/AdministratorThirdPartyVendor.html",
            data: { pageTitle: '3rd Party Vendor' },
            controller: "AdministratorThirdPartyVendorController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [

                            'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                            'assets/global/plugins/select2/css/select2.min.css',
                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                            'assets/global/plugins/select2/js/select2.full.min.js',
                            'assets/pages/scripts/components-bootstrap-select.min.js',
                            'assets/pages/scripts/components-select2.min.js',

                             'views/Administrator/AdministratorThirdPartyVendorController.js',
                             'views/ClaimCenterManager/AssignClaimForManagerController.js',

                              //services
                             'js/Services/CommonServices/AuthHeaderService.js',
                             'js/Services/Administrator/AdministratorThirdPartyVendorService.js'
                             //'js/Services/Administrator/.js',
                        ]
                    });
                }]
            }
        })
        //Invite third party vendor
         .state('InviteThirdPartyVendor', {
             url: "/InviteThirdPartyVendor",
             templateUrl: "views/Administrator/InviteThirdPartyVendor.html",
             data: { pageTitle: '' },
             controller: "InviteThirdPartyVendorController",
             resolve: {
                 deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                     return $ocLazyLoad.load({
                         name: 'MetronicApp',
                         insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                         files: [


                                 'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                                 'assets/global/plugins/select2/css/select2.min.css',
                                 'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                 'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                 'assets/global/plugins/select2/js/select2.full.min.js',
                                 'assets/pages/scripts/components-bootstrap-select.min.js',
                                 'assets/pages/scripts/components-select2.min.js',

                                 'views/Administrator/InviteThirdPartyVendorController.js',

                                  //services
                                  'js/Services/CommonServices/AuthHeaderService.js',
                                  'js/Services/Administrator/InviteThirdPartyVendorService.js'
                         ]
                     });
                 }]
             }
         })

        //Added For Sub Menu User Profile
    .state('UserProfile',
    {
        url: "/UserProfile",
        templateUrl: "views/ThirdPartyVendor/UserProfile.html",
        data: {
            pageTitle: 'User Profile',
            roles: [VendorContact, VendorAssociate, VendorAdmin, ShippingAdmin, GemLabAdmin, SalseCoOrdinator, AccountingAdmin, 'SPEEDCHECK CONTACT', 'SPEEDCHECK ASSOCIATE', 'SPEEDCHECK SUPERVISOR']
        },
        controller: "MyProfileController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                          'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                          'assets/global/plugins/select2/css/select2.min.css',
                          'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                          'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                          'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css',
                          'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',

                          'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                          'assets/global/plugins/select2/js/select2.full.min.js',
                          'assets/pages/scripts/components-bootstrap-select.min.js',
                          'assets/pages/scripts/components-select2.min.js',
                          'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                          'assets/global/plugins/select2/js/select2.full.min.js',
                          'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                          'assets/pages/scripts/components-bootstrap-select.min.js',
                          'assets/pages/scripts/components-select2.min.js',
                          'views/ThirdPartyVendor/MyProfileController.js',

                         //services
                         'js/Services/CommonServices/AuthHeaderService.js',
                         'js/Services/ThirdPartyVendor/MyPaymentService.js',
                         'js/Services/ThirdPartyVendor/MyProfileService.js',

                    ]
                });
            }]
        }
    })

        //Added For Sub Menu Security

    .state('Security',
    {
        url: "/Security",
        templateUrl: "views/ThirdPartyVendor/Security.html",
        data: {
            pageTitle: 'Security',
            roles: [VendorContact, VendorAssociate, VendorAdmin, ShippingAdmin, GemLabAdmin, SalseCoOrdinator, AccountingAdmin,'SPEEDCHECK CONTACT','SPEEDCHECK ASSOCIATE','SPEEDCHECK SUPERVISOR']
        },
        controller: "MyProfileController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                          'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                          'assets/global/plugins/select2/css/select2.min.css',
                          'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                          'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                          'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css',
                          'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',
                          'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                          'assets/global/plugins/select2/js/select2.full.min.js',
                          'assets/pages/scripts/components-bootstrap-select.min.js',
                          'assets/pages/scripts/components-select2.min.js',
                          'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                          'assets/global/plugins/select2/js/select2.full.min.js',
                          'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                          'assets/pages/scripts/components-bootstrap-select.min.js',
                          'assets/pages/scripts/components-select2.min.js',
                          //Controllers
                          'views/ThirdPartyVendor/MyProfileController.js',
                          //services
                          'js/Services/CommonServices/AuthHeaderService.js',
                          'js/Services/ThirdPartyVendor/MyPaymentService.js',
                          'js/Services/ThirdPartyVendor/MyProfileService.js',

                    ]
                });
            }]
        }
    })

    .state('AlertsSettings', {
        url: "/AlertsSettings",
        templateUrl: "views/ThirdPartyVendor/AlertsSettings.html",
        data: {
            pageTitle: 'Alerts Settings',
            roles: [VendorContact, VendorAssociate, VendorAdmin, ShippingAdmin, GemLabAdmin, SalseCoOrdinator, AccountingAdmin, 'SPEEDCHECK CONTACT','SPEEDCHECK ASSOCIATE','SPEEDCHECK SUPERVISOR']
        },
        controller: "AlertsSettingsController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                          'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                          'assets/global/plugins/select2/css/select2.min.css',
                          'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                          'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                          'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css',
                          'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',
                          'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                          'assets/global/plugins/select2/js/select2.full.min.js',
                          'assets/pages/scripts/components-bootstrap-select.min.js',
                          'assets/pages/scripts/components-select2.min.js',
                          'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                          'assets/global/plugins/select2/js/select2.full.min.js',
                          'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                          'assets/pages/scripts/components-bootstrap-select.min.js',
                          'assets/pages/scripts/components-select2.min.js',
                          'views/ThirdPartyVendor/AlertsSettingsController.js',
                         //services
                         'js/Services/CommonServices/AuthHeaderService.js',
                         'js/Services/ThirdPartyVendor/MyProfileService.js',

                    ]
                });
            }]
        }
    })
    //Report Pages
     .state('Report', {
         url: "/Report",
         templateUrl: "views/Reports/Report.html",
         data: {
             pageTitle: 'Report',
             roles: [VENDOR_SUPERVISOR]
         },
         controller: "ReportController",
         resolve: {
             deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                 return $ocLazyLoad.load({
                     name: 'MetronicApp',
                     insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                     files: [
                         'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                         'assets/global/plugins/select2/css/select2.min.css',
                         'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                         'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                         'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                         'assets/global/plugins/select2/js/select2.full.min.js',
                         'assets/pages/scripts/components-bootstrap-select.min.js',
                         'assets/pages/scripts/components-select2.min.js',
                         'views/Reports/ReportController.js',
                          //services
                          'js/Services/CommonServices/AuthHeaderService.js',
                        'js/Services/Report/ReportService.js'
                     ]
                 });
             }]
         }
     })

     //All Events
     .state('AllEvents', {
         url: "/AllEvents",
         templateUrl: "views/AllEvents/AllEvents.html",
         data: {
             pageTitle: 'Report',
             roles: [VendorContact, VendorAssociate, GemLabAdmin, ]
         },
         controller: "AllEventsController",
         resolve: {
             deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                 return $ocLazyLoad.load({
                     name: 'MetronicApp',
                     insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                     files: [

                         'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                         'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                         'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                         'assets/global/plugins/select2/css/select2.min.css',
                         'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                         'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                         'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                         'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                         'assets/global/plugins/select2/js/select2.full.min.js',
                         'assets/pages/scripts/components-bootstrap-select.min.js',
                         'assets/pages/scripts/components-select2.min.js',
                         'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                         'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                         'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                         'assets/pages/scripts/components-date-time-pickers.min.js',
                        //Controllers
                         'views/ThirdPartyVendor/EventDetailsController.js',
                         'views/ThirdPartyVendor/AddEventPopupController.js',
                         'views/AllEvents/AllEventsController.js',

                        //services
                         'js/Services/CommonServices/AuthHeaderService.js',
                         'js/Services/AllEvents/AllEventsService.js',
                         'js/Services/ThirdPartyVendor/EventService.js',
                         'js/Services/ThirdPartyVendor/AdjusterPropertyClaimDetailsService.js'

                     ]
                 });
             }]
         }
     })
        //All Notes
    .state('AllNotes', {
        url: "/AllNotes",
        templateUrl: "views/AllNotes/AllNotes.html",
        data: {
            pageTitle: 'AllNotes',
            roles: [VendorContact, VendorAssociate,GemLabAdmin, ]
        },
        controller: "AllNotesController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [
                        'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                        'assets/global/plugins/select2/css/select2.min.css',
                        'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                        'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                        'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                        'assets/global/plugins/select2/js/select2.full.min.js',
                        'assets/pages/scripts/components-bootstrap-select.min.js',
                        'assets/pages/scripts/components-select2.min.js',
                        'views/AllNotes/AllNotesController.js',
                         'views/ThirdPartyVendor/AddNotePopupController.js',
                         //services
                        'js/Services/ThirdPartyVendor/AdjusterPropertyClaimDetailsService.js',
                       'js/Services/CommonServices/AuthHeaderService.js',
                       'js/Services/AllNotes/AllNotesService.js'
                    ]
                });
            }]
        }
    })

      //Third party services
    .state('ServiceRequestOffered', {
        url: "/ServiceRequestOffered",
        templateUrl: "views/ThirdPartyVendor/ServiceRequestOffered.html",
        data: {
            pageTitle: 'Service Request Offered',
            roles: [VendorAdmin ]
        },
        controller: "ServiceRequestOfferedController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [
                        'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                        'assets/global/plugins/select2/css/select2.min.css',
                        'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                        'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                        'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                        'assets/global/plugins/select2/js/select2.full.min.js',
                        'assets/pages/scripts/components-bootstrap-select.min.js',
                        'assets/pages/scripts/components-select2.min.js',
                        'views/ThirdPartyVendor/ServiceRequestOfferedController.js',
                         //services
                        'js/Services/ThirdPartyVendor/ServiceRequestOfferedService.js',
                       'js/Services/CommonServices/AuthHeaderService.js'
                    ]
                });
            }]
        }
    })

      .state('UploadVendorDetails', {
          url: "/UploadVendorDetails",
          templateUrl: "views/UploadVendorDetails/UploadVendorDetails.html",
          data: { pageTitle: 'Upload Vendor Details' },
          controller: "UploadVendorDetailsContoller",
          resolve: {
              deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                  return $ocLazyLoad.load({
                      name: 'MetronicApp',
                      insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                      files: [
                           'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                           'assets/global/plugins/select2/css/select2.min.css',
                           'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                           'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                           'assets/global/plugins/select2/js/select2.full.min.js',
                           'assets/pages/scripts/components-bootstrap-select.min.js',
                           'assets/pages/scripts/components-select2.min.js',
                           'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css',
                           'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',
                           'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                           'js/Services/CommonServices/AuthHeaderService.js',
                           'js/Services/UploadVendorDetails/UploadVendorDetailsService.js',
                           'views/UploadVendorDetails/UploadVendorDetailsContoller.js',
                      ]
                  });
              }]
          }
      })

        .state('UserDetailsUpload', {
            url: "/UserDetailsUpload",
            templateUrl: "views/UserDetailsUpload/UserDetailsUpload.html",
            data: { pageTitle: 'Upload User Details' },
            controller: "UserDetailsUploadContoller",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                             'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                             'assets/global/plugins/select2/css/select2.min.css',
                             'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                             'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                             'assets/global/plugins/select2/js/select2.full.min.js',
                             'assets/pages/scripts/components-bootstrap-select.min.js',
                             'assets/pages/scripts/components-select2.min.js',
                             'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css',
                             'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',
                             'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                             'js/Services/CommonServices/AuthHeaderService.js',
                             'js/Services/UserDetailsUpload/UserDetailsUploadService.js',
                             'views/UserDetailsUpload/UserDetailsUploadController.js',
                        ]
                    });
                }]
            }
        })

        .state('ThirdPartyContentService', {
            url: "/ThirdPartyContentService",
            templateUrl: "views/ThirdPartyVendor/ThirdPartyContentService.html",
            data: {
                pageTitle: 'Content Service',
                roles: [VendorAdmin]
            },
            controller: "ThirdPartyContentServiceController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                             'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                             'assets/global/plugins/select2/css/select2.min.css',
                             'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                             'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                             'assets/global/plugins/select2/js/select2.full.min.js',
                             'assets/pages/scripts/components-bootstrap-select.min.js',
                             'assets/pages/scripts/components-select2.min.js',
                             'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css',
                             'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',
                             'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                             'js/Services/CommonServices/AuthHeaderService.js',

                             'js/Services/ThirdPartyVendor/ThirdPartyContentService.js',
                             'views/ThirdPartyVendor/ThirdPartyContentServiceController.js',
                        ]
                    });
                }]
            }
        })
     .state('ThirdPartyNewContentService', {
         url: "/ThirdPartyNewContentService",
         templateUrl: "views/ThirdPartyVendor/ThirdPartyNewContentService.html",
         data: {
             pageTitle: 'Content Service',
             roles: [VendorAdmin]
         },
         controller: "ThirdPartyNewContentServiceController",
         resolve: {
             deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                 return $ocLazyLoad.load({
                     name: 'MetronicApp',
                     insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                     files: [
                          'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                          'assets/global/plugins/select2/css/select2.min.css',
                          'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                          'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                          'assets/global/plugins/select2/js/select2.full.min.js',
                          'assets/pages/scripts/components-bootstrap-select.min.js',
                          'assets/pages/scripts/components-select2.min.js',
                          'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css',
                          'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',
                          'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                          'js/Services/CommonServices/AuthHeaderService.js',
                          'js/Services/ThirdPartyVendor/ThirdPartyContentService.js',
                          'views/ThirdPartyVendor/ThirdPartyNewContentServiceController.js',
                     ]
                 });
             }]
         }
     })

    //Global Search

      .state('PolicyDetails',
        {
            url: "/PolicyDetails",
            templateUrl: "views/GlobalSearch/PolicyDetails.html",
            data: {
                pageTitle: 'PolicyDetails',
                roles: [VendorContact, VendorAssociate, VendorAdmin, ShippingAdmin, GemLabAdmin]
            },
            controller: "PolicyDetailsController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                              'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                              'assets/global/plugins/select2/css/select2.min.css',
                              'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                              'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                              'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css',
                              'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',
                              'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',

                               'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                              'assets/global/plugins/select2/js/select2.full.min.js',
                              'assets/pages/scripts/components-bootstrap-select.min.js',
                              'assets/pages/scripts/components-select2.min.js',
                             'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                              'assets/global/plugins/select2/js/select2.full.min.js',
                              'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                              'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',

                             'assets/pages/scripts/components-bootstrap-select.min.js',
                              'assets/pages/scripts/components-select2.min.js',
                              'views/GlobalSearch/PolicyDetailsController.js',


                             //services
                             'js/Services/CommonServices/AuthHeaderService.js',
                             'js/Services/PolicyDetails/PolicyDetailsService.js'


                        ]
                    });
                }]
            }
        })
      .state('PeopleDetails',
        {
            url: "/PeopleDetails",
            templateUrl: "views/GlobalSearch/PeopleDetails.html",
            data: {
                pageTitle: 'People Details',
                roles: [VendorContact, VendorAssociate, VendorAdmin, ShippingAdmin, GemLabAdmin]
            },
            controller: "PeopleDetailsController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                              'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                              'assets/global/plugins/select2/css/select2.min.css',
                              'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                              'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                              'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css',
                              'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',
                              'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',

                               'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                              'assets/global/plugins/select2/js/select2.full.min.js',
                              'assets/pages/scripts/components-bootstrap-select.min.js',
                              'assets/pages/scripts/components-select2.min.js',
                             'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                              'assets/global/plugins/select2/js/select2.full.min.js',
                              'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                              'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',

                             'assets/pages/scripts/components-bootstrap-select.min.js',
                              'assets/pages/scripts/components-select2.min.js',
                              'views/GlobalSearch/PeopleDetailsController.js',
                                'js/Services/Adjuster/AdjusterDashboardService.js',
                             //services
                             'js/Services/CommonServices/AuthHeaderService.js',


                        ]
                    });
                }]
            }
        })


    .state('Contracts',
    {
        url: "/Contracts",
        templateUrl: "views/ThirdPartyVendor/Contracts.html",
        data: {
            pageTitle: 'Contracts Details',
            roles: [VendorAdmin]
        },
        controller: "ContractsController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                          'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                          'assets/global/plugins/select2/css/select2.min.css',
                          'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                          'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                          'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css',
                          'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',
                          'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',

                           'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                          'assets/global/plugins/select2/js/select2.full.min.js',
                          'assets/pages/scripts/components-bootstrap-select.min.js',
                          'assets/pages/scripts/components-select2.min.js',
                         'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                          'assets/global/plugins/select2/js/select2.full.min.js',
                          'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                          'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',

                         'assets/pages/scripts/components-bootstrap-select.min.js',
                          'assets/pages/scripts/components-select2.min.js',
                          'views/ThirdPartyVendor/ContractsController.js',
                         //services
                         'js/Services/CommonServices/AuthHeaderService.js',
                          'js/Services/ThirdPartyVendor/ThirdPartyContractService.js'
                    ]
                });
            }]
        }
    })

         .state('Departments',
    {
        url: "/Departments",
        templateUrl: "views/Administrator/Departments.html",
        data: {
            pageTitle: 'Departments',
            roles: [VendorAdmin]
        },
        controller: "DepartmentsController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                          'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                          'assets/global/plugins/select2/css/select2.min.css',
                          'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                          'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                          'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css',
                          'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',
                          'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                          'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                          'assets/global/plugins/select2/js/select2.full.min.js',
                          'assets/pages/scripts/components-bootstrap-select.min.js',
                          'assets/pages/scripts/components-select2.min.js',
                          'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                          'assets/global/plugins/select2/js/select2.full.min.js',
                          'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                          'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                          'assets/pages/scripts/components-bootstrap-select.min.js',
                          'assets/pages/scripts/components-select2.min.js',
                          //Controller
                          'views/Administrator/DepartmentsController.js',
                          'views/Administrator/SelectEmpPopUpController.js',
                         //services
                         'js/Services/CommonServices/AuthHeaderService.js',
                         'js/Services/Administrator/DepartmentsService.js',
                    ]
                });
            }]
        }
    })

     .state('AssociateReport',
    {
        url: "/AssociateReport",
        templateUrl: "views/ThirdPartyVendor/AssociateReport.html",
        data: {
            pageTitle: 'Contracts Details',
            roles: [VendorContact, VendorAssociate, VendorAdmin, GemLabAdmin]
        },
        controller: "AssociateReportController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                          'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                          'assets/global/plugins/select2/css/select2.min.css',
                          'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                          'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                          'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css',
                          'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',
                           'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                          'assets/global/plugins/select2/js/select2.full.min.js',
                          'assets/pages/scripts/components-bootstrap-select.min.js',
                          'assets/pages/scripts/components-select2.min.js',
                         'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                          'assets/global/plugins/select2/js/select2.full.min.js',
                          'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                         'assets/pages/scripts/components-bootstrap-select.min.js',
                          'assets/pages/scripts/components-select2.min.js',
                          'views/ThirdPartyVendor/AssociateReportController.js',
                         //services
                         'js/Services/CommonServices/AuthHeaderService.js',
                          'js/Services/ThirdPartyVendor/AssociateReportService.js'
                    ]
                });
            }]
        }
    })


     .state('VendorInfo', {
         url: "/VendorInfo",
         templateUrl: "views/GlobalSearch/VendorInfo.html",
         data: { pageTitle: 'Vendor Details' },
         controller: "VendorInfoController",
         resolve: {
             deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                 return $ocLazyLoad.load({
                     name: 'MetronicApp',
                     insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                     files: [
                            'views/GlobalSearch/VendorInfoController.js',
                           //services
                          'js/Services/CommonServices/AuthHeaderService.js',
                          'js/Services/Adjuster/AdjusterDashboardService.js'
                     ]
                 });
             }]
         }
     })

      .state('NewClaim', {
          url: "/NewClaim",
          templateUrl: "views/Adjuster/NewClaim.html",
          data: { pageTitle: 'New Claim' },
          controller: "NewClaimController",
          resolve: {
              deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                  return $ocLazyLoad.load({
                      name: 'MetronicApp',
                      insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                      files: [
                           'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css',
                          'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                          'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                          'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                          'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                          'assets/pages/scripts/components-date-time-pickers.min.js',
                           'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                           'assets/global/plugins/select2/css/select2.min.css',
                           'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                           'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                           'assets/global/plugins/select2/js/select2.full.min.js',
                           'views/Adjuster/NewClaimController.js',
                           'js/Services/CommonServices/AuthHeaderService.js',
                           'js/Services/Adjuster/NewClaimService.js',
                      ]
                  });
              }]
          }
      })
        //3rd party accounting administrator
    .state('ClaimBills', {
        url: "/ClaimBills",
        templateUrl: "views/ThirdPartyAccountingAdministrator/ClaimBills.html",
        data: {
            pageTitle: 'Claim Bills',
            roles: [AccountingAdmin]
        },
        controller: "ClaimBillsController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                            'js/Services/CommonServices/AuthHeaderService.js',
                         'views/ThirdPartyAccountingAdministrator/ClaimBillsController.js',
                         'js/Services/ThirdPartyAccountingAdministrator/ClaimBillsService.js',
                    ]
                });
            }]
        }
    })
            //3rd party accounting administrator
    .state('AccountsPayable', {
        url: "/AccountsPayable",
        templateUrl: "views/ThirdPartyAccountingAdministrator/AccountsPayable.html",
        data: {
            pageTitle: 'Claim Bills',
            roles: [AccountingAdmin]
        },
        controller: "AccountsPayableController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                              'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                             'assets/global/plugins/select2/css/select2.min.css',
                             'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                             'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                             'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                             'assets/global/plugins/select2/js/select2.full.min.js',
                             'assets/pages/scripts/components-bootstrap-select.min.js',
                             'assets/pages/scripts/components-select2.min.js',

                            'js/Services/CommonServices/AuthHeaderService.js',
                         'views/ThirdPartyAccountingAdministrator/AccountsPayableController.js',
                         'js/Services/ThirdPartyAccountingAdministrator/ClaimBillsService.js',
                    ]
                });
            }]
        }
    })

     .state('ClaimBillDetails', {
         url: "/ClaimBillDetails",
         templateUrl: "views/ThirdPartyAccountingAdministrator/ClaimBillDetails.html",
         data: {
             pageTitle: 'ClaimBill Details',
             roles: [AccountingAdmin]
         },
         controller: "ClaimBillDetailsController",
         resolve: {
             deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                 return $ocLazyLoad.load({
                     name: 'MetronicApp',
                     insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                     files: [
                         'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                         'assets/global/plugins/select2/css/select2.min.css',
                         'assets/global/plugins/select2/css/select2-bootstrap.min.css',

                         'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                         'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css',
                         'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',
                         'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',

                          'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                         'assets/global/plugins/select2/js/select2.full.min.js',
                         'assets/pages/scripts/components-bootstrap-select.min.js',
                         'assets/pages/scripts/components-select2.min.js',
                         'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                         'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                         'assets/layouts/layout4/scripts/IPadResolution.js',
                       //start switch css-

                       'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',

                       //end switch css-

                        'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                       'assets/global/plugins/select2/js/select2.full.min.js',
                       'assets/global/plugins/jquery-multi-select/css/multi-select.css',


                       'assets/pages/scripts/components-bootstrap-select.min.js',
                       'assets/pages/scripts/components-select2.min.js',
                        'assets/global/plugins/jquery-multi-select/js/jquery.multi-select.js',

                          //start switch js-
                       'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                       //end switch js
                         'js/Services/CommonServices/AuthHeaderService.js',
                          'views/ThirdPartyAccountingAdministrator/ClaimBillDetailsController.js',
                          'js/Services/ThirdPartyAccountingAdministrator/ClaimBillsService.js',
                     ]
                 });
             }]
         }
     })


        //3rd party shipping administrator
    .state('Orders', {
        url: "/Orders",
        templateUrl: "views/ThirdPartyShipingAdministartor/Orders.html",
        data: {
            pageTitle: 'Orders',
            roles: [ShippingAdmin, SalseCoOrdinator]
        },
        controller: "OrdersController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                         'views/ThirdPartyShipingAdministartor/OrdersController.js',
                         'js/Services/CommonServices/AuthHeaderService.js',
                         'js/Services/ThirdPartyShipingAdministartor/OrdersService.js',
                    ]
                });
            }]
        }
    })

    // For Department PODetails 

    .state('PODetailsDepartment', {
        url: "/PODetailsDepartment",
        templateUrl: "views/PurchaseOrder/PODetailsDepartments.html",
        data: {
            pageTitle: 'Order Details',
            roles: [VendorAssociate, VendorAdmin, ShippingAdmin, SalseCoOrdinator]
        },
        controller: "PODetailsDepartmentsController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                         'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                         'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                         'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                         'assets/global/plugins/select2/css/select2.min.css',
                         'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                         'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                         'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',
                         'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                         'assets/fullcalendar.css',
                         'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                         'assets/global/plugins/select2/js/select2.full.min.js',
                         'assets/pages/scripts/components-bootstrap-select.min.js',
                         'assets/pages/scripts/components-select2.min.js',
                         'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                         'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                         'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                         'assets/pages/scripts/components-date-time-pickers.min.js',
                         //Controller                            
                         'views/ThirdPartyVendor/LaborCostWorkCodeController.js',
                         //services
                         'views/PurchaseOrder/PODetailsDepartmentsController.js',
                         'views/PurchaseOrder/ItemReturnController.js',
                         'js/Services/CommonServices/AuthHeaderService.js',
                         'js/Services/PurchaseOrder/PurchaseOrderService.js',
                    ]
                });
            }]
        }
    })


         .state('ItemReturn', {
             url: "/ItemReturn",
             templateUrl: "views/PurchaseOrder/ItemReturn.html",
             data: { pageTitle: 'Item Return' },
             controller: "ItemReturnController",
             resolve: {
                 deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                     return $ocLazyLoad.load({
                         name: 'MetronicApp',
                         insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                         files: [
                              'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                              'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                              'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                              'assets/global/plugins/select2/css/select2.min.css',
                              'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                              'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                              'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',
                              'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                              'assets/fullcalendar.css',
                              'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                              'assets/global/plugins/select2/js/select2.full.min.js',
                              'assets/pages/scripts/components-bootstrap-select.min.js',
                              'assets/pages/scripts/components-select2.min.js',
                              'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                              'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                              'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                              'assets/pages/scripts/components-date-time-pickers.min.js',
                              //Controller                            
                              'views/PurchaseOrder/ItemReturnController.js',
                              //services                            
                              'js/Services/CommonServices/AuthHeaderService.js',
                              'js/Services/PurchaseOrder/PurchaseOrderService.js',
                         ]
                     });
                 }]
             }
         })

     //3rd party Suppliers
    .state('VendorSupplier', {
        url: "/VendorSupplier",
        templateUrl: "views/VendorSupplier/VendorSupplier.html",
        data: {
            pageTitle: 'Vendor Supplier',
            roles: [VendorAdmin]
        },
        controller: "VendorSupplierController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                         'views/VendorSupplier/VendorSupplierController.js',
                         'js/Services/CommonServices/AuthHeaderService.js',
                         'js/Services/VendorSupplier/VendorSupplierService.js'
                    ]
                });
            }]
        }
    })

     //3rd party Suppliers
    .state('NewVendorSupplier', {
        url: "/NewVendorSupplier",
        templateUrl: "views/VendorSupplier/NewVendorSupplier.html",
        data: {
            pageTitle: 'Vendor Supplier',
            roles: [VendorAdmin]
        },
        controller: "NewVendorSupplierController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                              'assets/global/plugins/select2/css/select2.min.css',
                              'assets/global/plugins/select2/css/select2-bootstrap.min.css',

                               'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                              'assets/global/plugins/select2/js/select2.full.min.js',
                              'assets/pages/scripts/components-bootstrap-select.min.js',
                              'assets/pages/scripts/components-select2.min.js',

                         'views/VendorSupplier/NewVendorSupplierController.js',
                         'js/Services/CommonServices/AuthHeaderService.js',
                         'js/Services/VendorSupplier/NewVendorSupplierService.js'
                    ]
                });
            }]
        }
    })

     //3rd party Suppliers
    .state('UploadVendorSupplier', {
        url: "/UploadVendorSupplier",
        templateUrl: "views/VendorSupplier/UploadVendorSupplier.html",
        data: {
            pageTitle: 'Upload Vendor Supplier',
            roles: [VendorAdmin]
        },
        controller: "UploadVendorSupplierController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                         'views/VendorSupplier/UploadVendorSupplierController.js',
                         'js/Services/CommonServices/AuthHeaderService.js',
                          'js/Services/VendorSupplier/VendorSupplierService.js',
                         //'js/Services/VendorSupplier/UploadVendorSupplierService.js'
                    ]
                });
            }]
        }
    })


    .state('MER', {
        url: "/MER",
        templateUrl: "views/ThirdPartyVendor/MER.html",
        data: {
            pageTitle: 'MER',
            roles: [VendorContact, VendorAssociate, GemLabAdmin]
        },
        controller: "MERController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                           'views/ThirdPartyVendor/MERController.js',
                           //'views/ThirdPartyVendor/AddInvoicesController.js',
                           //'views/Adjuster/ItemValueController.js',
                           //'views/Adjuster/AddItemNotePopupController.js',

                         'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                         'assets/global/plugins/select2/css/select2.min.css',
                         'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                         'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                         'assets/global/plugins/select2/js/select2.full.min.js',
                         'assets/pages/scripts/components-bootstrap-select.min.js',
                         'assets/pages/scripts/components-select2.min.js',

                          //services
                         'js/Services/CommonServices/AuthHeaderService.js',
                         'js/Services/ThirdPartyVendor/ThirdPartyLineItemDetails.js',
                         //'js/Services/Adjuster/ItemValueService.js',
                         //'js/Services/Adjuster/AdjusterLineItemDetailsService.js'
                    ]
                });
            }]
        }
    })

    .state('LaborCode', {
        url: "/LaborCode",
        templateUrl: "views/LaborCode/LaborCode.html",
        data: {
            pageTitle: 'Labor Code',
            roles: [VendorAdmin]
        },
        controller: "LaborCodeController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                         'views/LaborCode/LaborCodeController.js',
                          //services
                         'js/Services/CommonServices/AuthHeaderService.js',
                         'js/Services/LaborCode/LaborCodeService.js'
                    ]
                });
            }]
        }
    })
    .state('NewLaborCode', {
        url: "/NewLaborCode",
        templateUrl: "views/LaborCode/NewLaborCode.html",
        data: {
            pageTitle: 'Labor Code',
            roles: [VendorAdmin]
        },
        controller: "NewLaborCodeController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                         'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                         'assets/global/plugins/select2/css/select2.min.css',
                         'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                         'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                         'assets/global/plugins/select2/js/select2.full.min.js',
                         'assets/pages/scripts/components-bootstrap-select.min.js',
                         'assets/pages/scripts/components-select2.min.js',
                         'views/LaborCode/NewLaborCodeController.js',
                          //services
                         'js/Services/CommonServices/AuthHeaderService.js',
                         'js/Services/LaborCode/LaborCodeService.js'
                    ]
                });
            }]
        }
    })

      .state('PurchaseOrder', {
          url: "/PurchaseOrder",
          templateUrl: "views/PurchaseOrder/PurchaseOrderMapping.html",
          data: {
              pageTitle: 'Purchase Order Mapping',
              roles: [VendorAdmin]
          },
          controller: "PurchaseOrderMappingController",
          resolve: {
              deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                  return $ocLazyLoad.load({
                      name: 'MetronicApp',
                      insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                      files: [
                           'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                           'assets/global/plugins/select2/css/select2.min.css',
                           'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                           'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                           'assets/global/plugins/select2/js/select2.full.min.js',
                           'assets/pages/scripts/components-bootstrap-select.min.js',
                           'assets/pages/scripts/components-select2.min.js',
                           'views/PurchaseOrder/PurchaseOrderMappingController.js',
                            //services
                           'js/Services/CommonServices/AuthHeaderService.js',
                           'js/Services/PurchaseOrder/PurchaseOrderMappingService.js'
                      ]
                  });
              }]
          }
      })

      .state('SalesOrders', {
          url: "/SalesOrders",
          templateUrl: "views/ThirdPartySalesAdmin/SalesAdminOrders.html",
          data: {
              pageTitle: 'Purchase Order Mapping',
              roles: [ShippingAdmin, SalseCoOrdinator]
          },
          controller: "SalesAdminOrdersController",
          resolve: {
              deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                  return $ocLazyLoad.load({
                      name: 'MetronicApp',
                      insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                      files: [
                           'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                           'assets/global/plugins/select2/css/select2.min.css',
                           'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                           'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                           'assets/global/plugins/select2/js/select2.full.min.js',
                           'assets/pages/scripts/components-bootstrap-select.min.js',
                           'assets/pages/scripts/components-select2.min.js',
                           'views/ThirdPartySalesAdmin/SalesAdminOrdersController.js',
                            //services
                           'js/Services/CommonServices/AuthHeaderService.js',
                           'js/Services/ThirdPartySalesAdmin/SalesAdminOrdersService.js'
                      ]
                  });
              }]
          }
      })

       .state('SalesOrderDetails', {
           url: "/SalesOrderDetails",
           templateUrl: "views/ThirdPartySalesAdmin/OrderDetails.html",
           data: { pageTitle: 'Order Details' },
           controller: "OrderDetailsController",
           resolve: {
               deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                   return $ocLazyLoad.load({
                       name: 'MetronicApp',
                       insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                       files: [
                            'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                            'assets/global/plugins/select2/css/select2.min.css',
                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                            'assets/global/plugins/select2/js/select2.full.min.js',
                            'assets/pages/scripts/components-bootstrap-select.min.js',
                            'assets/pages/scripts/components-select2.min.js',
                            'views/ThirdPartySalesAdmin/OrderDetailsController.js',
                            'views/ThirdPartySalesAdmin/LaborCostWorkCodeController.js',
                             //services
                            'js/Services/CommonServices/AuthHeaderService.js',
                            'js/Services/ThirdPartySalesAdmin/OrderDetailsService.js'
                       ]
                   });
               }]
           }
       })

     .state('SetVendorContact', {
         url: "/SetVendorContact",
         templateUrl: "views/SetVendorContact/SetVendorContact.html",
         data: {
             pageTitle: 'Vendor Contact',
             roles: [VendorAdmin]
         },
         controller: "SetVendorContactController",
         resolve: {
             deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                 return $ocLazyLoad.load({
                     name: 'MetronicApp',
                     insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                     files: [
                          'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                          'assets/global/plugins/select2/css/select2.min.css',
                          'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                          'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                          'assets/global/plugins/select2/js/select2.full.min.js',
                          'assets/pages/scripts/components-bootstrap-select.min.js',
                          'assets/pages/scripts/components-select2.min.js',
                          'views/SetVendorContact/SetVendorContactController.js',
                           //services
                          'js/Services/CommonServices/AuthHeaderService.js',
                          'js/Services/SetVendorContact/SetVendorContactService.js'
                     ]
                 });
             }]
         }
     })


     //3rd party Suppliers
    .state('UploadVendorEmployee', {
        url: "/UploadVendorEmployee",
        templateUrl: "views/VendorEmployee/UploadVendorEmployee.html",
        data: {
            pageTitle: 'Upload Vendor Employee',
            roles: [VendorAdmin]
        },
        controller: "UploadVendorEmployeeController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                         'views/VendorEmployee/UploadVendorEmployeeController.js',
                         'js/Services/CommonServices/AuthHeaderService.js',
                          'js/Services/VendorEmployee/UploadVendorEmployeeService.js'
                    ]
                });
            }]
        }
    })
    //Gemlab Dashboard 
    .state('GemlabDashboard', {
        url: "/GemlabDashboard",
        templateUrl: "views/Gemlab/GemlabDashboard.html",
        data: {
            pageTitle: '',
            roles: [GemLabAdmin]
        },
        controller: "GemlabDashboardConroller",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [

                         'views/Gemlab/GemlabDashboardConroller.js',
                         'js/Services/CommonServices/AuthHeaderService.js',
                         'js/Services/GemLabAdmin/GemlabDashboardService.js',
                    ]
                });
            }]
        }
    })

         .state('ClaimDetails', {
             url: "/GemLabClaimDetails",
             templateUrl: "views/Gemlab/GemLabClaimDetails.html",
             data: {
                 pageTitle: 'Claim Details',
                 roles: [GemLabAdmin]
             },
             controller: "GemLabClaimDetailsController",
             resolve: {
                 deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                     return $ocLazyLoad.load({
                         name: 'MetronicApp',
                         insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                         files: [
                         'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                         'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                         'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                         'assets/global/plugins/select2/css/select2.min.css',
                         'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                         'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                         'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',
                         'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                         'assets/fullcalendar.css',
                         'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                         'assets/global/plugins/select2/js/select2.full.min.js',
                         'assets/pages/scripts/components-bootstrap-select.min.js',
                         'assets/pages/scripts/components-select2.min.js',
                         'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                         'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                         'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                         'assets/pages/scripts/components-date-time-pickers.min.js',
                         //Controller
                                'views/Gemlab/GemLabClaimDetailsController.js',
                                'views/ThirdPartyVendor/AddInvoicesController.js',
                                'views/ThirdPartyVendor/AddNewVendorController.js',
                                'views/ThirdPartyVendor/ItemValueController.js',
                                'views/ThirdPartyVendor/ShowClaimAttachmentController.js',
                                'views/ThirdPartyVendor/ShowNotesAttachmentController.js',
                                'views/ThirdPartyVendor/EventDetailsController.js',
                                'views/ThirdPartyVendor/AddNotePopupController.js',
                                'views/ThirdPartyVendor/AddEventPopupController.js',
                                'views/AllNotes/NoteDetailsController.js',
                                'views/Reports/ReportController.js',
                                'views/ThirdPartyVendor/ThirdPartyCreateInvoiceController.js',
                                'views/AddServiceForInvoice/AddServiceForInvoiceController.js',
                                'views/ThirdPartyVendor/PurchaseOrderPopupController.js',
                                'views/ThirdPartyVendor/LaborCostWorkCodeController.js',
                                'views/PurchaseOrder/PurchaseOrderDetailsController.js',
                                'views/ThirdPartyVendor/LaborCostWorkCodeController.js',
                                'views/ThirdPartyVendor/LaborCostWorkCodeController.js',
                                'views/PurchaseOrder/ItemReturnController.js',
                                'views/VendorSupplier/AddSupplierOnTheFlyController.js',
                                'views/Salvage/SalvageDetailsController.js',
                                //services
                               'js/Services/CommonServices/AuthHeaderService.js',                               
                               'js/Services/GemLabAdmin/GemLabClaimDetailsService.js',
                               'js/Services/ThirdPartyVendor/AdjusterPropertyClaimDetailsService.js',
                               'js/Services/ThirdPartyVendor/AddInvoicesService.js',
                               'js/Services/ThirdPartyVendor/ItemValueService.js',
                               'js/Services/ThirdPartyVendor/EventService.js',
                               'js/Services/ThirdPartyVendor/ThirdPartyInvoiceDetailsService.js',
                               'js/Services/ThirdPartyVendor/ServiceRequestOfferedService.js',
                               'js/Services/Report/ReportService.js',
                               'js/Services/PurchaseOrder/PurchaseOrderService.js',
                               'js/Services/VendorSupplier/NewVendorSupplierService.js',
                               'js/Services/AllNotes/AllNotesService.js',
                               'js/Services/Salvage/SalvageService.js',

                         ]
                     });
                 }]
             }
         })


            .state('ItemDetails', {
                url: "/ItemDetails",
                templateUrl: "views/Gemlab/GemLabItemDetails.html",
                data: {
                    pageTitle: 'Line Item Details',
                    roles: [GemLabAdmin]
                },
                controller: "GemLabItemDetailsController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'MetronicApp',
                            insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                            files: [
                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                            'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                            'assets/global/plugins/select2/css/select2.min.css',
                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                            'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',
                            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                            'assets/fullcalendar.css',
                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                            'assets/global/plugins/select2/js/select2.full.min.js',
                            'assets/pages/scripts/components-bootstrap-select.min.js',
                            'assets/pages/scripts/components-select2.min.js',
                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                            'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                            'assets/pages/scripts/components-date-time-pickers.min.js',
                            //Controllers
                            'views/Gemlab/GemLabItemDetailsController.js',
                            'views/ThirdPartyVendor/AddInvoicesController.js',
                            'views/ThirdPartyVendor/ItemValueController.js',
                            'views/ThirdPartyVendor/AddItemNotePopupController.js',
                            'views/PurchaseOrder/PurchaseOrderDetailsController.js',
                            'views/ThirdPartyVendor/LaborCostWorkCodeController.js',
                            'views/ThirdPartyVendor/LaborCostWorkCodeController.js',
                              'views/Salvage/SalvageDetailsController.js',
                             //services
                             'js/Services/CommonServices/AuthHeaderService.js',
                             'js/Services/GemLabAdmin/ItemDetails.js',
                             'js/Services/ThirdPartyVendor/ItemValueService.js',
                             'js/Services/ThirdPartyVendor/AdjusterLineItemDetailsService.js',
                             'js/Services/PurchaseOrder/PurchaseOrderService.js',
                              'js/Services/Salvage/SalvageService.js'

                           
                            ]
                        });
                    }]
                }
            })

    .state('OrderDetails', {
        url: "/OrderDetails",
        templateUrl: "views/Gemlab/GemLabOrderDetails.html",
        data: {
            pageTitle: '',
            roles: [GemLabAdmin]
        },
        controller: "GemLabOrderDetailsController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [

                         'views/Gemlab/GemLabOrderDetailsController.js',
                         'js/Services/CommonServices/AuthHeaderService.js',
                         'js/Services/GemLabAdmin/GemLabOrderDetailService.js',
                          'js/Services/PurchaseOrder/PurchaseOrderService.js',

                    ]
                });
            }]
        }
    })
    .state('SearchPODetails', {
        url: "/SearchPODetails",
        templateUrl: "views/PurchaseOrder/SearchPODetails.html",
        data: { pageTitle: '' },
        controller: "SearchPODetailsController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [

                         'views/PurchaseOrder/SearchPODetailsController.js',
                         'js/Services/CommonServices/AuthHeaderService.js',
                          'js/Services/PurchaseOrder/PurchaseOrderService.js',

                    ]
                });
            }]
        }
    })
          .state('AddItem', {
              url: "/AddItem",
              templateUrl: "views/ThirdPartyVendor/AddItem.html",
              data: {
                  pageTitle: 'AddItem',
                  roles: [VendorContact, VendorAssociate]
              },
              controller: "AddItemController",
              resolve: {
                  deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                      return $ocLazyLoad.load({
                          name: 'MetronicApp',
                          insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                          files: [
                          'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                          'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                          'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                          'assets/global/plugins/select2/css/select2.min.css',
                          'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                          'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                          'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',
                          'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                          'assets/fullcalendar.css',
                          'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                          'assets/global/plugins/select2/js/select2.full.min.js',
                          'assets/pages/scripts/components-bootstrap-select.min.js',
                          'assets/pages/scripts/components-select2.min.js',
                          'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                          'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                          'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                          'assets/pages/scripts/components-date-time-pickers.min.js',
                          //Controller
                                 'views/ThirdPartyVendor/AddItemController.js',
                               
                                 //services
                                'js/Services/CommonServices/AuthHeaderService.js',
                                'js/Services/ThirdPartyVendor/ThirdPartyClaimDetailsService.js',
                                'js/Services/ThirdPartyVendor/AdjusterPropertyClaimDetailsService.js',
                             
                          ]
                      });
                  }]
              }
          })

    .state('PoDetailsInvoice', {
        url: "/PoDetailsInvoice",
        templateUrl: "views/ThirdPartyVendor/PoDetailsInvoice.html",
        data: { pageTitle: 'PoDetails' },
        controller: "PoDetailsInvoiceController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                    'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                    'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                    'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                    'assets/global/plugins/select2/css/select2.min.css',
                    'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                    'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                    'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',
                    'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                    'assets/fullcalendar.css',
                    'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                    'assets/global/plugins/select2/js/select2.full.min.js',
                    'assets/pages/scripts/components-bootstrap-select.min.js',
                    'assets/pages/scripts/components-select2.min.js',
                    'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                    'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                    'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                    'assets/pages/scripts/components-date-time-pickers.min.js',
                    'js/Services/PurchaseOrder/PurchaseOrderService.js',
                    'views/ThirdPartyVendor/PoDetailsInvoiceController.js'
                    ]
                });
            }]
        }
    })
    
.state('salvageDashboard', {
    url: "/salvageDashboard",
    templateUrl: "views/Gemlab/salvageDashboard.html",
    data: {
        pageTitle: '',
        roles: [GemLabAdmin]
    },
    controller: "salvageDashboardController",
    resolve: {
        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load({
                name: 'MetronicApp',
                insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                files: [

                     'views/Gemlab/salvageDashboardController.js',
                     'js/Services/CommonServices/AuthHeaderService.js',
                     'js/Services/GemLabAdmin/salvageDashboardService.js',
                ]
            });
        }]
    }
})

    .state('AllInvoices', {
            url: "/AllInvoices",
            templateUrl: "views/ThirdPartyAccountingAdministrator/AllInvoices.html",
            data: {
                pageTitle: 'All Invoices',
                roles: [AccountingAdmin]
            },
            controller: "AllInvoicesController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                             'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                             'assets/global/plugins/select2/css/select2.min.css',
                             'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                             'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                             'assets/global/plugins/select2/js/select2.full.min.js',
                             'assets/pages/scripts/components-bootstrap-select.min.js',
                             'assets/pages/scripts/components-select2.min.js',

                              //services
                               'views/ThirdPartyAccountingAdministrator/AllInvoicesController.js',
                               'js/Services/ThirdPartyAccountingAdministrator/ClaimBillsService.js',
                               'js/Services/CommonServices/AuthHeaderService.js',
                               'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                               'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                               'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                               'assets/pages/scripts/components-date-time-pickers.min.js',                           

                        ]
                    });
                }]
            }
        })
        //supervisor Dashboard 
    .state('supervisorDashboard', {
        url: "/supervisorDashboard",
        templateUrl: "views/vendorSupervisor/supervisorDashboard.html",
        data: {
            pageTitle: '',
            roles: [VENDOR_SUPERVISOR]
        },
        controller: "supervisorDashboardConroller",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [

                         'views/vendorSupervisor/supervisorDashboardConroller.js',
                         'js/Services/CommonServices/AuthHeaderService.js',
                        'js/Services/vendorSupervisor/supervisorDashboardService.js',
                    ]
                });
            }]
        }
    })

         //supervisor Dashboard 
    .state('Performance', {
        url: "/Performance",
        templateUrl: "views/vendorSupervisor/Performance.html",
        data: {
            pageTitle: '',
            roles: [VENDOR_SUPERVISOR]
        },
        controller: "PerformanceConroller",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                              'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                              'assets/global/plugins/select2/css/select2.min.css',
                              'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                              'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                              'assets/global/plugins/select2/js/select2.full.min.js',
                              'assets/pages/scripts/components-bootstrap-select.min.js',
                              'assets/pages/scripts/components-select2.min.js',

                         'views/vendorSupervisor/PerformanceConroller.js',
                         'js/Services/CommonServices/AuthHeaderService.js',
                         'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                         'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                         'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                         'assets/pages/scripts/components-date-time-pickers.min.js',
                         'js/Services/vendorSupervisor/PerformanceService.js',
                    ]
                });
            }]
        }
    })

    //added by Dilip for SpeedCheckContact appraisal
        .state('SpeedCheckContactAppraisal', {
            url: "/SpeedCheckContactAppraisal",
            templateUrl: "views/SpeedCheckContact/Dashboard/Appraisals/Appraisal.html",
            data: { pageTitle: 'Appraisal', 
                    roles: ['SPEEDCHECK CONTACT'] 
                  },
            controller: "AppraisalController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [


                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                            'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                            'assets/global/plugins/select2/css/select2.min.css',
                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                            'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',
                            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                            'assets/fullcalendar.css',
                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                            'assets/global/plugins/select2/js/select2.full.min.js',
                            'assets/pages/scripts/components-bootstrap-select.min.js',
                            'assets/pages/scripts/components-select2.min.js',
                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                            'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                            'assets/pages/scripts/components-date-time-pickers.min.js',

                            'views/SpeedCheckContact/Dashboard/Appraisals/AppraisalController.js',
                            'views/SpeedCheckContact/Dashboard/Appraisals/AppraisalDetailsController.js',

                            'views/SpeedCheckContact/Dashboard/Notes/NotesController.js',
                            'views/SpeedCheckContact/Dashboard/Notes/AddItemNotePopupController.js',
                            'views/SpeedCheckContact/Dashboard/Appraisals/EmailPopupController.js',
                            'views/SpeedCheckContact/Dashboard/Appraisals/UnderwritterReviewPopupController.js',
                            'views/SpeedCheckContact/Dashboard/Appraisals/InsuranceAgentReviewPopupController.js',
                            'views/SpeedCheckContact/Dashboard/Appraisals/AppraisalComparableController.js',
                            'views/SpeedCheckContact/Dashboard/Appraisals/ViewComparableReportController.js',

                            //services
                            'js/Services/CommonServices/AuthHeaderService.js',
                            'js/Services/Adjuster/AdjusterPropertyClaimDetailsService.js',
                            'js/Services/Adjuster/AdjusterLineItemDetailsService.js',
                            'js/Services/Appraisals/AppraisalService.js',
                            'js/Services/VendorAssociate/VendorAssociateItemDetailService.js',
                            'js/Services/VendorAssociate/VendorAssociateClaimDetailsService.js',
                            'js/Services/ThirdPartyVendor/ThirdPartyLineItemDetails.js',
                            'js/Services/PurchaseOrder/PurchaseOrderService.js',
                            'js/Services/UnderWriterReview/UnderWriterReviewService.js',
                            'js/Services/SpeedCheckContact/SpeedCheckContactService.js'
                        ]
                    });
                }]
            }
        })

        //ViewComparableReport
        .state('ViewComparableReport', {
            url: "/ViewComparableReport",
            templateUrl: "views/SpeedCheckContact/Dashboard/Appraisals/ViewComparableReport.html",
            data: { pageTitle: 'Comparable Report', 
                    roles: ['SPEEDCHECK CONTACT', 'SPEEDCHECK ASSOCIATE', 'SPEEDCHECK SUPERVISOR']
                  },
            controller: "ViewComparableReportController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [


                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                            'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                            'assets/global/plugins/select2/css/select2.min.css',
                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                            'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',
                            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                            'assets/fullcalendar.css',
                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                            'assets/global/plugins/select2/js/select2.full.min.js',
                            'assets/pages/scripts/components-bootstrap-select.min.js',
                            'assets/pages/scripts/components-select2.min.js',
                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                            'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                            'assets/pages/scripts/components-date-time-pickers.min.js',

                            'views/SpeedCheckContact/Dashboard/Appraisals/AppraisalController.js',
                            'views/SpeedCheckContact/Dashboard/Appraisals/AppraisalDetailsController.js',
                            'views/SpeedCheckContact/Dashboard/Appraisals/AppraisalComparableController.js',
                            'views/SpeedCheckContact/Dashboard/Appraisals/ViewComparableReportController.js',

                            //services
                            'js/Services/CommonServices/AuthHeaderService.js',
                            'js/Services/Adjuster/AdjusterPropertyClaimDetailsService.js',
                            'js/Services/Adjuster/AdjusterLineItemDetailsService.js',
                            'js/Services/Appraisals/AppraisalService.js',
                            'js/Services/VendorAssociate/VendorAssociateItemDetailService.js',
                            'js/Services/VendorAssociate/VendorAssociateClaimDetailsService.js',
                            'js/Services/ThirdPartyVendor/ThirdPartyLineItemDetails.js',
                            'js/Services/PurchaseOrder/PurchaseOrderService.js',
                            'js/Services/UnderWriterReview/UnderWriterReviewService.js'

                        ]
                    });
                }]
            }
        })

        //Added by Dilip for SpeedCheckSupervisor
    .state('SpeedCheckSupervisor', {
        url: "/SpeedCheckSupervisor",
        templateUrl: "views/SpeedCheckSupervisor/SpeedCheckSupervisor.html",
        data: { pageTitle: 'SpeedCheckSupervisor', 
        templateUrl: "views/SpeedCheckSupervisor/Dashboard/Appraisals/Appraisal.html",
                roles: ['SPEEDCHECK SUPERVISOR']  
              },
        controller: "SpeedCheckSupervisorController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [

                        'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                        'assets/global/plugins/select2/css/select2.min.css',
                        'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                        'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                        'assets/global/plugins/select2/js/select2.full.min.js',
                        'assets/pages/scripts/components-bootstrap-select.min.js',
                        'assets/pages/scripts/components-select2.min.js',
                        //Controllers
                        'views/SpeedCheckSupervisor/SpeedCheckSupervisorController.js',
                        'views/SpeedCheckSupervisor/Dashboard/DashboardController.js',
                        //services
                        'js/Services/CommonServices/AuthHeaderService.js',
                        'js/Services/SpeedCheckSupervisor/SpeedCheckSupervisorService.js'

                    ]
                });
            }]
        }
    })

    //added by Dilip for SpeedCheckSupervisor appraisal
    .state('SpeedCheckSupervisorAppraisal', {
        url: "/SpeedCheckSupervisorAppraisal",
        templateUrl: "views/SpeedCheckSupervisor/Dashboard/Appraisals/Appraisal.html",
        data: { pageTitle: 'Appraisal', 
                roles: ['SPEEDCHECK SUPERVISOR']
              },
        controller: "AppraisalController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [

                        
                        'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                        'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                        'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                        'assets/global/plugins/select2/css/select2.min.css',
                        'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                        'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                        'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',
                        'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                        'assets/fullcalendar.css',
                        'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                        'assets/global/plugins/select2/js/select2.full.min.js',
                        'assets/pages/scripts/components-bootstrap-select.min.js',
                        'assets/pages/scripts/components-select2.min.js',
                        'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                        'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                        'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                        'assets/pages/scripts/components-date-time-pickers.min.js',

                        'views/SpeedCheckSupervisor/Dashboard/Appraisals/AppraisalController.js',
                        'views/SpeedCheckSupervisor/Dashboard/Appraisals/AppraisalDetailsController.js',
                        'views/SpeedCheckSupervisor/Dashboard/Notes/NotesController.js',
                        'views/SpeedCheckSupervisor/Dashboard/Notes/AddItemNotePopupController.js',                        
                        'views/SpeedCheckSupervisor/Dashboard/Appraisals/EmailPopupController.js',                        
                        'views/SpeedCheckSupervisor/Dashboard/Appraisals/UnderwritterReviewPopupController.js',
                        'views/SpeedCheckSupervisor/Dashboard/Appraisals/InsuranceAgentReviewPopupController.js',
                        'views/SpeedCheckSupervisor/Dashboard/Appraisals/AppraisalComparableController.js',
                        'views/SpeedCheckSupervisor/Dashboard/Appraisals/ViewComparableReportController.js',
                        'views/SpeedCheckSupervisor/Dashboard/Appraisals/AssociateReviewPopupController.js',
                        
                        //services
                        'js/Services/CommonServices/AuthHeaderService.js',
                        'js/Services/Adjuster/AdjusterPropertyClaimDetailsService.js',
                        'js/Services/Adjuster/AdjusterLineItemDetailsService.js',
                        'js/Services/Appraisals/AppraisalService.js',
                        'js/Services/VendorAssociate/VendorAssociateItemDetailService.js',
                        'js/Services/VendorAssociate/VendorAssociateClaimDetailsService.js',
                        'js/Services/ThirdPartyVendor/ThirdPartyLineItemDetails.js',
                        'js/Services/PurchaseOrder/PurchaseOrderService.js',
                        'js/Services/UnderWriterReview/UnderWriterReviewService.js',
                        'js/Services/SpeedCheckSupervisor/SpeedCheckSupervisorService.js'
                        
                    ]
                });
            }]
        }
    })
    
    //added by Nikilesh for SpeedCheckAssociate
    .state('SpeedCheckAssociate', {
            url: "/SpeedCheckAssociate",
            templateUrl: "views/SpeedCheckAssociate/SpeedCheckAssociate.html",
            data: { pageTitle: 'SpeedCheckAssociate', 
                    roles: ['SPEEDCHECK ASSOCIATE']  
                  },
            controller: "SpeedCheckAssociateController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                            'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                            'assets/global/plugins/select2/css/select2.min.css',
                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                            'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',
                            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                            'assets/fullcalendar.css',
                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                            'assets/global/plugins/select2/js/select2.full.min.js',
                            'assets/pages/scripts/components-bootstrap-select.min.js',
                            'assets/pages/scripts/components-select2.min.js',
                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                            'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                            'assets/pages/scripts/components-date-time-pickers.min.js',
                            //Controllers
                            'views/SpeedCheckAssociate/SpeedCheckAssociateController.js',
                            'views/SpeedCheckAssociate/Dashboard/DashboardController.js',
                            //services
                            'js/Services/CommonServices/AuthHeaderService.js',
                            'js/Services/SpeedCheckAssociate/SpeedCheckAssociateService.js'
                        ]
                    });
                }]
            }
        }) 
        
    //added by Dilip for SpeedCheckAssociate appraisal
    .state('SpeedCheckAssociateAppraisal', {
        url: "/SpeedCheckAssociateAppraisal",
        templateUrl: "views/SpeedCheckAssociate/Dashboard/Appraisals/Appraisal.html",
        data: { pageTitle: 'Appraisal', 
                roles: ['SPEEDCHECK ASSOCIATE']
              },
        controller: "AppraisalController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [

                        
                        'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                        'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                        'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                        'assets/global/plugins/select2/css/select2.min.css',
                        'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                        'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                        'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker.standalone.css',
                        'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                        'assets/fullcalendar.css',
                        'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                        'assets/global/plugins/select2/js/select2.full.min.js',
                        'assets/pages/scripts/components-bootstrap-select.min.js',
                        'assets/pages/scripts/components-select2.min.js',
                        'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                        'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                        'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                        'assets/pages/scripts/components-date-time-pickers.min.js',

                        'views/SpeedCheckAssociate/Dashboard/Appraisals/AppraisalController.js',
                        'views/SpeedCheckAssociate/Dashboard/Appraisals/AppraisalDetailsController.js',
                        'views/SpeedCheckAssociate/Dashboard/Notes/NotesController.js',
                        'views/SpeedCheckAssociate/Dashboard/Notes/AddItemNotePopupController.js',                        
                        'views/SpeedCheckAssociate/Dashboard/Appraisals/EmailPopupController.js',                        
                        'views/SpeedCheckAssociate/Dashboard/Appraisals/UnderwritterReviewPopupController.js',
                        'views/SpeedCheckAssociate/Dashboard/Appraisals/InsuranceAgentReviewPopupController.js',
                        'views/SpeedCheckAssociate/Dashboard/Appraisals/AppraisalComparableController.js',
                        'views/SpeedCheckAssociate/Dashboard/Appraisals/ViewComparableReportController.js',
                        'views/SpeedCheckAssociate/Dashboard/Appraisals/SupervisorReviewPopupController.js',
                        
                        //services
                        'js/Services/CommonServices/AuthHeaderService.js',
                        'js/Services/Adjuster/AdjusterPropertyClaimDetailsService.js',
                        'js/Services/Adjuster/AdjusterLineItemDetailsService.js',
                        'js/Services/Appraisals/AppraisalService.js',
                        'js/Services/VendorAssociate/VendorAssociateItemDetailService.js',
                        'js/Services/VendorAssociate/VendorAssociateClaimDetailsService.js',
                        'js/Services/ThirdPartyVendor/ThirdPartyLineItemDetails.js',
                        'js/Services/PurchaseOrder/PurchaseOrderService.js',
                        'js/Services/UnderWriterReview/UnderWriterReviewService.js'
                        
                    ]
                });
            }]
        }
    })

    //Added by Dilip for OpenAssignments
    .state('OpenAssignments', {
        url: "/OpenAssignments",
        templateUrl: "views/OpenAssignments/OpenAssignments.html",
        data: { pageTitle: 'OpenAssignments', 
                roles: ['SPEEDCHECK CONTACT', 'SPEEDCHECK ASSOCIATE', 'SPEEDCHECK SUPERVISOR']
              },
        controller: "OpenAssignmentsController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [

                        'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                        'assets/global/plugins/select2/css/select2.min.css',
                        'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                        'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                        'assets/global/plugins/select2/js/select2.full.min.js',
                        'assets/pages/scripts/components-bootstrap-select.min.js',
                        'assets/pages/scripts/components-select2.min.js',
                        //Controllers
                        'views/OpenAssignments/OpenAssignmentsController.js',
                        //services
                        'js/Services/CommonServices/AuthHeaderService.js',
                        'js/Services/Appraisals/AppraisalService.js',
                        'js/Services/SpeedCheckContact/SpeedCheckContactService.js'

                    ]
                });
            }]
        }
    })

    //Added by Dilip for SpeedCheckAllAppraisals
    .state('SpeedCheckAllAppraisals', {
        url: "/SpeedCheckAllAppraisals",
        templateUrl: "views/SpeedCheckAllAppraisals/AllAppraisals.html",
        data: { pageTitle: 'SpeedCheckAllAppraisals', 
                roles: ['SPEEDCHECK CONTACT', 'SPEEDCHECK ASSOCIATE', 'SPEEDCHECK SUPERVISOR']
              },
        controller: "AllAppraisalsController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [

                        'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                        'assets/global/plugins/select2/css/select2.min.css',
                        'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                        'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                        'assets/global/plugins/select2/js/select2.full.min.js',
                        'assets/pages/scripts/components-bootstrap-select.min.js',
                        'assets/pages/scripts/components-select2.min.js',
                        //Controllers
                        'views/SpeedCheckAllAppraisals/AllAppraisalsController.js',
                        //services
                        'js/Services/CommonServices/AuthHeaderService.js',
                        'js/Services/SpeedCheckContact/SpeedCheckContactService.js'

                    ]
                });
            }]
        }
    })

    //Added by Dilip for SpeedCheckReports
    .state('SpeedCheckReports', {
        url: "/SpeedCheckReports",
        templateUrl: "views/SpeedCheckReports/Reports.html",
        data: { pageTitle: 'SpeedCheckReports', 
                roles: ['SPEEDCHECK CONTACT', 'SPEEDCHECK ASSOCIATE', 'SPEEDCHECK SUPERVISOR']
              },
        controller: "ReportsController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [

                        'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                        'assets/global/plugins/select2/css/select2.min.css',
                        'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                        'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                        'assets/global/plugins/select2/js/select2.full.min.js',
                        'assets/pages/scripts/components-bootstrap-select.min.js',
                        'assets/pages/scripts/components-select2.min.js',
                        //Controllers
                        'views/SpeedCheckReports/ReportsController.js',
                        //services
                        'js/Services/CommonServices/AuthHeaderService.js',
                        'js/Services/SpeedCheckContact/SpeedCheckContactService.js'

                    ]
                });
            }]
        }
    })

    $urlRouterProvider.otherwise("/login");
}]);

/* Init global settings and run the app */
MetronicApp
.run(["$rootScope", "settings", "$state", "$location", "RoleBasedService", "Keepalive", "Idle", function ($rootScope, settings, $state, $location, RoleBasedService, Keepalive, Idle) {
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$settings = settings; // state to be accessed from view
    if (sessionStorage.getItem("IsLogined") === "true")
        Idle.watch();

    $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
        $rootScope.previousParms = fromParams;
        $rootScope.previousState = from.name;
        $rootScope.currentState = to.name;
    });

    $rootScope.$on('$stateChangeStart', function (event, next, current) {
        var count = 0;
        var CurrentRole = sessionStorage.getItem("RoleList")
        //Validating whether the current user has access to screen or not( With each routing we set "role")
        angular.forEach(next.data.roles, function (curRole) {
            if (CurrentRole.toUpperCase() == curRole.toUpperCase()) {
                count++;
            }
        });
        //If Does't have access to screen then count==0
        if (count == 0) {
            var path = $location.path();
            if (path != "/login") {
                // For unauthenticated users
                var loginStatus = sessionStorage.getItem("IsLogined");
                if (angular.isDefined(loginStatus) && loginStatus != null) {
                    toastr.remove();
                    $location.path("/login");
                    toastr.error("Access Denied", "Error");

                }
                    //If user logged out automatically using Idle state
                else {
                    $location.path("/login");
                }

            }
        }
    });
    $rootScope.$on('$locationChangeStart', function (event, next, current) {

        var isFirstTimelogin = sessionStorage.getItem("isResetPassword");
        if (isFirstTimelogin == "true") {
            $location.url("/Security");
        }
        if ((next.toLowerCase()).indexOf('register') !== -1 || (next.toLowerCase()).indexOf('forgotpassword') !== -1 || (next.toLowerCase()).indexOf('newvendorregistration') !== -1 
            || (next.toLowerCase()).indexOf('vendorlogin') !== -1 || (next.toLowerCase()).indexOf('podetailsinvoice') !== -1) {
        }
        else {
            if (sessionStorage.getItem("IsLogined") === "true") {
                Idle.watch();
                $rootScope.IsLoginedUser = true;
                document.body.style.backgroundColor = "white";
                $(".wrapBoxShodow").css("box-shadow", "0px 1px 16px 1px #364150");
                //var myElement = document.querySelector(".page-wrapper .page-wrapper-middle");
                // myElement.style.backgroundColor = "#eff3f8";
                var myEl = angular.element(document.querySelector('.page-on-load'));
                myEl.addClass('div_MainBody');

                var path = $location.path();//If user is logged in and trying to access uysnauthorised resource
                if (angular.isUndefined(path) || path == "/" || path == "/login") {
                    $rootScope.IsLoginedUser = false;
                    $location.path("/login");
                }
            }
            else {
                //document.body.style.backgroundColor = "#364150";
                $(".wrapBoxShodow").css("box-shadow", "0px 1px 0px 1px #364150");
                $rootScope.IsLoginedUser = false;
                $location.path("/login");
            }
        }
    });

}]);
