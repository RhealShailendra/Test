angular.module('MetronicApp').service('ThirdPartyContractService', ['$http', '$rootScope', 'AuthHeaderService', function ($http, $rootScope, AuthHeaderService) {

    this.getContracts = function () {       
        var response = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/contracts",
            //data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }
    //API #116
    this.getVendorList = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/company/vendors",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }
    
    this.NewContract = function (param) {
        var response = $http({
            method: "POST",
            url: AuthHeaderService.getApiURL() + "web/contract/add",
            data: param,
            headers: AuthHeaderService.getFileHeader()
        });
        return response;
    }

    this.UpdateContracts = function (param) {
        var response = $http({
            method: "POST",
            url: AuthHeaderService.getApiURL() + "web/contract/update",
            data: param,
            headers: AuthHeaderService.getFileHeader()
        });
        return response;
    }
    this.DeleteContracts = function (param) {
        var response = $http({
            method: "DELETE",
            url: AuthHeaderService.getApiURL() + "web/contract/delete",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    //Get Email Templates
    this.GetEmailTemplatesList = function () {      
        var response = $http({
            method: "Get",         
            url: AuthHeaderService.getApiURL() + "web/email/templates",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
    this.GetEmailTemplatesDetails = function (param) {
        var response = $http({
            method: "POST",         
            url: AuthHeaderService.getApiURL() + "web/email/template/details",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }
    
    this.getContractsDetails = function (param) {
        var response = $http({
            method: "POST",
            url: AuthHeaderService.getApiURL() + "web/contract/detail",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }
}]);