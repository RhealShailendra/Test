angular.module('MetronicApp').service('AddNewClaimAssociateService', ['$http', '$rootScope', 'AuthHeaderService', function ($http, $rootScope, AuthHeaderService) {
    //GetAssociate List
    this.GetAssociateDetails = function (param) {
        var AssociateDetails = $http({
            method: "Post", url: AuthHeaderService.getApiURL() + "web/employee/details",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return AssociateDetails;
    }

    this.GetStates = function (param) {
        var AssociateDetails = $http({
            method: "post", url: AuthHeaderService.getApiURL() + "web/states",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return AssociateDetails;
    }
    this.GetEmployeeList = function (param) {
        var data = $http({
            method: "Get",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/vendor/employees",
            headers: AuthHeaderService.getHeader()
        });
        return data;
    }

    this.GetReportingManger = function (param) {
        var AssociateDetails = $http({
            method: "Post", url: AuthHeaderService.getApiURL() + "web/company/reportingmanagers",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return AssociateDetails;
    }

    this.GetDesignation = function () {
        var AssociateDetails = $http({
            method: "get", url: AuthHeaderService.getApiURL() + "web/designation",
            headers: AuthHeaderService.getHeader()
        });
        return AssociateDetails;
    }

    this.addClaimAssociate = function (param) {
        var AssociateDetails = $http({
            method: "post", url: AuthHeaderService.getApiURL() + "web/manage/associate",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return AssociateDetails;
    }; 

    this.GetRoleList = function () {
        var AssociateDetails = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/roles",
            headers: AuthHeaderService.getHeader()
        });
        return AssociateDetails;
    };

    
    this.UpdateEmployee = function (param) {
        var AssociateDetails = $http({
            method: "post", url: AuthHeaderService.getApiURL() + "web/update/employee/details",
            data: param,
            headers: AuthHeaderService.getFileHeader()
        });
        return AssociateDetails;
    };

    this.GetDepartmentist = function () {
        var Departments = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/get/vendor/departments",
            headers: AuthHeaderService.getHeader()
        });
        return Departments;
    };

    this.GetSpecialtiesList = function () {
        var SpecialtiesList = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/speedcheck/get/specialties/list",
            headers: AuthHeaderService.getHeader()
        });
        return SpecialtiesList;
    };

}]);