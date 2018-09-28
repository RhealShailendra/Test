angular.module('MetronicApp').controller('LaborCodeController', function ($rootScope,
    $scope, $location, $translate, $translatePartialLoader, LaborCodeService, AuthHeaderService) {

    $translatePartialLoader.addPart('LaborCode');
    $translate.refresh();
    
    $scope.pagesize = $rootScope.settings.pagesize;
    $scope.LaborCodeList = [];
   
    function init() {

       GetLaborCodes();
    }
    init();
    $scope.GetLaborCodes = GetLaborCodes;
    function GetLaborCodes()
    {
        var getLaborCodes = LaborCodeService.GetLaborCodes();
        getLaborCodes.then(function (success) {
            $scope.LaborCodeList = success.data.data;           
        }, function (error) {
            toastr.remove();
            toastr.error(((error !== null) ? error.data.errorMessage : AuthHeaderService.genericErrorMessage, "error"));
        });
    }

    $scope.NewLaborCode = NewLaborCode;
    function NewLaborCode() {
        sessionStorage.setItem("LaborDeatils", null);
        $location.url('NewLaborCode')
    };

    $scope.EditLaborCode = EditLaborCode;
    function EditLaborCode(item) {
        sessionStorage.setItem("LaborDeatils", JSON.stringify(item));
        $location.url('NewLaborCode');
    };

   // Change status of job code
    $scope.EnableDisbale = EnableDisbale;
    function EnableDisbale(code,flag)
    {
         
        var param =
           [ {
                "id": code.id,
                "status": flag
            }];
         
        var getLaborCodes = LaborCodeService.UpdateLaborCodeStatus(param);
        getLaborCodes.then(function (success) {
            $scope.LaborCodeList = success.data.data;
            toastr.remove();
            toastr.success(success.data.message, "Confirmation");
            $scope.GetLaborCodes();
        }, function (error) {
            toastr.remove();
            toastr.error(((error !== null) ? error.data.errorMessage : AuthHeaderService.genericErrorMessage, "error"));
        });

    }

});