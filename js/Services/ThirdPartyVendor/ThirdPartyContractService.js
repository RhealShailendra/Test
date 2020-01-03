angular.module('MetronicApp').service('ThirdPartyContractService', ['$http', '$rootScope', 'AuthHeaderService', function ($http, $rootScope, AuthHeaderService) {

    this.getContracts = function () {
        var response = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/contracts",           
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
    //API#598 Service for the vendor company to get the list of salvage contract.
    this.getSalvageContracts = function () {
        var response = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/salvage/contract",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
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

    this.getContractsDetails = function (param) {
        var response = $http({
            method: "POST",
            url: AuthHeaderService.getApiURL() + "web/contract/detail",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }

    //API#597 Service for the vendor company to get the details of the salvage contract.
    this.getSalvageContractsDetails = function (param) {
        var response = $http({
            method: "POST",
            url: AuthHeaderService.getApiURL() + "web/get/salvage/contract/details",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }

    //API#595 Service for the vendor company to update the salvage contract.
    this.UpdateSalvageContracts = function (param) {
        var response = $http({
            method: "POST",
            url: AuthHeaderService.getApiURL() + "web/salvage/update",
            data: param,
            headers: AuthHeaderService.getFileHeader()
        });
        return response;
    }
}]);