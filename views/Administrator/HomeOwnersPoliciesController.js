angular.module('MetronicApp').controller('HomeOwnersPoliciesController', function ($rootScope, $scope, settings, $http, $uibModal, $timeout, $location, $translate, $translatePartialLoader, HomeOwenerPolicyService) {

    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    $translatePartialLoader.addPart('HomeOwnersPolicies');
    $translate.refresh();
    $scope.ErrorMessage = "";
    $scope.pagesize = $rootScope.settings.pagesize;
    $scope.AddHOPolicyShow;
    $scope.HOPolicy;
    $scope.HOPolicyList = [];
    $scope.FilterList = [];
    $scope.Category = [];
    $scope.init = init;
    $scope.PolicyTypeDetails;
    $scope.categoryList = [];
    $scope.selected = {
        StateId:"0"
    };
    function init() {
        $scope.Show = false;
        $scope.AddHOPolicyShow = false;
        $scope.HOPolicy = true;
        GetPOlicyType();
        var GetCategory = HomeOwenerPolicyService.getCategory();
        GetCategory.then(function (success) { $scope.Category = success.data.data; $scope.categoryList = success.data.data.categories; }, function (error) { });

        getState();
    }
    $scope.init();

    $scope.Remove = function (index) {
        $scope.categoryList.splice(index, 1)
    };

    $scope.AddCategory = function () {
        var CategoryObj = {
            "categoryId": '',
            "categoryName": '',
            "coverageLimit": '',
            "deductible": '',
            "description": '',
            "isDelete": ''
        };
       
        if ($scope.categoryList !== null && $scope.categoryList.length > 0)
            $scope.categoryList.splice(0, 0, CategoryObj)
        else {
            $scope.categoryList = [];
            $scope.categoryList.push(CategoryObj);
        }
    }

    $scope.AddHOPolicy = AddHOPolicy;
    function AddHOPolicy() {
        $scope.PolicyTypeDetails = {};
        $scope.categoryList = [];
        $scope.AddHOPolicyShow = true;
        $scope.HOPolicy = false;

    }
    $scope.EditHOPolicy = EditHOPolicy;
    function EditHOPolicy(item) {
        $(".page-spinner-bar").removeClass("hide");
        var param = { "id": item.id };
      
        var GetDetails = HomeOwenerPolicyService.GetPolicyTypeDetails(param);
        GetDetails.then(function (success) {
           
            $(".page-spinner-bar").addClass("hide");
            $scope.PolicyTypeDetails = success.data.data[0];
            $scope.categoryList = success.data.data[0].policyTypeCategories;
            $scope.AddHOPolicyShow = true;
            $scope.HOPolicy = false;
           $scope.selected.stateId = $scope.PolicyTypeDetails.state.id;
        }, function (error) {
            $(".page-spinner-bar").addClass("hide");

        });

    }

    $scope.BtnBackClick = BtnBackClick;
    function BtnBackClick() {

        $scope.AddHOPolicyShow = false;
        $scope.HOPolicy = true;

    }

    $scope.Save = Save;
    function Save() {
        $scope.catList = [];
        angular.forEach($scope.categoryList, function (item) {
            $scope.catList.push(
                {
                    "categoryId": item.categoryId,
                    "categoryName": null,
                    "coverageLimit": item.coverageLimit,
                    "deductible": null,
                    "description": null,
                    "isDelete": null
                }
               )
        });
       
        var param = {
            "description": $scope.PolicyTypeDetails.description,
            "id": $scope.PolicyTypeDetails.id,
            "policyTypeCategories":  $scope.catList,
            "totalCoverage": $scope.PolicyTypeDetails.totalCoverage,
            "totalDeductible": $scope.PolicyTypeDetails.totalDeductible,
            "typeName": $scope.PolicyTypeDetails.typeName,
            "state": {
                "id": $scope.selected.stateId
            },
        };
         
        var savePolicyType = HomeOwenerPolicyService.SavePolicyType(param);
        savePolicyType.then(function (success) {
            GetPOlicyType();
            $scope.BtnBackClick();
            toastr.remove();
            toastr.success(success.data.message, "Confirmation");
        }, function (error) {
            toastr.remove()
            if (angular.isDefined(error.data) && error.data !== null)
                toastr.error(error.data.errorMessage, "Error");
            else
                toastr.error("Failed to save policy type details. Please try again..", "Error");
        });
    }

    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

    $scope.Delete = Delete;
    function Delete(item, index) {

        bootbox.confirm({
            size: "",
            title: $translate.instant('Delete'),
            message: $translate.instant('Are you sure to delete policy type?'), closeButton: false,
            className: "modalcustom", buttons: {
                confirm: {
                    label: $translate.instant('Yes'),
                    className: 'btn-success'
                },
                cancel: {
                    label: $translate.instant('No'),
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                //if (result) {
                //    var PolictType = {
                //        "taskId": item.id
                //    };
                //    var DeleteFrom = HomeOwenerPolicyService.DeletePolicyType(PolictType);
                //    DeleteFrom.then(function () {
                //        $scope.HOPolicyList.splice(index, 1);
                //        toastr.remove()
                //        toastr.success("Policy type deleted successfully.", "Confirmation");
                //    }, function (error) {
                //        toastr.remove()
                //        if (angular.isDefined(error.data) && error.data !== null)
                //            toastr.error(error.data.errorMessage, "Error");
                //        else
                //            toastr.error("Failed to delete the policy type. Please try again..", "Error");
                //    });
                //}
                toastr.remove()
                toastr.success("Need API to delete policy type.", "Confirmation");
            }
        });

    }
    function GetPOlicyType() {
        var GetPolicyType = HomeOwenerPolicyService.getPolicytype();
        GetPolicyType.then(function (success) { $scope.HOPolicyList = success.data.data; $scope.FilterList = success.data.data; }, function (error) { });
    }
    $scope.GotoDashboard = function () {
        $location.url(sessionStorage.getItem('HomeScreen'));
    }


    function getState() {
        var param =       
                {
                  "isTaxRate": false,
                  "isTimeZone": false
            };
        var getState = HomeOwenerPolicyService.getState(param);
        getState.then(function (success) {
             
            $scope.stateList = success.data.data;
        }, function (error) {

        });
    };

    $scope.GetByState = GetByState;
    function GetByState() {
        var a = $scope.selected.StateId;
        if (a === "0")
        {
            $scope.HOPolicyList = $scope.FilterList;
        }
        else {
            var param =
                 {
                     "state": {
                         "id": a // state id
                     }
                 };

            var getPolicyByState = HomeOwenerPolicyService.filterByState(param);
            getPolicyByState.then(function (success) {
                $scope.HOPolicyList = success.data.data;
            }, function (error) {
                
            });
        }
        
    }
});