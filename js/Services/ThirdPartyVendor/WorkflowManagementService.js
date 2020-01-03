angular.module('MetronicApp').service('WorkflowManagementService', ['$http', '$rootScope', 'AuthHeaderService', function ($http, $rootScope, AuthHeaderService) {

    //API #29
    this.AddUpdateVendorItemStage = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/items/vendor/stage",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    //API #29
    this.GetVendorItemStage = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/items/vendor/stage/list",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    //API #423 to get vendor status list
    this.GetVendorStatusList = function () {
        var response = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/vendor/workflow/status",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    //API #420 to get Vendor Workflows
    this.GetVendorWorkFlows = function (param) {
        var response = $http({
            method: "post",
            data:param,
            url: AuthHeaderService.getApiURL() + "web/vendor/workflows",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    //API #374 Service to add vendor stages with statuses
    this.AddVendorStages = function (param) {
        var response = $http({
            method: "post",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/claim/vendor/stage",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    //API #422 Service to delete vendor  stage
    this.DeleteVendorStages = function (param) {
        var response = $http({
            method: "Delete",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/delete/workflow/stage",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    //API #418 Service to add Workflow with content service
    this.AddWorkflowWithContentService = function (param) {
        var response = $http({
            method: "post",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/add/workflow",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    //API #419 Service to update Workflow with content service
    this.UpdateWorkflowWithContentService = function (param) {
        var response = $http({
            method: "post",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/update/workflow",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
}]);