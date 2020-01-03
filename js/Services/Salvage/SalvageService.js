angular.module('MetronicApp').service('SalvageService', ['$http', 'AuthHeaderService', function ($http, AuthHeaderService) {

    this.GetPolishList = function () {
        var response = $http({
            method: "GET",
            url: AuthHeaderService.getApiURL() + "web/stone/polish",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
    this.GetSymmetryList = function () {
        var response = $http({
            method: "GET",
            url: AuthHeaderService.getApiURL() + "web/stone/symmetry",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
    this.GetFluorescenceList = function () {
        var response = $http({
            method: "GET",
            url: AuthHeaderService.getApiURL() + "web/stone/fluorescence",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    this.GetMetalTypeList = function () {
        var response = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/metal/type",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
    this.GetMetalColorList = function () {
        var response = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/metal/color",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
    this.GetStoneTypeList = function () {
        var response = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/stone/type",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    this.GetStoneColorList = function () {
        var response = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/stone/color",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    this.GetStoneShapeList = function () {
        var response = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/stone/shape",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
    this.GetStoneClarityList = function () {
        var response = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/stone/clarity",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    this.GetPolicyHolderDetails = function (param) {
        var response = $http({
            method: "post",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/policy/info",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    this.AddGemstone = function (param) {
        var response = $http({
            method: "post",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/add/gemstone/salvage/details",
            headers: AuthHeaderService.getFileHeader()
        });
        return response;
    };
    this.UpdateGemstone = function (param) {
        var response = $http({
            method: "post",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/update/gemstone/salvage/details",
            headers: AuthHeaderService.getFileHeader()
        });
        return response;
    };
    this.GetSalvageDetails = function (param) {
        var response = $http({
            method: "post",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/claimitem/salvage/details",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    //API#621 Service for save or update diamond salvage
    this.AddDiamondSalvage = function (param) {
        var response = $http({
            method: "post",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/add/diamond/salvage",
            headers: AuthHeaderService.getFileHeader()
        });
        return response;
    };
    //API#622 Service for get details of  diamond item salvage
    this.GetDiamondSalvageDetails = function (param) {
        var response = $http({
            method: "post",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/get/diamond/salvage/details",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    //API#613 Service for the vendor company to create salvage for the finished item.
    this.AddFinishedSalvageSalvage = function (param) {
        var response = $http({
            method: "post",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/add/finished/salvage",
            headers: AuthHeaderService.getFileHeader()
        });
        return response;
    };
    //API#615 Service for the vendor company to get the details of the salvage finished item.
    this.GetFinishedItemSalvageDetails = function (param) {
        var response = $http({
            method: "post",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/get/finishitem/salvage/details",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
    //API#614 Service for the vendor company to update the salvage for the finished item.
    this.UpdateFinishedItem = function (param) {
        var response = $http({
            method: "post",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/update/finished/salvage",
            headers: AuthHeaderService.getFileHeader()
        });
        return response;
    };

    //API#604 service to add luxury watch salvage  
    this.AddluxuryWatchSalvage = function (param) {
        var response = $http({
            method: "post",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/add/luxurywatch/salvage",
            headers: AuthHeaderService.getFileHeader()
        });
        return response;
    };
    //API#606 service to get details of salvage item detail of luxury watch
    this.GetLuxuryWatchSalvageDetails = function (param) {
        var response = $http({
            method: "post",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/get/salvage/item/details",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
    //API#612 Service to update luxury watch salvary item detail
    this.UpdateluxuryWatchSalvage = function (param) {
        var response = $http({
            method: "post",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/update/luxurywatch/salvage",
            headers: AuthHeaderService.getFileHeader()
        });
        return response;
    };

    //API#619
    this.GetSalvageList = function (param) {
        var response = $http({
            method: "post",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/company/salvage/item/list",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
    

    this.UpdateSalvage = function (param) {
        var response = $http({
            method: "post",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/update/item/salvage/details",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    this.GetSalvageProfile = function () {
        var response = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/salvage/profile",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    this.GetDropDownDetails = function (param) {
        var response = $http({
            method: "post",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/salvage/dropdown/items",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    
}]);