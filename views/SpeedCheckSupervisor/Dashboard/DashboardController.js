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
    .controller('DashboardController', function ($rootScope, $scope, $filter, settings, $http, $location, $translate, $translatePartialLoader, SpeedCheckSupervisorService,
        AuthHeaderService) {

        $scope.ShowHeader = true;
        $scope.$on('$viewContentLoaded', function () {
            // initialize core components
            App.initAjax();
        });
        //set language
        $translatePartialLoader.addPart('Dashboard');
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

        $scope.teamPerformanceList = [
            {associate:"Payne, Liam" , openAppraisals:10 , overdueAppraisals:0},
            {associate:"Kors, Michael" , openAppraisals:9 , overdueAppraisals:1},
            {associate:"Pitt, Bradd" , openAppraisals:25 , overdueAppraisals:2},
            {associate:"Payne, Liam" , openAppraisals:10 , overdueAppraisals:0},
            {associate:"Kors, Michael" , openAppraisals:9 , overdueAppraisals:1},
            {associate:"Pitt, Bradd" , openAppraisals:25 , overdueAppraisals:2}
        ];
          
        function init() {
            $scope.isShowAlerts = true;
            $scope.isShowKpis = true;
            $scope.pageNumber = 0;

            {
                ShowItem: "All"
            };

            getNotifications();
            GetAppraisalList($scope.pageNumber);
            //pageChangeHandler($scope.pageNumber);

        }
        init();


        $scope.getNotifications = getNotifications;
        function getNotifications() {
            $scope.showViewBtn = true;
            var role = "SPEEDCHECK SUPERVISOR";
            var param = {
                "limit": 5,
                "VendorId": sessionStorage.getItem("UserId"),
                "Role": role,
                "Company": sessionStorage.getItem("CompanyId")
            }

            $(".page-spinner-bar").removeClass("hide");
            var getNotifications = SpeedCheckSupervisorService.getNotifications(param);
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
            var role = "SPEEDCHECK SUPERVISOR";
            var param = {
                "limit": 0,
                "VendorId": sessionStorage.getItem("UserId"),
                "Role": role,
                "Company": sessionStorage.getItem("CompanyId")
            }
            $(".page-spinner-bar").removeClass("hide");
            var getNotifications = SpeedCheckSupervisorService.getNotifications(param);
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


        $scope.appraisalDetailsPage = appraisalDetailsPage
        function appraisalDetailsPage(item) {
         $(".page-spinner-bar").removeClass("hide");
            //console.log(item); appraisalId  appraisalNumber
            if (item != null) {
                sessionStorage.setItem("id", item.appraisal.id);
                sessionStorage.setItem("appraisalNumber", item.appraisal.appraisalNumber);
                sessionStorage.setItem("isAssignAppraisal", false); 
                $location.url('SpeedCheckSupervisorAppraisal');
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
                $location.url('SpeedCheckSupervisorAppraisal');
            }
            $(".page-spinner-bar").addClass("hide");
        }


        //appraisalList
        $scope.GetAppraisalList = GetAppraisalList;
        function GetAppraisalList() {
            $(".page-spinner-bar").removeClass("hide");
            var param = {
                "userId" : sessionStorage.getItem("UserId"),
                "role" : "SPEEDCHECK SUPERVISOR"
            }

           
            $scope.appraisalList = [];
            $scope.KPIsAppraisals = 0;
            var getOfficePromise = SpeedCheckSupervisorService.getAppraisalList(param);
            getOfficePromise.then(function (success) {
                $scope.appraisalList = success.data.appraisalList;
                console.log($scope.appraisalList);
                
                $scope.KPIsAppraisals = $scope.appraisalList.length;
                angular.forEach($scope.appraisalList, function (item) {
                      if((item.policyholderDetails.primaryPolicyHolderFname != null || item.policyholderDetails.primaryPolicyHolderFname != "") && (item.policyholderDetails.primaryPolicyHolderLname != null || item.policyholderDetails.primaryPolicyHolderLname != "")){
                         item.appraisalPolicyHolder= item.policyholderDetails.primaryPolicyHolderLname+ ", " +item.policyholderDetails.primaryPolicyHolderFname;
                      }
                      else if(item.policyholderDetails.primaryPolicyHolderFname == null && item.policyholderDetails.primaryPolicyHolderFname == ""){
                         item.appraisalPolicyHolder= item.policyholderDetails.primaryPolicyHolderLname;
                      }
                      else if(item.policyholderDetails.primaryPolicyHolderLname == null && item.policyholderDetails.primaryPolicyHolderLname == ""){
                         item.appraisalPolicyHolder= item.policyholderDetails.primaryPolicyHolderFname;
                      }
                      
                      if (item.sc_insuranceReplacementValue == null || item.sc_insuranceReplacementValue == 0) {
                            item.sc_insuranceReplacementValue = usCurrency$Format(0.0);
                      }else{
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


    });
