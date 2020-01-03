angular.module('MetronicApp').controller('NewLaborCodeController', function ($rootScope,
    $scope, $translate, $translatePartialLoader,$location, LaborCodeService) {

    $translatePartialLoader.addPart('LaborCode');
    $translate.refresh();
    $scope.LaborCode = {};
    $scope.StatusList = [{ id: true, name: "Active" }, { id: false, name: "In-Active" }]

    function init() {
        var laborData = (sessionStorage.getItem("LaborDeatils"));
        if (laborData !== "null" && angular.isDefined(laborData)) {
            $scope.LaborCode = JSON.parse(laborData);
        };
         
    }
    init();

    $scope.Cancel = function () {
        $scope.LaborCode = {};
        $location.url('LaborCode');
    };

    $scope.CreateUpdateLaborCode = CreateUpdateLaborCode;
    function CreateUpdateLaborCode() {
         
        //Edit
        if (angular.isDefined($scope.LaborCode.id) && $scope.LaborCode.id != null) {
            var param ={
                "id":$scope.LaborCode.id,
                "code":$scope.LaborCode.code,
                "jobName":$scope.LaborCode.jobName,
                "description":$scope.LaborCode.description,
                "price":$scope.LaborCode.price,
                "status":$scope.LaborCode.status
            }
          
             
            var UpdateDepartment = LaborCodeService.UpdateLaborCode(param);
            UpdateDepartment.then(function (success) {
                toastr.remove();
                toastr.success(success.data.meaage, "Confirmation");
                $scope.Cancel();
            }, function (error) {
                toastr.remove();
                toastr.error(((error !== null) ? error.data.errorMessage : AuthHeaderService.genericErrorMessage, "error"));
            });
        }
            //Add
        else {

            var param = {
                "code": $scope.LaborCode.code,
                "jobName": $scope.LaborCode.jobName,
                "description": $scope.LaborCode.description,
                "price": $scope.LaborCode.price,
                "status": true
            };
             
            var AddDepartment = LaborCodeService.AddLaborCode(param);
            AddDepartment.then(function (success) {
                toastr.remove();
                toastr.success(success.data.meaage, "Confirmation");
                $scope.Cancel();
            }, function (error) {
                toastr.remove();
                toastr.error(((error !== null) ? error.data.errorMessage : AuthHeaderService.genericErrorMessage, "error"));
            });
        }

    }



});