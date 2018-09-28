angular.module('MetronicApp')
    .filter('formatDate', function ($filter) {
        return function (input) {
            if (input === null || input === "" || angular.isUndefined(input)) { return ""; }
            if (input.indexOf(':') > -1) {
                // input = (input.split('-')[2]).split('T')[0] + '-' + input.split('-')[0] + '-' + input.split('-')[1] + 'T' + (input.split('-')[2]).split('T')[1];
                var a = input.split('T');
                var localDate = new Date(a[0]);
                var dt = new Date(localDate);
                return $filter('date')(dt, "MM/dd/yyyy");
            }
            else {
                var localDate = new Date(input);
                var dt = new Date(localDate);
                return $filter('date')(dt, "MM/dd/yyyy");
            }
        };
    })
    .filter('titleCase', function () {
        return function (input) {
            input = input || '';
            return input.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
        };
    })
    .controller('OpenAssignmentsController', function ($rootScope, $scope, $filter, settings, $http, $location, $translate, $translatePartialLoader, SpeedCheckContactService, AppraisalService,
        AuthHeaderService) {

        $scope.ShowHeader = true;
        $scope.$on('$viewContentLoaded', function () {
            // initialize core components
            App.initAjax();
        });
        //set language
        $translatePartialLoader.addPart('OpenAssignments');
        //$translatePartialLoader.addPart('InsuranceAgentHome');
        $translate.refresh();
        $scope.ErrorMessage = "";
        $scope.ComapnyList = [];
        $scope.CompanyDetails;

        $scope.SelectedType = {};
        $scope.OfficeDetails = {};
        $scope.OfficeList = [];
        $scope.FilteredOffice;
        $scope.StateList = [];
        $scope.currentPage = 1;
        //$scope.CompanyLogo = [];
        $scope.SelectedOffice = {};
        $scope.ListCompany = true;
        $scope.AddCompany = false;
        $scope.ShowComanyDetails = true;
        $scope.showPersonalDetails = false;
        $scope.AddOffice = false;
        $scope.MemberContact = false;
        $scope.OfficeSummary = false;
        $scope.FlagForBreadcrumb = null;
        $scope.UserType = sessionStorage.getItem('RoleList');
        $scope.FileUploadSave = false;
        $scope.parameter = {};
        $scope.policy = {};
        $scope.NotificationsList = [];

        $scope.OpenAssignmentsList = [];
        $scope.appraisalList = [];
        $scope.appraisalMap = {};
        $scope.KPIsAppraisals = 0;

        function init() {
            $scope.isShowAlerts = true;
            $scope.isShowKpis = true;
            $scope.pageNumber = 0;

            {
                ShowItem: "All"
            };


            getNotifications();
            //GetAppraisalList($scope.pageNumber);
            GetAllOpenAssignments();
            //pageChangeHandler($scope.pageNumber);

        }
        init();

        $scope.GoToHome = GoToHome;
        function GoToHome() {
            $location.path('SpeedCheckContact')
        }

        $scope.GoToDashboard = GoToDashboard;
        function GoToDashboard() {
            $(".page-spinner-bar").removeClass("hide");
            $scope.tab = 'Dashboard';
            $(".page-spinner-bar").addClass("hide");
        }

        $scope.GoToAllAppraisals = GoToAllAppraisals;
        function GoToAllAppraisals() {
            $(".page-spinner-bar").removeClass("hide");
            $scope.tab = 'AllAppraisals';
            $(".page-spinner-bar").addClass("hide");
        }

        $scope.GoToReports = GoToReports;
        function GoToReports() {
            $(".page-spinner-bar").removeClass("hide");
            $scope.tab = 'Reports';
            $(".page-spinner-bar").addClass("hide");
        }

        $scope.GoToSettings = GoToSettings;
        function GoToSettings() {
            $(".page-spinner-bar").removeClass("hide");
            $scope.tab = 'Settings';
            $(".page-spinner-bar").addClass("hide");
        }

        //GoToPolicyDetails
        $scope.GoToPolicyDetails = GoToPolicyDetails;
        function GoToPolicyDetails() {
            $location.path('/PolicyDetail');
        }

        $scope.getNotifications = getNotifications;
        function getNotifications() {
            $scope.showViewBtn = true;
            var role = $scope.UserType;
            var param = {
                "limit": 5,
                "VendorId": sessionStorage.getItem("UserId"),
                "Role": role,
                "Company": sessionStorage.getItem("CompanyId")
            }

            $(".page-spinner-bar").removeClass("hide");
            var getNotifications = SpeedCheckContactService.getNotifications(param);
            getNotifications.then(function (success) {
                $scope.NotificationsList = success.data.notifications;
                $(".page-spinner-bar").addClass("hide");
            }, function (error) {
                if (error.status === 500 || error.status === 404) {
                    toastr.remove();
                    toastr.error(AuthHeaderService.genericErrorMessage(), "Error");
                };
                $(".page-spinner-bar").addClass("hide");
            });
        }

        $scope.getAllNotifications = getAllNotifications;
        function getAllNotifications() {
            $scope.showViewBtn = true;
            var role = $scope.UserType;
            var param = {
                "limit": 0,
                "VendorId": sessionStorage.getItem("UserId"),
                "Role": role,
                "Company": sessionStorage.getItem("CompanyId")
            }
            $(".page-spinner-bar").removeClass("hide");
            var getNotifications = SpeedCheckContactService.getNotifications(param);
            getNotifications.then(function (success) {
                $scope.NotificationsList = success.data.notifications;
                $(".page-spinner-bar").addClass("hide");
            }, function (error) {
                if (error.status === 500 || error.status === 404) {
                    toastr.remove();
                    toastr.error(AuthHeaderService.genericErrorMessage(), "Error");
                };
                $(".page-spinner-bar").addClass("hide");
            });
        }


        $scope.appraisalInNotification = appraisalInNotification
        function appraisalInNotification(item) {
            $(".page-spinner-bar").removeClass("hide");
            //console.log(item); appraisalId  appraisalNumber
            if (item != null) {
                sessionStorage.setItem("id", item.appraisal.id);
                sessionStorage.setItem("appraisalNumber", item.appraisal.appraisalNumber);
                sessionStorage.setItem("isAssignAppraisal", false); 
                
                if ($scope.UserType == 'SPEEDCHECK ASSOCIATE') {
                    $location.url('/SpeedCheckAssociateAppraisal');
                } else if($scope.UserType == 'SPEEDCHECK SUPERVISOR'){
                    $location.url('/SpeedCheckSupervisorAppraisal');
                } else {
                    $location.url('/SpeedCheckContactAppraisal');
                }
            }
            $(".page-spinner-bar").addClass("hide");
        }

        // Open AppraisalDetailsPage
        $scope.openAppraisalDetailsPage = openAppraisalDetailsPage;
        function openAppraisalDetailsPage(item) {
            $(".page-spinner-bar").removeClass("hide");
            //console.log(item); appraisalId  appraisalNumber
            if (item != null) {
                sessionStorage.setItem("id", item.id);
                sessionStorage.setItem("appraisalId", item.appraisalId);
                sessionStorage.setItem("appraisalNumber", item.appraisalNumber);
                sessionStorage.setItem("isAssignAppraisal", false); 

                if ($scope.UserType == 'SPEEDCHECK ASSOCIATE') {
                    assignAppraisal(); // Self assign and navigate to associate appraisalDetails page
                } else if($scope.UserType == 'SPEEDCHECK SUPERVISOR'){
                    $location.url('/SpeedCheckSupervisorAppraisal');
                } else {
                    $location.url('/SpeedCheckContactAppraisal');
                }
            }
            $(".page-spinner-bar").addClass("hide");
        }


        //appraisalList
        $scope.GetAllOpenAssignments = GetAllOpenAssignments;
        function GetAllOpenAssignments() {
            $(".page-spinner-bar").removeClass("hide");
            //var role = "SPEEDCHECK_CONTACT";    
            var tabCount = 0;
            var getOfficePromise = SpeedCheckContactService.getAllOpenAssignmentsList();
            getOfficePromise.then(function (success) {
                console.log(success.data);
                $scope.OpenAssignmentsList = success.data.openAssignments;
                angular.forEach($scope.OpenAssignmentsList, function (item) {                    
                     if(item.active){
                        $scope.appraisalList = item.appraisals;
                        // Formating Appraisal list
                        angular.forEach($scope.appraisalList, function (item) {
                            if ((item.policyholderDetails.primaryPolicyHolderFname != null || item.policyholderDetails.primaryPolicyHolderFname != "") && (item.policyholderDetails.primaryPolicyHolderLname != null || item.policyholderDetails.primaryPolicyHolderLname != "")) {
                                item.appraisalPolicyHolder = item.policyholderDetails.primaryPolicyHolderLname + ", " + item.policyholderDetails.primaryPolicyHolderFname;
                            }
                            else if (item.policyholderDetails.primaryPolicyHolderFname == null && item.policyholderDetails.primaryPolicyHolderFname == "") {
                                item.appraisalPolicyHolder = item.policyholderDetails.primaryPolicyHolderLname;
                            }
                            else if (item.policyholderDetails.primaryPolicyHolderLname == null && item.policyholderDetails.primaryPolicyHolderLname == "") {
                                item.appraisalPolicyHolder = item.policyholderDetails.primaryPolicyHolderFname;
                            }

                            if (item.sc_insuranceReplacementValue == null || item.sc_insuranceReplacementValue == 0) {
                                item.sc_insuranceReplacementValue = usCurrency$Format(0.0);
                            } else {
                                item.sc_insuranceReplacementValue = usCurrency$Format(item.sc_insuranceReplacementValue);
                            }
                         });
                     }
                     $scope.appraisalMap[item.itemCategory.categoryName] = item.appraisals;
                     if(item.appraisalCount > 0){
                         if(tabCount==0){
                            item.active = true;
                            loadSelectedTabData(item.itemCategory);
                         }
                        $scope.KPIsAppraisals += item.appraisalCount;
                        tabCount++;
                    }
                    
                });

                // 

                // Dynamic tab width
                if (tabCount > 6) {
                    $scope.tabWidth = (100 / tabCount) - 0.5;
                } else {
                    $scope.tabWidth = 16;
                }

                $scope.FilteredOffice = success.data.data;
                $(".page-spinner-bar").addClass("hide");
            }, function (error) {
                $scope.ErrorMessage = error.data.errorMessage;
                $(".page-spinner-bar").addClass("hide");
            });
        }

        // Get appraisals under item category
        $scope.getAppraisalsUnderCategory = getAppraisalsUnderCategory;
        function getAppraisalsUnderCategory(itemCategory) {
            $(".page-spinner-bar").removeClass("hide");
            var param = {
                "itemCategoryId": itemCategory.id,
                "searchString": "",
                "startPos": 0,
                "maxResult": 25
            }

            var getAppraisals = SpeedCheckContactService.getAppraisalsUnderCategory(param);
            getAppraisals.then(function (success) {

                $scope.appraisalList = success.data.Appraisals;
                angular.forEach($scope.appraisalList, function (item) {
                    if ((item.policyholderDetails.primaryPolicyHolderFname != null || item.policyholderDetails.primaryPolicyHolderFname != "") && (item.policyholderDetails.primaryPolicyHolderLname != null || item.policyholderDetails.primaryPolicyHolderLname != "")) {
                        item.appraisalPolicyHolder = item.policyholderDetails.primaryPolicyHolderLname + ", " + item.policyholderDetails.primaryPolicyHolderFname;
                    }
                    else if (item.policyholderDetails.primaryPolicyHolderFname == null && item.policyholderDetails.primaryPolicyHolderFname == "") {
                        item.appraisalPolicyHolder = item.policyholderDetails.primaryPolicyHolderLname;
                    }
                    else if (item.policyholderDetails.primaryPolicyHolderLname == null && item.policyholderDetails.primaryPolicyHolderLname == "") {
                        item.appraisalPolicyHolder = item.policyholderDetails.primaryPolicyHolderFname;
                    }

                    if (item.sc_insuranceReplacementValue == null || item.sc_insuranceReplacementValue == 0) {
                        item.sc_insuranceReplacementValue = usCurrency$Format(0.0);
                    } else {
                        item.sc_insuranceReplacementValue = usCurrency$Format(item.sc_insuranceReplacementValue);
                    }
                });
                $scope.FilteredOffice = success.data.data;

                $(".page-spinner-bar").addClass("hide");
            }, function (error) {
                $scope.ErrorMessage = error.data.errorMessage;
                $(".page-spinner-bar").addClass("hide");
            });
        }

        // Sort Appraisal List Columns
        $scope.sort = function (keyname) {
            $scope.sortKey = keyname;   //set the sortKey to the param passed
            $scope.reverse = !$scope.reverse; //if true make it false and vice versa
        }

        // US Currency with $ Format
        function usCurrency$Format(num) {
            return '$' + num.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
        }

        // loadSelectedTabData
        $scope.loadSelectedTabData = loadSelectedTabData;
        function loadSelectedTabData(tabName) {
            //console.log(tabName);
            //console.log($scope.appraisalMap);
            $scope.appraisalList = $scope.appraisalMap[tabName.categoryName];

            getAppraisalsUnderCategory(tabName);
        }


        // Assign Appraisal for SpeedCheck User
        $scope.goToAssignAppraisal = goToAssignAppraisal;
        function goToAssignAppraisal(item) {
            $(".page-spinner-bar").removeClass("hide");
            //console.log(item); appraisalId  appraisalNumber
            if (item != null) {
                sessionStorage.setItem("id", item.id);
                sessionStorage.setItem("appraisalId", item.appraisalId);
                sessionStorage.setItem("appraisalNumber", item.appraisalNumber);
                sessionStorage.setItem("isAssignAppraisal", true);

                if ($scope.UserType == 'SPEEDCHECK CONTACT') {
                    $location.url('/SpeedCheckContactAppraisal');
                } else if($scope.UserType == 'SPEEDCHECK SUPERVISOR'){
                    $location.url('/SpeedCheckSupervisorAppraisal');
                }              
            }
            $(".page-spinner-bar").addClass("hide");            
        }

        $scope.assignAppraisal = assignAppraisal;
        function assignAppraisal() {
            
            var UserId = sessionStorage.getItem("UserId");
            var UserFirstName = sessionStorage.getItem("UserFirstName");
            var UserLastName = sessionStorage.getItem("UserLastName");
            var RoleList = sessionStorage.getItem("RoleList");

            var associateEmp= {'employeeNumber': UserId, 'firstName': UserFirstName, 'lastName': UserLastName,
                                      'reviewsInHand': "0", 'roleName': RoleList, 'specialist': ""};
            var associateEmployee =JSON.stringify(associateEmp);
            
                $(".page-spinner-bar").addClass("remove");
                var data = {
                    "associate": angular.fromJson(associateEmployee),
                    "appraisalId": sessionStorage.getItem("id")
                }
                var assign = AppraisalService.assignAppraisalToAssociate(data);
                assign.then(function (success) {
                    toastr.remove();
                    toastr.success("The appraisal # "+sessionStorage.getItem("appraisalNumber")+" was successfully assigned to "+data.associate.lastName+","+data.associate.firstName, "Success");
                    $location.url('/SpeedCheckAssociateAppraisal');
                }, function (error) {
                    toastr.remove();
                    $(".page-spinner-bar").addClass("hide");
                    if (error.data.errorMessage != null && angular.isDefined(error.data.errorMessage)) {
                        toastr.error(error.data.errorMessage, "Error")
                    }
                    else {
                        toastr.error(AuthHeaderService.genericErrorMessage(), "Error")
                    }
                });
            }     
    });

