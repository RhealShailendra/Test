angular.module('MetronicApp').service('NewClaimService', ['$http', '$rootScope', 'AuthHeaderService', function ($http, $rootScope, AuthHeaderService) {
    
    //API #440
    this.UpdatePolicyDetails = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/adjuster/update/policy",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
    
   
    //Get policy holder info on email
    this.GetPolicyHolderDetails = function (param) { //api 184
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/policyholder/info",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }


    //API #424
    this.AddPolicyDetails = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/adjuster/create/policy",//"web/create/policy",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };


    //get all states #123
    this.getStates = function (param) {

        var response = $http({
            method: "post",
            url: AuthHeaderService.getApiURL() + "web/states",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    //get Policy Type
    this.getPolicyType = function () {
        var response = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/policytypes ",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    //List with check sign
    this.GetCategoriesHomeAppliance = function () {
        var response = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/categories",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    //Get list of policy for account no
    this.GetListOfPolicyForAccNo = function (param) {
        var GetPolicyList = $http({
            method: "POST",
            url: AuthHeaderService.getApiURL() + "web/insurance/info",
            headers: AuthHeaderService.getHeader(),
            data: param
        });
        return GetPolicyList;
    };

    //Policy details if exists
    this.GetPolicyAndClaimDetails = function (param) { //api 122
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/policy/info",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };


    //Get damage types 26
    this.getDamageType = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/property/damagetypes",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
    //Get subCategory
    this.GetSubCategory = function (param) {
        var respSubCat = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/item/subcategories",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return respSubCat;
    }; 

    //Save claim details
    this.SaveClaimandReportDetails = function (param) {
        var respSubCat = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/adjuster/create/claim",
            data: param,
            headers: AuthHeaderService.getFileHeader()
        });
        return respSubCat;
    };

    //Update claim details
    this.UpdateClaimandReportDetails = function (param) {
        var respSubCat = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/adjuster/update/claim",
            data: param,
            headers: AuthHeaderService.getFileHeader()
        });
        return respSubCat;
    };
    //Update claim details
    this.UpdateClaimandReportDetails = function (param) {
        var respSubCat = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "",
            data: param,
            headers: AuthHeaderService.getFileHeader()
        });
        return respSubCat;
    };

    this.getPostLostItemsWithComparables = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/claim/line/items",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    //Post loss
    this.AddPostLossItem = function (param) {
        var AddPostLoss = $http({
            method: "Post",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/add/itemtopostloss",
            headers: AuthHeaderService.getFileHeader()
        });
        return AddPostLoss;
    };

    this.UpdatePostLoss = function (param) {
        var UpdatePostLoss = $http({
            method: "post",
            url: AuthHeaderService.getApiURL() + "web/claim/update/postlossitem",
            data: param,
            headers: AuthHeaderService.getFileHeader()
        });
        return UpdatePostLoss;
    }
}]);