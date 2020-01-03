angular.module('MetronicApp').controller('AppraisalController', function ($rootScope, $scope, $filter, settings, $http, $location, $translate, $translatePartialLoader,
    AuthHeaderService) {

        $translatePartialLoader.addPart('Appraisal');
        $translate.refresh();
        $scope.ShowHeader = true;
        $scope.$on('$viewContentLoaded', function () {
            // initialize core components
            App.initAjax();
        });

        $scope.isEditAppraisal = "true";
        $scope.EditAppraisal = "true";
        $scope.AppraisalNo=sessionStorage.getItem("appraisalNumber");
        $scope.comparableReport=sessionStorage.getItem("comparableReport");
        $scope.tab = 'appraisal';
        //set language
       
        $scope.ErrorMessage = "";
       
    
       
        $scope.StateList = [];
        //$scope.CompanyLogo = [];
       
        $scope.UserType = sessionStorage.getItem('RoleList');
        
        function init() {
           
    
            {
                ShowItem: "All"
            };
            $scope.policyDetail = {};

        //$scope.policyDetail. = sessionStorage.getItem("policyDetail");
        $scope.policyDetail.policyNumber = sessionStorage.getItem("policyNumber");
        $scope.policyDetail.primaryPolicyHolderFname = sessionStorage.getItem("primaryPolicyHolderFname");
        $scope.policyDetail.primaryPolicyHolderLname = sessionStorage.getItem("primaryPolicyHolderLname");
        $scope.policyDetail.secondaryPolicyHolderFname = sessionStorage.getItem("secondaryPolicyHolderFname");
        $scope.policyDetail.zipcode = sessionStorage.getItem("zipcode");
        $scope.policyDetail.primaryPolicyHolderCellphoneNo = sessionStorage.getItem("primaryPolicyHolderCellphoneNo");
        $scope.policyDetail.primaryPolicyHolderEmailId = sessionStorage.getItem("primaryPolicyHolderEmailId");
        $scope.policyDetail.policyEffectiveDate = sessionStorage.getItem("policyEffectiveDate");
       
        //console.log($scope.policyDetail);

        //Get page from which its redirecting
        var refferer = sessionStorage.getItem("refferer");
        if(refferer==="SEARCH_RESULT")
        $scope.searchResult = true;

          // AppraisalDetails or AssignAppraisal page display
          if(sessionStorage.getItem("isAssignAppraisal")=='true'){
                $("#appraisal-Details").addClass("hide");
                $("#appraisal-assignment").removeClass("hide");
          }else{
                $("#appraisal-Details").removeClass("hide");
                $("#appraisal-assignment").addClass("hide");
          }
        }
        init();

        $scope.showNotes = showNotes;
        function showNotes() {
            $(".page-spinner-bar").removeClass("hide");
    
            // GetNotes();
            $scope.tab = 'Notes';

            $(".page-spinner-bar").addClass("hide");
    
        }  
        
        $scope.GoToHome = GoToHome;
        function GoToHome(){


            sessionStorage.setItem("comparableReport",false);
           $location.path('/SpeedCheckAssociate');
        }

        //GoToAppraisal
        $scope.GoToAppraisal = GoToAppraisal;
        function GoToAppraisal(){
            sessionStorage.setItem("comparableReport",false);
            location.reload();
        }
});