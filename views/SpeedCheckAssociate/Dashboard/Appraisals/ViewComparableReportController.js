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
   
    .directive('stringToNumber', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                ngModel.$parsers.push(function (value) {
                    return '' + value;
                });
                ngModel.$formatters.push(function (value) {
                    if (value == '0.0') {
                        return value = null;
                    } else {
                        return parseFloat(value, 100);
                    }
                });
            }
        };
    }) 

    .controller('ViewComparableReportController', function ($rootScope, $scope, settings, $location, $translate, $translatePartialLoader, $window,
        $filter, AuthHeaderService, AppraisalService, $uibModal) {
        $scope.$on('$viewContentLoaded', function () {
            // initialize core components
            App.initAjax();
        });

        //set language
        $translatePartialLoader.addPart('AddAppraisal');
        $translate.refresh();
        $scope.PageSize = settings.pagesize;
        $scope.UserType = sessionStorage.getItem("RoleList");
        $scope.UserName = sessionStorage.getItem("UserLastName") + ", " + sessionStorage.getItem("UserFirstName")
        $scope.isEditAppraisal = false;
        $scope.ApprisalOrderAddEdit = true;
        $scope.ApprisalList = [];
        $scope.MyLength;
        $scope.Desc = { "description": "" }

        var details = {};

        $scope.files = [];
        $rootScope.tempFiles = [];
        $scope.genderList = [];
        $scope.Custom = [];
        $scope.appraisals = [];
        $scope.Metal = [];
        $scope.MetalColor = [];
        $scope.JewellaryType = [];
        $scope.shape = [];
        $scope.color = [];
        $scope.attachmentList = [];
        $scope.attachmentEditList = [];
        $scope.clarity = [];
        $scope.typeofAppraisal = [];
        $scope.isReplacement = false;
        $scope.showAttachmentErro = false;
        var stoneDetails = [];
        $scope.Appraisal =
            {
                "selectedGender": "",
                "SelectedCustom": "",
                "selectedMetal": "",
                "metalcolor": "",
                
            };

        $scope.Desc.description = "";
        $scope.AppraisalDropdowns = [];
        $scope.diamond = {};
        $scope.init = init;
        function init() {
            
            getAppraisalDetails();
        }
        init();



       
       

       

        //getAppraisalDetails
        $scope.getAppraisalDetails = getAppraisalDetails;
        function getAppraisalDetails() {
            $(".page-spinner-bar").removeClass("hide");
            $scope.IsEditOrder = true;
            var param = {
                "appraisalId" : sessionStorage.getItem("id"),
                "role" : sessionStorage.getItem('RoleList') ,
                "user" : sessionStorage.getItem('UserId')     
                }

            var details = AppraisalService.getAppraisal(param);
            details.then(function (success) {
                //comparable start
                $scope.Comparables = success.data.appraisalDataDTO;
                ComparableList = [];
                $scope.AddedComparables = [];
                $scope.DeletedComparables = [];

                

                var appraisalDetails = success.data.appraisalDataDTO;
                // var gender = {
                // "attributeValueId":1,
                // "atttibuteValue":"Ladies"

                // };
                $scope.supervisorReviewStatus = appraisalDetails.supervisorReviewStatus;
                sessionStorage.setItem("appraisalNumber", appraisalDetails.appraisalNumber);
                sessionStorage.setItem("createdBy", appraisalDetails.createdBy);
                sessionStorage.setItem("policyNumber", appraisalDetails.policyNumber);
               

                // var MetalType = ;
                

                

                var speedCheckSuggestedValue = roundOf2Decimal(appraisalDetails.sc_artigemReplacementValue);
                
                var AppraisalValue = roundOf2Decimal(appraisalDetails.appraisalOldValue);

                // Speedcheck Value
              


                $scope.Appraisal = {
                    "appraisalNumber":appraisalDetails.appraisalNumber,
                    "OriginalDescription": appraisalDetails.original_appraisal_description,
                    "AppraisalValue": AppraisalValue == null ? "0.0" : AppraisalValue,
                    "AppraisalDate": appraisalDetails.createdDate,
                    "AppraisalDate": $filter('date')(new Date(appraisalDetails.createdDate), 'MM/dd/yyyy'),
                    "appraisalId": appraisalDetails.appraisalId,
                    "speedCheckSuggestedValue": (speedCheckSuggestedValue == null || speedCheckSuggestedValue == 0) ? "0.0" : speedCheckSuggestedValue,
                    "policyNumber": appraisalDetails.policyNumber,
                    "comments":appraisalDetails.comparableComment
                    

                }

               
                $(".page-spinner-bar").addClass("hide");
                //FileExtension
               
                // console.log(success.data.appraisalDataDTO);
            }, function (error) {


            });
        }
       

        // Round of 2 Decimal point
        $scope.roundOf2Decimal = roundOf2Decimal;
        function roundOf2Decimal(num) {
            if (num != null) {
                return (Math.round(num * 100) / 100).toFixed(2);
            }

            return num;
        }

        $scope.roundOfValue = roundOfValue;
        function roundOfValue(event) {
            if (angular.isDefined(event.currentTarget.value)) {
                var roundVal = roundOf2Decimal(event.currentTarget.value);
                event.currentTarget.value = roundVal;
            }
        }

        $scope.splice = splice;
        function splice(item) {

        }


        //save comparable comment
        $scope.SaveComparableComment = SaveComparableComment;
        function SaveComparableComment(){
            var details = {
                "id": sessionStorage.getItem("id"),
                "appraisalNumber": sessionStorage.getItem("appraisalNumber"),
                "comparableComment" : $scope.Appraisal.comments,
                "speedCheckUserName": sessionStorage.getItem("Name"),
            }

            var data = new FormData();

            data.append("details", angular.toJson(details));
            
            var promis = AppraisalService.UpdateAppraisal(data);

            promis.then(function (success) {

                toastr.remove();
                toastr.success("Changes have been saved!", "Success");

                $location.path('/SpeedCheckAssociateAppraisal');
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