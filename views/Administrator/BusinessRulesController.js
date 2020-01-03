angular.module('MetronicApp').controller('BusinessRulesController', function ($rootScope, $scope,
    settings, $location, $translate, $translatePartialLoader,BusinessRuleService) {

    //set language
    $translatePartialLoader.addPart('BusinessRules');
    $translate.refresh();
 
    $scope.RoleList;
    $scope.PaymentTerms;
    $scope.PaymentOptions;
    function init() {
        GetPaymantTermList();
        GetPaymantoptions();
        var getRoles = BusinessRuleService.GetRoleList();
        getRoles.then(function (success) {
            $scope.RoleList = success.data.data;
        }, function (error) {
            toastr.remove();
            toastr.error(error.data.errorMessage, "Error");
        });

       
        
    };
    init();
    //Get payment term
    function GetPaymantTermList()
    {
        var GetPaymentTerms = BusinessRuleService.GetPaymentTerms();
        GetPaymentTerms.then(function (success) {
            $scope.PaymentTerms=[];
            $scope.PaymentTerms = success.data.data;
        }, function (error) {

        });
    }
   // For payment terms
    $scope.selected = {};
    $scope.NewPaymentTerm = false;
    $scope.AddNewPaymentTerm = AddNewPaymentTerm;
    function AddNewPaymentTerm() {
        $scope.selected = {};      
        $scope.NewPaymentTerm = true;
       // $scope.EditPaymentTerm = false;
    }
    $scope.CancelPaymentTerm = CancelPaymentTerm;
    function CancelPaymentTerm() {
        $scope.NewPaymentTerm = false;
    }
    $scope.getTemplate = function (item) {
        if (!angular.isUndefined(item)) {
            if (item.id === $scope.selected.id) return 'edit';
            else
                return 'display';
        }
        else
            return 'display';
    };
    $scope.reset = function () {
        $scope.NewPaymentTerm = false;
       // $scope.EditPaymentTerm = false;
        $scope.selected = {};
    };
    $scope.EditPaymentTerms = function (item) {
        $scope.NewPaymentTerm = false;       
        $scope.selected = {};
        $scope.selected = angular.copy(item);
    }
    $scope.SavePaymentTerm = SavePaymentTerm;
    function SavePaymentTerm()
    {
        if(angular.isDefined($scope.selected.id)&& $scope.selected.id!==null)
        {
            //Update 
            var param = [
                {
                    "id": $scope.selected.id,
                    "name": $scope.selected.name,
                    "descriptions": $scope.selected.descriptions,
                    "status": $scope.selected.status
                }
            ];
            var SaveDetails = BusinessRuleService.UpdatePaymentTerm(param);
            SaveDetails.then(function (success) {
                $scope.reset();
                GetPaymantTermList();
                toastr.remove();
                toastr.success(success.data.message, "Confirmation");
               
            }, function (error) {
                toastr.remove();
                toastr.error(error.data.errorMessage, "Error");
            });
        }
        else
        {
            //Add new AddNewPaymentTerm
            var param = [
               {
                   "name": $scope.selected.name,
                   "descriptions": $scope.selected.descriptions,
                   "status": $scope.selected.status
               }
            ];
            var SaveDetails = BusinessRuleService.AddNewPaymentTerm(param);
            SaveDetails.then(function (success) {
                $scope.reset();
                GetPaymantTermList();
                toastr.remove();
                toastr.success(success.data.message, "Confirmation");

            }, function (error) {
                toastr.remove();
                toastr.error(error.data.errorMessage, "Error");
            });
        }
    }
    $scope.EnableDisablePaymentTerm = EnableDisablePaymentTerm;
    function EnableDisablePaymentTerm(item,status) {
        var param = {
            "id": item.id,
            "status": status
        };
        var SaveDetails = BusinessRuleService.ChangePaymentTermStatus(param);
        SaveDetails.then(function (success) {
            $scope.reset();
            GetPaymantTermList();
            toastr.remove();
            toastr.success(success.data.message, "Confirmation");

        }, function (error) {
            toastr.remove();
            toastr.error(error.data.errorMessage, "Error");
        });
    }
    //Sort
    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed      
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }
    $scope.sortPay = function (keyname) {
        $scope.sortKeyPay = keyname;   //set the sortKey to the param passed      
        $scope.reversepay = !$scope.reversepay; //if true make it false and vice versa
    }

    //Payment mode/options
    function GetPaymantoptions() {
        var GetPaymentOption = BusinessRuleService.GetPaymentOption();
        GetPaymentOption.then(function (successoption) {
            $scope.PaymentOptions = [];
            $scope.PaymentOptions = successoption.data.data;
        }, function (error1) {

        });
    }

    $scope.selectedPaymentOption = {};
    $scope.NewPaymentoption = false;
    $scope.AddNewPaymentOption = AddNewPaymentOption;
    function AddNewPaymentOption() {
        $scope.selectedPaymentOption = {};
        $scope.NewPaymentoption = true;
        // $scope.EditPaymentTerm = false;
    }
    
    $scope.getTemplatePay = function (item) {
        if (!angular.isUndefined(item)) {
            if (item.id === $scope.selectedPaymentOption.id) return 'edit1';
            else
                return 'display1';
        }
        else
            return 'display1';
    };
    $scope.resetPaymentOption = function () {
        $scope.NewPaymentoption = false;
        // $scope.EditPaymentTerm = false;
        $scope.selectedPaymentOption = {};
    };
    $scope.EditPaymentOption = function (item) {
        $scope.NewPaymentoption = false;   
        $scope.selectedPaymentOption = {};
        $scope.selectedPaymentOption = angular.copy(item);
    }
    $scope.SavePaymentOption = SavePaymentOption;
    function SavePaymentOption() {
        if (angular.isDefined($scope.selectedPaymentOption.id) && $scope.selectedPaymentOption.id !== null) {
            //Update 
            var param = {
                "id": $scope.selectedPaymentOption.id,
                "modeOfPayment": $scope.selectedPaymentOption.modeOfPayment,
                "description": $scope.selectedPaymentOption.description,
                "status": $scope.selectedPaymentOption.status,
                "actions": $scope.selectedPaymentOption.actions
            };
            var SaveDetails = BusinessRuleService.UpdatePaymentOption(param);
            SaveDetails.then(function (success) {
                $scope.resetPaymentOption();
                GetPaymantoptions();
                toastr.remove();
                toastr.success(success.data.message, "Confirmation");

            }, function (error) {
                toastr.remove();
                toastr.error(error.data.errorMessage, "Error");
            });
        }
        else {
            //Add new AddNewPaymentTerm
            var param = {              
                "modeOfPayment": $scope.selectedPaymentOption.modeOfPayment,
                "description": $scope.selectedPaymentOption.description,
                "status": $scope.selectedPaymentOption.status,
                "actions": true
            };
            var SaveDetails = BusinessRuleService.AddNewPaymentOption(param);
            SaveDetails.then(function (success) {
                $scope.resetPaymentOption();
                GetPaymantoptions();
                toastr.remove();
                toastr.success(success.data.message, "Confirmation");

            }, function (error) {
                toastr.remove();
                toastr.error(error.data.errorMessage, "Error");
            });
        }
    }
    $scope.EnableDisablePaymentOption = EnableDisablePaymentOption;
    function EnableDisablePaymentOption(item, status) {
        var param =
            {
                "id": item.id,
                "status": status
            };
        var SaveDetails = BusinessRuleService.ChangePaymentOptionStatus(param);
        SaveDetails.then(function (success) {
            $scope.resetPaymentOption();
            GetPaymantoptions();
            toastr.remove();
            toastr.success(success.data.message, "Confirmation");
        }, function (error) {
            toastr.remove();
            toastr.error(error.data.errorMessage, "Error");
        });
    };


    $scope.UpdateRolesAndBudget = UpdateRolesAndBudget;
    function UpdateRolesAndBudget() {
        var count = 0;
        angular.forEach($scope.RoleList, function (role) {
            var param = {
                "id": role.id,
                "description": (role.descriptions !== null && angular.isDefined(role.descriptions)) ? role.descriptions : "",
                "roleName": role.name,
                "status": true,
                "invoiceLimit": role.invoiceLimit,
                "claimLimit": role.claimLimit,
                "annualLimit": role.annualLimit
            };
            var updateRole = BusinessRuleService.updateRole(param);
            updateRole.then(function (success) {

                count++;
                if (count == $scope.RoleList.length) {
                    toastr.remove();
                    toastr.success(success.data.message, "Confirmation");
                }

            }, function (error) {

                toastr.remove();
                toastr.error(error.data.errorMessage, "Error");

            });

        });


    }
});