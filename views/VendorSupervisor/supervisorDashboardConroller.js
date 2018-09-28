angular.module('MetronicApp').controller('supervisorDashboardConroller', function ($translate, $translatePartialLoader, $rootScope, $log, $scope, $filter, settings, $http, $timeout, $location, supervisorDashboardService, AuthHeaderService) {
    $translatePartialLoader.addPart('VendorSupervisorDashboard');
    $translate.refresh();
    $scope.init = init;
    $scope.AssociateList = [];
    function init() {
        $(".page-spinner-bar").removeClass("hide");
        GetAlertsList();
        GetEventsList();
        // GetAssignments();
        GetAssociates();
    }
    init();
    $scope.CurrentEventTab = 'Alert';
    $scope.CurrentKPITab = "Month";
    $scope.GetAlertsList = GetAlertsList;
    function GetAlertsList() {
        //Get Alert List
        var param = {
            "id": sessionStorage.getItem("UserId").toString()            
        };
        var GetAlertList = supervisorDashboardService.getAlertList(param);
        GetAlertList.then(function (success) {
            $scope.AlertList = success.data.data;           
            var UnreadAlert = $filter('filter')($scope.AlertList, { isRead: false });
            $scope.AlertList = UnreadAlert;

        }, function (error) {
            toastr.remove();
            toastr.error(error.data.errorMessage, "Error");
            $scope.ErrorMessage = error.data.errorMessage;
        });
    };
    $scope.GetEventsList = GetEventsList;
    function GetEventsList() {
        //Get Alert List
        var param = {
            "id": sessionStorage.getItem("UserId").toString()
        };
        var GetAlertList = supervisorDashboardService.getEventList(param);
        GetAlertList.then(function (success) {
            $scope.EventList = success.data.data;            
            var UnreadEvent = $filter('filter')($scope.EventList, { isRead: false });
            $scope.eventList = UnreadEvent;
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            toastr.remove();
            toastr.error(error.data.errorMessage, "Error");
            $scope.ErrorMessage = error.data.errorMessage;
            $(".page-spinner-bar").addClass("hide");
        });
    };
    $scope.Details = [
        { "Associate": "Aaron, Hank.", "OpenAssignemnt": "10", "OverdueAssignemnt": 5 },
        { "Associate": "Abagnale, Frank.", "OpenAssignemnt": "20", "OverdueAssignemnt": 7 },
        { "Associate": "Banhart, Devendra.", "OpenAssignemnt": "30", "OverdueAssignemnt": 3 },
        { "Associate": "Stravinsky, Igor.", "OpenAssignemnt": "40", "OverdueAssignemnt": 6 },
        { "Associate": "Šustauskas, Vytautas.", "OpenAssignemnt": "50", "OverdueAssignemnt": 7 },
        { "Associate": "Swift, Jonathan.", "OpenAssignemnt": "60", "OverdueAssignemnt": 9 },
    ]

    $scope.GoToMenmberPerformanceDetails = GoToMenmberPerformanceDetails;
    function GoToMenmberPerformanceDetails(item) {
        sessionStorage.setItem("vendorAssociate", item.associateDetails.id)
        $location.url('Performance');
    }

    //Sorting of datatbale  
    $scope.reverse = true;
    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.AssociateList = $filter('orderBy')($scope.AssociateList, $scope.sortKey);
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

    $scope.GetAssociates = GetAssociates();
    function GetAssociates() {
        var param = {
            "id": sessionStorage.getItem("UserId").toString()
        };
        var GetAssociateDetails = supervisorDashboardService.getAssociateDetails(param);
        GetAssociateDetails.then(function (success) {
            if (success.data.data != null)
            {
                $scope.AssociateList = angular.isDefined(success.data.data.supervisorAssociates)?success.data.data.supervisorAssociates:null;
            }
            
            //var UnreadEvent = $filter('filter')($scope.EventList, { isRead: false });
            //$scope.eventList = UnreadEvent;
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            $(".page-spinner-bar").addClass("hide");
            toastr.remove();
            toastr.error((angular.isDefined(error.data) && angular.isDefined(error.data.errorMessage) ? error.data.errorMessage : AuthHeaderService.genericErrorMessage()), "Error")
        });
    }

    //$scope.GetAssignments = GetAssignments;
    //function GetAssignments() {
    //    var param = {
    //        "id": sessionStorage.getItem("UserId").toString()
    //    };
    //    var GetAlertList = supervisorDashboardService.assignmenstoreview(param);
    //    GetAlertList.then(function (success) {
    //        $scope.MyAssignments = success.data.data.vendorClaims;
    //        $(".page-spinner-bar").addClass("hide");
    //    }, function (error) {
    //        toastr.remove();
    //        toastr.error((angular.isDefined(error.data)&&error.data!=null && angular.isDefined(error.data.errorMessage) ? error.data.errorMessage : AuthHeaderService.genericErrorMessage()), "Error")
    //        //$scope.ErrorMessage = error.data.errorMessage;
    //        $(".page-spinner-bar").addClass("hide");
    //    });
    //}
});