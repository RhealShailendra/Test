angular.module('MetronicApp').controller('WorkflowManagementController', function ($rootScope, $scope, $filter, $location, ThirdPartyVendorAdministrationService,
    $translate, $translatePartialLoader, WorkflowManagementService) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });

    //set language
    $translatePartialLoader.addPart('WorkflowManagement');
    $translate.refresh();
    $scope.PageSize = $rootScope.settings.pagesize;
    $scope.CurrentTab = 'ClaimWorkflow';
    $scope.StatusList;
    $scope.VendorWrokflows;
    $scope.VendorWorkflowDetailsList;
    $scope.VendorId = sessionStorage.getItem("VendorId");

    function init() {
        //Get Vendor Workflow status list
        var GetVendorStatusList = WorkflowManagementService.GetVendorStatusList();
        GetVendorStatusList.then(function (success) {         
            $scope.StatusList = success.data.data;           
        }, function (error) {

        });
        //Get Vendor WorkFlows
        var param =
            {
                "id": $scope.VendorId  //vendor id               
            };
        var GetVendorWorkFlows = WorkflowManagementService.GetVendorWorkFlows(param);
        GetVendorWorkFlows.then(function (success) {
            $scope.VendorWrokflows = success.data.data;
        }, function (error) {

        });
    };

    init();
    $scope.GoToHome = function () {
        $location.url(sessionStorage.getItem('HomeScreen'));
    };
    // Stages for Quote Only Cliam Assignments
    $scope.QuoteOnlyClaim = {
        Stages:[]
    };
    $scope.AddQuoteOnlyClaimStage = function () {
        $scope.QuoteOnlyClaim.StageNumber = $scope.QuoteOnlyClaim.Stages.length + 1;
        $scope.QuoteOnlyClaim.Stages.push({ StageNo: $scope.QuoteOnlyClaim.StageNumber, StepName: "Stage - " + $scope.QuoteOnlyClaim.StageNumber, Substages: [{ id: "" }] });
       
    };    
    $scope.RemoveQuoteOnlyClaimStage = function () {
        var StageNumber = $scope.QuoteOnlyClaim.Stages.length - 1;
        $scope.QuoteOnlyClaim.Stages.splice(StageNumber, 1);
    };

    $scope.AddQuoteOnlyClaimSubStage = function (stage) {
        stage.Substages.push({ id: "" });
    };
    $scope.RemoveQuoteOnlyClaimSubStage = function (stage, index) {
        stage.Substages.splice(index, 1);
    };
    $scope.AddVendorStage = AddVendorStage;
    function AddVendorStage(stage) {
         
        //Get Vendor WorkFlows
        var param =
            {
                "vendor": {
                    "vendorId": $scope.VendorId
                },
                "vendorWorkflow": {
                    "id": $scope.GetWorkflowId()
                },
                "stages": [
                  {
                      "stageNumber": 3,
                      "statusList": [
                        {
                            "id": 3
                        }
                      ]
                  }
                ]
            }
        var AddVendorStages = WorkflowManagementService.AddVendorStages(param);
        AddVendorStages.then(function (succcess) {
            toastr.remove();
            toastr.success(succcess.data.message, "Confirmation");
        }, function (error) {
            toastr.remove();
            toastr.success(((error.data !== null) ? error.data.errorMessage : "Can not able to add vendor stage "), "Error");
        });
    };

    $scope.GetWorkflowId = GetWorkflowId;
    function GetWorkflowId() {
        return $scope.VendorWrokflows;
    };


    $scope.DeleteVendorStage = DeleteVendorStage;
    function DeleteVendorStage(stage) {
        var param = {
            "vendor": {
                "vendorId": $scope.VendorId
            },
            "vendorWorkflow": {
                "id": 9
            },
            "stages": [
              {
                  "stageNumber": 2,
                  "isDelete": true
              }
            ]
        };

        var DeleteVendorStages = WorkflowManagementService.DeleteVendorStages(param);
        DeleteVendorStages.then(function (succcess) {
            toastr.remove();
            toastr.success(succcess.data.message, "Confirmation");
        }, function (error) {
            toastr.remove();
            toastr.success(((error.data !== null) ? error.data.errorMessage : "Can not able to delete vendor stage "), "Error");
        });
    }
    // End Stages for Quote Only Cliam Assignments

    $scope.ItemStages = [];
    $scope.AddItemStage = function () {
        var StageNumber = $scope.ItemStages.length + 1;

        $scope.ItemStages.push({ StepName: "Stage - " + StageNumber, Substages: [{ Name: "" }] });

    };
    $scope.RemoveItemStage = function () {

        var StageNumber = $scope.ItemStages.length - 1;
        $scope.ItemStages.splice(StageNumber, 1);
    };

    $scope.AddItemSubstage = function (stage) {
        stage.Substages.push({ Name: "" });
    };
    $scope.RemoveItemSubstage = function (stage, index) {
        stage.Substages.splice(index, 1);
    };

    $scope.AddItemSatge = function () {
        var param = {
            "vendor": {
                "vendorId": 27629
            },
            "stages": [

             {
                 "stageNumber": 1,
                 "statusList": [
                   {
                       "id": 1
                   },
                   {
                       "id": 2
                   }
                 ]
             }
            ]
        };

        var addItemStage = WorkflowManagementService.AddUpdateVendorItemStage();
        addItemStage.then(function (succcess) { }, function (error) { });
    };

  


    //Stages for Replacement Cliam Assignments
    $scope.Stages1 = [];
    $scope.AddNewStage1 = function () {
        var StageNumber1 = $scope.Stages1.length + 1;

        $scope.Stages1.push({ StepName1: "Stage - " + StageNumber1, Substages1: [{ Name: "" }] });

    };
    $scope.RemoveStage1 = function () {

        var StageNumber1 = $scope.Stages1.length - 1;
        $scope.Stages1.splice(StageNumber1, 1);
    };

    $scope.AddSubstage1 = function (stage) {
        stage.Substages1.push({ Name: "" });
    };
    $scope.RemoveSubstage1 = function (stage, index) {
        stage.Substages1.splice(index, 1);
    };


    $scope.ItemStages1 = [];
    $scope.AddItemStage1 = function () {
        var StageNumber1 = $scope.ItemStages1.length + 1;

        $scope.ItemStages1.push({ StepName1: "Stage - " + StageNumber1, Substages1: [{ Name: "" }] });

    };
    $scope.RemoveItemStage1 = function () {

        var StageNumber1 = $scope.ItemStages1.length - 1;
        $scope.ItemStages1.splice(StageNumber1, 1);
    };

    $scope.AddItemSubstage1 = function (stage) {
        stage.Substages1.push({ Name: "" });
    };
    $scope.RemoveItemSubstage1 = function (stage, index) {
        stage.Substages1.splice(index, 1);
    };

    $scope.AddItemSatge1 = function () {
        var param = {
            "vendor": {
                "vendorId": 27629
            },
            "stages": [

             {
                 "stageNumber": 1,
                 "statusList": [
                   {
                       "id": 1
                   },
                   {
                       "id": 2
                   }
                 ]
             }
            ]
        };

        var addItemStage1 = WorkflowManagementService.AddUpdateVendorItemStage();
        addItemStage1.then(function (succcess) { }, function (error) { });
    };

    //End Stages for Replacement Cliam Assignments



    //Stages for Salvage/Full Evaluation Cliam Assignments
    $scope.Stages2 = [];
    $scope.AddNewStage2 = function () {
        var StageNumber2 = $scope.Stages2.length + 1;

        $scope.Stages2.push({ StepName2: "Stage - " + StageNumber2, Substages2: [{ Name: "" }] });

    };
    $scope.RemoveStage2 = function () {

        var StageNumber2 = $scope.Stages2.length - 1;
        $scope.Stages2.splice(StageNumber2, 1);
    };

    $scope.AddSubstage2 = function (stage) {
        stage.Substages2.push({ Name: "" });
    };
    $scope.RemoveSubstage2 = function (stage, index) {
        stage.Substages2.splice(index, 1);
    };


    $scope.ItemStages2 = [];
    $scope.AddItemStage2 = function () {
        var StageNumber2 = $scope.ItemStages2.length + 1;

        $scope.ItemStages2.push({ StepName2: "Stage - " + StageNumber2, Substages2: [{ Name: "" }] });

    };
    $scope.RemoveItemStage2 = function () {

        var StageNumber2 = $scope.ItemStages2.length - 1;
        $scope.ItemStages2.splice(StageNumber2, 1);
    };

    $scope.AddItemSubstage2 = function (stage) {
        stage.Substages2.push({ Name: "" });
    };
    $scope.RemoveItemSubstage2 = function (stage, index) {
        stage.Substages2.splice(index, 1);
    };

    $scope.AddItemSatge2 = function () {
        var param = {
            "vendor": {
                "vendorId": 27629
            },
            "stages": [

             {
                 "stageNumber": 1,
                 "statusList": [
                   {
                       "id": 1
                   },
                   {
                       "id": 2
                   }
                 ]
             }
            ]
        };

        var addItemStage2 = WorkflowManagementService.AddUpdateVendorItemStage();
        addItemStage2.then(function (succcess) { }, function (error) { });
    };

    //End Stages for Salvage/Full Evaluation Cliam Assignments


    


    $scope.AddWorkflowWithService = AddWorkflowWithService;
    function AddWorkflowWithService() {

        var AddWorkflowWithContentService = WorkflowManagementService.AddWorkflowWithContentService(param);
        AddWorkflowWithContentService.then(function (succcess) {
            toastr.remove();
            toastr.success(succcess.data.message, "Confirmation");
        }, function (error) {
            toastr.remove();
            toastr.success(((error.data !== null) ? error.data.errorMessage : "Can not able to add workflow "), "Error");
        });
    };

    $scope.UpdateWorkflowWithService = UpdateWorkflowWithService;
    function UpdateWorkflowWithService() {
        var UpdateWorkflowWithContentService = WorkflowManagementService.UpdateWorkflowWithContentService(param);
        UpdateWorkflowWithContentService.then(function (succcess) {
            toastr.remove();
            toastr.success(succcess.data.message, "Confirmation");
        }, function (error) {
            toastr.remove();
            toastr.success(((error.data !== null) ? error.data.errorMessage : "Can not able to update workflow  "), "Error");
        });
    }






});